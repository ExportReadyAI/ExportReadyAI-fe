"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { 
  MessageCircle, 
  X,
  Sparkles
} from "lucide-react"
import { openWhatsApp } from "@/lib/utils/whatsapp"

export interface MessageTemplate {
  id: string
  name: string
  message: string
}

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: "greeting",
    name: "Sapaan Umum",
    message: "Halo {name}, saya tertarik untuk berkolaborasi dengan {company}."
  },
  {
    id: "inquiry",
    name: "Pertanyaan Produk/Layanan",
    message: "Halo {name}, saya ingin bertanya lebih lanjut tentang produk dan layanan yang {company} tawarkan."
  },
  {
    id: "partnership",
    name: "Kemitraan Bisnis",
    message: "Halo {name}, saya tertarik untuk membahas peluang kemitraan bisnis dengan {company}."
  },
  {
    id: "quote",
    name: "Request Quotation",
    message: "Halo {name}, saya ingin meminta penawaran harga untuk layanan yang {company} sediakan."
  },
  {
    id: "services",
    name: "Informasi Layanan",
    message: "Halo {name}, saya ingin mendapatkan informasi lebih detail mengenai layanan yang {company} tawarkan."
  },
  {
    id: "collaboration",
    name: "Kolaborasi",
    message: "Halo {name}, saya tertarik untuk berdiskusi mengenai peluang kolaborasi dengan {company}."
  }
]

interface WhatsAppDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phone: string
  recipientName?: string
  recipientCompany?: string
  templates?: MessageTemplate[]
}

export function WhatsAppDialog({
  open,
  onOpenChange,
  phone,
  recipientName,
  recipientCompany,
  templates = DEFAULT_TEMPLATES
}: WhatsAppDialogProps) {
  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return

    let message = template.message
    
    // Replace placeholders with actual values or fallback
    if (recipientName) {
      message = message.replace(/{name}/g, recipientName)
    } else {
      message = message.replace(/{name}/g, "")
    }
    
    if (recipientCompany) {
      message = message.replace(/{company}/g, recipientCompany)
    } else {
      message = message.replace(/{company}/g, "")
    }
    
    // Clean up any double spaces or leading/trailing spaces
    message = message.replace(/\s+/g, " ").trim()
    
    // Open WhatsApp immediately
    openWhatsApp(phone, message)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-[#0C4A6E] flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-[#25D366]" />
            Kirim Pesan WhatsApp
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Recipient Info */}
          <div className="bg-[#F0F9FF] rounded-2xl p-4 border-2 border-[#e0f2fe]">
            <p className="text-sm text-[#7DD3FC] mb-1">Mengirim ke:</p>
            <p className="font-bold text-[#0C4A6E]">
              {recipientCompany || recipientName || phone}
            </p>
            {recipientName && recipientCompany && (
              <p className="text-sm text-[#0284C7] mt-1">
                {recipientName} - {recipientCompany}
              </p>
            )}
          </div>

          {/* Template Selection */}
          <div>
            <Label className="text-[#0C4A6E] font-bold mb-3 block">
              Pilih Template Pesan
            </Label>
            <p className="text-sm text-[#7DD3FC] mb-4">
              Klik template untuk langsung membuka WhatsApp. Anda dapat mengedit pesan di aplikasi WhatsApp.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates.map((template) => {
                // Generate preview message with placeholders replaced
                let previewMessage = template.message
                if (recipientName) {
                  previewMessage = previewMessage.replace(/{name}/g, recipientName)
                } else {
                  previewMessage = previewMessage.replace(/{name}/g, "")
                }
                if (recipientCompany) {
                  previewMessage = previewMessage.replace(/{company}/g, recipientCompany)
                } else {
                  previewMessage = previewMessage.replace(/{company}/g, "")
                }
                previewMessage = previewMessage.replace(/\s+/g, " ").trim()
                
                return (
                  <Card
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="p-4 cursor-pointer transition-all border-2 border-[#e0f2fe] hover:border-[#25D366] hover:bg-[#F0F9FF] hover:shadow-[0_4px_0_0_#16a34a] active:scale-95"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366]/10 flex-shrink-0">
                        <MessageCircle className="h-5 w-5 text-[#25D366]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#0C4A6E] text-sm mb-2">
                          {template.name}
                        </p>
                        <p className="text-xs text-[#7DD3FC] line-clamp-3">
                          {previewMessage}
                        </p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#F0F9FF] rounded-2xl p-4 border-2 border-[#e0f2fe]">
            <p className="text-sm text-[#0284C7] flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Pesan akan dibuka di aplikasi WhatsApp. Anda dapat mengedit pesan sebelum mengirim.
            </p>
          </div>

          {/* Close Button */}
          <div className="pt-2">
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full rounded-2xl"
            >
              <X className="mr-2 h-4 w-4" />
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

