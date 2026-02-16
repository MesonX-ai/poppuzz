# Publishing Guide - Pop Puzzle

Complete step-by-step guide to publishing Pop Puzzle on App Store and Google Play Store.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Prepare Your Development Environment](#prepare-your-development-environment)
3. [Build for Production](#build-for-production)
4. [iOS App Store Publishing](#ios-app-store-publishing)
5. [Google Play Store Publishing](#google-play-store-publishing)
6. [Post-Launch](#post-launch)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

1. **Expo Account** (Free)
   - Sign up at: https://expo.dev/signup
   - Install EAS CLI: `npm install -g eas-cli`
   - Login: `eas login`

2. **Apple Developer Account** (Required for iOS)
   - Cost: $99/year
   - Sign up at: https://developer.apple.com/programs/
   - Wait for approval (can take 24-48 hours)

3. **Google Play Console Account** (Required for Android)
   - Cost: $25 one-time fee
   - Sign up at: https://play.google.com/console
   - Usually instant approval

### System Requirements

- **Node.js** 18+ (check with `node --version`)
- **npm** or **yarn**
- **EAS CLI** (`npm install -g eas-cli`)
- **Git** (for version control)
- **macOS** (for iOS builds - can use EAS Build cloud service instead)

---

## Prepare Your Development Environment

### Step 1: Install Dependencies

```bash
cd /workspaces/poppuzz
npm install
```

### Step 2: Test Locally

```bash
# Test web version
npm run web

# Test iOS (requires macOS and Xcode)
npm run ios

# Test Android (requires Android Studio and emulator)
npm run android
```

### Step 3: Configure EAS

```bash
# Initialize EAS (if not already done)
eas init

# This will prompt you to:
# 1. Login to your Expo account
# 2. Create or link an Expo project
# 3. Update app.json with your project ID
```

Update the `projectId` in `app.json`:
```json
"extra": {
  "eas": {
    "projectId": "your-actual-project-id"
  }
}
```

---

## Build for Production

### Configure Bundle Identifiers

**IMPORTANT:** Bundle identifiers must be unique across all apps.

Current configuration:
- **iOS Bundle ID:** `com.mesonx.poppuzzle`
- **Android Package:** `com.mesonx.poppuzzle`

If these are taken, update in `app.json`:
```json
"ios": {
  "bundleIdentifier": "com.yourcompany.poppuzzle"
},
"android": {
  "package": "com.yourcompany.poppuzzle"
}
```

### Build for iOS

#### Option 1: Using EAS Build (Recommended - No Mac Required)

```bash
# First build (production)
eas build --platform ios --profile production

# This will:
# 1. Ask you to set up Apple credentials
# 2. Generate necessary provisioning profiles
# 3. Build your app in the cloud
# 4. Provide a download link for the .ipa file
```

**Apple Credentials Required:**
- Apple ID (your developer account email)
- App-specific password (generate at appleid.apple.com)
- Team ID (found in Apple Developer portal)

#### Option 2: Local Build (Requires Mac + Xcode)

```bash
# Build locally
eas build --platform ios --profile production --local

# Requirements:
# - macOS with Xcode 14+
# - Apple Developer certificates installed
# - Provisioning profiles configured
```

### Build for Android

```bash
# Build Android App Bundle (for Play Store)
eas build --platform android --profile production

# This will:
# 1. Ask if you want to generate a new keystore (say yes for first build)
# 2. Build an .aab file in the cloud
# 3. Provide a download link

# For testing, build APK instead:
eas build --platform android --profile preview
```

**Important:** Save your Android keystore credentials securely! You'll need them for all future updates.

### Build Both Platforms

```bash
# Build for both iOS and Android
eas build --platform all --profile production
```

### Check Build Status

```bash
# View build status
eas build:list

# View specific build
eas build:view [build-id]
```

---

## iOS App Store Publishing

### Step 1: Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** → **New App**
3. Fill in the details:
   - **Platform:** iOS
   - **Name:** Pop Puzzle
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** com.mesonx.poppuzzle (must match app.json)
   - **SKU:** poppuzzle-101 (unique identifier)
   - **User Access:** Full Access

### Step 2: App Information

Navigate to your app → **App Information** tab:

- **Subtitle:** Match & Pop Colorful Bubbles
- **Privacy Policy URL:** https://github.com/anishiv/poppuzz/blob/main/PRIVACY_POLICY.md
- **Category:**
  - Primary: Games
  - Secondary: Puzzle
- **Age Rating:** 4+
  - Complete the questionnaire (all "No" answers for this game)

### Step 3: Prepare App Store Listing

In the **1.0 Prepare for Submission** section:

#### Screenshots
Upload screenshots for:
- iPhone 6.7" (required) - minimum 3
- iPhone 6.5" (required) - minimum 3
- iPad Pro 12.9" (optional) - minimum 3

**Screenshot Tips:**
```bash
# Use iOS Simulator to capture screenshots
# Recommended sizes: 1290 × 2796 (iPhone 15 Pro Max)
```

#### App Description
Copy from `STORE_LISTING.md` → iOS App Store → Full Description

#### Keywords
```
bubble,pop,puzzle,match,game,casual,strategy,fun,colorful,brain,logic
```

#### Support URL
```
https://github.com/anishiv/poppuzz
```

#### Marketing URL (optional)
```
https://mesonsoft.com
```

#### What's New
Copy from `STORE_LISTING.md` → Version 1.0.0 release notes

### Step 4: Pricing and Availability

- **Price:** Free
- **Availability:** All territories
- **Pre-orders:** No (for initial release)

### Step 5: App Privacy

Click **App Privacy** → **Get Started**

Answer the questionnaire:
- **Do you collect data from this app?** → No
- (This game stores everything locally, no server communication)

### Step 6: Submit Build

#### Upload Build Using EAS Submit

```bash
# Submit the build to App Store Connect
eas submit --platform ios --profile production

# Or manually upload using Transporter app
# Download from: https://apps.apple.com/app/transporter/id1450874784
```

#### Select Build in App Store Connect

1. Go to **App Store** tab
2. Scroll to **Build** section
3. Click **+** next to builds
4. Select your uploaded build
5. Wait for processing (can take 30 minutes to a few hours)

### Step 7: Export Compliance

- **Does your app use encryption?** → No
  (Already configured in app.json: `"usesNonExemptEncryption": false`)

### Step 8: Submit for Review

1. Click **Add for Review**
2. Review all information
3. Click **Submit to App Store**
4. Wait for Apple review (typically 24-48 hours)

### Step 9: Respond to Review (if needed)

If rejected:
1. Read rejection reason carefully
2. Make necessary changes
3. Rebuild and resubmit
4. Common issues:
   - Missing features described
   - Privacy policy issues
   - Crashes or bugs
   - Guideline violations

---

## Google Play Store Publishing

### Step 1: Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in details:
   - **App name:** Pop Puzzle
   - **Default language:** English (United States)
   - **App or game:** Game
   - **Free or paid:** Free
   - Accept declarations

### Step 2: Set Up Store Listing

Navigate to **Store presence** → **Main store listing**:

#### App Details

- **App name:** Pop Puzzle
- **Short description:** (80 chars)
  ```
  Match & pop colorful bubbles! Easy to learn, challenging to master. 🎈
  ```
- **Full description:** Copy from `STORE_LISTING.md` → Google Play → Full Description

#### Graphics

**App icon:**
- Upload `/assets/icon.png` (resize to 512×512 if needed)

**Feature graphic (Required):**
- Size: 1024 × 500 pixels
- Create an eye-catching banner with:
  - App logo
  - Colorful bubbles
  - "Match & Pop!" tagline

**Phone screenshots (Required):**
- Upload 2-8 screenshots
- Recommended: 1080 × 1920 pixels
- Capture: Home screen, gameplay, combos, different difficulties

**Tablet screenshots (Optional):**
- 7" and 10" tablet screenshots

**Video (Optional but recommended):**
- YouTube URL of gameplay video

#### Categorization

- **App category:** Puzzle
- **Tags:** puzzle, bubble, match, casual, strategy

#### Contact Details

- **Email:** privacy@mesonsoft.com
- **Website:** https://mesonsoft.com
- **Phone:** (optional)

#### Privacy Policy

- **Privacy policy URL:** https://github.com/anishiv/poppuzz/blob/main/PRIVACY_POLICY.md

### Step 3: App Content

Navigate through each section:

#### Privacy Policy
- Add URL (already done in store listing)

#### App Access
- **All functionality is available without special access:** Yes

#### Ads
- **Does your app contain ads?** → No

#### Content Rating
Complete the questionnaire:
- Select appropriate categories
- For this game: Everyone (PEGI 3, ESRB Everyone, etc.)

#### Target Audience
- **Age groups:** 5 and under, 6-8, 9-12, 13+
- Select all that apply (this game is suitable for all ages)

#### News Apps
- **Is this a news app?** → No

#### COVID-19 Contact Tracing and Status Apps
- **Is this a COVID-19 app?** → No

#### Data Safety
Complete the data safety form:
- **Does your app collect or share user data?** → No
- **Is all the data collected encrypted?** → N/A
- **Can users request deletion?** → N/A

#### Government Apps
- **Is this a government app?** → No

### Step 4: App Releases

Navigate to **Release** → **Production**:

#### Create New Release

```bash
# Upload your .aab file using EAS Submit
eas submit --platform android --profile production

# Or manually upload through Play Console
```

#### Manual Upload

1. Click **Create new release**
2. Upload the `.aab` file from your EAS build
3. Enter release details:

**Release name:** 1 (1.0.0)

**Release notes:**
```
🎉 Initial Release!

Welcome to Pop Puzzle! Features:
• Three exciting difficulty levels
• Beautiful graphics and animations
• Satisfying sound effects
• Lightning effects for big combos
• Smooth, responsive gameplay

Thank you for downloading!
```

### Step 5: Countries and Regions

- **Add countries/regions:** Select all (default)
- **Or exclude specific regions** if needed

### Step 6: Rollout Percentage

For initial release:
- **Rollout percentage:** 100% (or start with 10-20% for staged rollout)

### Step 7: Review and Rollout

1. Click **Review release**
2. Check all information  
3. Click **Start rollout to Production**
4. Confirm the rollout

### Step 8: Wait for Review

- **Processing time:** Usually a few hours to process
- **Review time:** Can take 1-3 days for first release
- **Status:** Check in Play Console dashboard

---

## Post-Launch

### Monitor Performance

#### iOS (App Store Connect)

- **Analytics:** https://appstoreconnect.apple.com
  - Downloads
  - Crashes
  - Sales and trends
  - Ratings and reviews

#### Android (Play Console)

- **Statistics:** https://play.google.com/console
  - Installs
  - Crashes and ANRs
  - Ratings and reviews
  - User acquisition

### Respond to Reviews

**Best Practices:**
- Respond to reviews within 48 hours
- Thank users for positive reviews
- Address concerns in negative reviews
- Fix bugs mentioned in reviews
- Show you're actively maintaining the app

### Update the App

When releasing updates:

#### Update Version Numbers

In `app.json`:
```json
{
  "expo": {
    "version": "1.1.0",
    "ios": {
      "buildNumber": "2"
    },
    "android": {
      "versionCode": 2
    }
  }
}
```

#### Build New Version

```bash
# Build updated version
eas build --platform all --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

#### Update Store Listings

- Write clear "What's New" notes
- Update screenshots if UI changed
- Update description if features added

### Marketing

**Free Marketing Strategies:**
1. Share on social media
2. Post on Reddit (r/AndroidGaming, r/iOSGaming)
3. Submit to app review sites
4. Create a website/landing page
5. Write a blog post about development
6. Share on Product Hunt
7. Engage with users on Twitter/X
8. Create gameplay videos for YouTube/TikTok

---

## Troubleshooting

### Common Build Issues

#### iOS Build Fails

**Problem:** "No valid code signing identity found"
**Solution:**
```bash
# Let EAS handle certificates
eas credentials

# Or generate manually in Apple Developer portal
```

**Problem:** "Bundle identifier already in use"
**Solution:** Change bundle ID in `app.json`

#### Android Build Fails

**Problem:** "Keystore not found"
**Solution:**
```bash
# Generate new keystore through EAS
eas credentials

# Follow prompts to create new keystore
```

**Problem:** "Package name already exists"
**Solution:** Change package name in `app.json`

### Common Submission Issues

#### iOS Rejection Reasons

1. **App crashes on launch**
   - Test thoroughly before submitting
   - Check crash logs in TestFlight

2. **Missing functionality**
   - Ensure all described features work
   - Remove beta/incomplete features

3. **Privacy policy issues**
   - Ensure privacy policy is accessible
   - Match data collection claims

4. **Guideline 2.1 - App Completeness**
   - Remove debug features
   - Test all game modes

**Fix and Resubmit:**
```bash
# Fix issues
# Increment build number in app.json
# Build again
eas build --platform ios --profile production
# Submit again
eas submit --platform ios
```

#### Android Rejection Reasons

1. **Content rating incorrect**
   - Review content rating questionnaire
   - Update if needed

2. **Privacy policy missing**
   - Add valid privacy policy URL
   - Ensure it's accessible

3. **Data safety form incomplete**
   - Complete all required sections
   - Be accurate about data collection

**Fix and Resubmit:**
- Fix issues in Play Console
- No need to rebuild if it's just metadata
- For code changes: increment versionCode and rebuild

### Getting Help

**Expo Forums:**
https://forums.expo.dev/

**Expo Discord:**
https://chat.expo.dev/

**Stack Overflow:**
Tag questions with `expo`, `react-native`

**Apple Developer Support:**
https://developer.apple.com/support/

**Google Play Support:**
https://support.google.com/googleplay/android-developer/

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Test locally
npm run web
npm run ios
npm run android

# Login to EAS
eas login

# Initialize EAS project
eas init

# Configure credentials
eas credentials

# Build for production
eas build --platform ios --profile production
eas build --platform android --profile production
eas build --platform all --profile production

# Check build status
eas build:list

# Submit to stores
eas submit --platform ios --profile production
eas submit --platform android --profile production

# View project
eas build:view [build-id]
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | TBD | Initial release |

---

## Checklist Before Submission

- [ ] All features working correctly
- [ ] No crashes or major bugs
- [ ] Tested on multiple devices/simulators
- [ ] Privacy policy accessible and accurate
- [ ] Store listings complete with screenshots
- [ ] App icon and splash screen finalized
- [ ] Version numbers set correctly
- [ ] Bundle IDs configured and verified
- [ ] Build successfully created
- [ ] All legal requirements met
- [ ] Support email monitored
- [ ] Ready to respond to reviews

---

**Good luck with your app launch! 🚀**

For questions or issues, please refer to:
- GitHub: https://github.com/anishiv/poppuzz
- Email: privacy@mesonsoft.com

**Author:** Shiva R Dhanuskodi - MesonX  
**Last Updated:** February 16, 2026
