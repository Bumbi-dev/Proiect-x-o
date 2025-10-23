// import * as DB from '../utils/db_manager.js';

let game = new Array(9);
let classLine = '';
const cell = document.querySelectorAll('.cell');
let player_turn = 'X';
let AI_turn = 'O';

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
						computer();
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

const checkGameEnd = () => {
	let result='';
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
//   disableX.disabled=false;
//   disableO.disabled=false;
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
    disableX.disabled=true;
	} else {
		player_turn = 'X';
		AI_turn = 'O';
    disableO.disabled=true;
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

const computer = () => {
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

init();