export const formatDate = (dateString: string | null) => {
  if (!dateString) return { date: null, time: null };
  const date = new Date(dateString);
  return { date: date.toLocaleDateString(), time: date.toLocaleTimeString() };
};
