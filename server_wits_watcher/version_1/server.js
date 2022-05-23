const loctunnel = require('localtunnel');
require('dotenv').config()

const express = require("express");
const chalk = require("chalk");
const http = require("http");
const fs = require("fs");

const createOPCUAClient = require("./modules/createOCUAClient.js");
const stopOPCUAClient = require("./modules/stopOPCUAClient.js");

const PORT = 3700;

const hostname = require("os").hostname().toLowerCase();

const endpointUrl = process.env.OPCUA_URL;

const nodeIdToMonitor = process.env.WITS_STATUS_NODE;

let client, session, subscription;

const FILE_NAME = 'WITS_status.txt';

(async () => {
  try {
    // --------------------------------------------------------
    const app = express();

    app.get("/", function (req, res) {

      fs.readFile(FILE_NAME, 'utf8', (err, data) => {
        if (err) throw err;

        const result = {
          name: hostname,
          status: data
        };

        res.send(result);

      });

    });

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log('\n=================================');
      console.log(chalk.bgMagenta(" Listening on PORT " + PORT + ' \n'));
      console.log(
        chalk.hex('#7075ed')('visit ') +
        chalk.bgWhite.hex('#80d7cc')(' http://localhost:') +
        chalk.bgWhite.hex('#dc19a0')(PORT + ' ')
      );
      console.log('=================================\n');

      chalk.hex('#dc19a0')(PORT)
    });

    // --------------------------------------------------------
    createOPCUAClient(
      FILE_NAME,
      endpointUrl,
      nodeIdToMonitor,
      client,
      session,
      subscription
    );

    // detect CTRL+C and close
    process.once("SIGINT", async () => {
      console.log("shutting down client");

      fs.unlink(FILE_NAME, (err) => {
        if (err) throw err;
        console.log('File deleted successfully!');
      });

      await stopOPCUAClient(client, session, subscription);
      console.log("Done");
      process.exit(0);
    });
  } catch (err) {
    console.log(chalk.bgRed.white("Error" + err.message));
    console.log(err);
    process.exit(-1);
  }

  //& localtunnel
  const tunnel = await loctunnel({ port: 3700, subdomain: hostname });

  tunnel.url;

  console.log(chalk.green('\nAPI URL >>> ') + chalk.bgCyan((chalk.black(tunnel.url))));

  tunnel.on('close', () => {
    console.log('TUNNEL CLOSE');
  });

})();