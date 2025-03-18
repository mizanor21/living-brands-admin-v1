"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosAddCircle } from "react-icons/io";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin6Fill } from "react-icons/ri";

const MeetOurTeam = () => {
  const [teams, setTeams] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `/api/teams`
        );
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching team data:", error);
        toast.error("Failed to load team data.");
      }
    };

    fetchTeams();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team member?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `/api/teams?id=${id}`
      );
      setTeams(teams.filter((team) => team.id !== id));
      toast.success("Team member deleted successfully.");
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member.");
    }
  };

  const handleEditClick = (team) => {
    setEditingId(team._id);
    setEditedName(team.name);
    setEditedTitle(team.title);
    setEditedImage(team.image);
    setImagePreview(team.image);
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "habson");

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
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editedImage;

      if (file) {
        imageUrl = await uploadImage(file);
        if (!imageUrl) return;
      }

      if (editingId) {
        await axios.patch(
          `/api/teams/${editingId}`,
          { name: editedName, title: editedTitle, image: imageUrl }
        );

        setTeams((prevData) =>
          prevData.map((team) =>
            team.id === editingId
              ? { ...team, name: editedName, title: editedTitle, image: imageUrl }
              : team
          )
        );
        toast.success("Team member updated successfully.");
      } else {
        const response = await axios.post(
          `/api/teams`,
          { name: editedName, title: editedTitle, image: imageUrl }
        );

        setTeams([...teams, response.data]);
        toast.success("Team member added successfully.");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Failed to save team member.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setEditedName("");
    setEditedTitle("");
    setEditedImage("");
    setFile(null);
    setImagePreview(null);
    setModalOpen(false);
  };

  return (
    <div>
      {/* Add Team Member Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="text-xl bg-green-500 text-white rounded-full p-2 flex items-center"
        >
          <IoIosAddCircle className="mr-2" /> Add Team Member
        </button>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-10 lg:py-16">
        {teams.map((team) => (
          <div key={team.id} className="text-center group">
            <Image
              width={400}
              height={550}
              className="rounded-2xl hover:scale-105 max-h-[550px] transition duration-300"
              src={team.image}
              alt="person"
            />
            <div className="mt-5">
              <h2 className="text-[24px] font-[600] mt-4 mb-2">{team.name}</h2>
              <h4 className="text-[14px] font-[400]">{team.title}</h4>
            </div>
            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => handleEditClick(team)}
                className="text-xl bg-slate-100 hover:bg-blue-600 hover:text-white duration-500 rounded-full p-2"
              >
                <LiaEditSolid />
              </button>
              <button
                onClick={() => handleDelete(team._id)}
                className="text-xl bg-slate-100 hover:bg-red-600 hover:text-white duration-500 rounded-full p-2"
              >
                <RiDeleteBin6Fill />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg">
            <h2 className="text-xl font-bold">{editingId ? "Edit" : "Add"} Team Member</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2 font-semibold">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border-b mb-4 p-2 w-full"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mb-4 rounded-lg w-full max-w-xs" />
              )}
              <input
                type="text"
                placeholder="Name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="border-b mb-4 p-2 w-full"
              />
              <input
                type="text"
                placeholder="Title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="border-b mb-4 p-2 w-full"
              />
              <div className="flex justify-end">
                <button onClick={resetForm} className="mr-2 bg-gray-500 text-white p-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  {uploading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default MeetOurTeam;
