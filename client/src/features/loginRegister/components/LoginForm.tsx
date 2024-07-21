import { ChangeEvent, useState } from "react"
import { NavLink } from "react-router-dom"
import Button from "components/ui/Button"
import Input from "components/ui/Input"
import GoogleLogo from "assets/Logos/GoogleLogo.svg"
import Caution from "assets/Icons/cautionIcon.svg"
import EyeOpen from "assets/Icons/eyeShowIcon.svg"
import EyeClose from "assets/Icons/eyeHideIcon.svg"
import { loginSchema, TLoginSchema } from "src/types/loginRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCustomForm } from "../hooks/useCustomForm";

export const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(false)
  const [ passwordVisible, setPasswordVisible ] = useState(false)

  const { submitLoginForm } = useCustomForm()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const handleRememberMe = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e?.target.checked)
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="absolute -z-10 w-full h-full bg-[url('assets/polygonBackground.svg')] bg-cover bg-right bg-no-repeat" />
      <form onSubmit={handleSubmit((data) => submitLoginForm(data))} className="min-h-[543px] max-w-md w-full bg-white shadow-lg py-11 px-16 mx-5 rounded-2xl">
        <h1 className="w-full flex justify-center text-3xl pb-9 m-0 font-semibold text-raisinBlack">Account Login</h1>
        <div className="flex flex-col gap-5 mt-px min-w-28">
          <div className="flex flex-col gap-2">
            <Input {...register("email")} type="text" placeholder="Email" className={`w-full ${errors.email?.message ? "outline outline-rose outline-2 focus:outline-rose" : "focus:outline-oceanBlue"} outline-offset-0 focus:outline-offset-0`} />
            {errors.email && (
              <div className="flex items-center justify-center gap-2">
                <img src={Caution} alt="caution icon" className="w-auto h-4" />
                <p className="text-red-400 text-sm text-center">{`${errors.email.message}`}</p>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <div className="relative flex items-center">
              <Input {...register("password")} type={passwordVisible ? "text" : "password"} placeholder="Password" className={`w-full pr-10 ${errors.password?.message ? "outline outline-rose outline-2 focus:outline-rose" : "focus:outline-oceanBlue"} outline-offset-0 focus:outline-offset-0`} />
              <button onClick={(e) => {
                e.preventDefault()
                setPasswordVisible(!passwordVisible)
              }} className="absolute right-0 mr-3 cursor-pointer">
                <img src={passwordVisible ? EyeOpen : EyeClose} className="w-8 h-auto" />
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center justify-center gap-2">
                <img src={Caution} alt="caution icon" className="w-auto h-4" />
                <p className="text-red-400 text-sm text-center">{`${errors.password.message}`}</p>
              </div>
            )}
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={rememberMe} onChange={handleRememberMe} />
                <p className="text-sm">Remember me</p>
              </div>
              <NavLink to="/" className="w-fit transition-colors text-sm text-blueHeath hover:text-rose">Forgot Password?</NavLink>
            </div>
          </div>
          <div className="grid gap-3">
            <Button disabled={isSubmitting} type="submit" variant="BlueHeath" className="w-full">Sign In</Button>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-full bg-raisinBlack" />
              <p className="text-center text-raisinBlack text-lg">OR</p>
              <div className="h-px w-full bg-raisinBlack" />
            </div>
            <Button variant="Ghost" className="flex items-center justify-center gap-4 w-full hover:bg-[#ECECEC] hover:border-white">
              <img src={GoogleLogo} alt="Google logo" className="h-6 w-auto" />
              <p className="m-0">Sign in with Google</p>
            </Button>
          </div>
          <p className="flex justify-center items-center">Don't have an account?&nbsp;<NavLink to="/register" className="transition-colors text-oceanBlue hover:text-rose">Sign up</NavLink></p>
        </div>
      </form>
    </div>
  )
}
