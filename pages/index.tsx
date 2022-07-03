import { geoMercator, geoPath } from "d3-geo";
import { pointer } from "d3-selection";
import type { NextPage } from "next";
import Image from "next/image";
import randomColor from "randomcolor";
import { useState } from "react";
import { feature } from "topojson-client";
import kenya from "../data/kenya-wards.json";

const padding = 10;

const statePolygons = feature(kenya as any, kenya.objects.gadm36_KEN_3 as any);

const features = statePolygons.features.map((polygon: any) => ({
  ...polygon,
  color: randomColor({
    luminosity: "light",
    hue: "purple",
  }),
}));

const Home: NextPage = () => {
  const width = 500;
  const height = 600;

  const [mouse, setMouse] = useState({ x: undefined, y: undefined });
  const [county, setCounty] = useState("");

  const projection = geoMercator().fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding],
    ],
    statePolygons
  );

  const generator = geoPath().projection(projection);

  const mousemove = (e, county: string) => {
    const mouseCoords = pointer(e);
    setMouse({ x: mouseCoords[0], y: mouseCoords[1] });

    setCounty(county);
  };
  return (
    <article className="shadow-md rounded-lg m-4 text-sm border border-gray-200 h-full">
      <h1 className="p-4 border-b border-b-gray-200 font-medium flex items-center gap-x-2">
        <Image
          src="/food-security.svg"
          width={28}
          height={28}
          alt="food-security"
        />
        Kenyan County Map
      </h1>
      <section className="py-4 px-8 relative text-xs">
        <svg width={width} height={height}>
          <g className="w-full h-full">
            {features.map((polygon, i) => (
              <path
                d={generator(polygon)}
                key={i}
                fill={polygon.color}
                className="stroke-[0.75] stroke-white hover:fill-blue-500"
                onMouseMove={(e) => mousemove(e, polygon.properties.NAME_2)}
              />
            ))}
          </g>
        </svg>

        <div
          className="border absolute shadow-lg min-w-[100px] font-medium -translate-y-full bg-white pointer-events-none divide-y divide-gray-200 rounded-sm"
          style={{ top: mouse.y, left: mouse.x }}
        >
          <h1 className="p-4">{county}</h1>
        </div>
      </section>
    </article>
  );
};

export default Home;
