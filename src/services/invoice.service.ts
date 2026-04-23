import type {
  CreateInvoiceInput,
  Invoice,
  InvoiceDraftLineItem,
  InvoiceLineItem,
} from '../types/invoice.types'

const INVOICES_STORAGE_KEY = 'invoices'

const getSafeInvoices = (): Invoice[] => {
  const rawInvoices = localStorage.getItem(INVOICES_STORAGE_KEY)

  if (!rawInvoices) {
    return []
  }

  try {
    return JSON.parse(rawInvoices) as Invoice[]
  } catch {
    return []
  }
}

const saveInvoices = (invoices: Invoice[]) => {
  localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices))
}

const getNextInvoiceId = (invoices: Invoice[]): string => {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll('-', '')

  const highestSerialForToday = invoices.reduce((maxSerial, invoice) => {
    const idPrefix = `INV-${datePart}-`

    if (!invoice.id.startsWith(idPrefix)) {
      return maxSerial
    }

    const serialPart = Number(invoice.id.slice(idPrefix.length))
    if (!Number.isFinite(serialPart)) {
      return maxSerial
    }

    return Math.max(maxSerial, serialPart)
  }, 0)

  const nextSerial = String(highestSerialForToday + 1).padStart(4, '0')
  return `INV-${datePart}-${nextSerial}`
}

const toLineItems = (lineItems: InvoiceDraftLineItem[]): InvoiceLineItem[] => {
  return lineItems.map(item => {
    const quantity = Math.max(1, Math.floor(item.quantity))
    const lineTotalCents = quantity * item.unitPriceCents

    return {
      ...item,
      quantity,
      lineTotalCents,
    }
  })
}

export const listInvoices = (): Invoice[] => {
  return getSafeInvoices().sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )
}

export const createInvoice = (input: CreateInvoiceInput): Invoice => {
  const invoices = getSafeInvoices()
  const lineItems = toLineItems(input.lineItems)
  const subtotalCents = lineItems.reduce(
    (total, item) => total + item.lineTotalCents,
    0,
  )

  const createdInvoice: Invoice = {
    id: getNextInvoiceId(invoices),
    customer: input.customer,
    createdAt: new Date().toISOString(),
    status: 'issued',
    lineItems,
    subtotalCents,
    totalCents: subtotalCents,
  }

  saveInvoices([createdInvoice, ...invoices])
  return createdInvoice
}
