"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-8 md:gap-y-20">
    {[1, 2, 3].map((key) => (
      <div key={key} className="space-y-3">
        <div className="h-72 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-6 w-1/2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-pulse"></div>
        <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md animate-pulse"></div>
      </div>
    ))}
  </div>
);

const NewsItems = ({ data, setData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  if (!data) {
    return <SkeletonLoader />;
  }

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setValue("title", item.title);
    setValue("img", item.img);
    setValue("description", item.description || "");
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    // setSelectedItem(item);
    // setValue("title", item?.title);
    // setValue("img", item.img);
    // setValue("description", item.description || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    reset();
  };

  const onSubmit = async (formData) => {
    if (!selectedItem) return;

    try {
      // Send PATCH request using Axios
      const { data: updatedItem } = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/news-center/${selectedItem._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Notify the user of success
      alert("News item updated successfully!");

      // Update local data
      const updatedData = data.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      );
      setData(updatedData); // Ensure setData updates the parent state
      handleCloseModal();
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", error.response.data);
        alert(
          `Failed to update: ${error.response.data.message || "Unknown error"}`
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        alert("No response from the server. Please try again later.");
      } else {
        // Other errors
        console.error("Error:", error.message);
        alert("An error occurred while updating the news item.");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">News Items</h1>
        <button onClick={() => handleAdd()} className="btn px-10 py-2">
          Add News
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-10">
        {data.map((item) => (
          <div key={item._id} className="relative">
            <div>
              <Image
                src={item.img}
                alt={item.title}
                width={600}
                height={100}
                className="rounded-xl object-cover"
              />
              <p className="text-[16px] font-medium text-black mt-2">
                {item.title}
              </p>
            </div>
            <button
              className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-all"
              onClick={() => handleEditClick(item)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              className="absolute top-4 right-4 text-white bg-red-500 p-2 rounded-full hover:bg-red-600 focus:outline-none"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6">Edit News Item</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  className={`mt-1 w-full px-4 py-2 bg-gray-50 border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                    errors.title ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="img" className="block text-sm font-medium">
                  Image URL
                </label>
                <input
                  type="text"
                  id="img"
                  {...register("img", { required: "Image URL is required" })}
                  className={`mt-1 w-full px-4 py-2 bg-gray-50 border ${
                    errors.img ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                    errors.img ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                />
                {errors.img && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.img.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows="4"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className={`mt-1 w-full px-4 py-2 bg-gray-50 border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                    errors.description
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-all"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsItems;
