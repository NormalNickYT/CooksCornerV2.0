import banner from "../../assets/img/banner.jpg";

export const BannerRecipe = () => {
  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      <img
        src={banner}
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover max-w-full"
      />
      <div className="absolute inset-0 bg-black opacity-80"></div>
      <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Ontdek alle recepten
          </h1>
        </div>
      </div>
    </div>
  );
};
