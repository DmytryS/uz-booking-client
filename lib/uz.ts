import Station from './station';
import Train from './train';

export default class UZ {
    lang: string;

    constructor(lang: 'en' | 'ru' | 'uk') {
        this.lang = lang;
    }
    get Station() {
        return new Station(this.lang);
    }

    get Train() {
        return new Train(this.lang);
    }
}