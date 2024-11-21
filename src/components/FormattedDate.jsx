import React from 'react';

const FormattedDate = ({ date }) => {
  // Function to format date
  const formatDate = (date) => {
    if (!date) return "-"; // Return "-" if no date exists
    
    const parsedDate = new Date(date);
    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = parsedDate.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return <>{formatDate(date)}</>;
};

export default FormattedDate;
