import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-12 w-full appearance-none rounded-xl border-2 border-[#7DD3FC] bg-white px-4 py-3 pr-10 text-base font-medium text-[#0C4A6E] shadow-[0_2px_0_0_#e0f2fe] transition-all focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:shadow-[0_2px_0_0_#0284C7] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F0F9FF] cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0284C7] pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
