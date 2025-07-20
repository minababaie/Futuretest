// 1. Import required packages
const express = require('express');
const bodyParser = require('body-parser');

// 2. Create an Express application
const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON bodies from Dialogflow

// 3. Define the response dictionary (database simulation)
const responseMap = {
    'Sealing': 'Sealing machines are used to package containers with a plastic film. We have various models like tabletop and automatic. Which one are you interested in?',
    'Cutter': 'Cutter machines are used for precise and fast cutting of various materials in the packaging industry.',
    '3D Printer': 'Dental 3D printers are used to create precise dental models, temporary crowns, and surgical guides using special resins.',
    'Default': "I'm sorry, I couldn't find the category you mentioned. You can try asking about 'Sealing', 'Cutter', or '3D Printer'."
};

// 4. Define the webhook endpoint that Dialogflow will call
app.post('/webhook', (req, res) => {
    
    // Log the incoming request for debugging purposes
    console.log('Received a request from Dialogflow.');
    // console.log('Full request body:', JSON.stringify(req.body, null, 2)); // Uncomment for detailed logging

    try {
        // Extract the intent name from the Dialogflow request
        const intentName = req.body.queryResult.intent.displayName;
        let responseText = '';

        // Check if the intent is the one we want to handle
        if (intentName === 'inquireCategory') {
            // Extract the 'product_category' parameter value
            const category = req.body.queryResult.parameters.product_category;
            console.log(`Intent: ${intentName}, Parameter: ${category}`);

            // Find the appropriate response from our map, or use the default
            responseText = responseMap[category] || responseMap['Default'];
        } else {
            // Handle any other intents with a generic response
            responseText = "I am not designed to respond to this query.";
        }
        
        // 5. Construct the JSON response in the format Dialogflow expects
        const jsonResponse = {
            fulfillmentText: responseText
        };

        // 6. Send the response back to Dialogflow
        return res.json(jsonResponse);

    } catch (error) {
        console.error('Error processing webhook request:', error);
        // Send an error response back to Dialogflow if something goes wrong
        return res.status(400).json({
            fulfillmentText: 'There was an error processing the request. Please try again later.'
        });
    }
});

// A simple GET route to test if the server is running
app.get('/', (req, res) => {
    res.send('Dialogflow webhook server is alive and running!');
});

// 7. Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
