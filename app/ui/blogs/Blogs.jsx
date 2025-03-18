"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { LuClipboardEdit } from "react-icons/lu"
import { RiDeleteBin6Line } from "react-icons/ri"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import UpdateBlogModal from "./UpdateBlogModal"
import CreateBlogModal from "./CreateBlogModal"

const Blogs = () => {
  const [works, setWorks] = useState([])
  const [workId, setWorkId] = useState("")

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    try {
      const res = await fetch(`/api/blogs`)
      if (!res.ok) throw new Error("Failed to fetch blogs")
      const data = await res.json()
      setWorks(data)
    } catch (error) {
      toast.error("Failed to load blogs. Please try again.")
    }
  }

  const removeWork = async (id) => {
    const confirm = window.confirm(`Are you sure you want to delete this blog item?`)

    if (confirm) {
      try {
        const res = await fetch(`/api/blogs?id=${id}`, {
          method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to delete blog")
        setWorks(works.filter((work) => work._id !== id))
        toast.success("Blog item deleted successfully!")
      } catch (error) {
        console.error("Error deleting blog:", error)
        toast.error("Failed to delete blog item. Please try again.")
      }
    }
  }

  const addWork = (newWork) => {
    setWorks([...works, newWork])
  }

  const updateWork = (updatedWork) => {
    setWorks(works.map((work) => (work._id === updatedWork._id ? updatedWork : work)))
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          className="px-10 bg-[#147274] hover:bg-[#145e60]"
          onClick={() => document.getElementById("createWorkModal").showModal()}
        >
          Create New Blog
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-8 md:gap-y-10">
        {works.map((item) => (
          <div key={item._id} className="group">
            <div>
              <Image
                src={item?.img || "/placeholder.svg"}
                alt={item?.title || "Work item"}
                width={500}
                height={300}
                className="rounded-xl object-cover w-full h-64"
              />
              <div className="flex justify-between items-center mt-3">
                <h2 className="text-md lg:text-lg font-extrabold">{item?.title}</h2>
                <div className="hidden group-hover:flex gap-3">
                  <button
                    onClick={() => {
                      document.getElementById("workModal").showModal()
                      setWorkId(item._id)
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <LuClipboardEdit size={20} />
                  </button>
                  <button onClick={() => removeWork(item._id)} className="text-red-600 hover:text-red-800">
                    <RiDeleteBin6Line size={20} />
                  </button>
                </div>
              </div>
              <p className="text-[16px] md:text-[20px] mt-2 text-gray-600">{item?.detailsTitle}</p>
            </div>
          </div>
        ))}
      </div>
      <UpdateBlogModal workId={workId} modalId="workModal" updateWork={updateWork} />
      <CreateBlogModal modalId="createWorkModal" addWork={addWork} />
    </div>
  )
}

export default Blogs

