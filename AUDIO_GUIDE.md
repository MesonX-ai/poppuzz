# Audio Guide for Pop Puzzle

## Background Music and Sound Effects

The app is configured to play background music and sound effects, but the actual audio files need to be added.

### Setup Instructions

1. **Create the sounds directory:**
   ```bash
   mkdir -p assets/sounds
   ```

2. **Add audio files:**
   - `background-music.mp3` - Looping background music for the home screen
   - `pop.mp3` - Sound effect when bubbles pop

3. **Recommended Audio Specifications:**
   - Format: MP3 or M4A
   - Background Music: 
     - Duration: 30-60 seconds (looping)
     - Bitrate: 128 kbps
     - Volume: Keep it subtle, around 30% max
   - Pop Sound:
     - Duration: 0.2-0.5 seconds
     - Bitrate: 64 kbps
     - Pitch: Higher pitch for more bubbles popped

4. **Uncomment the audio code:**

   In `src/screens/HomeScreen.tsx`:
   ```typescript
   // Uncomment these lines around line 253:
   const { sound } = await Audio.Sound.createAsync(
     require('../../assets/sounds/background-music.mp3'),
     { isLooping: true, volume: 0.3 }
   );
   if (isMounted) {
     setSound(sound);
     await sound.playAsync();
   }
   ```

   In `src/screens/GameScreen.tsx`:
   ```typescript
   // Uncomment these lines in the playPopSound function:
   const { sound } = await Audio.Sound.createAsync(
     require('../../assets/sounds/pop.mp3'),
     { volume: Math.min(1, 0.3 + count * 0.05) }
   );
   await sound.playAsync();
   setTimeout(() => sound.unloadAsync(), 1000);
   ```

5. **Free Audio Resources:**
   - Background Music: [Incompetech](https://incompetech.com/music/royalty-free/)
   - Sound Effects: [Freesound](https://freesound.org/)
   - Game Sounds: [OpenGameArt](https://opengameart.org/)

## Bubble Animations

The app features three types of bubble animations on the home screen:

### 1. Pop Out Animation
- Bubbles scale from 0 to 1
- Spring physics for bouncy effect
- Continuous pulsing after appearing

### 2. Pop In Animation
- Bubbles scale from 1.5 to 1
- Shrinking effect with spring physics
- Creates impression of coming from distance

### 3. Burst Animation
- Bubbles appear normally
- After 2 seconds, explode into 8 particles
- Particles radiate outward and fade
- Animation loops continuously

All animations are staggered with 300ms delays between each bubble for a cascading effect.

## Performance Considerations

- Audio is set to not play in silent mode on iOS by default
- Background music has low volume (30%) to not overwhelm
- Pop sound volume increases slightly with combo size
- All animations use `useNativeDriver: true` for 60fps performance
- Sound instances are properly cleaned up to prevent memory leaks
