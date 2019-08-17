const Client = require("../../dist").default;
const moment = require("moment");
const { inspect } = require("util");

async function main() {
  const ticketsDate = moment().add(15, "days");
  const uzClient = new Client.ApiV2("en");

  const departureStations = await uzClient.Station.find("Kyiv");
  const departureStation = departureStations.data[0];

  const targetStations = await uzClient.Station.find("Lviv");
  const targetStation = targetStations.data[0];

  const trains = await uzClient.Train.find(
    departureStation.value,
    targetStation.value,
    ticketsDate.format("YYYY-MM-DD"),
    "00:00"
  );

  const train = trains.data.data.trains.filter(train => train.wagon_types.length)[0];

  if (train.wagon_types.length === 0) {
    console.log("No free places left in this train.");
  } else {
    const wagons = await uzClient.Wagon.list(
      departureStation.value,
      targetStation.value,
      ticketsDate.format("YYYY-MM-DD"),
      train.number
    );


    const wagon = wagons.data.data.wagons[0];

    const coaches = await uzClient.Coach.list(
      departureStation.value,
      targetStation.value,
      ticketsDate.format("YYYY-MM-DD"),
      train.number,
      wagon.num,
      wagon.type,
      wagon.class
    );

    console.log(inspect(coaches.data.data, { colors: true, depth: 8 }));
  }
}

main();
