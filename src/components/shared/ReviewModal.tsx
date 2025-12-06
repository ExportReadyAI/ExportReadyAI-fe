"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { forwarderService } from "@/lib/api/services"
import { Star } from "lucide-react"

interface ReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  forwarderId: number
  onSuccess: () => void
  initialRating?: number
  initialReviewText?: string
  reviewId?: number
}

export function ReviewModal({
  open,
  onOpenChange,
  forwarderId,
  onSuccess,
  initialRating,
  initialReviewText,
  reviewId,
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating || 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState(initialReviewText || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Silakan beri rating terlebih dahulu")
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (reviewId) {
        // Update existing review
        await forwarderService.updateReview(forwarderId, reviewId, {
          rating,
          review_text: reviewText || undefined,
        })
      } else {
        // Create new review
        await forwarderService.createReview(forwarderId, {
          rating,
          review_text: reviewText || undefined,
        })
      }

      onSuccess()
      onOpenChange(false)
      setRating(0)
      setReviewText("")
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal menyimpan review"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-3xl border-2 border-[#e0f2fe] shadow-[0_6px_0_0_#0284C7] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-[#0C4A6E]">
            {reviewId ? "Edit Review" : "Beri Review"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 pt-2">
            Bagikan pengalaman Anda menggunakan layanan forwarder ini
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <Label className="text-[#0C4A6E] font-bold mb-2 block">
              Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-[#F59E0B] fill-[#F59E0B]'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="review_text" className="text-[#0C4A6E] font-bold">
              Ulasan (Opsional)
            </Label>
            <Textarea
              id="review_text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Bagikan pengalaman Anda..."
              rows={4}
              className="mt-2 rounded-2xl border-2 border-[#e0f2fe]"
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-2xl"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="rounded-2xl shadow-[0_4px_0_0_#4f46e5] bg-[#6366F1] hover:bg-[#4f46e5]"
          >
            {loading ? "Menyimpan..." : reviewId ? "Update Review" : "Kirim Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

