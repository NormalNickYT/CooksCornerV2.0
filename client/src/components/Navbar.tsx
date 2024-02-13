import { useState } from 'react'
import { AiOutlineMenu, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import logo from '../assets/img/CooksCornerLogo.png'

const Navbar = () => {
    const [nav, setNav] = useState(false);
  
    const handleNav = () => {
      setNav(!nav);
    };
  
    const navItems = [
      { id: 1, text: 'Home' },
      { id: 2, text: 'Categorie' },
      { id: 3, text: 'Login' },
    ];
  
    return (
      <div className='flex justify-between items-center h-24 max-w-[1940px] mx-auto px-4 text-white'>
        <h1 className='w-full text-3xl font-bold text-[#00df9a]'>CooksCorner</h1>
        {/* <img src = {logo} /> */}
      <div className='flex items-center justify-center w-full md:w-[500px] lg:w-[500px] mb-4 md:mb-0'>
        <div className='bg-gray-200 rounded-full flex items-center px-2 w-full md:w-[400px] lg:w-[300px] mb-4 md:mb-0'>
          <input
            className='bg-transparent p-2 w-full focus:outline-none'
            type='text'
            placeholder='Zoek voor een specifiek recept'
          />
          <AiOutlineSearch size={30} color='black' />
        </div>
      </div>
        <ul className='hidden md:flex'>
          {navItems.map(item => (
            <li
              key={item.id}
              className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 text-black hover:text-black'
            >
              {item.text}
            </li>
          ))}
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