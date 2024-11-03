// Daniel Wu
// C21460524


// Importing Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// My Firebase Configurations
const firebaseConfig = {
  apiKey: "AIzaSyC8_b4wEEzSrDKxtjR07BMkn1HNoA7AZN0",
  authDomain: "rwat-ca1-d11e9.firebaseapp.com",
  projectId: "rwat-ca1-d11e9",
  storageBucket: "rwat-ca1-d11e9.appspot.com",
  messagingSenderId: "7266617402",
  appId: "1:7266617402:web:c5adee9a2deb67c4734d03",
  measurementId: "G-8N28YPTS40"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Inializations
let gridSize = { rows: 3, cols: 3 };
let gridData = [];
let draggedElement = null;
let draggedArrow = null;
let initialMousePosition = null;
let isDraggingArrow = false; 
let isArrowDraggedOut = false; // Declare this as a global variable to track when an arrow is dragged out



// Event Listerner function for buttons
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-new').addEventListener('click', startNewDiagram);
  document.getElementById('save-diagram').addEventListener('click', saveDiagram);
  document.getElementById('load-diagram').addEventListener('click', loadDiagram);
  document.getElementById('return-start-editor').addEventListener('click', returnToStart);
  document.getElementById('return-start-load').addEventListener('click', returnToStart);

  // Adding drag to toolbar items 
  document.querySelectorAll('.toolbar-item').forEach(item => {
    item.addEventListener('dragstart', event => {
      draggedElement = event.target.dataset.type;
      event.dataTransfer.effectAllowed = 'copy';
    });
  });
});

// Function to create new Diagram
function startNewDiagram() {
  // These 2 lines prompt the user to enter in number of Columns and Rows they want
  const rows = parseInt(prompt("Enter the number of rows for the grid:"), 10);
  const cols = parseInt(prompt("Enter the number of columns for the grid:"), 10);


  // isNan checks if User Input is a valid number and then checks if its greater than 0
  if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
    // Error Checking
    alert("Invalid grid size. Please enter positive numbers.");
    return;
  }

  // iniliazes grid
  gridSize = { rows, cols };
  initializeGrid();
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('editor-screen').style.display = 'block';
}

// Function to Initialize a new grid in a diagram
function initializeGrid() {

  // Get the container element where the grid will be displayed
  const container = document.getElementById('grid-container');

  // Set the CSS grid template rows and columns based on the grid size
  container.style.gridTemplateRows = `repeat(${gridSize.rows}, 1fr)`;
  container.style.gridTemplateColumns = `repeat(${gridSize.cols}, 1fr)`;

  // Clears any existing content in the container
  container.innerHTML = '';
  
  // Creates an array to hold data like rows and columns starting off with null values
  // as we have not put anything inside yet when first initialized
  gridData = Array(gridSize.rows * gridSize.cols).fill(null);
  
  // Loop through the number of cells needed for the grid
  for (let i = 0; i < gridSize.rows * gridSize.cols; i++) {
    const cell = document.createElement('div'); // Creates a new div for each cell in the grid
    cell.className = 'grid-cell'; // assignes class name
    cell.dataset.index = i; // Sets data attribute to store index

    // Event listerners for interactions
    cell.addEventListener('dragover', handleDragOver); // handles dragging over
    cell.addEventListener('drop', handleDrop); // handles drop
    cell.addEventListener('dblclick', () => openEditor(cell)); // Handles box editing
    container.appendChild(cell); // Append cell
  }
}

// Function used when an element is dragged over a grid cell
function handleDragOver(event) {
  event.preventDefault(); // Allows drop Action
}

// This function is called when an element is dropped on a grid cell
function handleDrop(event) {
  event.preventDefault(); // Ensures drop is handled properly

  // Gets Cell where drop happened  and retrieves index for customization
  const cell = event.target; 
  const cellIndex = cell.dataset.index;
  
  // When User Decides for a box
  if (draggedElement === 'box') {

    // Creates TextArea element as specified in the Brief
    const box = document.createElement('textarea'); 
    box.className = 'box';
    box.value = "Box"; // Default content
    box.setAttribute("readonly", true); // Makes sure people cannot edit without doubke clicking

    // Clears any exisiting content and adds the box
    cell.innerHTML = '';
    cell.appendChild(box);
    gridData[cellIndex] = { type: 'box', content: "Box" };

  } 
  
  // When user wants an arrow
  else if (draggedElement === 'arrow') {

    // Creates div element for arrow
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    arrow.textContent = '→'; // Sets default Symbol
    arrow.dataset.direction = 'right'; // Default Direction
    arrow.draggable = true;

    // Clears any exisiting content and adds the arrow
    cell.innerHTML = '';
    cell.appendChild(arrow);
    gridData[cellIndex] = { type: 'arrow', direction: 'right' };

    // Add event listeners for arrow dragging
    arrow.addEventListener('dragstart', handleArrowDragStart);
    arrow.addEventListener('dragend', handleArrowDragEnd);
  }

  draggedElement = null; // Resets drag element after drop for box or arrow 
}

// To edit the box on double click
function openEditor(cell) {

  // Gets cell data and index 
  const cellIndex = cell.dataset.index;
  const cellData = gridData[cellIndex];
  
  // Checks if the cell first contains a box
  if (cellData?.type === 'box') {

    const textarea = cell.querySelector('textarea'); // Select the textarea element inside the cell
    
    // If text area exists
    if (textarea) {

      // Removes read only to edit the box
      textarea.removeAttribute('readonly');
      textarea.focus();
      
      // Event listerner for blur event to save the changes and close the box
      // from further editing when user clicks away

      // The blur() method removes focus from an HTML element which basically deselects it.
      textarea.addEventListener('blur', () => {
        cellData.content = textarea.value;
        textarea.setAttribute('readonly', true);
      });
      

      // When Users press enter it does the same thing as well
      textarea.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          cellData.content = textarea.value;
          textarea.setAttribute('readonly', true);
          textarea.blur(); // removes focus
        }
      });
    }
  }
}

// This part is about rotating the arrow which was the hardest part
// Wait until the DOM is fully loaded before executing the code
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('grid-container'); // Get the grid container element

  // Event listener to detect when an arrow is dragged out of the grid
  gridContainer.addEventListener('dragleave', (event) => {

    // Check if the event is triggered by a grid cell
    if (event.target.classList.contains('grid-cell')) {
      isArrowDraggedOut = true; // Indicate the arrow has been dragged out
    }

  });

  // Event listener to detect when an arrow is dragged back into the grid
  gridContainer.addEventListener('dragenter', (event) => {

    // Check if the arrow was previously dragged out
    if (isArrowDraggedOut) {
      handleArrowReEntry(event); // Call function to handle re-entry logic
      isArrowDraggedOut = false; // Reset the flag
    }
  });
});

// Function to handle the start of an arrow drag
function handleArrowDragStart(event) {
  // Check if the target element is an arrow
  if (event.target.classList.contains('arrow')) {
    draggedArrow = event.target; // Set the draggedArrow to the current arrow being dragged
    initialMousePosition = { x: event.clientX, y: event.clientY }; // Store the initial mouse position
    event.stopPropagation(); // Stop event from propagating further
  }
}

// Function to handle the end of an arrow drag
function handleArrowDragEnd(event) {
  console.log("Drag ended");

  // Check if the arrow was dragged out of the grid
  if (isArrowDraggedOut) {

    // Determine the direction of rotation based on initial and final mouse positions
    if (initialMousePosition.x < event.clientX) {

      // If the mouse moved right during drag, rotate clockwise
      rotateArrow(draggedArrow.parentElement, 'clockwise');
      
    } else if (initialMousePosition.x > event.clientX) {

      // If the mouse moved left during drag, rotate anticlockwise
      rotateArrow(draggedArrow.parentElement, 'anticlockwise');

    }
  }

  // Reset the state of the dragged arrow and initial position after the drag ends
  draggedArrow = null;
  initialMousePosition = null;

}

// Function to rotate the arrow  in the specified direction
function rotateArrow(cell, direction) {

  const arrow = cell.querySelector('.arrow'); // Find the arrow in the given cell
  if (!arrow) return; // Exit if no arrow found

  // Array representing possible arrow directions
  const directions = ['right', 'down', 'left', 'up'];

  // Gets the current direction of the arrow
  const currentDirection = directions.indexOf(arrow.dataset.direction);

  // Calculates the new direction index based on clockwise or anticlockwise rotation
  // Operator adds 1 if it is clockwise and -1 if anti clockwise, adding 4 ensures result is always positive
  // modulo 4 wraps index if it goes out of bounds etc out of 4
  const newDirectionIndex = (currentDirection + (direction === 'clockwise' ? 1 : -1) + 4) % 4;
  const newDirection = directions[newDirectionIndex]; // Determine the new direction

  // Update the arrow
  arrow.dataset.direction = newDirection;
  arrow.textContent =
    newDirection === 'right' ? '→' :
    newDirection === 'down' ? '↓' :
    newDirection === 'left' ? '←' : '↑';

}

// Async Function to save the diagram in Firebase
async function saveDiagram() {
  try {

    // Creates an object to hold the current grid size and grid data
    const diagramData = { gridSize, gridData };

    // Use Firestore's addDoc function to add the diagramData object to the diagrams collection in the database
    const docRef = await addDoc(collection(db, 'diagrams'), diagramData);
    alert('Diagram saved successfully!');
  } 

  // Error Catching
  catch (error) {
    alert('Failed to save diagram.');
  }
}

// Async function to load and display saved diagrams from the database
// Have to use Async function since it interacys with firestore
async function loadDiagram() {
  try {

    // Fetches all documents from the database and maps them with their data and IDs
    const querySnapshot = await getDocs(collection(db, 'diagrams'));
    const diagrams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // If there are no diagrams alert the user that it is empty
    if (diagrams.length === 0) {
      alert('No saved diagrams found.');
      return;
    }
    
    // Gets the list of diagrams that will be displayed
    const listContainer = document.getElementById('diagram-list');
    listContainer.innerHTML = ''; // CLear existing content in container
    
    // Iterates over each diagram and creates button when found
    diagrams.forEach((diagram, index) => {
      const listItem = document.createElement('button'); // Creates a new button
      listItem.textContent = `Diagram ${index + 1}`; // Sets button name

      // Click event listerner when selecting diagram
      listItem.addEventListener('click', () => loadSelectedDiagram(diagram)); 
      listContainer.appendChild(listItem); // Appends button
    });
    
    // Hides Start screen and shows load screen
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('load-screen').style.display = 'block';

  } 
  
  catch (error) {

    alert('Failed to load diagrams.');

  }

}

// Function to load the diagram you selected
function loadSelectedDiagram(diagram) {

  // Assigns the grid size and data
  gridSize = diagram.gridSize;
  gridData = diagram.gridData;

  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('editor-screen').style.display = 'block';

  // Calls renderGridFromData(); to load in the data from firebase
  renderGridFromData();
}

// Function to render the grid based on the data from gridData
function renderGridFromData() {

  const container = document.getElementById('grid-container');

  // Set the grid template rows and columns based on the gridSize
  container.style.gridTemplateRows = `repeat(${gridSize.rows}, 150px)`; 
  container.style.gridTemplateColumns = `repeat(${gridSize.cols}, 150px)`;
  container.innerHTML = ''; // Clear the container

  // Iterate over the gridData array to populate the grid with cells and their contents
  gridData.forEach((data, index) => {

    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Assign the 'grid-cell' class for styling
    cell.dataset.index = index; // Set a data attribute for cell indexing

    if (data) {
      
      // Checks if data type is a box
      if (data.type === 'box') {

        const box = document.createElement('textarea');
        box.className = 'box';
        box.value = data.content;
        box.setAttribute("readonly", true);
        cell.appendChild(box);

      } 
      
      else if (data.type === 'arrow') {

        const arrow = document.createElement('div');
        arrow.className = 'arrow';
        arrow.textContent = data.direction === 'left' ? '←' : 
                            data.direction === 'right' ? '→' : 
                            data.direction === 'up' ? '↑' : '↓'; // Set the arrow direction symbol

        arrow.dataset.direction = data.direction; // Set the arrow direction symbol
        arrow.draggable = true; // Allows dragging
        cell.appendChild(arrow);

        // Add event listeners for arrow dragging
        arrow.addEventListener('dragstart', handleArrowDragStart);
        arrow.addEventListener('dragend', handleArrowDragEnd);
      }
    }

    // Add event listeners for other cell interactions
    cell.addEventListener('dragover', handleDragOver);
    cell.addEventListener('drop', handleDrop);
    cell.addEventListener('dblclick', () => openEditor(cell));

    container.appendChild(cell);

  });

}

// Returns to starting menu by only showing start screen
function returnToStart() {
  document.getElementById('editor-screen').style.display = 'none';
  document.getElementById('load-screen').style.display = 'none';
  document.getElementById('start-screen').style.display = 'block';
}
