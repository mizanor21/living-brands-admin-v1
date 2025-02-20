"use client";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ElevateSection = ({ data, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: data?.title || "",
      shortDescription: data?.shortDescription || "",
    },
  });

  useEffect(() => {
    // Update form values when `data` changes
    reset({
      title: data?.title || "",
      shortDescription: data?.shortDescription || "",
    });
  }, [data, reset]);

  // Submit handler to update the data
  const onSubmit = async (formData) => {
    try {
      const payload = {
        "elevateSection.title": formData.title,
        "elevateSection.shortDescription": formData.shortDescription,
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/home/${id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Elevate Section data updated successfully!");

      // toast.success("Elevate Section data updated successfully!");
    } catch (error) {
      console.error(
        "Error updating data:",
        error.response?.data || error.message
      );
      toast.error("Failed to update Elevate Section data.");
    }
  };

  return (
    <div>
      <ToastContainer /> {/* Toast container for notifications */}
      <div className="relative rounded-lg bg-white shadow-md p-[2%]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold uppercase">Elevate Section</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-3 gap-5">
            <div className="w-full">
              <label>
                Title <span className="text-red-600">*</span>
              </label>
              <br />
              <textarea
                defaultValue={data?.title}
                {...register("title", { required: "Title is required" })}
                placeholder="Title"
                aria-invalid={errors.title ? "true" : "false"}
                className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full min-h-[100px]"
              />
              <div className="min-h-6">
                {errors.title && (
                  <small className="text-[12px] text-red-600" role="alert">
                    Title is required
                  </small>
                )}
              </div>
            </div>

            <div className="w-full">
              <label>
                Short Description <span className="text-red-600">*</span>
              </label>
              <br />
              <textarea
                defaultValue={data?.shortDescription}
                {...register("shortDescription", {
                  required: "Short Description is required",
                })}
                placeholder="Short Description"
                aria-invalid={errors.shortDescription ? "true" : "false"}
                className="rounded-lg px-5 py-2 border border-b-4 border-[#125b5c] w-full min-h-[100px]"
              />
              <div className="min-h-6">
                {errors.shortDescription && (
                  <small className="text-[12px] text-red-600" role="alert">
                    Short Description is required
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end items-center">
            <Button className="px-10 bg-[#147274] hover:bg-[#145e60]">
              <input type="submit" value="Save" className="cursor-pointer" />
            </Button>
          </div>
        </form>
        <BorderBeam size={250} duration={12} delay={9} />
      </div>
    </div>
  );
};

export default ElevateSection;
