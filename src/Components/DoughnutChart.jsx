import React, { useContext } from "react";
import { ContextProvider } from "../Context";
import CanvasJSReact from "../canvasjs.react";
import colors from "../data/colors";
import { CREDIT } from "../data/constants";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
CanvasJS.addColorSet("newColors", colors);

const DoughnutChart = ({ Categories }) => {
  const { state } = useContext(ContextProvider);

  const array = (Categories, amount) => {
    const newArray = [];
    Categories.forEach((item) => {
      if (item !== "Income") {
        newArray.push({
          y: Math.ceil((state.categories[`${item}`] / amount) * 100),
          label: item,
        });
      }
    });
    return newArray;
  };

  const newCategories = Object.keys(state.categories).filter(
    (e) => state.categories[`${e}`] !== 0
  );

  const totalAmount = newCategories.reduce((totalAmt = 0, e) => {
    if (e !== CREDIT) {
      totalAmt += state.categories[`${e}`];
    }
    return totalAmt;
  }, 0);

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
        dataPoints: array(newCategories, totalAmount),
      },
    ],
  };

  return (
    <div>
      <CanvasJSChart
        options={options}
        /* onRef={ref => this.chart = ref} */
      />
      {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
    </div>
  );
};

export default DoughnutChart;
