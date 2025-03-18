"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosAddCircle } from "react-icons/io";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin6Fill } from "react-icons/ri";

const Partnership = () => {
  const [partnersData, setPartnersData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedLogo, setEditedLogo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/partnership`
        );
        setPartnersData(response.data);
      } catch (error) {
        console.error("Error fetching partner data:", error);
        toast.error("Failed to load partner data.");
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedLogo(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
      setFile(uploadedFile);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    try {
      await axios.delete(
        `/api/partnership?id=${id}`
      );
      setPartnersData(partnersData.filter((partner) => partner._id !== id));
      toast.success("Partner deleted successfully.");
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Failed to delete partner.");
    }
  };

  const handleEditClick = (partner) => {
    setEditingId(partner._id);
    setEditedName(partner.name);
    setEditedDescription(partner.description);
    setEditedLogo(partner.logo);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editedName,
        description: editedDescription,
        logo: editedLogo,
      };
      let response;
      if (editingId) {
        response = await axios.patch(
          `/api/partnership/${editingId}`,
          payload
        );
        setPartnersData((prevData) =>
          prevData.map((partner) =>
            partner._id === editingId ? response.data : partner
          )
        );
        toast.success("Partner updated successfully.");
      } else {
        response = await axios.post(
          `/api/partnership`,
          payload
        );
        setPartnersData([...partnersData, response.data]);
        toast.success("Partner added successfully.");
      }
      setModalOpen(false);
      setEditingId(null);
      setEditedName("");
      setEditedDescription("");
      setEditedLogo("");
      setFile(null);
    } catch (error) {
      console.error("Error saving partner data:", error);
      toast.error("Failed to save partner data.");
    }
  };

  return (
    <div className="bg-white py-10 rounded-[20px] font-sora">
      <div className="p-[3%]">
        <div className="flex justify-end">
          <button
            onClick={() => setModalOpen(true)}
            className="mb-4 text-xl bg-[#14797b] hover:bg-[#296e6f] text-white rounded-full px-8 py-3 flex items-center"
          >
            <IoIosAddCircle className="mr-2" /> Add Partner
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 items-center text-center justify-center mt-5">
          {partnersData.map((partner) => (
            <div key={partner._id} className="text-center group">
              <Image
                width={200}
                height={200}
                src={partner.logo}
                alt={`${partner.name} Logo`}
                className="mx-auto mb-2 h-16 object-contain saturate-0 group-hover:saturate-100"
              />
              <h3 className="text-[20px] tracking-tighter font-bold text-black mb-2 mt-10 cursor-pointer" onClick={() => handleEditClick(partner)}>
                {partner.name}
              </h3>
              <p className="text-black opacity-75 text-[15px] font-[400] mb-2">{partner.description}</p>
              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => handleEditClick(partner)} className="text-xl bg-slate-100 hover:bg-blue-600 hover:text-white duration-500 rounded-full p-2">
                  <LiaEditSolid />
                </button>
                <button onClick={() => handleDelete(partner._id)} className="text-xl bg-slate-100 hover:bg-red-600 hover:text-white duration-500 rounded-full p-2">
                  <RiDeleteBin6Fill />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h2 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Add New"} Partner</h2>
            <form onSubmit={handleSubmit}>
              <input type="file" onChange={handleFileChange} className="mb-4 w-full" />
              <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} placeholder="Partner Name" className="border-b mb-4 w-full focus:outline-none" required />
              <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} placeholder="Description" className="border-b mb-4 w-full focus:outline-none" required />
              <div className="flex justify-between">
                <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{editingId ? "Update" : "Add"} Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Partnership;
