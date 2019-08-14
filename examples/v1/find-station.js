const Client = require("../../dist").default;

async function main() {
  const uzClient = new Client.apiV1("en");

  const foundStations = await uzClient.Station.find("kyiv");

  console.log(foundStations);
}

main();
