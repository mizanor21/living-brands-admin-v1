"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const ColorPalate = () => {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    imageUrl: "",
    title: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch cards from API
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get(
        `/api/color-palette`
      );
      setCards(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data!");
    }
  };

  // Handle input change in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, imageUrl: file });
    }
  };

  // Open the modal for adding or editing
  const openModal = (card = null) => {
    if (card) {
      setFormData(card);
      setImagePreview(card.imageUrl);
      setIsEditing(true);
    } else {
      setFormData({
        id: "",
        imageUrl: "",
        title: "",
        description: "",
      });
      setImagePreview(null);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImagePreview(null);
  };

  // Upload image to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "habson"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dov6k7xdk/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image!");
      return null;
    }
  };

  // Add a new card
  const addCard = async () => {
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if a file is selected
      if (typeof formData.imageUrl === "object") {
        imageUrl = await uploadImage(formData.imageUrl);
        if (!imageUrl) return;
      }

      const newCard = { ...formData, imageUrl };

      // Optimistically update the UI
      setCards((prev) => [...prev, { ...newCard, _id: Date.now().toString() }]);

      const response = await axios.post(
        `/api/color-palette`,
        newCard
      );

      // Replace the temporary card with the actual card from the API
      setCards((prev) =>
        prev.map((card) =>
          card._id === Date.now().toString() ? response.data : card
        )
      );

      toast.success("Card added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card!");

      // Revert the state if the API call fails
      setCards((prev) => prev.filter((card) => card._id !== Date.now().toString()));
    } finally {
      setLoading(false);
    }
  };

  // Update an existing card
  const updateCard = async () => {
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if a file is selected
      if (typeof formData.imageUrl === "object") {
        imageUrl = await uploadImage(formData.imageUrl);
        if (!imageUrl) return;
      }

      const updatedCard = { ...formData, imageUrl };

      // Optimistically update the UI
      setCards((prev) =>
        prev.map((card) =>
          card._id === formData._id ? { ...card, ...updatedCard } : card
        )
      );

      const response = await axios.patch(
        `/api/color-palette/${formData._id}`,
        updatedCard
      );

      // Update the state with the response from the API
      setCards((prev) =>
        prev.map((card) => (card._id === formData._id ? response.data : card))
      );

      toast.success("Card updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Failed to update card!");

      // Revert the state if the API call fails
      setCards((prev) =>
        prev.map((card) =>
          card._id === formData._id ? { ...card, ...formData } : card
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete a card
  const deleteCard = async (id) => {
    try {
      // Optimistically update the UI
      setCards((prev) => prev.filter((card) => card._id !== id));

      await axios.delete(
        `/api/color-palette/?id=${id}`
      );

      toast.success("Card deleted successfully!");
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Failed to delete card!");

      // Revert the state if the API call fails
      setCards((prev) => [...prev, cards.find((card) => card._id === id)]);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <ToastContainer />

      <div className="flex justify-between items-center mb-5">
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
        >
          Add New Card
        </button>
        <button
          onClick={fetchCards}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Refetch Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card._id}
            className="hover:-translate-y-5 duration-500 mt-5 bg-white rounded-lg shadow-md"
          >
            <div className="h-[400px]">
              <Image
                width={400}
                height={450}
                className="w-full h-[400px] object-cover rounded-t-lg"
                src={card.imageUrl}
                alt={card.title}
              />
            </div>
            <div className="p-4 h-[300px] relative group">
              <div className="text-center">
                <h2 className="text-[24px] font-bold text-[#185C5D]">
                  {card.title}
                </h2>
                <p className="text-[16px] group-hover:text-black py-4">
                  {card.description}
                </p>
              </div>

              {/* Centered Edit and Delete Buttons */}
              <div className="flex justify-center gap-4 py-4">
                <button
                  onClick={() => openModal(card)}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCard(card._id)}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? "Edit Card" : "Add New Card"}
            </h2>

            {/* Image Upload */}
            <label className="block mb-2">Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={200}
                className="mb-4 rounded-lg"
              />
            )}

            <label className="block mb-2">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label className="block mb-2">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? updateCard : addCard}
                className="px-4 py-2 bg-teal-500 text-white font-semibold rounded hover:bg-teal-600"
                disabled={loading}
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
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

export default ColorPalate;