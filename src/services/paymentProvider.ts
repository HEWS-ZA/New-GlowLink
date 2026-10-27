/**
 * Provider-Agnostic Payment Engine for GlowLink
 * Designed around Paystack's South African Hosted Checkout, Subaccount Splitting, and Webhook Architecture.
 * Strictly avoids touching or storing raw card data on the application server.
 */

import { Payment, Refund } from "./dataTypes";

export interface CheckoutSessionParams {
  bookingId: string;
  bookingReference: string;
  amountCents: number;
  email: string;
  customerName: string;
  paymentType: "deposit" | "balance";
  artisanSubaccountId?: string; // Paystack subaccount for marketplace automated payout splitting
  callbackUrl: string;
}

export interface CheckoutSessionResult {
  checkoutUrl: string;
  accessCode: string;
  reference: string;
}

export interface WebhookPayload {
  event: "charge.success" | "refund.processed" | "charge.failed";
  data: {
    reference: string;
    amount: number; // In cents
    currency: string;
    channel: string;
    idempotencyKey: string;
    paidAt: string;
    authorization?: {
      last4: string;
      card_type: string;
      brand: string;
    };
    metadata: {
      bookingId: string;
      paymentType: "deposit" | "balance";
      customerId: string;
      artisanId: string;
    };
  };
}

export interface PaymentProvider {
  name: "paystack" | "mock";
  createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult>;
  verifyWebhook(payload: WebhookPayload, signature: string): Promise<boolean>;
  getPaymentStatus(reference: string): Promise<Payment | null>;
  refund(paymentId: string, amountCents: number, reason: string): Promise<Refund>;
}

/**
 * Mock Paystack Provider Implementation
 * Simulates hosted checkout redirect and provides webhook generation for automated testing.
 */
class MockPaystackProviderImpl implements PaymentProvider {
  name: "paystack" = "paystack";
  private processedReferences = new Set<string>();

  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult> {
    const reference = `pstk_${params.paymentType}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const accessCode = `acc_${Math.random().toString(36).substring(2, 10)}`;

    return {
      reference,
      accessCode,
      checkoutUrl: `/paystack-mock-checkout?ref=${reference}&bookingId=${params.bookingId}&type=${params.paymentType}&amount=${params.amountCents}`,
    };
  }

  async verifyWebhook(payload: WebhookPayload, signature: string): Promise<boolean> {
    // In production, verifies crypto.createHmac('sha512', SECRET_KEY).update(rawBody).digest('hex') === signature
    if (!signature || signature.length < 8) {
      return false;
    }

    // Idempotency check: if already processed, return true but signal existing handling
    if (this.processedReferences.has(payload.data.reference)) {
      return true; // Webhook delivery is idempotent
    }

    this.processedReferences.add(payload.data.reference);
    return true;
  }

  async getPaymentStatus(reference: string): Promise<Payment | null> {
    return null;
  }

  async refund(paymentId: string, amountCents: number, reason: string): Promise<Refund> {
    const refundRef = `rfnd_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const receiptNum = `RCT-REF-${Date.now().toString().slice(-6)}`;

    return {
      id: `refund_${Date.now()}`,
      bookingId: "",
      bookingReference: "",
      paymentId,
      amountCents,
      reason,
      initiatedBy: "artisan",
      status: "processed",
      gatewayRefundReference: refundRef,
      receiptNumber: receiptNum,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };
  }
}

export const ActivePaymentProvider: PaymentProvider = new MockPaystackProviderImpl();
