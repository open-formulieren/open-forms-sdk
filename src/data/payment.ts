/**
 * @see `#/components/schemas/PaymentInfo` in the API spec.
 */
export interface PaymentInfo {
  type: 'get' | 'post';
  url: string;
  data: Record<string, string>;
}
