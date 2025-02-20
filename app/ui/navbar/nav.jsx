"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { MdNotificationsActive } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";

const Nav = () => {
  const router = useRouter(); // Initialize the router for redirection

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");
    // Redirect to the login page
    router.push("/");
  };

  return (
    <div className="navbar bg-gray-200 rounded-md">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Habson Communication</a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          {/* <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <MdNotificationsActive className="text-2xl" />
              <span className="badge badge-sm indicator-item">8</span>
            </div>
          </div> */}
          {/* <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-gray-200 z-[1] mt-5 w-52 shadow"
          >
            <div className="card-body">
              <span className="text-lg font-bold">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div> */}
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="rounded-full">
              <CgProfile className="text-2xl" />
              {/* <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              /> */}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-gray-200 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <Link href={"/signup"}>Create New User</Link>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a> {/* Logout action */}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Nav;
