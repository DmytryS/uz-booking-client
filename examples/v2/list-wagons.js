const Client = require("../../dist");
const moment = require("moment");
const { inspect } = require("util");

async function main() {
  const ticketsDate = moment().add(10, "days");
  const uzClient = new Client.ApiV2("en");

  const departureStations = await uzClient.Station.find("Kyiv");
  const departureStation = departureStations.data[0];

  const targetStations = await uzClient.Station.find("Lviv");
  const targetStation = targetStations.data[0];

  const trains = await uzClient.Train.find(
    departureStation.value,
    targetStation.value,
    ticketsDate.format("YYYY-MM-DD"),
    "00:00:00"
  );

  const train = trains.data.data.trains.filter(train => train.wagon_types.length)[0];

  if (train.wagon_types.length === 0) {
    console.log("No free places left in this train.");
  } else {
    const wagons = await uzClient.Wagon.list(
      departureStation.value,
      targetStation.value,
      ticketsDate.format("YYYY-MM-DD"),
      train.number,
    );

    console.log(inspect(wagons.data.data, { colors: true, depth: 8 }));
  }
}

main();
