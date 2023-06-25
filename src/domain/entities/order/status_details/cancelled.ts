
export enum CancellationReasons {
    notAvailable = "notAvailable",
    notInterested = "notInterested",
    notWorking = "notWorking",
    notWorthRepair = "notWorthRepair",
    other = "other",
}

export type OrderCancelledByCustomer = {
    reason: CancellationReasons;
    description?: string;
    actor: "customer";
};

export type OrderCancelledByEmployee = {
    reason: CancellationReasons;
    description?: string;
    actor: "employee";
    employeeId: string;
};

export type OrderCancellDetails = OrderCancelledByCustomer | OrderCancelledByEmployee;
