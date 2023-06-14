const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const port = 3033;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Load the SSL certificate files
const options = {
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('certificate.crt')
};

// Create an HTTPS server with the SSL certificate
const server = https.createServer(options, app);

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});