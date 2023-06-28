export default function searchSiret() {
  const searchSiretData = async (search, limit, target, queryTarget) => {
    let items: any = [];
    const responses = {
      nom_entreprise: 'resultats_nom_entreprise',
      siret: 'resultats_siret',
      default: 'all'
    };
    if (search) {
      const url = `https://suggestions.pappers.fr/v2?q=${encodeURIComponent(
        search
      )}${limit}${target}`;

      try {
        const result = await fetch(url);
        const data = await result.json();
        const whichData = responses[queryTarget] || responses['default'];
        if (whichData !== responses.default) {
          items = data[responses[queryTarget]].map((item) => {
            return {
              label: `${item.nom_entreprise}${
                item.siege.code_postal ? ` (${item.siege.code_postal})` : ''
              } - ${item.libelle_code_naf} - ${item.siege.siret}`,
              ...item
            };
          });
        } else {
          const mergeresponses = [...data[responses.nom_entreprise], ...data[responses.siret]];
          items = mergeresponses.map((item) => {
            return {
              label: `${item.nom_entreprise}${
                item.siege.code_postal ? ` (${item.siege.code_postal})` : ''
              } - ${item.libelle_code_naf} - ${item.siege.siret}`,
              ...item
            };
          });
        }
        return items;
      } catch {
        return {};
      }
    }
  };

  const onPasteSiretEvent = (event: ClipboardEvent): string => {
    if (event.clipboardData) {
      const searchItem = event.clipboardData
        .getData('text')
        .toString()
        .replace(/[^0-9a-zA-Z]?/g, '');
      event.preventDefault();
      return searchItem;
    }
    return '';
  };

  return {
    searchSiretData,
    onPasteSiretEvent
  };
}
