import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../../contexts/AppContext';

export default function SignupWelcomeScreen() {
    const router = useRouter();
    const { setNewSignup } = useApp();
    const [email, setEmail] = useState('');

    const handleEmailContinue = () => {
        if (email.trim()) {
            router.push('/auth/signup/details' as any);
        }
    };

    const handleGoogleSignup = () => {
        // Set as new signup and go directly to test
        setNewSignup(true);
        router.replace('/test' as any);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoBackground}>
                        <Image
                            source={require('../../../assets/logo.png')}
                            style={styles.logo}
                            contentFit="contain"
                        />
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.welcomeText}>Welcome to Surii</Text>
                    <Text style={styles.subtitle}>Start your English learning journey today</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={24} color="#58CC02" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.continueButton, !email.trim() && styles.continueButtonDisabled]}
                        onPress={handleEmailContinue}
                        disabled={!email.trim()}
                    >
                        <Text style={styles.continueButtonText}>Continue with Email</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleGoogleSignup}
                    >
                        <Ionicons name="logo-google" size={24} color="#4285F4" />
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/auth/login')}>
                        <Text style={styles.footerLink}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoBackground: {
        backgroundColor: '#58CC02',
        borderRadius: 40,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
    logo: {
        width: 120,
        height: 120,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    welcomeText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        lineHeight: 26,
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 2,
        borderColor: '#E5E5E5',
    },
    inputIcon: {
        marginRight: 16,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    continueButton: {
        backgroundColor: '#58CC02',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    continueButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E5E5',
    },
    dividerText: {
        color: '#999',
        fontSize: 14,
        fontWeight: '600',
        marginHorizontal: 16,
    },
    googleButton: {
        backgroundColor: '#fff',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#E5E5E5',
    },
    googleButtonText: {
        color: '#333',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    footerText: {
        fontSize: 16,
        color: '#666',
    },
    footerLink: {
        fontSize: 16,
        color: '#58CC02',
        fontWeight: 'bold',
    },
});
