import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ScatterChart = ({ graphData, selectedFilter }) => {
  const formattedData = graphData.map((item) => {
    const date = new Date(item.data[0]);
    const value = parseFloat(item.data[1]);

    const filterMap = {
      product_price: "Product Price",
      product_total: "Product Total",
      gross_total: "Gross Total",
    };

    const formattedFilter = filterMap[selectedFilter] || selectedFilter;

    return {
      name: `${item.name} - ${formattedFilter}`,
      data: [
        [
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes()
          ), // UTC timestamp
          value,
        ],
      ],
    };
  });

  const options = {
    chart: {
      type: "scatter",
      zoomType: "xy",
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: null,
      },
      labels: {
        format: "{value:%m/%d %H:%M %p}",
      },
      gridLineWidth: 1,
      lineWidth: 1
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        format: "₹{value}",
      },
      lineWidth: 1,
      gridLineWidth: 1,
      min: 0, 
      max:
        Math.max(
          ...formattedData.flatMap((series) =>
            series.data.map((point) => point[1])
          )
        ) * 1.1, 
    },
    legend: {
      enabled: true,
    },
    series: formattedData,
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ScatterChart;
