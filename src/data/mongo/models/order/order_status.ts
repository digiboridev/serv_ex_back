import { Schema } from "mongoose";
import { OrderStatus } from "../../../../domain/entities/order/order_status";
import { OrderAcceptDetailsSchema } from "./status_details/accepted";
import { OrderCancellDetailsSchema } from "./status_details/cancelled";
import { OrderClosedDetailsSchema } from "./status_details/closed";
import { OrderInProgressDetailsSchema } from "./status_details/in_progress";
import { OrderConfirmedOfferDetailsSchema } from "./status_details/offer_confirmed";
import { OrderOfferCreatedDetailsSchema } from "./status_details/offer_created";
import { OrderDeclinedOfferDetailsSchema } from "./status_details/offer_declined";
import { OrderDiagnosticDetailsSchema } from "./status_details/on_diagnostic";
import { OrderWaitingForPartsDetailsSchema } from "./status_details/parts_waiting";
import { OrderWorkFinishedDetailsSchema } from "./status_details/work_finished";

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
