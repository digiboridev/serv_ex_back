
export type RepairSubpart = {
    name: string;
    date: Date;
    price: number;
    note: string;
};

export type RepairPart = {
    name: string;
    date: Date;
    price: number;
    subparts: RepairSubpart[];
    note: string;
    selected: boolean;
};
