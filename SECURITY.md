# SECURITY.md — GlowLink Security Policy & Standards

## 1. Security Overview & Philosophy

**GlowLink** handles high-touch client data, booking reservations, personal contact details, and transactions for luxury beauty services. Security is treated as an architectural foundation rather than an afterthought.

This document outlines the security posture, vulnerability handling procedures, input sanitization protocols, and integration rules governing the codebase.

---

## 2. Threat Model & Boundaries

### 2.1 Threat Vectors Addressed
1. **Client-Side Data Injection / XSS**: Malicious payloads injected through search bars, concierge contact forms, or booking notes.
2. **Credential & Token Leakage**: Exposure of API keys, payment gateway tokens, or session identifiers in client bundles or repositories.
3. **Impersonation & Authorization Bypass**: Unauthorized modification of booking slots, artist schedules, or client profile data.
4. **Third-Party Dependency Vulnerabilities**: Malicious or compromised packages introduced via `npm`.
5. **Iframe & Sandbox Escape**: Security boundary violations within containerized dev or preview environments.

---

## 3. Input Validation & XSS Prevention

### 3.1 Strict JSX Output Escaping
- GlowLink strictly prohibits raw HTML injection via `dangerouslySetInnerHTML`.
- All dynamic user inputs (client names, search queries, reviews, salon descriptions) are rendered through React’s virtual DOM, which automatically escapes strings before inserting them into the DOM tree.

### 3.2 Form & Query Sanitization
- **Phone Numbers**: Validated to enforce South African format standards (`+27` or `0xx-xxx-xxxx`).
- **Dates & Times**: Parsed and validated through strict calendar boundaries to prevent past date booking or malformed timestamps.
- **Search Query Parameters**: Trimmed and sanitized against SQL/NoSQL injection patterns and regex-based denial-of-service (ReDoS) payloads.

### 3.3 Text Splitting & DOM Safety
When splitting text for animations via `splitText()`:
- The library is invoked with `{ accessible: true }`.
- Under no circumstances is user-generated HTML passed directly to the text splitter. Only static or pre-sanitized strings are split into animated span containers.

---

## 4. Secrets Management & Environment Isolation

### 4.1 Strict Client/Server Separation
- **No Private Keys in Client Code**: Never store secret keys, database credentials, or payment gateway private keys in files accessed by the browser bundle.
- **Client Environment Variables**: Only variables prefixed with `VITE_` are exposed to the client application. These must contain non-sensitive configuration values only (e.g. public endpoints, analytics IDs).
- **Server-Side API Proxying**: Any external service requiring authentication (e.g., Google Gemini API, payment gateways like PayFast/Peach, SMS aggregators) must be proxied via backend endpoints (`/api/*`) running in Node/Express.

### 4.2 Git & Repository Hygiene
- The repository enforces strict `.gitignore` patterns preventing accidental commits of:
  - `.env`, `.env.local`, `.env.production`
  - Private credential files (`*.pem`, `*.key`)
  - Server configuration containing production secrets

---

## 5. Authentication & Authorization Architecture

### 5.1 Role-Based Access Control (RBAC)
The GlowLink platform supports two primary roles:
1. **Client**: Access to browse artisans, book appointments, view personal appointment history, and submit reviews.
2. **Artisan / Salon Partner**: Access to manage portfolio photos, set service menus and pricing, adjust calendar availability, and confirm or reschedule appointments.

### 5.2 Session Management
- **Token Storage**: In production, authentication tokens (JWTs) must be stored in secure, `HttpOnly`, `SameSite=Lax`, `Secure` cookies to protect against client-side script theft (XSS).
- **Session Expiration**: Inactive sessions are set to expire automatically, requiring re-authentication for sensitive actions (e.g., altering payout banking details).

---

## 6. Iframe Sandbox & Runtime Constraints

Within the AI Studio Build environment:
- **Port 3000 Enforcement**: The dev server runs strictly on port `3000`.
- **Restricted Web APIs**: Avoid reliance on blocking modal dialogs like `window.alert()`, `window.confirm()`, or `window.open()`. The application uses non-blocking custom luxury toast dialogs (`sonner`) and liquid glass modal dialogs.
- **Cross-Origin Protection**: Static assets and API routes must serve appropriate `Cross-Origin-Resource-Policy` and `Cross-Origin-Opener-Policy` headers.

---

## 7. Dependency Security & Vulnerability Auditing

To maintain software supply chain integrity:
1. **Audit Check**: Run `npm audit` during continuous integration and prior to every production release.
2. **Strict Versioning**: Use explicit dependency versions or narrow caret ranges to avoid unintentional upstream breaking changes.
3. **No Unvetted Packages**: Do not install unverified or low-reputation npm packages. Standardize on battle-tested libraries (`animejs`, `lucide-react`, `tailwindcss`, `clsx`, `react-router-dom`).

---

## 8. Reporting a Vulnerability

If you discover a security vulnerability or potential exploit within GlowLink:
1. **Do not create a public issue** on public issue trackers.
2. Report findings directly to the security team with:
   - Description of the vulnerability and potential impact.
   - Step-by-step reproduction steps or proof-of-concept payload.
   - Suggested remediation if available.
3. The team will acknowledge receipt within 48 hours and provide a remediation timeline.
