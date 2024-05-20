export const dateAddMinutes = (durations: number, datetime?: any): Date => {
  const sample: Date = datetime instanceof Date ? datetime : new Date(datetime);
  const addingTime = durations * 60 * 1000;

  return new Date(
    (isNaN(sample.getTime()) ? new Date().getTime() : sample.getTime()) +
      addingTime
  );
};
