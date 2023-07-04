export type RepairSubpart = {
    name: string;
    date: number;
    price: number;
    note: string;
};

export type RepairPart = {
    name: string;
    date: number;
    price: number;
    subparts: RepairSubpart[];
    note: string;
    selected: boolean;
};
