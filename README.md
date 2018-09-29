# node-game
Online multiplayer survival game made using Javascript, Node.js, Sockets.io, Express. 
2018

By Felix Lapierre and Jun Loke

# How to Run

Make sure you have node.js installed on your system.
In the folder containing the repo, run the following commands:

npm init

npm install --save express socket.io

This will install Express and Socket.io and all of their dependencies in the folder, which are necessary to run the server.
To turn on the server, execute the following command in the folder containing the repo:

node server.js

This will start a server on port 5000 of your computer. The port used can be changed by modifying server.js
To connect to the server from the same computer, open a web browser and enter the following into your address bar:

localhost:5000

To connect from a different computer, enter the IP address of the host computer in place of localhost.
