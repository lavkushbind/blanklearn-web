import * as React from "react"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"; // Import ReactNode

// 1. Define the Props Interface
interface InputProps extends React.ComponentProps<"input"> {
    icon?: ReactNode; // <-- NEW: Allows passing an icon component/element
    // Assuming you might have other custom props if needed, keep them here
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  // 2. Destructure 'icon' from props
  ({ className, type, icon, ...props }, ref) => {
    
    // Logic to adjust padding if icon is present
    const inputPaddingClass = icon ? "pl-10" : "pl-3"; // Adjust padding based on icon presence

    return (
      // Wrap input in a relative container to position the icon absolutely
      <div className="relative flex items-center w-full">
        
        {/* 3. Render the Icon if provided */}
        {icon && (
          <div className="absolute left-3 pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          // Apply padding class dynamically
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            inputPaddingClass, // Apply padding adjustment here
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }