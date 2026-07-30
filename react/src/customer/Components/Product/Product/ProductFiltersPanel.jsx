import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import { singleFilter } from "./FilterData";
import { isFilterSelected } from "./filterUtils";

export default function ProductFiltersPanel({
  dynamicFilters,
  filtersLoading = false,
  colorValue,
  sizeValue,
  disccount,
  stock,
  priceRange,
  priceBounds,
  onFilter,
  onPriceChange,
  onPriceCommit,
  onRadioFilterChange,
  className = "hidden lg:block border rounded-md p-5",
  idPrefix = "",
}) {
  const renderFilterOptions = (section, isMobile = false) => {
    if (section.id === "color") {
      const hasOnlyCssColors = section.options.every((option) => option.isCssColor);

      if (hasOnlyCssColors) {
        return (
          <div className="flex flex-wrap gap-3">
            {section.options.map((option) => (
              <Tooltip title={option.label} key={option.value}>
                <div
                  onClick={() => onFilter(option.value, section.id)}
                  className={`w-8 h-8 rounded-full cursor-pointer shadow-sm border-2 ${
                    isFilterSelected(colorValue, option.value)
                      ? "border-indigo-600 ring-2 ring-indigo-200"
                      : "border-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      option.value.toLowerCase() === "white" ? "#f8f9fa" : option.value.toLowerCase(),
                  }}
                ></div>
              </Tooltip>
            ))}
          </div>
        );
      }
    }

    return (
      <div className={isMobile ? "space-y-6" : "space-y-4"}>
        {section.options.map((option, optionIdx) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${idPrefix}filter-${isMobile ? "mobile-" : ""}${section.id}-${optionIdx}`}
              name={`${section.id}[]`}
              value={option.value}
              type="checkbox"
              checked={isFilterSelected(
                section.id === "color" ? colorValue : sizeValue,
                option.value
              )}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              onChange={() => onFilter(option.value, section.id)}
            />
            <label
              htmlFor={`${idPrefix}filter-${isMobile ? "mobile-" : ""}${section.id}-${optionIdx}`}
              className={`ml-3 min-w-0 flex-1 ${isMobile ? "text-gray-500" : "text-sm text-gray-600"}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <form className={className}>
      {filtersLoading && (
        <p className="text-sm text-gray-500 pb-4">Loading filters...</p>
      )}
      {dynamicFilters.map((section) => (
        <Disclosure
          as="div"
          key={section.id}
          className="border-b border-gray-200 py-6"
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">{section.name}</span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                {renderFilterOptions(section)}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
      {singleFilter.map((section) => (
        <Disclosure
          as="div"
          key={section.id}
          className="border-b border-gray-200 py-6"
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">{section.name}</span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                {section.id === "price" ? (
                  <div className="px-3">
                    <Slider
                      value={priceRange}
                      onChange={onPriceChange}
                      onChangeCommitted={onPriceCommit}
                      valueLabelDisplay="auto"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      step={500}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>₹{priceBounds.min.toLocaleString()}</span>
                      <span>₹{priceBounds.max.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <FormControl>
                    <RadioGroup aria-labelledby="filter-radio-group">
                      {section.options.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio checked={section.id === "disccout" ? disccount === option.value : stock === option.value} />}
                          label={option.label}
                          onChange={(e) => onRadioFilterChange(e, section.id)}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </form>
  );
}

export function MobileProductFiltersPanel(props) {
  return (
    <ProductFiltersPanel
      {...props}
      className="mt-4 border-t border-gray-200"
      idPrefix="mobile-"
    />
  );
}
