#!/bin/bash

cd /var/www/myapp
sudo rm -rf node_modules
sudo npm cache clean --force
sudo npm install

