// import * as DB from '../utils/db_manager.js';

let game = new Array(9);
let classLine = '';
const cell = document.querySelectorAll('.cell');
let player_turn = 'X';
let AI_turn = 'O';

var disableX = document.getElementById("selectX");

var disableO = document.getElementById("selectO");

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
    let result = '';
    let line = '';
    let playerWon = false;

    if (checkWinner(game, player_turn)) {
        result = `Ai castigat! (${player_turn})`;
        line = classLine;
        playerWon = true;
    } else if (checkWinner(game, AI_turn)) {
        result = `Ai pierdut! (${AI_turn})`;
        line = classLine;
    } else if (emptyCells(game).length === 0) {
        result = 'Egalitate!';
    } else {
        // game still ongoing
        return;
    }

    document.querySelector("#line").className = line;
    document.querySelector('#result').innerHTML = result;

    if (window.showResultModal) {
        window.showResultModal(result, playerWon);
    } else {
        // fallback if modal script isn't loaded
        alert(result);
    }
};

const mark = (el, player) => {
    showButtons(false);
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

document.querySelector('#selectX').addEventListener('click', () => {
	selectPlayer(player_turn);
});

document.querySelector('#selectO').addEventListener('click', () => {
	selectPlayer(AI_turn);
});

document.querySelector('#reset').addEventListener('click', () => {
	game = new Array(9);
  disableX.disabled=false;
  disableO.disabled=false;
	document.querySelector("#line").className = '';
	document.querySelector("#line").classList.add('d-none');
	cell.forEach((el) => {
		el.innerHTML = '';
		el.setAttribute('data-mark', '')
	});
	document.querySelector('#result').innerHTML = '';
	showButtons();
})

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
        // Pick a random empty cell
        const randomIndex = Math.floor(Math.random() * empty.length);
        const moveIndex = empty[randomIndex];
        mark(cell[moveIndex], AI_turn);
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

const showButtons = (show = true) => {
	if (show) {
		document.querySelector('#selectO').classList.remove('d-none');
		document.querySelector('#selectX').classList.remove('d-none');
		return;
	}

	document.querySelector('#selectO').classList.add('d-none');
	document.querySelector('#selectX').classList.add('d-none');
}


	

init();