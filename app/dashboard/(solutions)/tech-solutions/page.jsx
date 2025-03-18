"use client"
import { useEffect, useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import Image from "next/image"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Custom hook for data fetching
const useFetchTechSolutions = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/tech-solutions`)
        setData(response.data[0])
      } catch (err) {
        setError("Error fetching Tech solutions data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error, setData }
}

const EditModal = ({ data, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(data)
  const [newLogoFile, setNewLogoFile] = useState(null)
  const [newLogoPreview, setNewLogoPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index][field] = value
    setFormData({ ...formData, items: updatedItems })
  }

  const handleNewLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewLogoFile(file)
      setNewLogoPreview(URL.createObjectURL(file))
    }
  }

  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "habson") // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload", formData)
      return response.data.secure_url
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image!")
      return null
    }
  }

  const handleSave = async () => {
    setUploading(true)
    try {
      let updatedBrands = [...formData.brand]

      if (newLogoFile) {
        const imageUrl = await uploadImage(newLogoFile)
        if (!imageUrl) return

        updatedBrands = [...updatedBrands, { logo: imageUrl }]
      }

      const updatedFormData = { ...formData, brand: updatedBrands }
      onSave(updatedFormData)
      onClose()
    } catch (error) {
      console.error("Error saving data:", error)
      toast.error("Failed to save data!")
    } finally {
      setUploading(false)
    }
  }

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), { title: "", content: "" }],
    }))
  }

  const handleRemoveItem = (index) => {
    setFormData((prev) => {
      const updatedItems = [...(prev.items || [])]
      updatedItems.splice(index, 1)
      return { ...prev, items: updatedItems }
    })
  }

  const handleRemoveBrand = (index) => {
    setFormData((prevData) => {
      const updatedBrands = [...(prevData.brand || [])]
      updatedBrands.splice(index, 1)
      return {
        ...prevData,
        brand: updatedBrands,
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl h-[90vh] overflow-y-scroll">
        <h2 className="text-2xl font-bold mb-4">Edit Tech Solutions</h2>

        {/* Short Description */}
        <label className="block mb-2 font-semibold">Short Description</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500 resize-none"
          rows="3"
          value={formData.shortDescription?.[0] || ""}
          onChange={(e) => handleChange("shortDescription", [e.target.value])}
          placeholder="Short Description"
        />

        {/* Items */}
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <h3 className="font-semibold mb-2 text-lg text-gray-800">Items</h3>
          </div>
          {formData.items?.map((item, index) => (
            <div
              key={item._id || index}
              className="mb-4 bg-white shadow-lg rounded-lg p-4 flex gap-4 items-start border border-gray-200"
            >
              <div className="flex-1">
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  value={item.title}
                  onChange={(e) => handleItemChange(index, "title", e.target.value)}
                  placeholder="Title"
                />
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
                  rows="2"
                  value={item.content}
                  onChange={(e) => handleItemChange(index, "content", e.target.value)}
                  placeholder="Content"
                />
              </div>
              <button
                type="button"
                className="flex-shrink-0 p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => handleRemoveItem(index)}
                aria-label="Remove Item"
              >
                ✖
              </button>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              className="px-6 py-2 text-white font-semibold rounded-full bg-gradient-to-r from-[#125b5c] to-[#17a398] hover:from-[#17a398] hover:to-[#125b5c] focus:outline-none focus:ring-2 focus:ring-[#17a398] focus:ring-offset-2 shadow-md transition-all duration-200"
              onClick={handleAddItem}
            >
              + Add New Item
            </button>
          </div>
        </div>

        {/* Brand Logos */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Brand Logos</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {formData.brand?.map((brand, index) => (
              <div key={brand._id || index} className="relative border border-gray-200 rounded-lg overflow-hidden ">
                <Image
                  src={brand.logo || "/placeholder.svg"}
                  alt={`Brand logo ${index + 1}`}
                  width={100}
                  height={100}
                  className=" object-contain"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 p-1 bg-gray-300 hover:bg-red-500 text-white rounded-full"
                  onClick={() => handleRemoveBrand(index)}
                  aria-label="Remove Logo"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* New Logo Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Upload New Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleNewLogoChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {newLogoPreview && (
            <img
              src={newLogoPreview || "/placeholder.svg"}
              alt="New logo preview"
              className="mt-4 w-full max-w-[50px]"
            />
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className="px-6 py-2 text-black font-semibold rounded-full bg-gray-300 hover:bg-slate-400 shadow-md transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 text-white font-semibold rounded-full bg-gradient-to-r from-[#125b5c] to-[#17a398] hover:from-[#17a398] hover:to-[#125b5c] focus:outline-none focus:ring-2 focus:ring-[#17a398] focus:ring-offset-2 shadow-md transition-all duration-200"
            onClick={handleSave}
            disabled={uploading}
          >
            {uploading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

const TechSolutions = () => {
  const { data, loading, error, setData } = useFetchTechSolutions()
  const [open, setOpen] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggle = (index) => {
    setOpen(open === index ? null : index)
  }

  const handleEditClick = () => {
    setIsModalOpen(true)
  }

  const handleSave = async (updatedData) => {
    try {
      const response = await axios.patch(
        `/api/tech-solutions/${data._id}`,
        updatedData,
      )
      setData(response.data.data)
      toast.success("Data successfully updated!")
    } catch (error) {
      toast.error("Error updating data.")
      console.error("Error updating tech solutions data:", error)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <section className="px-[5%] py-12 bg-white rounded-[20px] font-sora">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 lg:mb-20">
        {/* Left Side */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-3xl md:text-4xl lg:text-[48px] text-[#125b5c] font-bold">Tech Solutions</h2>
            <button
              className="px-6 py-2 text-white font-semibold rounded-full bg-gradient-to-r from-[#125b5c] to-[#17a398] hover:from-[#17a398] hover:to-[#125b5c] focus:outline-none focus:ring-2 focus:ring-[#17a398] focus:ring-offset-2 shadow-md transition-all duration-200"
              onClick={handleEditClick}
            >
              Update
            </button>
          </div>
          <p className="text-[18px] font-normal text-black mb-5 text-justify">{data?.shortDescription?.[0]}</p>
          <hr className="h-[3px] bg-black mb-5 max-w-52" />
          <p className="font-[600] text-[18px] text-[#125b5c] mb-10">
            Proud to work with the biggest tech companies in India & Abroad
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-4 items-center mb-10 gap-y-5 px-7 md:px-0">
            {data?.brand?.map((brand) => (
              <Image
                key={brand._id}
                width={100}
                height={100}
                src={brand.logo || "/placeholder.svg"}
                alt="Brand Logo"
                className="h-16 object-contain saturate-0 hover:saturate-100"
              />
            ))}
          </div>
        </div>

        {/* Right Side - Accordion */}
        <div className="space-y-4">
          {data?.items?.map((item, index) => (
            <div key={item._id} className="border-b border-gray-300">
              <button
                className="w-full flex justify-between items-center py-4 text-[16px] font-[700] text-[#125b5c] text-left"
                onClick={() => toggle(index)}
              >
                {item.title}
                {open === index ? (
                  <FaChevronUp className="ml-2 text-gray-500" />
                ) : (
                  <FaChevronDown className="ml-2 text-gray-500" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-[max-height] text-[14px] font-[400] duration-1000 ease-in-out ${
                  open === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="py-2 text-black pb-7">{item.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal data={data} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </section>
  )
}

export default TechSolutions

