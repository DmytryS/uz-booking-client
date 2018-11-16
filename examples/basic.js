const Client = require('../dist');

async function main() {
    const cl = new Client.default('uk');
    let res = await cl.Station.find('kyiv');

    const station1 = res.data[0];

    res = await cl.Station.find('pokrovs\'k');

    const station2 = res.data[3];

    console.log(station1, station2);

    const trains = await cl.Train.find(
        station1.value,
        station2.value,
        '2018-11-18',
        '00:00'
    );

    console.log(trains.data);
}

main();