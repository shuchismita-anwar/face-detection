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
- Support for both uploaded images.



## 🖥️ Application Screenshots

### 1. **Home Page**
The home page allows users to upload images for processing through drag-and-drop or file selection.
![Home Page](https://github.com/shuchismita-anwar/face-detection/blob/final-branch/images/image1.png)

---

### 2. **Image Upload and Display**
Once an image is uploaded, it is displayed for the user to review before processing.
![Image Upload](https://github.com/shuchismita-anwar/face-detection/blob/final-branch/images/image2.png)

---

### 3. **Processed Image**
The application displays the processed image with bounding boxes highlighting the detected faces.
![Processed Image](https://github.com/shuchismita-anwar/face-detection/blob/final-branch/images/image3.png)

---

### 4. **Face Data Analysis**
Each detected face is analyzed for attributes such as gender, age, and expression. Results are displayed alongside the processed image.
![Face Data Analysis](https://github.com/shuchismita-anwar/face-detection/blob/final-branch/images/image4.png)

---

### 5. **Recognized Image**
The recognized image shows the detected face labeled with the person's name (if recognized).
![Recognized Image](https://github.com/shuchismita-anwar/face-detection/blob/final-branch/images/image5.png)



## 📋 Prerequisites

- Node.js 16.20.0+
- Python 3.8+
- CMake 3.27.7


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


## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shuchismita-anwar/face-recognition-task.git
   cd face-rec
   ```

2. **Backend Setup**
   ```bash
   # Initialize Node.js project
   npm init -y
   
   # Install core dependencies
   npm install face-api.js @tensorflow/tfjs-node canvas fs path
   npm install express multer cors
   npm install axios
   ```

3. **Python Dependencies**
   Create a Python virtual environment named 'face_recog_env'
   ```bash
   python3.12 -m venv face_recog_env
   pip install cmake face_recognition numpy pandas matplotlib opencv-python scikit-learn seaborn face_api
   pip install --upgrade setuptools
   ```

5. **Frontend Setup**
   ```bash
 
   # Install React and core dependencies
   npm install react@18.2.0 react-dom@18.2.0
   
   # Install UI and visualization libraries
   npm install three @react-three/fiber @react-three/drei react-dropzone lucide-react
   
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
   Create the following directory structure:
   ```
   📂 dataset
      ├── 📂 Faces
      │   ├── Akshay Kumar_0.jpg
      │   ├── Akshay Kumar_1.jpg
      │   ├── Akshay Kumar_2.jpg
      │   ├── Akshay Kumar_3.jpg
      │   ├── Akshay Kumar_4.jpg
      │   ├── Akshay Kumar_5.jpg
      │   ├── Akshay Kumar_6.jpg
      │   ├── Akshay Kumar_7.jpg
      │   ├── Akshay Kumar_8.jpg
      │   ├── Akshay Kumar_9.jpg
      │   ├── ... (many more)
      │
      ├── 📂 Original Images
      │   ├── 📂 Alexandra Daddario
      │   ├── 📂 Alia Bhatt
      │   ├── 📂 Amitabh Bachchan
      │   ├── 📂 Andy Samberg
      │   ├── 📂 Anushka Sharma
      │   ├── 📂 Billie Eilish
      │   ├── 📂 Courtney Cox
      │   ├── 📂 Dwayne Johnson
      │   ├── ... (many more)
      │
      ├── Dataset.csv

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


5. **Update Configuration**
   If dataset is placed in a different location, update the path in `backend/config.js`:
   ```javascript
   module.exports = {
     datasetPath: './dataset',  // Update this path if needed
     trainingDir: './dataset/training',
     testDir: './dataset/test'
   };
   ```



## 🖼️ Adding Images for Processing

The application supports two ways to add images for face recognition:

1. **Upload Local Images**
   - Click the upload button on the web interface
   - Select an image file 
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

3. Navigate to `http://localhost:3000`

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
