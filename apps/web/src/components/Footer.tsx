export const Footer = () => {
  return (
    <>
      <div className="dark:bg-dark-background">
        <div className="max-w-screen-lg px-4 sm:px-6 sm:grid md:grid-cols-3 sm:grid-cols-2 mx-auto ">
          <div className="p-5">
            <h3 className="font-bold text-xl text-dark-accent ">CooksCorner</h3>
          </div>
          <div className="p-5">
            <div className="text-sm uppercase text-dark-accent font-bold">
              Resources
            </div>
            <a className="my-3 block" href="/#">
              Recipes <span className="text-xs p-1"></span>
            </a>
            <a className="my-3 block" href="/#">
              Register <span className="text-xs p-1"></span>
            </a>
            <a className="my-3 block" href="/#">
              Login <span className="text-xs p-1"></span>
            </a>
          </div>
          <div className="p-5">
            <div className="text-sm uppercase text-dark-accent font-bold">
              Support
            </div>
            <a className="my-3 block" href="/#">
              Help Center <span className="text-teal-600 text-xs p-1"></span>
            </a>
            <a className="my-3 block" href="/#">
              Privacy Policy <span className="text-teal-600 text-xs p-1"></span>
            </a>
            <a className="my-3 block" href="/#">
              Conditions <span className="text-teal-600 text-xs p-1"></span>
            </a>
          </div>
        </div>
      </div>
      <div className="pt-2 dark:bg-dark-background">
        <div className="flex pb-5 px-3 m-auto pt-5 border-t text-sm flex-col max-w-screen-lg items-center ">
          <div className="my-5 dark:bg-dark-background">
            © Copyright 2024. All Rights Reserved.
          </div>
        </div>
      </div>
    </>
  );
};
