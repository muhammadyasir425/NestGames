/* =========================================
   GAMENEST
   Games + Tools
========================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


/* =========================================
   BASIC WEBSITE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  $("#year").textContent = new Date().getFullYear();


  /* MOBILE MENU */

  $("#menuBtn").addEventListener("click", () => {
    $("#navMenu").classList.toggle("open");
  });


  $$("#navMenu a").forEach(link => {

    link.addEventListener("click", () => {
      $("#navMenu").classList.remove("open");
    });

  });


  /* GAME BUTTONS */

  $$(".card-link, .mini-btn").forEach(button => {

    button.addEventListener("click", () => {
      openGame(button.dataset.game);
    });

  });


  /* TOOL BUTTONS */

  $$(".tool-card button").forEach(button => {

    button.addEventListener("click", () => {
      openTool(button.dataset.tool);
    });

  });


  /* CLOSE BUTTONS */

  $$(".close").forEach(button => {

    button.addEventListener("click", () => {
      closeModal(button.dataset.close);
    });

  });


  /* CLICK OUTSIDE MODAL */

  $$(".modal").forEach(modal => {

    modal.addEventListener("click", event => {

      if (event.target === modal) {
        modal.classList.add("hidden");
      }

    });

  });


  /* ESCAPE */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

      $("#gameModal").classList.add("hidden");
      $("#toolModal").classList.add("hidden");

    }

  });


  /* SEARCH */

  $("#searchInput").addEventListener("input", event => {

    const search = event.target.value
      .toLowerCase()
      .trim();

    $$(".game-card, .tool-card").forEach(card => {

      const text =
        card.textContent.toLowerCase() +
        " " +
        (card.dataset.search || "").toLowerCase();

      if (text.includes(search)) {

        card.style.display = "";

      } else {

        card.style.display = "none";

      }

    });

  });


  /* CONTACT */

  $("#contactForm").addEventListener("submit", event => {

    event.preventDefault();

    $("#formMessage").textContent =
      "Message received! This frontend form is ready for backend/email integration.";

    event.target.reset();

  });

});


/* =========================================
   MODALS
========================================= */

function openGame(game) {

  $("#gameModal").classList.remove("hidden");

  const content = $("#gameContent");

  if (game === "tictactoe") {
    ticTacToe(content);
  }

  if (game === "snake") {
    snakeGame(content);
  }

  if (game === "rps") {
    rockPaperScissors(content);
  }

  if (game === "memory") {
    memoryGame(content);
  }

  if (game === "2048") {
    game2048(content);
  }

}


function openTool(tool) {

  $("#toolModal").classList.remove("hidden");

  const content = $("#toolContent");

  if (tool === "calculator") calculator(content);

  if (tool === "percentage") percentage(content);

  if (tool === "age") ageCalculator(content);

  if (tool === "qr") qrGenerator(content);

  if (tool === "password") passwordGenerator(content);

  if (tool === "wordcount") wordCounter(content);

  if (tool === "units") unitConverter(content);

  if (tool === "random") randomNumber(content);

  if (tool === "color") colorPicker(content);

  if (tool === "image") imageCompressor(content);

}


function closeModal(id) {

  $("#" + id).classList.add("hidden");

}


/* =========================================
   TIC TAC TOE
========================================= */

function ticTacToe(box) {

  box.innerHTML = `

    <div class="game-center">

      <div class="badge">CLASSIC</div>

      <h2>Tic Tac Toe</h2>

      <p class="modal-sub">
        Play against the computer or a friend.
      </p>

      <div class="game-controls">

        <select id="tttMode" class="select">

          <option value="ai">
            Vs Computer
          </option>

          <option value="friend">
            2 Players
          </option>

        </select>


        <select id="tttDifficulty" class="select">

          <option value="easy">
            Easy
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="hard">
            Hard
          </option>

        </select>

      </div>


      <div class="ttt-board" id="tttBoard"></div>

      <p class="game-status" id="tttStatus"></p>

      <button class="small-btn" id="tttReset">
        New Game
      </button>

    </div>

  `;


  const boardElement = $("#tttBoard");

  const status = $("#tttStatus");

  const mode = $("#tttMode");

  const difficulty = $("#tttDifficulty");


  let board = Array(9).fill("");

  let currentPlayer = "X";

  let gameOver = false;


  const wins = [

    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]

  ];


  function checkWinner(testBoard = board) {

    for (const combo of wins) {

      const [a,b,c] = combo;

      if (
        testBoard[a] &&
        testBoard[a] === testBoard[b] &&
        testBoard[b] === testBoard[c]
      ) {

        return testBoard[a];

      }

    }


    if (testBoard.every(Boolean)) {

      return "draw";

    }


    return null;

  }


  function render() {

    boardElement.innerHTML = board.map(
      (value, index) => `

        <button
          class="ttt-cell ${value.toLowerCase()}"
          data-index="${index}"
        >
          ${value}
        </button>

      `
    ).join("");


    $$(".ttt-cell", boardElement).forEach(cell => {

      cell.addEventListener("click", () => {

        makeMove(Number(cell.dataset.index));

      });

    });


    const result = checkWinner();


    if (result) {

      if (result === "draw") {

        status.textContent = "It's a draw!";

      } else {

        status.textContent =
          `${result} wins!`;

      }

    } else {

      status.textContent =
        `${currentPlayer}'s turn`;

    }

  }


  function makeMove(index) {

    if (
      gameOver ||
      board[index]
    ) {
      return;
    }


    board[index] = currentPlayer;


    const result = checkWinner();


    if (result) {

      gameOver = true;

      render();

      return;

    }


    currentPlayer =
      currentPlayer === "X"
        ? "O"
        : "X";


    render();


    if (
      mode.value === "ai" &&
      currentPlayer === "O"
    ) {

      setTimeout(computerMove, 250);

    }

  }


  function computerMove() {

    if (gameOver) {
      return;
    }


    let empty =
      board
        .map((value,index) =>
          value ? null : index
        )
        .filter(index => index !== null);


    let move;


    if (difficulty.value === "hard") {

      move = bestMove();

    }

    else if (
      difficulty.value === "medium"
    ) {

      move =
        findWinningMove("O") ??
        findWinningMove("X");


      if (
        move === null ||
        move === undefined
      ) {

        if (!board[4]) {

          move = 4;

        } else {

          move =
            empty[
              Math.floor(
                Math.random() * empty.length
              )
            ];

        }

      }

    }

    else {

      move =
        empty[
          Math.floor(
            Math.random() * empty.length
          )
        ];

    }


    makeMove(move);

  }


  function findWinningMove(player) {

    for (
      const index of board
        .map((value,index) =>
          value ? null : index
        )
        .filter(index => index !== null)
    ) {

      board[index] = player;

      const result =
        checkWinner();

      board[index] = "";

      if (result === player) {

        return index;

      }

    }

    return null;

  }


  function bestMove() {

    let bestScore = -Infinity;

    let move = null;


    for (
      const index of board
        .map((value,index) =>
          value ? null : index
        )
        .filter(index => index !== null)
    ) {

      board[index] = "O";

      const score =
        minimax(board, false);

      board[index] = "";


      if (score > bestScore) {

        bestScore = score;

        move = index;

      }

    }


    return move;

  }


  function minimax(testBoard, maximizing) {

    const result =
      checkWinner(testBoard);


    if (result === "O") {
      return 10;
    }

    if (result === "X") {
      return -10;
    }

    if (result === "draw") {
      return 0;
    }


    const empty =
      testBoard
        .map((value,index) =>
          value ? null : index
        )
        .filter(index => index !== null);


    if (maximizing) {

      let best = -Infinity;


      for (const index of empty) {

        testBoard[index] = "O";

        best = Math.max(
          best,
          minimax(testBoard,false)
        );

        testBoard[index] = "";

      }

      return best;

    }


    let best = Infinity;


    for (const index of empty) {

      testBoard[index] = "X";

      best = Math.min(
        best,
        minimax(testBoard,true)
      );

      testBoard[index] = "";

    }


    return best;

  }


  function reset() {

    board = Array(9).fill("");

    currentPlayer = "X";

    gameOver = false;

    render();

  }


  mode.addEventListener(
    "change",
    () => {

      difficulty.disabled =
        mode.value === "friend";

      reset();

    }
  );


  difficulty.addEventListener(
    "change",
    reset
  );


  $("#tttReset").addEventListener(
    "click",
    reset
  );


  render();

}


/* =========================================
   ROCK PAPER SCISSORS
========================================= */

function rockPaperScissors(box) {

  box.innerHTML = `

    <div class="game-center">

      <div class="badge">
        VS COMPUTER
      </div>

      <h2>
        Rock Paper Scissors
      </h2>

      <p class="modal-sub">
        First player to reach 5 wins.
      </p>


      <div class="rps-buttons">

        <button
          class="rps-choice"
          data-choice="rock"
        >
          ✊
        </button>

        <button
          class="rps-choice"
          data-choice="paper"
        >
          ✋
        </button>

        <button
          class="rps-choice"
          data-choice="scissors"
        >
          ✌
        </button>

      </div>


      <p class="game-status" id="rpsStatus">
        Choose your move.
      </p>


      <div class="score-line">

        <span>
          You
          <strong id="youScore">0</strong>
        </span>

        <span>
          Computer
          <strong id="computerScore">0</strong>
        </span>

      </div>


      <br>

      <button
        class="small-btn"
        id="rpsReset"
      >
        Reset
      </button>

    </div>

  `;


  let you = 0;

  let computer = 0;


  const choices = [
    "rock",
    "paper",
    "scissors"
  ];


  $$(".rps-choice", box).forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (
          you >= 5 ||
          computer >= 5
        ) {
          return;
        }


        const user =
          button.dataset.choice;


        const ai =
          choices[
            Math.floor(
              Math.random() *
              choices.length
            )
          ];


        let message;


        if (user === ai) {

          message =
            `Tie! Both chose ${ai}.`;

        }

        else if (
          (
            user === "rock" &&
            ai === "scissors"
          ) ||
          (
            user === "paper" &&
            ai === "rock"
          ) ||
          (
            user === "scissors" &&
            ai === "paper"
          )
        ) {

          you++;

          message =
            `You win! Computer chose ${ai}.`;

        }

        else {

          computer++;

          message =
            `Computer wins! It chose ${ai}.`;

        }


        $("#youScore").textContent =
          you;

        $("#computerScore").textContent =
          computer;


        if (you === 5) {

          message =
            "🎉 You won the match!";

        }

        if (computer === 5) {

          message =
            "Computer won the match.";

        }


        $("#rpsStatus").textContent =
          message;

      }
    );

  });


  $("#rpsReset").addEventListener(
    "click",
    () => {

      you = 0;

      computer = 0;

      $("#youScore").textContent = "0";

      $("#computerScore").textContent = "0";

      $("#rpsStatus").textContent =
        "Choose your move.";

    }
  );

}


/* =========================================
   SNAKE
========================================= */

function snakeGame(box) {

  box.innerHTML = `

    <div class="game-center">

      <div class="badge">
        ARCADE
      </div>

      <h2>Snake</h2>

      <p class="modal-sub">
        Use arrow keys or the buttons.
      </p>


      <canvas
        id="snakeCanvas"
        class="snake-canvas"
        width="420"
        height="420"
      ></canvas>


      <p
        class="game-status"
        id="snakeStatus"
      >
        Press an arrow key to start.
      </p>


      <div class="mobile-controls">

        <button data-dir="up">
          ▲
        </button>

        <button data-dir="left">
          ◀
        </button>

        <button data-dir="down">
          ▼
        </button>

        <button data-dir="right">
          ▶
        </button>

      </div>


      <button
        class="small-btn"
        id="snakeReset"
      >
        New Game
      </button>

    </div>

  `;


  const canvas =
    $("#snakeCanvas");

  const ctx =
    canvas.getContext("2d");


  const grid = 21;

  const size =
    canvas.width / grid;


  let snake;

  let food;

  let direction;

  let nextDirection;

  let running = false;

  let timer = null;

  let score = 0;


  function createFood() {

    let position;


    do {

      position = {

        x: Math.floor(
          Math.random() * grid
        ),

        y: Math.floor(
          Math.random() * grid
        )

      };

    } while (
      snake.some(
        part =>
          part.x === position.x &&
          part.y === position.y
      )
    );


    return position;

  }


  function reset() {

    snake = [

      {x:10,y:10},
      {x:9,y:10},
      {x:8,y:10}

    ];


    direction = {
      x: 1,
      y: 0
    };


    nextDirection = {
      x: 1,
      y: 0
    };


    food = createFood();

    score = 0;

    running = false;

    clearInterval(timer);

    draw();


    $("#snakeStatus").textContent =
      "Press an arrow key to start.";

  }


  function start() {

    if (running) {
      return;
    }


    running = true;

    $("#snakeStatus").textContent =
      "Score: 0";


    timer =
      setInterval(
        update,
        105
      );

  }


  function setDirection(newDirection) {

    if (
      newDirection.x === -direction.x &&
      newDirection.y === -direction.y
    ) {
      return;
    }


    nextDirection =
      newDirection;


    start();

  }


  function update() {

    direction =
      nextDirection;


    const head = {

      x:
        snake[0].x +
        direction.x,

      y:
        snake[0].y +
        direction.y

    };


    const hitWall =
      head.x < 0 ||
      head.x >= grid ||
      head.y < 0 ||
      head.y >= grid;


    const hitSelf =
      snake.some(
        part =>
          part.x === head.x &&
          part.y === head.y
      );


    if (hitWall || hitSelf) {

      running = false;

      clearInterval(timer);

      $("#snakeStatus").textContent =
        `Game Over — Score: ${score}`;

      return;

    }


    snake.unshift(head);


    if (
      head.x === food.x &&
      head.y === food.y
    ) {

      score++;

      food = createFood();

      $("#snakeStatus").textContent =
        `Score: ${score}`;

    }

    else {

      snake.pop();

    }


    draw();

  }


  function draw() {

    ctx.fillStyle =
      "#07101a";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    /* food */

    ctx.fillStyle =
      "#ff9e43";

    ctx.beginPath();

    ctx.arc(
      food.x * size + size / 2,
      food.y * size + size / 2,
      size * .34,
      0,
      Math.PI * 2
    );

    ctx.fill();


    /* snake */

    snake.forEach(
      (part,index) => {

        ctx.fillStyle =
          index === 0
            ? "#a897ff"
            : "#5b8cff";


        ctx.fillRect(
          part.x * size + 1,
          part.y * size + 1,
          size - 2,
          size - 2
        );

      }
    );

  }


  document.onkeydown = event => {

    const keys = {

      ArrowUp: {
        x:0,
        y:-1
      },

      ArrowDown: {
        x:0,
        y:1
      },

      ArrowLeft: {
        x:-1,
        y:0
      },

      ArrowRight: {
        x:1,
        y:0
      }

    };


    if (keys[event.key]) {

      event.preventDefault();

      setDirection(
        keys[event.key]
      );

    }

  };


  $$(".mobile-controls button",box)
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const directions = {

            up: {
              x:0,
              y:-1
            },

            down: {
              x:0,
              y:1
            },

            left: {
              x:-1,
              y:0
            },

            right: {
              x:1,
              y:0
            }

          };


          setDirection(
            directions[
              button.dataset.dir
            ]
          );

        }
      );

    });


  $("#snakeReset").addEventListener(
    "click",
    reset
  );


  reset();

}


/* =========================================
   MEMORY GAME
========================================= */

function memoryGame(box) {

  const symbols = [
    "🍎",
    "🍋",
    "🍇",
    "🍉",
    "🥝",
    "🍒",
    "🥕",
    "🌽"
  ];


  let cards =
    [...symbols,...symbols]
      .sort(() => Math.random() - .5);


  let opened = [];

  let matched = 0;

  let moves = 0;

  let locked = false;


  box.innerHTML = `

    <div class="game-center">

      <div class="badge">
        MEMORY
      </div>

      <h2>Memory Match</h2>

      <p class="modal-sub">
        Find all eight pairs.
      </p>


      <p
        class="game-status"
        id="memoryInfo"
      >
        Moves: 0 • Pairs: 0/8
      </p>


      <div
        class="memory-grid"
        id="memoryGrid"
      ></div>


      <button
        class="small-btn"
        id="memoryReset"
      >
        Shuffle & Restart
      </button>

    </div>

  `;


  const grid =
    $("#memoryGrid");


  function render() {

    grid.innerHTML =
      cards.map(
        (card,index) => `

          <button
            class="memory-card
              ${
                opened.includes(index) ||
                card === null
                  ? "flipped"
                  : ""
              }"
            data-index="${index}"
          >
            ${card || "✓"}
          </button>

        `
      ).join("");


    $$(".memory-card",grid)
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            flipCard(
              Number(button.dataset.index)
            );

          }
        );

      });


    $("#memoryInfo").textContent =
      `Moves: ${moves} • Pairs: ${matched}/8`;

  }


  function flipCard(index) {

    if (
      locked ||
      opened.includes(index) ||
      cards[index] === null
    ) {
      return;
    }


    opened.push(index);

    render();


    if (opened.length === 2) {

      moves++;

      const first =
        opened[0];

      const second =
        opened[1];


      if (
        cards[first] ===
        cards[second]
      ) {

        cards[first] = null;

        cards[second] = null;

        matched++;

        opened = [];

        render();


        if (matched === 8) {

          $("#memoryInfo").textContent =
            `🎉 Complete in ${moves} moves!`;

        }

      }

      else {

        locked = true;


        setTimeout(
          () => {

            opened = [];

            locked = false;

            render();

          },
          700
        );

      }

    }

  }


  $("#memoryReset").addEventListener(
    "click",
    () => memoryGame(box)
  );


  render();

}


/* =========================================
   2048
========================================= */

function game2048(box) {

  let board =
    Array(16).fill(0);

  let score = 0;

  let finished = false;


  box.innerHTML = `

    <div class="game-center game2048">

      <div class="badge">
        PUZZLE
      </div>

      <h2>2048</h2>

      <p class="modal-sub">
        Use your arrow keys to combine numbers.
      </p>


      <p
        id="game2048Status"
        class="game-status"
      >
        Score: 0
      </p>


      <div
        class="grid2048"
        id="game2048Grid"
      ></div>


      <button
        class="small-btn"
        id="game2048Reset"
      >
        New Game
      </button>

    </div>

  `;


  const grid =
    $("#game2048Grid");


  function addTile() {

    const empty =
      board
        .map(
          (value,index) =>
            value ? null : index
        )
        .filter(
          index =>
            index !== null
        );


    if (!empty.length) {
      return;
    }


    const index =
      empty[
        Math.floor(
          Math.random() *
          empty.length
        )
      ];


    board[index] =
      Math.random() < .9
        ? 2
        : 4;

  }


  function render() {

    grid.innerHTML =
      board.map(
        value => `

          <div
            class="
              tile2048
              ${value ? "filled" : ""}
              ${value >= 2048 ? "big" : ""}
            "
          >
            ${value || ""}
          </div>

        `
      ).join("");


    $("#game2048Status").textContent =
      `Score: ${score}`;

  }


  function slide(line) {

    line =
      line.filter(Boolean);


    for (
      let i = 0;
      i < line.length - 1;
      i++
    ) {

      if (
        line[i] ===
        line[i+1]
      ) {

        line[i] *= 2;

        score +=
          line[i];

        line.splice(
          i + 1,
          1
        );

      }

    }


    while (
      line.length < 4
    ) {

      line.push(0);

    }


    return line;

  }


  function move(direction) {

    if (finished) {
      return;
    }


    const old =
      board.join(",");


    let lines = [];


    if (
      direction === "left" ||
      direction === "right"
    ) {

      for (
        let row = 0;
        row < 4;
        row++
      ) {

        let line =
          board.slice(
            row * 4,
            row * 4 + 4
          );


        if (
          direction === "right"
        ) {

          line.reverse();

        }


        line = slide(line);


        if (
          direction === "right"
        ) {

          line.reverse();

        }


        lines.push(line);

      }

    }


    else {

      for (
        let col = 0;
        col < 4;
        col++
      ) {

        let line = [

          board[col],
          board[col+4],
          board[col+8],
          board[col+12]

        ];


        if (
          direction === "down"
        ) {

          line.reverse();

        }


        line = slide(line);


        if (
          direction === "down"
        ) {

          line.reverse();

        }


        lines.push(line);

      }

    }


    if (
      direction === "left" ||
      direction === "right"
    ) {

      board =
        lines.flat();

    }

    else {

      board =
        Array(16).fill(0);


      for (
        let col = 0;
        col < 4;
        col++
      ) {

        for (
          let row = 0;
          row < 4;
          row++
        ) {

          board[
            row * 4 + col
          ] =
            lines[col][row];

        }

      }

    }


    if (
      board.join(",") !== old
    ) {

      addTile();

    }


    render();


    if (
      board.includes(2048)
    ) {

      finished = true;

      $("#game2048Status").textContent =
        `🎉 You reached 2048! Score: ${score}`;

    }

    else if (!canMove()) {

      finished = true;

      $("#game2048Status").textContent =
        `Game Over! Score: ${score}`;

    }

  }


  function canMove() {

    if (
      board.some(
        value => value === 0
      )
    ) {

      return true;

    }


    for (
      let row = 0;
      row < 4;
      row++
    ) {

      for (
        let col = 0;
        col < 4;
        col++
      ) {

        const i =
          row * 4 + col;


        if (
          col < 3 &&
          board[i] === board[i+1]
        ) {

          return true;

        }


        if (
          row < 3 &&
          board[i] === board[i+4]
        ) {

          return true;

        }

      }

    }


    return false;

  }


  function reset() {

    board =
      Array(16).fill(0);

    score = 0;

    finished = false;

    addTile();

    addTile();

    render();

  }


  document.onkeydown = event => {

    const map = {

      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down"

    };


    if (
      map[event.key]
    ) {

      event.preventDefault();

      move(
        map[event.key]
      );

    }

  };


  $("#game2048Reset").addEventListener(
    "click",
    reset
  );


  reset();

}


/* =========================================
   CALCULATOR
========================================= */

function calculator(box) {

  box.innerHTML = `

    <div>

      <div class="badge">
        CALCULATOR
      </div>

      <h2>Calculator</h2>

      <p class="modal-sub">
        Simple everyday calculations.
      </p>


      <input
        id="calcDisplay"
        class="calc-display"
        value="0"
        readonly
      >


      <div class="calc-grid">

        <button data-calc="C">C</button>
        <button data-calc="back">⌫</button>
        <button data-calc="%">%</button>
        <button class="op" data-calc="/">÷</button>

        <button data-calc="7">7</button>
        <button data-calc="8">8</button>
        <button data-calc="9">9</button>
        <button class="op" data-calc="*">×</button>

        <button data-calc="4">4</button>
        <button data-calc="5">5</button>
        <button data-calc="6">6</button>
        <button class="op" data-calc="-">−</button>

        <button data-calc="1">1</button>
        <button data-calc="2">2</button>
        <button data-calc="3">3</button>
        <button class="op" data-calc="+">+</button>

        <button class="zero" data-calc="0">0</button>
        <button data-calc=".">.</button>
        <button class="equal" data-calc="=">=</button>

      </div>

    </div>

  `;


  let expression = "";

  let justCalculated = false;


  const display =
    $("#calcDisplay");


  $$(".calc-grid button",box)
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const value =
            button.dataset.calc;


          if (value === "C") {

            expression = "";

            display.value = "0";

            justCalculated = false;

            return;

          }


          if (value === "back") {

            expression =
              expression.slice(0,-1);

            display.value =
              expression || "0";

            return;

          }


          if (value === "=") {

            try {

              if (
                !/^[0-9+\-*/%. ]+$/
                  .test(expression)
              ) {

                throw new Error();

              }


              const result =
                Function(
                  `"use strict"; return (${expression})`
                )();


              if (
                !Number.isFinite(result)
              ) {

                throw new Error();

              }


              expression =
                String(
                  Math.round(
                    result * 1e12
                  ) / 1e12
                );


              display.value =
                expression;


              justCalculated = true;

            }

            catch {

              display.value =
                "Error";

              expression = "";

            }

            return;

          }


          if (
            justCalculated &&
            !"+-*/%".includes(value)
          ) {

            expression = "";

            justCalculated = false;

          }


          expression += value;

          display.value =
            expression;

        }
      );

    });

}


/* =========================================
   PERCENTAGE
========================================= */

function percentage(box) {

  box.innerHTML = `

    <div>

      <div class="badge">
        PERCENTAGE
      </div>

      <h2>Percentage Calculator</h2>

      <p class="modal-sub">
        Calculate percentage values quickly.
      </p>


      <div class="two-col">

        <label>
          Percentage
          <input
            id="percentA"
            type="number"
            placeholder="20"
          >
        </label>

        <label>
          Number
          <input
            id="percentB"
            type="number"
            placeholder="500"
          >
        </label>

      </div>


      <br>

      <button
        class="small-btn"
        id="percentBtn"
      >
        Calculate
      </button>


      <br><br>


      <div
        class="result-box"
        id="percentResult"
      >
        Enter values above.
      </div>

    </div>

  `;


  $("#percentBtn").addEventListener(
    "click",
    () => {

      const a =
        Number(
          $("#percentA").value
        );

      const b =
        Number(
          $("#percentB").value
        );


      if (
        !Number.isFinite(a) ||
        !Number.isFinite(b)
      ) {

        $("#percentResult").textContent =
          "Please enter both values.";

        return;

      }


      const result =
        (a / 100) * b;


      $("#percentResult").innerHTML =
        `
          <span class="result-big">
            ${result.toLocaleString()}
          </span>

          <br>

          ${a}% of ${b}
          =
          ${result}
        `;

    }
  );

}


/* =========================================
   AGE CALCULATOR
========================================= */

function ageCalculator(box) {

  box.innerHTML = `

    <div>

      <div class="badge">
        DATE TOOL
      </div>

      <h2>Age Calculator</h2>

      <p class="modal-sub">
        Enter your date of birth.
      </p>


      <div class="tool-form">

        <label>
          Date of Birth

          <input
            id="birthDate"
            type="date"
          >

        </label>


        <button
          class="small-btn"
          id="ageBtn"
        >
          Calculate Age
        </button>


        <div
          class="result-box"
          id="ageResult"
        >
          Your age will appear here.
        </div>

      </div>

    </div>

  `;


  const date =
    $("#birthDate");


  date.max =
    new Date()
      .toISOString()
      .split("T")[0];


  $("#ageBtn").addEventListener(
    "click",
    () => {

      if (!date.value) {

        $("#ageResult").textContent =
          "Please select your date of birth.";

        return;

      }


      const birth =
        new Date(
          date.value + "T00:00:00"
        );


      const now =
        new Date();


      if (
        birth > now
      ) {

        $("#ageResult").textContent =
          "Birth date cannot be in the future.";

        return;

      }


      let years =
        now.getFullYear() -
        birth.getFullYear();


      let months =
        now.getMonth() -
        birth.getMonth();


      let days =
        now.getDate() -
        birth.getDate();


      if (days < 0) {

        months--;

        days +=
          new Date(
            now.getFullYear(),
            now.getMonth(),
            0
          ).getDate();

      }


      if (months < 0) {

        years--;

        months += 12;

      }


      $("#ageResult").innerHTML =
        `
          <span class="result-big">
            ${years} years
          </span>

          <br>

          ${months} months and
          ${days} days
        `;

    }
  );

}


/* =========================================
   QR GENERATOR
========================================= */

function qrGenerator(box) {

  box.innerHTML = `

    <div>

      <div class="badge">
        QR TOOL
      </div>

      <h2>QR Code Generator</h2>

      <p class="modal-sub">
        Enter text or a website link.
      </p>


      <div class="tool-form">

        <textarea
          id="qrText"
          rows="4"
          placeholder="https://example.com"
        ></textarea>


        <button
          class="small-btn"
          id="qrBtn"
        >
          Generate QR
        </button>


        <div id="qrResult"></div>

      </div>

    </div>

  `;


  $("#qrBtn").addEventListener(
    "click",
    () => {

      const text =
        $("#qrText").value.trim();


      if (!text) {

        $("#qrResult").innerHTML =
          `
            <div class="result-box">
              Please enter text or a URL.
            </div>
          `;

        return;

      }


      const qrUrl =
        "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" +
        encodeURIComponent(text);


      $("#qrResult").innerHTML =
        `
          <img
            class="qr-img"
            src="${qrUrl}"
            alt="QR Code"
          >

          <div style="text-align:center">

            <button
              class="small-btn"
              id="copyQRText"
            >
              Copy Text
            </button>

          </div>
        `;


      $("#copyQRText").addEventListener(
        "click",
        () => {

          copyText(text);

        }
      );

    }
  );

}


/* =========================================
   PASSWORD GENERATOR
========================================= */

function passwordGenerator(box) {

  box.innerHTML = `

    <div>

      <div class="badge">
        SECURITY
      </div>

      <h2>Password Generator</h2>

      <p class="modal-sub">
        Generate a random password.
      </p>


      <div class="tool-form">

        <label>
          Password Length

          <input
            id="passwordLength"
            type="number"
            value="16"
            min="6"
            max="64"
          >

        </label>


        <label>
          <input
            id="upper"
            type="checkbox"
            checked
          >
          Uppercase
        </label>


        <label>
          <input
            id="lower"
            type="checkbox"
            checked
          >
          Lowercase
        </label>


        <label>
          <input
            id="numbers"
            type="checkbox"
            checked
          >
          Numbers
        </label>


        <label>
          <input
            id="symbols"
            type="checkbox"
            checked
          >
          Symbols
        </label>


        <button
          class="small-btn"
          id="generatePassword"
        >
          Generate
        </button>


        <div class="result-box">

          <div
            id="passwordOutput"
            class="result-big"
            style="word-break:break-all"
          >
            Click Generate
          </div>

          <br>

          <button
            class="small-btn"
            id="copyPassword"
          >
            Copy
          </button>

        </div>

      </div>

    </div>

  `;


  function generate() {

    let chars = "";


    if ($("#upper").checked) {
      chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    if ($("#lower").checked) {
      chars += "abcdefghijklmnopqrstuvwxyz";
    }

    if ($("#numbers").checked) {
      chars += "0123456789";
    }

    if ($("#symbols").checked) {
      chars += "!@#$%^&*_-+=";
    }


    if (!chars) {

      $("#passwordOutput").textContent =
        "Select at least one option.";

      return;

    }


    const length =
      Math.min(
        64,
        Math.max(
          6,
          Number(
            $("#passwordLength").value
          ) || 16
        )
      );


    const random =
      new Uint32Array(length);


    crypto.getRandomValues(random);


    let password = "";


    for (
      let i = 0;
      i < length;
      i++
    ) {

      password +=
        chars[
          random[i] % chars.length
        ];

    }


    $("#passwordOutput").textContent =
      password;

  }


  $("#generatePassword").addEventListener(
    "click",
    generate
  );


  $("#copyPassword").addEventListener(
    "click",
    () => {

      copyText(
        $("#passwordOutput").textContent
      );

    }
  );


  generate();

}


/* =========================================
   WORD COUNTER
========================================= */

function wordCounter(box) {

  box.innerHTML = `

    <div>

      <div class="badge">
        WRITING TOOL
      </div>

      <h2>Word Counter</h2>

      <p class="modal-sub">
        Count words and characters instantly.
      </p>


      <textarea
        id="wordText"
        rows="9"
        placeholder="Start typing..."
        style="
          width:100%;
          background:#111a2a;
          color:white;
          border:1px solid var(--line);
          border-radius:10px;
          padding:12px;
          outline:none;
          resize:vertical;
        "
      ></textarea>


      <br><br>


      <div class="two-col">

        <div class="result-box">
          <span
            id="wordCount"
            class="result-big"
          >
            0
          </span>
          <br>
          Words
        </div>


        <div class="result-box">
          <span
            id="charCount"
            class="result-big"
          >
            0
          </span>
          <br>
          Characters
        </div>


        <div class="result-box">
          <span
            id="lineCount"
            class="result-big"
          >
            0
          </span>
          <br>
          Lines
        </div>


        <div class="result-box">
          <span
            id="spaceCount"
            class="result-big"
          >
            0
          </span>
          <br>
          Without Spaces
        </div>

      </div>

    </div>

  `;


  $("#wordText").addEventListener(
    "input",
    event => {

      const text =
        event.target.value;


      const words =
        text.trim()
          ? text.trim().split(/\s+/).length
          : 0;


      $("#wordCount").textContent =
        words;


      $("#charCount").textContent =
        text.length;


      $("#lineCount").textContent =
        text
          ? text.split(/\r?\n/).length
          : 0;


      $("#spaceCount").textContent =
        text.replace(/\s/g,"").length;

    }
  );

}


/* =========================================
   UNIT CONVERTER
========================================= */

function unitConverter(box) {

  box.innerHTML = `

    <div>

      <div class="badge">
        CONVERTER
      </div>

      <h2>Unit Converter</h2>

      <p class="modal-sub">
        Convert length, weight and temperature.
      </p>


      <div class="tool-form">

        <label>
          Category

          <select id="unitCategory">

            <option value="length">
              Length
            </option>

            <option value="weight">
              Weight
            </option>

            <option value="temperature">
              Temperature
            </option>

          </select>

        </label>


        <div class="two-col">

          <label>
            From
            <select id="unitFrom"></select>
          </label>

          <label>
            To
            <select id="unitTo"></select>
          </label>

        </div>


        <label>
          Value

          <input
            id="unitValue"
            type="number"
            value="1"
          >

        </label>


        <div class="result-box">

          <span
            id="unitResult"
            class="result-big"
          >
            —
          </span>

        </div>

      </div>

    </div>

  `;


  const data = {

    length: {

      meter: 1,
      kilometer: 1000,
      centimeter: .01,
      millimeter: .001,
      foot: .3048,
      inch: .0254,
      mile: 1609.344

    },

    weight: {

      kilogram: 1,
      gram: .001,
      milligram: .000001,
      pound: .45359237,
      ounce: .028349523125

    }

  };


  function fillUnits() {

    const category =
      $("#unitCategory").value;


    let units;


    if (
      category === "temperature"
    ) {

      units = [
        "celsius",
        "fahrenheit",
        "kelvin"
      ];

    }

    else {

      units =
        Object.keys(
          data[category]
        );

    }


    $("#unitFrom").innerHTML =
      units
        .map(
          unit =>
            `<option>${unit}</option>`
        )
        .join("");


    $("#unitTo").innerHTML =
      units
        .map(
          unit =>
            `<option>${unit}</option>`
        )
        .join("");


    if (units[1]) {

      $("#unitTo").value =
        units[1];

    }


    convert();

  }


  function convert() {

    const category =
      $("#unitCategory").value;


    const from =
      $("#unitFrom").value;


    const to =
      $("#unitTo").value;


    const value =
      Number(
        $("#unitValue").value
      );


    if (
      !Number.isFinite(value)
    ) {
      return;
    }


    let result;


    if (
      category === "temperature"
    ) {

      let celsius;


      if (from === "celsius") {

        celsius = value;

      }

      else if (
        from === "fahrenheit"
      ) {

        celsius =
          (value - 32) *
          5 / 9;

      }

      else {

        celsius =
          value - 273.15;

      }


      if (to === "celsius") {

        result = celsius;

      }

      else if (
        to === "fahrenheit"
      ) {

        result =
          celsius * 9 / 5 + 32;

      }

      else {

        result =
          celsius + 273.15;

      }

    }

    else {

      result =
        value *
        data[category][from] /
        data[category][to];

    }


    $("#unitResult").textContent =
      `${result.toLocaleString(
        undefined,
        {
          maximumFractionDigits: 8
        }
      )} ${to}`;

  }


  $("#unitCategory").addEventListener(
    "change",
    fillUnits
  );


  $("#unitFrom").addEventListener(
    "change",
    convert
  );


  $("#unitTo").addEventListener(
    "change",
    convert
  );


  $("#unitValue").addEventListener(
    "input",
    convert
  );


  fillUnits();

}


/* =========================================
   RANDOM NUMBER
========================================= */

function randomNumber(box) {

  box.innerHTML = `

    <div>

      <div class="badge">
        RANDOM TOOL
      </div>

      <h2>Random Number</h2>

      <p class="modal-sub">
        Pick a random number between two limits.
      </p>


      <div class="two-col">

        <label>
          Minimum

          <input
            id="randomMin"
            type="number"
            value="1"
          >

        </label>


        <label>
          Maximum

          <input
            id="randomMax"
            type="number"
            value="100"
          >

        </label>

      </div>


      <br>


      <button
        class="small-btn"
        id="randomBtn"
      >
        Pick Number
      </button>


      <br><br>


      <div
        class="result-box"
        style="text-align:center"
      >

        <span
          id="randomResult"
          class="result-big"
        >
          —
        </span>

      </div>

    </div>

  `;


  $("#randomBtn").addEventListener(
    "click",
    () => {

      let min =
        Math.ceil(
          Number(
            $("#randomMin").value
          )
        );


      let max =
        Math.floor(
          Number(
            $("#randomMax").value
          )
        );


      if (min > max) {

        [
          min,
          max
        ] = [
          max,
          min
        ];

      }


      const result =
        Math.floor(
          Math.random() *
          (max - min + 1)
        ) + min;


      $("#randomResult").textContent =
        result;

    }
  );

}


/* =========================================
   COLOR PICKER
========================================= */

function colorPicker(box) {

  box.innerHTML = `

    <div>

      <div class="badge">
        DESIGN TOOL
      </div>

      <h2>Color Picker</h2>

      <p class="modal-sub">
        Pick a color and get HEX/RGB values.
      </p>


      <input
        id="colorInput"
        type="color"
        value="#795CFF"
        style="
          width:100%;
          height:70px;
          border:none;
          background:none;
        "
      >


      <div
        id="colorPreview"
        class="color-preview"
      ></div>


      <div class="result-box">

        <span
          id="hexValue"
          class="result-big"
        >
          #795CFF
        </span>

        <br>

        <span id="rgbValue">
          rgb(121, 92, 255)
        </span>

        <br><br>

        <button
          class="small-btn"
          id="copyColor"
        >
          Copy HEX
        </button>

      </div>

    </div>

  `;


  function updateColor() {

    const hex =
      $("#colorInput")
        .value
        .toUpperCase();


    const number =
      parseInt(
        hex.slice(1),
        16
      );


    const r =
      (number >> 16) & 255;

    const g =
      (number >> 8) & 255;

    const b =
      number & 255;


    $("#colorPreview")
      .style
      .background = hex;


    $("#hexValue")
      .textContent = hex;


    $("#rgbValue")
      .textContent =
      `rgb(${r}, ${g}, ${b})`;

  }


  $("#colorInput").addEventListener(
    "input",
    updateColor
  );


  $("#copyColor").addEventListener(
    "click",
    () => {

      copyText(
        $("#hexValue").textContent
      );

    }
  );


  updateColor();

}


/* =========================================
   IMAGE COMPRESSOR
========================================= */

function imageCompressor(box) {

  box.innerHTML = `

    <div>

      <div class="badge">
        IMAGE TOOL
      </div>

      <h2>Image Compressor</h2>

      <p class="modal-sub">
        Compress an image directly in your browser.
      </p>


      <div class="tool-form">

        <label>
          Choose Image

          <input
            id="imageFile"
            type="file"
            accept="image/*"
          >

        </label>


        <label>

          Quality

          <input
            id="imageQuality"
            type="range"
            min="10"
            max="100"
            value="75"
          >

          <span id="qualityText">
            75%
          </span>

        </label>


        <div
          id="imageResult"
          class="result-box"
        >
          Choose an image to start.

        </div>

      </div>

    </div>

  `;


  $("#imageQuality").addEventListener(
    "input",
    event => {

      $("#qualityText").textContent =
        event.target.value + "%";

    }
  );


  $("#imageFile").addEventListener(
    "change",
    event => {

      const file =
        event.target.files[0];


      if (!file) {
        return;
      }


      const reader =
        new FileReader();


      reader.onload = event => {

        const image =
          new Image();


        image.onload = () => {

          const maxSize = 1800;


          const scale =
            Math.min(
              1,
              maxSize /
              Math.max(
                image.width,
                image.height
              )
            );


          const canvas =
            document.createElement(
              "canvas"
            );


          canvas.width =
            Math.round(
              image.width * scale
            );


          canvas.height =
            Math.round(
              image.height * scale
            );


          const context =
            canvas.getContext("2d");


          context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
          );


          const quality =
            Number(
              $("#imageQuality").value
            ) / 100;


          canvas.toBlob(
            blob => {

              const url =
                URL.createObjectURL(
                  blob
                );


              $("#imageResult").innerHTML =
                `

                  <p>
                    Original:
                    ${(file.size / 1024).toFixed(1)}
                    KB
                    <br>

                    Compressed:
                    ${(blob.size / 1024).toFixed(1)}
                    KB
                  </p>


                  <img
                    src="${url}"
                    class="compress-preview"
                    alt="Compressed image"
                  >


                  <a
                    href="${url}"
                    download="compressed-image.jpg"
                    class="btn primary-btn"
                  >
                    Download Image →
                  </a>

                `;

            },
            "image/jpeg",
            quality
          );

        };


        image.src =
          event.target.result;

      };


      reader.readAsDataURL(file);

    }
  );

}


/* =========================================
   COPY
========================================= */

async function copyText(text) {

  try {

    await navigator.clipboard.writeText(
      text
    );

    alert("Copied!");

  }

  catch {

    prompt(
      "Copy this text:",
      text
    );

  }

}