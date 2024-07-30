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
        <div className="flex pb-5 px-3 m-auto pt-5 border-t text-sm flex-col max-w-screen-lg items-center">
          <div className="md:flex-auto md:flex-row-reverse mt-2 flex-row flex">
            {/* <a href="/#" className="w-6 mx-1">
              <svg
                className="fill-current cursor-pointer hover:text-indigo-600"
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xml:space="preserve"
                xmlns:serif="http://www.serif.com/"
              >
                <path
                  id="Shape"
                  d="M7.3,0.9c1.5,-0.6 3.1,-0.9 4.7,-0.9c1.6,0 3.2,0.3 4.7,0.9c1.5,0.6 2.8,1.5
                  3.8,2.6c1,1.1 1.9,2.3 2.6,3.8c0.7,1.5 0.9,3 0.9,4.7c0,1.7 -0.3,3.2
                  -0.9,4.7c-0.6,1.5 -1.5,2.8 -2.6,3.8c-1.1,1 -2.3,1.9 -3.8,2.6c-1.5,0.7
                  -3.1,0.9 -4.7,0.9c-1.6,0 -3.2,-0.3 -4.7,-0.9c-1.5,-0.6 -2.8,-1.5
                  -3.8,-2.6c-1,-1.1 -1.9,-2.3 -2.6,-3.8c-0.7,-1.5 -0.9,-3.1 -0.9,-4.7c0,-1.6
                  0.3,-3.2 0.9,-4.7c0.6,-1.5 1.5,-2.8 2.6,-3.8c1.1,-1 2.3,-1.9
                  3.8,-2.6Zm-0.3,7.1c0.6,0 1.1,-0.2 1.5,-0.5c0.4,-0.3 0.5,-0.8 0.5,-1.3c0,-0.5
                  -0.2,-0.9 -0.6,-1.2c-0.4,-0.3 -0.8,-0.5 -1.4,-0.5c-0.6,0 -1.1,0.2
                  -1.4,0.5c-0.3,0.3 -0.6,0.7 -0.6,1.2c0,0.5 0.2,0.9 0.5,1.3c0.3,0.4 0.9,0.5
                  1.5,0.5Zm1.5,10l0,-8.5l-3,0l0,8.5l3,0Zm11,0l0,-4.5c0,-1.4 -0.3,-2.5
                  -0.9,-3.3c-0.6,-0.8 -1.5,-1.2 -2.6,-1.2c-0.6,0 -1.1,0.2 -1.5,0.5c-0.4,0.3
                  -0.8,0.8 -0.9,1.3l-0.1,-1.3l-3,0l0.1,2l0,6.5l3,0l0,-4.5c0,-0.6 0.1,-1.1
                  0.4,-1.5c0.3,-0.4 0.6,-0.5 1.1,-0.5c0.5,0 0.9,0.2 1.1,0.5c0.2,0.3 0.4,0.8
                  0.4,1.5l0,4.5l2.9,0Z"
                ></path>
              </svg>
            </a> */}
          </div>
          <div className="my-5">© Copyright 2024. All Rights Reserved.</div>
        </div>
      </div>
    </>
  );
};
