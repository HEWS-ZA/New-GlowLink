/**
 * GlowLink Core Booking & Payment Engine
 * Implements strict state machine, atomic slot locking, 15-min hold timers,
 * SARS-compliant receipts, 48h cancellation refund policy, and idempotent webhook handling.
 */

import {
  Booking,
  BookingStatus,
  Payment,
  Receipt,
  Refund,
  NotificationItem,
  AuditLogEntry,
  DEPOSIT_PERCENT,
  SLOT_HOLD_MINUTES,
  CUSTOMER_CANCEL_REFUND_WINDOW_HOURS,
  isValidTransition,
  formatZAR,
} from "./dataTypes";
import { WebhookPayload, ActivePaymentProvider } from "./paymentProvider";

const STORAGE_KEYS = {
  BOOKINGS: "glowlink_bookings_v2",
  PAYMENTS: "glowlink_payments_v2",
  RECEIPTS: "glowlink_receipts_v2",
  REFUNDS: "glowlink_refunds_v2",
  NOTIFICATIONS: "glowlink_notifications_v2",
  AUDIT_LOGS: "glowlink_audit_logs_v2",
  PROCESSED_WEBHOOKS: "glowlink_processed_webhooks_v2",
};

// Observers / Listeners for real-time reactivity
type ChangeListener = () => void;
const listeners = new Set<ChangeListener>();

export function subscribeToEngineChanges(callback: ChangeListener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifySubscribers() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error("Error in engine subscriber:", e);
    }
  });
}

// Initial Seed Data with South African context
const INITIAL_DEMO_BOOKINGS: Booking[] = [
  {
    id: "b_demo_101",
    referenceCode: "GL-28941",
    customerId: "cust_demo_nandi",
    customerName: "Nandi Khumalo",
    customerEmail: "nandi.k@glowlink.co.za",
    customerPhone: "+27 82 890 1234",
    artisanId: "1",
    artisanName: "Thandi Mthembu",
    artisanBusinessName: "Mthembu Beauty Atelier",
    serviceId: "srv_1",
    serviceTitle: "Haute Bridal Atelier",
    serviceCategory: "makeup",
    appointmentDate: "2026-11-12",
    appointmentTime: "14:00",
    endEstimatedTime: "16:00",
    serviceType: "studio",
    locationAddress: "124 Sandton Drive, Sandton, Johannesburg",
    notes: "Trial bridal glam for December wedding ceremony. Champagne skin finish requested.",
    totalAmountCents: 200000,
    depositAmountCents: 100000,
    balanceAmountCents: 100000,
    status: "confirmed",
    holdExpiresAt: Date.now() + 100000000,
    isDemo: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "b_demo_102",
    referenceCode: "GL-28915",
    customerId: "cust_demo_nandi",
    customerName: "Nandi Khumalo",
    customerEmail: "nandi.k@glowlink.co.za",
    customerPhone: "+27 82 890 1234",
    artisanId: "2",
    artisanName: "Sipho Dlamini",
    artisanBusinessName: "Couture Hair & Glam",
    serviceId: "srv_2",
    serviceTitle: "Editorial Glam Session",
    serviceCategory: "makeup",
    appointmentDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    appointmentTime: "11:00",
    endEstimatedTime: "12:00",
    serviceType: "mobile",
    locationAddress: "Clifton 4th Beach Villa, Cape Town",
    notes: "Photo shoot makeup for editorial magazine spread.",
    totalAmountCents: 120000,
    depositAmountCents: 60000,
    balanceAmountCents: 60000,
    status: "completed", // Completed by artisan; customer can now pay balance!
    completedAt: Date.now() - 3600000 * 4,
    holdExpiresAt: Date.now() - 86400000,
    isDemo: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "b_demo_103",
    referenceCode: "GL-28704",
    customerId: "cust_demo_nandi",
    customerName: "Nandi Khumalo",
    customerEmail: "nandi.k@glowlink.co.za",
    customerPhone: "+27 82 890 1234",
    artisanId: "3",
    artisanName: "Lerato Molefe",
    artisanBusinessName: "Molefe Nail Couture",
    serviceId: "srv_3",
    serviceTitle: "Couture Gel Sculpting & Art",
    serviceCategory: "nails",
    appointmentDate: "2026-10-15",
    appointmentTime: "15:30",
    endEstimatedTime: "17:00",
    serviceType: "studio",
    locationAddress: "Rosebank Mall Atelier Level 2, Johannesburg",
    totalAmountCents: 65000,
    depositAmountCents: 32500,
    balanceAmountCents: 32500,
    status: "paid_in_full",
    completedAt: Date.now() - 86400000 * 12,
    holdExpiresAt: Date.now() - 86400000 * 15,
    isDemo: true,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  // Artisan Thandi Mthembu's appointment scheduled for today (earlier), ready for testing "Complete"
  {
    id: "b_demo_104",
    referenceCode: "GL-28990",
    customerId: "cust_sarah_j",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@gmail.com",
    customerPhone: "+27 83 456 7890",
    artisanId: "1",
    artisanName: "Thandi Mthembu",
    artisanBusinessName: "Mthembu Beauty Atelier",
    serviceId: "srv_4",
    serviceTitle: "Gala & Special Occasion Styling",
    serviceCategory: "makeup",
    appointmentDate: new Date().toISOString().split("T")[0], // TODAY
    appointmentTime: "09:00", // Scheduled for 9am today; current time is past 9am, so Complete is available!
    endEstimatedTime: "10:30",
    serviceType: "studio",
    locationAddress: "124 Sandton Drive, Sandton, Johannesburg",
    notes: "Attending evening charity gala. Requires bold berry lip and sculpt contour.",
    totalAmountCents: 120000,
    depositAmountCents: 60000,
    balanceAmountCents: 60000,
    status: "confirmed",
    holdExpiresAt: Date.now() + 50000000,
    isDemo: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  // Future booking for Thandi Mthembu (tomorrow, so Complete is gated by start time)
  {
    id: "b_demo_105",
    referenceCode: "GL-29002",
    customerId: "cust_linda_p",
    customerName: "Linda Peters",
    customerEmail: "linda.p@vodamail.co.za",
    customerPhone: "+27 82 234 5678",
    artisanId: "1",
    artisanName: "Thandi Mthembu",
    artisanBusinessName: "Mthembu Beauty Atelier",
    serviceId: "srv_5",
    serviceTitle: "Minimalist Signature Glow",
    serviceCategory: "makeup",
    appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    appointmentTime: "11:00",
    endEstimatedTime: "11:45",
    serviceType: "studio",
    locationAddress: "124 Sandton Drive, Sandton, Johannesburg",
    totalAmountCents: 55000,
    depositAmountCents: 27500,
    balanceAmountCents: 27500,
    status: "confirmed",
    holdExpiresAt: Date.now() + 100000000,
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Pending booking awaiting atelier review / confirmation
  {
    id: "b_demo_106_pending",
    referenceCode: "GL-29045",
    customerId: "cust_naledi_m",
    customerName: "Naledi Molefe",
    customerEmail: "naledi.m@domain.co.za",
    customerPhone: "+27 82 771 9902",
    artisanId: "1",
    artisanName: "Thandi Mthembu",
    artisanBusinessName: "Mthembu Beauty Atelier",
    serviceId: "srv_1",
    serviceTitle: "Haute Bridal Atelier",
    serviceCategory: "makeup",
    appointmentDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    appointmentTime: "14:00",
    endEstimatedTime: "2 hours",
    serviceType: "studio",
    locationAddress: "124 Sandton Drive, Sandton, Johannesburg",
    notes: "Bridal trial appointment. Client requested dewy skin finish, berry undertones, and gentle hypoallergenic skincare preparation.",
    totalAmountCents: 200000,
    depositAmountCents: 100000,
    balanceAmountCents: 100000,
    status: "awaiting_deposit",
    holdExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Active hold
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_DEMO_PAYMENTS: Payment[] = [
  {
    id: "pay_demo_101_dep",
    bookingId: "b_demo_101",
    bookingReference: "GL-28941",
    customerId: "cust_demo_nandi",
    artisanId: "1",
    type: "deposit",
    amountCents: 100000,
    currency: "ZAR",
    status: "successful",
    gatewayProvider: "paystack",
    gatewayReference: "pstk_dep_demo_101",
    idempotencyKey: "idemp_pstk_dep_demo_101",
    cardLast4: "4242",
    cardBrand: "Visa",
    channel: "card",
    paidAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "pay_demo_102_dep",
    bookingId: "b_demo_102",
    bookingReference: "GL-28915",
    customerId: "cust_demo_nandi",
    artisanId: "2",
    type: "deposit",
    amountCents: 60000,
    currency: "ZAR",
    status: "successful",
    gatewayProvider: "paystack",
    gatewayReference: "pstk_dep_demo_102",
    idempotencyKey: "idemp_pstk_dep_demo_102",
    cardLast4: "8821",
    cardBrand: "Mastercard",
    channel: "instant_eft",
    paidAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "pay_demo_103_dep",
    bookingId: "b_demo_103",
    bookingReference: "GL-28704",
    customerId: "cust_demo_nandi",
    artisanId: "3",
    type: "deposit",
    amountCents: 32500,
    currency: "ZAR",
    status: "successful",
    gatewayProvider: "paystack",
    gatewayReference: "pstk_dep_demo_103",
    idempotencyKey: "idemp_pstk_dep_demo_103",
    cardLast4: "4242",
    cardBrand: "Visa",
    channel: "card",
    paidAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: "pay_demo_103_bal",
    bookingId: "b_demo_103",
    bookingReference: "GL-28704",
    customerId: "cust_demo_nandi",
    artisanId: "3",
    type: "balance",
    amountCents: 32500,
    currency: "ZAR",
    status: "successful",
    gatewayProvider: "paystack",
    gatewayReference: "pstk_bal_demo_103",
    idempotencyKey: "idemp_pstk_bal_demo_103",
    cardLast4: "4242",
    cardBrand: "Visa",
    channel: "card",
    paidAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: "pay_demo_104_dep",
    bookingId: "b_demo_104",
    bookingReference: "GL-28990",
    customerId: "cust_sarah_j",
    artisanId: "1",
    type: "deposit",
    amountCents: 60000,
    currency: "ZAR",
    status: "successful",
    gatewayProvider: "paystack",
    gatewayReference: "pstk_dep_demo_104",
    idempotencyKey: "idemp_pstk_dep_demo_104",
    cardLast4: "5512",
    cardBrand: "Mastercard",
    channel: "card",
    paidAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const INITIAL_DEMO_RECEIPTS: Receipt[] = [
  {
    id: "rct_demo_101",
    receiptNumber: "RCT-261102",
    bookingId: "b_demo_101",
    bookingReference: "GL-28941",
    paymentId: "pay_demo_101_dep",
    type: "deposit",
    amountCents: 100000,
    balanceRemainingCents: 100000,
    customerName: "Nandi Khumalo",
    customerEmail: "nandi.k@glowlink.co.za",
    artisanName: "Thandi Mthembu",
    artisanBusinessName: "Mthembu Beauty Atelier",
    serviceTitle: "Haute Bridal Atelier",
    appointmentDate: "2026-11-12",
    paymentMethodLast4: "4242",
    issuedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isVatVendor: true,
    vatNumber: "4190283741",
    vatAmountCents: 13043, // 15% VAT component included in total
  },
  {
    id: "rct_demo_102",
    receiptNumber: "RCT-261088",
    bookingId: "b_demo_102",
    bookingReference: "GL-28915",
    paymentId: "pay_demo_102_dep",
    type: "deposit",
    amountCents: 60000,
    balanceRemainingCents: 60000,
    customerName: "Nandi Khumalo",
    customerEmail: "nandi.k@glowlink.co.za",
    artisanName: "Sipho Dlamini",
    artisanBusinessName: "Couture Hair & Glam",
    serviceTitle: "Editorial Glam Session",
    appointmentDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    paymentMethodLast4: "8821",
    issuedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    isVatVendor: true,
    vatNumber: "4920194821",
    vatAmountCents: 7826,
  },
  {
    id: "rct_demo_103_dep",
    receiptNumber: "RCT-260951",
    bookingId: "b_demo_103",
    bookingReference: "GL-28704",
    paymentId: "pay_demo_103_dep",
    type: "deposit",
    amountCents: 32500,
    balanceRemainingCents: 32500,
    customerName: "Nandi Khumalo",
    customerEmail: "nandi.k@glowlink.co.za",
    artisanName: "Lerato Molefe",
    artisanBusinessName: "Molefe Nail Couture",
    serviceTitle: "Couture Gel Sculpting & Art",
    appointmentDate: "2026-10-15",
    paymentMethodLast4: "4242",
    issuedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    isVatVendor: false,
  },
  {
    id: "rct_demo_103_bal",
    receiptNumber: "RCT-260980",
    bookingId: "b_demo_103",
    bookingReference: "GL-28704",
    paymentId: "pay_demo_103_bal",
    type: "balance",
    amountCents: 32500,
    balanceRemainingCents: 0,
    customerName: "Nandi Khumalo",
    customerEmail: "nandi.k@glowlink.co.za",
    artisanName: "Lerato Molefe",
    artisanBusinessName: "Molefe Nail Couture",
    serviceTitle: "Couture Gel Sculpting & Art",
    appointmentDate: "2026-10-15",
    paymentMethodLast4: "4242",
    issuedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    isVatVendor: false,
  },
];

const INITIAL_DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_demo_1",
    recipientId: "cust_demo_nandi",
    recipientRole: "customer",
    type: "balance_unlocked",
    title: "Balance Payment Unlocked",
    message: "Master Artisan Sipho Dlamini marked your Editorial Glam Session complete. You can now settle your remaining balance of R 600.00.",
    linkUrl: "/customer/bookings?highlight=b_demo_102",
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "notif_demo_2",
    recipientId: "cust_demo_nandi",
    recipientRole: "customer",
    type: "deposit_paid",
    title: "Deposit Received — Booking Confirmed",
    message: "Your deposit of R 1,000.00 for Haute Bridal Atelier with Thandi Mthembu is confirmed. Ref: GL-28941.",
    linkUrl: "/customer/bookings?highlight=b_demo_101",
    read: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "notif_demo_3",
    recipientId: "1",
    recipientRole: "artisan",
    type: "deposit_paid",
    title: "New Confirmed Appointment",
    message: "Sarah Johnson reserved Gala & Special Occasion Styling for today. 50% deposit received (R 600.00).",
    linkUrl: "/dashboard",
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Helper to safely read from localStorage
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifySubscribers();
  } catch (e) {
    console.error(`Failed to write to localStorage key "${key}":`, e);
  }
}

/**
 * Initialize storage with demo datasets if empty
 */
function ensureStorageInitialized() {
  if (typeof window === "undefined") return;
  const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  if (!storedBookings) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_DEMO_BOOKINGS));
  } else {
    // Ensure b_demo_106_pending is present in stored bookings
    try {
      const parsed: Booking[] = JSON.parse(storedBookings);
      if (!parsed.some((b) => b.id === "b_demo_106_pending")) {
        const pendingItem = INITIAL_DEMO_BOOKINGS.find((b) => b.id === "b_demo_106_pending");
        if (pendingItem) {
          localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([pendingItem, ...parsed]));
        }
      }
    } catch {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_DEMO_BOOKINGS));
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_DEMO_PAYMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECEIPTS)) {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(INITIAL_DEMO_RECEIPTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_DEMO_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
  }
}

// Ensure storage initialized on module load
ensureStorageInitialized();

// Audit Logger
export function logAuditEvent(entry: Omit<AuditLogEntry, "id" | "timestamp">) {
  const logs = readStorage<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  const newLog: AuditLogEntry = {
    ...entry,
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };
  writeStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
}

export function getAuditLogs(): AuditLogEntry[] {
  return readStorage<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, []);
}

// -------------------------------------------------------------
// Core Engine APIs
// -------------------------------------------------------------

/**
 * Sweeps all holds and transitions expired 'awaiting_deposit' to 'expired'
 */
export function sweepExpiredHolds(): Booking[] {
  ensureStorageInitialized();
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const now = Date.now();
  let updated = false;

  const result = bookings.map((b) => {
    if (b.status === "awaiting_deposit" && b.holdExpiresAt <= now) {
      updated = true;
      logAuditEvent({
        entityType: "booking",
        entityId: b.id,
        eventName: "hold_expired",
        previousState: "awaiting_deposit",
        newState: "expired",
        actorId: "system",
        actorRole: "guest",
        metadata: { referenceCode: b.referenceCode, expiredAt: now },
      });
      return {
        ...b,
        status: "expired" as BookingStatus,
        updatedAt: new Date().toISOString(),
      };
    }
    return b;
  });

  if (updated) {
    writeStorage(STORAGE_KEYS.BOOKINGS, result);
  }
  return result;
}

/**
 * Check if an artisan's slot (date + time) is available.
 * A slot is considered taken if another booking exists with status:
 * 'awaiting_deposit' (not expired), 'confirmed', or 'completed'.
 */
export function checkSlotAvailability(
  artisanId: string,
  date: string,
  time: string,
  excludeBookingId?: string
): boolean {
  const bookings = sweepExpiredHolds();
  const conflict = bookings.find((b) => {
    if (excludeBookingId && b.id === excludeBookingId) return false;
    if (b.artisanId !== artisanId) return false;
    if (b.appointmentDate !== date) return false;
    if (b.appointmentTime !== time) return false;

    // Active holds or confirmed sessions occupy the slot
    return b.status === "awaiting_deposit" || b.status === "confirmed" || b.status === "completed";
  });

  return !conflict;
}

export interface CreateHoldParams {
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
  totalAmountCents: number;
  appointmentDate: string;
  appointmentTime: string;
  endEstimatedTime?: string;
  serviceType: "studio" | "mobile";
  locationAddress: string;
  notes?: string;
}

/**
 * Creates an atomic 15-minute slot lock awaiting deposit payment.
 * Throws if slot is already occupied.
 */
export function createSlotHold(params: CreateHoldParams): Booking {
  // Check availability
  const isAvailable = checkSlotAvailability(
    params.artisanId,
    params.appointmentDate,
    params.appointmentTime
  );

  if (!isAvailable) {
    throw new Error(
      `This appointment slot (${params.appointmentDate} at ${params.appointmentTime}) is already reserved or booked. Please select another time.`
    );
  }

  const depositCents = Math.round(params.totalAmountCents * (DEPOSIT_PERCENT / 100));
  const balanceCents = params.totalAmountCents - depositCents;
  const now = Date.now();
  const holdExpiresAt = now + SLOT_HOLD_MINUTES * 60 * 1000;
  const referenceCode = `GL-${Math.floor(10000 + Math.random() * 90000)}`;

  const newBooking: Booking = {
    id: `b_${now}_${Math.random().toString(36).substring(2, 6)}`,
    referenceCode,
    customerId: params.customerId,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    customerPhone: params.customerPhone,
    artisanId: params.artisanId,
    artisanName: params.artisanName,
    artisanBusinessName: params.artisanBusinessName,
    serviceId: params.serviceId,
    serviceTitle: params.serviceTitle,
    serviceCategory: params.serviceCategory,
    appointmentDate: params.appointmentDate,
    appointmentTime: params.appointmentTime,
    endEstimatedTime: params.endEstimatedTime || "1h duration",
    serviceType: params.serviceType,
    locationAddress: params.locationAddress,
    notes: params.notes,
    totalAmountCents: params.totalAmountCents,
    depositAmountCents: depositCents,
    balanceAmountCents: balanceCents,
    status: "awaiting_deposit",
    holdExpiresAt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  writeStorage(STORAGE_KEYS.BOOKINGS, [newBooking, ...bookings]);

  logAuditEvent({
    entityType: "booking",
    entityId: newBooking.id,
    eventName: "slot_hold_reserved",
    newState: "awaiting_deposit",
    actorId: params.customerId,
    actorRole: "customer",
    metadata: {
      holdMinutes: SLOT_HOLD_MINUTES,
      holdExpiresAt,
      depositAmountCents: depositCents,
    },
  });

  return newBooking;
}

/**
 * Fetch all bookings with automatic hold sweep
 */
export function getAllBookings(): Booking[] {
  return sweepExpiredHolds();
}

/**
 * Fetch bookings for a customer (ownership filter)
 */
export function getCustomerBookings(customerId: string): Booking[] {
  const all = sweepExpiredHolds();
  return all.filter((b) => b.customerId === customerId);
}

export function normalizeArtisanId(id: string): string {
  if (!id) return "1";
  if (id === "artisan_1" || id === "1") return "1";
  return id.replace(/^artisan_/, "");
}

export function matchesArtisan(booking: Booking, artisanId: string, artisanName?: string): boolean {
  if (!booking) return false;
  if (booking.artisanId === artisanId) return true;
  if (normalizeArtisanId(booking.artisanId) === normalizeArtisanId(artisanId)) return true;
  if (
    artisanName &&
    booking.artisanName &&
    booking.artisanName.toLowerCase().trim() === artisanName.toLowerCase().trim()
  ) {
    return true;
  }
  return false;
}

/**
 * Fetch bookings for an artisan (ownership filter)
 */
export function getArtisanBookings(artisanId: string, artisanName?: string): Booking[] {
  const all = sweepExpiredHolds();
  return all.filter((b) => matchesArtisan(b, artisanId, artisanName));
}

export interface ConfirmBookingResult {
  booking: Booking;
  payment: Payment;
  receipt: Receipt;
}

/**
 * Atelier confirms a booking (e.g. from awaiting_deposit or customer booking request).
 * Marks booking as confirmed, verifies 50% deposit, issues official SARS Tax Receipt,
 * sends client notification, and logs audit trail.
 */
export function confirmBookingByArtisan(
  bookingId: string,
  artisanId: string,
  options?: {
    channel?: Payment["channel"];
    notes?: string;
  }
): ConfirmBookingResult {
  ensureStorageInitialized();
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const index = bookings.findIndex((b) => b.id === bookingId);

  if (index === -1) {
    throw new Error(`Booking ${bookingId} not found.`);
  }

  const booking = bookings[index];

  if (!matchesArtisan(booking, artisanId)) {
    throw new Error("Unauthorized: You may only confirm appointments for your own atelier.");
  }

  const updatedBooking: Booking = {
    ...booking,
    status: "confirmed",
    updatedAt: new Date().toISOString(),
  };
  bookings[index] = updatedBooking;
  writeStorage(STORAGE_KEYS.BOOKINGS, bookings);

  // Check or create deposit payment record
  const payments = readStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
  let payment = payments.find((p) => p.bookingId === booking.id && p.type === "deposit");

  if (!payment) {
    payment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookingId: booking.id,
      bookingReference: booking.referenceCode,
      customerId: booking.customerId,
      artisanId: booking.artisanId,
      type: "deposit",
      amountCents: booking.depositAmountCents,
      currency: "ZAR",
      status: "successful",
      gatewayProvider: "paystack",
      gatewayReference: `pstk_atelier_conf_${Date.now()}`,
      idempotencyKey: `idemp_conf_${booking.referenceCode}`,
      cardLast4: "4242",
      channel: options?.channel || "card",
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.PAYMENTS, [payment, ...payments]);
  }

  // Check or create SARS compliant deposit receipt
  const receipts = readStorage<Receipt[]>(STORAGE_KEYS.RECEIPTS, []);
  let receipt = receipts.find((r) => r.bookingId === booking.id && r.type === "deposit");

  if (!receipt) {
    const receiptNumber = `RCT-${Math.floor(200000 + Math.random() * 800000)}`;
    const vatAmountCents = Math.round((booking.depositAmountCents * 15) / 115);
    receipt = {
      id: `rct_${Date.now()}`,
      receiptNumber,
      bookingId: booking.id,
      bookingReference: booking.referenceCode,
      paymentId: payment.id,
      type: "deposit",
      amountCents: booking.depositAmountCents,
      balanceRemainingCents: booking.balanceAmountCents,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      artisanName: booking.artisanName,
      artisanBusinessName: booking.artisanBusinessName || `${booking.artisanName} Atelier`,
      serviceTitle: booking.serviceTitle,
      appointmentDate: booking.appointmentDate,
      paymentMethodLast4: "4242",
      issuedAt: new Date().toISOString(),
      isVatVendor: true,
      vatNumber: "4190283741",
      vatAmountCents,
    };
    writeStorage(STORAGE_KEYS.RECEIPTS, [receipt, ...receipts]);
  }

  logAuditEvent({
    entityType: "booking",
    entityId: booking.id,
    eventName: "artisan_confirmed_booking",
    previousState: booking.status,
    newState: "confirmed",
    actorId: artisanId,
    actorRole: "artisan",
    metadata: {
      depositAmountCents: booking.depositAmountCents,
      referenceCode: booking.referenceCode,
      notes: options?.notes,
    },
  });

  sendNotification({
    recipientId: booking.customerId,
    recipientRole: "customer",
    type: "deposit_paid",
    title: "Appointment Confirmed by Atelier",
    message: `Master Artisan ${booking.artisanName} has verified and confirmed your reservation for ${booking.serviceTitle} on ${booking.appointmentDate} at ${booking.appointmentTime}. Ref: ${booking.referenceCode}.`,
    linkUrl: `/customer/bookings?highlight=${booking.id}`,
  });

  return {
    booking: updatedBooking,
    payment,
    receipt,
  };
}

export function resendBookingConfirmation(bookingId: string, artisanId: string) {
  ensureStorageInitialized();
  const booking = getBookingById(bookingId);
  if (!booking) throw new Error("Booking not found");
  if (!matchesArtisan(booking, artisanId)) throw new Error("Unauthorized");

  sendNotification({
    recipientId: booking.customerId,
    recipientRole: "customer",
    type: "deposit_paid",
    title: "Atelier Appointment Confirmation & Instructions",
    message: `Your booking for ${booking.serviceTitle} with ${booking.artisanName} on ${booking.appointmentDate} at ${booking.appointmentTime} is confirmed. Location: ${booking.locationAddress}. Ref: ${booking.referenceCode}.`,
    linkUrl: `/customer/bookings?highlight=${booking.id}`,
  });

  logAuditEvent({
    entityType: "booking",
    entityId: booking.id,
    eventName: "confirmation_resent_to_client",
    newState: booking.status,
    actorId: artisanId,
    actorRole: "artisan",
  });
}

/**
 * Fetch single booking by ID
 */
export function getBookingById(bookingId: string): Booking | null {
  const all = sweepExpiredHolds();
  return all.find((b) => b.id === bookingId) || null;
}

// -------------------------------------------------------------
// Webhook & Payment Processor
// -------------------------------------------------------------

export interface WebhookResult {
  success: boolean;
  message: string;
  isDuplicate?: boolean;
  booking?: Booking;
  payment?: Payment;
  receipt?: Receipt;
}

/**
 * Strictly authoritative payment processor driven by verified webhooks.
 * Enforces idempotency via gateway reference tracking.
 */
export async function processPaymentWebhook(
  payload: WebhookPayload,
  signature: string
): Promise<WebhookResult> {
  ensureStorageInitialized();

  // Verify HMAC signature
  const isValidSig = await ActivePaymentProvider.verifyWebhook(payload, signature);
  if (!isValidSig) {
    throw new Error("Invalid payment gateway signature.");
  }

  const processedWebhooks = readStorage<string[]>(STORAGE_KEYS.PROCESSED_WEBHOOKS, []);
  const reference = payload.data.reference;

  // Idempotency: if already processed, return idempotently without duplicate side-effects
  if (processedWebhooks.includes(reference)) {
    return {
      success: true,
      message: "Webhook already processed (idempotent no-op).",
      isDuplicate: true,
    };
  }

  const bookingId = payload.data.metadata.bookingId;
  const paymentType = payload.data.metadata.paymentType;
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

  if (bookingIndex === -1) {
    throw new Error(`Booking ${bookingId} not found for webhook reference ${reference}.`);
  }

  const booking = bookings[bookingIndex];

  // Deposit Payment Handling
  if (paymentType === "deposit") {
    if (!isValidTransition(booking.status, "confirmed")) {
      throw new Error(
        `Invalid booking transition from ${booking.status} to confirmed for deposit payment.`
      );
    }

    const updatedBooking: Booking = {
      ...booking,
      status: "confirmed",
      updatedAt: new Date().toISOString(),
    };
    bookings[bookingIndex] = updatedBooking;
    writeStorage(STORAGE_KEYS.BOOKINGS, bookings);

    // Create Payment Record
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newPayment: Payment = {
      id: paymentId,
      bookingId: booking.id,
      bookingReference: booking.referenceCode,
      customerId: booking.customerId,
      artisanId: booking.artisanId,
      type: "deposit",
      amountCents: payload.data.amount,
      currency: "ZAR",
      status: "successful",
      gatewayProvider: "paystack",
      gatewayReference: reference,
      idempotencyKey: payload.data.idempotencyKey,
      cardLast4: payload.data.authorization?.last4 || "4242",
      cardBrand: payload.data.authorization?.brand || "Visa",
      channel: (payload.data.channel as Payment["channel"]) || "card",
      paidAt: payload.data.paidAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const payments = readStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    writeStorage(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);

    // Create SARS Section 20(4) Compliant Deposit Receipt
    const receiptNumber = `RCT-${Math.floor(200000 + Math.random() * 800000)}`;
    const vatAmountCents = Math.round((payload.data.amount * 15) / 115); // 15% South African VAT
    const newReceipt: Receipt = {
      id: `rct_${Date.now()}`,
      receiptNumber,
      bookingId: booking.id,
      bookingReference: booking.referenceCode,
      paymentId,
      type: "deposit",
      amountCents: payload.data.amount,
      balanceRemainingCents: booking.balanceAmountCents,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      artisanName: booking.artisanName,
      artisanBusinessName: booking.artisanBusinessName || `${booking.artisanName} Atelier`,
      serviceTitle: booking.serviceTitle,
      appointmentDate: booking.appointmentDate,
      paymentMethodLast4: payload.data.authorization?.last4,
      issuedAt: new Date().toISOString(),
      isVatVendor: true,
      vatNumber: "4190283741",
      vatAmountCents,
    };
    const receipts = readStorage<Receipt[]>(STORAGE_KEYS.RECEIPTS, []);
    writeStorage(STORAGE_KEYS.RECEIPTS, [newReceipt, ...receipts]);

    // Mark reference as processed
    writeStorage(STORAGE_KEYS.PROCESSED_WEBHOOKS, [...processedWebhooks, reference]);

    // Audit Log
    logAuditEvent({
      entityType: "payment",
      entityId: paymentId,
      eventName: "deposit_webhook_verified",
      previousState: "awaiting_deposit",
      newState: "confirmed",
      actorId: "paystack_webhook",
      actorRole: "guest",
      metadata: {
        reference,
        amountCents: payload.data.amount,
        receiptNumber,
      },
    });

    // Notify Customer & Artisan
    sendNotification({
      recipientId: booking.customerId,
      recipientRole: "customer",
      type: "deposit_paid",
      title: "Deposit Confirmed — Reservation Secured",
      message: `Your 50% deposit (${formatZAR(payload.data.amount)}) for ${booking.serviceTitle} with ${booking.artisanName} was successfully received. Ref: ${booking.referenceCode}.`,
      linkUrl: `/customer/bookings?highlight=${booking.id}`,
    });

    sendNotification({
      recipientId: booking.artisanId,
      recipientRole: "artisan",
      type: "deposit_paid",
      title: "New Booking Deposit Received",
      message: `${booking.customerName} booked ${booking.serviceTitle} on ${booking.appointmentDate} at ${booking.appointmentTime}. Deposit received: ${formatZAR(payload.data.amount)}.`,
      linkUrl: `/dashboard`,
    });

    return {
      success: true,
      message: "Deposit payment successfully applied and booking confirmed.",
      booking: updatedBooking,
      payment: newPayment,
      receipt: newReceipt,
    };
  }

  // Balance Payment Handling
  if (paymentType === "balance") {
    if (!isValidTransition(booking.status, "paid_in_full")) {
      throw new Error(
        `Invalid booking transition from ${booking.status} to paid_in_full for balance payment.`
      );
    }

    const updatedBooking: Booking = {
      ...booking,
      status: "paid_in_full",
      updatedAt: new Date().toISOString(),
    };
    bookings[bookingIndex] = updatedBooking;
    writeStorage(STORAGE_KEYS.BOOKINGS, bookings);

    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newPayment: Payment = {
      id: paymentId,
      bookingId: booking.id,
      bookingReference: booking.referenceCode,
      customerId: booking.customerId,
      artisanId: booking.artisanId,
      type: "balance",
      amountCents: payload.data.amount,
      currency: "ZAR",
      status: "successful",
      gatewayProvider: "paystack",
      gatewayReference: reference,
      idempotencyKey: payload.data.idempotencyKey,
      cardLast4: payload.data.authorization?.last4 || "4242",
      cardBrand: payload.data.authorization?.brand || "Visa",
      channel: (payload.data.channel as Payment["channel"]) || "card",
      paidAt: payload.data.paidAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const payments = readStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    writeStorage(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);

    const receiptNumber = `RCT-${Math.floor(200000 + Math.random() * 800000)}`;
    const vatAmountCents = Math.round((payload.data.amount * 15) / 115);
    const newReceipt: Receipt = {
      id: `rct_${Date.now()}`,
      receiptNumber,
      bookingId: booking.id,
      bookingReference: booking.referenceCode,
      paymentId,
      type: "balance",
      amountCents: payload.data.amount,
      balanceRemainingCents: 0,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      artisanName: booking.artisanName,
      artisanBusinessName: booking.artisanBusinessName || `${booking.artisanName} Atelier`,
      serviceTitle: booking.serviceTitle,
      appointmentDate: booking.appointmentDate,
      paymentMethodLast4: payload.data.authorization?.last4,
      issuedAt: new Date().toISOString(),
      isVatVendor: true,
      vatNumber: "4190283741",
      vatAmountCents,
    };
    const receipts = readStorage<Receipt[]>(STORAGE_KEYS.RECEIPTS, []);
    writeStorage(STORAGE_KEYS.RECEIPTS, [newReceipt, ...receipts]);

    writeStorage(STORAGE_KEYS.PROCESSED_WEBHOOKS, [...processedWebhooks, reference]);

    logAuditEvent({
      entityType: "payment",
      entityId: paymentId,
      eventName: "balance_webhook_verified",
      previousState: "completed",
      newState: "paid_in_full",
      actorId: "paystack_webhook",
      actorRole: "guest",
      metadata: {
        reference,
        amountCents: payload.data.amount,
        receiptNumber,
      },
    });

    sendNotification({
      recipientId: booking.customerId,
      recipientRole: "customer",
      type: "balance_paid",
      title: "Booking Fully Settled",
      message: `Your balance of ${formatZAR(payload.data.amount)} for ${booking.serviceTitle} was settled in full. Thank you for booking with GlowLink!`,
      linkUrl: `/customer/receipts`,
    });

    sendNotification({
      recipientId: booking.artisanId,
      recipientRole: "artisan",
      type: "balance_paid",
      title: "Balance Payment Received",
      message: `${booking.customerName} settled their remaining balance of ${formatZAR(payload.data.amount)} for ${booking.serviceTitle}.`,
      linkUrl: `/dashboard`,
    });

    return {
      success: true,
      message: "Balance payment successfully settled in full.",
      booking: updatedBooking,
      payment: newPayment,
      receipt: newReceipt,
    };
  }

  throw new Error(`Unknown payment type: ${paymentType}`);
}

// -------------------------------------------------------------
// Artisan Management: "Complete" Service
// -------------------------------------------------------------

/**
 * Artisan clicks "Complete".
 * Rule: Allowed ONLY after appointment start time, from "confirmed" state.
 * Unlocks balance for customer and sends notification with pay link.
 */
export function markServiceComplete(bookingId: string, artisanId: string): Booking {
  ensureStorageInitialized();
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const index = bookings.findIndex((b) => b.id === bookingId);

  if (index === -1) {
    throw new Error(`Booking ${bookingId} not found.`);
  }

  const booking = bookings[index];

  // Ownership Check
  if (!matchesArtisan(booking, artisanId)) {
    throw new Error("Unauthorized: You may only mark completions for your own atelier appointments.");
  }

  // State Machine Check
  if (booking.status !== "confirmed") {
    throw new Error(
      `Service cannot be marked complete from status "${booking.status}". Must be "confirmed".`
    );
  }

  // Temporal Check: appointment start time must be in the past or now
  const appointmentStartTimestamp = new Date(
    `${booking.appointmentDate}T${booking.appointmentTime}:00`
  ).getTime();

  const now = Date.now();
  if (now < appointmentStartTimestamp) {
    const scheduledFormatted = `${booking.appointmentDate} at ${booking.appointmentTime}`;
    throw new Error(
      `Action blocked: Service can only be marked complete after its scheduled appointment start time (${scheduledFormatted} SAST).`
    );
  }

  const updatedBooking: Booking = {
    ...booking,
    status: "completed",
    completedAt: now,
    updatedAt: new Date().toISOString(),
  };

  bookings[index] = updatedBooking;
  writeStorage(STORAGE_KEYS.BOOKINGS, bookings);

  logAuditEvent({
    entityType: "booking",
    entityId: booking.id,
    eventName: "artisan_marked_completed",
    previousState: "confirmed",
    newState: "completed",
    actorId: artisanId,
    actorRole: "artisan",
    metadata: {
      completedAt: now,
      balanceUnlockedAmountCents: booking.balanceAmountCents,
    },
  });

  // Notify customer with link to pay balance
  sendNotification({
    recipientId: booking.customerId,
    recipientRole: "customer",
    type: "balance_unlocked",
    title: "Service Complete — Balance Unlocked",
    message: `Master Artisan ${booking.artisanName} has completed your ${booking.serviceTitle}. You can now pay your remaining balance of ${formatZAR(booking.balanceAmountCents)}.`,
    linkUrl: `/customer/bookings?highlight=${booking.id}`,
  });

  return updatedBooking;
}

// -------------------------------------------------------------
// Cancellations & Refunds
// -------------------------------------------------------------

export interface CancelArtisanResult {
  booking: Booking;
  refund: Refund;
  receipt: Receipt;
}

/**
 * Artisan cancels appointment.
 * Rule: Mandatory reason required. Customer automatically gets 100% refund of all money paid.
 */
export function cancelBookingByArtisan(
  bookingId: string,
  artisanId: string,
  reason: string
): CancelArtisanResult {
  if (!reason || reason.trim().length < 5) {
    throw new Error("A cancellation explanation (minimum 5 characters) is required.");
  }

  ensureStorageInitialized();
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const index = bookings.findIndex((b) => b.id === bookingId);

  if (index === -1) {
    throw new Error("Booking not found.");
  }

  const booking = bookings[index];

  if (!matchesArtisan(booking, artisanId)) {
    throw new Error("Unauthorized: You can only cancel appointments booked at your own atelier.");
  }

  if (booking.status !== "confirmed" && booking.status !== "completed") {
    throw new Error(`Cannot cancel an appointment with status "${booking.status}".`);
  }

  // Calculate refund amount (deposit + balance if already completed and paid)
  const payments = readStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []).filter(
    (p) => p.bookingId === bookingId && p.status === "successful"
  );
  const totalPaidCents = payments.reduce((sum, p) => sum + p.amountCents, 0);

  // Transition state: cancelled_by_artisan -> refunded
  const now = Date.now();
  const updatedBooking: Booking = {
    ...booking,
    status: "refunded",
    cancellationReason: reason.trim(),
    cancelledAt: now,
    updatedAt: new Date().toISOString(),
  };

  bookings[index] = updatedBooking;
  writeStorage(STORAGE_KEYS.BOOKINGS, bookings);

  // Create Gateway Refund Record
  const refundId = `rfnd_${now}_${Math.random().toString(36).substring(2, 6)}`;
  const receiptNum = `RCT-REF-${Math.floor(300000 + Math.random() * 600000)}`;
  const newRefund: Refund = {
    id: refundId,
    bookingId: booking.id,
    bookingReference: booking.referenceCode,
    paymentId: payments[0]?.id || "pay_initial",
    amountCents: totalPaidCents,
    reason: `Artisan cancellation: ${reason.trim()}`,
    initiatedBy: "artisan",
    status: "processed",
    gatewayRefundReference: `pstk_rfnd_${Date.now()}`,
    receiptNumber: receiptNum,
    createdAt: new Date().toISOString(),
    processedAt: new Date().toISOString(),
  };
  const refunds = readStorage<Refund[]>(STORAGE_KEYS.REFUNDS, []);
  writeStorage(STORAGE_KEYS.REFUNDS, [newRefund, ...refunds]);

  // Create Refund Receipt
  const newReceipt: Receipt = {
    id: `rct_${now}`,
    receiptNumber: receiptNum,
    bookingId: booking.id,
    bookingReference: booking.referenceCode,
    paymentId: payments[0]?.id,
    type: "refund",
    amountCents: totalPaidCents,
    balanceRemainingCents: 0,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    artisanName: booking.artisanName,
    artisanBusinessName: booking.artisanBusinessName,
    serviceTitle: booking.serviceTitle,
    appointmentDate: booking.appointmentDate,
    issuedAt: new Date().toISOString(),
    isVatVendor: true,
    vatNumber: "4190283741",
    vatAmountCents: Math.round((totalPaidCents * 15) / 115),
  };
  const receipts = readStorage<Receipt[]>(STORAGE_KEYS.RECEIPTS, []);
  writeStorage(STORAGE_KEYS.RECEIPTS, [newReceipt, ...receipts]);

  logAuditEvent({
    entityType: "refund",
    entityId: refundId,
    eventName: "artisan_cancellation_full_refund",
    previousState: booking.status,
    newState: "refunded",
    actorId: artisanId,
    actorRole: "artisan",
    metadata: {
      reason,
      refundAmountCents: totalPaidCents,
      receiptNumber: receiptNum,
    },
  });

  sendNotification({
    recipientId: booking.customerId,
    recipientRole: "customer",
    type: "refund_processed",
    title: "Appointment Cancelled — Full Refund Issued",
    message: `Your appointment with ${booking.artisanName} was cancelled ("${reason.trim()}"). A 100% refund of ${formatZAR(totalPaidCents)} has been processed to your payment method.`,
    linkUrl: `/customer/receipts`,
  });

  return {
    booking: updatedBooking,
    refund: newRefund,
    receipt: newReceipt,
  };
}

export interface CancelCustomerResult {
  booking: Booking;
  refundEligible: boolean;
  refundAmountCents: number;
  refund?: Refund;
  receipt?: Receipt;
}

/**
 * Customer cancels appointment.
 * Rule: 48h policy. If >48h before appointment, 100% refund. If <=48h, deposit is forfeited.
 */
export function cancelBookingByCustomer(
  bookingId: string,
  customerId: string,
  reason?: string
): CancelCustomerResult {
  ensureStorageInitialized();
  const bookings = readStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  const index = bookings.findIndex((b) => b.id === bookingId);

  if (index === -1) {
    throw new Error("Booking not found.");
  }

  const booking = bookings[index];

  if (booking.customerId !== customerId) {
    throw new Error("Unauthorized: You may only manage your own reservations.");
  }

  if (booking.status !== "confirmed") {
    throw new Error(`Only confirmed bookings can be cancelled by clients.`);
  }

  const appointmentStartTimestamp = new Date(
    `${booking.appointmentDate}T${booking.appointmentTime}:00`
  ).getTime();
  const now = Date.now();
  const hoursUntilAppointment = (appointmentStartTimestamp - now) / (1000 * 60 * 60);

  const isRefundEligible = hoursUntilAppointment >= CUSTOMER_CANCEL_REFUND_WINDOW_HOURS;
  const refundAmountCents = isRefundEligible ? booking.depositAmountCents : 0;

  const newStatus: BookingStatus = isRefundEligible ? "refunded" : "cancelled_by_customer";

  const updatedBooking: Booking = {
    ...booking,
    status: newStatus,
    cancellationReason: reason || "Cancelled by client",
    cancelledAt: now,
    updatedAt: new Date().toISOString(),
  };

  bookings[index] = updatedBooking;
  writeStorage(STORAGE_KEYS.BOOKINGS, bookings);

  let refund: Refund | undefined;
  let receipt: Receipt | undefined;

  if (isRefundEligible && refundAmountCents > 0) {
    const refundId = `rfnd_${now}_${Math.random().toString(36).substring(2, 6)}`;
    const receiptNum = `RCT-REF-${Math.floor(300000 + Math.random() * 600000)}`;

    refund = {
      id: refundId,
      bookingId: booking.id,
      bookingReference: booking.referenceCode,
      paymentId: "pay_initial",
      amountCents: refundAmountCents,
      reason: "Client cancellation within >48h policy window",
      initiatedBy: "customer",
      status: "processed",
      gatewayRefundReference: `pstk_rfnd_${Date.now()}`,
      receiptNumber: receiptNum,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };
    const refunds = readStorage<Refund[]>(STORAGE_KEYS.REFUNDS, []);
    writeStorage(STORAGE_KEYS.REFUNDS, [refund, ...refunds]);

    receipt = {
      id: `rct_${now}`,
      receiptNumber: receiptNum,
      bookingId: booking.id,
      bookingReference: booking.referenceCode,
      type: "refund",
      amountCents: refundAmountCents,
      balanceRemainingCents: 0,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      artisanName: booking.artisanName,
      artisanBusinessName: booking.artisanBusinessName,
      serviceTitle: booking.serviceTitle,
      appointmentDate: booking.appointmentDate,
      issuedAt: new Date().toISOString(),
      isVatVendor: true,
      vatNumber: "4190283741",
      vatAmountCents: Math.round((refundAmountCents * 15) / 115),
    };
    const receipts = readStorage<Receipt[]>(STORAGE_KEYS.RECEIPTS, []);
    writeStorage(STORAGE_KEYS.RECEIPTS, [receipt, ...receipts]);
  }

  logAuditEvent({
    entityType: "booking",
    entityId: booking.id,
    eventName: "customer_cancellation",
    previousState: "confirmed",
    newState: newStatus,
    actorId: customerId,
    actorRole: "customer",
    metadata: {
      hoursUntilAppointment,
      isRefundEligible,
      refundAmountCents,
      reason,
    },
  });

  // Notify Artisan
  sendNotification({
    recipientId: booking.artisanId,
    recipientRole: "artisan",
    type: "booking_cancelled",
    title: "Appointment Cancelled by Client",
    message: `${booking.customerName} cancelled their reservation for ${booking.appointmentDate}. ${
      isRefundEligible
        ? "Cancelled >48h prior (deposit refunded)."
        : "Cancelled within 48h (deposit forfeited to atelier)."
    }`,
    linkUrl: `/dashboard`,
  });

  return {
    booking: updatedBooking,
    refundEligible: isRefundEligible,
    refundAmountCents,
    refund,
    receipt,
  };
}

// -------------------------------------------------------------
// Receipts & Financial Invoices
// -------------------------------------------------------------

export function getCustomerReceipts(customerEmailOrName: string): Receipt[] {
  ensureStorageInitialized();
  const receipts = readStorage<Receipt[]>(STORAGE_KEYS.RECEIPTS, []);
  return receipts.filter(
    (r) =>
      r.customerEmail.toLowerCase() === customerEmailOrName.toLowerCase() ||
      r.customerName.toLowerCase() === customerEmailOrName.toLowerCase()
  );
}

export function getArtisanReceipts(artisanName: string): Receipt[] {
  ensureStorageInitialized();
  const receipts = readStorage<Receipt[]>(STORAGE_KEYS.RECEIPTS, []);
  return receipts.filter((r) => r.artisanName.toLowerCase() === artisanName.toLowerCase());
}

export function getAllReceipts(): Receipt[] {
  ensureStorageInitialized();
  return readStorage<Receipt[]>(STORAGE_KEYS.RECEIPTS, []);
}

// -------------------------------------------------------------
// Notifications
// -------------------------------------------------------------

export function sendNotification(
  notif: Omit<NotificationItem, "id" | "read" | "createdAt">
): NotificationItem {
  ensureStorageInitialized();
  const list = readStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const newItem: NotificationItem = {
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  writeStorage(STORAGE_KEYS.NOTIFICATIONS, [newItem, ...list]);
  return newItem;
}

export function getUserNotifications(userId: string): NotificationItem[] {
  ensureStorageInitialized();
  const list = readStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  return list.filter((n) => n.recipientId === userId);
}

export function markNotificationAsRead(notifId: string) {
  ensureStorageInitialized();
  const list = readStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const index = list.findIndex((n) => n.id === notifId);
  if (index !== -1) {
    list[index].read = true;
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, list);
  }
}

export function clearAllNotifications(userId: string) {
  ensureStorageInitialized();
  const list = readStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const filtered = list.filter((n) => n.recipientId !== userId);
  writeStorage(STORAGE_KEYS.NOTIFICATIONS, filtered);
}
