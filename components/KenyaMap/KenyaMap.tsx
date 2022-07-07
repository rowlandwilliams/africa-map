import { geoMercator, geoPath } from "d3-geo";
import { DebouncedFunc } from "lodash";
import randomColor from "randomcolor";
import { Dispatch, MouseEvent, SetStateAction } from "react";
import { feature } from "topojson-client";
import kenya from "../../data/kenya-constituencies.json";
import { useResponsiveGraphDims } from "../../hooks/useResponsiveGraphDims";

interface Props {
  setHovered: Dispatch<SetStateAction<boolean>>;
  mouseMove: DebouncedFunc<(e: MouseEvent, properties: any) => void>;
}

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

export const KenyaMap = ({ setHovered, mouseMove }: Props) => {
  const { ref, graphWidth, graphHeight } = useResponsiveGraphDims();

  const projection = geoMercator().fitExtent(
    [
      [padding, padding],
      [graphWidth - padding, graphHeight - padding],
    ],
    constituencyPolygons
  );

  const mapGenerator = geoPath().projection(projection);

  return (
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
              d={mapGenerator(polygon) as string}
              key={i}
              fill={polygon.color}
              className="stroke-[0.85] stroke-gray-100 hover:fill-yellow-300"
              onMouseMove={(e) => mouseMove(e, polygon.properties)}
            />
          ))}
        </g>
      </svg>
    </section>
  );
};
