import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-bold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#0284C7] text-white border-2 border-[#065985] shadow-[0_2px_0_0_#065985]",
        secondary:
          "bg-[#7DD3FC] text-[#0C4A6E] border-2 border-[#38bdf8] shadow-[0_2px_0_0_#38bdf8]",
        accent:
          "bg-[#F59E0B] text-white border-2 border-[#d97706] shadow-[0_2px_0_0_#d97706]",
        success:
          "bg-[#22C55E] text-white border-2 border-[#16a34a] shadow-[0_2px_0_0_#16a34a]",
        destructive:
          "bg-[#EF4444] text-white border-2 border-[#dc2626] shadow-[0_2px_0_0_#dc2626]",
        outline:
          "bg-white text-[#0284C7] border-2 border-[#7DD3FC] shadow-[0_2px_0_0_#e0f2fe]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
