import { informationItems } from "../assets/constants";

const Information = () => {
  return (
    <div className="relative mt-20 border-b min-h-[800px]">
      <div className="flex flex-col mt-10 lg:mt-20 space-y-10">
        {informationItems.map((item, index) => (
          <div
            key={index}
            className="w-full flex flex-col lg:flex-row items-center lg:items-start"
          >
            <div className="lg:w-2/3 px-32 text-center lg:text-left">
              <h1 className="text-5xl font-bold mb-4 justify-center text-center underline">
                {item.text}
              </h1>
              <p className="text-2xl leading-relaxed mt-16 text-gray-700">
                {item.description}
              </p>
            </div>
            <div className="lg:w-1/3 flex justify-center lg:justify-end mr-20 lg:mt-0 lg:ml-2">
              <img
                src={item.image}
                alt="#"
                className="max-w-[360px] h-auto mt-10 mb-10"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Information;
