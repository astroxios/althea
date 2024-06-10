import { cva, VariantProps } from "class-variance-authority"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "src/libs/utils"

const buttonVariants = cva("rounded-xl h-fit w-fit transition-colors", {
    variants: {
        variant: {
            BlueHeath: "bg-blueHeath hover:bg-[#434DC7] text-white",
            AthenaBlue: "bg-athenaBlue hover:bg-[#4AC7E8] text-white",
            OceanBlue: "bg-oceanBlue hover:bg-[#2267C6] text-white",
            Ghost: "bg-transparent border border-raisinBlack text-raisinBlack",
        },
        size: {
            default: "text-base px-6 py-2.5",
            xsmall: "text-sm px-2 py-1",
            small: "text-base px-4 py-1.5",
            large: "text-xl px-8 py-3.5",
            squareSM: "text-base px-4 py-4",
            squareMD: "text-base px-6 py-6",
            squareLG: "text-xl px-8 py-8",
        },
    },
    compoundVariants: [{}],
    defaultVariants: {
        variant: "BlueHeath",
        size: "default"
    }
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & {
    children: ReactNode,
}   

const Button = ({ children, variant, size, className, ...props }: ButtonProps) => {
    return <button {...props} className={cn(buttonVariants({ variant, size, className }))}>{children}</button>
}

export default Button
