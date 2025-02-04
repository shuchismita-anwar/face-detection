# Face Recognition and Analysis System

A modern web application that combines advanced face detection, recognition, and analysis capabilities using both JavaScript and Python technologies. The system provides real-time face detection, age and gender estimation, and expression analysis.

![Face Detection Demo](path_to_demo_image.gif)

## 🌟 Features

- Real-time face detection and recognition
- Age and gender estimation
- Facial expression analysis
- Modern, responsive UI built with Next.js and Shadcn
- 3D visualization effects
- Secure file handling and processing
- RESTful API backend
- Support for both uploaded images and website image URLs

## 🛠️ Technology Stack

### Frontend
- Next.js 13.5.6
- React 18.2.0
- React DOM 18.2.0
- Three.js 0.158.0
- @react-three/fiber 8.15.11
- @react-three/drei 9.88.7
- TypeScript 5.2.2
- Tailwind CSS 3.3.5
- Shadcn UI (latest)
- React Dropzone 14.2.3
- Lucide React 0.292.0
- Axios 1.6.2
- Classnames 2.3.2
- React Icons 4.12.0

### Backend
- Node.js 16.20.0+
- Express 4.18.2
- Python 3.8+
- TensorFlow.js 4.13.0
- face-api.js 0.22.2
- OpenCV Python (cv2) 4.8.1
- scikit-learn 1.3.2
- NumPy 1.24.3
- Pandas 2.1.3
- Matplotlib 3.8.2
- face_recognition 1.3.0
- Multer 1.4.5-lts.1
- CORS 2.8.5
- dotenv 16.3.1
- body-parser 1.20.2
- morgan 1.10.0

### Development Tools
- CMake 3.27.7
- Visual Studio Build Tools 2022
- npm 10.2.3
- pip 23.3.1

### Minimum System Requirements
- CPU: Intel Core i5/AMD Ryzen 5 or better
- RAM: 8GB minimum, 16GB recommended
- GPU: Not required, but recommended for better performance
- Storage: 2GB free space
- OS: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)

## 📋 Prerequisites

- Node.js 16.20.0+ 
- Python 3.8+
- CMake 3.27.7
- Visual Studio Build Tools 2022

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd face-rec
   ```

2. **Backend Setup**
   ```bash
   # Initialize Node.js project
   npm init -y
   
   # Install core dependencies
   npm install express@4.18.2 multer@1.4.5-lts.1 cors@2.8.5
   npm install face-api.js@0.22.2
   npm install @tensorflow/tfjs-node@4.13.0 canvas@2.10.1 fs@0.0.1-security path@0.12.7
   npm install axios@1.6.2
   
   # Additional dependencies
   npm install dotenv@16.3.1         # for environment variables
   npm install body-parser@1.20.2    # for parsing request bodies
   npm install morgan@1.10.0        # for request logging
   ```

3. **Python Dependencies**
   ```bash
   pip install --upgrade setuptools
   pip install cmake face_recognition@1.3.0 numpy@1.24.3 pandas@2.1.3 matplotlib@3.8.2 opencv-python@4.8.1 scikit-learn@1.3.2 seaborn face_api
   ```

4. **Frontend Setup**
   ```bash
   # Create Next.js app
   npx create-next-app@latest frontend
   cd frontend
   
   # Install React and core dependencies
   npm install react@18.2.0 react-dom@18.2.0
   
   # Install UI and visualization libraries
   npm install three@0.158.0 @react-three/fiber@8.15.11 @react-three/drei@9.88.7
   npm install react-dropzone@14.2.3 lucide-react@0.292.0
   
   # Install Shadcn UI components
   npx shadcn@latest init
   npx shadcn@latest add button
   npx shadcn@latest add card
   npx shadcn@latest add dialog
   npx shadcn@latest add scroll-area
   npx shadcn@latest add textarea
   
   # Install additional utilities
   npm install axios@1.6.2         # for API requests
   npm install classnames@2.3.2    # for conditional CSS
   npm install react-icons@4.12.0   # for icons
   ```

## 📊 Dataset

This project uses the [Face Recognition Dataset](https://www.kaggle.com/datasets/vasukipatel/face-recognition-dataset) from Kaggle. 

### Dataset Setup Instructions

1. **Download the Dataset**
   - Visit the Kaggle dataset page
   - Download the dataset ZIP file
   - Extract the contents to a temporary location

2. **Dataset Structure**
   Create the following directory structure in your project:
   ```
   backend/
   ├── dataset/
   │   ├── training/
   │   │   ├── person1/
   │   │   │   ├── image1.jpg
   │   │   │   ├── image2.jpg
   │   │   │   └── ...
   │   │   ├── person2/
   │   │   │   ├── image1.jpg
   │   │   │   └── ...
   │   │   └── ...
   │   └── test/
   │       ├── person1/
   │       │   ├── test1.jpg
   │       │   └── ...
   │       └── person2/
   │           ├── test1.jpg
   │           └── ...
   ```

3. **Organizing Images**
   - Create a folder for each person under `training/` and `test/`
   - Name each folder with the person's name (use underscores for spaces)
   - Place at least 5-10 clear face images of each person in their respective training folder
   - Place 1-2 test images in their respective test folder
   - Supported image formats: `.jpg`, `.jpeg`, `.png`

4. **Image Requirements**
   - Image resolution: Minimum 200x200 pixels recommended
   - Face visibility: Clear, unobstructed frontal face view
   - Lighting: Well-lit images with consistent lighting
   - File size: Keep under 2MB per image for optimal performance

5. **Verify Dataset Structure**
   Run this command in your terminal to verify the dataset structure:
   ```bash
   # On Windows
   tree backend/dataset
   
   # On Unix/Linux
   find backend/dataset -type d
   ```

6. **Update Configuration**
   If you place the dataset in a different location, update the path in `backend/config.js`:
   ```javascript
   module.exports = {
     datasetPath: './dataset',  // Update this path if needed
     trainingDir: './dataset/training',
     testDir: './dataset/test'
   };
   ```

### Dataset Tips
- Keep your dataset organized with clear folder names
- Use consistent image naming conventions (e.g., `person1_01.jpg`)
- Regularly backup your dataset
- Consider using version control for dataset changes
- Document any special cases or requirements for specific images

## 🖼️ Adding Images for Processing

The application supports two ways to add images for face recognition:

1. **Upload Local Images**
   - Click the upload button on the web interface
   - Select an image file from your computer
   - The image will be processed automatically

2. **Process Images from URLs**
   ```javascript
   // Example API call to process image from URL
   const processImageFromUrl = async (imageUrl) => {
     try {
       const response = await axios.post('http://localhost:3000/api/process-url', {
         url: imageUrl
       });
       return response.data;
     } catch (error) {
       console.error('Error processing image:', error);
     }
   };
   ```

## 🏃‍♂️ Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend/my-app
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
face-rec/
├── backend/
│   ├── models/           # Face detection and recognition models
│   ├── dataset/         # Face recognition dataset
│   ├── face-detection.js # JavaScript face detection
│   ├── main.py          # Python face recognition
│   └── server.js        # Express server
├── frontend/
│   └── my-app/
│       ├── components/   # React components
│       ├── app/         # Next.js pages
│       └── public/      # Static assets
└── README.md
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](your-repo-url/issues).

## 📝 License

This project is [MIT](LICENSE) licensed.

## 🙏 Acknowledgments

- face-api.js
- TensorFlow
- face_recognition library
- Next.js team
- Shadcn UI
- Kaggle for providing the dataset