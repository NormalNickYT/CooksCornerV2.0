import AllMenus from '../assets/img/menu-1.png';
import BreakFast from '../assets/img/breakfast.png';
import Lunch from '../assets/img/sandwich.png';
import Dinner from '../assets/img/meat.png';
import Dessert from '../assets/img/cake.png';
import popSound from '../assets/sounds/pop.mp3';
import useSound from '@/hooks/useSound';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export const MenuTab = () => {
    const [playSound] = useSound(popSound); 

    const handleHover = () => {
      playSound();
    };

    return (
      <div className="menu-tab pb-10">
      <div className="row">
        <div className="col-lg-12 m-auto">
        <div className="lg:flex sm:text-center lg:px-20 text-4xl font-bold mb-6 text-text justify-between items-center">
          <div>
              Categories
          </div>
          <Button className="w-42 dark:bg-primary text-white px-4 py-2 transition duration-300 hover:-translate-y-0.5">
              <Link to={"/Login"}>All Categories</Link>
          </Button>
        </div>
          <div className="menu-tab text-center">
            <div className="filters-container flex justify-center gap-10">
              <div className="filter-wrapper">
                <div className="filter inline-flex flex-col items-center text-lg cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 duration-300 border-none rounded-lg p-4 bg-gradient-to-r from-accent to-secondary" onMouseEnter={handleHover}>
                  <img src={BreakFast} alt="" className="mb-2 mx-5 w-24 h-24 " />
                  <span>Breakfast</span>
                </div>
              </div>
              <div className="filter-wrapper">
                <div className="filter inline-flex flex-col items-center text-lg cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 duration-300 border-none rounded-lg p-4 bg-gradient-to-r from-accent to-secondary" onMouseEnter={handleHover}>
                  <img src={Lunch} alt="" className="mb-2 mx-5 w-24 h-24 " />
                  <span>Lunch</span>
                </div>
              </div>
              <div className="filter-wrapper">
                <div className="filter inline-flex flex-col items-center text-lg cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 duration-300  border-none rounded-lg p-4 bg-gradient-to-r from-accent to-secondary" onMouseEnter={handleHover}>
                  <img src={Dinner} alt="" className="mb-2 mx-5 w-24 h-24" />
                  <span>Dinner</span>
                </div>
              </div>
              <div className="filter-wrapper">
                <div className="filter inline-flex flex-col items-center text-lg cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 duration-300 border-none rounded-lg p-4 bg-gradient-to-r from-accent to-secondary" onMouseEnter={handleHover}>
                  <img src={Dessert} alt="" className="mb-2 mx-5 w-24 h-24" />
                  <span>Dessert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default MenuTab


