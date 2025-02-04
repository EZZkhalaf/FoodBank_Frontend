import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 text-center">
        <p className="text-sm">© {new Date().getFullYear()} NoFoodWaste. All rights reserved.</p>
        <nav className="mt-2">
            <Link to="/about" className="mx-2 hover:underline">About</Link>
            <Link to="/contact" className="mx-2 hover:underline">Contact</Link>
            <Link to="/privacy" className="mx-2 hover:underline">Privacy Policy</Link>
        </nav>
    </footer>
  )
}

export default Footer