"use client";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Intro = ({ data, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      videoURL: data?.videoURL || "",
    },
  });

  const [videoFile, setVideoFile] = useState(null); // State to store the selected video file
  const [previewVideo, setPreviewVideo] = useState(data?.videoURL || ""); // State to store the video preview
  const [isUploading, setIsUploading] = useState(false); // State to track video upload progress

  useEffect(() => {
    console.log("Updating form values with new data"); // Log whenever data is updated
    reset({
      videoURL: data?.videoURL || "",
    });
    setPreviewVideo(data?.videoURL || ""); // Set preview video when data is updated
  }, [data, reset]);

  // Handle video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setPreviewVideo(URL.createObjectURL(file)); // Set preview video
    }
  };

  // Upload video to Cloudinary
  const uploadVideoToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "habson"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dov6k7xdk/video/upload`, // Use the video upload endpoint
        formData
      );
      return response.data.secure_url; // Return the uploaded video URL
    } catch (error) {
      console.error("Error uploading video to Cloudinary:", error);
      throw error;
    }
  };

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      setIsUploading(true); // Disable the Save button during upload

      let videoUrl = data?.videoURL; // Use existing video URL if no new file is uploaded

      // Upload new video if a file is selected
      if (videoFile) {
        videoUrl = await uploadVideoToCloudinary(videoFile);
      }

      // Prepare payload
      const payload = {
        "videoSection.videoURL": videoUrl, // Use the Cloudinary URL
      };

      const headers = { "Content-Type": "application/json" };

      // Send PATCH request to update data
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/home/${id}`,
        payload,
        { headers }
      );

      alert("Video updated successfully!");
      // Show success notification
    //   toast.success("Video updated successfully!");
    } catch (error) {
      alert("Error updating video");
    } finally {
      setIsUploading(false); // Re-enable the Save button
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
          <h3 className="font-bold uppercase">Intro Video</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-5">
            <div className="w-full">
              <label>
                Video <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full"
              />
              {renderError(errors.videoURL)}
              <div className="flex justify-end mt-2">
                {previewVideo && (
                  <video
                    src={previewVideo}
                    controls
                    className="mt-2 rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end items-center mt-4">
            <Button
              type="submit"
              className="px-10 bg-[#147274] hover:bg-[#145e60]"
              disabled={isUploading} // Disable button during upload
            >
              {isUploading ? "Uploading..." : "Save"}
            </Button>
          </div>
        </form>
        <BorderBeam size={250} duration={12} delay={9} />
      </div>
    </div>
  );
};

export default Intro;