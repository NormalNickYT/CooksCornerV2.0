import { useState } from 'react'
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import logo from '../assets/img/CooksCornerLogo.png'
import { NavLink } from 'react-router-dom';
import Switcher from './ui/switcher';


const Navbar = () => {
    const [nav, setNav] = useState(false);
    const handleNav = () => {
      setNav(!nav);
    };
  
    const navItems = [
      { id: 1, text: 'Home' },
      { id: 2, text: 'Categories' },
      { id: 3, text: 'Login' },
    ];

    return (
      <div className='flex justify-between items-center h-24 max-w-[1940px] mx-auto px-20 text-white dark:bg-gray-900'>
        <h1 className='w-full text-3xl font-bold text-[#00df9a]'>CooksCorner</h1>
      <div className='flex items-center space-x-4 flex-grow'>
        <div className='bg-gray-200 rounded-full flex items-center px-2 w-full'>
          <input
            className='bg-transparent p-2 w-full focus:outline-none text-black'
            type='text'
            placeholder='Zoek voor een specifiek recept'
          />
          <AiOutlineSearch size={30} color='black' />
        </div>
      </div>
        <ul className='flex items-center'>
          {navItems.map(item => (
            <li
              key={item.id}
              className= {`p-4 m-2 text-black dark:text-white underline-wavy-hotpink`}
            >
               {item.text === 'Home' ? (
                  <NavLink to="/" className={({ isActive }) =>
                  isActive ? 'text-lg text-[#00DF9A] font-bold' : ''
                }>Home</NavLink>
                ) : (
                  <NavLink to={"/" + item.text} className={({ isActive }) =>
                  isActive ? 'text-lg text-[#00DF9A] font-bold' : ''
                } >{item.text}</NavLink>
                )}
            </li>
          ))}
          <Switcher />
        </ul>
        <div onClick={handleNav} className='block md:hidden'>
          {nav ? <AiOutlineClose color = 'black' size={20} /> : <AiOutlineMenu color = 'black' size={20} />}
        </div>
        <ul
          className={
            nav
              ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#E5E7EB] ease-in-out duration-500'
              : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
          }
        >
        <h1 className='w-full text-3xl font-bold text-black m-4'>CooksCorner</h1>
          {navItems.map(item => (
            <li
              key={item.id}
              className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 text-black hover:text-black cursor-pointer border-gray-600'
            >
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default Navbar;