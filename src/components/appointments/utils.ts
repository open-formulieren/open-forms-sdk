import type {AppointmentProduct} from '@/data/appointments';

/**
 * Convert every occurence of a product to a repetition of the product ID so the backend
 * knows exactly how many products of each are being ordered and can pass that to the
 * selected plugin.
 */
export const prepareProductsForProductIDQuery = (products: AppointmentProduct[]): string[] =>
  products
    .map(prod => Array<string>(prod.amount).fill(prod.productId))
    .flat(1)
    .sort(); // sort to get a stable identity
