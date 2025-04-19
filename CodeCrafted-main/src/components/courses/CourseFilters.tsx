import React from "react";
import { categories } from "@/lib/data/mock-data";

interface CourseFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-lg font-medium">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="all-categories"
              type="radio"
              name="category"
              checked={selectedCategory === null}
              onChange={() => onCategoryChange(null)}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="all-categories"
              className="ml-2 text-sm text-gray-700">
              All Categories
            </label>
          </div>

          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                id={`category-${category}`}
                type="radio"
                name="category"
                checked={selectedCategory === category}
                onChange={() => onCategoryChange(category)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`category-${category}`}
                className="ml-2 text-sm text-gray-700">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium">Price Range</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">${priceRange[0]}</span>
            <span className="text-sm text-gray-600">${priceRange[1]}</span>
          </div>
          <div className="flex space-x-4">
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange[0]}
              onChange={(e) =>
                onPriceRangeChange([parseInt(e.target.value), priceRange[1]])
              }
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange[1]}
              onChange={(e) =>
                onPriceRangeChange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
