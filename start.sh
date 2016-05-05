#!/bin/bash

mode = $1

echo Alice app starts
echo Pull from repository
git pull
echo NPM install call
npm install

echo Setting mode
NODE_ENV = $mode

echo Starting nodemon
nodemon app.js
