"use client";
import { FaUser, FaTrashAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { formatDistanceToNow, format } from "date-fns";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const DashboardUI = () => {
  const [users, setUsers] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const messagesPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users`
        );
        const usersData = await usersRes.json();
        setUsers(usersData);

        const messagesRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/contact`
        );
        const messagesData = await messagesRes.json();
        setMessageList(messagesData.reverse());
      } catch (error) {
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalPages = Math.ceil(messageList.length / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messageList.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact/?id=${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to delete message");

      setMessageList((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== id)
      );
      toast.success("Message deleted successfully");

      if (currentMessages.length === 1 && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
    } catch (error) {
      toast.error("Failed to delete message. Please try again.");
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Here’s your latest activity overview.</p>
        </div>
        <div className="text-gray-700">
          <div className="flex items-center">
            <FaClock className="mr-2 text-gray-600" />
            <p className="text-lg font-medium">
              {format(currentTime, "h:mm:ss a")}
            </p>
          </div>
          <p className="text-sm">{format(currentTime, "EEEE, MMMM d, yyyy")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/dashboard/manage-users"
          className="p-6 bg-white rounded-lg shadow-lg flex items-center transition-transform duration-300 hover:scale-95"
        >
          <div className="p-4 bg-teal-500 rounded-full">
            <FaUser className="text-white" size={24} />
          </div>
          <div className="ml-4">
            <p className="text-gray-600">Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </Link>

        <div className="p-6 bg-white rounded-lg shadow-lg flex items-center transition-transform duration-300 hover:scale-95">
          <div className="p-4 bg-teal-500 rounded-full">
            <FaEnvelope className="text-white" size={24} />
          </div>
          <div className="ml-4">
            <p className="text-gray-600">Messages</p>
            <p className="text-2xl font-bold">{messageList.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Recent Messages
        </h3>
        <ul className="space-y-6">
          {currentMessages.length === 0 ? (
            <p className="text-gray-500 text-center">No recent messages.</p>
          ) : (
            currentMessages.map((message) => (
              <li
                key={message._id}
                className="relative p-5 bg-gradient-to-br from-teal-50 via-white to-teal-100 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-95"
              >
                <div className="flex justify-between items-start">
                  {/* Name and Organization */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {message.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {message.organization} •{" "}
                      {formatDistanceToNow(new Date(message.createdAt))} ago
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteMessage(message._id)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    aria-label="Delete message"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </div>

                {/* Main Details */}
                <div className="mt-4 text-gray-700">
                  <p className="mb-2">
                    <span className="font-semibold text-teal-600">Email:</span>{" "}
                    <a
                      href={`mailto:${message.email}`}
                      className="text-teal-700 underline"
                    >
                      {message.email}
                    </a>
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold text-teal-600">Phone:</span>{" "}
                    {message.phone || "N/A"}
                  </p>
                  {message.website && (
                    <p className="mb-2">
                      <span className="font-semibold text-teal-600">
                        Website:
                      </span>{" "}
                      <a
                        href={message.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-700 underline"
                      >
                        {message.website}
                      </a>
                    </p>
                  )}
                  <p className="mb-2">
                    <span className="font-semibold text-teal-600">
                      Referral:
                    </span>{" "}
                    {message.referral || "N/A"}
                  </p>

                  {/* Services Section */}
                  <p className="mb-2">
                    <span className="font-semibold text-teal-600">
                      Services:
                    </span>{" "}
                    <span className="flex flex-wrap gap-2 mt-1">
                      {message.services.map((service, index) => (
                        <span
                          key={index}
                          className="bg-teal-200 text-teal-800 px-2 py-1 text-xs rounded-full shadow-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </span>
                  </p>

                  {/* Expandable Message */}
                  <details className="mt-4 bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <summary className="cursor-pointer font-semibold text-teal-700">
                      View Full Message
                    </summary>
                    <p className="mt-2 text-gray-800">{message.message}</p>
                  </details>
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`mx-1 px-4 py-2 rounded-full transition-transform duration-300 hover:scale-95 ${
                  currentPage === pageNumber
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;
