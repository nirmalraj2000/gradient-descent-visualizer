import React, { useEffect, useRef, useState } from "react";
import Plotly, { Data } from "plotly.js";
import Plot from "react-plotly.js";
import * as d3 from "d3";
// import Plotly from "plotly.js-gl3d-dist";

type Point3D = { x: number; y: number; z: number };

const GradientDescentVisualizer: React.FC = () => {
  const [data, setData] = useState<Partial<Plotly.Data>[]>([]);
  const [layout, setLayout] = useState<Partial<Plotly.Layout>>({});

  useEffect(() => {
    const dataSource =
      "https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv";

    d3.csv(dataSource)
      .then((csvData) => {
        // setData(csvData);
        console.log("CSV data:", csvData);
      })
      .catch((error) => {
        console.error("Error loading CSV:", error);
      });

    const learningRate: number = 0.1;
    const iterations: number = 50;
    let x: number = 4,
      y: number = 4;
    let history: { x: number; y: number; z: number }[] = [];

    function costFunction(x: number, y: number): number {
      return x * x + y * y;
    }

    function computeGradient(x: number, y: number): [number, number] {
      return [2 * x, 2 * y];
    }

    function gradientDescent(): void {
      history = [];
      for (let i = 0; i < iterations; i++) {
        let [dx, dy] = computeGradient(x, y);
        x -= learningRate * dx;
        y -= learningRate * dy;
        history.push({ x, y, z: costFunction(x, y) });
      }
    }

    gradientDescent();

    let xVals: number[] = [...Array(50).keys()].map((i) => -5 + i * 0.2);
    let yVals: number[] = [...Array(50).keys()].map(
      (i) => (i % 2 === 0 ? -4 : 4) + i * 0.2
    );
    let zVals: number[][] = xVals.map((xi) =>
      yVals.map((yi) => costFunction(xi, yi))
    );

    let surface: Partial<Plotly.Data> = {
      type: "surface",
      x: xVals,
      y: yVals,
      z: zVals,
      colorscale: "Viridis",
      opacity: 0.7,
    };

    let descentPath: Partial<Plotly.Data> = {
      type: "scatter3d",
      mode: "lines+markers",
      x: history.map((p) => p.x),
      y: history.map((p) => p.y),
      z: history.map((p) => p.z),
      marker: { size: 5, color: "red" },
      line: { width: 4, color: "red" },
    };

    setData([surface, descentPath]);
    setLayout({
      title: "Gradient Descent Visualizer",
      scene: {
        xaxis: { title: "X" },
        yaxis: { title: "Y" },
        zaxis: { title: "Cost" },
      },
    });
  }, []);

  return (
    <Plot
      data={data}
      layout={layout}
      style={{ width: "100vw", height: "100vh" }}
      useResizeHandler={true}
    />
  );
};

// const MtBrunoElevation: React.FC = () => {
//   const plotRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv"
//         );
//         const csvText = await response.text();

//         // Convert CSV text to a 2D number array
//         const rows: number[][] = csvText
//           .trim()
//           .split("\n")
//           .map((line) => line.split(",").map(Number));

//         const data: Data[] = [
//           {
//             z: rows,
//             type: "surface",
//           }, // Ensure TypeScript correctly infers this as a surface plot
//         ];

//         const layout: Partial<Plotly.Layout> = {
//           title: "Mt Bruno Elevation",
//           autosize: false,
//           width: 500,
//           height: 500,
//           margin: { l: 65, r: 50, b: 65, t: 90 },
//         };

//         if (plotRef.current) {
//           Plotly.newPlot(plotRef.current, data, layout, {
//             // showSendToCloud: true,
//             responsive: true,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching CSV data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return <div ref={plotRef} style={{ width: "100vw", height: "100vh" }} />;
// };

// interface PlotProps {
//   // You can add props here if needed
// }

// const SurfacePlot: React.FC<PlotProps> = () => {
//   const plotDivRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchDataAndPlot = async () => {
//       try {
//         const rows = await d3.csv<string>(
//           "https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv"
//         );

//         if (rows) {
//           const unpack = (
//             rows: Record<string, string>[],
//             key: string
//           ): number[] => {
//             return rows.map((row) => parseFloat(row[key]));
//           };

//           const zData: number[][] = [];
//           for (let i = 0; i < 24; i++) {
//             const key = i.toString();
//             zData.push(unpack(rows, key));
//           }

//           const data: Partial<Plotly.PlotData>[] = [
//             {
//               z: zData,
//               type: "surface",
//             },
//           ];

//           const layout: Partial<Plotly.Layout> = {
//             title: {
//               text: "Mt Bruno Elevation",
//             },
//             autosize: false,
//             width: 500,
//             height: 500,
//             margin: {
//               l: 65,
//               r: 50,
//               b: 65,
//               t: 90,
//             },
//           };

//           if (plotDivRef.current) {
//             Plotly.newPlot(plotDivRef.current, data, layout, {
//               responsive: true,
//               showSendToCloud: true,
//             });
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching or plotting data:", error);
//       }
//     };

//     fetchDataAndPlot();

//     return () => {
//       if (plotDivRef.current) {
//         Plotly.purge(plotDivRef.current);
//       }
//     };
//   }, []);

//   return <div ref={plotDivRef} />;
// };

// import React from "react";
// import Plot from "react-plotly.js";

// const Plot3D: React.FC = () => {
//   const data = [
//     {
//       type: "scatter3d",
//       mode: "markers",
//       x: Array.from({ length: 100 }, () => Math.random() * 10),
//       y: Array.from({ length: 100 }, () => Math.random() * 10),
//       z: Array.from({ length: 100 }, () => Math.random() * 10),
//       marker: {
//         size: 5,
//         color: Array.from({ length: 100 }, () => Math.random() * 10),
//         colorscale: "Viridis",
//       },
//     },
//   ] as Array<Plotly.Data>;

//   const layout = {
//     title: "3D Scatter Plot",
//     autosize: true,
//     scene: {
//       xaxis: { title: "X Axis" },
//       yaxis: { title: "Y Axis" },
//       zaxis: { title: "Z Axis" },
//     },
//   };

//   return (
//     <Plot
//       data={data}
//       layout={layout}
//       style={{ width: "100%", height: "1200px" }}
//     />
//   );
// };

const Plot3D: React.FC = () => {
  const plotRef = useRef<any>(null);
  const [points, setPoints] = useState<{
    x: number[];
    y: number[];
    z: number[];
    color: number[];
  }>({
    x: [],
    y: [],
    z: [],
    color: [],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prevPoints) => {
        if (prevPoints.x.length >= 100) {
          clearInterval(interval);
          return prevPoints;
        }
        const newPoint = {
          x: Math.random() * 10,
          y: Math.random() * 10,
          z: Math.random() * 10,
          color: Math.random() * 10,
        };
        const updatedPoints = {
          x: [...prevPoints.x, newPoint.x],
          y: [...prevPoints.y, newPoint.y],
          z: [...prevPoints.z, newPoint.z],
          color: [...prevPoints.color, newPoint.color],
        };
        if (plotRef.current) {
          Plotly.extendTraces(
            plotRef.current,
            {
              x: [[newPoint.x]],
              y: [[newPoint.y]],
              z: [[newPoint.z]],
              marker: { color: [[newPoint.color]] },
            },
            [0]
          );
        }
        return updatedPoints;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const data = [
    {
      type: "scatter3d",
      mode: "markers",
      x: points.x,
      y: points.y,
      z: points.z,
      marker: {
        size: 5,
        color: points.color,
        colorscale: "Viridis",
      },
    },
  ] as Array<Plotly.Data>;

  const layout = {
    title: "3D Scatter Plot",
    autosize: true,
    scene: {
      xaxis: { title: "X Axis" },
      yaxis: { title: "Y Axis" },
      zaxis: { title: "Z Axis" },
    },
  };

  return (
    <Plot
      ref={plotRef}
      data={data}
      layout={layout}
      style={{ width: "100%", height: "1200px" }}
    />
  );
};
// import React, { useEffect, useRef } from "react";
// import Plot from "react-plotly.js";
// import Plotly from "plotly.js-dist-min";

// const RealTimeChart: React.FC = () => {
//   const plotRef = useRef<Plotly.PlotlyHTMLElement | null>(null);
//   const dataRef = useRef<{ x: number[]; y: number[]; z: number[] }>({
//     x: [],
//     y: [],
//     z: [],
//   });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const newX = Math.random() * 10;
//       const newY = Math.random() * 10;
//       const newZ = Math.sin(newX) + Math.cos(newY);

//       dataRef.current.x.push(newX);
//       dataRef.current.y.push(newY);
//       dataRef.current.z.push(newZ);

//       if (dataRef.current.x.length > 100) {
//         dataRef.current.x.shift();
//         dataRef.current.y.shift();
//         dataRef.current.z.shift();
//       }

//       if (plotRef.current) {
//         Plotly.react(
//           plotRef.current,
//           [
//             {
//               x: dataRef.current.x,
//               y: dataRef.current.y,
//               z: dataRef.current.z,
//               type: "scatter3d",
//               mode: "markers",
//               marker: {
//                 size: 5,
//                 color: dataRef.current.z,
//                 colorscale: "Viridis",
//                 opacity: 0.8,
//               },
//             },
//           ],
//           {
//             title: "3D Gradient Descent Visualization",
//             scene: {
//               xaxis: { title: "X" },
//               yaxis: { title: "Y" },
//               zaxis: { title: "Z" },
//             },
//           }
//         );
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="w-full h-full">
//       <Plot
//         data={[
//           {
//             x: dataRef.current.x,
//             y: dataRef.current.y,
//             z: dataRef.current.z,
//             type: "scatter3d",
//             mode: "markers",
//             marker: {
//               size: 5,
//               color: dataRef.current.z,
//               colorscale: "Viridis",
//               opacity: 0.8,
//             },
//           },
//         ]}
//         layout={{
//           title: "3D Gradient Descent Visualization",
//           scene: {
//             xaxis: { title: "X" },
//             yaxis: { title: "Y" },
//             zaxis: { title: "Z" },
//           },
//         }}
//         useResizeHandler
//         style={{ width: "100%", height: "100%" }}
//         onInitialized={(figure, graphDiv) =>
//           (plotRef.current = graphDiv as Plotly.PlotlyHTMLElement)
//         }
//       />
//     </div>
//   );
// };

export { GradientDescentVisualizer, Plot3D };
