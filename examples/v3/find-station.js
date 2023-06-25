const readline = require('readline')
const { ApiV3: UzClientV3 } = require('../../dist')

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => rl.question(query, ans => {
    rl.close()
    resolve(ans)
  }))
}

const main = async () => {
  const { UZ_ACCESS_TOKEN } = process.env

  const uzClient = new UzClientV3('uk', UZ_ACCESS_TOKEN)

  if (!UZ_ACCESS_TOKEN) {
    const phoneNumber = await askQuestion('Your phone number: ')

    await uzClient.Auth.sendSms(phoneNumber)

    const code = await askQuestion('Code from SMS: ')

    await uzClient.Auth.login(code)
  }

  const foundStations = await uzClient.Station.find('льв')

  console.dir(foundStations.data, { depth: 20, colors: true })
}

main()
