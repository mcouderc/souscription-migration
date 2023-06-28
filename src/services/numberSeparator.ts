export default function numberSeparator() {
  const formatNumberWithSpace = (number: number) => {
    return number
      .toString()
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return {
    formatNumberWithSpace
  };
}
