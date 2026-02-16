# 🚀 Quick Start Guide

Get Pop Puzzle up and running in 5 minutes!

## Step 1: Verify Installation

Run the verification script:
```bash
node test-logic.js
```

You should see all files marked with ✓

## Step 2: Start the Development Server

```bash
npm start
```

This will:
- Start the Metro bundler
- Show a QR code in your terminal
- Open Expo DevTools in your browser

## Step 3: Run on Your Device

### Option A: Use Expo Go (Easiest)

1. Install **Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code:
   - **iOS**: Use Camera app
   - **Android**: Use Expo Go app

3. Wait for the app to load and start playing!

### Option B: Use Simulator/Emulator

**iOS Simulator** (macOS only):
```bash
npm run ios
```

**Android Emulator**:
1. Start Android Studio
2. Launch an AVD (Android Virtual Device)
3. Run:
```bash
npm run android
```

**Web Browser**:
```bash
npm run web
```

## Troubleshooting

### Port already in use
```bash
# Kill the process on port 8081
lsof -ti:8081 | xargs kill -9
# Or use a different port
npx expo start --port 8082
```

### Cache issues
```bash
# Clear cache and restart
npx expo start --clear
```

### Metro bundler errors
```bash
# Reset Metro bundler cache
rm -rf node_modules/.cache
npx expo start --clear
```

### Node modules issues
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Hot Reload
- Shake your device or press Ctrl+M (Android) / Cmd+D (iOS)
- Select "Enable Fast Refresh"

### Debug Menu
- Physical Device: Shake
- iOS Simulator: Cmd+D
- Android Emulator: Cmd+M (Mac) / Ctrl+M (Windows)

### Performance
- Use "Debug Remote JS" for debugging in Chrome DevTools
- Use "Toggle Performance Monitor" to see FPS and memory

## Next Steps

Once the app is running:
1. Play the game and test all difficulty levels
2. Customize colors in [src/components/Bubble.tsx](src/components/Bubble.tsx)
3. Adjust difficulty in [src/screens/GameScreen.tsx](src/screens/GameScreen.tsx)
4. Design custom icons (see [assets/README.md](assets/README.md))
5. Prepare for production build (see main [README.md](README.md))

## Need Help?

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Report Issues](https://github.com/anishiv/poppuzz/issues)

Happy coding! 🎈
