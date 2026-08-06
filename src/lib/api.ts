// Client for the Central Order Management microservice.
// Docs: API_DOCUMENTATION (3).md. Base URL is configurable via NEXT_PUBLIC_API_URL.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://www.microservices.tech";

const TOKEN_KEY = "novera-token";
const USER_KEY = "novera-user";

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  date_of_birth?: string;
  nationality?: string;
  country_of_residence?: string;
  role: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: ApiUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("novera-auth-change"));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("novera-auth-change"));
}

export function getCurrentUser(): ApiUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ApiUser) : null;
  } catch {
    return null;
  }
}

type ApiInit = Omit<RequestInit, "body" | "headers"> & {
  json?: unknown;
  body?: BodyInit | null;
  headers?: Record<string, string>;
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Errors from this API come in several shapes; pull the first useful string.
function extractError(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    for (const k of ["error", "message"] as const) {
      const v = d[k];
      if (typeof v === "string" && v) return v;
    }
  }
  return fallback;
}

export async function api<T = unknown>(
  path: string,
  init: ApiInit = {}
): Promise<T> {
  const { json, auth, headers = {}, body, ...rest } = init;

  const finalHeaders: Record<string, string> = { ...headers };
  let finalBody: BodyInit | null | undefined = body;

  if (json !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = JSON.stringify(json);
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, { ...rest, headers: finalHeaders, body: finalBody });
  } catch (e) {
    throw new ApiError(
      e instanceof Error ? e.message : "Network error",
      0,
      null
    );
  }

  let data: unknown = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await res.text();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    throw new ApiError(
      extractError(data, `Request failed (${res.status})`),
      res.status,
      data
    );
  }

  return data as T;
}

// Fires the shared-email order confirmation (see /shared-email at the repo
// root)
export async function sendOrderConfirmationEmail(params: {
  customer: { name: string; email: string };
  order: Record<string, unknown>;
}): Promise<void> {
  try {
    await fetch("/api/send-order-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch (err) {
    console.error("[checkout] order confirmation email failed:", err);
  }
}

// Manual bank-transfer payment capture — for orders an admin sends a
// "complete your payment" link for (/payment-capture/[token]). The token
// itself is the auth; no bearer header is sent. Monetary fields on the order
// row come back as strings (Postgres NUMERIC), same as elsewhere in this API.
export type PaymentCaptureOrder = {
  id: number;
  order_number: string;
  customer_email: string;
  customer_name?: string | null;
  currency?: string;
  subtotal?: number | string;
  shipping?: number | string;
  total?: number | string;
  status: string;
  payment_status: string;
  promo_code?: string | null;
  discount_amount?: number | string | null;
  created_at: string;
};

export type PaymentCaptureItem = {
  id: number;
  name: string;
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
};

export type PaymentCapturePayment = {
  id: number;
  provider: string;
  amount: number | string;
  currency: string;
  status: string;
  created_at: string;
};

export type PaymentCaptureBank = {
  payeeName: string;
  sortCode: string;
  accountNumber: string;
  reference: string;
};

export type PaymentCaptureValidateResponse = {
  ok: true;
  order: PaymentCaptureOrder;
  items: PaymentCaptureItem[];
  payments: PaymentCapturePayment[];
  allowPromo: boolean;
  bank: PaymentCaptureBank;
};

export type PaymentCapturePromoResponse = {
  ok: true;
  promoCode: string;
  promoDiscountPercent: number;
  discountAmount: number;
  total: number;
};

export type PaymentCaptureUploadResponse = {
  ok: true;
  screenshotUrl: string;
  screenshotFilename: string;
  verification: unknown;
  payment_status: "received" | "rejected" | "pending";
  verification_error?: string;
};

// GET /api/user-orders/by-email — used by the account "My Orders" page.
// Monetary fields come back as strings (Postgres NUMERIC), same convention
// as the payment-capture types above.
export type UserOrder = {
  id: number;
  order_number: string;
  customer_email: string;
  customer_name?: string | null;
  currency?: string;
  subtotal?: number | string;
  shipping?: number | string;
  total?: number | string;
  discount_amount?: number | string | null;
  promo_code?: string | null;
  status: string;
  payment_status: string;
  tracking_number?: string | null;
  address?: string | null;
  city?: string | null;
  postcode?: string | null;
  country?: string | null;
  created_at: string;
};

export function getOrdersByEmail(email: string) {
  return api<{ orders: UserOrder[] }>(
    `/api/user-orders/by-email?email=${encodeURIComponent(email)}`
  );
}

// GET /api/user-orders/:orderNumber — single-order lookup, used by the public
// "Track Order" page. No auth; the caller-supplied email is checked
// client-side against the returned order before anything is shown.
export function getOrderByNumber(orderNumber: string) {
  return api<{
    order: UserOrder;
    items: PaymentCaptureItem[];
    payments: PaymentCapturePayment[];
  }>(`/api/user-orders/${encodeURIComponent(orderNumber)}`);
}

export const paymentCapture = {
  validate: (token: string) =>
    api<PaymentCaptureValidateResponse>("/api/payment-capture/validate", {
      method: "POST",
      json: { token },
    }),

  applyPromo: (token: string, promoCode: string) =>
    api<PaymentCapturePromoResponse>("/api/payment-capture/apply-promo", {
      method: "POST",
      json: { token, promoCode },
    }),

  // Multipart upload — leave Content-Type unset so the browser attaches its
  // own boundary, same as every other `body`-based call through `api()`.
  upload: (token: string, file: File) => {
    const form = new FormData();
    form.append("token", token);
    form.append("paymentScreenshot", file);
    return api<PaymentCaptureUploadResponse>("/api/payment-capture/upload", {
      method: "POST",
      body: form,
    });
  },
};
