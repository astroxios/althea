import { NavLink } from "react-router-dom"

export const Footer = () => {
    return (
        <footer className="w-full h-16 bg-white flex items-center justify-center">
            <p className="text-sm">Copyright @ 2024 Althea &nbsp;|&nbsp; <NavLink to="/" className="hover:underline">Privacy Policy</NavLink></p>
        </footer>
    )
}

export default Footer
