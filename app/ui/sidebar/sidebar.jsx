"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MdColorLens,
  MdDashboard,
  MdExpandLess,
  MdExpandMore,
  MdHome,
  MdSettings,
  MdWork,
  MdWorkspaces,
} from "react-icons/md"; // Import icons
import { PiImagesSquareDuotone } from "react-icons/pi";
import { SiSololearn } from "react-icons/si";
import { BsInfoCircleFill } from "react-icons/bs";
import { GrResources } from "react-icons/gr";
import logo from "@/public/assets/logo/logo.png";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <MdDashboard />,
    },
    {
      title: "Home",
      icon: <MdHome />,
      subItems: [
        { title: "Home", path: "/dashboard/home" },
        // { title: "Slideshow", path: "/dashboard/slideshow" },
        { title: "Mouse Movement", path: "/dashboard/mouse-movement" },
      ],
    },
    {
      title: "Work",
      path: "/dashboard/work",
      icon: <MdWorkspaces />,
    },
    {
      title: "Solutions",
      icon: <SiSololearn />,
      subItems: [
        { title: "Brand Solutions", path: "/dashboard/brand-solutions" },
        { title: "Media Solutions", path: "/dashboard/media-solutions" },
        { title: "Tech Solutions", path: "/dashboard/tech-solutions" },
      ],
    },
    {
      title: "About",
      icon: <BsInfoCircleFill />,
      subItems: [
        { title: "Who We Are", path: "/dashboard/who-we-are" },
        // { title: "How We Work", path: "/dashboard/how-we-works" },
        { title: "Our Partnership", path: "/dashboard/partnership" },
        { title: "Achievements", path: "/dashboard/achievements" },
        { title: "Meet The Team", path: "/dashboard/meet-our-team" },
        { title: "News Center", path: "/dashboard/news-center" },
      ],
    },
    {
      title: "Resources",
      icon: <GrResources />,
      subItems: [
        { title: "Blogs", path: "/dashboard/blogs" },
        { title: "The Edge", path: "/dashboard/the-edge" },
      ],
    },
    {
      title: "Jobs",
      icon: <MdWork />,
      subItems: [
        { title: "Job Hero", path: "/dashboard/job-hero" },
        { title: "Jobs", path: "/dashboard/jobs" },
      ],
    },
    {
      title: "Color Palate",
      path: "/dashboard/color-palette",
      icon: <MdColorLens />,
    },
    {
      title: "Contact Images",
      path: "/dashboard/contacts",
      icon: <PiImagesSquareDuotone />,
    },
    {
      title: "Settings",
      icon: <MdSettings />,
      subItems: [{ title: "Manage Users", path: "/dashboard/manage-users" }],
    },
  ];

  const [collapsedSections, setCollapsedSections] = useState({
    Home: true,
    Solutions: true,
    About: true,
    Resources: true,
    Jobs: true,
    Settings: true,
  });

  const toggleSection = (sectionTitle) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [sectionTitle]: !prevState[sectionTitle],
    }));
  };

  const MenuLink = ({ item, isSubItem = false }) => {
    const isActive = pathname === item.path;

    return (
      <Link
        href={item.path}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
          isActive
            ? "bg-teal-500 text-white"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        } ${isSubItem ? "ml-8 pl-4 border-l-2 border-gray-700" : ""}`}
      >
        {!isSubItem && item.icon && (
          <span className="text-xl saturate-0">{item.icon}</span>
        )}
        <span
          className={`text-sm ${
            isSubItem ? "text-gray-300" : "text-base font-medium"
          }`}
        >
          {item.title}
        </span>
      </Link>
    );
  };

  return (
    <div className="h-screen w-80 bg-gradient-to-b from-gray-900 to-black text-gray-200 p-4 flex flex-col">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-8 border-b border-gray-700 py-5">
        <Image src={logo} alt="Brand Logo" width={100} height={100} />
        <h2 className="text-xl font-semibold mt-2">Admin Panel</h2>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {menuItems.map((item, index) => (
          <div key={index} className="space-y-1">
            {/* Direct Links */}
            {item.path ? (
              <MenuLink item={item} />
            ) : (
              <div>
                {/* Collapsible Section Headers */}
                <div
                  onClick={() => toggleSection(item.title)}
                  className="flex items-center justify-between cursor-pointer text-gray-500 font-semibold uppercase px-4 text-sm tracking-wide hover:text-white transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    <span>{item.title}</span>
                  </div>
                  {collapsedSections[item.title] ? (
                    <MdExpandMore className="text-lg" />
                  ) : (
                    <MdExpandLess className="text-lg" />
                  )}
                </div>

                {/* Collapsible Sub-items with Smooth Transition */}
                <div
                  className={`${
                    collapsedSections[item.title]
                      ? "max-h-0 overflow-hidden"
                      : "max-h-screen"
                  } transition-all duration-300 ease-in-out`}
                >
                  {item.subItems && (
                    <div className="mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <MenuLink key={subIndex} item={subItem} isSubItem />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
