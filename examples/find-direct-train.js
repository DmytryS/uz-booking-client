const Client = require("../dist/src").default;
const moment = require("moment");
const util = require("util");

async function main() {
  const ticketsDate = moment().add(10, "days");
  const uzClient = new Client("ru");

  const departureStations = await uzClient.Station.find("Kyiv");
  const departureStation = departureStations.data[0];

  const targetStations = await uzClient.Station.find("Lviv");
  const targetStation = targetStations.data[0];

  console.log(111, departureStation.value);

  const trains = await uzClient.Train.find(
    departureStation.value,
    targetStation.value,
    ticketsDate.format("YYYY-MM-DD"),
    "00:00:00"
  );

  console.log(util.inspect(trains.data, { colors: true, depth: 4 }));
}

main();
