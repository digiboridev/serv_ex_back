import { RepairPart } from "./repair_parts";

export type OrderConfirmedOfferDetails = {
    confirmationSkipped: boolean;
    parts: RepairPart[];
};
