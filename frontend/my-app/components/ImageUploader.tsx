"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { motion } from "framer-motion"

interface ImageUploaderProps {
  onFilesSelected: (files: FileList) => void
}

export function ImageUploader({ onFilesSelected }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    onFilesSelected(e.dataTransfer.files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(e.target.files)
    }
  }

  return (
    <Card
      className={`w-full max-w-lg mt-8 shadow-lg overflow-hidden ${isDragging ? "border-primary border-2" : "border-gray-300"}`}
    >
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <CardContent
          className="flex flex-col items-center justify-center h-48 cursor-pointer rounded-lg bg-white bg-opacity-50 backdrop-blur-sm relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <Upload
            className={`w-12 h-12 mb-4 transition-colors duration-300 ${isDragging ? "text-primary" : "text-gray-400"}`}
          />
          <p className="text-sm text-gray-600 font-medium text-center">
            {isDragging ? "Drop your image here" : "Drag and drop images here, or click to select files"}
          </p>
          <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileInputChange} />
          <motion.div
            className="absolute inset-0 border-2 border-dashed rounded-lg pointer-events-none"
            animate={{
              borderColor: isDragging ? "rgba(59, 130, 246, 0.5)" : "rgba(209, 213, 219, 0.5)",
            }}
            transition={{ duration: 0.3 }}
          />
        </CardContent>
      </motion.div>
    </Card>
  )
}

