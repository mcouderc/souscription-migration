export default function searchCitys() {
  const getCitys = async (postalCode: string) => {
    if (postalCode) {
      const url = `https://apicarto.ign.fr/api/codes-postaux/communes/${postalCode}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const citys = data.map((item) => {
          return item.nomCommune;
        });
        return citys;
      } catch {
        return [];
      }
    }
  };

  return {
    getCitys
  };
}
