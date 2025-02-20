"use client";

import { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin6Fill } from "react-icons/ri";

const MouseMovementCRUD = () => {
  const [mouseMovementData, setMouseMovementData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    fetchMouseMovementData();
  }, []);

  const fetchMouseMovementData = async () => {
    try {
      const res = await fetch("/api/mouse-movement");
      if (!res.ok) throw new Error("Failed to fetch mouse movement data");
      setMouseMovementData(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (item = null) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/mouse-movement?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete item");
      setMouseMovementData(mouseMovementData.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = currentItem
        ? `/api/mouse-movement/${currentItem._id}`
        : "/api/mouse-movement";
      const method = currentItem ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save item");
      fetchMouseMovementData();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mouse Movement</h1>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => handleOpenModal()}
        >
          Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
        {mouseMovementData.map((item) => (
          <div
            key={item._id}
            className="border p-5 text-center rounded-lg shadow-md group hover:scale-105 transition"
            style={{ backgroundColor: item.color }}
          >
            <p className="text-xl font-semibold">{item.title}</p>
            <p className="text-sm">{item.content}</p>
            <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleOpenModal(item)}
              >
                <AiFillEdit size={20} />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDeleteItem(item._id)}
              >
                <RiDeleteBin6Fill size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={currentItem}
        />
      )}
    </div>
  );
};

const Modal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    color: "#000000",
    path: "",
  });

  useEffect(() => {
    setFormData(
      initialData || { title: "", content: "", color: "#000000", path: "" }
    );
  }, [initialData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Item" : "Add Item"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Content"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full h-10 border p-1 rounded cursor-pointer mb-4"
          />
          <input
            type="text"
            name="path"
            value={formData.path}
            onChange={handleChange}
            placeholder="Path"
            className="w-full border p-2 rounded mb-4"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MouseMovementCRUD;
