const { ApiV3: UzClientV3 } = require('../../dist')

async function main() {
  const fcmToken = '{{SOME_FCM_TOKEN}}'
  const deviceName = 'iPhone12.1'

  const uzClient = new UzClientV3('en', false, fcmToken, deviceName)

  await uzClient.Auth.refresh()
}

main()
