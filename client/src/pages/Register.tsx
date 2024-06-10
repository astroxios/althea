import { RegisterForm } from "features/loginRegister"
import Footer from "components/layouts/Footer"
import SimpleNavbar from "components/layouts/SimpleNavbar"

const Login = () => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center">
      <div className="bg-loginBackground -z-20 absolute h-screen w-screen" />
      <SimpleNavbar />
      <RegisterForm />
      <Footer />
    </div>
  )
}

export default Login
