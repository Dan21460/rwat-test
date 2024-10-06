// Daniel Wu C21460524

document.addEventListener('DOMContentLoaded', function () {

    // DOM elements
    const startScreen = document.getElementById('start-screen');
    const gameSettings = document.getElementById('game-settings');
    const gameBoard = document.getElementById('game-board');
    const saveGameButton = document.getElementById('save-game');
    const startNewGameButton = document.getElementById('start-new-game');
    const continueGameButton = document.getElementById('continue-game');
    const startGameButton = document.getElementById('start-game');
    const tiles = Array.from(document.querySelectorAll('.tile'));  // Get all tile elements as an array
    let emptyTileIndex = 8;  // Sets the initial position of the empty tile 

    // Checks to see if there is a saved game
    if (localStorage.getItem('savedGameState')) {

        continueGameButton.style.display = 'inline-block';

    }

    // Event listener for starting a new game
    startNewGameButton.addEventListener('click', function () {

        startScreen.style.display = 'none';
        gameSettings.style.display = 'block';  // Show the Difficulty level selection screen

    });

    // Event listener for continuing a saved game
    continueGameButton.addEventListener('click', function () {

        const savedGameState = JSON.parse(localStorage.getItem('savedGameState'));  // Load saved game state from localStorage
        loadGame(savedGameState);  // Load the game with the saved state

    });

    // Event listener for starting the game with a selected Difficulty level
    startGameButton.addEventListener('click', function () {

        const Difficulty = document.getElementById('Difficulty').value;  // Get the selected Difficulty value
        startGame(Difficulty);  

    });

    // Event listener for saving the current game state
    saveGameButton.addEventListener('click', function () {

        saveGame();  // Save the current game state to localStorage

    });

    // Function to save the current game state to localStorage
    function saveGame() {

        const gameState = [];  // Initialize an array to store the game state
        tiles.forEach(tile => {
            const backgroundImage = tile.style.backgroundImage;  // Get the background image of each tile
            if (backgroundImage) {

                const tileImage = backgroundImage.match(/p\d\.png/)[0];  // Extracting the image
                gameState.push(tileImage);  // Add the image name to the gameState array

            }

            else {

                gameState.push('empty');  // If the tile is empty, add 'empty' to the gameState array

            }
        });
        localStorage.setItem('savedGameState', JSON.stringify(gameState));  // Save the gameState array to localStorage
        alert('Game Saved!');  // Show a confirmation alert that the game has been save

    }

    // Function to load a saved game
    function loadGame(savedGameState) {

        tiles.forEach((tile, index) => {

            const tileImage = savedGameState[index];  // Get the saved image for each tile

            if (tileImage !== 'empty') {

                tile.style.backgroundImage = `url('images_lab2/${tileImage}')`;  // Set the background image of the tile

                tile.classList.remove('empty-tile');  // Remove the empty-tile class if the tile is not empty

            }

            else {

                tile.style.backgroundImage = ''; 
                tile.classList.add('empty-tile');  
                emptyTileIndex = index;  

            }

        });

        startScreen.style.display = 'none';  
        gameBoard.style.display = 'flex';  
        saveGameButton.style.display = 'inline-block';  

    }

    // Function to start a new game
    function startGame(Difficulty) {

        gameSettings.style.display = 'none'; 
        gameBoard.style.display = 'flex';  
        saveGameButton.style.display = 'inline-block';  
        // Set the initial tile images
        tiles.forEach((tile, index) => {
            if (index < 8) {

                tile.style.backgroundImage = `url('images_lab2/p${index + 1}.png')`;
                tile.classList.remove('empty-tile');  // Remove empty-tile class for tiles with images

            }

            else {

                tile.style.backgroundImage = '';  // The 9th tile is empty, so no background image
                tile.classList.add('empty-tile');  
                emptyTileIndex = index;  

            }

        });

        // Shuffle the tiles based on the chosen Difficulty
        shuffleTiles(Difficulty);
    }

    // Function to shuffle the tiles randomly based on the selected Difficulty
    function shuffleTiles(Difficulty) {

        for (let i = 0; i < Difficulty * 10; i++) {  
            const possibleMoves = getAdjacentTiles(emptyTileIndex);  // Get all possible moves for the empty tile
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];  // Picks a random move from the adjacent tiles
            swapTiles(emptyTileIndex, randomMove);  
        }
    }

    // Function to get the indices of the tiles adjacent to the empty tile
    function getAdjacentTiles(emptyIndex) {
        const adjacentMoves = [];  
        const row = Math.floor(emptyIndex / 3);  // Calculate the row of the empty tile
        const col = emptyIndex % 3;  // Calculate the column of the empty tile

        // Checks for tiles
        if (row > 0) adjacentMoves.push(emptyIndex - 3);  // If there's a tile above
        if (row < 2) adjacentMoves.push(emptyIndex + 3);  // If there's a tile below
        if (col > 0) adjacentMoves.push(emptyIndex - 1);  // If there's a tile to the left
        if (col < 2) adjacentMoves.push(emptyIndex + 1);  // If there's a tile to the right

        return adjacentMoves;  // Return the array of possible adjacent tiles
    }

    // Set up drag and drop event handlers for tiles
    tiles.forEach((tile, index) => {
        tile.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', index);  // Store the index of the dragged tile
        });

        tile.addEventListener('dragover', function (e) {
            e.preventDefault();  // Allow dropping by preventing the default behavior
        });

        tile.addEventListener('drop', function (e) {
            const draggedTileIndex = parseInt(e.dataTransfer.getData('text/plain'));  // Get the index of the dragged tile (as an integer)
            const possibleMoves = getAdjacentTiles(emptyTileIndex);  // Get the adjacent tiles of the empty tile

            if (possibleMoves.includes(draggedTileIndex)) {  // Check if the dragged tile is adjacent to the empty tile

                swapTiles(emptyTileIndex, draggedTileIndex);  
                if (checkIfSolved()) {  
                    completeGame();  
                }

            }

        });

    });

    // Function to swap two tiles 
    function swapTiles(emptyIndex, targetIndex) {
        const emptyTile = tiles[emptyIndex];
        const targetTile = tiles[targetIndex];

        const targetImage = targetTile.style.backgroundImage;
        // Swapping the tiles
        targetTile.style.backgroundImage = emptyTile.style.backgroundImage;  // Set the target tile's background to the empty tile's background
        emptyTile.style.backgroundImage = targetImage;  // Set the empty tile's background to the target tile's background

        targetTile.classList.toggle('empty-tile');
        emptyTile.classList.toggle('empty-tile');
        emptyTileIndex = targetIndex;  // Update the index of the empty tile to the new position

    }

    // Function to check if the puzzle is solved
    function checkIfSolved() {
        for (let i = 0; i < 8; i++) {
            const tileImage = tiles[i].style.backgroundImage;
            if (!tileImage.includes(`p${i + 1}.png`)) {  // If any tile is not in its correct position, return false
                return false;
            }
        }
        return true;  // If all tiles are in the correct position, return true

    }

    // Function to complete the game when solved
    function completeGame() {
        const emptyTile = tiles[8];  
        emptyTile.style.backgroundImage = "url('images_lab2/p9.png')"; 
        emptyTile.classList.remove('empty-tile');  
        alert('Congratulations! You solved the puzzle!');  

    }

});
