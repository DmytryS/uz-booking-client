const Client = require('../../dist')
const moment = require('moment')

async function main() {
  const ticketsDate = moment().add(10, 'days')
  const uzClient = new Client.ApiV1('en')

  const departureStations = await uzClient.Station.find('Kyiv')
  const departureStation = departureStations.data[0]

  const targetStations = await uzClient.Station.find('Lviv')
  const targetStation = targetStations.data[0]

  const trains = await uzClient.Train.find(
    departureStation.value,
    targetStation.value,
    ticketsDate.format('YYYY-MM-DD'),
    '00:00',
  )

  console.log(trains.data)
}

main()
