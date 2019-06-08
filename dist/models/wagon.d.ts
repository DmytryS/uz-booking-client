export default interface IWagon {
    air: string | null;
    allowBonus: boolean;
    byWishes: boolean;
    class: string;
    free: number;
    hasBedding: boolean;
    num: number;
    obligatoryBedding: boolean;
    prices: IPrices;
    railway: number;
    reservePrice: number;
    services: string[];
    type: string;
    type_id: string;
}
interface IPrices {
    A: number;
}
export {};
