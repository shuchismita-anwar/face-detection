const express = require("express");
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");
const cors = require("cors");
const fs = require("fs");
const crypto = require("crypto");

const app = express();

// Configure multer to generate unique filenames
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    // Generate a unique ID for this request
    const uniqueId = crypto.randomBytes(8).toString("hex");
    // Keep the original extension
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const upload = multer({ storage });

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

  // Generate unique IDs for output files
  const uniqueId = path.basename(req.file.filename, path.extname(req.file.filename));
  const inputImagePath = req.file.path;
  const outputImagePath = path.join(outputDir, `output_${uniqueId}.jpg`);
  const recognizedOutputPath = path.join(outputDir, `recognized_${uniqueId}.jpg`);
  const faceDataPath = path.join(__dirname, `face_data_${uniqueId}.json`);

  console.log(`Processing image: ${inputImagePath}`);
  console.log(`Output path: ${outputImagePath}`);

  // Run face detection script with unique paths
  exec(`node face-detection.js "${inputImagePath}" "${outputImagePath}" "${faceDataPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      cleanupFiles();
      return res.status(500).send("Error processing image");
    }

    console.log("stderr:", stderr);
    console.log("stdout:", stdout);

    // Path to the Python virtual environment
    const pythonVenvPath = path.join(__dirname, "face_recog_env", "Scripts", "python.exe");

    // Run face recognition with unique paths
    exec(
      `"${pythonVenvPath}" main.py "${inputImagePath}" "${outputDir}" "${uniqueId}"`,
      (pyError, pyStdout, pyStderr) => {
        if (pyError) {
          console.error(`Python Error: ${pyError.message}`);
          cleanupFiles();
          return res.status(500).send("Error in face recognition");
        }

        console.log("Python stderr:", pyStderr);
        console.log("Python stdout:", pyStdout);

        // Try to read the face data file
        setTimeout(() => {
          if (fs.existsSync(faceDataPath)) {
            const faceData = JSON.parse(fs.readFileSync(faceDataPath, "utf8"));
            console.log("Face data read successfully:", faceData);

            // Send response with unique file paths
            res.json({
              message: "Image processed successfully",
              outputPath: `/output/output_${uniqueId}.jpg`,
              recognizedOutputPath: `/output/recognized_${uniqueId}.jpg`,
              faceData: faceData,
              identifiedFaces: faceData.identified_faces || [],
            });

            console.log("Identified faces sent to frontend:", faceData.identified_faces || []);
            
            // Cleanup temporary files
            cleanupFiles();
          } else {
            console.error("Face data file not found");
            cleanupFiles();
            res.status(500).send("Face data file not found");
          }
        }, 100);
      }
    );
  });

  // Function to cleanup temporary files
  function cleanupFiles() {
    // Remove temporary files after processing
    const filesToCleanup = [
      inputImagePath,
      faceDataPath
    ];

    filesToCleanup.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlink(file, (err) => {
          if (err) console.error(`Error deleting file ${file}:`, err);
        });
      }
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
