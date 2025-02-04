"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import type { FaceData } from "@/types/FaceData"

interface ProcessedImagesProps {
  images: string[]
  imageResults: Map<string, {
    processedImage: string | null
    recognizedImage: string | null
    faceData: FaceData[] | null
    isLoading: boolean
    error: string | null
  }>
}

export function ProcessedImages({
  images,
  imageResults,
}: ProcessedImagesProps) {
  return (
    <AnimatePresence>
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {images.map((src, index) => {
            const result = imageResults.get(src)
            return (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-2">
                    <img src={src} alt={`Uploaded ${index}`} className="w-full h-auto rounded" />
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    {result?.error && (
                      <div className="text-red-500 text-sm mb-2">{result.error}</div>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" disabled={result?.isLoading}>
                          {result?.isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "View Processed Image"
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogTitle>Processed Image and Face Data</DialogTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            {result?.processedImage && (
                              <img
                                src={result.processedImage}
                                alt="Processed"
                                className="w-full h-auto rounded"
                              />
                            )}
                          </div>
                          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                            <h3 className="font-bold mb-2">Face Data:</h3>
                            {result?.faceData && result.faceData.length > 0 ? (
                              result.faceData.map((face) => (
                                <motion.div
                                  key={face.index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: face.index * 0.1 }}
                                  className="mb-4 p-3 bg-muted rounded-lg"
                                >
                                  <h4 className="font-semibold text-primary">Face {face.index}</h4>
                                  <div className="space-y-1 mt-2">
                                    <p>
                                      <span className="font-medium">Gender:</span> {face.gender}
                                      <span className="text-sm text-muted-foreground">
                                        {" "}
                                        ({face.confidence.gender}% confidence)
                                      </span>
                                    </p>
                                    <p>
                                      <span className="font-medium">Age:</span> {face.age} years
                                    </p>
                                    <p>
                                      <span className="font-medium">Expression:</span> {face.expression}
                                      <span className="text-sm text-muted-foreground">
                                        {" "}
                                        ({face.confidence.expression}% confidence)
                                      </span>
                                    </p>
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <p className="text-muted-foreground">No face data available</p>
                            )}
                          </ScrollArea>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          disabled={result?.isLoading || !result?.recognizedImage}
                        >
                          {result?.isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "View Recognized Image"
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogTitle>Recognized Image</DialogTitle>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            {result?.recognizedImage && (
                              <img
                                src={result.recognizedImage}
                                alt="Recognized"
                                className="w-full h-auto rounded"
                              />
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}