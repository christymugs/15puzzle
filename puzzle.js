document.addEventListener("DOMContentLoaded", function() {
    const puzzleContainer = document.getElementById("puzzle-container");
    const playGameBtn = document.getElementById("play-game-btn");
    const shuffleBtn = document.getElementById("shuffle-btn");
    const giveUpBtn = document.getElementById("give-up-btn");
    const puzzleSizeSelect = document.getElementById("puzzle-size");
    const buttonContainer = document.getElementById("button-container");
    const moveCountElement = document.getElementById("moveCount");
    const bgMusic = document.getElementById("bgMusic");
    const imageUrl = 'images/background.png';

    document.body.style.backgroundImage = `url('${imageUrl}')`;

    let puzzleSize = 4;
    let tiles = [];
    let emptyIndex = puzzleSize * puzzleSize - 1;
    let moveCount = 0;
    let timer;
    let startTime;

    const displayResults = () => {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        alert(`Congratulations! You finished the puzzle in ${elapsedTime} seconds and ${moveCount} moves.`);
    };

    function changePuzzleSize() {
        puzzleSize = parseInt(puzzleSizeSelect.value, 10);
        emptyIndex = puzzleSize * puzzleSize - 1;
        createTiles();
    }

    function shuffleArray(array) {
        for (let i = array.length - 2; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function isSolvable(arr) {
        let inversionCount = 0;

        for (let i = 0; i < puzzleSize * puzzleSize - 1; i++) {
            for (let j = i + 1; j < puzzleSize * puzzleSize; j++) {
                if (arr[j] && arr[i] && arr[i] > arr[j]) {
                    inversionCount++;
                }
            }
        }

        return inversionCount % 2 === 0;
    }

    function createTiles() {
        do {
            tiles = Array.from({ length: puzzleSize * puzzleSize }, (_, i) => i);
            shuffleArray(tiles);
        } while (!isSolvable(tiles));

        updateTiles();

        buttonContainer.style.display = "block";
        shuffleBtn.style.display = "inline-block";
        giveUpBtn.style.display = "inline-block"; 
        startTimer();
    }

    function handleTileClick(index) {
        if (isMovable(index)) {
            tiles[emptyIndex] = tiles[index];
            tiles[index] = puzzleSize * puzzleSize - 1;
            emptyIndex = index;
            moveCount++;
            updateTiles();

            if (checkWin()) {
                stopTimer();
                displayResults();
            }
        }
    }

    function isMovable(index) {
        const row = Math.floor(index / puzzleSize);
        const emptyRow = Math.floor(emptyIndex / puzzleSize);
        const isAdjacentRow = row === emptyRow &&
            Math.abs(index - emptyIndex) === 1;
        const isAdjacentColumn =
            Math.abs(row - emptyRow) === 1 &&
            index % puzzleSize === emptyIndex % puzzleSize;
        return isAdjacentRow || isAdjacentColumn;
    }

    function updateTiles() {
        puzzleContainer.innerHTML = "";

        for (let i = 0; i < tiles.length; i++) {
            const tileIndex = tiles[i];
            const tile = document.createElement("div");
            tile.classList.add("tile");


            if (tileIndex === puzzleSize * puzzleSize - 1) {
                tile.classList.add("empty");
            } else {
                const image = document.createElement("img");
                image.src = getImagePath(tileIndex + 1, puzzleSize);
                tile.appendChild(image);
            }

            tile.addEventListener("click", () => handleTileClick(i));

            if (tileIndex === i) {
                tile.classList.add("in-right-area");
            }

            puzzleContainer.appendChild(tile);
        }

        puzzleContainer.style.gridTemplateColumns =
            `repeat(${puzzleSize}, 1fr)`;
        moveCountElement.textContent = `Moves: ${moveCount}`;
    }

    function getImagePath(number, size) {
        return `images/${size}x${size}/${number}.jpg`;
    }

    function startTimer() {
        startTime = new Date().getTime();
        timer = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        document.getElementById("timer").textContent =
            `Time: ${elapsedTime} seconds`;
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function checkWin() {
        for (let i = 0; i < tiles.length - 1; i++) {
            if (tiles[i] !== i) {
                return false;
            }
        }
        return true;
    }

    function shuffleTiles() {
        if (!startTime) {

            startTimer();
        }

        const tilesWithoutEmpty =
            tiles.filter(tile => tile !== puzzleSize * puzzleSize - 1);
        shuffleArray(tilesWithoutEmpty);

        let index = 0;
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i] !== puzzleSize * puzzleSize - 1) {
                tiles[i] = tilesWithoutEmpty[index];
                index++;
            }
        }

        updateTiles();
    }

    function giveUp() {
 
        stopTimer();
    

        shuffleTiles();
    

        const sortedTiles = Array.from({ length: puzzleSize * puzzleSize }, (_, i) => i);
        emptyIndex = puzzleSize * puzzleSize - 1;
    
        tiles = sortedTiles.slice();
        updateTiles();
    

        const animateSolution = (index) => {
            if (index < tiles.length && !checkWin()) {
                shuffleTiles();
                updateTilesWithAnimation(index);
                setTimeout(() => animateSolution(index + 1), 500); 
            } else {
                displayResults();
            }
        };
   
        animateSolution(0);
    }
    
    function updateTilesWithAnimation(index) {
        const tileElements = document.querySelectorAll('.tile');
        const tileIndex = tiles[index];
        const tileElement = tileElements[index];
    
        tileElement.style.transition = 'transform 0.5s ease-in-out';
        tileElement.style.transform = `translate(${getCol(tileIndex) * 100}%, ${getRow(tileIndex) * 100}%)`;

        setTimeout(() => {
            tileElement.style.transition = '';
        }, 500);
    }
    
    function getRow(index) {
        return Math.floor(index / puzzleSize);
    }
    
    function getCol(index) {
        return index % puzzleSize;
    }
    
    
    
    playGameBtn.addEventListener("click", function() {
        createTiles();
        bgMusic.play();
        buttonContainer.style.display = "none";
        shuffleBtn.style.display = "inline-block";
        giveUpBtn.style.display = "inline-block"; 
    });

    shuffleBtn.addEventListener("click", shuffleTiles);
    giveUpBtn.addEventListener("click", giveUp); 
    puzzleSizeSelect.addEventListener("change", changePuzzleSize);
});

document.getElementById("bgMusic").addEventListener("ended", function() {
    this.currentTime = 0;
    this.play();
}, false);
