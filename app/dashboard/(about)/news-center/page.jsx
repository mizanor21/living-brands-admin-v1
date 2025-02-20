"use client";

import React, { useState, useEffect } from "react";
import NewsItems from "@/app/ui/NewsCenter/NewsItems";
import { useNewsItemsData } from "@/components/custom/DataFetch";

const News = () => {
  // State for storing all data and filtered data
  const { data: allData, isLoading, error } = useNewsItemsData();
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Casestudy"); // Default to "Casestudy"

  // Effect to load all items initially or filter based on the default category
  useEffect(() => {
    if (allData) {
      if (selectedCategory === "All") {
        setFilteredData(allData); // Show all data
      } else {
        const filtered = allData.filter(
          (item) => item.category === selectedCategory
        );
        setFilteredData(filtered); // Filter based on default category
      }
    }
  }, [allData, selectedCategory]);

  // Function to handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredData(allData); // Show all data
    } else {
      const filtered = allData.filter((item) => item.category === category);
      setFilteredData(filtered); // Filter based on category
    }
  };

  if (isLoading) {
    return <div className="min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Failed to load data</div>;
  }

  return (
    <div className="bg-white relative z-[110] rounded-b-[40px] pb-10 lg:pb-20 font-sora">
      <div className=" pb-10">
        <div className="flex justify-center md:justify-end my-8 space-x-4 px-[10%] md:px-[5%]">
          <button
            onClick={() => handleCategoryChange("Casestudy")}
            className={`px-5 py-[10px] rounded-full text-[12px] lg:text-sm font-[400] lg:font-semibold transition-all duration-300 ${
              selectedCategory === "Casestudy"
                ? "bg-[#125b5c] text-white"
                : "border-2 border-[#125b5c] text-[#125b5c] hover:bg-[#125b5c] hover:text-white"
            }`}
          >
            Press Releases
          </button>
          <button
            onClick={() => handleCategoryChange("Daily Creativity")}
            className={`px-5 py-[10px] rounded-full text-[12px] lg:text-sm font-[400] lg:font-semibold transition-all duration-300 ${
              selectedCategory === "Daily Creativity"
                ? "bg-[#125b5c] text-white"
                : "border-2 border-[#125b5c] text-[#125b5c] hover:bg-[#125b5c] hover:text-white"
            }`}
          >
            Media Features
          </button>
        </div>

        <div className="hidden md:block md:px-[5%]">
          <div className="border-b border-gray-300" />
        </div>

        {/* Pass the filtered data to Items component */}
        <div className="pt-3 px-[10%] lg:px-[5%] mt-5">
          <NewsItems data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default News;
