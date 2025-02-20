"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contacts = () => {
  const [contactImg, setContactImg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch contact images on component mount
  useEffect(() => {
    const fetchContactImages = async () => {
      try {
        const res = await fetch("/api/contact-img");
        const data = await res.json();
        setContactImg(data);
      } catch (error) {
        console.error("Failed to fetch contact images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactImages();
  }, []);

  // Handle delete functionality
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/contact-img?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted item from the state
        setContactImg((prev) => prev.filter((item) => item._id !== id));
        toast.success("Image deleted successfully!");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      toast.error("Error deleting image");
      console.error("Error deleting contact image:", error);
    }
  };

  // Handle image upload and form submission
  const onSubmit = async (data) => {
    setLoading(true);
  
    if (data.image && data.image[0]) {
      const formData = new FormData();
      formData.append("file", data.image[0]);
      formData.append("upload_preset", "habson"); // Replace with your Cloudinary upload preset
  
      try {
        // Upload image to Cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const imageData = await response.json();
        data.image = imageData.secure_url;
  
        // Save image URL to the database via API
        const saveResponse = await fetch("/api/contact-img", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ img: data.image }),
        });
  
        if (saveResponse.ok) {
          // Re-fetch updated images from API
          const updatedRes = await fetch("/api/contact-img");
          const updatedData = await updatedRes.json();
          
          // Update state with the latest images
          setContactImg(updatedData);
  
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
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-3xl font-bold uppercase">Contact Images</h1>
      </div>

      {/* Image Upload Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow-lg mb-6"
      >
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Upload Contact Image
        </h2>

        {/* Image Input */}
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

      {/* Display Contact Images */}
      <div className="grid grid-cols-3 gap-3">
        {contactImg.map((item) => (
          <div key={item._id} className="relative group">
            <Image
              width={500}
              height={500}
              src={item.img}
              alt="contact"
              className="w-full h-auto"
            />
            <div className="absolute hidden right-5 top-5 group-hover:flex">
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-white p-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-500"
              >
                <AiOutlineDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;