import { RepairPart } from "./repair_parts";

export type OrderOfferCreatedDetails = {
    employeeId: string;
    employeeNick: string;
    confirmationRequired: boolean;
    withPayment: boolean;
    prepayRequired: boolean;
    noteForClient: string;
    noteForEmployee: string;
    afterDiagnostic: boolean;
    parts: RepairPart[];
};
