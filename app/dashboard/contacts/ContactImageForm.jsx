"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactImageForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const onSubmit = async (data) => {
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

        // Save the image URL to your API
        const saveResponse = await fetch("/api/contact-img", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ img: data.image }),
        });

        if (saveResponse.ok) {
          toast.success("Image successfully uploaded!");
          reset();
          setImagePreview(null);
        } else {
          toast.error("Failed to save image URL");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Upload Contact Image
      </h2>

      {/* Image */}
      <div className="flex flex-col">
        <label
          htmlFor="image"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Contact Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
          id="image"
          {...register("image", { required: "Image is required" })}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImagePreview(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 max-w-xs"
          />
        )}
        {errors.image && (
          <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          className="px-6 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all"
          type="submit"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </div>
    </form>
  );
};

export default ContactImageForm;