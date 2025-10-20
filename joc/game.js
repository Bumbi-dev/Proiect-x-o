let casute = [0, 0, 0, 0, 0, 0, 0, 0, 0];

let player_turn = 1

const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    if(cell.textContent != '')
        return;

    if(player_turn == 1)
        cell.textContent = 'X';
    else
        cell.textContent = '0'

    player_turn = -player_turn;
  });
});