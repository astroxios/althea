import { NavLink } from "react-router-dom"


const Home = () => {
  return (
    <>
      <div>Home</div>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/register">Register</NavLink>
    </>
  )
}

export default Home