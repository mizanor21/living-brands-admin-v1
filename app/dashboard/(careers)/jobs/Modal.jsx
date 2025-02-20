"use client";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal = ({ isVisible, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    jobId: "",
    title: "",
    company: {
      name: "",
      website: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
    },
    location: {
      type: "",
      city: "",
      country: "",
    },
    employmentType: "",
    experienceLevel: "",
    industry: "",
    department: "",
    openings: 1,
    description: "",
    responsibilities: [],
    requirements: {
      education: "",
      experience: "",
    },
    skills: [],
    languages: [],
    salary: {
      currency: "",
      min: 0,
      max: 0,
      frequency: "",
    },
    benefits: [],
    applicationDetails: {
      deadline: "",
      link: "",
      contactEmail: "",
      instructions: "",
    },
    keywords: [],
  });
  if (!isVisible) {
    return;
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNestedInputChange = (e, section, key) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: { ...prevData[section], [key]: value },
    }));
  };

  const handleDeepNestedInputChange = (e, section, subSection, key) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [subSection]: { ...prevData[section][subSection], [key]: value },
      },
    }));
  };

  const handleArrayInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleSaveClick = async () => {
    try {
      await axios.post("/api/jobs", formData);
      onSave(formData);
      alert("Successfully job circular post");
      onClose();
    } catch (error) {
      toast.error("Error saving job. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg h-full max-h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Add New Job</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &#10005;
          </button>
        </div>

        {/* /* Modal Content (Scrollable) */}
        <div className="p-4 overflow-y-auto flex-grow">
          {/* Job Basic Info */}
          <label className="block mb-2">Job ID (Required)</label>
          <input
            type="text"
            name="jobId"
            value={formData.jobId}
            onChange={handleInputChange}
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Job Title (Required)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="border p-2 rounded mb-4 w-full"
            required
          />
          <label className="block mb-2">Job Description (Required)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="border p-2 rounded mb-4 w-full"
            required
          />

          {/* Company Information */}
          <label className="block mb-2">Company Name (Required)</label>
          <input
            type="text"
            value={formData.company.name}
            onChange={(e) => handleNestedInputChange(e, "company", "name")}
            className="border p-2 rounded mb-4 w-full"
            required
          />
          <label className="block mb-2">Company Website</label>
          <input
            type="text"
            value={formData.company.website}
            onChange={(e) => handleNestedInputChange(e, "company", "website")}
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Street Address (Required)</label>
          <input
            type="text"
            value={formData.company.address.street}
            onChange={(e) =>
              handleDeepNestedInputChange(e, "company", "address", "street")
            }
            className="border p-2 rounded mb-4 w-full"
            required
          />
          <label className="block mb-2">City (Required)</label>
          <input
            type="text"
            value={formData.company.address.city}
            onChange={(e) =>
              handleDeepNestedInputChange(e, "company", "address", "city")
            }
            className="border p-2 rounded mb-4 w-full"
            required
          />
          <label className="block mb-2">State</label>
          <input
            type="text"
            value={formData.company.address.state}
            onChange={(e) =>
              handleDeepNestedInputChange(e, "company", "address", "state")
            }
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Postal Code (Required)</label>
          <input
            type="text"
            value={formData.company.address.postalCode}
            onChange={(e) =>
              handleDeepNestedInputChange(e, "company", "address", "postalCode")
            }
            className="border p-2 rounded mb-4 w-full"
            required
          />
          <label className="block mb-2">Country (Required)</label>
          <input
            type="text"
            value={formData.company.address.country}
            onChange={(e) =>
              handleDeepNestedInputChange(e, "company", "address", "country")
            }
            className="border p-2 rounded mb-4 w-full"
            required
          />

          {/* Location Information */}
          <label className="block mb-2">
            Works Space (e.g., Remote, On-Site)
          </label>
          <select
            value={formData.location.type}
            onChange={(e) => handleNestedInputChange(e, "location", "type")}
            className="border p-2 rounded mb-4 w-full"
          >
            <option value="">Select Work Space</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <label className="block mb-2">Location City</label>
          <input
            type="text"
            value={formData.location.city}
            onChange={(e) => handleNestedInputChange(e, "location", "city")}
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Location Country</label>
          <input
            type="text"
            value={formData.location.country}
            onChange={(e) => handleNestedInputChange(e, "location", "country")}
            className="border p-2 rounded mb-4 w-full"
          />

          {/* Employment Details  */}
          <label className="block mb-2">Employment Type</label>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleInputChange}
            className="border p-2 rounded mb-4 w-full"
          >
            <option value="">Select Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Temporary">Temporary</option>
            <option value="Internship">Internship</option>
          </select>
          <label className="block mb-2">Experience Level</label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleInputChange}
            className="border p-2 rounded mb-4 w-full"
          >
            <option value="">Select Experience Level</option>
            <option value="Entry-level">Entry-level</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior-level">Senior-level</option>
            <option value="Director">Director</option>
          </select>
          <label className="block mb-2">Industry</label>
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Number of Openings</label>
          <input
            type="number"
            name="openings"
            value={formData.openings}
            onChange={handleInputChange}
            className="border p-2 rounded mb-4 w-full"
          />

          {/* Responsibilities and Requirements */}
          <label className="block mb-2">
            Responsibilities (comma-separated)
          </label>
          <input
            type="text"
            value={formData.responsibilities.join(", ")}
            onChange={(e) => handleArrayInputChange(e, "responsibilities")}
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Education Requirement</label>
          <input
            type="text"
            value={formData.requirements.education}
            onChange={(e) =>
              handleNestedInputChange(e, "requirements", "education")
            }
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Experience Requirement</label>
          <input
            type="text"
            value={formData.requirements.experience}
            onChange={(e) =>
              handleNestedInputChange(e, "requirements", "experience")
            }
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Skills (comma-separated)</label>
          <input
            type="text"
            value={formData.skills.join(", ")}
            onChange={(e) => handleArrayInputChange(e, "skills")}
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Languages (comma-separated)</label>
          <input
            type="text"
            value={formData.languages.join(", ")}
            onChange={(e) => handleArrayInputChange(e, "languages")}
            className="border p-2 rounded mb-4 w-full"
          />

          {/* /* Salary Information  */}
          <label className="block mb-2">Currency</label>
          <input
            type="text"
            value={formData.salary.currency}
            onChange={(e) => handleNestedInputChange(e, "salary", "currency")}
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Minimum Salary</label>
          <input
            type="number"
            value={formData.salary.min}
            onChange={(e) => handleNestedInputChange(e, "salary", "min")}
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Maximum Salary</label>
          <input
            type="number"
            value={formData.salary.max}
            onChange={(e) => handleNestedInputChange(e, "salary", "max")}
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Salary Frequency</label>
          <select
            value={formData.salary.frequency}
            onChange={(e) => handleNestedInputChange(e, "salary", "frequency")}
            className="border p-2 rounded mb-4 w-full"
          >
            <option value="">Select Frequency</option>
            <option value="Hourly">Hourly</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>

          {/* Benefits and Application Details */}
          <label className="block mb-2">Benefits (comma-separated)</label>
          <input
            type="text"
            value={formData.benefits.join(", ")}
            onChange={(e) => handleArrayInputChange(e, "benefits")}
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Application Deadline</label>
          <input
            type="date"
            value={formData.applicationDetails.deadline}
            onChange={(e) =>
              handleNestedInputChange(e, "applicationDetails", "deadline")
            }
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Application Link</label>
          <input
            type="text"
            value={formData.applicationDetails.link}
            onChange={(e) =>
              handleNestedInputChange(e, "applicationDetails", "link")
            }
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Contact Email</label>
          <input
            type="email"
            value={formData.applicationDetails.contactEmail}
            onChange={(e) =>
              handleNestedInputChange(e, "applicationDetails", "contactEmail")
            }
            className="border p-2 rounded mb-4 w-full"
          />
          <label className="block mb-2">Application Instructions</label>
          <textarea
            value={formData.applicationDetails.instructions}
            onChange={(e) =>
              handleNestedInputChange(e, "applicationDetails", "instructions")
            }
            className="border p-2 rounded mb-4 w-full"
          />

          {/* Keywords */}
          <label className="block mb-2">Keywords (comma-separated)</label>
          <input
            type="text"
            value={formData.keywords.join(", ")}
            onChange={(e) => handleArrayInputChange(e, "keywords")}
            className="border p-2 rounded mb-4 w-full"
          />
        </div>
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={handleSaveClick}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Save Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
