import { useState } from "react"
import { NavLink } from "react-router-dom"
import Button from "components/ui/Button"
import Input from "components/ui/Input"
import GoogleLogo from "assets/Logos/GoogleLogo.svg"
import Checkmark from "assets/Icons/checkIcon2.svg"
import xIcon from "assets/Icons/xIcon.svg"
import Rocket from "assets/Icons/rocketIcon.svg"
import Caution from "assets/Icons/cautionIcon.svg"
import { useCustomForm } from "../hooks/useCustomForm"
import { useForm } from "react-hook-form"
import { registerSchema, TRegisterSchema } from "types/loginRegister"
import { zodResolver } from "@hookform/resolvers/zod"

export const RegisterForm = () => {
  const [passwordTouched, setPasswordTouched] = useState(false)

  const { step, nextStep, submitRegisterForm } = useCustomForm()
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async () => {
    console.log("entered onSubmit")
    let fieldNames: ("email" | "username" | "password" | "confirmPassword")[] = [];
    if (step === 1) {
      fieldNames = ["email"];
    } else if (step === 2) {
      fieldNames = ["username"];
    } else if (step === 3) {
      fieldNames = ["password", "confirmPassword"];
    }

    const validationSuccess = await trigger(fieldNames)
    if (validationSuccess && step < 3) {
        nextStep()
    }
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center text-center">
      <div className="absolute -z-10 w-full h-full bg-[url('assets/polygonBackground.svg')] bg-cover bg-right bg-no-repeat" />
      <form onSubmit={handleSubmit((data) => submitRegisterForm(data))} className="relative min-h-[543px] max-w-md w-full bg-white shadow-lg py-11 px-16 mx-5 rounded-2xl flex flex-col justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="w-full flex justify-center text-3xl pb-2 m-0 mb-4 font-semibold text-raisinBlack">Account Registration</h1>
          { step === 1 && (
          <>
            <div className="flex flex-col items-center gap-4 mt-px">
              <h1 className="text-oceanBlue text-xl font-medium">What's your email?</h1>
              <Input {...register("email")} type="email" placeholder="Email" className={`w-full ${errors.email?.message ? "outline outline-rose outline-2 focus:outline-rose" : "focus:outline-oceanBlue"} outline-offset-0 focus:outline-offset-0`} />
              {errors.email && (
                <div className="flex items-center justify-center gap-2">
                  <img src={Caution} alt="caution icon" className="w-auto h-4" />
                  <p className="text-red-400 text-center">{`${errors.email.message}`}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-full bg-raisinBlack" />
              <p className="text-center text-raisinBlack text-lg">OR</p>
              <div className="h-px w-full bg-raisinBlack" />
            </div>
            <Button variant="Ghost" className="flex items-center justify-center gap-3 text-lg hover:bg-[#ECECEC] w-full border-raisinBlack hover:border-[#ECECEC]">
              <img src={GoogleLogo} alt="Google logo" className="h-6 w-auto" />
              <p className="text-[16px]">Sign up with Google</p>
            </Button>
          </>
          )}
          { step === 2 && (
            <div className="flex flex-col items-center justify-center w-full gap-4">
              <h1 className="text-oceanBlue text-xl font-medium">What would you like to be called?</h1>
              <Input {...register("username")} type="text" placeholder="Username" className={`w-full ${errors.username?.message ? "outline outline-rose outline-2 focus:outline-rose" : "focus:outline-oceanBlue"} outline-offset-0 focus:outline-offset-0`} />
              {errors.username && (
                <div className="flex items-center justify-center gap-2">
                  <img src={Caution} alt="caution icon" className="w-auto h-4" />
                  <p className="text-red-400 text-center">{`${errors.username.message}`}</p>
                </div>
              )}
            </div>
          )}
          { step === 3 && (
            <div className="flex flex-col items-center justify-center w-full gap-4">
              <h1 className="text-oceanBlue text-xl font-medium">Make it discrete!</h1>
              <div className="flex flex-col w-full gap-4">
                <Input {...register("password", {
                  onChange: () => {
                    if (!passwordTouched) setPasswordTouched(true)
                    trigger("password")
                  }
                })}
                type="password" placeholder="Password" className={`w-full ${errors.password?.message ? "outline outline-rose outline-2 focus:outline-rose" : "focus:outline-oceanBlue"} outline-offset-0 focus:outline-offset-0`} />
                <p className="text-sm text-start flex gap-2 items-center">
                  <img src={passwordTouched && !errors.password?.message?.includes("Password must be at least 8 characters long.") ? Checkmark : xIcon} className="h-5 border-[1px] border-[#dfdfdf] rounded-md flex gap-2 w-fit" />
                  Password must be at least 8 characters long.
                </p>
                {errors.password?.message?.includes("Password must be less than 128 characters long.") && (
                  <p className="text-sm text-start flex gap-2 items-center">
                    <img src={passwordTouched && !errors.password?.message ? Checkmark : xIcon} className="h-5 border-[1px] border-[#dfdfdf] rounded-md flex gap-2 w-fit" />
                    Password must be less than 128 characters long.
                  </p>
                )}
                <p className="text-sm text-start flex gap-2 items-center">
                  <img src={passwordTouched && !errors.password?.message && !errors.password?.message?.includes("Password must include a number, uppercase and lowercase letters, and a symbol.") ? Checkmark : xIcon} className="h-5 border-[1px] border-[#dfdfdf] rounded-md flex gap-2 w-fit" />
                  Password must include a number, uppercase and lowercase letters, and a symbol.
                </p>
              </div>
              <Input {...register("confirmPassword", {
                onChange: () => {
                  trigger("confirmPassword")
                }
              })} type="password" placeholder="Confirm Password" className={`w-full ${errors.confirmPassword?.message ? "outline outline-rose outline-2 focus:outline-rose" : "focus:outline-oceanBlue focus:outline-offset-0"} outline-offset-0 focus:outline-offset-0`} />
              {errors.confirmPassword && (
                <div className="flex items-center justify-center gap-2">
                  <img src={Caution} alt="caution icon" className="w-auto h-4" />
                  <p className="text-red-400 text-center">{`${errors.confirmPassword.message}`}</p>
                </div>
              )}
            </div>
          )}
        </div>  
        <div className="mt-4 mx-auto grid gap-3 w-fit">
          <div className="w-full flex flex-col items-center gap-4">
            {step === 1 && <Button onClick={() => onSubmit()} variant="BlueHeath" size="squareMD" className="text-2xl py-4">&#10140;</Button>}
            {step === 2 && <Button onClick={() => onSubmit()} variant="BlueHeath" size="squareMD" className="text-2xl py-4">&#10140;</Button>}
            {step === 3 && 
            <Button disabled={isSubmitting} onClick={() => onSubmit()} variant="BlueHeath" size="squareMD" type="submit" className="text-2xl py-4">
              <img src={Rocket} alt="Rocket icon" className="h-8 w-auto" />
            </Button>
            }
            <p>Already have an account? <NavLink to="/login" className="transition-colors text-oceanBlue hover:text-rose">Sign in</NavLink></p>
          </div>
        </div>
      </form>
    </div>
  )
}
