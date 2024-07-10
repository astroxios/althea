import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { registerSchema, TLoginSchema, TRegisterSchema } from "types/loginRegister"

export const useCustomForm = () => {
    const [step, setStep] = useState(1)

    useEffect(() => {
        console.log(step)
    }, [step])

    const nextStep = () => {
        setStep(step => step + 1)
    }

    const { 
        setError,
        } = useForm<TRegisterSchema>({
            resolver: zodResolver(registerSchema),
        })

    const submitRegisterForm = async (data: TRegisterSchema) => {
        console.log("entered onSubmitFinal")
        console.log(data.email, data.username, data.password)
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: data.email,
                username: data.username,
                password: data.password,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const responseData = await response.json()
        console.log(responseData)

        if (!response.ok) {
            // response status is not 2xx
            alert("Form submission failed.")
            return  
        }

        if (responseData.errors) {
            const errors = responseData.errors

            if (errors.email) {
                setError("email", {
                    type: "server",
                    message: errors.email
                })
            } else if (errors.username) {
                setError("username", {
                    type: "server",
                    message: errors.username
                })
            } else if (errors.password) {
                setError("password", {
                    type: "server",
                    message: errors.password
                })
            } else if (errors.confirmPassword) {
                setError("confirmPassword", {
                    type: "server",
                    message: errors.confirmPassword
                })
            } else {
                alert("Something went wrong.")
            }
        }

        // reset()
    }

    const submitLoginForm = (data: TLoginSchema) => {
        console.log("entered submitLoginForm", data)
    }

    return {
        step,
        nextStep,
        submitRegisterForm,
        submitLoginForm,
    }
}
