import { CancellationReasons } from "../models/order/status_details/cancelled";


export type CancellOrderDto = {
    orderId: string;
    reason: CancellationReasons;
    description: string;
}