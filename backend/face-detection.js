const faceapi = require("face-api.js")
const canvas = require("canvas")
const fs = require("fs")
const path = require("path")

const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

const inputImagePath = process.argv[2]
const outputImagePath = process.argv[3]
const faceDataPath = path.join(__dirname, "face_data.json")

async function loadModels() {
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models")
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./models")
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./models")
    await faceapi.nets.faceExpressionNet.loadFromDisk("./models")
    await faceapi.nets.ageGenderNet.loadFromDisk("./models")
    console.log("Models loaded successfully.")
  } catch (error) {
    console.error("Error loading models:", error)
    process.exit(1)
  }
}

async function detectFacesAndDraw(imagePath, outputImagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`)
    }

    console.log(`🔍 Processing image: ${imagePath}`)
    const img = await canvas.loadImage(imagePath)

    const imgCanvas = canvas.createCanvas(img.width, img.height)
    const ctx = imgCanvas.getContext("2d")
    ctx.drawImage(img, 0, 0, img.width, img.height)

    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions()
      .withAgeAndGender()

    console.log(`Detected ${detections.length} face(s).`)

    const faceData = []

    detections.forEach((result, index) => {
      const { detection } = result
      const expressions = result.expressions
      const gender = result.gender
      const genderProbability = result.genderProbability
      const age = result.age
      const topExpression = Object.entries(expressions).reduce((a, b) => (a[1] > b[1] ? a : b))

      console.log(`Face ${index + 1}:`)
      console.log(`   - Gender: ${gender} (${(genderProbability * 100).toFixed(1)}% confidence)`)
      console.log(`   - Estimated Age: ${age.toFixed(1)} years`)
      console.log(`   - Expression: ${topExpression[0]} (${(topExpression[1] * 100).toFixed(1)}%)\n`)

      // Draw face rectangle
      ctx.strokeStyle = "red"
      ctx.lineWidth = 3
      ctx.strokeRect(detection.box.x, detection.box.y, detection.box.width, detection.box.height)

      // Save face data
      faceData.push({
        index: index + 1,
        gender: gender,
        age: age.toFixed(1),
        expression: topExpression[0],
        confidence: {
          gender: (genderProbability * 100).toFixed(1),
          expression: (topExpression[1] * 100).toFixed(1),
        },
        box: {
          x: detection.box.x,
          y: detection.box.y,
          width: detection.box.width,
          height: detection.box.height,
        },
      })
    })

    // Save the face data to a file
    fs.writeFileSync(faceDataPath, JSON.stringify(faceData, null, 2))
    console.log(`Face data saved to: ${faceDataPath}`)

    // Save the processed image
    const buffer = imgCanvas.toBuffer("image/jpeg")
    fs.writeFileSync(outputImagePath, buffer)
    console.log(`Output image saved: ${outputImagePath}`)
  } catch (error) {
    console.error("Error processing image:", error)
    // Create an empty face data file to prevent errors
    fs.writeFileSync(faceDataPath, JSON.stringify([], null, 2))
    throw error
  }
}
// Execute the face detection
;(async () => {
  if (!inputImagePath || !outputImagePath) {
    console.error("Please provide both input and output image paths")
    process.exit(1)
  }
  await loadModels()
  await detectFacesAndDraw(inputImagePath, outputImagePath)
})()
