export const useFormatDigits = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(number));
};

export const useFormatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      weekday: "long",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(date);
  };