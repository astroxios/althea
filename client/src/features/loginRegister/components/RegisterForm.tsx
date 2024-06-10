import { useRef } from "react"
import { NavLink } from "react-router-dom"
import Button from "components/ui/Button"
import Input from "components/ui/Input"
import GoogleLogo from "assets/Logos/GoogleLogo.svg"
import Checkmark from "assets/Icons/checkIcon2.svg"
import xIcon from "assets/Icons/xIcon.svg"
import useForm from "../hooks/useForm"
import useValidity from "../hooks/useValidity"

export const RegisterForm = () => {
  const { step, manageSubmit } = useForm()
  const { validateEmail } = useValidity()
  
  const emailRef = useRef<HTMLInputElement>(null)
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const formRefs = {emailRef, usernameRef, passwordRef}

  return (
    <form onSubmit={manageSubmit(formRefs)} className="relative h-full w-full flex items-center justify-center text-center">
      <div className="absolute -z-10 w-full h-full bg-[url('assets/polygonBackground.svg')] bg-cover bg-right bg-no-repeat" />
      <div className="relative min-h-[543px] max-w-md w-full bg-white shadow-lg py-11 px-16 mx-5 rounded-2xl flex flex-col gap-1">
        <h1 className="w-full flex justify-center text-3xl pb-2 m-0 mb-4 font-semibold text-raisinBlack">Account Registration</h1>
        { step === 1 && (
        <>
          <div className="flex flex-col items-center gap-4 mt-px">
            <h1 className="text-oceanBlue text-xl font-medium">What's your email?</h1>
            <Input type="email" onChange={(e) => validateEmail(e.target.value)} ref={emailRef} placeholder="Email" className="w-full" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-full bg-raisinBlack" />
            <p className="text-center text-raisinBlack text-lg">OR</p>
            <div className="h-px w-full bg-raisinBlack" />
          </div>
          <Button variant="Ghost" className="flex items-center justify-center gap-3 text-lg hover:bg-[#ECECEC] w-full border-raisinBlack">
            <img src={GoogleLogo} alt="Google logo" className="h-6 w-auto" />
            <p className="text-[16px]">Sign up with Google</p>
          </Button>
        </>
        )}
        { step === 2 && (
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <h1 className="text-oceanBlue text-xl font-medium">What would you like to be called?</h1>
            <Input type="text" placeholder="Username" className="w-full" ref={usernameRef} />
          </div>
        )}
        { step === 3 && (
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <h1 className="text-oceanBlue text-xl font-medium">Make it discrete!</h1>
            <div className="flex flex-col w-full gap-1">
              <Input type="password" placeholder="Password" className="w-full" />
              <p className="text-sm text-start flex gap-2 items-center"><img src={Checkmark} className="h-5 border-[1px] border-[#dfdfdf] rounded-md flex gap-2 w-fit" />Password must be at least 8 characters long.</p>
              <p className="text-sm text-start flex gap-2 items-center"><img src={xIcon} className="h-5 border-[1px] border-[#dfdfdf] rounded-md flex gap-2 w-fit" />Password includes two of the following: letter, number, or symbol.</p>
            </div>
            <Input type="password" placeholder="Confirm Password" className="w-full" ref={passwordRef} />
          </div>
        )}
        <div className="absolute bottom-11 left-0 right-0 mx-auto grid gap-3 w-fit">
          <div className="w-full flex flex-col items-center gap-4">
            <Button variant="BlueHeath" size="squareMD" type="submit" className="text-2xl py-4">&#10140;</Button>
            <p>Already have an account? <NavLink to="/login" className="transition-colors text-oceanBlue hover:text-rose">Sign in</NavLink></p>
          </div>
        </div>
      </div>
    </form>
  )
}
