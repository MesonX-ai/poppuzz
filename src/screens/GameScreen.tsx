/**
 * Pop Puzzle - Game Screen
 * @author Shiva R Dhanuskodi - MesonX
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import GameBoard from '../components/GameBoard';
import { generateBoard, findConnectedBubbles, removeBubbles, applyGravity, collapseColumns } from '../utils/gameLogic';
import { BubbleType } from '../types';
import { Audio } from 'expo-av';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

const DIFFICULTY_CONFIG = {
  easy: { size: 6, colors: 4 },
  medium: { size: 8, colors: 5 },
  hard: { size: 10, colors: 6 },
};

export default function GameScreen({ route, navigation }: Props) {
  const { difficulty } = route.params;
  const config = DIFFICULTY_CONFIG[difficulty];

  const [board, setBoard] = useState<BubbleType[][]>(() => 
    generateBoard(config.size, config.colors)
  );
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [selectedBubbles, setSelectedBubbles] = useState<Set<string>>(new Set());
  const [poppingBubbles, setPoppingBubbles] = useState<Set<string>>(new Set());
  const [fallingBubbles, setFallingBubbles] = useState<Map<string, { fromRow: number, toRow: number }>>(new Map());
  const [lightningFlash, setLightningFlash] = useState(false);
  const [lightningBolts, setLightningBolts] = useState<Array<{id: number, x1: number, y1: number, x2: number, y2: number}>>([]);
  
  const scoreAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const lightningOpacity = useRef(new Animated.Value(0)).current;

  // Web Audio API for sound synthesis
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Synthesized sound effects
  const playSound = (type: 'pop' | 'select' | 'combo' | 'success' | 'button' | 'lightning', intensity: number = 1) => {
    if (!audioContext.current) return;

    const ctx = audioContext.current;
    const now = ctx.currentTime;

    switch (type) {
      case 'pop': {
        // Pop sound with pitch based on intensity
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400 + intensity * 100, now);
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;
      }
      
      case 'select': {
        // Soft click sound
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start(now);
        oscillator.stop(now + 0.05);
        break;
      }
      
      case 'combo': {
        // Ascending arpeggio for combos
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(freq, now + i * 0.08);
          
          gainNode.gain.setValueAtTime(0, now + i * 0.08);
          gainNode.gain.linearRampToValueAtTime(0.2 * intensity, now + i * 0.08 + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.start(now + i * 0.08);
          oscillator.stop(now + i * 0.08 + 0.2);
        });
        break;
      }
      
      case 'success': {
        // Victory fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, i) => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(freq, now + i * 0.1);
          
          gainNode.gain.setValueAtTime(0.25, now + i * 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.start(now + i * 0.1);
          oscillator.stop(now + i * 0.1 + 0.3);
        });
        break;
      }
      
      case 'button': {
        // Button press sound
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(220, now);
        oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.08);
        
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start(now);
        oscillator.stop(now + 0.08);
        break;
      }
      
      case 'lightning': {
        // Electric zap sound
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();
        
        noise.buffer = noiseBuffer;
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(5000, now);
        filter.Q.setValueAtTime(1, now);
        
        gainNode.gain.setValueAtTime(0.3 * intensity, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        noise.start(now);
        noise.stop(now + 0.15);
        break;
      }
    }
  };

  // Trigger lightning visual effect
  const triggerLightningEffect = (positions: [number, number][]) => {
    // Create lightning bolts between bubbles
    const bolts = [];
    for (let i = 0; i < positions.length - 1; i++) {
      const [r1, c1] = positions[i];
      const [r2, c2] = positions[i + 1];
      bolts.push({
        id: i,
        x1: c1 * 50 + 25,
        y1: r1 * 50 + 25,
        x2: c2 * 50 + 25,
        y2: r2 * 50 + 25,
      });
    }
    setLightningBolts(bolts);

    // Flash effect
    setLightningFlash(true);
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setLightningFlash(false));

    // Lightning bolt animation
    Animated.sequence([
      Animated.timing(lightningOpacity, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(lightningOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setLightningBolts([]));
  };

  useEffect(() => {
    if (selectedBubbles.size >= 2) {
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    } else {
      Animated.spring(buttonScaleAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedBubbles.size]);

  const handleBubblePress = (row: number, col: number) => {
    const bubble = board[row][col];
    if (bubble === null) return;

    const connected = findConnectedBubbles(board, row, col);
    
    if (connected.length < 2) {
      // Not enough connected bubbles
      setSelectedBubbles(new Set());
      return;
    }

    // Play selection sound
    playSound('select', 1);

    // Highlight connected bubbles
    const bubbleSet = new Set(connected.map(([r, c]) => `${r},${c}`));
    setSelectedBubbles(bubbleSet);
  };

  const handleBubblePop = () => {
    if (selectedBubbles.size < 2) return;

    // Convert selected bubbles back to coordinates
    const positions: [number, number][] = Array.from(selectedBubbles).map(key => {
      const [r, c] = key.split(',').map(Number);
      return [r, c];
    });

    // Calculate score (more bubbles = exponentially more points)
    const poppedCount = positions.length;
    const points = poppedCount * poppedCount * 10;
    setScore(score + points);
    setMoves(moves + 1);
    
    // Play sound effects based on combo size
    if (poppedCount >= 10) {
      playSound('combo', poppedCount / 10);
      playSound('lightning', 1);
      // Trigger lightning effect for big combos
      triggerLightningEffect(positions);
    } else if (poppedCount >= 5) {
      playSound('combo', poppedCount / 10);
    } else {
      playSound('pop', poppedCount / 3);
    }
    
    // Animate score change
    Animated.sequence([
      Animated.timing(scoreAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scoreAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      }),
    ]).start();

    // Mark bubbles as popping
    const poppingSet = new Set(positions.map(([r, c]) => `${r},${c}`));
    setPoppingBubbles(poppingSet);
    setSelectedBubbles(new Set());

    // Wait for pop animation to complete
    setTimeout(() => {
      setPoppingBubbles(new Set());

      // Remove bubbles and calculate falling positions
      let newBoard = removeBubbles(board, positions);
      
      // Calculate which bubbles will fall and from where
      const fallingMap = new Map<string, { fromRow: number, toRow: number }>();
      const boardSize = newBoard.length;
      
      // For each column, track falling bubbles
      for (let col = 0; col < newBoard[0].length; col++) {
        let writeRow = boardSize - 1;
        
        // Start from bottom, find where bubbles will land
        for (let row = boardSize - 1; row >= 0; row--) {
          if (newBoard[row][col] !== null) {
            if (row !== writeRow) {
              fallingMap.set(`${writeRow},${col}`, { fromRow: row, toRow: writeRow });
            }
            writeRow--;
          }
        }
      }
      
      setFallingBubbles(fallingMap);
      
      // Apply gravity and collapse
      newBoard = applyGravity(newBoard);
      newBoard = collapseColumns(newBoard);
      
      setBoard(newBoard);
      
      // Clear falling animation after it completes
      setTimeout(() => {
        setFallingBubbles(new Map());
        checkGameOver(newBoard);
      }, 400);
    }, 300);
  };

  const checkGameOver = (currentBoard: BubbleType[][]) => {
    let hasValidMoves = false;
    
    for (let row = 0; row < currentBoard.length; row++) {
      for (let col = 0; col < currentBoard[row].length; col++) {
        if (currentBoard[row][col] !== null) {
          const connected = findConnectedBubbles(currentBoard, row, col);
          if (connected.length >= 2) {
            hasValidMoves = true;
            break;
          }
        }
      }
      if (hasValidMoves) break;
    }

    if (!hasValidMoves) {
      // Check if board is clear
      const isEmpty = currentBoard.every(row => row.every(cell => cell === null));
      if (isEmpty) {
        const bonus = 5000;
        setScore(s => s + bonus);
        playSound('success', 1);
        Alert.alert(
          '🎉 Perfect Clear! 🎉',
          `Amazing! You cleared the board!\n\nFinal Score: ${score + bonus}\nMoves: ${moves}`,
          [
            { text: 'Play Again', onPress: resetGame },
            { text: 'Main Menu', onPress: () => navigation.goBack() }
          ]
        );
      } else {
        Alert.alert(
          'Game Over',
          `No more moves!\n\nFinal Score: ${score}\nMoves: ${moves}`,
          [
            { text: 'Play Again', onPress: resetGame },
            { text: 'Main Menu', onPress: () => navigation.goBack() }
          ]
        );
      }
    }
  };

  const resetGame = () => {
    playSound('button', 1);
    setBoard(generateBoard(config.size, config.colors));
    setScore(0);
    setMoves(0);
    setSelectedBubbles(new Set());
  };

  // Generate wood grain pattern
  const woodGrainLines = Array.from({ length: 30 }, (_, i) => ({
    key: i,
    top: (i * 100) / 30 + '%',
    opacity: Math.random() * 0.15 + 0.05,
    height: Math.random() * 3 + 1,
  }));

  return (
    <View style={styles.container}>
      {/* Base wood color */}
      <LinearGradient
        colors={['#5d4037', '#6d4c41', '#5d4037', '#4e342e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Wood grain texture */}
      <View style={StyleSheet.absoluteFill}>
        {woodGrainLines.map((line) => (
          <View
            key={line.key}
            style={[
              styles.woodGrain,
              {
                top: line.top as any,
                opacity: line.opacity,
                height: line.height,
              },
            ]}
          />
        ))}
      </View>
      
      {/* Subtle wood highlights */}
      <LinearGradient
        colors={['rgba(139, 90, 43, 0.3)', 'transparent', 'rgba(101, 67, 33, 0.2)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
      />

      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>⭐ SCORE</Text>
          <Animated.Text
            style={[
              styles.statValue,
              { transform: [{ scale: scoreAnim }] },
            ]}
          >
            {score.toLocaleString()}
          </Animated.Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>🎯 MOVES</Text>
          <Text style={styles.statValue}>{moves}</Text>
        </View>
        <TouchableOpacity onPress={resetGame}>
          <LinearGradient
            colors={['#eb3349', '#f45c43']}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>🔄</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      <GameBoard
        board={board}
        selectedBubbles={selectedBubbles}
        poppingBubbles={poppingBubbles}
        fallingBubbles={fallingBubbles}
        onBubblePress={handleBubblePress}
        onBubblePop={handleBubblePop}
      />

      {/* Lightning flash overlay */}
      {lightningFlash && (
        <Animated.View
          style={[
            styles.lightningFlash,
            {
              opacity: flashAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.6],
              }),
            },
          ]}
        />
      )}

      {/* Lightning bolts */}
      {lightningBolts.length > 0 && (
        <Animated.View style={[styles.lightningContainer, { opacity: lightningOpacity }]}>
          {lightningBolts.map((bolt) => (
            <View key={bolt.id}>
              {/* Main lightning bolt */}
              <View
                style={[
                  styles.lightningBolt,
                  {
                    position: 'absolute',
                    left: Math.min(bolt.x1, bolt.x2),
                    top: Math.min(bolt.y1, bolt.y2),
                    width: Math.abs(bolt.x2 - bolt.x1) || 2,
                    height: Math.abs(bolt.y2 - bolt.y1) || 2,
                    transform: [
                      {
                        rotate: `${Math.atan2(bolt.y2 - bolt.y1, bolt.x2 - bolt.x1)}rad`,
                      },
                    ],
                  },
                ]}
              />
              {/* Glow effect */}
              <View
                style={[
                  styles.lightningGlow,
                  {
                    position: 'absolute',
                    left: Math.min(bolt.x1, bolt.x2) - 2,
                    top: Math.min(bolt.y1, bolt.y2) - 2,
                    width: Math.abs(bolt.x2 - bolt.x1) + 4 || 6,
                    height: Math.abs(bolt.y2 - bolt.y1) + 4 || 6,
                  },
                ]}
              />
            </View>
          ))}
        </Animated.View>
      )}

      {selectedBubbles.size >= 2 && (
        <Animated.View
          style={[
            styles.popButtonContainer,
            {
              transform: [
                { scale: buttonScaleAnim },
                {
                  translateY: buttonScaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
              opacity: buttonScaleAnim,
            },
          ]}
        >
          <TouchableOpacity onPress={handleBubblePop} activeOpacity={0.8}>
            <LinearGradient
              colors={['#56ab2f', '#a8e063']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.popButton}
            >
              <View style={styles.popButtonHighlight} />
              <Text style={styles.popButtonEmoji}>💥</Text>
              <Text style={styles.popButtonText}>
                POP {selectedBubbles.size} BUBBLES
              </Text>
              <Text style={styles.popButtonPoints}>
                +{selectedBubbles.size * selectedBubbles.size * 10} points
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  woodGrain: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#3e2723',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  statContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 100,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 24,
  },
  popButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  popButton: {
    padding: 25,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    position: 'relative',
  },
  popButtonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
  },
  popButtonEmoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  popButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  popButtonPoints: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 5,
    opacity: 0.95,
  },
  lightningFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    pointerEvents: 'none',
  },
  lightningContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  lightningBolt: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
  lightningGlow: {
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
});
