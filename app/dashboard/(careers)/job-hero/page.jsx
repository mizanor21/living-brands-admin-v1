"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobHeroForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [heroId, setHeroId] = useState() || null > null;
  const [imagePreview, setImagePreview] = useState() || null > null;

  useEffect(() => {
    // Fetch default data from the API
    fetch("/api/job-hero")
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const heroData = data[0];
          reset(heroData);
          setHeroId(heroData._id);
          setImagePreview(heroData.image);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job hero data:", error);
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data) => {
    if (!heroId) {
      console.error("No hero ID available for update");
      return;
    }

    setLoading(true);

    // Handle image upload
    if (data.image && data.image[0]) {
      const formData = new FormData();
      formData.append("file", data.image[0]);
      formData.append("upload_preset", "habson"); // Replace with your Cloudinary upload preset

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const imageData = await response.json();
        data.image = imageData.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
        setLoading(false);
        return;
      }
    } else {
      // If no new image is uploaded, use the existing image URL
      data.image = imagePreview;
    }

    // Update hero data
    fetch(`/api/job-hero/${heroId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        toast.success("Data successfully updated!");
        setImagePreview(data.image);
      })
      .catch((error) => {
        toast.error("Failed to update data");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Update Job Hero
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="flex flex-col">
          <label
            htmlFor="summary"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Summary
          </label>
          <input
            className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
            id="summary"
            placeholder="Enter a brief summary..."
            {...register("summary", { required: "Hero Summary is required" })}
          />
          {errors.summary && (
            <p className="text-sm text-red-500 mt-1">
              {errors.summary.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
            id="title"
            placeholder="Enter the title..."
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
          id="description"
          rows={4}
          placeholder="Write a short description..."
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Image */}
      <div className="flex flex-col">
        <label
          htmlFor="image"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Background Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
          id="image"
          {...register("image")}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImagePreview(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
        {imagePreview && (
          <img
            src={imagePreview || "/placeholder.svg"}
            alt="Preview"
            className="mt-2 max-w-xs"
          />
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          className="px-6 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all"
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Job Hero"}
        </button>
      </div>
    </form>
  );
};

export default JobHeroForm;
