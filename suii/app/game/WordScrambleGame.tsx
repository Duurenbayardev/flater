import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useApp } from '../../contexts/AppContext';

// Word pairs for the scramble game
const wordPairs = [
    { mongolian: 'Сайн уу', english: 'Hello', scrambled: 'Hlleo' },
    { mongolian: 'Баярлалаа', english: 'Thanks', scrambled: 'Tnhkas' },
    { mongolian: 'Ус', english: 'Water', scrambled: 'Wtaer' },
    { mongolian: 'Хоол', english: 'Food', scrambled: 'Fdoo' },
    { mongolian: 'Ном', english: 'Book', scrambled: 'Boko' },
    { mongolian: 'Багш', english: 'Teacher', scrambled: 'Tcehrea' },
    { mongolian: 'Анги', english: 'Class', scrambled: 'Clsas' },
    { mongolian: 'Зул сар', english: 'Christmas', scrambled: 'Chrsitmas' },
    { mongolian: 'Найз', english: 'Friend', scrambled: 'Frnied' },
    { mongolian: 'Гэр', english: 'Home', scrambled: 'Hmoe' },
];

// Function to scramble a word
const scrambleWord = (word: string): string => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
};

type WordPair = typeof wordPairs[0];

export default function WordScrambleGame() {
    const router = useRouter();
    const { updateProgress } = useApp();
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
    const [availableLetters, setAvailableLetters] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [hintUsed, setHintUsed] = useState(false);

    const currentWord = wordPairs[currentWordIndex];
    const targetWord = currentWord.english.toUpperCase();

    // Initialize scrambled letters with fixed IDs
    React.useEffect(() => {
        const scrambled = scrambleWord(targetWord);
        const lettersWithIds = scrambled.split('').map((letter, index) => ({
            id: `${currentWordIndex}-${index}-${letter}-${Date.now()}`,
            letter,
            used: false,
        }));
        setAvailableLetters(lettersWithIds);
        setSelectedLetters([]);
        setHintUsed(false);
    }, [currentWordIndex]);

    // Timer countdown
    React.useEffect(() => {
        if (gameOver || gameWon) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameOver, gameWon]);

    const handleLetterSelect = (letterData: { id: string; letter: string }) => {
        if (selectedLetters.length >= targetWord.length) return;

        setSelectedLetters(prev => [...prev, letterData]);
        setAvailableLetters(prev => prev.map(l => l.id === letterData.id ? { ...l, used: true } : l));
    };

    const handleLetterRemove = (index: number) => {
        const removedLetter = selectedLetters[index];
        setSelectedLetters(prev => prev.filter((_, i) => i !== index));
        setAvailableLetters(prev => prev.map(l => l.id === removedLetter.id ? { ...l, used: false } : l));
    };

    const checkAnswer = () => {
        const answer = selectedLetters.map(l => l.letter).join('');
        if (answer === targetWord) {
            // Correct!
            setScore(prev => prev + 10);

            if (currentWordIndex + 1 >= wordPairs.length) {
                // All words completed
                setGameWon(true);
                updateProgress({ xp: 200 });
            } else {
                // Move to next word
                setTimeout(() => {
                    setCurrentWordIndex(prev => prev + 1);
                    setSelectedLetters([]);
                }, 1000);
            }
        } else {
            // Wrong - reset letters but keep positions
            const removedLetters = selectedLetters;
            setSelectedLetters([]);
            setAvailableLetters(prev => {
                const updated = [...prev];
                removedLetters.forEach(removed => {
                    const letterIndex = updated.findIndex(l => l.id === removed.id);
                    if (letterIndex !== -1) {
                        updated[letterIndex] = { ...updated[letterIndex], used: false };
                    }
                });
                return updated;
            });
        }
    };

    const useHint = () => {
        if (hintUsed) return;

        // Reveal first letter
        const firstLetter = targetWord[0];
        const letterData = availableLetters.find(l => l.letter === firstLetter && !l.used);

        if (letterData) {
            setSelectedLetters([letterData]);
            setAvailableLetters(prev => prev.map(l => l.id === letterData.id ? { ...l, used: true } : l));
            setHintUsed(true);
        }
    };

    const resetGame = () => {
        setCurrentWordIndex(0);
        setSelectedLetters([]);
        setScore(0);
        setGameWon(false);
        setGameOver(false);
        setTimeLeft(60);
        setHintUsed(false);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Score</Text>
                        <Text style={styles.statValue}>{score}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Time</Text>
                        <Text style={[styles.statValue, timeLeft < 10 && styles.timeWarning]}>
                            {timeLeft}s
                        </Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Word</Text>
                        <Text style={styles.statValue}>
                            {currentWordIndex + 1}/{wordPairs.length}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Game Area */}
            {!gameOver && !gameWon && (
                <View style={styles.gameArea}>
                    {/* Mongolian Word Display */}
                    <View style={styles.mongolianContainer}>
                        <Text style={styles.mongolianLabel}>Mongolian:</Text>
                        <Text style={styles.mongolianWord}>{currentWord.mongolian}</Text>
                    </View>

                    {/* Selected Letters (Answer) */}
                    <View style={styles.answerContainer}>
                        <Text style={styles.answerLabel}>Unscramble the word:</Text>
                        <View style={styles.answerBox}>
                            {Array.from({ length: targetWord.length }).map((_, index) => (
                                <LetterSlot
                                    key={index}
                                    letter={selectedLetters[index]?.letter || ''}
                                    onPress={() => handleLetterRemove(index)}
                                    isEmpty={!selectedLetters[index]}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Available Letters */}
                    <View style={styles.lettersContainer}>
                        <Text style={styles.lettersLabel}>Available Letters:</Text>
                        <View style={styles.lettersGrid}>
                            {availableLetters.map((letterData) => (
                                <LetterButton
                                    key={letterData.id}
                                    letter={letterData.letter}
                                    isUsed={letterData.used}
                                    onPress={() => handleLetterSelect(letterData)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.hintButton]}
                            onPress={useHint}
                            disabled={hintUsed || selectedLetters.length > 0}
                        >
                            <Ionicons name="bulb" size={20} color="#C8ACD6" />
                            <Text style={styles.actionButtonText}>Hint</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.checkButton]}
                            onPress={checkAnswer}
                            disabled={selectedLetters.length !== targetWord.length}
                        >
                            <Ionicons name="checkmark-circle" size={20} color="#58CC02" />
                            <Text style={styles.actionButtonText}>Check</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Game Over Overlay */}
            {gameOver && (
                <View style={styles.overlay}>
                    <View style={styles.resultBox}>
                        <Ionicons name="time-outline" size={64} color="#FF4444" />
                        <Text style={styles.resultTitle}>Time's Up!</Text>
                        <Text style={styles.resultText}>Final Score: {score}</Text>
                        <Text style={styles.resultSubtext}>
                            Completed: {currentWordIndex} / {wordPairs.length} words
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
                        <Text style={styles.resultText}>You unscrambled all words!</Text>
                        <Text style={styles.resultSubtext}>Final Score: {score}</Text>
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

function LetterSlot({ letter, onPress, isEmpty }: { letter: string; onPress: () => void; isEmpty: boolean }) {
    const scale = useSharedValue(1);

    React.useEffect(() => {
        if (letter) {
            scale.value = withSpring(1.1, { damping: 8, stiffness: 150 });
            setTimeout(() => {
                scale.value = withSpring(1, { damping: 8, stiffness: 150 });
            }, 150);
        }
    }, [letter]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <TouchableOpacity
            style={[styles.letterSlot, isEmpty && styles.letterSlotEmpty]}
            onPress={onPress}
            disabled={isEmpty}
            activeOpacity={0.7}
        >
            <Animated.View style={animatedStyle}>
                <Text style={styles.letterSlotText}>{letter}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
}

function LetterButton({ letter, isUsed, onPress }: { letter: string; isUsed: boolean; onPress: () => void }) {
    const scale = useSharedValue(1);

    const handlePress = () => {
        scale.value = withSpring(0.9, { damping: 8, stiffness: 150 });
        setTimeout(() => {
            scale.value = withSpring(1, { damping: 8, stiffness: 150 });
            onPress();
        }, 100);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <TouchableOpacity
            style={[styles.letterButton, isUsed && styles.letterButtonUsed]}
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={isUsed}
        >
            <Animated.View style={animatedStyle}>
                <Text style={[styles.letterButtonText, isUsed && styles.letterButtonTextUsed]}>
                    {letter}
                </Text>
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
        marginBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    statBox: {
        backgroundColor: '#433D8B',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
        minWidth: 70,
    },
    statLabel: {
        fontSize: 10,
        color: '#FFFFFF',
        opacity: 0.8,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#C8ACD6',
        marginTop: 2,
    },
    timeWarning: {
        color: '#FF4444',
    },
    gameArea: {
        flex: 1,
    },
    mongolianContainer: {
        backgroundColor: '#2E236C',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#5A4FA3',
        alignItems: 'center',
    },
    mongolianLabel: {
        fontSize: 12,
        color: '#C8ACD6',
        opacity: 0.8,
        marginBottom: 8,
        fontWeight: '600',
    },
    mongolianWord: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    answerContainer: {
        marginBottom: 32,
        alignItems: 'center',
    },
    answerLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#C8ACD6',
        marginBottom: 16,
    },
    answerBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        minHeight: 80,
    },
    letterSlot: {
        width: 50,
        height: 50,
        backgroundColor: '#433D8B',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#5A4FA3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterSlotEmpty: {
        backgroundColor: '#2E236C',
        borderStyle: 'dashed',
        borderColor: '#433D8B',
    },
    letterSlotText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    lettersContainer: {
        flex: 1,
        marginBottom: 24,
    },
    lettersLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#C8ACD6',
        marginBottom: 16,
        textAlign: 'center',
    },
    lettersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    letterButton: {
        width: 50,
        height: 50,
        backgroundColor: '#5A4FA3',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#7C6FD3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterButtonUsed: {
        backgroundColor: '#2E236C',
        borderColor: '#433D8B',
        opacity: 0.5,
    },
    letterButtonText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    letterButtonTextUsed: {
        color: '#5A4FA3',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        minWidth: 120,
        justifyContent: 'center',
    },
    hintButton: {
        backgroundColor: '#433D8B',
        borderWidth: 2,
        borderColor: '#5A4FA3',
    },
    checkButton: {
        backgroundColor: '#58CC02',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
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
        fontSize: 18,
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

