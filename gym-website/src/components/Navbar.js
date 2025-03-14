import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">FitZone Gym</h1>
      <div className="flex gap-4">
        <Link className="hover:text-gray-300" to="/">Home</Link>
        <Link className="hover:text-gray-300" to="/about">About</Link>
        <Link className="hover:text-gray-300" to="/services">Services</Link>
        <Link className="hover:text-gray-300" to="/membership">Membership</Link>
        <Link className="hover:text-gray-300" to="/trainers">Trainers</Link>
        <Link className="hover:text-gray-300" to="/contact">Contact</Link>
        <Link className="hover:text-gray-300" to="/signup">Signup</Link>
        <Link className="hover:text-gray-300" to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;