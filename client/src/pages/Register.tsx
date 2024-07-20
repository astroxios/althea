import { useEffect } from "react";
import { useNavigate } from "react-router";
import { RegisterForm } from "features/loginRegister"
import Footer from "components/layouts/Footer"
import SimpleNavbar from "components/layouts/SimpleNavbar"
import { useAuth } from "src/contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/config');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative h-screen w-full flex flex-col items-center">
      <div className="bg-loginBackground -z-20 absolute h-screen w-screen" />
      <SimpleNavbar />
      <RegisterForm />
      <Footer />
    </div>
  )
}

export default Register
