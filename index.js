const express = require('express');
const app = express();
const port = 80;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Create an HTTP server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});