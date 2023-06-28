export default function searchAddress() {
  const searchAddressData = async (search: string, value: string, isCityCode: boolean) => {
    if (!Number(search) && search.length > 2) {
      const url = `https://api-adresse.data.gouv.fr/search/?limit=5&q=${encodeURIComponent(
        value ? `${value} ${search}` : search
      )}&autocomplete=1${isCityCode ? '&type=municipality' : ''}`;
      try {
        const response = await fetch(url);
        const address = await response.json();

        const items = address.features.map((item) => {
          return {
            label: item.properties.label,
            address: item.properties.name,
            codeCity: item.properties.postcode,
            city: item.properties.city
          };
        });
        return items;
      } catch {
        return {};
      }
    }
  };

  return {
    searchAddressData
  };
}
