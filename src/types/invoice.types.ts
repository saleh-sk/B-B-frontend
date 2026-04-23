export type InvoiceStatus = 'issued'

export type InvoiceCustomer = {
  id: string
  name: string
}

export type InvoiceProduct = {
  id: string
  name: string
  category: string
  unitPriceCents: number
}

export type InvoiceDraftLineItem = {
  productId: string
  productName: string
  category: string
  quantity: number
  unitPriceCents: number
}

export type InvoiceLineItem = InvoiceDraftLineItem & {
  lineTotalCents: number
}

export type Invoice = {
  id: string
  customer: InvoiceCustomer
  createdAt: string
  status: InvoiceStatus
  lineItems: InvoiceLineItem[]
  subtotalCents: number
  totalCents: number
}

export type CreateInvoiceInput = {
  customer: InvoiceCustomer
  lineItems: InvoiceDraftLineItem[]
}
