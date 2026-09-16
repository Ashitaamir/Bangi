import emailjs from '@emailjs/browser'

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export const isEmailConfigured = Boolean(serviceId && templateId && publicKey)

export interface OrderEmailParams {
  to_email: string
  to_name: string
  order_id: string
  order_summary: string
  total: string
  fulfillment_summary: string
}

// Sends the customer's order confirmation email. Never throws -- a failed
// or unconfigured email should never block the order itself from going
// through, since the order is already safely saved in Firestore by the
// time this runs. Returns whether it actually sent.
export async function sendOrderConfirmationEmail(params: OrderEmailParams): Promise<boolean> {
  if (!isEmailConfigured) return false
  try {
    await emailjs.send(serviceId, templateId, { ...params }, { publicKey })
    return true
  } catch (err) {
    console.error('Order confirmation email failed to send:', err)
    return false
  }
}
