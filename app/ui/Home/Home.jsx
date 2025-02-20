// Home.js
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefinesSection from "./Defines";
import HeroSection from "./HeroSection";
import JourneySection from "./Journey";
import ElevateSection from "./ElevateSction";
import Intro from "./Intro";

const Home = () => {
  const [homes, setHomes] = useState([]);
  const [fetchError, setFetchError] = useState(null); // Added state to handle fetch errors

  useEffect(() => {
    const fetchHerosData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/home`
        );
        setHomes(data || []);
      } catch (error) {
        setFetchError("Failed to load hero data. Please try again later.");
        toast.error("Failed to load hero data. Please try again later."); // Show error toast
      }
    };
    fetchHerosData();
  }, []);

  // Destructure sections with default empty objects to avoid undefined errors
  const {
    heroSection = {},
    videoSection = {},
    elevateSection = {},
    defineUsSection = {},
    slideshowSection = {},
    solutionSection = {},
    journeySection = {},
    brandSection = {},
  } = homes[0] || {};

  return (
    <div className="grid gap-5">
      <ToastContainer />

      {fetchError ? (
        <p className="text-red-600">{fetchError}</p>
      ) : (
        <>
          <HeroSection data={heroSection} id="672acdb3167e8afc7894cdd9" />
          <Intro data={videoSection} id="672acdb3167e8afc7894cdd9" />
          <DefinesSection
            data={defineUsSection}
            id="672acdb3167e8afc7894cdd9"
          />
          <ElevateSection data={elevateSection} id="672acdb3167e8afc7894cdd9" />
          <JourneySection data={journeySection} id="672acdb3167e8afc7894cdd9" />
        </>
      )}
    </div>
  );
};

export default Home;
