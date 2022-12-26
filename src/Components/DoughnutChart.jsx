import React, { useEffect, useState } from "react";
import CanvasJSReact from "../canvasjs.react";
import colors from "../data/colors";
import { CREDIT } from "../data/constants";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
CanvasJS.addColorSet("newColors", colors);

const array = (Categories, categories, amount) => {
  const newArray = [];
  Categories.forEach((item) => {
    if (item !== "Income") {
      newArray.push({
        y: Math.ceil((categories[`${item}`] / amount) * 100),
        label: item,
      });
    }
  });
  return newArray;
};

const DoughnutChart = ({ date, categories, totalAmount }) => {
  // const { state } = useContext(ContextProvider);
  const [newCat, setnewCat] = useState([]);

  useEffect(() => {
    const cat = Object.keys(categories)
      .filter((e) => categories[`${e}`] !== 0)
      .filter((e) => e !== "Income");

    setnewCat(cat);
  }, []);

  const options = {
    colorSet: "newColors",
    animationEnabled: true,
    subtitles: [
      {
        text: `$${totalAmount}`,
        verticalAlign: "center",
        fontSize: 24,
        dockInsidePlotArea: true,
      },
    ],
    data: [
      {
        type: "doughnut",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}%",
        indexLabelFontSize: 12,
        indexLabel: "{label} - {y}%",
        indexLabelFontFamily: "poppins",
        innerRadius: "75%",
        dataPoints: array(newCat, categories, totalAmount),
      },
    ],
  };

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default DoughnutChart;
