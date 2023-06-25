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

async function main() {
  const uzClient = new UzClientV3('en')

  const phoneNumber = await askQuestion('Your phone number: ')

  await uzClient.Auth.sendSms(phoneNumber)

  const code = await askQuestion('Code from SMS: ')

  const response = await uzClient.Auth.login(code)

  console.log('Token response:', response)
  // { access_token: '{{TOKEN}}', expires_in: {{Number}} }
}

main()
