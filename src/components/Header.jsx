import React from 'react'
import { Link, Outlet } from 'react-router'

const Header = () => {
  return (
    <div className="container">

      <section className='flex justify-between'>
        <h2><Link to="/">BloodDonor</Link></h2>

      <ul>
            <li><Link to="about">About</Link></li>
            <li></li>
        </ul>
      </section>
        
        <Outlet />
    </div>
  )
}

export default Header