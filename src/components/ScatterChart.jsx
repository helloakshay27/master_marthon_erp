import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ScatterChart = () => {
  const options = {
    chart: {
      type: 'scatter',
      zoomType: 'xy'
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: null
      },
      labels: {
        format: '{value:%m/%d %H:%M %p}'
      }
    },
    yAxis: {
      title: {
        text: null
      },
      labels: {
        format: '₹{value}'
      }
    },
    legend: {
      enabled: true
    },
    series: [
      {
        name: 'LUCKY PLY AND LAMINATES',
        data: [
          [Date.UTC(2024, 3, 2, 22, 23), 13000],
          [Date.UTC(2024, 3, 2, 16, 11), 10000],
        ]
      },
      {
        name: 'OMFURN INDIA LIMITED',
        data: [
          [Date.UTC(2024, 3, 2, 19, 48), 14200],
          [Date.UTC(2024, 3, 2, 15, 36), 10800],
        ]
      }
    ]
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ScatterChart;
