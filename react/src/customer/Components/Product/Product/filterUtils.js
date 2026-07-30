const CSS_COLORS = new Set([
  "white", "black", "red", "blue", "green", "yellow", "pink", "purple",
  "brown", "beige", "grey", "gray", "orange", "navy", "maroon", "gold",
  "tan", "khaki", "camel",
]);

export const buildDynamicFilters = (filterMeta) => {
  if (!filterMeta) {
    return [];
  }

  const sections = [];

  if (filterMeta.colors?.length > 0) {
    sections.push({
      id: "color",
      name: "Color",
      options: filterMeta.colors.map((color) => ({
        value: color,
        label: color,
        isCssColor: CSS_COLORS.has(color.toLowerCase()),
      })),
    });
  }

  if (filterMeta.sizes?.length > 0) {
    const sizeLabel =
      filterMeta.sizeType === "WAIST"
        ? "Waist Size"
        : filterMeta.sizeType === "SHOE"
        ? "Shoe Size"
        : "Size";

    sections.push({
      id: "size",
      name: sizeLabel,
      options: filterMeta.sizes.map((size) => ({
        value: size,
        label: size,
      })),
    });
  }

  return sections;
};

export const isFilterSelected = (selectedValue, optionValue) => {
  if (!selectedValue || !optionValue) {
    return false;
  }
  return selectedValue
    .split(",")
    .some((item) => item.trim().toLowerCase() === optionValue.toLowerCase());
};

export const formatCategoryTitle = (category = "") =>
  category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
