"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Image from "next/image";

const CreateWorkModal = ({ modalId, addWork }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const {
    fields: servicesFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "services",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState(null); // For image file

  const watchedImage = watch("img");

  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const file = watchedImage[0];
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, [watchedImage]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "habson"); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url; // Return the secure URL
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image!");
      return null;
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Upload image to Cloudinary if a file is selected
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadImage(file);
        if (!imageUrl) return; // Stop if upload fails
      }

      // Prepare the data to be sent to the API
      const workData = {
        ...data,
        img: imageUrl, // Use the Cloudinary URL
      };

      const response = await fetch(`/api/works`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create work");
      }

      const result = await response.json();
      addWork(result);
      toast.success("Work item created successfully");
      reset();
      setImagePreview("");
      document.getElementById(modalId).close();
    } catch (error) {
      console.error("Error creating work:", error);
      toast.error(`Failed to create work item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <dialog id={modalId} className="modal">
        <div className="modal-box max-w-[1000px]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <h3 className="font-bold text-lg">Create Work Item</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="input input-bordered"
              />
              {errors.title && <span className="text-red-500">{errors.title.message}</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Details Title</span>
              </label>
              <input
                type="text"
                {...register("detailsTitle", {
                  required: "Details title is required",
                })}
                className="input input-bordered"
              />
              {errors.detailsTitle && <span className="text-red-500">{errors.detailsTitle.message}</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="select select-bordered"
              >
                <option value="">Select a category</option>
                <option value="Casestudy">Casestudy</option>
                <option value="Daily Creativity">Daily Creativity</option>
              </select>
              {errors.category && <span className="text-red-500">{errors.category.message}</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Industry</span>
              </label>
              <input
                type="text"
                {...register("industry", { required: "Industry is required" })}
                className="input input-bordered"
              />
              {errors.industry && <span className="text-red-500">{errors.industry.message}</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("img", { required: "Image is required" })}
                className="file-input file-input-bordered w-full"
              />
              {errors.img && <span className="text-red-500">{errors.img.message}</span>}
              {imagePreview && (
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Work preview"
                  width={200}
                  height={200}
                  className="mt-2 rounded-md"
                />
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Video Iframe URL</span>
              </label>
              <input
                type="url"
                {...register("videoIframeURL", {
                  required: "Video Iframe URL is required",
                })}
                className="input input-bordered"
              />
              {errors.videoIframeURL && <span className="text-red-500">{errors.videoIframeURL.message}</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Service Details</span>
              </label>
              <textarea
                {...register("serviceDetails", {
                  required: "Service details are required",
                })}
                className="textarea textarea-bordered"
                rows={4}
              ></textarea>
              {errors.serviceDetails && <span className="text-red-500">{errors.serviceDetails.message}</span>}
            </div>
            <div>
              <label className="label">
                <span className="label-text">Services</span>
              </label>
              {servicesFields.map((field, index) => (
                <div key={field.id} className="flex space-x-2 mb-2">
                  <input
                    {...register(`services.${index}.serviceName`, {
                      required: "Service name is required",
                    })}
                    placeholder="Service Name"
                    className="input input-bordered flex-grow"
                  />
                  <input
                    {...register(`services.${index}.description`, {
                      required: "Service description is required",
                    })}
                    placeholder="Service Description"
                    className="input input-bordered flex-grow"
                  />
                  <button type="button" onClick={() => remove(index)} className="btn btn-error">
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ serviceName: "", description: "" })}
                className="btn btn-secondary mt-2"
              >
                Add Service
              </button>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text text-lg font-bold">This work is trending?</span>
                <input type="checkbox" {...register("isTrending")} className="toggle toggle-primary" />
              </label>
            </div>
            <div className="w-full flex justify-end items-center">
              <Button type="submit" className="px-10 bg-[#147274] hover:bg-[#145e60]" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default CreateWorkModal;