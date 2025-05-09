import React from 'react'
import { Link, Outlet } from 'react-router'
import { FaBriefcaseMedical } from "react-icons/fa";


const Header = () => {
  return (
    <div className="container">

      <section className='flex justify-between'>
        <h2 className='mx-auto text-2xl'><Link to="/"><FaBriefcaseMedical /></Link></h2>
        

    
      </section>
        
        <Outlet />
    </div>
  )
}

export default Header