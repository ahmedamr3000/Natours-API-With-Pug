// import EventEmitter from "events";

// class sales extends EventEmitter {
//   constructor(parameters) {
//     super();
//   }
// }
// const myemitter = new sales();

// myemitter.on("newSale", () => {
//   console.log("done");
// });
// myemitter.on("newSale", (stock) => {
//   console.log(`thanks ahmed  ${stock} left`);
// });

// myemitter.emit("newSale", 8);

// //---------------------------------

const serve = http.createServer();

// serve.on("request", (req, res) => {
//   console.log("Request received!");
//   console.log(req.url);
//   res.end("Another request 😊");
// });

// serve.on("request", (req, res) => {
//   console.log("Another received!");
// });

// serve.on("close", () => {
//   console.log("Server closed");
// });

//-----------------------------------\

import fs from 'fs';
import { error } from 'console';
// const stream = fs.createReadStream("text.txt");

serve.on('request', (req, res) => {
  // stream.on("data", (chunck) => {
  //   res.write(chunck);
  // });

  // stream.on("end", () => {               old syntax
  //   res.end;
  // });

  // stream.on("error", (err) => {
  //   console.log(err);
  //   res.status = 404;
  //   res.end("file not found ");
  // });

  stream.pipe(res);
});
