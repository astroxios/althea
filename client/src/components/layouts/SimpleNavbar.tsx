import { NavLink } from 'react-router-dom'

import Button from '../ui/Button'
import Logo from "assets/Logos/LogoLightMode.png"

const SimpleNavbar = () => {
  return (
    <nav className="w-full bg-white flex justify-between items-center shadow-md">
        <NavLink to="/" className="ml-5"><img src={Logo} alt="Althea logo" className="w-[100px] h-auto" /></NavLink>
        <NavLink to="/register">
            <Button variant="OceanBlue" className="mr-11">Sign up</Button>
        </NavLink>
    </nav>
  )
}

export default SimpleNavbar
