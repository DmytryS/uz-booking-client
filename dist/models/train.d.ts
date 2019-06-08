interface ITrainStation {
    code: string;
    station: string;
    stationTrain: string;
    date: string;
    time: string;
    sortTime: number;
    srcDate: string;
}
interface IChild {
    minDate: string;
    maxDate: string;
}
interface ITypes {
    id: string;
    letter: string;
    places: number;
    title: string;
}
export default interface ITrain {
    num: string;
    category: number;
    isTransformer: number;
    travelTime: string;
    from: ITrainStation;
    to: ITrainStation;
    types: ITypes[];
    child: IChild;
    allowStudent: number;
    allowBooking: number;
    isCis: number;
    isEurope: number;
    allowPrivilege: number;
}
export {};
