"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import Link from "next/link";

// Main Component
const WhoWeAre = () => {
  const [data, setData] = useState({
    title: "",
    heading: "",
    text: "",
    buttonText: "",
    buttonLink: "",
    shortVideoSrc: "",
    shortVideoAlt: "",
    longVideoSrc: "",
    longVideoAlt: "",
  });
  const [documentId, setDocumentId] = useState(null); // Store document ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/who-we-are`
        );
        const rawData = response.data[0]; // Assuming response is an array with one object

        // Save document ID
        setDocumentId(rawData._id);

        // Transform data for easier access
        setData({
          title: rawData.title,
          heading: rawData.sections[0].heading,
          text: rawData.sections[0].text.join("\n"), // Join text array into a single string for textarea
          buttonText: rawData.sections[0].button.text,
          buttonLink: rawData.sections[0].button.link,
          shortVideoSrc: rawData.sections[0].shortVideo.src,
          shortVideoAlt: rawData.sections[0].shortVideo.alt,
          longVideoSrc: rawData.sections[0].longVideo.src,
          longVideoAlt: rawData.sections[0].longVideo.alt,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Open modal and set data for editing
  const openModal = () => {
    setUpdatedData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle input change in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle update operation
  const handleUpdate = async () => {
    try {
      const transformedData = {
        title: updatedData.title,
        sections: [
          {
            heading: updatedData.heading,
            text: updatedData.text.split("\n"), // Split textarea back into array for API
            button: {
              text: updatedData.buttonText,
              link: updatedData.buttonLink,
            },
            shortVideo: {
              src: updatedData.shortVideoSrc,
              alt: updatedData.shortVideoAlt,
            },
            longVideo: {
              src: updatedData.longVideoSrc,
              alt: updatedData.longVideoAlt,
            },
          },
        ],
      };

      // PATCH request with document ID in the URL
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/who-we-are/${documentId}`,
        transformedData
      );
      setData(updatedData); // Update displayed data with modified data
      alert("Data updated successfully!");
      closeModal();
    } catch (err) {
      console.error("Error updating data:", err);
      alert("Error updating data.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-10 font-sora">
      <h1 className="text-4xl font-extrabold text-[#125B5C] text-center mb-10">
        {data.title}
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Main "Who We Are" Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#125b5c] mb-4">
            {data.heading}
          </h2>
          <p className="text-gray-700 text-lg whitespace-pre-line mb-6">
            {data.text}
          </p>
          <Link href={data.buttonLink}>
            <div className="inline-block">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#125B5C] text-white font-medium rounded-lg transition hover:bg-[#0e4c4d]">
                {data.buttonText} <MdOutlineArrowRightAlt className="text-xl" />
              </button>
            </div>
          </Link>
          <button
            onClick={openModal}
            className="mt-6 ml-2 bg-teal-500 text-white px-4 py-2 rounded-lg transition hover:bg-teal-600"
          >
            Edit Section
          </button>
        </div>

        {/* Video Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <video
            className="w-full h-full rounded-t-lg"
            autoPlay
            loop
            muted
            src={data.shortVideoSrc}
          >
            <source src={data.shortVideoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {data.shortVideoAlt}
            </h3>
          </div>
        </div>
      </div>

      {/* Long Video Section */}
      <div className="mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
        <video
          className="w-full h-full"
          autoPlay
          loop
          muted
          src={data.longVideoSrc}
        >
          <source src={data.longVideoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {data.longVideoAlt}
          </h3>
        </div>
      </div>

      {/* Modal for Updating Data */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition-transform duration-300">
            <h2 className="text-2xl font-bold text-[#125B5C] mb-4">
              Edit Section
            </h2>
            <label className="block text-gray-700 font-semibold mb-2">
              Title:
            </label>
            <input
              type="text"
              name="title"
              value={updatedData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label className="block text-gray-700 font-semibold mb-2">
              Heading:
            </label>
            <input
              type="text"
              name="heading"
              value={updatedData.heading}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label className="block text-gray-700 font-semibold mb-2">
              Text:
            </label>
            <textarea
              name="text"
              value={updatedData.text}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label className="block text-gray-700 font-semibold mb-2">
              Button Text:
            </label>
            <input
              type="text"
              name="buttonText"
              value={updatedData.buttonText}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label className="block text-gray-700 font-semibold mb-2">
              Button Link:
            </label>
            <input
              type="text"
              name="buttonLink"
              value={updatedData.buttonLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg transition hover:bg-teal-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhoWeAre;
