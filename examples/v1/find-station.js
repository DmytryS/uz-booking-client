const Client = require("../../dist");

async function main() {
  const uzClient = new Client.ApiV1("en");

  const foundStations = await uzClient.Station.find("kyiv");

  console.log(foundStations);
}

main();
