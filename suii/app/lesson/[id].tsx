import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LessonDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    useEffect(() => {
        if (sound) {
            const interval = setInterval(async () => {
                const status = await sound.getStatusAsync();
                if (status.isLoaded) {
                    setPosition(status.positionMillis || 0);
                    setDuration(status.durationMillis || 0);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [sound]);

    const playAudio = async () => {
        try {
            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            } else {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);

                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded) {
                        setPosition(status.positionMillis || 0);
                        setDuration(status.durationMillis || 0);
                        if (status.didJustFinish) {
                            setIsPlaying(false);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const stopAudio = async () => {
        if (sound) {
            await sound.stopAsync();
            setIsPlaying(false);
            setPosition(0);
        }
    };

    const skipBackward = async () => {
        if (sound) {
            const newPosition = Math.max(0, position - 5000);
            await sound.setPositionAsync(newPosition);
            setPosition(newPosition);
        }
    };

    const skipForward = async () => {
        if (sound) {
            const newPosition = Math.min(duration, position + 5000);
            await sound.setPositionAsync(newPosition);
            setPosition(newPosition);
        }
    };

    const formatTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (position / duration) * 100 : 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Lesson {id}</Text>
                    <Text style={styles.headerSubtitle}>Choose practice type</Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.audioSection}>
                    <View style={styles.audioPlayer}>
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={skipBackward}
                            disabled={!sound}
                        >
                            <Ionicons name="play-back" size={20} color={sound ? "#58CC02" : "#CCCCCC"} />
                            <Text style={styles.skipButtonText}>-5s</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.audioButton}
                            onPress={playAudio}
                            disabled={!sound}
                        >
                            <Ionicons
                                name={isPlaying ? 'pause' : 'play'}
                                size={28}
                                color={sound ? "#58CC02" : "#CCCCCC"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={skipForward}
                            disabled={!sound}
                        >
                            <Ionicons name="play-forward" size={20} color={sound ? "#58CC02" : "#CCCCCC"} />
                            <Text style={styles.skipButtonText}>+5s</Text>
                        </TouchableOpacity>

                        {isPlaying && (
                            <TouchableOpacity onPress={stopAudio} style={styles.stopButton}>
                                <Ionicons name="stop" size={20} color="#999" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.audioInfo}>
                        <Text style={styles.audioTitle}>Audio Lesson</Text>
                        <Text style={styles.audioSubtitle}>Listen to native pronunciation</Text>
                        {duration > 0 && (
                            <View style={styles.audioProgress}>
                                <View style={styles.progressBarContainer}>
                                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                                </View>
                                <View style={styles.timeContainer}>
                                    <Text style={styles.timeText}>{formatTime(position)}</Text>
                                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    <Text style={styles.menuTitle}>Choose a Practice Type</Text>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push(`/lesson/${id}/task/sentence-builder` as any)}
                    >
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="construct" size={32} color="#58CC02" />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuItemTitle}>Sentence Builder</Text>
                            <Text style={styles.menuItemSubtitle}>Arrange words to form sentences</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push(`/lesson/${id}/task/vocabulary-match` as any)}
                    >
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="swap-horizontal" size={32} color="#1CB0F6" />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuItemTitle}>Vocabulary Match</Text>
                            <Text style={styles.menuItemSubtitle}>Match English with Mongolian</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push(`/lesson/${id}/task/chat-bot` as any)}
                    >
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="chatbubbles" size={32} color="#FF9600" />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuItemTitle}>Chat with Bot</Text>
                            <Text style={styles.menuItemSubtitle}>Practice conversation</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#999" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        marginRight: 16,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
    },
    content: {
        flex: 1,
    },
    audioSection: {
        padding: 20,
        paddingBottom: 0,
    },
    audioPlayer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        gap: 16,
    },
    skipButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    skipButtonText: {
        fontSize: 10,
        color: '#999',
        marginTop: 4,
    },
    audioButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopButton: {
        padding: 8,
    },
    audioInfo: {
        marginTop: 16,
        paddingHorizontal: 4,
    },
    audioTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    audioSubtitle: {
        fontSize: 14,
        color: '#999',
        marginBottom: 12,
    },
    audioProgress: {
        marginTop: 8,
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: '#E5E5E5',
        borderRadius: 2,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#58CC02',
        borderRadius: 2,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        fontSize: 12,
        color: '#999',
    },
    menuContainer: {
        padding: 20,
    },
    menuTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
    },
    menuIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F0F9FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuContent: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    menuItemSubtitle: {
        fontSize: 14,
        color: '#999',
    },
});
