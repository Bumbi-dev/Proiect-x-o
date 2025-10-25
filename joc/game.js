// import * as DB from '../utils/db_manager.js';

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
};

//TODO show retry or next level button
const checkGameEnd = () => {
	let result = '';
	let line = '';
	if (checkWinner(game, player_turn)) {
		result = `A castigat jucatorul cu ${player_turn}`;
		line = classLine;
		document.querySelector("#line").className = classLine;
	} else if (checkWinner(game, AI_turn)) {
		line = classLine;
		result = `A castigat AI-ul cu ${AI_turn}`;
	} else if (emptyCells(game).length === 0) {
		result = 'Egalitate!';
	}
	document.querySelector("#line").className = line;
	document.querySelector('#result').innerHTML = result;
};

const mark = (el, player) => {
	if (!isChecked(el)) {
		el.innerHTML = player;
		el.setAttribute('data-mark', player)
		game[parseInt(el.getAttribute('data-cell'))] = player;
		if (checkWinner(game, player)) {
			document.querySelector("#line").classList.remove('d-none');
		}
	} else {
		throw new Error('Nu poti pune intr-un chenar deja ocupat!');
	}
};

//TODO add this to retry button
// document.querySelector('#reset').addEventListener('click', () => {
// 	game = new Array(9);
// 	document.querySelector("#line").className = '';
// 	document.querySelector("#line").classList.add('d-none');
// 	cell.forEach((el) => {
// 		el.innerHTML = '';
// 		el.setAttribute('data-mark', '')
// 	});
// 	document.querySelector('#result').innerHTML = '';
// })

const selectPlayer = (player) => {
	if (player == AI_turn) {
		player_turn = 'O';
		AI_turn = 'X';
	} else {
		player_turn = 'X';
		AI_turn = 'O';
	}
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

const computerBoss = () => {
	let empty = emptyCells(game);
	if (empty.length > 0) {
		let bestMove = miniMax(game, AI_turn, empty.length);
		mark(cell[bestMove.index], AI_turn);
	}
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

const computerNoob = () => {
	let empty = emptyCells(game);
	if (empty.length > 0) {
		// Pick a random empty cell
		const randomIndex = Math.floor(Math.random() * empty.length);
		const moveIndex = empty[randomIndex];
		mark(cell[moveIndex], AI_turn);
	}
}

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

function nextLevel() {
	AILevel++;
	document.getElementById('css').getAnimations('href') = "game2.css"
}

init();



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

animateBouncers();
