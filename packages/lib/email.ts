import { Resend } from 'resend'
import { generateReceiptPDF } from './receipt'

const resend = new Resend(process.env.RESEND_API_KEY)

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || 'Store'
const STORE_TAGLINE = process.env.STORE_TAGLINE || 'Premium Hair'
const BRAND_COLOR = process.env.BRAND_COLOR || '#db2777'
const FROM_EMAIL = process.env.FROM_EMAIL || `${STORE_NAME} <onboarding@resend.dev>`

function formatGHS(amount: number): string {
  return `GH₵${amount.toFixed(2)}`
}

function orderItemsTableHtml(items: { product_name: string; product_image?: string | null; variant_name?: string | null; quantity: number; unit_price: number }[]) {
  const rows = items.map((item) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
        <div style="display: flex; align-items: center; gap: 10px;">
          ${item.product_image
            ? `<img src="${item.product_image}" alt="${item.product_name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px;" />`
            : `<div style="width: 48px; height: 48px; background: #f3f4f6; border-radius: 8px;"></div>`
          }
          <div>
            <span style="font-weight: 500;">${item.product_name}</span>
            ${item.variant_name ? `<br/><span style="color: #6b7280; font-size: 12px;">${item.variant_name}</span>` : ''}
          </div>
        </div>
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">${formatGHS(item.quantity * item.unit_price)}</td>
    </tr>
  `).join('')

  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 20px 0;">
      <thead>
        <tr style="border-bottom: 2px solid #e5e7eb;">
          <th style="text-align: left; padding: 8px 0; color: #6b7280; font-size: 12px;">Item</th>
          <th style="text-align: center; padding: 8px 0; color: #6b7280; font-size: 12px;">Qty</th>
          <th style="text-align: right; padding: 8px 0; color: #6b7280; font-size: 12px;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `
}

export async function sendWelcomeEmail({
  fullName,
  email,
}: {
  fullName: string
  email: string
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Welcome to ${STORE_NAME}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">${STORE_NAME}</h2>
        <p>Hi ${fullName},</p>
        <p>Welcome! Your account has been created successfully. You can now sign in and start shopping.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">${STORE_NAME} — ${STORE_TAGLINE}</p>
      </div>
    `,
  })
}

export async function sendNewStoreNotificationEmail({
  fullName,
  email,
  storeName,
}: {
  fullName: string
  email: string
  storeName: string
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `You now have an account on ${storeName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">${storeName}</h2>
        <p>Hi ${fullName},</p>
        <p>An account has been created for you on <strong>${storeName}</strong> using your existing email address.</p>
        <p>You can sign in using the same email and your new password for this store.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">${storeName} — ${STORE_TAGLINE}</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail({
  fullName,
  email,
  resetLink,
}: {
  fullName: string
  email: string
  resetLink: string
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Reset your ${STORE_NAME} password`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">${STORE_NAME}</h2>
        <p>Hi ${fullName},</p>
        <p>We received a request to reset your password. Click the button below to set a new one:</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="background: ${BRAND_COLOR}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p style="color: #888; font-size: 13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">${STORE_NAME} — ${STORE_TAGLINE}</p>
      </div>
    `,
  })
}

export async function sendVerificationEmail({
  fullName,
  email,
  verificationLink,
}: {
  fullName: string
  email: string
  verificationLink: string
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Verify your email — ${STORE_NAME}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">${STORE_NAME}</h2>
        <p>Hi ${fullName},</p>
        <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${verificationLink}" style="background: ${BRAND_COLOR}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; display: inline-block;">
            Verify Email
          </a>
        </p>
        <p style="color: #888; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">${STORE_NAME} — ${STORE_TAGLINE}</p>
      </div>
    `,
  })
}

export async function sendRequestNotification({
  customerName,
  customerEmail,
  productName,
  paymentUrl,
}: {
  customerName: string
  customerEmail: string
  productName: string
  paymentUrl: string
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `${productName} is available — Complete your order!`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">${STORE_NAME}</h2>
        <p>Hi ${customerName},</p>
        <p>Great news! <strong>${productName}</strong> that you requested is now available.</p>
        <p>Click the button below to complete your purchase:</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${paymentUrl}" style="background: ${BRAND_COLOR}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; display: inline-block;">
            Pay Now
          </a>
        </p>
        <p style="color: #888; font-size: 13px;">If you no longer need this product, you can ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">${STORE_NAME} — ${STORE_TAGLINE}</p>
      </div>
    `,
  })
}

interface OrderPaymentItem {
  product_name: string
  product_image: string | null
  variant_name?: string | null
  quantity: number
  unit_price: number
}

export async function sendOrderPaymentRequestEmail({
  customerName,
  customerEmail,
  totalAmount,
  paymentUrl,
  items,
}: {
  customerName: string
  customerEmail: string
  totalAmount: number
  paymentUrl: string
  items: OrderPaymentItem[]
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Payment requested for your order — ${STORE_NAME}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">${STORE_NAME}</h2>
        <p>Hi ${customerName},</p>
        <p>Payment has been requested for your order. Here's a summary:</p>

        ${orderItemsTableHtml(items)}

        <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-weight: 600; color: #92400e; font-size: 18px;">${formatGHS(totalAmount)}</p>
          <p style="margin: 4px 0 0; color: #a16207; font-size: 13px;">Payment due</p>
        </div>

        <p>Click the button below to complete your payment:</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${paymentUrl}" style="background: ${BRAND_COLOR}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; display: inline-block;">
            Pay Now
          </a>
        </p>
        <p style="color: #888; font-size: 13px;">If you have any questions about this order, please reach out to us.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">${STORE_NAME} — ${STORE_TAGLINE}</p>
      </div>
    `,
  })
}

export async function sendOrderConfirmationEmail({
  order,
  paid,
}: {
  order: OrderForEmail
  paid: boolean
}) {
  const paymentStatusHtml = paid
    ? `<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-weight: 600; color: #166534; font-size: 18px;">${formatGHS(order.total_amount)}</p>
        <p style="margin: 4px 0 0; color: #15803d; font-size: 13px;">Payment received</p>
      </div>`
    : `<div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; font-weight: 600; color: #92400e; font-size: 18px;">${formatGHS(order.total_amount)}</p>
        <p style="margin: 4px 0 0; color: #a16207; font-size: 13px;">Payment not yet made — to be arranged with the store</p>
      </div>`

  const attachments = paid ? [{
    filename: `receipt-${order.id.slice(0, 8)}.pdf`,
    content: await generateReceiptPDF(order),
  }] : []

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: paid
      ? `Order confirmed — #${order.id.slice(0, 8).toUpperCase()}`
      : `Order placed — #${order.id.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">${STORE_NAME}</h2>
        <p>Hi ${order.customer_name},</p>
        <p>${paid
          ? 'Thank you for your order! We\'ve received your payment and your order is now being processed.'
          : 'Thank you for your order! Your order has been placed successfully.'
        }</p>

        ${orderItemsTableHtml(order.order_items)}

        ${paymentStatusHtml}

        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #374151;">Shipping Details</p>
          <p style="margin: 0; color: #6b7280;">${order.customer_name}</p>
          <p style="margin: 0; color: #6b7280;">${order.shipping_address}, ${order.city}</p>
          <p style="margin: 0; color: #6b7280;">${order.region}</p>
          <p style="margin: 0; color: #6b7280;">${order.customer_phone}</p>
        </div>

        ${paid ? '<p style="font-size: 13px; color: #6b7280;">Your receipt is attached as a PDF.</p>' : ''}

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">${STORE_NAME} — ${STORE_TAGLINE}</p>
      </div>
    `,
    attachments,
  })
}

export async function sendOrderCancellationEmail({
  customerName,
  customerEmail,
  orderId,
  reason,
  orderUrl,
  items,
}: {
  customerName: string
  customerEmail: string
  orderId: string
  reason: string
  orderUrl: string
  items: OrderForEmail['order_items']
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: 'Your order has been cancelled — ${STORE_NAME}',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">${STORE_NAME}</h2>
        <p>Hi ${customerName},</p>
        <p>We're sorry to let you know that your order <strong>#${orderId.slice(0, 8)}</strong> has been cancelled.</p>
        <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; font-weight: 600; color: #92400e;">Reason for cancellation:</p>
          <p style="margin: 8px 0 0; color: #78350f;">${reason}</p>
        </div>

        ${orderItemsTableHtml(items)}

        <p>If a payment was made, a refund will be processed shortly. Please allow a few business days for it to reflect.</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${orderUrl}" style="background: ${BRAND_COLOR}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; display: inline-block;">
            View Order Details
          </a>
        </p>
        <p style="color: #888; font-size: 13px;">If you have any questions, please reach out to us.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">${STORE_NAME} — ${STORE_TAGLINE}</p>
      </div>
    `,
  })
}

interface OrderForEmail {
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
  order_items: { product_name: string; product_image?: string | null; variant_name?: string | null; quantity: number; unit_price: number }[]
}

export async function sendPaymentReceiptEmail(order: OrderForEmail) {
  const pdf = await generateReceiptPDF(order)

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: `Payment confirmed — Order #${order.id.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">${STORE_NAME}</h2>
        <p>Hi ${order.customer_name},</p>
        <p>We've received your payment. Your order is now being processed!</p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-weight: 600; color: #166534; font-size: 18px;">${formatGHS(order.total_amount)}</p>
          <p style="margin: 4px 0 0; color: #15803d; font-size: 13px;">Payment received</p>
        </div>

        ${orderItemsTableHtml(order.order_items)}

        <p style="font-size: 13px; color: #6b7280;">Your receipt is attached as a PDF.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">${STORE_NAME} — ${STORE_TAGLINE}</p>
      </div>
    `,
    attachments: [
      {
        filename: `receipt-${order.id.slice(0, 8)}.pdf`,
        content: pdf,
      },
    ],
  })
}

// Generic status update email for transitions like processing, shipped, etc.
// Not used for paid (has receipt PDF), cancelled (has reason field), or delivered (has its own template).
export async function sendOrderStatusEmail({
  order,
  status,
  message,
}: {
  order: OrderForEmail
  status: string
  message: string
}) {
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1)

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: `Order ${statusLabel} — #${order.id.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">${STORE_NAME}</h2>
        <p>Hi ${order.customer_name},</p>
        <p>${message}</p>

        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-weight: 600; color: #0369a1; font-size: 16px;">Status: ${statusLabel}</p>
          <p style="margin: 4px 0 0; color: #0284c7; font-size: 13px;">Order #${order.id.slice(0, 8).toUpperCase()}</p>
        </div>

        ${orderItemsTableHtml(order.order_items)}

        <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
          <p style="margin: 0 0 4px; font-weight: 600; color: #374151;">Total: ${formatGHS(order.total_amount)}</p>
          <p style="margin: 0; color: #6b7280;">${order.shipping_address}, ${order.city}, ${order.region}</p>
        </div>

        <p style="color: #888; font-size: 13px;">If you have any questions, please reach out to us at +233 54 220 3839.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">${STORE_NAME} — ${STORE_TAGLINE}</p>
      </div>
    `,
  })
}

export async function sendDeliveryConfirmationEmail(order: OrderForEmail) {
  const pdf = await generateReceiptPDF(order)

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: `Your order has been delivered — ${STORE_NAME}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: ${BRAND_COLOR};">${STORE_NAME}</h2>
        <p>Hi ${order.customer_name},</p>
        <p>Your order <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> has been delivered!</p>
        <p>We hope you love your new hair. Thank you for choosing ${STORE_NAME}.</p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 28px;">✨</p>
          <p style="margin: 8px 0 0; font-weight: 600; color: #166534;">Order Delivered</p>
        </div>

        ${orderItemsTableHtml(order.order_items)}

        <p style="font-size: 13px; color: #6b7280;">Your receipt is attached for your records.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">${STORE_NAME} — ${STORE_TAGLINE}</p>
      </div>
    `,
    attachments: [
      {
        filename: `receipt-${order.id.slice(0, 8)}.pdf`,
        content: pdf,
      },
    ],
  })
}
