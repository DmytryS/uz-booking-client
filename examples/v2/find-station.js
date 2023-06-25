const Client = require('../../dist')

async function main() {
  const uzClient = new Client.ApiV2('en')

  const stationsResponse = await uzClient.Station.find('kyiv')

  console.dir(stationsResponse.data, { depth: 20, colors: true })
}

main()
