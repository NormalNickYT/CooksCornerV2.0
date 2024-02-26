import AllMenus from '../assets/img/menu-1.png';
import BreakFast from '../assets/img/menu-2.png';
import Lunch from '../assets/img/menu-3.png';
import Dinner from '../assets/img/menu-4.png';
import popSound from '../assets/sounds/pop.mp3';
import useSound from '@/hooks/useSound';

export const MenuTab = () => {
    const [playSound] = useSound(popSound); 

    const handleHover = () => {
      playSound();
    };

    return (
      <div className="menu-tab pb-10">
      <div className="row">
        <div className="col-lg-12 m-auto">
          <div className="menu-tab text-center">
            <ul className="filters p-2 inline-block rounded-full bg-gradient-to-r from-gray-300 to-white shadow-lg relative z-10 text-black">
            <div className="filter-active absolute left-0 bottom-0 w-full h-1 rounded-full"></div>
              <li className="filter inline-flex text-capitalize text-lg cursor-pointer transition 
              duration-300 px-6 py-2 border-none rounded-full hover:bg-[#00DF9A]" onMouseEnter={handleHover}>
                <img src={AllMenus} alt="" className="mr-2" />
                All
              </li>
              <li className="filter inline-flex text-capitalize text-lg cursor-pointer 
              transition duration-300 px-6 py-2 border-none rounded-full hover:bg-[#00DF9A]" onMouseEnter={handleHover}>
                <img src={BreakFast} alt="" className="mr-2" />
                Breakfast
              </li>
              <li className="filter inline-flex text-capitalize text-lg cursor-pointer transition 
              duration-300 px-6 py-2 border-none rounded-full hover:bg-[#00DF9A]" onMouseEnter={handleHover}>
                <img src={Lunch} alt="" className="mr-2" />
                Lunch
              </li>
              <li className="filter inline-flex text-capitalize text-lg cursor-pointer
               transition duration-300 px-6 py-2 border-none rounded-full hover:bg-[#00DF9A]" onMouseEnter={handleHover}>
                <img src={Dinner} alt="" className="mr-2" />
                Dinner
              </li>
            </ul>
          </div>
        </div>
      </div>
      </div> 
    )
}

export default MenuTab


