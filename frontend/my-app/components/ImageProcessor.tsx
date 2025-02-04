"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ImageUploader } from "./ImageUploader"
import { ProcessedImages } from "./ProcessedImages"
import type { FaceData } from "@/types/FaceData"

interface ImageResult {
  processedImage: string | null;
  recognizedImage: string | null;
  faceData: FaceData[] | null;
  isLoading: boolean;
  error: string | null;
}

export default function ImageProcessor() {
  const [images, setImages] = useState<string[]>([])
  const [imageResults, setImageResults] = useState<Map<string, ImageResult>>(new Map())

  const processImage = async (file: File, imageUrl: string) => {
    // Update loading state for this specific image
    setImageResults(prev => new Map(prev).set(imageUrl, {
      processedImage: null,
      recognizedImage: null,
      faceData: null,
      isLoading: true,
      error: null
    }));

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
      console.log("Received data from server:", data)

      // Update results for this specific image
      setImageResults(prev => new Map(prev).set(imageUrl, {
        processedImage: `http://localhost:3001${data.outputPath}`,
        recognizedImage: `http://localhost:3001${data.recognizedOutputPath}`,
        faceData: data.faceData,
        isLoading: false,
        error: null
      }))
    } catch (error) {
      console.error("Error processing image:", error)
      setImageResults(prev => new Map(prev).set(imageUrl, {
        processedImage: null,
        recognizedImage: null,
        faceData: null,
        isLoading: false,
        error: "Failed to process image. Please try again."
      }))
    }
  }

  const handleFiles = (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
    
    // Process all images concurrently
    imageFiles.forEach(file => {
      const imageUrl = URL.createObjectURL(file)
      setImages(prev => [...prev, imageUrl])
      // Start processing immediately
      processImage(file, imageUrl)
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Image Processor</h1>
      </motion.div>

      <ImageUploader onFilesSelected={handleFiles} />

      <ProcessedImages
        images={images}
        imageResults={imageResults}
      />
    </div>
  )
}