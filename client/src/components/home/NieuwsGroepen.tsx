import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import group from "../../assets/img/family.svg";

export const NieuwsGroepen = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between p-4 px-4 lg:px-20 lg:p-8 space-y-6 lg:space-y-0">
      <div className="flex-1 lg:mr-8 flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4">NIEUW: Groepenfunctie!</h1>
        <p className="mb-4">
          Je wist vast al dat je elkaars recepten kunt bekijken, favorieten kunt
          opslaan en reacties kunt achterlaten. Maar we hebben nu iets nieuws:
          je kunt nu ook groepen aanmaken binnen onze applicatie! Dit betekent
          dat je samen met vrienden groepen kunt vormen en recepten met elkaar
          kunt delen via de chat. Ontdek hoe eenvoudig het is om samen te koken
          en ideeën uit te wisselen in een groepsomgeving.
        </p>
        <Button className="dark:bg-dark-primary bg-light-primary font-bold hover:shadow-lg text-white dark:text-dark-text px-4 py-2 transition duration-300 hover:-translate-y-0.5 w-40">
          <Link to="/add-group">Maak een groep</Link>
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img
          src={group}
          alt="Groepenfunctie"
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>
    </div>
  );
};
