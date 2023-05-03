const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Set up body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/test", (req, res) => {
    res.send("Ok");
})

// Define a route to receive the webhook event
app.post('/webhook', (req, res) => {
    // Extract the event type from the headers
    const eventType = req.headers['x-github-event'];

    // Handle the event based on its type
    switch (eventType) {
        case 'push':
            // Handle the push event
            console.log('Push event received');
            // Call your function to run the tests and upload the report
            runTestsAndUploadReport();
            break;
        case 'pull_request':
            // Handle the pull request event
            console.log('Pull request event received');
            break;
        // Add cases for other event types as needed
        default:
            // Handle unknown event types
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

// Define the function to run the tests and upload the report
function runTestsAndUploadReport() {
    // Call your function to run the tests and upload the report
    // ...
}