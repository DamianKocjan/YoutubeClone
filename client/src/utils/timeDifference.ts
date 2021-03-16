function timeDifference(date1: Date, date2: Date): string {
  const difference = date1.getTime() - date2.getTime();

  const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  // difference -= daysDifference * 1000 * 60 * 60 * 24;

  // const hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  // difference -= hoursDifference * 1000 * 60 * 60;

  // const minutesDifference = Math.floor(difference / 1000 / 60);
  // difference -= minutesDifference * 1000 * 60;

  // const secondsDifference = Math.floor(difference / 1000);

  return daysDifference === 0 ? 'today' : `${daysDifference} days ago`;
}

export default timeDifference;
