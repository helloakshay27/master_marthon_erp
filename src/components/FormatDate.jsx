import React from 'react';

const FormatDate = ({ timestamp }) => {
  const formattedDate = new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // timeZoneName: 'short',
  });

  return <div>{formattedDate}</div>;
};


export default FormatDate;