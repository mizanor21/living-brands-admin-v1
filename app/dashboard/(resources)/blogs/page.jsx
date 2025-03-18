"use client";
import Blogs from "@/app/ui/blogs/Blogs";
import Works from "@/app/ui/works/Works";
import React from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const DashboardWorkPage = () => {
  const { data, error } = useSWR(
    `/api/blogs`,
    fetcher
  );

  if (error) return <p>Failed to load works data.</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      {data.length > 0 ? <Blogs works={data} /> : <p>No blogs found.</p>}
    </div>
  );
};

export default DashboardWorkPage;
