import React from 'react'
import { Link } from 'react-router'

const Banner = () => {
  return (
    <div className="container">
        <h1 className="text-4xl font-bold mb-4">
        Find Blood Donors Fast in Emergencies
      </h1>
      <p className="text-lg mb-8 text-gray-600">
        Instantly connect with nearby donors by blood group and location to save lives when it matters most.
      </p>
      <div className="flex gap-4">
        <Link to="/register">
          <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl text-lg">
            Register as Donor
          </button>
        </Link>
        <Link to="/request">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl text-lg">
            Post an Emergency
          </button>
        </Link>
        </div>
    </div>
  )
}

export default Banner