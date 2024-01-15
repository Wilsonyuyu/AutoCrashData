#!/bin/bash

killall node

cd /var/www/myapp
sudo rm -rf ./*
sudo rm -rf node_modules
sudo npm cache clean --force


