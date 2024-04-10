import { useState } from 'react'
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import Switcher from './ui/switcher';

const Navbar = () => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const handleNav = () => {
      setMobileDrawerOpen(!mobileDrawerOpen);
    };
  
    const navItems = [
      { id: 1, text: 'Home' },
      { id: 2, text: 'Categories' },
    ];

    return (
      <nav className='sticky top-0 py-3 z-50 backdrop-blur-lg border-neutral-700/80 text-text bg-light-background dark:bg-dark-background border-b '>
        <div className="container px-4 mx-auto relative lg:text-sm"> 
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
           <h1 className='w-full text-2xl font-bold dark:text-dark-text'>CooksCorner</h1>
          </div>
        <ul className='hidden lg:flex ml-14 space-x-12 items-center'>
          {navItems.map(item => (
            <li
              key={item.id}
              className= {`p-4 m-2 text-light-text text-lg dark:text-dark-text underline-wavy-hotpink`}
            >
               {item.text === 'Home' ? (
                  <NavLink to="/" className={({ isActive }) =>
                  isActive ? 'text-dark-accent text-dark-accent' : ''
                }>Home</NavLink>
                ) : (
                  <NavLink to={"/" + item.text} className={({ isActive }) =>
                  isActive ? 'text-dark-accent font-bold' : ''
                } >{item.text}</NavLink>
                )}
            </li>
          ))}
        </ul>
        <div className="hidden lg:flex justify-center space-x-8 items-center">
            <a href="/login" className="py-2 px-3 border rounded-md dark:text-dark-text transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 duration-300">
              Sign In
            </a>
            <a
              href="/register"
              className="bg-gradient-to-r from-dark-accent to-dark-secondary py-2 px-3 rounded-md dark:text-dark-text transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 duration-300"
            >
              Create an account
            </a>
            <Switcher />
          </div>
          <div onClick={handleNav} className='z-50 lg:hidden md:flex flex-col justify-end '>
            {mobileDrawerOpen ? <AiOutlineClose color = 'white' size={20} /> : <AiOutlineMenu color = 'white' size={20} />}
          </div>
          {mobileDrawerOpen && (
            <div className='fixed right-0 z-20 border-b dark:bg-dark-background w-full p-12 flex flex-col justify-center items-center lg:hidden'> 
              <ul>
                {navItems.map(item => (
                  <li
                    key={item.id}
                    className='py-4'
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
              <div className="flex space-x-6">
              <a href="/login" className="py-2 px-3 border rounded-md dark:text-dark-text">
                Sign In
              </a>
              <a
                href="/register"
                className="py-2 px-3 rounded-md bg-gradient-to-r from-dark-accent to-dark-secondary dark:text-dark-text"
              >
                Create an account
              </a>
            </div>
            </div>
          )}
        </div>
        </div>
      </nav>
    );
  };

export default Navbar;