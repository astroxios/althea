import { useEffect } from "react";
import { useNavigate } from "react-router";
import { LoginForm } from "features/loginRegister"
import Footer from "components/layouts/Footer"
import SimpleNavbar from "components/layouts/SimpleNavbar"
import { useAuth } from "src/contexts/AuthContext";

const Login = () => {
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
      <LoginForm />
      <Footer />
    </div>
  )
}

export default Login