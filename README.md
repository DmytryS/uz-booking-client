[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][downloads-url]
[![MIT License][license-image]][license-url]
[![Build Status][travis-image]][travis-url]

# uz-booking-client

Unofficial uz booking API client for Node.js. https://booking.uz.gov.ua/en/

## Installation

Using npm:

```shell
$ npm i uz-booking-client
```

Note: add --save if you are using npm < 5.0.0

In Node.js:

```javascript
import Client from "uz-booking-client"
//  or
const Client = require("uz-booking-client")
```

## Usage

```javascript
/*
   Data can be retrieved from the API either using callbacks (as in versions < 1.0)
   or using a new promise-based API. The promise-based API returns the raw Axios
   request promise.
 */
  import Client from "uz-booking-client"

  const uzClient = new Client.ApiV3("en")
  const phoneNumber = await askQuestion('Your phone number: ')

  await uzClient.Auth.sendSms(phoneNumber)

  const code = await askQuestion('Code from SMS: ')

  await uzClient.Auth.login(code)

  const ticketsDate = moment().add(10, 'days')

  const departureStations = await uzClient.Station.find('Київ')
  const departureStationId = departureStations[0].id

  const targetStations = await uzClient.Station.find('Львів')
  const targetStationId = targetStations[0].id

  const trains = await uzClient.Train.find(
    departureStationId,
    targetStationId,
    ticketsDate.format('YYYY-MM-DD'),
  )

  const tripId = trains[0].id
  const wagonType = trains[0].train.wagon_classes[0].id

  const wagons = await uzClient.Wagon.list(tripId, wagonType)

  console.dir(wagons, { depth: 20, colors: true })

  // [
  //     {
  //         "id": "eyJpdiI6IlZZd1JoeExwYVFadWdOb2JUbEo3eWc9PSIsInZhbHVlIjoiWFRaWUJPNjJkVmw1OUZRcHlMdWtPeUtjZUQrUUE5djdyejF4N3lnUEllVmJOTFVRZWgzelFEN1lFR2VsWmpDSkM0SCtVQnZOcFpIQ1NET0FNOUtNMlFlSjhEbjRNMTFSOEd5UVluZU5sMmgzZTdOeU9yZzJ6cWF1VGlnNEpadjgiLCJtYWMiOiJlODlkYTM5ZTE1OTRjMDgxMDhlNDBmN2M4NDcyMDYxMDJmYjUyNjY1Mjk3YTk1NTQ4ZWY0YzhjMDA1MDRjZjlhIiwidGFnIjoiIn0=",
  //         "number": "6",
  //         "mockup_name": "Вагон типу СВ на 20 місць з нижніми місцями",
  //         "seats": [
  //             1,
  //             2,
  //             5,
  //             6,
  //             9,
  //             10,
  //             11,
  //             12,
  //             13,
  //             14,
  //             15,
  //             16,
  //             17,
  //             18,
  //             19,
  //             20
  //         ],
  //         "free_seats_top": 0,
  //         "free_seats_lower": 16,
  //         "price": 164938,
  //         "air_conditioner": true,
  //         "services": [
  //             {
  //                 "id": "drinks",
  //                 "title": "Напій",
  //                 "details": {
  //                     "photo": null,
  //                     "content": [
  //                         {
  //                             "title": "На вибір:",
  //                             "description": "Класичний чай, розчинна кава або мінеральна вода 0,5 л.\n"
  //                         }
  //                     ]
  //                 },
  //                 "price": 1000,
  //                 "select_type": "units",
  //                 "select_units_max": 3
  //             },
  //             {
  //                 "id": "tea",
  //                 "title": "Авторський чай",
  //                 "details": {
  //                     "photo": "https://app.uz.gov.ua/img/api/services/tea.jpg",
  //                     "content": [
  //                         {
  //                             "title": "На вибір:",
  //                             "description": "Карпатський трав’яний чай, подільський чай з м’ятою або поліський чай з чебрецем\n"
  //                         }
  //                     ]
  //                 },
  //                 "price": 1500,
  //                 "select_type": "checkbox",
  //                 "select_units_max": null
  //             },
  //             {
  //                 "id": "drip_coffee",
  //                 "title": "Дріп кава",
  //                 "details": {
  //                     "photo": "https://app.uz.gov.ua/img/api/services/drip_coffee.jpg",
  //                     "content": [
  //                         {
  //                             "title": "Арабіка з Бразилії:",
  //                             "description": "Натуральна мелена кава в пакетиках для зручного заварювання.\n"
  //                         }
  //                     ]
  //                 },
  //                 "price": 2500,
  //                 "select_type": "checkbox",
  //                 "select_units_max": null
  //             },
}
```

[npm-url]: https://npmjs.org/package/uz-booking-client
[npm-version-image]: https://img.shields.io/npm/v/uz-booking-client.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/uz-booking-client.svg?style=flat
[downloads-url]: https://npmcharts.com/compare/uz-booking-client?minimal=true

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[travis-url]: https://travis-ci.com/DmytryS/uz-booking-client
[travis-image]: https://travis-ci.com/DmytryS/uz-booking-client.svg?branch=master
