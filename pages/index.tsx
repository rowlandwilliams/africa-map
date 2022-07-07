import classNames from "classnames";
import debounce from "lodash.debounce";
import type { NextPage } from "next";
import { MouseEvent, useState } from "react";
import { KenyaMap } from "../components/KenyaMap/KenyaMap";

const unitOptions = ["Constituency", "County"];

const Home: NextPage = () => {
  const [hovered, setHovered] = useState(false);
  const [county, setCounty] = useState("");
  const [constituency, setConstituency] = useState("");
  const [activeOption, setActiveOption] = useState("Constituency");

  const mousemove = debounce((e: MouseEvent, properties: any) => {
    setCounty(properties.NAME_1);
    setConstituency(properties.NAME_2);
  }, 5);

  return (
    <article className="h-screen flex justify-between text-xs px-48 py-24">
      <section className="space-y-4 flex-grow">
        <div className="space-x-2">
          {unitOptions.map((option) => (
            <button
              key={option}
              className={classNames(
                "px-4 py-2 rounded-lg text-sm font-medium",
                {
                  "bg-blue-600 text-white": activeOption === option,
                  "hover:bg-gray-50": activeOption !== option,
                }
              )}
              onClick={() => setActiveOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <h1 className="text-sm font-medium">Kenya Election Tracker</h1>
        {hovered && (
          <div>
            <h1 className="text-gray-400 font-medium">Constituency</h1>
            <h2 className="text-2xl font-semibold">{constituency}</h2>
          </div>
        )}
        {hovered && (
          <div>
            <h1 className="text-gray-400 font-medium">County</h1>
            <h2 className="text-lg font-medium">{county}</h2>
          </div>
        )}
      </section>
      <KenyaMap setHovered={setHovered} mouseMove={mousemove} />
    </article>
  );
};

export default Home;
