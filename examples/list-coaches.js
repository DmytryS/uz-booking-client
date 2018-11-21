const Client = require('uz-booking-client').default;
const moment = require('moment');

async function main() {
    const ticketsDate = moment().add(10,'days');
    const uzClient = new Client('ru');

    const departureStations = await uzClient.Station.find('Kyiv');
    const departureStation = departureStations.data[0];

    const targetStations = await uzClient.Station.find('Lviv');
    const targetStation = targetStations.data[0];

    const trains = await uzClient.Train.find(
        departureStation,
        targetStation,
        ticketsDate.format('YYYY-MM-DD'),
        '00:00'
    );

    const train = trains.data.data.list[3];
    
    if (train.types.length === 0) {
        console.log('No free places in this train.');
    } else {
        const wagonTypes = train.types.map(type => type.letter)

        const wagons = await uzClient.Wagon.list(train, wagonTypes[0]);
        const wagon = wagons.data.data.wagons[0];

        const coaches = await uzClient.Coach.list(train, wagon)
        console.log(coaches.data.data);
    }
}

main();