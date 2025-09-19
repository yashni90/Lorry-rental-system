import React, { useState } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar({ setShowLogin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isHome = location.pathname === "/";

  return (
    <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 
      text-gray-600 border-b border-borderColor relative transition-all 
      ${isHome ? "bg-light" : ""}`}>

      <Link to='/'>
        <img src={assets.logo2} alt="logo" className='h-10 object-fit'  />
      </Link>

      <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16
        max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row
        items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all
        duration-300 z-50 ${isHome ? "bg-light" : "bg-white"} 
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>

        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}

        <div className='hidden lg:flex items-center text-sm gap-2 border
          border-borderColor rounded-full px-3 max-w-56'>
          <input
            type="text"
            className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500'
            placeholder='Search Products'
          />
          <img src={assets.search_icon} alt="search" />
        </div>
        
        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
          <Link to='/signup'>
          <button onClick={() => navigate('/owner')} className='cursor-pointer'>
            Sign up
          </button>
          </Link>
          <Link to='/signin'>
          <button
            onClick={() => setShowLogin(true)}
            className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'
          >
            Login
          </button>
          </Link >
        </div>
      </div>

      <button
        className='sm:hidden cursor-pointer'
        aria-label='Menu'
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>

    </div>
  );
}

export default Navbar;
