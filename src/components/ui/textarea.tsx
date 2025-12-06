import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border-2 border-[#7DD3FC] bg-white px-4 py-3 text-base font-medium text-[#0C4A6E] shadow-[0_2px_0_0_#e0f2fe] transition-all placeholder:text-[#7DD3FC]/70 focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:shadow-[0_2px_0_0_#0284C7] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F0F9FF] resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
