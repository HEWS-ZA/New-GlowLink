export interface Booking {
  id: string;
  artisanId: string;
  artisanName: string;
  serviceName: string;
  servicePrice: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  createdAt: string;
  isDemo?: boolean;
}

export interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalBookings: number;
  totalSpent: string;
  lastVisit: string;
  services: string[];
  isDemo?: boolean;
}

const DEMO_BOOKINGS: Booking[] = [
  {
    id: "demo_b_1",
    artisanId: "1",
    artisanName: "Thandi Mthembu",
    serviceName: "Haute Bridal Atelier",
    servicePrice: "R2,000",
    date: "2026-10-24",
    time: "14:00",
    clientName: "Sarah Johnson",
    clientEmail: "sarah.j@email.com",
    clientPhone: "+27 82 123 4567",
    status: "Confirmed",
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
  {
    id: "demo_b_2",
    artisanId: "1",
    artisanName: "Thandi Mthembu",
    serviceName: "Editorial Glam Session",
    servicePrice: "R850",
    date: "2026-10-25",
    time: "10:00",
    clientName: "Linda Peters",
    clientEmail: "linda.p@email.com",
    clientPhone: "+27 83 234 5678",
    status: "Pending",
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
  {
    id: "demo_b_3",
    artisanId: "1",
    artisanName: "Thandi Mthembu",
    serviceName: "Minimalist Signature Glow",
    servicePrice: "R550",
    date: "2026-10-27",
    time: "16:30",
    clientName: "Mary Wilson",
    clientEmail: "mary.w@email.com",
    clientPhone: "+27 84 345 6789",
    status: "Confirmed",
    createdAt: new Date().toISOString(),
    isDemo: true,
  },
];

const DEMO_CUSTOMERS: CustomerRecord[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+27 82 123 4567",
    location: "Sandton, Johannesburg",
    totalBookings: 8,
    totalSpent: "R6,400",
    lastVisit: "2026-10-10",
    services: ["Bridal Makeup", "Glam Session", "Natural Glow"],
    isDemo: true,
  },
  {
    id: 2,
    name: "Linda Peters",
    email: "linda.p@email.com",
    phone: "+27 83 234 5678",
    location: "Cape Town CBD",
    totalBookings: 5,
    totalSpent: "R3,750",
    lastVisit: "2026-10-08",
    services: ["Evening Styling", "Natural Glow"],
    isDemo: true,
  },
  {
    id: 3,
    name: "Mary Wilson",
    email: "mary.w@email.com",
    phone: "+27 84 345 6789",
    location: "Durban North",
    totalBookings: 12,
    totalSpent: "R9,600",
    lastVisit: "2026-10-12",
    services: ["Bridal Makeup", "Photoshoot Styling", "Evening Look"],
    isDemo: true,
  },
  {
    id: 4,
    name: "Thandiwe Mbeki",
    email: "thandi.m@email.com",
    phone: "+27 81 456 7890",
    location: "Pretoria East",
    totalBookings: 6,
    totalSpent: "R4,800",
    lastVisit: "2026-10-05",
    services: ["Natural Glow", "Glam Session"],
    isDemo: true,
  },
  {
    id: 5,
    name: "Jessica Brown",
    email: "jess.b@email.com",
    phone: "+27 82 567 8901",
    location: "Rosebank, Johannesburg",
    totalBookings: 10,
    totalSpent: "R8,000",
    lastVisit: "2026-10-14",
    services: ["Bridal Atelier", "Evening Styling", "Editorial Session"],
    isDemo: true,
  },
];

const BOOKINGS_KEY = "glowlink_bookings";
const CUSTOMERS_KEY = "glowlink_customers";

/**
 * Never seed default data for unauthenticated visitors!
 * Returns empty array if no bookings exist.
 */
export function getStoredBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveBookings(bookings: Booking[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }
}

export function createBooking(data: Omit<Booking, "id" | "createdAt">): Booking {
  const bookings = getStoredBookings();
  const newBooking: Booking = {
    ...data,
    id: "b_" + Date.now(),
    createdAt: new Date().toISOString(),
  };

  const updated = [newBooking, ...bookings];
  saveBookings(updated);

  // Sync to customer CRM
  syncCustomerRecord(newBooking);

  return newBooking;
}

export function updateBookingStatus(id: string, status: Booking["status"]) {
  const bookings = getStoredBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index !== -1) {
    bookings[index].status = status;
    saveBookings(bookings);
  }
}

export function cancelBooking(id: string) {
  updateBookingStatus(id, "Cancelled");
}

/**
 * Never seed default customer data for unauthenticated visitors!
 * Returns empty array if no customer records exist.
 */
export function getStoredCustomers(): CustomerRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function syncCustomerRecord(booking: Booking) {
  const customers = getStoredCustomers();
  const existing = customers.find((c) => c.email.toLowerCase() === booking.clientEmail.toLowerCase());

  if (existing) {
    existing.totalBookings += 1;
    existing.lastVisit = booking.date;
    if (!existing.services.includes(booking.serviceName)) {
      existing.services.push(booking.serviceName);
    }
  } else {
    customers.push({
      id: Date.now(),
      name: booking.clientName,
      email: booking.clientEmail,
      phone: booking.clientPhone,
      location: "Johannesburg",
      totalBookings: 1,
      totalSpent: booking.servicePrice,
      lastVisit: booking.date,
      services: [booking.serviceName],
    });
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }
}

/**
 * Explicitly seeds demo bookings and clients ONLY after an artisan logs in.
 * Clearly tagged with isDemo: true.
 */
export function seedDemoArtisanData() {
  if (typeof window === "undefined") return;
  const existingBookings = localStorage.getItem(BOOKINGS_KEY);
  if (!existingBookings) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(DEMO_BOOKINGS));
  }
  const existingCustomers = localStorage.getItem(CUSTOMERS_KEY);
  if (!existingCustomers) {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(DEMO_CUSTOMERS));
  }
}

/**
 * Clears all cached artisan data on sign-out so no residual business data persists.
 */
export function clearArtisanData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BOOKINGS_KEY);
  localStorage.removeItem(CUSTOMERS_KEY);
  localStorage.removeItem("glowlink_notifications");
}
