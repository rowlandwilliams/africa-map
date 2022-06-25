import { geoMercator, geoPath } from "d3-geo";
import { pointer } from "d3-selection";
import type { NextPage } from "next";
import Image from "next/image";
import randomColor from "randomcolor";
import { useState } from "react";
import { feature } from "topojson-client";
import africa from "../data/africa.json";

const padding = 10;

const statePolygons = feature(
  africa as any,
  africa.objects.continent_Africa_subunits
);

const features = statePolygons.features.map((polygon) => ({
  ...polygon,
  color: randomColor({
    luminosity: "light",
    hue: "blue",
  }),
}));

const Home: NextPage = () => {
  const width = 500;
  const height = 600;

  const [mouse, setMouse] = useState({ x: undefined, y: undefined });
  const [country, setCountry] = useState({});
  console.log(features);

  const projection = geoMercator().fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding],
    ],
    statePolygons
  );

  const generator = geoPath().projection(projection);

  const mousemove = (e, country: string, type: string) => {
    const mouseCoords = pointer(e);
    setMouse({ x: mouseCoords[0], y: mouseCoords[1] });

    setCountry({ country: country, type: type });
  };
  console.log(features);
  return (
    <article className="shadow-md rounded-lg m-4 text-sm border border-gray-200 h-full">
      <h1 className="p-4 border-b border-b-gray-200 font-medium flex items-center gap-x-2">
        <Image
          src="/food-security.svg"
          width={28}
          height={28}
          alt="food-security"
        />
        African Food Security Index
      </h1>
      <section className="py-4 px-8 relative text-xs">
        <svg width={width} height={height}>
          <g className="w-full h-full">
            {features.map((polygon, i) => (
              <path
                d={generator(polygon)}
                key={i}
                fill={polygon.color}
                className="stroke-[0.75] stroke-white hover:fill-white"
                onMouseMove={(e) =>
                  mousemove(
                    e,
                    polygon.properties.geounit,
                    polygon.properties.type
                  )
                }
              />
            ))}
          </g>
        </svg>

        <div
          className="border absolute shadow-lg min-w-[100px] font-medium -translate-y-full bg-white pointer-events-none divide-y divide-gray-200 transition-all duration-100 rounded-sm"
          style={{ top: mouse.y, left: mouse.x }}
        >
          <h1 className="p-4">{country.country}</h1>
          <p className="p-4 text-gray-600">{country.type}</p>
        </div>
      </section>
    </article>
  );
};

export default Home;
