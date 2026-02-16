# 🎈 Pop Puzzle

A fun and addictive bubble-popping puzzle game built with React Native and Expo. Match and pop colored bubbles to score points!

<p align="center">
  <img src="assets/icon.png" alt="Pop Puzzle" width="200"/>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey)]()
[![Version](https://img.shields.io/badge/version-1.0.0-green)]()
[![Store Ready](https://img.shields.io/badge/store-ready-success)]()

## 🚀 Ready for App Stores!

**Pop Puzzle is fully configured and ready for publishing!**  
📖 See [APP_STORE_READY.md](APP_STORE_READY.md) for complete details.

All documentation, configurations, and assets are ready. Just need screenshots and developer accounts to publish!

## 📱 Download

*Coming soon to:*
- 🍎 [Apple App Store](#) - Pending Review
- 🤖 [Google Play Store](#) - Pending Review

## 📚 Documentation

- **⭐ [APP STORE READY](APP_STORE_READY.md)** - **START HERE!** Complete readiness summary
- **[Publishing Guide](PUBLISHING_GUIDE.md)** - Complete guide to publish on App Store and Google Play
- **[Build Reference](BUILD_REFERENCE.md)** - Quick command reference for building and deploying
- **[App Store Checklist](APP_STORE_CHECKLIST.md)** - Comprehensive pre-launch checklist
- **[Store Listing](STORE_LISTING.md)** - App store descriptions and marketing materials
- **[Privacy Policy](PRIVACY_POLICY.md)** - Our commitment to your privacy
- **[Contributing](CONTRIBUTING.md)** - How to contribute to the project

## 🎮 Features

- **3 Difficulty Levels**: Easy (6x6), Medium (8x8), Hard (10x10)
- **Colorful Bubbles**: 4-6 different colors depending on difficulty
- **Smart Scoring**: Larger groups earn exponentially more points
- **Physics**: Realistic gravity and column collapse mechanics
- **Perfect Clear Bonus**: 5000 points for clearing the entire board
- **Responsive Design**: Works great on all screen sizes
- **Cross-Platform**: Runs on iOS, Android, and Web

## 🎯 How to Play

1. Tap on a group of 2 or more adjacent bubbles of the same color
2. The selected bubbles will be highlighted
3. Tap the "Pop" button to remove them and score points
4. Bubbles above will fall down due to gravity
5. Empty columns will collapse
6. Keep playing until no more valid moves remain
7. Try to clear the entire board for bonus points!

## 📱 Screenshots

*Coming soon - run the app to see it in action!*

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI
- For iOS: macOS with Xcode
- For Android: Android Studio

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anishiv/poppuzz.git
cd poppuzz
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## 🛠️ Development

### Project Structure

```
poppuzz/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Bubble.tsx     # Individual bubble component
│   │   └── GameBoard.tsx  # Game board grid
│   ├── screens/           # App screens
│   │   ├── HomeScreen.tsx # Main menu
│   │   └── GameScreen.tsx # Game play screen
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Game logic utilities
│       └── gameLogic.ts   # Core game algorithms
├── assets/                # App icons and images
├── App.tsx               # Root component
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

## 📦 Building for Production

### Install EAS CLI

```bash
npm install -g eas-cli
```

### Configure EAS

1. Create an Expo account at https://expo.dev
2. Login to EAS:
```bash
eas login
```

3. Configure your project:
```bash
eas build:configure
```

### Build for Android

```bash
# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Google Play Store
eas build --platform android --profile production
```

### Build for iOS

```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Build for App Store
eas build --platform ios --profile production
```

## 🏪 Publishing

### Google Play Store

1. Create a Google Play Developer account ($25 one-time fee)
2. Build production AAB: `eas build --platform android --profile production`
3. Go to [Google Play Console](https://play.google.com/console)
4. Create a new app
5. Upload the AAB file
6. Fill in store listing details
7. Submit for review

**Required Assets for Google Play:**
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots (2-8 images)
- Short description (80 chars)
- Full description (4000 chars)

### Apple App Store

1. Enroll in Apple Developer Program ($99/year)
2. Build production IPA: `eas build --platform ios --profile production`
3. Go to [App Store Connect](https://appstoreconnect.apple.com)
4. Create a new app
5. Upload build using EAS Submit: `eas submit --platform ios`
6. Fill in app information
7. Submit for review

**Required Assets for App Store:**
- App icon (1024x1024)
- Screenshots for all device sizes
- App preview video (optional but recommended)
- App description
- Keywords
- Privacy policy URL

## 🎨 Customizing Assets

The current app icons are placeholders. To create professional icons:

1. Design your icon (1024x1024px)
2. Use a tool like [AppIcon.co](https://www.appicon.co/) to generate all sizes
3. Replace files in the `assets/` folder
4. Update `app.json` if needed

## 🔧 Configuration

Edit [app.json](app.json) to customize:
- App name and slug
- Bundle identifiers
- Version numbers
- Splash screen colors
- Orientation settings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Future Enhancements

- [ ] Add sound effects and music
- [ ] Implement power-ups and special bubbles
- [ ] Add level progression and challenges
- [ ] Include leaderboards and achievements
- [ ] Add daily challenges
- [ ] Implement coin system and shop
- [ ] Add different game modes (timed, moves-limited)
- [ ] Social sharing features

## 🐛 Known Issues

None at the moment! Please report any bugs you find.

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- Powered by [React Native](https://reactnative.dev)
- Navigation by [React Navigation](https://reactnavigation.org)

## 👨‍💻 Author

**Shiva R Dhanuskodi**  
[MesonX](https://mesonsoft.com)

Created with ❤️ for puzzle game enthusiasts worldwide.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ and 🎈

**Ready to pop some bubbles? Start playing now!**
