/**
 * Pop Puzzle - Home Screen
 * @author Shiva R Dhanuskodi - MesonX
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Audio } from 'expo-av';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const { width } = Dimensions.get('window');

// Bubble animation types
type BubbleAnimationType = 'popOut' | 'popIn' | 'burst';

interface AnimatedBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  animationType: BubbleAnimationType;
  scale: Animated.Value;
  opacity: Animated.Value;
  particles?: Array<{
    x: Animated.Value;
    y: Animated.Value;
    opacity: Animated.Value;
  }>;
}

export default function HomeScreen({ navigation }: Props) {
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [animatedBubbles, setAnimatedBubbles] = React.useState<AnimatedBubble[]>([]);
  const [sound, setSound] = React.useState<Audio.Sound>();
  const audioContext = React.useRef<AudioContext | null>(null);

  // Initialize audio context
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Play button sound
  const playButtonSound = () => {
    if (!audioContext.current) return;

    const ctx = audioContext.current;
    const now = ctx.currentTime;

    // Upward swoosh sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, now);
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  };

  // Generate animated bubbles
  React.useEffect(() => {
    const bubbleColors = [
      'rgba(255, 107, 157, 0.6)',
      'rgba(79, 172, 254, 0.6)',
      'rgba(255, 167, 38, 0.6)',
      'rgba(67, 233, 123, 0.6)',
      'rgba(250, 112, 154, 0.6)',
      'rgba(161, 140, 209, 0.6)',
    ];

    const animationTypes: BubbleAnimationType[] = ['popOut', 'popIn', 'burst'];
    const bubbles: AnimatedBubble[] = [];

    // Create 15 animated bubbles
    for (let i = 0; i < 15; i++) {
      const animationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
      const bubble: AnimatedBubble = {
        id: i,
        x: Math.random() * width,
        y: Math.random() * 100 + (i * 50),
        size: Math.random() * 60 + 40,
        color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
        animationType,
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };

      // Add particles for burst animation
      if (animationType === 'burst') {
        bubble.particles = Array.from({ length: 8 }, () => ({
          x: new Animated.Value(0),
          y: new Animated.Value(0),
          opacity: new Animated.Value(0),
        }));
      }

      bubbles.push(bubble);
    }

    setAnimatedBubbles(bubbles);
  }, []);

  // Animate bubbles
  React.useEffect(() => {
    animatedBubbles.forEach((bubble, index) => {
      const delay = index * 300;

      if (bubble.animationType === 'popOut') {
        // Pop out: scale from 0 to 1, then pulse
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.spring(bubble.scale, {
              toValue: 1,
              friction: 3,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.timing(bubble.opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          // After pop out, pulse continuously
          Animated.loop(
            Animated.sequence([
              Animated.timing(bubble.scale, {
                toValue: 1.1,
                duration: 2000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(bubble.scale, {
                toValue: 1,
                duration: 2000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ])
          ).start();
        });
      } else if (bubble.animationType === 'popIn') {
        // Pop in: scale from 1.5 to 1, then float
        bubble.scale.setValue(1.5);
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.spring(bubble.scale, {
              toValue: 1,
              friction: 5,
              tension: 60,
              useNativeDriver: true,
            }),
            Animated.timing(bubble.opacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      } else if (bubble.animationType === 'burst') {
        // Burst: appear then explode into particles
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.spring(bubble.scale, {
              toValue: 1,
              useNativeDriver: true,
            }),
            Animated.timing(bubble.opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(2000),
          // Burst animation
          Animated.parallel([
            Animated.timing(bubble.scale, {
              toValue: 1.3,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(bubble.opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            ...(bubble.particles?.flatMap((particle, pIndex) => {
              const angle = (pIndex / 8) * Math.PI * 2;
              const distance = 50;
              return [
                Animated.timing(particle.x, {
                  toValue: Math.cos(angle) * distance,
                  duration: 500,
                  useNativeDriver: true,
                }),
                Animated.timing(particle.y, {
                  toValue: Math.sin(angle) * distance,
                  duration: 500,
                  useNativeDriver: true,
                }),
                Animated.sequence([
                  Animated.timing(particle.opacity, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                  }),
                  Animated.timing(particle.opacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                  }),
                ]),
              ];
            }) || []),
          ]),
        ]).start(() => {
          // Reset and repeat
          setTimeout(() => {
            bubble.scale.setValue(0);
            bubble.opacity.setValue(0);
            bubble.particles?.forEach(p => {
              p.x.setValue(0);
              p.y.setValue(0);
              p.opacity.setValue(0);
            });
            // Restart animation
            Animated.sequence([
              Animated.parallel([
                Animated.spring(bubble.scale, {
                  toValue: 1,
                  useNativeDriver: true,
                }),
                Animated.timing(bubble.opacity, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }),
              ]),
              Animated.delay(2000),
              Animated.parallel([
                Animated.timing(bubble.scale, {
                  toValue: 1.3,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(bubble.opacity, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]),
            ]).start();
          }, 1000);
        });
      }
    });
  }, [animatedBubbles]);

  // Play background music
  React.useEffect(() => {
    let isMounted = true;

    async function playMusic() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        // Note: In a real app, you would load an actual music file
        // const { sound } = await Audio.Sound.createAsync(
        //   require('../../assets/sounds/background-music.mp3'),
        //   { isLooping: true, volume: 0.3 }
        // );
        // if (isMounted) {
        //   setSound(sound);
        //   await sound.playAsync();
        // }
      } catch (error) {
        console.log('Error playing music:', error);
      }
    }

    playMusic();

    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  React.useEffect(() => {
    // Floating animation for title
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for buttons
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const startGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    playButtonSound();
    navigation.navigate('Game', { difficulty });
  };

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Animated bubbles in background */}
      <View style={styles.decorativeBubbles}>
        {animatedBubbles.map((bubble) => (
          <Animated.View
            key={bubble.id}
            style={[
              styles.animatedBubble,
              {
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
                borderRadius: bubble.size / 2,
                backgroundColor: bubble.color,
                transform: [{ scale: bubble.scale }],
                opacity: bubble.opacity,
              },
            ]}
          >
            {/* Highlight for 3D effect */}
            <View
              style={[
                styles.bubbleHighlight,
                {
                  width: bubble.size * 0.4,
                  height: bubble.size * 0.4,
                  borderRadius: bubble.size * 0.2,
                },
              ]}
            />
            
            {/* Burst particles */}
            {bubble.animationType === 'burst' && bubble.particles?.map((particle, pIndex) => (
              <Animated.View
                key={pIndex}
                style={[
                  styles.particle,
                  {
                    transform: [
                      { translateX: particle.x },
                      { translateY: particle.y },
                    ],
                    opacity: particle.opacity,
                    backgroundColor: bubble.color,
                  },
                ]}
              />
            ))}
          </Animated.View>
        ))}
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.titleContainer,
            { transform: [{ translateY: floatTranslate }] },
          ]}
        >
          <Text style={styles.emoji}>🎈</Text>
          <Text style={styles.title}>Pop Puzzle</Text>
          <View style={styles.titleUnderline} />
        </Animated.View>
        
        <Text style={styles.subtitle}>Match & Pop Bubbles!</Text>

        <View style={styles.buttonContainer}>
          <DifficultyButton
            onPress={() => startGame('easy')}
            title="Easy"
            subtitle="6×6 Grid • 4 Colors"
            colors={['#56ab2f', '#a8e063']}
            pulseAnim={pulseAnim}
          />

          <DifficultyButton
            onPress={() => startGame('medium')}
            title="Medium"
            subtitle="8×8 Grid • 5 Colors"
            colors={['#f2994a', '#f2c94c']}
            pulseAnim={pulseAnim}
            delay={200}
          />

          <DifficultyButton
            onPress={() => startGame('hard')}
            title="Hard"
            subtitle="10×10 Grid • 6 Colors"
            colors={['#eb3349', '#f45c43']}
            pulseAnim={pulseAnim}
            delay={400}
          />
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>🎯 How to Play</Text>
          <Text style={styles.instructionsText}>
            ✨ Tap groups of matching bubbles{'\n'}
            💎 Bigger combos = more points{'\n'}
            🏆 Clear the board for mega bonus!
          </Text>
        </View>

        <View style={styles.credits}>
          <Text style={styles.creditsText}>Created by</Text>
          <Text style={styles.creditsName}>Shiva R Dhanuskodi</Text>
          <Text style={styles.creditsCompany}>MesonX</Text>
        </View>

        <TouchableOpacity
          style={styles.privacyButton}
          onPress={() => {
            playButtonSound();
            navigation.navigate('PrivacyPolicy');
          }}
        >
          <Text style={styles.privacyButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

interface DifficultyButtonProps {
  onPress: () => void;
  title: string;
  subtitle: string;
  colors: readonly [string, string, ...string[]];
  pulseAnim: Animated.Value;
  delay?: number;
}

function DifficultyButton({ onPress, title, subtitle, colors, pulseAnim, delay = 0 }: DifficultyButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <View style={styles.buttonHighlight} />
          <Text style={styles.buttonText}>{title}</Text>
          <Text style={styles.buttonSubtext}>{subtitle}</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeBubbles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  animatedBubble: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  bubbleHighlight: {
    position: 'absolute',
    top: '15%',
    left: '20%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: '50%',
    left: '50%',
    marginLeft: -4,
    marginTop: -4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  titleUnderline: {
    width: 120,
    height: 5,
    backgroundColor: '#fff',
    borderRadius: 3,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 50,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 350,
    gap: 20,
  },
  button: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonGradient: {
    paddingVertical: 25,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    position: 'relative',
  },
  buttonHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    zIndex: 1,
  },
  buttonSubtext: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    zIndex: 1,
  },
  instructions: {
    marginTop: 60,
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    maxWidth: 350,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 28,
    fontWeight: '500',
  },
  credits: {
    marginTop: 40,
    alignItems: 'center',
    paddingVertical: 20,
  },
  creditsText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginBottom: 5,
    letterSpacing: 1,
  },
  creditsName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 3,
  },
  creditsCompany: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  privacyButton: {
    marginTop: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  privacyButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
});
