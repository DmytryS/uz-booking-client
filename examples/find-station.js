const Client = require('uz-booking-client').default;

async function main() {
    const uzClient = new Client('ru');

    const foundStations = await uzClient.Station.find('kyiv');

    console.log(foundStations.data);
}

main();
