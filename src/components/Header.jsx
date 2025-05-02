import React from 'react'
import { Link, Outlet } from 'react-router'

const Header = () => {
  return (
    <div className="container">
        <ul>
            <li><Link to="about">About</Link></li>
        </ul>
        <Outlet />
    </div>
  )
}

export default Header