import { RepairPart } from "./value_objects/repair_parts";

export type OrderConfirmedOfferDetails = {
    confirmationSkipped: boolean;
    parts: RepairPart[];
};
