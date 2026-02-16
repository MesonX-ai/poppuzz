# Sound Effects & Lightning Effects Guide

## 🎵 Synthesized Sound Effects

The game now features **Web Audio API** synthesized sound effects that work directly in the browser without requiring external audio files!

### Sound Types

1. **Pop Sound** 🎯
   - **When**: Bubbles are popped (2-4 bubbles)
   - **Effect**: Descending sine wave
   - **Pitch**: Increases with combo size
   - **Duration**: 150ms

2. **Select Sound** 👆
   - **When**: Tapping a bubble group
   - **Effect**: Quick click/beep
   - **Duration**: 50ms
   - **Volume**: Soft (15%)

3. **Combo Sound** 🌟
   - **When**: 5-9 bubbles popped
   - **Effect**: Ascending arpeggio (C-E-G-C progression)
   - **Duration**: 320ms
   - **Notes**: Musical chord progression

4. **Lightning Combo** ⚡
   - **When**: 10+ bubbles popped
   - **Effect**: Electric zap + combo sounds
   - **Special**: Triggers visual lightning bolts
   - **Duration**: 150ms

5. **Button Press** 🔘
   - **When**: Buttons pressed (reset, difficulty selection)
   - **Effect**: Descending square wave
   - **Duration**: 80ms

6. **Success Fanfare** 🎉
   - **When**: Perfect clear achieved
   - **Effect**: Victory arpeggio (5 ascending notes)
   - **Duration**: 500ms
   - **Notes**: C5-E5-G5-C6-E6

## ⚡ Lightning Visual Effects

### Flash Effect
- **Trigger**: 10+ bubble combos
- **Visual**: Full-screen white flash
- **Opacity**: 0→60%→0
- **Duration**: 250ms
- **Purpose**: Dramatic emphasis on big combos

### Lightning Bolts
- **Appearance**: Golden electric bolts
- **Connection**: Links all popped bubbles in sequence
- **Color**: `#FFD700` (Gold)
- **Glow**: Soft shadow with 15px radius
- **Animation**: 
  - Fade in: 50ms
  - Hold: 100ms
  - Fade out: 250ms
- **Total Duration**: 400ms

### Lightning Bolt Features
- **Dynamic positioning**: Calculated between bubble centers
- **Multiple bolts**: One for each bubble connection
- **Layered effect**: Main bolt + glow layer
- **Non-interactive**: Pointer events disabled (won't block gameplay)

## 🎮 Interactive Feedback System

### Home Screen
- **Button hover**: Upward swoosh (300Hz → 600Hz)
- **Animated bubbles**: Visual feedback with sound on interaction
- **Difficulty selection**: Confirmation sound on tap

### Game Screen
- **Bubble selection**: Immediate audio feedback
- **Score popup**: Animated with scale effect
- **Combo cascade**: Increasing intensity sounds
- **Game over**: Success fanfare or silence based on outcome

## 🔧 Technical Implementation

### Web Audio Context
```javascript
// Initialized on component mount
const audioContext = new (window.AudioContext || webkitAudioContext)();

// Properly cleaned up on unmount
audioContext.close();
```

### Sound Synthesis
- **No external files required**: All sounds generated in real-time
- **Low latency**: Instant playback
- **Customizable**: Pitch and volume vary by game state
- **Cross-browser**: Works in Chrome, Firefox, Safari, Edge

### Performance
- **Lightweight**: No audio file loading
- **Efficient**: Oscillators auto-dispose after playback
- **Non-blocking**: Sounds don't affect game performance
- **Memory safe**: Proper cleanup prevents leaks

## 🎨 Visual Enhancements

### Combo Size Thresholds
- **2-4 bubbles**: Basic pop sound + standard animation
- **5-9 bubbles**: Combo arpeggio + enhanced animation
- **10+ bubbles**: Lightning + flash + combo sounds + particle effects

### Animation Coordination
1. Bubble selection highlight
2. Sound effect plays
3. Pop animation starts
4. (If combo) Lightning bolts appear
5. (If combo) Screen flash
6. Score updates with scale animation
7. Gravity/falling animations
8. Check for game over

## 🌟 User Experience Features

### Haptic-like Feedback
- Immediate audio response creates tactile feel
- Different sounds for different actions
- Increasing intensity rewards skill

### Visual Clarity
- Lightning only appears for significant combos
- Prevents visual overload on small moves
- Enhances excitement for achievements

### Accessibility
- Visual effects paired with audio
- No audio dependency for gameplay
- Clear visual indicators for all actions

## 🚀 Future Enhancements

Potential additions:
- Spatial audio (panning based on bubble position)
- Background ambient music layers
- Customizable sound themes
- Volume controls in settings
- Vibration API integration for mobile
- More elaborate particle systems for mega combos
