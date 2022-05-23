const fs = require("fs");
const chalk = require("chalk");

const { AttributeIds, OPCUAClient, TimestampsToReturn } = require("node-opcua");

async function createOPCUAClient(
  fileName,
  endPoint,
  nodeId,
  client,
  session,
  subscription
) {

  fs.open(fileName, 'w', (err) => {
    if (err) throw err;
    console.log('File created');
  });

  //& Create client
  client = OPCUAClient.create({
    endpointMustExist: false,
  });

  client.on("backoff", (retry, delay) => {
    console.log(chalk.red('\nSERVER TROUBLE (запустите WITS_to_OPC)\n'));
    console.log("Retrying to connect to ", endPoint, " attempt ", retry);

    fs.writeFile(fileName, 'server_trouble', (err) => {
      if (err) throw err;
      console.log('Data has been replaced!');
    });

  });


  //& Connecting
  console.log(" connecting to ", chalk.cyan(endPoint));
  await client.connect(endPoint);
  console.log(" connected to ", chalk.cyan(endPoint));


  //& Create session
  session = await client.createSession();
  console.log(" session created".yellow);


  //& Subscription
  subscription = await session.createSubscription2({
    requestedPublishingInterval: 100,
    requestedMaxKeepAliveCount: 50,
    requestedLifetimeCount: 6000,
    maxNotificationsPerPublish: 1000,
    publishingEnabled: true,
    priority: 10,
  });

  subscription
    .on("keepalive", function () {

      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) throw err;

        const STATUS_SYMBOL = data === 'true' ? ' ⛳' : ' ⛔';
        const COLOR_STATUS = data === 'true' ? '#40E0D0' : '#DE3163';

        console.log('\n========================');
        console.log(
          chalk.yellow("keepalive "),
          chalk.magenta("\nstatus: "),
          chalk.hex(COLOR_STATUS).bold(data + STATUS_SYMBOL)
        );
        console.log('========================');
      });
    })
    .on("terminated", function () {
      console.log(" TERMINATED ------------------------------>");
    });


  //& Monitoring
  const itemToMonitor = {
    nodeId: nodeId,
    attributeId: AttributeIds.Value,
  };
  const parameters = {
    samplingInterval: 100,
    discardOldest: true,
    queueSize: 100,
  };
  const monitoredItem = await subscription.monitor(
    itemToMonitor,
    parameters,
    TimestampsToReturn.Both
  );

  monitoredItem.on("changed", (dataValue) => {
    console.log(
      chalk.hex('#FFA500')('>>>>>>>>'),
      chalk.bgYellow.blue.bold(' ' + dataValue.value.value.toString() + ' ')
    );

    fs.writeFile(fileName, dataValue.value.value.toString(), (err) => {
      if (err) throw err;
      console.log('Data has been replaced!');
    });

  });
};

module.exports = createOPCUAClient;