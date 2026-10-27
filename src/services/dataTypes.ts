/**
 * GlowLink Core Data Types & Financial Specifications
 * All amounts stored strictly as integer cents in ZAR.
 * Explicit Booking State Machine and Audit Trail.
 */

export type Role = "guest" | "customer" | "artisan" | "admin";

export const DEPOSIT_PERCENT = 50; // 50% deposit required
export const SLOT_HOLD_MINUTES = 15; // 15-minute slot lock during deposit payment
export const CUSTOMER_CANCEL_REFUND_WINDOW_HOURS = 48; // Full refund if >48h before start

/**
 * Valid Booking State Machine Statuses
 */
export type BookingStatus =
  | "awaiting_deposit"     // Slot reserved, 15-min hold timer running
  | "expired"              // 15-min hold expired without verified deposit webhook
  | "confirmed"            // 50% deposit webhook verified, slot officially booked
  | "completed"            // Artisan confirmed service complete after start time; balance unlocked
  | "paid_in_full"         // Balance payment webhook verified; booking fully settled
  | "balance_overdue"      // 24h past completion with unpaid balance; reminders active
  | "cancelled_by_artisan" // Cancelled by artisan with required reason; triggers 100% refund
  | "cancelled_by_customer"// Cancelled by client; refund calculated per 48h policy
  | "refund_pending"       // Refund queued with payment gateway
  | "refunded";            // Gateway refund confirmed via webhook

/**
 * Strict Booking State Machine Transition Validator
 * Rejects any invalid state jump.
 */
export const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  awaiting_deposit: ["confirmed", "expired"],
  expired: [], // Terminal
  confirmed: ["completed", "cancelled_by_artisan", "cancelled_by_customer"],
  completed: ["paid_in_full", "balance_overdue"],
  balance_overdue: ["paid_in_full"],
  cancelled_by_artisan: ["refund_pending", "refunded"],
  cancelled_by_customer: ["refund_pending", "refunded"],
  refund_pending: ["refunded"],
  refunded: [], // Terminal
  paid_in_full: [], // Terminal
};

export function isValidTransition(from: BookingStatus, to: BookingStatus): boolean {
  const allowed = ALLOWED_TRANSITIONS[from];
  return Array.isArray(allowed) && allowed.includes(to);
}

/**
 * Currency Formatter: South African Rand (ZAR)
 * Formats integer cents into canonical South African notation: "R 1,200.00"
 */
export function formatZAR(cents: number): string {
  const rands = (cents / 100).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R ${rands}`;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  phone?: string;
  businessName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  referenceCode: string; // e.g. "GL-26849"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  artisanId: string;
  artisanName: string;
  artisanBusinessName?: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  endEstimatedTime: string; // HH:mm
  serviceType: "studio" | "mobile";
  locationAddress: string;
  notes?: string;

  // Financial amounts in integer cents
  totalAmountCents: number;
  depositAmountCents: number;
  balanceAmountCents: number;

  status: BookingStatus;
  holdExpiresAt: number; // Unix timestamp for 15-min hold
  completedAt?: number;
  cancellationReason?: string;
  cancelledAt?: number;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PaymentType = "deposit" | "balance";
export type PaymentStatus = "pending" | "successful" | "failed";

export interface Payment {
  id: string;
  bookingId: string;
  bookingReference: string;
  customerId: string;
  artisanId: string;
  type: PaymentType;
  amountCents: number;
  currency: "ZAR";
  status: PaymentStatus;
  gatewayProvider: "paystack";
  gatewayReference: string;
  idempotencyKey: string;
  cardLast4?: string;
  cardBrand?: string;
  channel?: "card" | "instant_eft" | "capitec_pay" | "apple_pay";
  paidAt?: string;
  createdAt: string;
}

export type ReceiptType = "deposit" | "balance" | "refund";

export interface Receipt {
  id: string;
  receiptNumber: string; // e.g. "RCT-260914"
  bookingId: string;
  bookingReference: string;
  paymentId?: string;
  type: ReceiptType;
  amountCents: number;
  balanceRemainingCents: number;
  customerName: string;
  customerEmail: string;
  artisanName: string;
  artisanBusinessName?: string;
  serviceTitle: string;
  appointmentDate: string;
  paymentMethodLast4?: string;
  issuedAt: string;
  // SARS Section 20(4) Compliance Flags
  isVatVendor: boolean;
  vatNumber?: string;
  vatAmountCents?: number;
}

export interface Refund {
  id: string;
  bookingId: string;
  bookingReference: string;
  paymentId: string;
  amountCents: number;
  reason: string;
  initiatedBy: "artisan" | "customer";
  status: "pending" | "processed" | "failed";
  gatewayRefundReference: string;
  receiptNumber: string;
  createdAt: string;
  processedAt?: string;
}

export type NotificationType =
  | "booking_created"
  | "deposit_paid"
  | "balance_unlocked"
  | "balance_paid"
  | "booking_cancelled"
  | "refund_processed"
  | "appointment_reminder_24h"
  | "balance_overdue"
  | "completion_reminder";

export interface NotificationItem {
  id: string;
  recipientId: string;
  recipientRole: Role;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  entityType: "booking" | "payment" | "refund" | "auth";
  entityId: string;
  eventName: string;
  previousState?: string;
  newState: string;
  actorId: string;
  actorRole: Role;
  metadata?: Record<string, unknown>;
  timestamp: string;
}
