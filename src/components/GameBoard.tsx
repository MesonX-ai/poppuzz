/**
 * Pop Puzzle - Game Board Component
 * @author Shiva R Dhanuskodi - MesonX
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Bubble from './Bubble';
import { BubbleType } from '../types';

interface Props {
  board: BubbleType[][];
  selectedBubbles: Set<string>;
  poppingBubbles: Set<string>;
  fallingBubbles: Map<string, { fromRow: number, toRow: number }>;
  onBubblePress: (row: number, col: number) => void;
  onBubblePop: () => void;
}

const { width } = Dimensions.get('window');

export default function GameBoard({ board, selectedBubbles, poppingBubbles, fallingBubbles, onBubblePress, onBubblePop }: Props) {
  const boardSize = board.length;
  const maxBoardWidth = width - 40;
  const bubbleSize = Math.min(maxBoardWidth / boardSize, 50);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.board, { width: bubbleSize * boardSize, height: bubbleSize * boardSize }]}
      >
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((bubble, colIndex) => {
              const key = `${rowIndex},${colIndex}`;
              const isPopping = poppingBubbles.has(key);
              const fallingInfo = fallingBubbles.get(key);
              
              return (
                <Bubble
                  key={key}
                  color={bubble}
                  size={bubbleSize}
                  isSelected={selectedBubbles.has(key)}
                  isPopping={isPopping}
                  fallingFrom={fallingInfo?.fromRow}
                  currentRow={rowIndex}
                  onPress={() => onBubblePress(rowIndex, colIndex)}
                />
              );
            })}
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  board: {
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 24,
    borderWidth: 3,
    borderColor: '#4a4a4a',
    borderTopColor: '#666',
    borderLeftColor: '#666',
    borderBottomColor: '#2a2a2a',
    borderRightColor: '#2a2a2a',
  },
  row: {
    flexDirection: 'row',
  },
});
