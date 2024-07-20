import { useState } from "react"
import { useNavigate } from "react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { registerSchema, TLoginSchema, TRegisterSchema, cookieOptions } from "types/loginRegister"
import { useAuth } from "src/contexts/AuthContext"

export const useCustomForm = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [step, setStep] = useState(1)

    const nextStep = () => {
        setStep(step => step + 1)
    }

    const { 
        setError,
        } = useForm<TRegisterSchema>({
            resolver: zodResolver(registerSchema),
        })

    const submitRegisterForm = async (data: TRegisterSchema) => {
        console.log(data.email, data.username, data.password)
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                data: {
                    type: "user",
                    attributes: {
                        email: data.email,
                        username: data.username,
                        password: data.password
                    }
                },
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
        if (response.ok && response.headers.has("Authorization")) {
            // response status is 2xx and has Authorization header
            const token = response.headers.get("Authorization")?.split(" ")[1]
            if (token) {
                setCookie("authToken", token, { expires: 7, path: "/" })
                login()
                console.log("logged in")
                navigate("/config")
            }
            login()
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

    const submitLoginForm = async (data: TLoginSchema) => {
        console.log(data.email, data.password)

        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                data: {
                    type: "user",
                    attributes: {
                        email: data.email,
                        password: data.password
                    }
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const responseData = await response.json()
        console.log(responseData)

        if (response.ok && response.headers.has("Authorization")) {
            const token = response.headers.get("Authorization")?.split(" ")[1];
            if (token) {
                setCookie("authToken", token, { expires: 7, path: "/" });
                login();
                console.log("logged in");
                navigate("/config")
            }
        } else {
            // handle login errors
            alert("Login failed.");
        }
    }

    const setCookie = (name: string, value: string, options: cookieOptions = {}) => {
        // Construct a cookie string by encoding the name and value to ensure safe URL usage
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
        if (options.expires !== undefined) {
            let expires = options.expires;
            if (typeof expires === "number") {
                const date = new Date();
                date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
                expires = date;
            }
            if (expires instanceof Date && expires.toUTCString) {
                cookieString += `; expires=${expires.toUTCString()}`;
            }
        }
    
        if (options.path) {
            cookieString += `; path=${options.path}`;
        }
        if (options.domain) {
            cookieString += `; domain=${options.domain}`;
        }
        if (options.secure) {
            cookieString += '; Secure';
        }
        if (options.httpOnly) {
            cookieString += '; HttpOnly';
        }
        if (options.sameSite) {
            cookieString += `; SameSite=${options.sameSite}`;
        }
    
        document.cookie = cookieString;
    }

    return {
        step,
        nextStep,
        submitRegisterForm,
        submitLoginForm,
    }
}
