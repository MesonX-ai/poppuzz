/**
 * Pop Puzzle - Game Logic Utilities
 * @author Shiva R Dhanuskodi - MesonX
 */

import { BubbleType } from '../types';

/**
 * Generate a random game board
 */
export function generateBoard(size: number, numColors: number): BubbleType[][] {
  const board: BubbleType[][] = [];
  for (let i = 0; i < size; i++) {
    const row: BubbleType[] = [];
    for (let j = 0; j < size; j++) {
      row.push(Math.floor(Math.random() * numColors));
    }
    board.push(row);
  }
  return board;
}

/**
 * Find all connected bubbles of the same color using flood fill
 */
export function findConnectedBubbles(
  board: BubbleType[][],
  row: number,
  col: number
): [number, number][] {
  const color = board[row][col];
  if (color === null) return [];

  const visited = new Set<string>();
  const connected: [number, number][] = [];
  const stack: [number, number][] = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const key = `${r},${c}`;

    if (visited.has(key)) continue;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) continue;
    if (board[r][c] !== color) continue;

    visited.add(key);
    connected.push([r, c]);

    // Check all 4 directions
    stack.push([r - 1, c]); // up
    stack.push([r + 1, c]); // down
    stack.push([r, c - 1]); // left
    stack.push([r, c + 1]); // right
  }

  return connected;
}

/**
 * Remove bubbles from the board
 */
export function removeBubbles(
  board: BubbleType[][],
  positions: [number, number][]
): BubbleType[][] {
  const newBoard = board.map(row => [...row]);
  
  for (const [row, col] of positions) {
    newBoard[row][col] = null;
  }
  
  return newBoard;
}

/**
 * Apply gravity - make bubbles fall down
 */
export function applyGravity(board: BubbleType[][]): BubbleType[][] {
  const newBoard = board.map(row => [...row]);
  const rows = newBoard.length;
  const cols = newBoard[0].length;

  // For each column, move non-null bubbles down
  for (let col = 0; col < cols; col++) {
    let writeRow = rows - 1;
    
    // Start from bottom
    for (let row = rows - 1; row >= 0; row--) {
      if (newBoard[row][col] !== null) {
        if (row !== writeRow) {
          newBoard[writeRow][col] = newBoard[row][col];
          newBoard[row][col] = null;
        }
        writeRow--;
      }
    }
  }

  return newBoard;
}

/**
 * Collapse empty columns
 */
export function collapseColumns(board: BubbleType[][]): BubbleType[][] {
  const newBoard = board.map(row => [...row]);
  const rows = newBoard.length;
  const cols = newBoard[0].length;

  // Find empty columns and shift
  let writeCol = cols - 1;
  
  for (let col = cols - 1; col >= 0; col--) {
    // Check if column is empty
    const isEmpty = newBoard.every(row => row[col] === null);
    
    if (!isEmpty) {
      if (col !== writeCol) {
        // Move column
        for (let row = 0; row < rows; row++) {
          newBoard[row][writeCol] = newBoard[row][col];
          newBoard[row][col] = null;
        }
      }
      writeCol--;
    }
  }

  return newBoard;
}
