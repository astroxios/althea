import { FormEvent, RefObject, useEffect, useState } from "react"

const useForm = () => {

  const [step, setStep] = useState(1)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    console.log(email, username, password)
  }, [password])

  const nextStep = () => {
    setStep(step => step + 1)
  }

  interface InputProps {
    emailRef: RefObject<HTMLInputElement>,
    usernameRef: RefObject<HTMLInputElement>,
    passwordRef: RefObject<HTMLInputElement>,
  }

  const manageSubmit = (refs: InputProps) => {
    const { emailRef, usernameRef, passwordRef } = refs

    return (e: FormEvent) => {
      // prevent the page from refreshing on form submission
      e.preventDefault()

      if (step === 1 && emailRef.current) {
        setEmail(emailRef.current.value)
        nextStep()
      } else if (step === 2 && usernameRef.current) {
        setUsername(usernameRef.current.value)
        nextStep()
      } else if (step === 3 && passwordRef.current) {
        setPassword(passwordRef.current.value)
      }
    }
  }

  return {
    step,
    nextStep,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    manageSubmit,
  }
}

export default useForm