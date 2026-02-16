# Quick Build Reference - Pop Puzzle

Fast reference guide for building and publishing Pop Puzzle.

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/anishiv/poppuzz.git
cd poppuzz
npm install

# Run locally
npm run web          # Browser
npm run ios          # iOS Simulator (macOS only)
npm run android      # Android Emulator
```

## 📦 Production Builds

### Prerequisites

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Initialize project (first time only)
eas init
```

### Build Commands

```bash
# Build for iOS (App Store)
eas build --platform ios --profile production

# Build for Android (Google Play)
eas build --platform android --profile production

# Build both platforms
eas build --platform all --profile production

# Preview build (for testing)
eas build --platform android --profile preview  # APK
eas build --platform ios --profile preview      # Simulator
```

### Submit to Stores

```bash
# Submit to App Store
eas submit --platform ios --profile production

# Submit to Google Play
eas submit --platform android --profile production
```

### Check Build Status

```bash
# List all builds
eas build:list

# View specific build
eas build:view [build-id]

# View credentials
eas credentials
```

## 📝 Version Management

Before building a new version, update `app.json`:

```json
{
  "expo": {
    "version": "1.1.0",          // App version
    "ios": {
      "buildNumber": "2"          // iOS build number
    },
    "android": {
      "versionCode": 2            // Android version code
    }
  }
}
```

## 🔑 Credentials Management

```bash
# View all credentials
eas credentials

# Configure iOS credentials
eas credentials --platform ios

# Configure Android credentials
eas credentials --platform android

# Generate new keystore (Android)
eas credentials --platform android

# Manage certificates (iOS)
eas credentials --platform ios
```

## 🧪 Testing

```bash
# Test on physical device with Expo Go
npm start
# Scan QR code with Expo Go app

# Internal testing (production build)
eas build --platform android --profile preview
# Install APK on device

# TestFlight (iOS)
eas build --platform ios --profile production
eas submit --platform ios
# Add testers in App Store Connect
```

## 📊 Build Profiles

Defined in `eas.json`:

- **development:** Development client build
- **preview:** Internal testing (APK for Android, Simulator for iOS)
- **production:** Final build for stores (AAB for Android, IPA for iOS)

## 🔍 Troubleshooting

### Build Fails

```bash
# Clear cache and retry
eas build --platform [ios/android] --profile production --clear-cache

# Check credentials
eas credentials --platform [ios/android]

# View build logs
eas build:view [build-id]
```

### Bundle ID Already Exists

Update in `app.json`:
```json
"ios": {
  "bundleIdentifier": "com.yourcompany.poppuzzle"
},
"android": {
  "package": "com.yourcompany.poppuzzle"
}
```

### Keystore Lost (Android)

⚠️ **CRITICAL:** If you lose your Android keystore, you cannot update the app!

To prevent this:
1. EAS automatically manages keystores
2. Download from: `eas credentials --platform android`
3. Store securely in password manager

## 📱 Store Links

Update in `app.json` after approval:

```json
"ios": {
  "appStoreUrl": "https://apps.apple.com/app/poppuzzle/idXXXXXXXXX"
},
"android": {
  "playStoreUrl": "https://play.google.com/store/apps/details?id=com.mesonx.poppuzzle"
}
```

## 🎯 Pre-Release Checklist

- [ ] Version numbers incremented
- [ ] All features tested
- [ ] No console errors or warnings
- [ ] Privacy policy updated (if needed)
- [ ] Release notes written
- [ ] Screenshots updated (if UI changed)
- [ ] Build successful
- [ ] Test build on physical device

## 📖 Full Documentation

For detailed instructions, see:
- **[Publishing Guide](PUBLISHING_GUIDE.md)** - Complete step-by-step guide
- **[Store Listing](STORE_LISTING.md)** - Marketing materials and descriptions

## 🆘 Support

- **GitHub Issues:** https://github.com/anishiv/poppuzz/issues
- **Expo Forums:** https://forums.expo.dev/
- **Email:** privacy@mesonsoft.com

---

**Last Updated:** February 16, 2026  
**Version:** 1.0.0
