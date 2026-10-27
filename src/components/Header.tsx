import { PublicHeader } from "./layout/PublicHeader";

/**
 * Public storefront header component.
 * Re-exports PublicHeader to prevent duplicate divergent implementations
 * and ensure zero notifications or console leakage on public views.
 */
export default PublicHeader;
export { PublicHeader, PublicHeader as Header };
