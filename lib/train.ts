import Requestable from './requestable';

export default class Train extends Requestable {

    constructor(lang: string) {
        super(lang);
    }

    find(from: number, to: number, date: string, time: string, cb: Function) {
        return this.request(
            'POST',
            `train_search/`,
            {
                from,
                to,
                date,
                time
            },
            cb
        );
    }
}