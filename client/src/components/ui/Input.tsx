import { forwardRef, InputHTMLAttributes } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { cn } from "src/libs/utils"

const inputVariants = cva("rounded-md ring-0", {
    variants: {
        variant: {
            Light: "",
            Dark: "",
            Ghost: "bg-transparent border border-[#B0B0B0] shadow-inner placeholder-raisinBlack focus:outline-none"
        },
        inputSize: {
            default: "text-base px-4 py-2.5 font-thin",
            small: "text-base px-4 py-1.5 font-thin",
            large: ""
        },
    },
    compoundVariants: [{}],
    defaultVariants: {
        variant: "Ghost",
        inputSize: "default"
    }
})

type InputProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

const Input = forwardRef<HTMLInputElement, InputProps>(({ variant, inputSize, className, ...props }, ref) => {
    return <input {...props} ref={ref} className={cn(inputVariants({ variant, inputSize, className }))} />
})

export default Input
