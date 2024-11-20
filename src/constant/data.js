export const activities = [
  {
    text: "Asmita Salvi has extended the bidding time by 1 day.",
    time: "05 Apr 2024 at 03:56 pm",
    orderEnding: "15:29 → 15:55",
  },
  {
    text: "You edited the configurations.",
    time: "05 Apr 2024 at 11:29 am",
    change: "Show Best Price to Participants: Yes → No",
  },
  {
    text: "Asmita Salvi has extended the bidding time by 1 hour.",
    time: "05 Apr 2024 at 11:51 am",
    orderEnding: "14:55 → 15:55",
  },
  {
    text: "Asmita Salvi has extended the bidding time by 1 day 23 hours.",
    time: "04 Apr 2024 at 03:51 pm",
    orderEnding: "15:28 → 15:55",
  },
  {
    text: "Asmita Salvi has extended the bidding time by 3 hours.",
    time: "04 Apr 2024 at 10:56 am",
    orderEnding: "09:00 → 12:02",
  },
  {
    text: "LUCKY PLY AND LAMINATES has placed the bid.",
    time: "02 Apr 2024 at 09:08 pm",
  },
];

export const evaluationOptions = [
    { label: "10 Minutes", value: "10 Minutes" },
    { label: "30 Minutes", value: "30 Minutes" },
    { label: "7 Days", value: "7 Days" },
    { label: "Custom", value: "Custom" },
    { label: "Fixed Time", value: "Fixed Time" },
  ];

export const chartOptions = {
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
