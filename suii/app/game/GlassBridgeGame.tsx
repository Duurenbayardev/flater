import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useApp } from '../../contexts/AppContext';

// The complete sentence to build
const targetSentence = 'Cold rain tapped lightly on the windowpane.';
const sentenceWords = targetSentence.split(' ');

// Generate challenges for each word in the sentence
const generateChallenges = () => {
    const challenges = [];
    const wrongOptions = ['hot', 'warm', 'big', 'small', 'fast', 'slow', 'high', 'low', 'new', 'old', 'good', 'bad', 'red', 'blue', 'green', 'yellow'];

    for (let i = 0; i < sentenceWords.length; i++) {
        const correctWord = sentenceWords[i];
        // Get a wrong option that's different from the correct one
        let wrongWord = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        while (wrongWord.toLowerCase() === correctWord.toLowerCase().replace(/[.,!?]/g, '')) {
            wrongWord = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        }

        challenges.push({
            id: i + 1,
            correctWord: correctWord,
            wrongWord: wrongWord,
            completedWords: sentenceWords.slice(0, i),
            nextWord: correctWord,
        });
    }

    return challenges;
};

const challenges = generateChallenges();

export default function GlassBridgeGame() {
    const router = useRouter();
    const { updateProgress } = useApp();
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [selectedBridge, setSelectedBridge] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [bridgePositions, setBridgePositions] = useState<Map<number, { correctBridge: number; bridgeWords: string[] }>>(new Map());

    const currentChallenge = challenges[currentChallengeIndex];
    const progress = ((currentChallengeIndex + 1) / challenges.length) * 100;

    // Build the sentence so far
    const sentenceSoFar = currentChallenge.completedWords.join(' ');
    const fullSentence = targetSentence;

    // Note: Bridge positions are randomized per challenge in the render

    const handleBridgeSelect = (bridgeIndex: number, correctBridgeIndex: number) => {
        if (selectedBridge !== null || gameOver || gameWon) return;

        setSelectedBridge(bridgeIndex);
        setShowResult(true);

        const isCorrect = bridgeIndex === correctBridgeIndex;

        if (isCorrect) {
            // Correct choice - move to next challenge
            setTimeout(() => {
                if (currentChallengeIndex + 1 >= challenges.length) {
                    // All challenges completed - win!
                    setGameWon(true);
                    updateProgress({ xp: 150 });
                } else {
                    // Move to next challenge
                    setCurrentChallengeIndex(prev => prev + 1);
                    setSelectedBridge(null);
                    setShowResult(false);
                }
            }, 1500);
        } else {
            // Wrong choice - game over
            setTimeout(() => {
                setGameOver(true);
            }, 1500);
        }
    };

    // Initialize bridge positions for all challenges
    React.useEffect(() => {
        const positions = new Map<number, { correctBridge: number; bridgeWords: string[] }>();
        challenges.forEach((challenge, index) => {
            const correctBridge = Math.random() < 0.5 ? 0 : 1;
            const bridgeWords = correctBridge === 0
                ? [challenge.correctWord, challenge.wrongWord]
                : [challenge.wrongWord, challenge.correctWord];
            positions.set(index, { correctBridge, bridgeWords });
        });
        setBridgePositions(positions);
    }, []);

    const resetGame = () => {
        setCurrentChallengeIndex(0);
        setGameOver(false);
        setGameWon(false);
        setSelectedBridge(null);
        setShowResult(false);
        // Reset bridge positions
        const positions = new Map<number, { correctBridge: number; bridgeWords: string[] }>();
        challenges.forEach((challenge, index) => {
            const correctBridge = Math.random() < 0.5 ? 0 : 1;
            const bridgeWords = correctBridge === 0
                ? [challenge.correctWord, challenge.wrongWord]
                : [challenge.wrongWord, challenge.correctWord];
            positions.set(index, { correctBridge, bridgeWords });
        });
        setBridgePositions(positions);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {currentChallengeIndex + 1} / {challenges.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                </View>
            </View>

            {/* Game Area */}
            {!gameOver && !gameWon && (
                <View style={styles.gameArea}>
                    {/* Completed Sentence */}
                    <View style={styles.sentenceContainer}>
                        <Text style={styles.sentenceText}>
                            {sentenceSoFar}
                        </Text>
                    </View>

                    {/* Bridges Path - Show all remaining bridges (going upward) */}
                    <ScrollView
                        style={styles.bridgesPath}
                        contentContainerStyle={styles.bridgesPathContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Show all remaining bridges - reversed to show upward progression */}
                        {Array.from({ length: challenges.length - currentChallengeIndex })
                            .map((_, offset) => currentChallengeIndex + offset)
                            .reverse()
                            .map((challengeIndex) => {
                                const challenge = challenges[challengeIndex];
                                const isCurrent = challengeIndex === currentChallengeIndex;

                                // Get stable bridge positions from state
                                const bridgeData = bridgePositions.get(challengeIndex);
                                if (!bridgeData) return null;

                                const { correctBridge, bridgeWords } = bridgeData;

                                return (
                                    <View key={challengeIndex} style={styles.bridgeRow}>
                                        {isCurrent && (
                                            <Text style={styles.bridgeLabel}>Choose now:</Text>
                                        )}
                                        {!isCurrent && (
                                            <Text style={styles.bridgeLabel}>Next:</Text>
                                        )}
                                        <View style={styles.bridgesContainer}>
                                            {bridgeWords.map((word, bridgeIndex) => (
                                                <BridgeComponent
                                                    key={`${challengeIndex}-${bridgeIndex}`}
                                                    word={word}
                                                    index={bridgeIndex}
                                                    isSelected={isCurrent && selectedBridge === bridgeIndex}
                                                    isCorrect={isCurrent && bridgeIndex === correctBridge}
                                                    showResult={isCurrent && showResult}
                                                    onPress={isCurrent ? () => handleBridgeSelect(bridgeIndex, correctBridge) : () => { }}
                                                    isCurrent={isCurrent}
                                                    isUpcoming={!isCurrent}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                );
                            })}
                    </ScrollView>
                </View>
            )}

            {/* Game Over Overlay */}
            {gameOver && (
                <View style={styles.overlay}>
                    <View style={styles.resultBox}>
                        <Ionicons name="close-circle" size={64} color="#FF4444" />
                        <Text style={styles.resultTitle}>Game Over!</Text>
                        <Text style={styles.resultText}>
                            You chose the wrong bridge
                        </Text>
                        <Text style={styles.resultSubtext}>
                            Completed: {currentChallengeIndex} / {challenges.length}
                        </Text>
                        <View style={styles.resultButtons}>
                            <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
                                <Text style={styles.playAgainText}>Try Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <Text style={styles.backButtonText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Win Screen */}
            {gameWon && (
                <View style={styles.overlay}>
                    <View style={styles.resultBox}>
                        <Ionicons name="trophy" size={64} color="#58CC02" />
                        <Text style={styles.resultTitle}>Congratulations!</Text>
                        <Text style={styles.resultText}>
                            You completed all challenges!
                        </Text>
                        <View style={styles.resultButtons}>
                            <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
                                <Text style={styles.playAgainText}>Play Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <Text style={styles.backButtonText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

function BridgeComponent({
    word,
    index,
    isSelected,
    isCorrect,
    showResult,
    onPress,
    isCurrent = true,
    isUpcoming = false,
}: {
    word: string;
    index: number;
    isSelected: boolean;
    isCorrect: boolean;
    showResult: boolean;
    onPress: () => void;
    isCurrent?: boolean;
    isUpcoming?: boolean;
}) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    React.useEffect(() => {
        if (isSelected) {
            scale.value = withSpring(0.95, { damping: 8, stiffness: 150 });
        } else {
            scale.value = withSpring(1, { damping: 8, stiffness: 150 });
        }
    }, [isSelected]);

    React.useEffect(() => {
        if (showResult && isSelected) {
            if (isCorrect) {
                // Correct - stay visible
                opacity.value = withTiming(1, { duration: 300 });
            } else {
                // Wrong - fade out (fall through)
                opacity.value = withTiming(0, { duration: 500 });
            }
        }
    }, [showResult, isSelected, isCorrect]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const getBridgeColor = () => {
        if (showResult && isSelected && isCurrent) {
            return isCorrect ? '#58CC02' : '#FF4444';
        }
        if (isUpcoming) {
            return '#2E236C';
        }
        return '#433D8B';
    };

    const getBorderColor = () => {
        if (showResult && isSelected && isCurrent) {
            return isCorrect ? '#58CC02' : '#FF4444';
        }
        if (isUpcoming) {
            return '#433D8B';
        }
        return '#5A4FA3';
    };

    const getTextColor = () => {
        if (isUpcoming) {
            return '#5A4FA3';
        }
        return '#FFFFFF';
    };

    return (
        <TouchableOpacity
            style={styles.bridgeContainer}
            onPress={onPress}
            disabled={showResult || !isCurrent}
            activeOpacity={isCurrent ? 0.8 : 1}
        >
            <Animated.View
                style={[
                    styles.bridge,
                    animatedStyle,
                    {
                        backgroundColor: getBridgeColor(),
                        borderColor: getBorderColor(),
                        opacity: isUpcoming ? 0.6 : 1,
                    },
                ]}
            >
                <Text style={[styles.bridgeWord, { color: getTextColor() }]}>{word}</Text>
                {showResult && isSelected && isCurrent && (
                    <View style={styles.resultIcon}>
                        <Ionicons
                            name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                            size={32}
                            color={isCorrect ? '#58CC02' : '#FF4444'}
                        />
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#17153B',
        paddingHorizontal: 16,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    progressContainer: {
        flex: 1,
        marginLeft: 20,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#C8ACD6',
        marginBottom: 8,
        textAlign: 'center',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#2E236C',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#58CC02',
        borderRadius: 4,
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sentenceContainer: {
        backgroundColor: '#2E236C',
        borderRadius: 16,
        padding: 24,
        marginBottom: 48,
        borderWidth: 2,
        borderColor: '#5A4FA3',
        alignItems: 'center',
    },
    sentenceText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 32,
        marginBottom: 12,
    },
    blankSpace: {
        color: '#C8ACD6',
        fontWeight: '800',
        fontSize: 24,
    },
    blankText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#C8ACD6',
    },
    progressIndicator: {
        marginBottom: 24,
        alignItems: 'center',
    },
    hintText: {
        fontSize: 14,
        color: '#C8ACD6',
        opacity: 0.7,
        textAlign: 'center',
        marginTop: 8,
    },
    previewContainer: {
        backgroundColor: '#2E236C',
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#433D8B',
        opacity: 0.6,
    },
    previewLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#C8ACD6',
        marginBottom: 8,
        textAlign: 'center',
    },
    previewText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#C8ACD6',
        textAlign: 'center',
        lineHeight: 20,
    },
    bridgesPath: {
        flex: 1,
        width: '100%',
    },
    bridgesPathContent: {
        justifyContent: 'flex-end',
        paddingBottom: 20,
        paddingTop: 20,
    },
    bridgeRow: {
        marginBottom: 16,
        width: '100%',
    },
    bridgeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#C8ACD6',
        marginBottom: 12,
        textAlign: 'center',
    },
    bridgesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 12,
        gap: 20,
    },
    bridgeContainer: {
        flex: 1,
        maxWidth: '45%',
        // marginTop: 10,
    },
    bridge: {
        height: 120,
        borderRadius: 12,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    bridgeWord: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    resultIcon: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    instruction: {
        fontSize: 14,
        color: '#C8ACD6',
        textAlign: 'center',
        opacity: 0.8,
        paddingHorizontal: 20,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultBox: {
        backgroundColor: '#433D8B',
        paddingHorizontal: 32,
        paddingVertical: 28,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#5A4FA3',
        minWidth: 280,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 16,
        marginBottom: 8,
    },
    resultText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#C8ACD6',
        marginBottom: 8,
        textAlign: 'center',
    },
    resultSubtext: {
        fontSize: 14,
        fontWeight: '600',
        color: '#C8ACD6',
        opacity: 0.8,
        marginBottom: 24,
    },
    resultButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    playAgainButton: {
        flex: 1,
        backgroundColor: '#C8ACD6',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    playAgainText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#17153B',
    },
    backButton: {
        flex: 1,
        backgroundColor: '#433D8B',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#5A4FA3',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#C8ACD6',
    },
});

