import { CancellationReasons } from "../entities/order/status_details/cancelled";


export type CancellOrderDto = {
    orderId: string;
    reason: CancellationReasons;
    description: string;
}