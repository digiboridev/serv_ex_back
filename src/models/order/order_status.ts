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
        acceptedDetails: {
            type: OrderAcceptDetailsSchema,
            required: [
                function (this: OrderStatus) {
                    return this.currentStatus === "accepted";
                },
                "acceptedDetails is required when currentStatus is accepted",
            ],
        },
        onDiagnosticDetails: {
            type: OrderDiagnosticDetailsSchema,
            required: [
                function (this: OrderStatus) {
                    return this.currentStatus === "onDiagnostic";
                },
                "onDiagnosticDetails is required when currentStatus is onDiagnostic",
            ],
        },
        offerCreatedDetails: {
            type: OrderOfferCreatedDetailsSchema,
            required: [
                function (this: OrderStatus) {
                    return this.currentStatus === "offerCreated";
                },
                "offerCreatedDetails is required when currentStatus is offerCreated",
            ],
        },

        confirmedOfferDetails: {
            type: OrderConfirmedOfferDetailsSchema,
            required: [
                function (this: OrderStatus) {
                    return this.currentStatus === "confirmedOffer";
                },
                "confirmedOfferDetails is required when currentStatus is confirmedOffer",
            ],
        },

        declinedOfferDetails: {
            type: OrderDeclinedOfferDetailsSchema,
            required: [
                function (this: OrderStatus) {
                    return this.currentStatus === "declinedOffer";
                },
                "declinedOfferDetails is required when currentStatus is declinedOffer",
            ],
        },

        waitingForPartsDetails: {
            type: OrderWaitingForPartsDetailsSchema,
            required: [
                function (this: OrderStatus) {
                    return this.currentStatus === "waitingForParts";
                },
                "waitingForPartsDetails is required when currentStatus is waitingForParts",
            ],
        },

        inProgressDetails: {
            type: OrderInProgressDetailsSchema,
            required: [
                function (this: OrderStatus) {
                    return this.currentStatus === "inProgress";
                },
                "inProgressDetails is required when currentStatus is inProgress",
            ],
        },
        workFinishedDetails: {
            type: OrderWorkFinishedDetailsSchema,
            required: [
                function (this: OrderStatus) {
                    return this.currentStatus === "workFinished";
                },
                "workFinishedDetails is required when currentStatus is workFinished",
            ],
        },

        closedDetails: {
            type: OrderClosedDetailsSchema,
            required: [
                function (this: OrderStatus) {
                    return this.currentStatus === "closed";
                },
                "closedDetails is required when currentStatus is closed",
            ],
        },
        cancellDetails: {
            type: OrderCancellDetailsSchema,
            required: [
                function (this: OrderStatus) {
                    return this.currentStatus === "canceled";
                },
                "cancellDetails is required when currentStatus is canceled",
            ],
        },
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
