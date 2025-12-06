import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:translate-y-1 active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#0284C7] text-white rounded-2xl shadow-[0_4px_0_0_#065985] hover:bg-[#0369a1] hover:shadow-[0_4px_0_0_#064e7a] border-2 border-[#065985]",
        secondary:
          "bg-[#7DD3FC] text-[#0C4A6E] rounded-2xl shadow-[0_4px_0_0_#38bdf8] hover:bg-[#67c9fa] border-2 border-[#38bdf8]",
        accent:
          "bg-[#F59E0B] text-white rounded-2xl shadow-[0_4px_0_0_#d97706] hover:bg-[#e89309] border-2 border-[#d97706]",
        destructive:
          "bg-[#EF4444] text-white rounded-2xl shadow-[0_4px_0_0_#dc2626] hover:bg-[#e03c3c] border-2 border-[#dc2626]",
        success:
          "bg-[#22C55E] text-white rounded-2xl shadow-[0_4px_0_0_#16a34a] hover:bg-[#1eb854] border-2 border-[#16a34a]",
        outline:
          "bg-white text-[#0284C7] rounded-2xl shadow-[0_4px_0_0_#e0f2fe] hover:bg-[#f0f9ff] border-2 border-[#7DD3FC] hover:border-[#0284C7]",
        ghost:
          "text-[#0284C7] rounded-2xl hover:bg-[#e0f2fe] hover:text-[#0369a1]",
        link:
          "text-[#0284C7] underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-xl px-4 text-sm",
        lg: "h-14 rounded-2xl px-8 text-lg",
        xl: "h-16 rounded-2xl px-10 text-xl",
        icon: "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
