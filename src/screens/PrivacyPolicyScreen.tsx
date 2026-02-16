/**
 * Pop Puzzle - Privacy Policy Screen
 * @author Shiva R Dhanuskodi - MesonX
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type PrivacyPolicyNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PrivacyPolicy'>;

type Props = {
  navigation: PrivacyPolicyNavigationProp;
};

const { width } = Dimensions.get('window');

export default function PrivacyPolicyScreen({ navigation }: Props) {
  return (
    <LinearGradient
      colors={['#4A90E2', '#357ABD', '#2C5F9E']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: February 16, 2026</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to Pop Puzzle ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our mobile application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.subTitle}>2.1 Information You Provide</Text>
          <Text style={styles.paragraph}>
            • Game scores and progress data stored locally on your device{'\n'}
            • Settings and preferences you configure within the app
          </Text>
          
          <Text style={styles.subTitle}>2.2 Automatically Collected Information</Text>
          <Text style={styles.paragraph}>
            • Device information (model, operating system version){'\n'}
            • App usage statistics (game sessions, features used){'\n'}
            • Performance data and crash reports
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the collected information to:{'\n\n'}
            • Provide and maintain the game functionality{'\n'}
            • Save your game progress and high scores{'\n'}
            • Improve app performance and user experience{'\n'}
            • Identify and fix technical issues{'\n'}
            • Develop new features and enhancements
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Storage</Text>
          <Text style={styles.paragraph}>
            All game data, including scores and progress, is stored locally on your device. We do not transmit your personal information to external servers. Your data remains under your control and is deleted when you uninstall the app.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            Pop Puzzle is designed to function entirely offline and does not integrate with third-party advertising networks, analytics services, or social media platforms. We do not share your data with third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Pop Puzzle is suitable for all ages, including children. We do not knowingly collect personal information from children under 13. The app does not require account creation or personal data submission, making it safe for users of all ages.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your information stored locally on your device. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:{'\n\n'}
            • Access your data stored within the app{'\n'}
            • Delete your data by clearing app data or uninstalling{'\n'}
            • Opt-out of data collection by discontinuing app use{'\n'}
            • Request information about data practices
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy within the app and updating the "Last Updated" date. Continued use of the app after changes constitutes acceptance of the updated policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. International Users</Text>
          <Text style={styles.paragraph}>
            Pop Puzzle is available worldwide. By using the app, you consent to the transfer and processing of your information in accordance with this privacy policy, regardless of your location.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions or concerns about this privacy policy or our data practices, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>
            Shiva R Dhanuskodi{'\n'}
            MesonX{'\n'}
            Email: privacy@mesonsoft.com
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Pop Puzzle, you agree to this Privacy Policy.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <View style={styles.spacing} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  lastUpdated: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    marginTop: 10,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
    fontWeight: '500',
  },
  contactInfo: {
    fontSize: 15,
    color: '#FFD700',
    lineHeight: 24,
    fontWeight: '600',
    marginTop: 10,
    paddingLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  footerText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  spacing: {
    height: 20,
  },
});
