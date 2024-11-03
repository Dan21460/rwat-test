# RWAT - CA1
# Daniel Wu
# C21460524

## Overview
This is my RWAT CA1 Assignemnt which is a box and arrow diagram, below my drawing functionality and save approach are declared

## Drawing Functionality
### mouse-only (implemented using drag-and-drop API)
- **Mouse-Only Interaction**:
  - Drag and drop elements onto the grid.
  - Double-click to edit boxes.
  - Rotate arrows:
    - exit-top-enter-right and exit-right-enter-top motions for clockwise and anticlockwise rotation of elements, respectively

## Save Approach
- **Firebase (BaaS)**: Made use of Firebase for saving
  - **Firebase Functions**:
    - `addDoc()`: Saves the diagram data to a Firestore collection.
    - `getDocs()`: Retrieves saved diagrams from Firestore for loading.

## Technologies Used
- **HTML, CSS, JavaScript**
- **Firebase Firestore**
- **Drag-and-Drop API**
