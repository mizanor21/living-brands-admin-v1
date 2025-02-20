"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsBriefcase, BsGlobe, BsThreeDotsVertical } from "react-icons/bs";
import { FiCalendar } from "react-icons/fi";
import Modal from "./Modal";

const JobsUI = () => {
  const [jobs, setJobs] = useState([]);
  const [hoveredJob, setHoveredJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModalClick = () => {
    setIsModalOpen(true); // Open modal on button click
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close modal
  };

  const handleSaveJob = (newJobData) => {
    setJobs([...jobs, newJobData]); // Add the new job to the jobs list
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const handleDeleteJob = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!isConfirmed) return;

    try {
      await axios.delete(`/api/jobs/?id=${id}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-8">Job Listings</h1>
        <button
          onClick={handleOpenModalClick}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add New Job
        </button>
      </div>

      {/* Modal for Adding a New Job */}
      <Modal
        isVisible={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveJob}
      />

      <div className="grid grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="p-6 border rounded-lg shadow-lg bg-white flex flex-col gap-4 relative"
            style={{
              borderLeft: `4px solid ${
                job.location.type === "Remote" ? "#a3bffa" : "#ffe4e1"
              }`,
            }}
            onMouseEnter={() => setHoveredJob(job._id)}
            onMouseLeave={() => setHoveredJob(null)}
          >
            <div className="w-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <BsBriefcase />
                    Type: {job.location.type} • Experience:{" "}
                    {job.experienceLevel}
                  </p>
                  <h2 className="text-xl font-semibold mt-1">{job.title}</h2>
                  <p className="text-gray-700 font-medium">
                    {job.salary.currency} {job.salary.min}-{job.salary.max} /{" "}
                    {job.salary.frequency}
                  </p>
                </div>
                <div className="relative">
                  <BsThreeDotsVertical className="text-gray-400 hover:text-gray-700 cursor-pointer text-xl" />
                  {hoveredJob === job._id && (
                    <div className="absolute right-0 top-6 bg-white shadow-lg rounded-lg border p-2 w-28">
                      <button
                        // onClick={() => handleEditClick(job)}
                        className="block text-gray-700 w-full text-left p-2 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="block text-gray-700 w-full text-left p-2 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <p className="flex items-center gap-2 text-gray-600">
                  <BsGlobe />
                  {job.location.city}, {job.location.country}
                </p>
                <p className="text-gray-500">{job.department}</p>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Company:</strong> {job.company.name}
                </p>
                <p>
                  <strong>Responsibilities:</strong>{" "}
                  {job.responsibilities.join(", ")}
                </p>
                <p>
                  <strong>Benefits:</strong> {job.benefits.join(", ")}
                </p>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <FiCalendar />
                <p className="ml-2">
                  Application Deadline:{" "}
                  {new Date(
                    job.applicationDetails.deadline
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsUI;
