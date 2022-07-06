import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";

export const useResponsiveGraphDims = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [graphWidth, setGraphWidth] = useState(0);
  const [graphHeight, setGraphHeight] = useState(0);

  const setGraphDims = debounce((current: HTMLDivElement) => {
    setGraphWidth(current.clientWidth);
    setGraphHeight(current.clientHeight);
  }, 50);

  // on resize, update chart
  useEffect(() => {
    const { current } = ref;

    if (current) {
      setGraphDims(current);
      const setResize = () => setGraphDims(current);
      window.addEventListener("resize", setResize);
      return () => window.removeEventListener("resize", setResize);
    }

    return () => {};
  }, [setGraphDims]);

  return { ref, graphWidth, graphHeight };
};
