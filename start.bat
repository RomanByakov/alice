@echo off
echo Alice app starts

echo Pull from repository
git pull

echo NPM install call
call npm install --loglevel=error

echo Setting mode
set NODE_ENV=%1

echo Starting nodemon
nodemon app.js
