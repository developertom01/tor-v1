import { Resend } from 'resend'
import { generateReceiptPDF } from './receipt'

export interface StoreEmailConfig {
  storeName: string
  tagline: string
  brandColor: string
  fromEmail: string
  apiKey: string
  logo?: string
}

interface OrderItem {
  product_name: string
  product_image?: string | null
  variant_name?: string | null
  quantity: number
  unit_price: number
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
  order_items: OrderItem[]
}

function formatGHS(amount: number): string {
  return `GH₵${amount.toFixed(2)}`
}

function orderItemsTableHtml(items: OrderItem[]) {
  const MAX = 10
  const visible = items.slice(0, MAX)
  const overflow = items.length - MAX

  const rows = visible.map((item) => `
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
      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">${formatGHS(item.unit_price)}</td>
    </tr>
  `).join('')

  const overflowRow = overflow > 0
    ? `<tr><td colspan="3" style="padding: 10px 0; font-size: 12px; color: #6b7280;">+ ${overflow} more item${overflow === 1 ? '' : 's'} — view order for full details</td></tr>`
    : ''

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <thead>
        <tr style="border-bottom: 2px solid #f3f4f6;">
          <th style="text-align: left; padding: 8px 0; font-size: 12px; color: #6b7280;">ITEM</th>
          <th style="text-align: center; padding: 8px 0; font-size: 12px; color: #6b7280;">QTY</th>
          <th style="text-align: right; padding: 8px 0; font-size: 12px; color: #6b7280;">PRICE</th>
        </tr>
      </thead>
      <tbody>${rows}${overflowRow}</tbody>
    </table>
  `
}

export class EmailService {
  private resend: Resend

  constructor(private config: StoreEmailConfig) {
    this.resend = new Resend(config.apiKey)
  }

  private footer() {
    return `
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #aaa; font-size: 12px;">${this.config.storeName} — ${this.config.tagline}</p>
    `
  }

  private header() {
    return `
      ${this.config.logo ? `<img src="${this.config.logo}" alt="${this.config.storeName}" style="height: 40px; width: auto; margin-bottom: 8px; display: block;" />` : ''}
      <h2 style="color: ${this.config.brandColor}; margin: 0 0 16px;">${this.config.storeName}</h2>
    `
  }

  private orderLinkButton(orderId: string) {
    return `
      <p style="text-align: center; margin: 24px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${orderId}" style="background: ${this.config.brandColor}; color: white; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: 600; display: inline-block; font-size: 14px;">
          View Order
        </a>
      </p>
    `
  }

  async sendWelcomeEmail({ fullName, email }: { fullName: string; email: string }) {
    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: email,
      subject: `Welcome to ${this.config.storeName}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${fullName},</p>
          <p>Welcome! Your account has been created successfully. You can now sign in and start shopping.</p>
          ${this.footer()}
        </div>
      `,
    })
  }

  async sendNewStoreNotificationEmail({ fullName, email }: { fullName: string; email: string }) {
    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: email,
      subject: `You now have an account on ${this.config.storeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${fullName},</p>
          <p>An account has been created for you on <strong>${this.config.storeName}</strong> using your existing email address.</p>
          <p>You can sign in using the same email and your new password for this store.</p>
          ${this.footer()}
        </div>
      `,
    })
  }

  async sendPasswordResetEmail({ fullName, email, resetLink }: { fullName: string; email: string; resetLink: string }) {
    const { error } = await this.resend.emails.send({
      from: this.config.fromEmail,
      to: email,
      subject: `Reset your ${this.config.storeName} password`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${fullName},</p>
          <p>We received a request to reset your password. Click the button below to set a new one:</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="background: ${this.config.brandColor}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="color: #888; font-size: 13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          ${this.footer()}
        </div>
      `,
    })
    if (error) throw new Error(error.message)
  }

  async sendAdminCreatedVerificationEmail({ fullName, email, verificationLink, storeName }: { fullName: string; email: string; verificationLink: string; storeName: string }) {
    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: email,
      subject: `Verify your account — ${this.config.storeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${fullName},</p>
          <p>An order was placed on your behalf at <strong>${storeName}</strong>, so we created an account for you.</p>
          <p>Click the button below to verify your email address and activate your account:</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${verificationLink}" style="background: ${this.config.brandColor}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; display: inline-block;">
              Verify My Account
            </a>
          </p>
          <p style="color: #888; font-size: 13px;">This link expires in 24 hours. If you weren't expecting this, you can safely ignore it.</p>
          ${this.footer()}
        </div>
      `,
    })
  }

  async sendVerificationEmail({ fullName, email, verificationLink }: { fullName: string; email: string; verificationLink: string }) {
    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: email,
      subject: `Verify your email — ${this.config.storeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${fullName},</p>
          <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${verificationLink}" style="background: ${this.config.brandColor}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p style="color: #888; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
          ${this.footer()}
        </div>
      `,
    })
  }

  async sendRequestNotification({ customerName, customerEmail, productName, paymentUrl }: {
    customerName: string; customerEmail: string; productName: string; paymentUrl: string
  }) {
    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: customerEmail,
      subject: `${productName} is available — Complete your order!`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${customerName},</p>
          <p>Great news! <strong>${productName}</strong> that you requested is now available.</p>
          <p>Click the button below to complete your purchase:</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${paymentUrl}" style="background: ${this.config.brandColor}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; display: inline-block;">
              Pay Now
            </a>
          </p>
          <p style="color: #888; font-size: 13px;">If you no longer need this product, you can ignore this email.</p>
          ${this.footer()}
        </div>
      `,
    })
  }

  async sendOrderPaymentRequestEmail({ customerName, customerEmail, totalAmount, paymentUrl, items }: {
    customerName: string; customerEmail: string; totalAmount: number; paymentUrl: string; items: OrderItem[]
  }) {
    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: customerEmail,
      subject: `Payment requested for your order — ${this.config.storeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${customerName},</p>
          <p>Payment has been requested for your order. Here's a summary:</p>
          ${orderItemsTableHtml(items)}
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-weight: 600; color: ${this.config.brandColor}; font-size: 18px;">${formatGHS(totalAmount)}</p>
            <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Payment due</p>
          </div>
          <p>Click the button below to complete your payment:</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${paymentUrl}" style="background: ${this.config.brandColor}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; display: inline-block;">
              Pay Now
            </a>
          </p>
          <p style="color: #888; font-size: 13px;">If you have any questions about this order, please reach out to us.</p>
          ${this.footer()}
        </div>
      `,
    })
  }

  async sendOrderConfirmationEmail({ order, paid }: { order: OrderForEmail; paid: boolean }) {
    const paymentStatusHtml = paid
      ? `<div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-weight: 600; color: ${this.config.brandColor}; font-size: 18px;">${formatGHS(order.total_amount)}</p>
          <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Payment received</p>
        </div>`
      : `<div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-weight: 600; color: #374151; font-size: 18px;">${formatGHS(order.total_amount)}</p>
          <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Payment not yet made — to be arranged with the store</p>
        </div>`

    const attachments = paid ? [{
      filename: `receipt-${order.id.slice(0, 8)}.pdf`,
      content: await generateReceiptPDF(order),
    }] : []

    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: order.customer_email,
      subject: paid
        ? `Order confirmed — #${order.id.slice(0, 8).toUpperCase()}`
        : `Order placed — #${order.id.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${order.customer_name},</p>
          <p>${paid
            ? "Thank you for your order! We've received your payment and your order is now being processed."
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
          ${this.orderLinkButton(order.id)}
          ${this.footer()}
        </div>
      `,
      attachments,
    })
  }

  async sendOrderCancellationEmail({ customerName, customerEmail, orderId, reason, orderUrl, items }: {
    customerName: string; customerEmail: string; orderId: string; reason: string; orderUrl: string; items: OrderForEmail['order_items']
  }) {
    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: customerEmail,
      subject: `Your order has been cancelled — ${this.config.storeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${customerName},</p>
          <p>We're sorry to let you know that your order <strong>#${orderId.slice(0, 8)}</strong> has been cancelled.</p>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 600; color: #374151;">Reason for cancellation:</p>
            <p style="margin: 8px 0 0; color: #6b7280;">${reason}</p>
          </div>
          ${orderItemsTableHtml(items)}
          <p>If a payment was made, a refund will be processed shortly. Please allow a few business days for it to reflect.</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${orderUrl}" style="background: ${this.config.brandColor}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; display: inline-block;">
              View Order Details
            </a>
          </p>
          <p style="color: #888; font-size: 13px;">If you have any questions, please reach out to us.</p>
          ${this.footer()}
        </div>
      `,
    })
  }

  async sendOrderStatusEmail({ order, status, message }: { order: OrderForEmail; status: string; message: string }) {
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1)

    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: order.customer_email,
      subject: `Order ${statusLabel} — #${order.id.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${order.customer_name},</p>
          <p>${message}</p>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-weight: 600; color: ${this.config.brandColor}; font-size: 16px;">Status: ${statusLabel}</p>
            <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Order #${order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          ${orderItemsTableHtml(order.order_items)}
          <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
            <p style="margin: 0 0 4px; font-weight: 600; color: #374151;">Total: ${formatGHS(order.total_amount)}</p>
            <p style="margin: 0; color: #6b7280;">${order.shipping_address}, ${order.city}, ${order.region}</p>
          </div>
          ${this.orderLinkButton(order.id)}
          <p style="color: #888; font-size: 13px;">If you have any questions, please reach out to us.</p>
          ${this.footer()}
        </div>
      `,
    })
  }

  async sendPaymentReceiptEmail(order: OrderForEmail) {
    const pdf = await generateReceiptPDF(order)

    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: order.customer_email,
      subject: `Payment confirmed — Order #${order.id.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${order.customer_name},</p>
          <p>We've received your payment. Your order is now being processed!</p>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-weight: 600; color: ${this.config.brandColor}; font-size: 18px;">${formatGHS(order.total_amount)}</p>
            <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Payment received</p>
          </div>
          ${orderItemsTableHtml(order.order_items)}
          <p style="font-size: 13px; color: #6b7280;">Your receipt is attached as a PDF.</p>
          ${this.orderLinkButton(order.id)}
          ${this.footer()}
        </div>
      `,
      attachments: [{
        filename: `receipt-${order.id.slice(0, 8)}.pdf`,
        content: pdf,
      }],
    })
  }

  async sendAdminCreatedOrder({
    order,
    setupLink,
  }: {
    order: OrderForEmail
    setupLink?: string
  }) {
    const ctaHtml = setupLink
      ? `<div style="text-align: center; margin: 24px 0;">
          <a href="${setupLink}" style="display: inline-block; background: ${this.config.brandColor}; color: white; font-weight: bold; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px;">
            Set Up Your Account
          </a>
          <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">
            Use this link to set a password and track your order. The link expires in 1 hour.
          </p>
        </div>`
      : `<div style="text-align: center; margin: 24px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${order.id}" style="display: inline-block; background: ${this.config.brandColor}; color: white; font-weight: bold; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-size: 15px;">
            View Your Order
          </a>
        </div>`

    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: order.customer_email,
      subject: `Your order has been placed — ${this.config.storeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="font-size: 22px; font-weight: bold; color: #111827;">Order Placed on Your Behalf</h1>
          <p style="color: #374151;">Hi ${order.customer_name},</p>
          <p style="color: #374151;">
            An order has been placed for you by ${this.config.storeName}. Here's a summary:
          </p>

          ${orderItemsTableHtml(order.order_items)}

          <div style="border-top: 2px solid #f3f4f6; padding-top: 12px; text-align: right; font-size: 16px; font-weight: bold; color: #111827;">
            Total: ${formatGHS(order.total_amount)}
          </div>

          <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 14px; color: #374151;">
            <strong>Shipping to:</strong><br/>
            ${order.customer_name}<br/>
            ${order.shipping_address}, ${order.city}<br/>
            ${order.region}
          </div>

          ${ctaHtml}

          ${this.footer()}
        </div>
      `,
    })
  }

  async sendDeliveryConfirmationEmail(order: OrderForEmail) {
    const pdf = await generateReceiptPDF(order)

    await this.resend.emails.send({
      from: this.config.fromEmail,
      to: order.customer_email,
      subject: `Your order has been delivered — ${this.config.storeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          ${this.header()}
          <p>Hi ${order.customer_name},</p>
          <p>Your order <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> has been delivered!</p>
          <p>We hope you love your new hair. Thank you for choosing ${this.config.storeName}.</p>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 28px;">✨</p>
            <p style="margin: 8px 0 0; font-weight: 600; color: ${this.config.brandColor};">Order Delivered</p>
          </div>
          ${orderItemsTableHtml(order.order_items)}
          <p style="font-size: 13px; color: #6b7280;">Your receipt is attached for your records.</p>
          ${this.orderLinkButton(order.id)}
          ${this.footer()}
        </div>
      `,
      attachments: [{
        filename: `receipt-${order.id.slice(0, 8)}.pdf`,
        content: pdf,
      }],
    })
  }
}

// Default instance — config comes from next.config.ts which reads store.config.ts
export const emailService = new EmailService({
  storeName: process.env.NEXT_PUBLIC_STORE_NAME!,
  tagline: process.env.STORE_TAGLINE!,
  brandColor: process.env.BRAND_COLOR!,
  fromEmail: process.env.FROM_EMAIL!,
  apiKey: process.env.RESEND_API_KEY!,
  logo: process.env.STORE_LOGO,
})

// Named exports for backward compat with existing callers
export const sendWelcomeEmail = emailService.sendWelcomeEmail.bind(emailService)
export const sendNewStoreNotificationEmail = emailService.sendNewStoreNotificationEmail.bind(emailService)
export const sendPasswordResetEmail = emailService.sendPasswordResetEmail.bind(emailService)
export const sendVerificationEmail = emailService.sendVerificationEmail.bind(emailService)
export const sendAdminCreatedVerificationEmail = emailService.sendAdminCreatedVerificationEmail.bind(emailService)
export const sendRequestNotification = emailService.sendRequestNotification.bind(emailService)
export const sendOrderPaymentRequestEmail = emailService.sendOrderPaymentRequestEmail.bind(emailService)
export const sendOrderConfirmationEmail = emailService.sendOrderConfirmationEmail.bind(emailService)
export const sendOrderCancellationEmail = emailService.sendOrderCancellationEmail.bind(emailService)
export const sendOrderStatusEmail = emailService.sendOrderStatusEmail.bind(emailService)
export const sendPaymentReceiptEmail = emailService.sendPaymentReceiptEmail.bind(emailService)
export const sendDeliveryConfirmationEmail = emailService.sendDeliveryConfirmationEmail.bind(emailService)
export const sendAdminCreatedOrderEmail = emailService.sendAdminCreatedOrder.bind(emailService)
export { orderItemsTableHtml }
