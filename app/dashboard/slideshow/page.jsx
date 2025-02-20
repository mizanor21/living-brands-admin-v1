"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Edge = () => {
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    image: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch data from the API
  useEffect(() => {
    fetchEdges();
  }, []);

  const fetchEdges = async () => {
    try {
      const response = await fetch("/api/slideshow"); // Adjust URL as needed
      const data = await response.json();
      setEdges(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch data!");
    }
  };

  // Handle input changes in the modal form
  const handleChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setModalData({ ...modalData, image: file });
    }
  };

  // Open modal for creating a new edge
  const openCreateModal = () => {
    setModalData({
      title: "",
      image: "",
    });
    setImagePreview(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  // Open modal for updating an existing edge
  const openEditModal = (edge) => {
    setModalData({
      title: edge.title,
      image: edge.image,
    });
    setImagePreview(edge.image);
    setIsEdit(true);
    setCurrentId(edge._id);
    setIsModalOpen(true);
  };

  // Upload image to Cloudinary
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
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image!");
      return null;
    }
  };

  // Create new edge data
  const createEdge = async () => {
    setUploading(true);
    try {
      let imageUrl = modalData.image;

      // Upload new image if a file is selected
      if (typeof modalData.image === "object") {
        imageUrl = await uploadImage(modalData.image);
        if (!imageUrl) return;
      }

      const newEdge = {
        ...modalData,
        image: imageUrl,
      };

      const response = await fetch("/api/slideshow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEdge),
      });

      if (response.ok) {
        fetchEdges(); // Refresh data after creation
        setIsModalOpen(false); // Close modal
        toast.success(" Created successfully!");
      } else {
        toast.error("Failed to create !");
      }
    } catch (error) {
      console.error("Failed to create  data:", error);
      toast.error("Failed to create !");
    } finally {
      setUploading(false);
    }
  };

  // Update edge data by ID
  const updateEdge = async () => {
    setUploading(true);
    try {
      let imageUrl = modalData.image;

      // Upload new image if a file is selected
      if (typeof modalData.image === "object") {
        imageUrl = await uploadImage(modalData.image);
        if (!imageUrl) return;
      }

      const updatedData = {
        ...modalData,
        image: imageUrl,
      };

      const response = await fetch(`/api/slideshow/${currentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        fetchEdges(); // Refresh data after update
        setIsModalOpen(false); // Close modal
        toast.success("Updated successfully!");
      } else {
        toast.error("Failed to update!");
      }
    } catch (error) {
      console.error("Failed to update data:", error);
      toast.error("Failed to update!");
    } finally {
      setUploading(false);
    }
  };

  // Delete edge data by ID
  const deleteEdge = async (id) => {
    try {
      const response = await fetch(`/api/slideshow?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchEdges(); // Refresh data after deletion
        toast.success("Deleted successfully!");
      } else {
        toast.error("Failed to delete!");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete!");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="font-sora px-6 py-12 bg-[#f5f5f5] min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <button
        onClick={openCreateModal}
        className="mb-6 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
      >
        Add New Slider
      </button>

      <div className="grid grid-cols-3 gap-5">
        {edges.map((edge, index) => (
          <div
            key={edge._id}
            className={`relative group`}
          >
              <Image
              width={700}
              height={400}
                src={edge.image}
                alt="Edge Image"
                className="rounded-lg shadow-md object-cover max-h-72"
              />

                <div className="absolute top-3 right-3 gap-4 hidden group-hover:flex">
                  <button
                    onClick={() => openEditModal(edge)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <CiEdit />

                  </button>
                  <button
                    onClick={() => deleteEdge(edge._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <RiDeleteBin5Fill />
                  </button>
                </div>

                <h1 className="absolute bottom-3 left-3 text-3xl font-bold text-[#0166B3] 
               bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
  {edge.title}
</h1>

          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {isEdit ? "Edit Edge" : "Add New Edge"}
            </h2>
            <label className="block mb-2 font-semibold">Title</label>
            <input
              name="title"
              value={modalData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full mb-3 p-2 border rounded"
            />
            
            <label className="block mb-2 font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-3 p-2 border rounded"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mb-4 rounded-lg w-full max-w-xs"
              />
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={isEdit ? updateEdge : createEdge}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                disabled={uploading}
              >
                {uploading
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update"
                  : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edge;