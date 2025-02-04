"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ImageUploader } from "./ImageUploader"
import { ProcessedImages } from "./ProcessedImages"
import type { FaceData } from "@/types/FaceData"

export default function ImageProcessor() {
  const [images, setImages] = useState<string[]>([])
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [recognizedImage, setRecognizedImage] = useState<string | null>(null)
  const [faceData, setFaceData] = useState<FaceData[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processImage = async (file: File) => {
    setIsLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("http://localhost:3001/process-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Image processing failed")
      }

      const data = await response.json()
      console.log("Received data from server:", data) // Debug log

      setProcessedImage(`http://localhost:3001${data.outputPath}`)
      setRecognizedImage(`http://localhost:3001${data.recognizedOutputPath}`)
      setFaceData(data.faceData)
    } catch (error) {
      console.error("Error processing image:", error)
      setError("Failed to process image. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiles = async (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
    const newImages = imageFiles.map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...newImages])

    if (imageFiles.length > 0) {
      await processImage(imageFiles[0])
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Image Processor</h1>
      </motion.div>

      <ImageUploader onFilesSelected={handleFiles} />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-red-500 bg-red-100 px-4 py-2 rounded-md"
        >
          {error}
        </motion.div>
      )}

      <ProcessedImages
        images={images}
        processedImage={processedImage}
        recognizedImage={recognizedImage}
        faceData={faceData}
        isLoading={isLoading}
      />
    </div>
  )
}

