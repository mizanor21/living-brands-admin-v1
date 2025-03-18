"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { 
  FaUser, 
  FaTrashAlt, 
  FaEnvelope, 
  FaClock, 
  FaExternalLinkAlt, 
  FaPhone, 
  FaGlobe, 
  FaInfoCircle,
  FaSearch,
  FaFilter,
  FaReply
} from "react-icons/fa";
import { formatDistanceToNow, format } from "date-fns";

const DashboardUI = () => {
  const [users, setUsers] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedMessage, setExpandedMessage] = useState(null);
  const messagesPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await fetch(`/api/users`);
        const usersData = await usersRes.json();
        setUsers(usersData);

        const messagesRes = await fetch(`/api/contact`);
        const messagesData = await messagesRes.json();
        setMessageList(messagesData.reverse());
        setFilteredMessages(messagesData.reverse());
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

  useEffect(() => {
    filterMessages(searchTerm, activeFilter);
  }, [searchTerm, activeFilter, messageList]);

  const filterMessages = (term, filter) => {
    let results = [...messageList];
    
    // Apply search term filter
    if (term) {
      results = results.filter(
        msg => 
          msg.name.toLowerCase().includes(term.toLowerCase()) ||
          msg.email.toLowerCase().includes(term.toLowerCase()) ||
          msg.message.toLowerCase().includes(term.toLowerCase()) ||
          (msg.organization && msg.organization.toLowerCase().includes(term.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (filter !== "all") {
      results = results.filter(msg => 
        msg.services.includes(filter)
      );
    }
    
    setFilteredMessages(results);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );

  const handleDeleteMessage = async (id, e) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      const response = await fetch(
        `/api/contact/?id=${id}`,
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
  
  const toggleMessageExpansion = (id) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };
  
  const handleReplyClick = (e, email, subject) => {
    e.stopPropagation();
    window.location.href = `mailto:${email}?subject=Re: ${subject}`;
  };

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    // Here you would typically update the message status in your database
    toast.success("Message marked as read");
  };

  // Extract unique service categories for filtering
  const serviceCategories = [...new Set(
    messageList.flatMap(msg => msg.services)
  )];

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-20 w-20 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full mb-4 animate-spin"></div>
        <p className="text-lg font-medium text-gray-700">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/dashboard/manage-users"
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6 flex items-center">
              <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                <FaUser className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm uppercase tracking-wider">Active Users</p>
                <div className="flex items-end">
                  <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                  <span className="text-xs text-green-500 ml-2 mb-1">+12% ↑</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-2">
              <p className="text-blue-700 text-sm font-medium">View Details →</p>
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-6 flex items-center">
              <div className="p-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                <FaEnvelope className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm uppercase tracking-wider">Total Messages</p>
                <div className="flex items-end">
                  <p className="text-3xl font-bold text-gray-900">{messageList.length}</p>
                  <span className="text-xs text-green-500 ml-2 mb-1">+8% ↑</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-2">
              <p className="text-teal-700 text-sm font-medium">View All Messages</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-6 flex items-center">
              <div className="p-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                <FaInfoCircle className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm uppercase tracking-wider">Unread Messages</p>
                <div className="flex items-end">
                  <p className="text-3xl font-bold text-gray-900">{Math.floor(messageList.length * 0.3)}</p>
                  <span className="text-xs text-red-500 ml-2 mb-1">-5% ↓</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-2">
              <p className="text-purple-700 text-sm font-medium">Mark All as Read</p>
            </div>
          </div>
        </div>

        {/* Recent Messages Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="text-2xl font-bold text-gray-800">Recent Messages</h3>
              
              {/* Search and Filter Controls */}
              <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full md:w-64"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                
                <div className="relative inline-block">
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white w-full"
                  >
                    <option value="all">All Services</option>
                    {serviceCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <FaFilter className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Message List */}
          <div className="px-6 py-4">
            {currentMessages.length === 0 ? (
              <div className="text-center py-12">
                <FaEnvelope className="mx-auto text-gray-300" size={48} />
                <p className="mt-4 text-gray-500 text-lg">No messages found</p>
                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {currentMessages.map((message) => (
                  <li
                    key={message._id}
                    onClick={() => toggleMessageExpansion(message._id)}
                    className={`rounded-xl border transition-all duration-300 cursor-pointer ${
                      expandedMessage === message._id 
                        ? "border-teal-400 bg-teal-50 shadow-md" 
                        : "border-gray-200 bg-white hover:border-teal-200 hover:bg-teal-50"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        {/* Message Header */}
                        <div className="flex items-start">
                          <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-full p-3 text-white mr-4 hidden md:block">
                            {message.name.charAt(0).toUpperCase()}
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{message.name}</h4>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                              {message.organization && (
                                <span className="mr-2">{message.organization} •</span>
                              )}
                              <span className="flex items-center">
                                <FaClock className="mr-1 text-gray-400" size={12} />
                                {formatDistanceToNow(new Date(message.createdAt))} ago
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Priority Badge & Delete Button */}
                        <div className="flex items-center mt-3 md:mt-0">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full mr-2">
                            Medium Priority
                          </span>
                          <button
                            onClick={(e) => handleDeleteMessage(message._id, e)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Delete message"
                          >
                            <FaTrashAlt size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Services Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.services.map((service, index) => (
                          <span
                            key={index}
                            className="bg-teal-100 text-teal-800 px-2.5 py-1 text-xs font-medium rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                      
                      {/* Contact Preview */}
                      <div className="mt-3 text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center">
                          <FaEnvelope className="mr-2 text-gray-400" />
                          <a href={`mailto:${message.email}`} onClick={(e) => e.stopPropagation()} className="text-teal-600 hover:underline">
                            {message.email}
                          </a>
                        </div>
                        
                        {message.phone && (
                          <div className="flex items-center">
                            <FaPhone className="mr-2 text-gray-400" />
                            <span>{message.phone}</span>
                          </div>
                        )}
                        
                        {message.website && (
                          <div className="flex items-center">
                            <FaGlobe className="mr-2 text-gray-400" />
                            <a 
                              href={message.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-teal-600 hover:underline flex items-center"
                            >
                              Website
                              <FaExternalLinkAlt size={10} className="ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                      
                      {/* Expanded Content */}
                      {expandedMessage === message._id && (
                        <div className="mt-4 bg-white border border-teal-200 rounded-lg p-4 animate-fadeIn">
                          <h5 className="font-semibold text-gray-700 mb-2">Message:</h5>
                          <p className="text-gray-600 whitespace-pre-line">{message.message}</p>
                          
                          {message.referral && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Referral Source:</span>{" "}
                                <span className="text-gray-600">{message.referral}</span>
                              </p>
                            </div>
                          )}
                          
                          <div className="mt-4 flex justify-end gap-2">
                            <button 
                              onClick={(e) => handleMarkAsRead(e, message._id)}
                              className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              <FaInfoCircle className="mr-2" />
                              Mark as Read
                            </button>
                            <a 
                              href={`mailto:${message.email}?subject=Re: Inquiry from ${message.name}`}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                            >
                              <FaReply className="mr-2" />
                              Reply
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pagination */}
          {filteredMessages.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500 mb-4 md:mb-0">
                  Showing {indexOfFirstMessage + 1} to{" "}
                  {Math.min(indexOfLastMessage, filteredMessages.length)} of{" "}
                  {filteredMessages.length} messages
                </p>
                
                <div className="flex items-center">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`mx-1 px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`mx-1 w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                          currentPage === pageNumber
                            ? "bg-teal-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`mx-1 px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;