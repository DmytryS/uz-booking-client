const Client = require("../../dist");

async function main() {
  const uzClient = new Client.ApiV1("en");

  const foundStations = await uzClient.Station.find("киев");

  console.log(foundStations.data);
}

main();
