import classNames from "classnames";
import { geoMercator, geoPath } from "d3-geo";
import { pointer } from "d3-selection";
import debounce from "lodash.debounce";
import type { NextPage } from "next";
import randomColor from "randomcolor";
import { useState } from "react";
import { feature } from "topojson-client";
import kenya from "../data/kenya-constituencies.json";
import { useResponsiveGraphDims } from "../hooks/useResponsiveGraphDims";

const padding = 10;

const constituencyPolygons = feature(
  kenya as any,
  kenya.objects.constituencies as any
);

const features = constituencyPolygons.features.map((polygon: any) => ({
  ...polygon,
  color: randomColor({
    hue: "blue",
  }),
}));

const unitOptions = ["Constituency", "County"];

const Home: NextPage = () => {
  const { ref, graphWidth, graphHeight } = useResponsiveGraphDims();
  const [mouse, setMouse] = useState({} as { x: number; y: number });
  const [hovered, setHovered] = useState(false);
  const [county, setCounty] = useState("");
  const [constituency, setConstituency] = useState("");
  const [activeOption, setActiveOption] = useState("Constituency");

  const projection = geoMercator().fitExtent(
    [
      [padding, padding],
      [graphWidth - padding, graphHeight - padding],
    ],
    constituencyPolygons
  );

  const generator = geoPath().projection(projection);

  const mousemove = debounce((e: MouseEvent, properties: any) => {
    const mouseCoords = pointer(e);
    setMouse({ x: mouseCoords[0], y: mouseCoords[1] });
    console.log(properties);
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
      <section
        className="relative text-xs h-full w-full max-w-[550px] max-h-[700px]"
        ref={ref}
      >
        <svg width={graphWidth} height={graphHeight}>
          <g
            className="w-full h-full"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {features.map((polygon, i) => (
              <path
                d={generator(polygon)}
                key={i}
                fill={polygon.color}
                className="stroke-[0.85] stroke-gray-100 hover:fill-yellow-300"
                onMouseMove={(e) => mousemove(e, polygon.properties)}
              />
            ))}
          </g>
        </svg>
      </section>
    </article>
  );
};

export default Home;
