/**
 * WhatsApp Utility Functions
 * Format phone numbers and generate WhatsApp URLs
 */

/**
 * Format phone number for WhatsApp
 * Simply removes non-digit characters, no formatting needed
 */
export function formatPhoneForWhatsApp(phone: string): string {
  if (!phone) return ""
  // Remove all non-digit characters only
  return phone.replace(/\D/g, "")
}

/**
 * Generate WhatsApp URL with message
 */
export function generateWhatsAppUrl(phone: string, message: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`
}

/**
 * Open WhatsApp in new tab/window
 */
export function openWhatsApp(phone: string, message: string) {
  const url = generateWhatsAppUrl(phone, message)
  window.open(url, "_blank", "noopener,noreferrer")
}

