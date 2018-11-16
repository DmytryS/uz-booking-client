import Requestable from './requestable';

export default class Station extends Requestable {
    
    constructor(lang: string) {
        super(lang);
    }

    find(stationName: string, cb: Function) {
        return this.request('GET', `train_search/station/?term=${decodeURIComponent(stationName)}/`, null, cb);
    }
}