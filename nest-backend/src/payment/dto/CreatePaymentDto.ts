export class CreatePaymentDto {
    order_id: number;
    readonly payment_method_id: number;
    readonly transaction_id: string;
    readonly status: string;
    readonly paid_at: Date;

    // order_id: number;
    // readonly customer_first_name: string;
    // readonly customer_last_name: string;
    // readonly customer_phone: string;
    // readonly address: string;
    // readonly city: string;
    // readonly postal_code: string;
    // readonly country: string;
    // readonly payment_method_id: number;
    // readonly transaction_id: string;
    // readonly status: string;
    // readonly paid_at: Date;
}