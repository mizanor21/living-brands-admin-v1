"use client";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JourneySection = ({ data = {}, id }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: data.title || "",
      image: data.image || "",
    },
  });

  useEffect(() => {
    // Reset form values when `data` changes
    reset({
      title: data.title || "",
      image: data.image || "",
    });
  }, [data, reset]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        "journeySection.title": formData.title,
        "journeySection.image": formData.image,
      };

      const headers = { "Content-Type": "application/json" };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/home/${id}`,
        payload,
        { headers }
      );

      toast.success("Journey Section data updated successfully!");
    } catch (error) {
      console.error(
        "Error updating data:",
        error.response?.data || error.message
      );
      toast.error("Failed to update Journey Section data.");
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
      <ToastContainer /> {/* Toast container for notifications */}
      <div className="relative rounded-lg bg-white shadow-md p-[2%]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold uppercase">Journey Section</h3>
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
                aria-invalid={errors.title ? "true" : "false"}
                className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full min-h-[100px]"
              />
              {renderError(errors.title)}
            </div>

            <div className="w-full">
              <label>
                Image URL <span className="text-red-600">*</span>
              </label>
              <input
                {...register("image", {
                  required: "Image URL is required",
                  pattern: {
                    value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/,
                    message: "Please enter a valid image URL",
                  },
                })}
                type="url"
                placeholder="Image URL"
                aria-invalid={errors.image ? "true" : "false"}
                className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full"
              />
              {renderError(errors.image)}
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

export default JourneySection;
