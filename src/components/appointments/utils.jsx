/**
 * Convert every occurence of a product to a repetition of the product ID so the backend
 * knows exactly how many products of each are being ordered and can pass that to the
 * selected plugin.
 */
export const prepareProductsForProductIDQuery = products =>
  products
    .map(prod => Array(prod.amount).fill(prod.productId))
    .flat(1)
    .sort(); // sort to get a stable identity
