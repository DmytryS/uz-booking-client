const Client = require('../dist');
const moment = require('moment');

async function main() {
    console.log(Client);
    const ticketsDate = moment().add(10,'days');
    const cl = new Client.default('ru');
    let res = await cl.Station.find('kyiv');

    const station1 = res.data[0];

    res = await cl.Station.find('Lviv');

    const station2 = res.data[0];

    const trains = await cl.Train.find(
        station1.value,
        station2.value,
        ticketsDate.format('YYYY-MM-DD'),
        '00:00'
    );
    
    console.log(trains.data);
}

main();