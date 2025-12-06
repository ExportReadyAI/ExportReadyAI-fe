"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  // Prevent body scroll when dialog is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => onOpenChange?.(false)}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#0C4A6E]/40 backdrop-blur-sm animate-in fade-in-0" />
      {/* Content wrapper */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200"
      >
        {children}
      </div>
    </div>
  )
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative z-50 grid w-full max-w-lg gap-4 rounded-3xl border-2 border-[#e0f2fe] bg-white p-6 shadow-[0_8px_0_0_#e0f2fe] max-h-[85vh] overflow-y-auto",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-2xl font-extrabold leading-none tracking-tight text-[#0C4A6E]",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base font-medium text-[#0284C7]", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogClose = ({
  onClose,
  className,
}: {
  onClose?: () => void
  className?: string
}) => (
  <button
    onClick={onClose}
    className={cn(
      "absolute right-4 top-4 rounded-xl p-2 bg-[#F0F9FF] text-[#0284C7] transition-all hover:bg-[#7DD3FC] hover:text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0284C7]",
      className
    )}
  >
    <X className="h-5 w-5" />
    <span className="sr-only">Close</span>
  </button>
)

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3 sm:gap-0",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
