const express = require('express');
const router = require('./router');

const app = express();
const PORT = 5000;

// Configure JSON body parsing middleware
app.use(express.json());

// Use router for handling routes
app.use('/api', router);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

console.log('Server initialized.'); // Added console log here
