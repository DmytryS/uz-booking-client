const Client = require("../../dist");
const { inspect } = require("util");

async function main() {
  const uzClient = new Client.ApiV2("en");

  const foundStations = await uzClient.Station.find("kyiv");

  console.log(inspect(foundStations.data, { colors: true, depth: 8 }));
}

main();
