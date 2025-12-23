import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { preloadCompletionSound, preloadUnitCompleteSound } from '../utils/audio';

interface LoadingScreenProps {
    onLoadComplete: () => void;
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Start fade in animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Load audio
        const loadAudio = async () => {
            try {
                // Simulate loading progress
                setLoadingProgress(30);
                await new Promise(resolve => setTimeout(resolve, 300));

                setLoadingProgress(60);
                await preloadCompletionSound();

                setLoadingProgress(80);
                await preloadUnitCompleteSound();

                setLoadingProgress(100);
                await new Promise(resolve => setTimeout(resolve, 300));

                // Complete loading
                onLoadComplete();
            } catch (error) {
                console.log('Error loading audio:', error);
                // Still proceed even if audio loading fails
                onLoadComplete();
            }
        };

        loadAudio();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <View style={styles.logoContainer}>
                    <View style={styles.logoBackground}>
                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.logo}
                            contentFit="contain"
                        />
                    </View>
                </View>
                <Text style={styles.title}>Loading...</Text>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                { width: `${loadingProgress}%` },
                            ]}
                        />
                    </View>
                </View>
                <View style={styles.loadingIndicator}>
                    <Ionicons name="hourglass-outline" size={24} color="#58CC02" />
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 40,
    },
    logoContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    logoBackground: {
        backgroundColor: '#48c04cff',
        borderRadius: 30,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 30,
    },
    progressContainer: {
        width: '100%',
        maxWidth: 300,
        marginBottom: 20,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E5E5E5',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#58CC02',
        borderRadius: 3,
    },
    loadingIndicator: {
        marginTop: 20,
    },
});
