"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { LuClipboardEdit } from "react-icons/lu"
import { RiDeleteBin6Line } from "react-icons/ri"
import WorkModal from "./WorkModal"
import { Button } from "@/components/ui/button"
import CreateWorkModal from "./CreateWorkModal"
import { toast } from "react-toastify"

const Works = () => {
  const [works, setWorks] = useState([])
  const [workId, setWorkId] = useState("")

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/works`)
      if (!res.ok) throw new Error("Failed to fetch works")
      const data = await res.json()
      setWorks(data)
    } catch (error) {
      console.error("Error fetching works:", error)
      toast.error("Failed to load works. Please try again.")
    }
  }

  const removeWork = async (id) => {
    const confirm = window.confirm(`Are you sure you want to delete this work item?`)

    if (confirm) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/works?id=${id}`, {
          method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to delete work")
        setWorks(works.filter((work) => work._id !== id))
        toast.success("Work item deleted successfully!")
      } catch (error) {
        console.error("Error deleting work:", error)
        toast.error("Failed to delete work item. Please try again.")
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
          Create Work
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
      <WorkModal workId={workId} modalId="workModal" updateWork={updateWork} />
      <CreateWorkModal modalId="createWorkModal" addWork={addWork} />
    </div>
  )
}

export default Works

