import numpy as np 
import argparse
import pandas as pd
import matplotlib.pyplot as plt 
import cv2 as cv 
import os
import joblib
import shutil
import face_recognition as fc
import face_api as faceapi
from sklearn.model_selection import train_test_split
from sklearn import neighbors
import seaborn as sns
import sklearn.metrics as smt
import json
import sys
sns.set_style('darkgrid')


# Load dataset containing image paths and labels
df=pd.read_csv("./dataset/Dataset.csv")
# df

# Display the distribution of labels in the dataset
# df.label.value_counts().to_frame()

# Function to encode images and extract facial features

def encode_images(df):
    dir = r'./dataset/Original Images/Original Images'
    face_encodings_list = []
    labels_list = []
    for path, label in df.values:
        img_path = os.path.join(dir, label, path)
        image = fc.load_image_file(img_path)
        face_encodings = fc.face_encodings(image)

        if face_encodings:
            face_encoding = face_encodings[0]
            face_encodings_list.append(face_encoding)
            labels_list.append(label)
    return face_encodings_list, labels_list



# Encode images or load existing encodings
encodings_path = "face_encodings.pkl"
labels_path = "face_labels.pkl"
model_path = "knn_model.pkl"

# Load or train model
if os.path.exists(encodings_path) and os.path.exists(labels_path) and os.path.exists(model_path):
    print("Loading saved model and encodings...")
    x = joblib.load(encodings_path)
    y = joblib.load(labels_path)
    knn_clf = joblib.load(model_path)

else:
    print("Processing images and training model...")
    x, y = encode_images(df)

    # Train-test split
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.15, stratify=y, random_state=42)

    # Train KNN model
    knn_clf = neighbors.KNeighborsClassifier(n_neighbors=3, algorithm='ball_tree', weights='distance')
    knn_clf.fit(x_train, y_train)

    # Save model and encodings
    joblib.dump(x, encodings_path)
    joblib.dump(y, labels_path)
    joblib.dump(knn_clf, model_path)
    print("Model and encodings saved.")

#  Only evaluate model if training occurred (i.e., x_test exists)
if 'x_test' in locals() and 'y_test' in locals():
    y_pred = knn_clf.predict(x_test)
    precision = smt.precision_score(y_test, y_pred, average='weighted')
    recall = smt.recall_score(y_test, y_pred, average='weighted')
    f1 = smt.f1_score(y_test, y_pred, average='weighted')

    print(f"Precision: {precision}")
    print(f"Recall: {recall}")
    print(f"F1 Score: {f1}")



# Function to display images
"""
    Displays an image with optional conversion from BGR to RGB.
    
    Args:
        image (ndarray): Image to be displayed.
        x (int): Width of the displayed figure.
        y (int): Height of the displayed figure.
        bgr (bool): Convert image from BGR to RGB if True.
"""
def show_image(image, x=10, y=8, bgr=False):
    plt.figure(figsize=(x, y))
    if len(image.shape) == 2:
        plt.imshow(image, cmap='gray')
    elif len(image.shape) == 3:
        if bgr:
            image = cv.cvtColor(image, cv.COLOR_BGR2RGB)
        plt.imshow(image)
    plt.xticks([])
    plt.yticks([])
    # plt.savefig("recognized_output.jpg")  # Save image instead of showing
    plt.close()  # Close figure to prevent memory leaks




# Ensure correct column name for image paths
image_column = 'path'  # Adjust this if the column has a different name in your CSV
label_column = 'label'  # Adjust if needed


def iou(boxA, boxB):
    """ Compute Intersection Over Union (IOU) between two bounding boxes. """
    yA = max(boxA[0], boxB[0])
    xA = max(boxA[3], boxB[3])
    yB = min(boxA[2], boxB[2])
    xB = min(boxA[1], boxB[1])

    interArea = max(0, yB - yA) * max(0, xB - xA)
    boxAArea = (boxA[2] - boxA[0]) * (boxA[1] - boxA[3])
    boxBArea = (boxB[2] - boxB[0]) * (boxB[1] - boxB[3])

    iou = interArea / float(boxAArea + boxBArea - interArea) if (boxAArea + boxBArea - interArea) > 0 else 0
    return iou



# Function to predict faces in an image and annotate with recognized labels
"""
    Detects and recognizes faces in an input image and saves the output image with annotations.
    
    Args:
        image_path (str): Path to the input image.
        output_dir (str): Directory to save the annotated image.
"""
def predict_and_retrieve(image_path, output_dir):
    image = cv.imread(image_path)
    rgb_image = cv.cvtColor(image, cv.COLOR_BGR2RGB)
    face_locations = fc.face_locations(rgb_image)
    face_encodings = fc.face_encodings(rgb_image, face_locations)

    recognized_faces = []
    identified_people = set()  # Store recognized names

    for i, (top, right, bottom, left) in enumerate(face_locations):
        matches = knn_clf.kneighbors([face_encodings[i]], n_neighbors=1)
        recognized_person = knn_clf.predict([face_encodings[i]])[0] if matches[0][0][0] < 0.5 else "Unknown"

        recognized_faces.append({
            "bounding_box": [top, right, bottom, left],
            "name": recognized_person
        })

        identified_people.add(recognized_person)

        # Draw bounding box & label on image
        cv.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)
        cv.putText(image, recognized_person, (left, top - 10), cv.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # Save the updated image with bounding boxes
    recognized_output_path = os.path.join(output_dir, "recognized_output.jpg")
    cv.imwrite(recognized_output_path, image)

# Example usage:
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python main.py <input_image_path> <output_dir>")
        sys.exit(1)

    input_image_path = sys.argv[1]
    output_directory = sys.argv[2]
    identified_folder = predict_and_retrieve(input_image_path, output_directory)


# Function to load the trained model later
def load_trained_model():
    if os.path.exists(model_path):
        return joblib.load(model_path)
    else:
        raise FileNotFoundError("Trained model not found. Train and save the model first.")

