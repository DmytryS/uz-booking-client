export default interface Wagon {
    air: string | null,
    allowBonus: boolean,
    byWishes: boolean,
    class: string,
    free: number,
    hasBedding: boolean,
    num: number,
    obligatoryBedding: boolean,
    prices: Prices,
    railway: number,
    reservePrice: number,
    services: Array<string>,
    type: string,
    type_id: string
}

interface Prices {
    A: number
}
