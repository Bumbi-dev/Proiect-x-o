import * as DB from '../utils/db_manager.js';

let game = new Array(9);
let classLine = '';
const cell = document.querySelectorAll('.cell');
let player_turn = 'X';
let AI_turn = 'O';

let AILevel = 1;

const winningCombinations = [
	{ 'combination': [0, 1, 2], 'lineClass': 'line-horizontal-top' },
	{ 'combination': [3, 4, 5], 'lineClass': 'line-horizontal-center' },
	{ 'combination': [6, 7, 8], 'lineClass': 'line-horizontal-bottom' },
	{ 'combination': [0, 3, 6], 'lineClass': 'line-vertical-left' },
	{ 'combination': [1, 4, 7], 'lineClass': 'line-vertical-center' },
	{ 'combination': [2, 5, 8], 'lineClass': 'line-vertical-right' },
	{ 'combination': [0, 4, 8], 'lineClass': 'line-diagonal-right' },
	{ 'combination': [2, 4, 6], 'lineClass': 'line-diagonal-left' },
];

const init = () => {
	cell.forEach((el, i) => {
		el.addEventListener('click', () => {
			try {
				if (!checkWinner(game, player_turn) && !checkWinner(game, AI_turn)) {
					mark(el, player_turn);
					if (!checkWinner(game, player_turn)) {
						switch (AILevel) {
							case 1:
								computerNoob();
								break;
							case 2:
								computerAvarage();
								break;
							case 3:
								computerBoss();
								break;
							default:
						}
					}
				}
				checkGameEnd();
			} catch (error) {
				console.error(error);
				alert(error);
			}
		});
		el.setAttribute('data-cell', i);
	});

	DB.queueUpdateGameData(AILevel, 0);//0 = start game

	animateBouncers();
};

const checkGameEnd = () => {
    let result = '';
    // let playerWon = false;
	
    if (checkWinner(game, player_turn)) {
		nextLevel();
		//TODO showNextLevelButton(`Ai castigat! (${player_turn})`);
    } else if (checkWinner(game, AI_turn)) {
		resetCareu();
		//TODO showRetryButton(`AI a castigat! (${AI_turn})`);
    } else if (emptyCells(game).length === 0) {
		resetCareu();
		//TODO showRetryButton('Egalitate!');
    } else {
        return;
    }

    // if (window.showResultModal) {
    //     window.showResultModal(result, playerWon);
    // } else {
    //     alert(result);
    // }
};

function nextLevel() {
	DB.queueUpdateGameData(AILevel, 'w');
	AILevel++;
	resetCareu();
	switch (AILevel) {
		case 2:
			document.getElementById('scrolling-bg').style.backgroundImage = "url('../res/second_level.png')";
			break;
		case 3:
			document.getElementById('scrolling-bg').style.backgroundImage = "url('../res/third_level.png')";
			break;
	}
}

function resetCareu() {
	game = new Array(9);
	for (let i = 0; i < cell.length; i++) {
		cell[i].innerHTML = '';
		cell[i].removeAttribute('data-mark');
	}

	DB.queueUpdateGameData(AILevel, 0);
}

function showNextLevelButton(result) {
	//blureaza ecranu
	document.getElementById("body").style.backgroundImage = "url('../res/xsig2.png')";

	document.getElementById("next_level").style.display = "block";

	//TODO display result msg
}

function showRetryButton(result) {
	//blureaza ecranu
	document.getElementById("body").style.backgroundImage = "url('../res/xsig2.png')";

	document.getElementById("retry").style.display = "block";

	//TODO display result msg
}

const mark = (el, player) => {
	if (!isChecked(el)) {
		el.innerHTML = player;
		el.setAttribute('data-mark', player)
		game[parseInt(el.getAttribute('data-cell'))] = player;
	} else {
		throw new Error('Nu poti pune intr-un chenar deja ocupat!');
	}
	
	DB.queueUpdateGameData(AILevel, parseInt(el.getAttribute('data-cell'))+1);
};

const isChecked = (el) => {
	return game[parseInt(el.getAttribute('data-cell'))] !== undefined;
}

const emptyCells = (gameCurrent) => {
	let empty = [];
	for (let i = 0; i < gameCurrent.length; i++) {
		if (!gameCurrent[i]) empty.push(i);
	}
	return empty;
}

//AIs
const computerNoob = () => {
	let empty = emptyCells(game);
	if (empty.length > 0) {
		// Pick a random empty cell
		const randomIndex = Math.floor(Math.random() * empty.length);
		const moveIndex = empty[randomIndex];
		mark(cell[moveIndex], AI_turn);
	}
}

const computerAvarage = () => {
	let empty = emptyCells(game);
	if (empty.length > 0) {
		// First priority: Win if possible
		const winningMove = findWinningMove(game, AI_turn);
		if (winningMove !== -1) {
			mark(cell[winningMove], AI_turn);
			return;
		}

		// Second priority: Block player's winning move
		const blockingMove = findWinningMove(game, player_turn);
		if (blockingMove !== -1) {
			mark(cell[blockingMove], AI_turn);
			return;
		}

		// If no strategic moves, make a random move
		const randomIndex = Math.floor(Math.random() * empty.length);
		const moveIndex = empty[randomIndex];
		mark(cell[moveIndex], AI_turn);
	}
};

const computerBoss = () => {
	let empty = emptyCells(game);
	if (empty.length > 0) {
		let bestMove = miniMax(game, AI_turn, empty.length);
		mark(cell[bestMove.index], AI_turn);
	}
}

//Algorithms and functions for AIs
const findWinningMove = (gameCurrent, player) => {
	let empty = emptyCells(gameCurrent);
	for (let i = 0; i < empty.length; i++) {
		let testBoard = [...gameCurrent];
		testBoard[empty[i]] = player;
		if (checkWinner(testBoard, player)) {
			return empty[i];
		}
	}
	return -1;
};

var bestScore;
const miniMax = (gameCurrent, player, depth) => {
	const min = (a, b) => {
		return a < b ? a : b;
	}

	const max = (a, b) => {
		return a > b ? a : b;
	}

	let empty = emptyCells(gameCurrent);

	if (checkWinner(gameCurrent, player_turn)) {
		return { score: -1 };
	}
	if (checkWinner(gameCurrent, AI_turn)) {
		return { score: 1 };
	}
	if (empty.length === 0 || depth === 0) {
		return { score: 0 };
	}

	depth--;

	let movePossibles = [];

	for (let i = 0; i < empty.length; i++) {
		let move = {};
		move.index = empty[i];

		let newGame = gameCurrent.slice();
		newGame[empty[i]] = player;

		let result = miniMax(newGame, player === AI_turn ? player_turn : AI_turn, depth);
		move.score = result.score;
		movePossibles.push(move);
	}

	let bestMove;
	if (player === AI_turn) {
		bestScore = -Infinity;
		for (let i = 0; i < movePossibles.length; i++) {
			bestScore = max(bestScore, movePossibles[i].score);
			if (movePossibles[i].score === bestScore) {
				bestMove = i;
			}
		}
	} else {
		bestScore = Infinity;
		for (let i = 0; i < movePossibles.length; i++) {
			bestScore = min(bestScore, movePossibles[i].score);
			if (movePossibles[i].score === bestScore) {
				bestMove = i;
			}
		}
	}

	return movePossibles[bestMove];
}

const checkWinner = (gameCurrent, player) => {
	let pos = findPosition(gameCurrent, player);
	for (let i = 0; i < winningCombinations.length; i++) {
		if (winningCombinations[i].combination.every(item => pos.includes(item))) {
			classLine = winningCombinations[i].lineClass;
			return true;
		}
	}
	return false;
}

const findPosition = (array, value) => {
	const positions = [];
	for (let i = 0; i < array.length; i++) {
		if (array[i] === value) {
			positions.push(i);
		}
	}
	return positions;
}

//UI animation
const bouncers = [
  {el: document.getElementById('bouncerX'), x: 100, y: 100, dx: 3, dy: 3},
  {el: document.getElementById('bouncerO'), x: 300, y: 200, dx: 2, dy: 2}
];

function animateBouncers() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  bouncers.forEach(obj => {
    const rect = obj.el.getBoundingClientRect(); 

    obj.x += obj.dx;
    obj.y += obj.dy;

    const padding = 2;

    if (obj.x + rect.width >= width - padding) {
      obj.x = width - rect.width - padding; 
      obj.dx *= -1;
    }
    if (obj.x <= padding) {
      obj.x = padding;
      obj.dx *= -1;
    }

    if (obj.y + rect.height >= height - padding) {
      obj.y = height - rect.height - padding; 
      obj.dy *= -1;
    }
    if (obj.y <= padding) {
      obj.y = padding;
      obj.dy *= -1;
    }

    obj.el.style.left = obj.x + 'px';
    obj.el.style.top = obj.y + 'px';
  });

  requestAnimationFrame(animateBouncers);
}

window.onload = function() {
  const bg = document.getElementById('scrolling-bg');
  let x = 0;
  const speed = 1; 
  const imageWidth = window.innerWidth; 

  function animateBG() {
    x += speed; 

    
    if (x >= imageWidth) {
      x = 0;
    }

    bg.style.backgroundPosition = `${x}px 0`; 
    requestAnimationFrame(animateBG);
  }

  animateBG();
};

init();