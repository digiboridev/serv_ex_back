import { Schema } from "mongoose";
import { OrderAcceptDetails, OrderAcceptDetailsSchema } from "./status_details/accepted";
import { OrderDiagnosticDetails, OrderDiagnosticDetailsSchema } from "./status_details/on_diagnostic";
import { OrderOfferCreatedDetails, OrderOfferCreatedDetailsSchema } from "./status_details/offer_created";
import { OrderConfirmedOfferDetails, OrderConfirmedOfferDetailsSchema } from "./status_details/offer_confirmed";
import { OrderDeclinedOfferDetails, OrderDeclinedOfferDetailsSchema } from "./status_details/offer_declined";
import { OrderWaitingForPartsDetails, OrderWaitingForPartsDetailsSchema } from "./status_details/parts_waiting";
import { OrderInProgressDetails, OrderInProgressDetailsSchema } from "./status_details/in_progress";
import { OrderWorkFinishedDetails, OrderWorkFinishedDetailsSchema } from "./status_details/work_finished";
import { OrderClosedDetails, OrderClosedDetailsSchema } from "./status_details/closed";
import { OrderCancellDetails, OrderCancellDetailsSchema } from "./status_details/cancelled";

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

export const OrderStatusSchema = new Schema(
    {
        currentStatus: {
            type: String,
            enum: [
                "newOrder",
                "accepted",
                "onDiagnostic",
                "offerCreated",
                "confirmedOffer",
                "declinedOffer",
                "waitingForParts",
                "inProgress",
                "workFinished",
                "closed",
                "canceled",
            ],
            default: "newOrder",
        },
        acceptedDetails: OrderAcceptDetailsSchema,
        onDiagnosticDetails: OrderDiagnosticDetailsSchema,
        offerCreatedDetails: OrderOfferCreatedDetailsSchema,
        confirmedOfferDetails: OrderConfirmedOfferDetailsSchema,
        declinedOfferDetails: OrderDeclinedOfferDetailsSchema,
        waitingForPartsDetails: OrderWaitingForPartsDetailsSchema,
        inProgressDetails: OrderInProgressDetailsSchema,
        workFinishedDetails: OrderWorkFinishedDetailsSchema,
        closedDetails: OrderClosedDetailsSchema,
        cancellDetails: OrderCancellDetailsSchema,
    },
    {
        _id: false,
        toObject: {
            virtuals: true,
            getters: true,
            transform: function (doc, ret) {
                delete ret.__v;
            },
        },
    }
);
