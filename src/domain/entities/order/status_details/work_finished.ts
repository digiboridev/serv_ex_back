import { OrderSign } from "./value_objects/sign";

export enum FinishedAfterType {
    diagnistic = "diagnistic",
    offer = "offer",
}

export type OrderWorkFinishedDetails = {
    employeeId?: string;
    finishedAfter: FinishedAfterType;
    paymentRequired: boolean;
    signRequested: boolean;
    signnature? : OrderSign;
};
