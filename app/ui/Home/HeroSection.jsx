"use client";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeroSection = ({ data, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: data?.title || "",
      shortDescription: data?.shortDescription || "",
      image: data?.image || "",
    },
  });

  const [imageFile, setImageFile] = useState(null); // State to store the selected image file
  const [previewImage, setPreviewImage] = useState(data?.image || ""); // State to store the image preview

  useEffect(() => {
    console.log("Updating form values with new data"); // Log whenever data is updated
    reset({
      title: data?.title || "",
      shortDescription: data?.shortDescription || "",
      image: data?.image || "",
    });
    setPreviewImage(data?.image || ""); // Set preview image when data is updated
  }, [data, reset]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Set preview image
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "habson"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload`, // Replace with your Cloudinary cloud name
        formData
      );
      return response.data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      let imageUrl = data?.image; // Use existing image URL if no new file is uploaded

      // Upload new image if a file is selected
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      // Prepare payload
      const payload = {
        "heroSection.title": formData.title,
        "heroSection.shortDescription": formData.shortDescription,
        "heroSection.image": imageUrl, // Use the Cloudinary URL
      };

      const headers = { "Content-Type": "application/json" };

      // Send PATCH request to update data
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/home/${id}`,
        payload,
        { headers }
      );
      alert("Hero Section data updated successfully!");

      // Show success notification
      // toast.success("Hero Section data updated successfully!");
    } catch (error) {
      alert("Failed to update Hero Section data");
    }
  };

  const renderError = (error) =>
    error && (
      <small className="text-[12px] text-red-600" role="alert">
        {error.message}
      </small>
    );

  return (
    <div>
      <ToastContainer /> {/* Toast container to display notifications */}
      <div className="relative rounded-lg bg-white p-[2%] shadow-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold uppercase">Hero Section</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-5">
            <div className="w-full">
              <label>
                Title <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("title", { required: "Title is required" })}
                placeholder="Title"
                defaultValue={data?.title || ""}
                className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full min-h-[100px]"
              />
              {renderError(errors.title)}
            </div>
            <div className="w-full">
              <label>
                Short Description <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("shortDescription", {
                  required: "Short Description is required",
                })}
                placeholder="Short Description"
                defaultValue={data?.shortDescription || ""}
                className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full min-h-[100px]"
              />
              {renderError(errors.shortDescription)}
            </div>
            <div className="w-full">
              <label>
                Hero Image <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full"
              />
              {renderError(errors.image)}
              <div className="flex justify-end">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Hero"
                    className="mt-2 rounded-lg max-h-24"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end items-center mt-4">
            <Button
              type="submit"
              className="px-10 bg-[#147274] hover:bg-[#145e60]"
            >
              Save
            </Button>
          </div>
        </form>
        <BorderBeam size={250} duration={12} delay={9} />
      </div>
    </div>
  );
};

export default HeroSection;