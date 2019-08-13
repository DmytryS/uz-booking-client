const Client = require("../dist").default;
const moment = require("moment");

async function main() {
  const ticketsDate = moment().add(10, "days");
  const uzClient = new Client.apiV2("en");

  const departureStations = await uzClient.Station.find("Kyiv");
  const departureStation = departureStations[0];

  const targetStations = await uzClient.Station.find("Lviv");
  const targetStation = targetStations[0];

  const trains = await uzClient.Train.find(
    departureStation.value,
    targetStation.value,
    ticketsDate.format("YYYY-MM-DD"),
    "00:00"
  );

  const train = trains.data.data.trains[3];

  if (train.wagon_types.length === 0) {
    console.log("No free places left in this train.");
  } else {
    // const wagonTypes = train.wagon_types.map(type => type.type);

    const wagons = await uzClient.Wagon.list(
      departureStation.value,
      targetStation.value,
      ticketsDate.format("YYYY-MM-DD"),
      train.number,
      // wagonTypes[0]
    );

    // console.log(111, wagons.data.data.wagons);


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

    console.log(coaches.data.data);
  }
}

main();
