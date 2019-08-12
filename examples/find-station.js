const Client = require("../dist/src").default;

async function main() {
  const uzClient = new Client("ru");

  const foundStations = await uzClient.Station.find("kyiv");

  console.log(foundStations.data);
}

main();
