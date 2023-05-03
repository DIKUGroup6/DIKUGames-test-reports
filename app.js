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

// Replace with your repository details
const owner = "simonsejse";
const repo = "DIKUGroup6";


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
    // Navigate to BreakoutTests folder
    const folder = "DIKUGroup6/BreakoutTests";
    const command = `cd ${folder} && dotnet test --collect:"XPlat Code Coverage"`;

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

        // Upload coverage report
        const reportCommand = `cd ${folder} && reportgenerator -reports:$(gci TestResults -r -fi coverage.cobertura.xml | % { $_.FullName }) -targetdir:Report -reporttypes:Html`;

        exec(reportCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`reportgenerator error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`reportgenerator stderr: ${stderr}`);
                return;
            }
            console.log(`reportgenerator stdout: ${stdout}`);

            // Upload report files to GitHub
            const files = [
                { name: "index.html", path: "./DIKUGroup6/BreakoutTests/Report/index.html" },
                // Add other report files here
            ];
            const commitMessage = "Upload test coverage report";
}
