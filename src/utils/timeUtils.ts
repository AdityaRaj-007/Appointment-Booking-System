export const timeToMin = (timeStr: string): number => {
  if (!timeStr.includes(":")) {
    throw new Error("Invalid time format.");
  }
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

export const minToTime = (time: number): string => {
  const strTime =
    Math.floor(time / 60)
      .toString()
      .padStart(2, "0") +
    ":" +
    (time % 60).toString().padStart(2, "0");

  return strTime;
};
