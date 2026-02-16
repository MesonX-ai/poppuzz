/**
 * Pop Puzzle - Bubble Component
 * @author Shiva R Dhanuskodi - MesonX
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  color: number | null;
  size: number;
  isSelected: boolean;
  isPopping?: boolean;
  fallingFrom?: number;
  currentRow?: number;
  onPress: () => void;
}

// Candy Crush-inspired vibrant color gradients
const BUBBLE_COLORS = [
  { colors: ['#FF6B9D', '#C44569'] as const, name: 'Pink' },
  { colors: ['#4FACFE', '#00F2FE'] as const, name: 'Blue' },
  { colors: ['#FFA726', '#FB8C00'] as const, name: 'Orange' },
  { colors: ['#43E97B', '#38F9D7'] as const, name: 'Green' },
  { colors: ['#FA709A', '#FEE140'] as const, name: 'Sunset' },
  { colors: ['#A18CD1', '#FBC2EB'] as const, name: 'Purple' },
];

export default function Bubble({ color, size, isSelected, isPopping = false, fallingFrom, currentRow, onPress }: Props) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const bounceAnim = React.useRef(new Animated.Value(0)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;
  const popAnim = React.useRef(new Animated.Value(1)).current;
  const fallAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  
  // Particle animations for pop effect
  const particles = React.useRef(
    Array.from({ length: 8 }, () => ({
      scale: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  // Pop animation
  React.useEffect(() => {
    if (isPopping) {
      // Bubble shrink and rotate
      Animated.parallel([
        Animated.timing(popAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Particle burst
      const particleAnimations = particles.map((particle, index) => {
        const angle = (index / particles.length) * Math.PI * 2;
        const distance = size * 0.6;
        
        return Animated.parallel([
          Animated.timing(particle.scale, {
            toValue: 1,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateX, {
            toValue: Math.cos(angle) * distance,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateY, {
            toValue: Math.sin(angle) * distance,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 1,
              duration: 40,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 210,
              useNativeDriver: true,
            }),
          ]),
        ]);
      });
      
      Animated.parallel(particleAnimations).start();
    } else {
      popAnim.setValue(1);
      rotateAnim.setValue(0);
      particles.forEach(particle => {
        particle.scale.setValue(0);
        particle.translateX.setValue(0);
        particle.translateY.setValue(0);
        particle.opacity.setValue(0);
      });
    }
  }, [isPopping]);

  // Fall animation
  React.useEffect(() => {
    if (fallingFrom !== undefined && currentRow !== undefined && fallingFrom !== currentRow) {
      const distance = currentRow - fallingFrom;
      fallAnim.setValue(-distance);
      
      Animated.spring(fallAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 40,
      }).start();
    } else {
      fallAnim.setValue(0);
    }
  }, [fallingFrom, currentRow]);

  // Idle bounce animation
  React.useEffect(() => {
    if (color !== null && !isPopping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [color, isPopping]);

  // Selection glow animation
  React.useEffect(() => {
    if (isSelected) {
      Animated.parallel([
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1.15,
            useNativeDriver: true,
            friction: 3,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1.08,
            useNativeDriver: true,
            friction: 5,
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      glowAnim.stopAnimation();
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
      }).start();
    }
  }, [isSelected]);

  if (color === null) {
    return <View style={[styles.emptyBubble, { width: size, height: size }]} />;
  }

  const bubbleColorSet = BUBBLE_COLORS[color % BUBBLE_COLORS.length];
  const primaryColor = bubbleColorSet.colors[0];
  
  const bounceTranslate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  const popScale = popAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const popRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const fallTranslate = fallAnim.interpolate({
    inputRange: [-10, 0],
    outputRange: [-size * 10, 0],
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={isPopping}>
      <Animated.View
        style={[
          styles.bubbleContainer,
          {
            width: size,
            height: size,
            transform: [
              { translateY: Animated.add(bounceTranslate, fallTranslate) },
              { scale: Animated.multiply(scaleAnim, popScale) },
              { rotate: popRotate },
            ],
            opacity: popAnim,
          },
        ]}
      >
        {/* Particle burst effects */}
        {isPopping && particles.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                backgroundColor: primaryColor,
                transform: [
                  { translateX: particle.translateX },
                  { translateY: particle.translateY },
                  { scale: particle.scale },
                ],
                opacity: particle.opacity,
              },
            ]}
          />
        ))}
        
        {/* Glow effect for selected bubbles */}
        {isSelected && !isPopping && (
          <Animated.View
            style={[
              styles.glow,
              {
                width: size * 1.4,
                height: size * 1.4,
                borderRadius: size * 0.7,
                opacity: glowOpacity,
              },
            ]}
          />
        )}
        
        {/* Main bubble with gradient */}
        <LinearGradient
          colors={bubbleColorSet.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.bubble,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          {/* Top highlight for 3D effect */}
          <View
            style={[
              styles.topHighlight,
              {
                width: size * 0.45,
                height: size * 0.45,
                borderRadius: size * 0.225,
              },
            ]}
          />
          
          {/* Main shine */}
          <View
            style={[
              styles.shine,
              {
                width: size * 0.35,
                height: size * 0.35,
                borderRadius: size * 0.175,
              },
            ]}
          />
          
          {/* Bottom shadow for depth */}
          <View
            style={[
              styles.innerShadow,
              {
                width: size * 0.8,
                height: size * 0.2,
                borderRadius: size * 0.4,
              },
            ]}
          />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  emptyBubble: {
    margin: 2,
  },
  bubbleContainer: {
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 4,
  },
  bubble: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  glow: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 20,
  },
  topHighlight: {
    position: 'absolute',
    top: '8%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  shine: {
    position: 'absolute',
    top: '12%',
    left: '15%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  innerShadow: {
    position: 'absolute',
    bottom: '5%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
});
