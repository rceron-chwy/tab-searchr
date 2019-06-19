export const getSuggestions = (inputValue, suggestions) => {
  let count = 0;
  return suggestions.filter((suggestion) => {
    const keep = (!inputValue || suggestion.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) && count < 4; // eslint-disable-line
    if (keep) count += 1;
    return keep;
  });
};

export const getSuggestionsForSelect = (suggestions) => {
  return suggestions.map(suggestion => ({
    value: suggestion,
    label: suggestion,
  }));
};
