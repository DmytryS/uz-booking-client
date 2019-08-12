interface IItem {
    title: string;
    region?: string;
}
export default interface IStation {
    [index: string]: {
        [language: string]: IItem;
    };
}
export {};
