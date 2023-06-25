import { OrderAcceptDetails } from "./status_details/accepted";
import { OrderCancellDetails } from "./status_details/cancelled";
import { OrderClosedDetails } from "./status_details/closed";
import { OrderInProgressDetails } from "./status_details/in_progress";
import { OrderConfirmedOfferDetails } from "./status_details/offer_confirmed";
import { OrderOfferCreatedDetails } from "./status_details/offer_created";
import { OrderDeclinedOfferDetails } from "./status_details/offer_declined";
import { OrderDiagnosticDetails } from "./status_details/on_diagnostic";
import { OrderWaitingForPartsDetails } from "./status_details/parts_waiting";
import { OrderWorkFinishedDetails } from "./status_details/work_finished";

export enum OrderStatusType {
    newOrder = "newOrder",
    accepted = "accepted",
    onDiagnostic = "onDiagnostic",
    offerCreated = "offerCreated",
    confirmedOffer = "confirmedOffer",
    declinedOffer = "declinedOffer",
    waitingForParts = "waitingForParts",
    inProgress = "inProgress",
    workFinished = "workFinished",
    closed = "closed",
    canceled = "canceled",
}

export type OrderStatus = {
    currentStatus: OrderStatusType;
    acceptedDetails?: OrderAcceptDetails;
    onDiagnosticDetails?: OrderDiagnosticDetails;
    offerCreatedDetails?: OrderOfferCreatedDetails;
    confirmedOfferDetails?: OrderConfirmedOfferDetails;
    declinedOfferDetails?: OrderDeclinedOfferDetails;
    waitingForPartsDetails?: OrderWaitingForPartsDetails;
    inProgressDetails?: OrderInProgressDetails;
    workFinishedDetails?: OrderWorkFinishedDetails;
    closedDetails?: OrderClosedDetails;
    cancellDetails?: OrderCancellDetails;
};
