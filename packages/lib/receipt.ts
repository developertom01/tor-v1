import PDFDocument from 'pdfkit'

interface OrderItem {
  product_name: string
  quantity: number
  unit_price: number
}

interface ReceiptOrder {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  city: string
  region: string
  total_amount: number
  paystack_reference: string | null
  created_at: string
  order_items: OrderItem[]
}

// Use "GHS" instead of "GH₵" — PDFKit's built-in Helvetica doesn't support the Cedi symbol
function formatGHS(amount: number): string {
  return `GHS ${amount.toFixed(2)}`
}

export async function generateReceiptPDF(order: ReceiptOrder): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const brandColor = process.env.BRAND_COLOR || '#db2777'
    const gray = '#6b7280'
    const dark = '#111827'

    // Header
    const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Store'
    const storeTagline = process.env.STORE_TAGLINE || 'Premium Hair'
    doc.fontSize(22).fillColor(brandColor).text(storeName, { align: 'left' })
    doc.fontSize(10).fillColor(gray).text(storeTagline, { align: 'left' })
    doc.moveDown(0.5)

    // Receipt title
    doc.fontSize(16).fillColor(dark).text('Payment Receipt', { align: 'left' })
    doc.moveDown(0.3)

    // Divider
    doc.strokeColor('#e5e7eb').lineWidth(1)
      .moveTo(50, doc.y).lineTo(545, doc.y).stroke()
    doc.moveDown(0.8)

    // Order info columns
    const infoY = doc.y
    doc.fontSize(9).fillColor(gray).text('Order ID', 50, infoY)
    doc.fontSize(10).fillColor(dark).text(`#${order.id.slice(0, 8).toUpperCase()}`, 50, infoY + 13)

    if (order.paystack_reference) {
      doc.fontSize(9).fillColor(gray).text('Reference', 200, infoY)
      doc.fontSize(10).fillColor(dark).text(order.paystack_reference, 200, infoY + 13)
    }

    doc.fontSize(9).fillColor(gray).text('Date', 400, infoY)
    doc.fontSize(10).fillColor(dark).text(
      new Date(order.created_at).toLocaleDateString('en-GH', {
        year: 'numeric', month: 'long', day: 'numeric',
      }),
      400, infoY + 13,
    )

    doc.y = infoY + 40
    doc.moveDown(0.5)

    // Customer info
    doc.fontSize(11).fillColor(dark).text('Bill To', 50, doc.y, { underline: false })
    doc.moveDown(0.3)
    doc.fontSize(10).fillColor(dark).text(order.customer_name)
    doc.fontSize(9).fillColor(gray).text(order.customer_email)
    doc.text(order.customer_phone)
    doc.moveDown(0.3)
    doc.text(`${order.shipping_address}, ${order.city}`)
    doc.text(order.region)
    doc.moveDown(1)

    // Table header
    const tableTop = doc.y
    doc.rect(50, tableTop, 495, 24).fill('#f9fafb')

    doc.fontSize(9).fillColor(gray)
    doc.text('Item', 60, tableTop + 7)
    doc.text('Qty', 350, tableTop + 7, { width: 50, align: 'center' })
    doc.text('Price', 410, tableTop + 7, { width: 60, align: 'right' })
    doc.text('Total', 480, tableTop + 7, { width: 55, align: 'right' })

    doc.y = tableTop + 28

    // Table rows
    for (const item of order.order_items) {
      const rowY = doc.y
      const lineTotal = item.quantity * item.unit_price

      doc.fontSize(10).fillColor(dark)
      doc.text(item.product_name, 60, rowY, { width: 280 })
      doc.fontSize(9).fillColor(gray)
      doc.text(String(item.quantity), 350, rowY, { width: 50, align: 'center' })
      doc.text(formatGHS(item.unit_price), 410, rowY, { width: 60, align: 'right' })
      doc.fontSize(10).fillColor(dark)
      doc.text(formatGHS(lineTotal), 480, rowY, { width: 55, align: 'right' })

      doc.y = rowY + 22
      doc.strokeColor('#f3f4f6').lineWidth(0.5)
        .moveTo(50, doc.y).lineTo(545, doc.y).stroke()
      doc.y += 4
    }

    doc.moveDown(0.5)

    // Total
    doc.strokeColor('#e5e7eb').lineWidth(1)
      .moveTo(380, doc.y).lineTo(545, doc.y).stroke()
    doc.moveDown(0.4)

    doc.fontSize(12).fillColor(dark)
    doc.text('Total', 380, doc.y, { continued: false })
    doc.fontSize(14).fillColor(brandColor)
    doc.text(formatGHS(order.total_amount), 480, doc.y - 14, { width: 55, align: 'right' })

    doc.moveDown(2)

    // Footer divider
    doc.strokeColor('#e5e7eb').lineWidth(1)
      .moveTo(50, doc.y).lineTo(545, doc.y).stroke()
    doc.moveDown(0.5)

    doc.fontSize(9).fillColor(gray)
    doc.text(`Thank you for shopping with ${storeName}!`, { align: 'center' })
    doc.text('For questions about your order, please contact us.', { align: 'center' })

    doc.end()
  })
}
