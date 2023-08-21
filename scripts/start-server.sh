#!/bin/bash

# Start the server
cd /var/www/myapp

# Define log file paths
OUT_LOG="/tmp/app.out.log"
ERR_LOG="/tmp/app.err.log"

# Print a starting log entry
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "[$TIMESTAMP] Starting the server..."

# Run the Node.js application in the background
sudo nohup node index.js >> "$OUT_LOG" 2>> "$ERR_LOG" &

# Print a log entry indicating the server has started
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "[$TIMESTAMP] Server started successfully."