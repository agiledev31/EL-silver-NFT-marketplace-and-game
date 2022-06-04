let express = require("express");


require("dotenv").config();

// Create global app object
let app = express();
var allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:4300",
  "http://localhost:3000",
  "http://ec2-3-137-141-174.us-east-2.compute.amazonaws.com",
  "http://ec2-3-140-248-210.us-east-2.compute.amazonaws.com",
  "http://ec2-3-14-80-25.us-east-2.compute.amazonaws.com",
  "http://18.183.56.10/",
];

require("./server/app-config")(app);

// const http = require('http').Server(app);

// finally, let's start our server...
let server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + server.address().port);
});
global.lolSocket = require("socket.io")(server, {
  cors : {
    credentials: false,
    origin: '*',
    // function (origin, callback) {
    //   // allow requests with no origin
    //   // (like mobile apps or curl requests)
    //   if (!origin) return callback(null, true);
    //   if (allowedOrigins.indexOf(origin) === -1) {
    //     var msg =
    //       "The CORS policy for this site does not " +
    //       "allow access from the specified Origin.";
    //     return callback(new Error(msg), false);
    //   }
    //   return callback(null, true);
    // },
  }
});

lolSocket.on("connection", (socket) => {
  console.log("a user connected");
 
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
