const express = require('express');
const bodyParser = require('body-parser');
const { Octokit } = require("@octokit/rest");
const { exec } = require("child_process");
const app = express();

// Set up body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const octokit = new Octokit({
    auth: "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"
});

app.get("/test", (req, res) => {
    console.log(req);
    res.send("OK 1");
})

// Define a route to receive the webhook event
app.post('/github', (req, res) => {
    // Extract the event type from the headers
    const eventType = req.headers['X-GitHub-Event'];

    // Handle the event based on its type
    switch (eventType) {
        case 'create':
            console.log('Branch created');
            runTestsAndUploadReport();
            break;
        case 'delete':
            console.log('Branch deleted');

            // Handle the pull request event
            break;
        default:
            console.log(`Unknown event type "${eventType}" received`);
    }

    // Send a response to the webhook event
    res.send('Webhook received');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

function runTestsAndUploadReport() {
    // Set owner and repo for running tests
    const testOwner = "DIKUGroup6";

    const testRepo = "DIKUGames";

    const testFolder = "BreakoutTests";

    // Set owner and repo for uploading reports
    const reportOwner = "DIKUGroup6";
    const reportRepo = "dikugroup6.github.io";
    const reportPath = "reports";

    // Navigate to BreakoutTests folder
    const command = `cd DIKUGames/${testFolder} && dotnet test --collect:"XPlat Code Coverage"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`dotnet test error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`dotnet test stderr: ${stderr}`);
            return;
        }
        console.log(`dotnet test stdout: ${stdout}`);
    })
}
