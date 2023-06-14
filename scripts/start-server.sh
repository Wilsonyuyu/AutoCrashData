#!/bin/bash
# Start the server
cd /var/www/myapp
node index.js > app.out.log 2> app.err.log < /dev/null &