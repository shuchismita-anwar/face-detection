const express = require("express");
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");
const cors = require("cors");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use("/output", express.static(path.join(__dirname, "public/detections")));


const outputDir = path.join(__dirname, "public", "detections");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

app.post("/process-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image uploaded");
  }

  const inputImagePath = req.file.path;
  const outputImagePath = path.join(outputDir, "output.jpg");
  const recognizedOutputPath = path.join(outputDir, "recognized_output.jpg");
  const faceDataPath = path.join(__dirname, "face_data.json");

  console.log(`Processing image: ${inputImagePath}`);
  console.log(`Output path: ${outputImagePath}`);

  // Run face detection script
  exec(`node face-detection.js "${inputImagePath}" "${outputImagePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send("Error processing image");
    }

    console.log("stderr:", stderr);
    console.log("stdout:", stdout);

    // Path to the Python virtual environment
    const pythonVenvPath = path.join(__dirname, "face_recog_env", "Scripts", "python.exe");

    // Run face recognition (main.py) using Python from virtual environment
    exec(
      `"${pythonVenvPath}" main.py "${inputImagePath}" "${outputDir}"`,
      (pyError, pyStdout, pyStderr) => {
        if (pyError) {
          console.error(`Python Error: ${pyError.message}`);
          return res.status(500).send("Error in face recognition");
        }

        console.log("Python stderr:", pyStderr);
        console.log("Python stdout:", pyStdout);

        // Try to read the face data file
        setTimeout(() => {
          if (fs.existsSync(faceDataPath)) {
            const faceData = JSON.parse(fs.readFileSync(faceDataPath, "utf8"));
            console.log("Face data read successfully:", faceData);

            res.json({
              message: "Image processed successfully",
              outputPath: "/output/output.jpg",
              recognizedOutputPath: "/output/recognized_output.jpg",
              faceData: faceData,
              identifiedFaces: faceData.identified_faces || [], // Send identified faces
            });
            console.log("Identified faces sent to frontend:", faceData.identified_faces || []);
          } else {
            console.error("Face data file not found");
            res.status(500).send("Face data file not found");
          }
        }, 100); // Small delay to ensure file is written
      }
    );
  });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});