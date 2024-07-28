function knightsBoard() {
  const adjacencyList = {}; //adjacency list of all board-squares

  function getAdjacencyList() {
    return adjacencyList;
  }

  //adds square [x, y] as key to adjacency list
  function addSquare(x, y) {
    adjacencyList[[x, y]] = [];
    return [x, y];
  }

  //adds an edging-square to the specific start-square
  function addEdge(square1, square2) {
    adjacencyList[square1].push(square2);
  }

  //adds all possible edging-squares (moves) to one specific start-square [x, y]
  function knightMoves(x, y, n) {
    // n = 8
    let square = addSquare(x, y);

    if (x + 2 < n && y + 1 < n) {
      addEdge(square, [x + 2, y + 1]);
    }
    if (x - 2 >= 0 && y + 1 < n) {
      addEdge(square, [x - 2, y + 1]);
    }
    if (x + 2 < n && y - 1 >= 0) {
      addEdge(square, [x + 2, y - 1]);
    }
    if (x - 2 >= 0 && y - 1 >= 0) {
      addEdge(square, [x - 2, y - 1]);
    }
    if (x + 1 < n && y + 2 < n) {
      addEdge(square, [x + 1, y + 2]);
    }
    if (x + 1 < n && y - 2 >= 0) {
      addEdge(square, [x + 1, y - 2]);
    }
    if (x - 1 >= 0 && y + 2 < n) {
      addEdge(square, [x - 1, y + 2]);
    }
    if (x - 1 >= 0 && y - 2 >= 0) {
      addEdge(square, [x - 1, y - 2]);
    }
  }

  // fills list with all possible knight move combinations for each square on the board (recursively)
  function allKnightMoves(x, y, n) {
    // base case - if square already visited
    if (!adjacencyList[[x, y]]) {
      //depth-first traversal
      knightMoves(x, y, n);
      adjacencyList[[x, y]].forEach((item) => {
        allKnightMoves(item[0], item[1], n);
      });
    }
  }

  function shortestPath(startXY, targetXY, n) {
    allKnightMoves(0, 0, n); //creates graph representing connections for all board squares (adjacency list)

    let searchQueue = [startXY]; // array that will be used to explore the graph. // [[0,0]]
    let visitedSquares = { [startXY]: true }; //object (hash-like) to keep track of visited nodes to avoid revisiting them. // { 0,0: true}
    let predecessorSquares = {}; // object to keep track of each node's predecessor (each node one predecessor)

    // Breadth-First Search (BFS) loop continues until all nodes in queue are processed
    while (searchQueue.length > 0) {
      let currentSquare = searchQueue.shift(); // dequeue first node and return it for unpacking (its adjacencies)
      let currentSquareAdjacencyList = adjacencyList[currentSquare];

      for (let item of currentSquareAdjacencyList) {
        // this loop shows all possible paths, not just the first shortest one (due to callback in forEach)
        //    currentSquareAdjacencyList.forEach((item) => {
        // check if square already been visited, if not then continue further down the loop
        if (!visitedSquares[item]) {
          //if item is the target, then the path is found and we can start reconstructing it
          if (item[0] == targetXY[0] && item[1] == targetXY[1]) {
            let path = [item]; //initialize path with target-node
            while (
              currentSquare[0] !== startXY[0] ||
              currentSquare[1] !== startXY[1]
            ) {
              path.push(currentSquare);
              currentSquare = predecessorSquares[currentSquare]; //backtrack though predecessor object to build path from target to source
            }
            path.push(currentSquare); // push source square as final element
            path.reverse();
            console.log(path.join(" → ")); // '.join' returns array as a string
            console.log(`It took ${path.length - 1} steps`);
            return;
          }
          //add item to queue, mark as checked and set its predecessor
          searchQueue.push(item);
          visitedSquares[item] = true;
          predecessorSquares[item] = currentSquare;
        }
        //      });
      }
    }
    //If the loop completes without finding the target, print that no path exists
    // console.log("there is no path from " + startXY + " to " + targetXY);
  }

  //All possible knight moves between two squares...
  function possibleKnightMoves(xStart, yStart, xEnd, yEnd, n) {
    //start [0,0]   //end [0,2]
    allKnightMoves(xStart, yStart, n); //populates list with all moves
    let numberOfMoves = 0; //start at 0

    let startSquare = adjacencyList[[xStart, yStart]];
    let finalList = []; //store all processed squared
    let searchQueue = []; // e.g., start [0,0]: [[1,2], [2,1]...]

    startSquare.forEach((item) => {
      searchQueue.push(item); // enqueue each possible moveSquare from the list
    });

    let checkedSquares = {}; //store already checked & enqueued squares (no search)
    checkedSquares[[xStart, yStart]] = "checked"; // its items already enqueued { [0,0]: checked
    //                                                                            [1,2]: checked }
    while (searchQueue.length > 0) {
      let currentSquare = searchQueue.shift(); //next square in line e.g, [1,2], then [2,1]
      numberOfMoves++;

      //if next in line is the target square
      if (currentSquare[0] == xEnd && currentSquare[1] == yEnd) {
        return Math.round(numberOfMoves / 2);
      }

      finalList.push(currentSquare); //[[1,2] ...], then [[1,2], [2,1] ...]

      if (!checkedSquares[currentSquare]) {
        // if not a key yet in checked list
        adjacencyList[currentSquare].forEach((item) => {
          // [1,2]: [[0,0], [0,4], [2,0], [2,4], [3,1], [3,3]] ... then [2,1]: [[] x 6]
          if (!checkedSquares[[item[0], item[1]]]) {
            //if not a key yet in checked list
            searchQueue.push(item);
          }
        });
        //store as check current (parent) square once its items are enqueued
        checkedSquares[currentSquare] = "checked";
      }
    }
  }

  return {
    adjacencyList,
    getAdjacencyList,
    addSquare,
    addEdge,
    knightMoves,
    allKnightMoves,
    possibleKnightMoves,
    shortestPath,
  };
}

// TEST

const board = knightsBoard();
console.log(board);

board.shortestPath([0, 0], [0, 2], 8);

// board.shortestPath([0, 0], [3, 3], 8);
// board.shortestPath([3, 3], [0, 0], 8);
// board.shortestPath([0, 0], [7, 7], 8);

// const possibleKnightMoves = board.possibleKnightMoves(0, 0, 2, 0, 8);
// console.log("Number of Knight moves: ", possibleKnightMoves);

// board.knightMoves(0, 0, 8);
// board.knightMoves(0, 1, 8);
// board.knightMoves(0, 2, 8);
// board.knightMoves(2, 1, 8);

// board.addSquare(0, 0);
// board.addEdge([0, 0], [1, 2]);
// board.addEdge([0, 0], [2, 1]);
// board.addSquare(1, 0);

// console.log(board.adjacencyList[[0, 0]]);
