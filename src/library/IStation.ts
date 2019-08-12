interface IItem {
    title: string;
    region?: string;
}

export default interface IStation {
    [index: string]: {
        [language: string]: IItem
        // en: IItem,
        // ru: IItem,
        // uk: IItem
    };
}
