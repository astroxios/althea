import { NavLink } from "react-router-dom"
import Button from "components/ui/Button"
import Input from "components/ui/Input"
import GoogleLogo from "assets/Logos/GoogleLogo.svg"


export const LoginForm = () => {
  return (
    <form className="relative h-full w-full flex items-center justify-center">
      <div className="absolute -z-10 w-full h-full bg-[url('assets/polygonBackground.svg')] bg-cover bg-right bg-no-repeat" />
      <div className="min-h-[543px] max-w-md w-full bg-white shadow-lg py-11 px-16 mx-5 rounded-2xl">
        <h1 className="w-full flex justify-center text-3xl pb-9 m-0 font-semibold text-raisinBlack">Account Login</h1>
        <div className="flex flex-col gap-5 mt-px min-w-28">
          <Input type="email" placeholder="Email / Username" className="w-full focus:outline-oceanBlue focus:outline-offset-0" />
          <div className="grid gap-2">
            <Input type="password" placeholder="Password" className="w-full" />
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input type="checkbox" />
                <p className="text-sm">Remember me</p>
              </div>
              <NavLink to="/" className="w-fit transition-colors text-sm text-blueHeath hover:text-rose">Forgot Password?</NavLink>
            </div>
          </div>
          <div className="grid gap-3">
            <Button variant="BlueHeath" className="w-full">Sign In</Button>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-full bg-raisinBlack" />
              <p className="text-center text-raisinBlack text-lg">OR</p>
              <div className="h-px w-full bg-raisinBlack" />
            </div>
            <Button variant="Ghost" className="flex items-center justify-center gap-4 w-full hover:bg-[#ECECEC]">
              <img src={GoogleLogo} alt="Google logo" className="h-6 w-auto" />
              <p className="m-0">Sign in with Google</p>
            </Button>
          </div>
          <p className="flex justify-center items-center">Don't have an account?&nbsp;<NavLink to="/register" className="transition-colors text-oceanBlue hover:text-rose">Sign up</NavLink></p>
        </div>
      </div>
    </form>
  )
}
