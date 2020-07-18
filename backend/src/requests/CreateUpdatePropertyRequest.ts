/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateUpdatePropertyRequest {
  address: string
  neighborhood: string
  price: number
  tax: number
  fees: number
  attachmentUrl?: string
}
