import { AppError } from "../../../core/errors";
import { NewOrder } from "../../../domain/dto/new_order";
import { DevicePassword } from "../../../domain/entities/order/device_password";
import { Order } from "../../../domain/entities/order/order";
import { OrderStatusType } from "../../../domain/entities/order/order_status";
import { OrderAcceptDetails } from "../../../domain/entities/order/status_details/accepted";
import { OrderCancellDetails } from "../../../domain/entities/order/status_details/cancelled";
import { OrderClosedDetails } from "../../../domain/entities/order/status_details/closed";
import { OrderInProgressDetails } from "../../../domain/entities/order/status_details/in_progress";
import { OrderConfirmedOfferDetails } from "../../../domain/entities/order/status_details/offer_confirmed";
import { OrderOfferCreatedDetails } from "../../../domain/entities/order/status_details/offer_created";
import { OrderDeclinedOfferDetails } from "../../../domain/entities/order/status_details/offer_declined";
import { OrderDiagnosticDetails } from "../../../domain/entities/order/status_details/on_diagnostic";
import { OrderWaitingForPartsDetails } from "../../../domain/entities/order/status_details/parts_waiting";
import { OrderWorkFinishedDetails } from "../../../domain/entities/order/status_details/work_finished";
import { OrdersRepository } from "../../../domain/repositories/orders.repository";
import { prisma } from "../client";

export class OrdersRepositoryPostgressImpl implements OrdersRepository {
    async createOrder(orderData: NewOrder): Promise<Order> {
        const newOrder = await prisma.order.create({
            data: {
                customerInfo: {
                    create: {
                        customerId: orderData.customerInfo.customerId,
                        customerType: orderData.customerInfo.customerType,
                    },
                },
                details: {
                    create: {
                        categoryId: orderData.categoryId,
                        issueIds: orderData.issueIds,
                        description: orderData.description,
                        deviceWet: orderData.deviceWet,
                        accesoriesIncluded: orderData.accesoriesIncluded,
                        hasWaranty: orderData.hasWaranty,
                        password: orderData.password,
                    },
                },
                status: {
                    create: {
                        currentStatus: "newOrder",
                    },
                },
            },
            include: {
                details: true,
                customerInfo: true,
                status: true,
            },
        });

        return p2Order(newOrder);
    }

    async orders(customerId?: string): Promise<Order[]> {
        const orders = await prisma.order.findMany({
            where: {
                customerInfo: {
                    customerId: customerId,
                },
            },
            include: {
                details: true,
                customerInfo: true,
                status: true,
            },
        });
        return orders.map((order) => p2Order(order));
    }

    async orderById(orderId: string): Promise<Order> {
        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                details: true,
                customerInfo: true,
                status: true,
            },
        });

        if (!order) throw new AppError("Order not found", 404);

        return p2Order(order);
    }

    async updateOrder(orderId: string, order: Omit<Order, "id" | "cretedAt" | "updateAt">): Promise<Order> {
        const updatedOrder = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                customerInfo: {
                    update: order.customerInfo,
                },
                details: {
                    update: order.details,
                },
                status: {
                    update: order.status,
                },
            },
            include: {
                details: true,
                customerInfo: true,
                status: true,
            },
        });

        return p2Order(updatedOrder);
    }
}

/** Prisma model to order entity mapper */
function p2Order(order: any): Order {
    return {
        id: order.id,
        customerInfo: {
            customerId: order.customerInfo.customerId,
            customerType: order.customerInfo.customerType,
        },
        details: {
            categoryId: order.details.categoryId,
            issueIds: order.details.issueIds,
            description: order.details.description,
            deviceWet: order.details.deviceWet,
            accesoriesIncluded: order.details.accesoriesIncluded,
            hasWaranty: order.details.hasWaranty,
            password: order.details.password as DevicePassword,
        },
        status: {
            currentStatus: order.status.currentStatus as OrderStatusType,
            acceptedDetails: order.status.acceptedDetails as OrderAcceptDetails,
            onDiagnosticDetails: order.status.onDiagnosticDetails as OrderDiagnosticDetails,
            offerCreatedDetails: order.status.offerCreatedDetails as OrderOfferCreatedDetails,
            confirmedOfferDetails: order.status.confirmedOfferDetails as OrderConfirmedOfferDetails,
            declinedOfferDetails: order.status.declinedOfferDetails as OrderDeclinedOfferDetails,
            waitingForPartsDetails: order.status.waitingForPartsDetails as OrderWaitingForPartsDetails,
            inProgressDetails: order.status.inProgressDetails as OrderInProgressDetails,
            workFinishedDetails: order.status.workFinishedDetails as OrderWorkFinishedDetails,
            closedDetails: order.status.closedDetails as OrderClosedDetails,
            cancellDetails: order.status.cancellDetails as OrderCancellDetails,
        },
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
}
