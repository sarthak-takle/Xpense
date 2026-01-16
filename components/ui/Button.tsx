import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"
// import { Loader2 } from "lucide-react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'destructive'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        const variants = {
            primary: "bg-green-500 text-white hover:bg-green-600 shadow-md",
            secondary: "bg-gray-800 text-white hover:bg-gray-700",
            outline: "border border-gray-600 bg-transparent hover:bg-gray-800 text-gray-200",
            ghost: "hover:bg-gray-800 text-gray-400 hover:text-white",
            danger: "bg-red-500 text-white hover:bg-red-600",
            destructive: "bg-red-500 text-white hover:bg-red-600",
        }

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-6 text-lg",
            icon: "h-10 w-10 p-0 flex items-center justify-center rounded-full"
        }

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <span className="mr-2 animate-spin">⏳</span>}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
