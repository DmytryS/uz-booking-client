interface TrainStation {
    code: string;
    station: string;
    stationTrain: string;
    date: string;
    time: string;
    sortTime: number;
    srcDate: string;
}
interface Child {
    minDate: string;
    maxDate: string;
}
interface Types {
    id: string;
    letter: string;
    places: number;
    title: string;
}
export default interface Train {
    num: string;
    category: number;
    isTransformer: number;
    travelTime: string;
    from: TrainStation;
    to: TrainStation;
    types: Array<Types>;
    child: Child;
    allowStudent: number;
    allowBooking: number;
    isCis: number;
    isEurope: number;
    allowPrivilege: number;
}
export {};
