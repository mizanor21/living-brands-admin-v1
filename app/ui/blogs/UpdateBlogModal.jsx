"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import Image from "next/image"

const UpdateBlogModal = ({ workId, modalId, updateWork }) => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const {
    fields: servicesFields,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: "services",
  })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("")
  const [file, setFile] = useState(null) // For image file

  const watchedImageFile = watch("imgFile")
  const watchedImageUrl = watch("imgUrl")

  useEffect(() => {
    if (watchedImageFile && watchedImageFile[0]) {
      const file = watchedImageFile[0]
      setFile(file)
      setImagePreview(URL.createObjectURL(file))
    } else if (watchedImageUrl) {
      setImagePreview(watchedImageUrl)
    }
  }, [watchedImageFile, watchedImageUrl]) // Updated dependencies

  useEffect(() => {
    if (workId) {
      const fetchWorkData = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/blogs/${workId}`)
          if (!response.ok) {
            throw new Error("Failed to fetch blog data")
          }
          const { blog } = await response.json()
          console.log("Blog data:", blog)

          // Set default values for all fields
          setValue("title", blog.title)
          setValue("detailsTitle", blog.detailsTitle)
          setValue("category", blog.category)
          setValue("industry", blog.industry)
          setValue("imgUrl", blog.img)
          setValue("videoIframeURL", blog.videoIframeURL)
          setValue("serviceDetails", blog.serviceDetails)
          setValue("isTrending", blog.isTrending)

          // Set services
          if (Array.isArray(blog.services)) {
            replace(
              blog.services.map(({ serviceName, description }) => ({
                serviceName,
                description,
              })),
            )
          }

          setImagePreview(blog.img)
        } catch (error) {
          console.error("Error fetching blog data:", error.message)
          toast.error("Failed to load blog data. Please try again.")
        } finally {
          setLoading(false)
        }
      }
      fetchWorkData()
    }
  }, [workId, setValue, replace])

  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "habson") // Replace with your Cloudinary upload preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      return data.secure_url // Return the secure URL
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image!")
      return null
    }
  }

  const onSubmit = async (data) => {
    if (!workId) return

    setLoading(true)
    try {
      let imageUrl = data.imgUrl

      // Upload new image if a file is selected
      if (file) {
        const uploadedUrl = await uploadImage(file)
        if (!uploadedUrl) return // Stop if upload fails
        imageUrl = uploadedUrl
      }

      const updatedData = {
        ...data,
        img: imageUrl, // Use the Cloudinary URL or the provided URL
      }

      const response = await fetch(`/api/blogs/${workId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update work")
      }

      const result = await response.json()
      updateWork(result)
      toast.success("Work updated successfully.")

      const modal = document.getElementById(modalId)
      if (modal) modal.close()
    } catch (error) {
      console.error("Error updating work:", error.message)
      toast.error("Failed to update work. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      console.log("Form values after setting:", {
        title: watch("title"),
        detailsTitle: watch("detailsTitle"),
        category: watch("category"),
        industry: watch("industry"),
        imgUrl: watch("imgUrl"),
        videoIframeURL: watch("videoIframeURL"),
        serviceDetails: watch("serviceDetails"),
        isTrending: watch("isTrending"),
      })
    }
  }, [loading, watch])

  useEffect(() => {
    console.log("Form values changed:", {
      title: watch("title"),
      detailsTitle: watch("detailsTitle"),
      category: watch("category"),
      industry: watch("industry"),
      imgUrl: watch("imgUrl"),
      videoIframeURL: watch("videoIframeURL"),
      serviceDetails: watch("serviceDetails"),
      isTrending: watch("isTrending"),
    })
  }, [watch])

  return (
    <div>
      <dialog id={modalId} className="modal">
        <div className="modal-box max-w-[1000px]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <h3 className="font-bold text-lg">Edit Work Item</h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="input input-bordered"
                  defaultValue={watch("title") || ""}
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
                  defaultValue={watch("detailsTitle") || ""}
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
                  defaultValue={watch("category") || ""}
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
                  defaultValue={watch("industry") || ""}
                />
                {errors.industry && <span className="text-red-500">{errors.industry.message}</span>}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Image</span>
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("imgFile")}
                    className="file-input file-input-bordered w-full"
                  />
                  <input
                    type="url"
                    {...register("imgUrl", { required: "Image URL is required if no file is uploaded" })}
                    className="input input-bordered w-full"
                    placeholder="Or enter image URL"
                    defaultValue={watch("imgUrl") || ""}
                  />
                </div>
                {imagePreview && (
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Work preview"
                    width={200}
                    height={200}
                    className="mt-2 rounded-md"
                  />
                )}
                {errors.imgUrl && !file && <span className="text-red-500">{errors.imgUrl.message}</span>}
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
                  defaultValue={watch("videoIframeURL") || ""}
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
                  defaultValue={watch("serviceDetails") || ""}
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
                      defaultValue={watch(`services.${index}.serviceName`) || ""}
                    />
                    <input
                      {...register(`services.${index}.description`, {
                        required: "Service description is required",
                      })}
                      placeholder="Service Description"
                      className="input input-bordered flex-grow"
                      defaultValue={watch(`services.${index}.description`) || ""}
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
                <label className="cursor-pointer label">
                  <span className="label-text">This work is trending?</span>
                  <input
                    type="checkbox"
                    {...register("isTrending")}
                    className="toggle toggle-primary"
                    defaultChecked={watch("isTrending") || false}
                  />
                </label>
              </div>
              <div className="w-full flex justify-end items-center">
                <Button type="submit" className="px-10 bg-[#147274] hover:bg-[#145e60]" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </div>
  )
}

export default UpdateBlogModal

