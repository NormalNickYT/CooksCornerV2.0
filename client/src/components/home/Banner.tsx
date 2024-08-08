import { Link } from "react-router-dom";
import banner from "../../assets/img/banner.jpg";
import { Button } from "../ui/button";

export const BannerSection = () => {
  return (
    <div className="relative w-full h-[500px] overflow-hidden my-10">
      <img
        src={banner}
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover max-w-full"
      />
      <div className="absolute inset-0 bg-black opacity-80"></div>
      <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
        <div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">
            Alle recepten bekijken
          </h1>
          <p className="mb-6 text-lg lg:text-xl">
            Verken onze uitgebreide collectie recepten, zorgvuldig samengesteld
            door andere kookliefhebbers.
          </p>
          <Button className="dark:bg-dark-primary bg-light-primary hover:shadow-lg text-white dark:text-dark-text px-4 py-2 transition duration-300 hover:-translate-y-0.5 w-40 font-bold">
            <Link to="/add-group">Ontdek</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
