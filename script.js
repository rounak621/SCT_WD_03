class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = 'pvp';
        this.winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.cells = document.querySelectorAll('[data-cell]');
        this.statusDisplay = document.querySelector('.status');
        this.resetButton = document.getElementById('reset');
        this.pvpButton = document.getElementById('pvp');
        this.pvcButton = document.getElementById('pvc');

        this.initializeGame();
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e), { once: true });
            cell.textContent = '';
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
        this.pvpButton.addEventListener('click', () => this.setGameMode('pvp'));
        this.pvcButton.addEventListener('click', () => this.setGameMode('pvc'));

        this.updateStatus();
    }

    handleCellClick(event) {
        if (!this.gameActive) return;

        const cell = event.target;
        const index = Array.from(this.cells).indexOf(cell);

        if (this.board[index] !== '') return;

        this.makeMove(index);

        if (this.gameMode === 'pvc' && this.gameActive && this.currentPlayer === 'O') {
            this.makeComputerMove();
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        
        if (this.checkWin()) {
            this.gameActive = false;
            this.statusDisplay.textContent = `Player ${this.currentPlayer} wins!`;
            this.highlightWinningCells();
            return;
        }

        if (this.checkDraw()) {
            this.gameActive = false;
            this.statusDisplay.textContent = "Game ended in a draw!";
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    makeComputerMove() {
        setTimeout(() => {
            const availableMoves = this.board
                .map((cell, index) => cell === '' ? index : null)
                .filter(cell => cell !== null);

            if (availableMoves.length > 0) {
                // Simple AI: Try to win, block opponent, or make random move
                const move = this.getBestMove(availableMoves);
                this.makeMove(move);
            }
        }, 500);
    }

    getBestMove(availableMoves) {
        // Check for winning move
        for (const move of availableMoves) {
            const boardCopy = [...this.board];
            boardCopy[move] = 'O';
            if (this.checkWinForBoard(boardCopy, 'O')) {
                return move;
            }
        }

        // Check for blocking opponent's winning move
        for (const move of availableMoves) {
            const boardCopy = [...this.board];
            boardCopy[move] = 'X';
            if (this.checkWinForBoard(boardCopy, 'X')) {
                return move;
            }
        }

        // Take center if available
        if (availableMoves.includes(4)) {
            return 4;
        }

        // Take random corner or side
        const corners = availableMoves.filter(move => [0, 2, 6, 8].includes(move));
        if (corners.length > 0) {
            return corners[Math.floor(Math.random() * corners.length)];
        }

        // Random move
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    checkWin() {
        for (const combo of this.winningCombos) {
            if (combo.every(index => this.board[index] === this.currentPlayer)) {
                this.winningLine = combo;
                return true;
            }
        }
        return false;
    }

    highlightWinningCells() {
        if (this.winningLine) {
            this.winningLine.forEach(index => {
                const cell = this.cells[index];
                cell.classList.add('winner');
            });
        }
    }

    checkWinForBoard(board, player) {
        return this.winningCombos.some(combo => {
            return combo.every(index => board[index] === player);
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    updateStatus() {
        if (this.gameActive) {
            this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
        }
    }

    setGameMode(mode) {
        this.gameMode = mode;
        this.pvpButton.classList.toggle('active', mode === 'pvp');
        this.pvcButton.classList.toggle('active', mode === 'pvc');
        this.resetGame();
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningLine = null;

        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner');
            cell.removeEventListener('click', (e) => this.handleCellClick(e));
            cell.addEventListener('click', (e) => this.handleCellClick(e), { once: true });
        });

        this.updateStatus();
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
