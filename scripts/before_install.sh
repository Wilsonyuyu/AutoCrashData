#!/bin/bash

killall node

rm -rf cd /var/www/myapp/node_modules

cd /var/www/myapp

npm install