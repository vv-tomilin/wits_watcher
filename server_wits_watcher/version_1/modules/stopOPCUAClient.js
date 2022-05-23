
async function stopOPCUAClient(client, session, subscription) {
  if (subscription) await subscription.terminate();
  if (session) await session.close();
  if (client) await client.disconnect();
}

module.exports = stopOPCUAClient;