import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, LayoutAnimation, PanResponder, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useApp } from '../../contexts/AppContext';
import GlassBridgeGame from './GlassBridgeGame';
import MemoryCardGame from './MemoryCardGame';
import WordScrambleGame from './WordScrambleGame';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GRID_SIZE = 15;
const CELL_SIZE = (Dimensions.get('window').width - 60) / GRID_SIZE;
const INITIAL_SPEED = 180;

// Configure smooth animation for snake movement
const configureLayoutAnimation = () => {
    LayoutAnimation.configureNext({
        duration: 150,
        create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
        },
        update: {
            type: LayoutAnimation.Types.easeInEaseOut,
            springDamping: 0.7,
        },
    });
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };
type Letter = { position: Position; letter: string; isCorrect: boolean };

// Sample words for the game
const gameWords = [
    { mongolian: 'Зул сар ', english: 'Christmas' },
    { mongolian: 'Багш', english: 'Teacher' },
    { mongolian: 'Анги ', english: 'Class' },
    { mongolian: 'Чанах', english: 'Boil' },
    { mongolian: 'Шарах', english: 'Fry' },
    { mongolian: 'Хоол', english: 'Food' },
    { mongolian: 'Ананд', english: 'Anand' },
    { mongolian: 'Хан-Эрдэнэ', english: 'HanErdene' },
];

export default function GameScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { updateProgress, userProgress } = useApp();
    const gameId = parseInt(id || '1');

    // Game state
    const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
    const [letters, setLetters] = useState<Letter[]>([]);
    const [currentWord, setCurrentWord] = useState<{ mongolian: string; english: string } | null>(null);
    const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
    const [hasEatenWrongLetter, setHasEatenWrongLetter] = useState(false);
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [wordComplete, setWordComplete] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const gameLoopRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
    const scaleAnim = useSharedValue(1);
    const lastSwipeTime = useRef<number>(0);
    const [feedbackMessage, setFeedbackMessage] = useState<'perfect' | 'good' | null>(null);
    const feedbackOpacity = useSharedValue(0);
    const feedbackScale = useSharedValue(0.5);
    const feedbackTranslateY = useSharedValue(-20);

    // Get available words from user progress
    const availableWords = gameWords.filter((word, index) =>
        index < Math.min(gameWords.length, userProgress.completedLessons.length + 3)
    );

    // Generate random word
    const generateWord = () => {
        if (availableWords.length === 0) {
            return gameWords[Math.floor(Math.random() * gameWords.length)];
        }
        return availableWords[Math.floor(Math.random() * availableWords.length)];
    };

    // Generate one correct and one wrong letter
    const generateNextLetters = (word: string, currentIndex: number) => {
        const newLetters: Letter[] = [];
        const correctLetters = word.toUpperCase().split('').filter(char => char !== ' ');
        const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        if (currentIndex >= correctLetters.length) {
            return newLetters; // Word complete
        }

        const correctLetter = correctLetters[currentIndex];
        const wrongLetters = allLetters.filter(l => l !== correctLetter);

        // Generate correct letter position
        let correctPosition: Position;
        do {
            correctPosition = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
        } while (
            snake.some(s => s.x === correctPosition.x && s.y === correctPosition.y)
        );
        newLetters.push({ position: correctPosition, letter: correctLetter, isCorrect: true });

        // Generate wrong letter position
        let wrongPosition: Position;
        do {
            wrongPosition = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
        } while (
            (wrongPosition.x === correctPosition.x && wrongPosition.y === correctPosition.y) ||
            snake.some(s => s.x === wrongPosition.x && s.y === wrongPosition.y)
        );
        newLetters.push({
            position: wrongPosition,
            letter: wrongLetters[Math.floor(Math.random() * wrongLetters.length)],
            isCorrect: false
        });

        return newLetters;
    };

    // Initialize game with word
    useEffect(() => {
        if (gameStarted && !currentWord && !gameOver) {
            const word = generateWord();
            setCurrentWord(word);
            setCollectedLetters([]);
            setHasEatenWrongLetter(false);
            setWordComplete(false);
            const newLetters = generateNextLetters(word.english, 0);
            setLetters(newLetters);
        }
    }, [gameStarted, currentWord, gameOver]);

    // Game loop
    useEffect(() => {
        if (!gameStarted || gameOver || wordComplete) {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
            if (gameOver && score > 0) {
                updateProgress({ xp: score * 2 });
            }
            return;
        }

        gameLoopRef.current = setInterval(() => {
            // Configure animation before state update
            configureLayoutAnimation();

            setSnake((prevSnake) => {
                setDirection(nextDirection);
                const head = prevSnake[0];
                let newHead: Position = { ...head };

                switch (nextDirection) {
                    case 'UP':
                        newHead.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
                        break;
                    case 'DOWN':
                        newHead.y = (head.y + 1) % GRID_SIZE;
                        break;
                    case 'LEFT':
                        newHead.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
                        break;
                    case 'RIGHT':
                        newHead.x = (head.x + 1) % GRID_SIZE;
                        break;
                }

                // Check collision with self
                if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameOver(true);
                    if (score > highScore) {
                        setHighScore(score);
                    }
                    return prevSnake;
                }

                let newSnake = [newHead, ...prevSnake];

                // Check if letter eaten
                const eatenLetterIndex = letters.findIndex(
                    l => l.position.x === newHead.x && l.position.y === newHead.y
                );

                if (eatenLetterIndex !== -1) {
                    const eatenLetter = letters[eatenLetterIndex];
                    const targetWord = currentWord?.english.toUpperCase().replace(/\s/g, '') || '';
                    const expectedNextLetter = targetWord[collectedLetters.length];

                    if (eatenLetter.isCorrect && eatenLetter.letter === expectedNextLetter) {
                        // Correct letter in correct order
                        scaleAnim.value = withSequence(
                            withSpring(1.2, { damping: 8, stiffness: 150 }),
                            withSpring(1, { damping: 10, stiffness: 150 })
                        );

                        const newCollected = [...collectedLetters, eatenLetter.letter];
                        setCollectedLetters(newCollected);
                        setScore(prev => prev + 10);

                        // Remove both letters (correct and wrong)
                        setLetters([]);

                        // Check if word is complete
                        if (newCollected.length === targetWord.length && newCollected.join('') === targetWord) {
                            setWordComplete(true);
                            setScore(prev => prev + 50); // Bonus for completing word

                            // Show feedback animation
                            if (!hasEatenWrongLetter) {
                                setFeedbackMessage('perfect');
                            } else {
                                setFeedbackMessage('good');
                            }

                            // Animate feedback
                            feedbackOpacity.value = withSequence(
                                withTiming(1, { duration: 200 }),
                                withTiming(1, { duration: 800 }),
                                withTiming(0, { duration: 200 })
                            );
                            feedbackScale.value = withSequence(
                                withSpring(1.2, { damping: 8, stiffness: 100 }),
                                withSpring(1, { damping: 10, stiffness: 100 }),
                                withTiming(0.5, { duration: 200 })
                            );
                            feedbackTranslateY.value = withSequence(
                                withSpring(0, { damping: 8, stiffness: 100 }),
                                withSpring(0, { damping: 10, stiffness: 100 }),
                                withTiming(20, { duration: 200 })
                            );

                            // Reset feedback after animation
                            setTimeout(() => {
                                setFeedbackMessage(null);
                                feedbackOpacity.value = 0;
                                feedbackScale.value = 0.5;
                                feedbackTranslateY.value = -20;
                            }, 1200);

                            // Reduce snake body if no wrong letters were eaten
                            if (!hasEatenWrongLetter) {
                                const wordLength = targetWord.length;
                                setSnake(prevSnake => {
                                    const newLength = Math.max(1, prevSnake.length - wordLength);
                                    return prevSnake.slice(0, newLength);
                                });
                            }

                            // Generate new word after delay
                            setTimeout(() => {
                                const newWord = generateWord();
                                setCurrentWord(newWord);
                                setCollectedLetters([]);
                                setHasEatenWrongLetter(false);
                                setWordComplete(false);
                                const newLetters = generateNextLetters(newWord.english, 0);
                                setLetters(newLetters);
                            }, 1500);
                        } else {
                            // Generate next pair of letters
                            const nextLetters = generateNextLetters(targetWord, newCollected.length);
                            setLetters(nextLetters);
                        }
                    } else {
                        // Wrong letter - just remove it, no new letters
                        setHasEatenWrongLetter(true);
                        setScore(prev => Math.max(0, prev - 5));
                        // Remove only the wrong letter
                        setLetters(prev => prev.filter((_, i) => i !== eatenLetterIndex));
                    }
                } else {
                    newSnake = newSnake.slice(0, -1);
                }

                return newSnake;
            });
        }, INITIAL_SPEED);

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
            }
        };
    }, [gameStarted, gameOver, wordComplete, nextDirection, letters, collectedLetters, currentWord, score, highScore, hasEatenWrongLetter]);

    const handleDirection = (dir: Direction) => {
        if (!gameStarted || gameOver) return;

        // Prevent reversing into itself
        if (
            (dir === 'UP' && direction !== 'DOWN') ||
            (dir === 'DOWN' && direction !== 'UP') ||
            (dir === 'LEFT' && direction !== 'RIGHT') ||
            (dir === 'RIGHT' && direction !== 'LEFT')
        ) {
            setNextDirection(dir);
        }
    };

    // Swipe gesture handler
    const panResponder = React.useMemo(
        () => PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderRelease: (evt, gestureState) => {
                if (!gameStarted || gameOver) return;

                const now = Date.now();
                if (now - lastSwipeTime.current < 100) return;
                lastSwipeTime.current = now;

                const { dx, dy } = gestureState;
                const absDx = Math.abs(dx);
                const absDy = Math.abs(dy);

                if (absDx < 20 && absDy < 20) return;

                if (absDx > absDy) {
                    handleDirection(dx > 0 ? 'RIGHT' : 'LEFT');
                } else {
                    handleDirection(dy > 0 ? 'DOWN' : 'UP');
                }
            },
        }),
        [gameStarted, gameOver, direction]
    );

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setWordComplete(false);
        setScore(0);
        setSnake([{ x: 7, y: 7 }]);
        setCollectedLetters([]);
        setHasEatenWrongLetter(false);
        setCurrentWord(null);
        setDirection('RIGHT');
        setNextDirection('RIGHT');
    };

    const resetGame = () => {
        setGameStarted(false);
        setSnake([{ x: 7, y: 7 }]);
        setCollectedLetters([]);
        setHasEatenWrongLetter(false);
        setCurrentWord(null);
        setLetters([]);
        setDirection('RIGHT');
        setNextDirection('RIGHT');
        setGameOver(false);
        setWordComplete(false);
        setScore(0);
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
        }
    };

    const scaleStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleAnim.value }],
    }));

    const feedbackStyle = useAnimatedStyle(() => ({
        opacity: feedbackOpacity.value,
        transform: [
            { scale: feedbackScale.value },
            { translateY: feedbackTranslateY.value },
        ],
    }));

    // If game 2, show memory card game
    if (gameId === 2) {
        return <MemoryCardGame />;
    }

    // If game 3, show glass bridge game
    if (gameId === 3) {
        return <GlassBridgeGame />;
    }

    // If game 4, show word scramble game
    if (gameId === 4) {
        return <WordScrambleGame />;
    }

    // If not game 1, 2, 3, or 4, show placeholder
    if (gameId !== 1) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Game {gameId}</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.placeholderContainer}>
                    <Ionicons name="game-controller" size={64} color="#433D8B" />
                    <Text style={styles.placeholderText}>Game {gameId} coming soon!</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Back to Games</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.scoreContainer}>
                    <View style={styles.scoreBox}>
                        <Text style={styles.scoreLabel}>Score</Text>
                        <Text style={styles.scoreValue}>{score}</Text>
                    </View>
                    <View style={styles.scoreBox}>
                        <Text style={styles.scoreLabel}>Best</Text>
                        <Text style={styles.scoreValue}>{highScore}</Text>
                    </View>
                </View>
            </View>

            {/* Mongolian Word Display */}
            {currentWord && (
                <View style={styles.wordDisplay}>
                    <Text style={styles.mongolianWord}>{currentWord.mongolian}</Text>
                    <View style={styles.translationProgress}>
                        <Text style={styles.progressLabel}>Translation:</Text>
                        <Text style={styles.progressWord}>
                            {collectedLetters.length > 0
                                ? collectedLetters.join('') + '_'.repeat(Math.max(0, currentWord.english.replace(/\s/g, '').length - collectedLetters.length))
                                : '_'.repeat(currentWord.english.replace(/\s/g, '').length)}
                        </Text>
                    </View>
                </View>
            )}

            {/* Game Board */}
            <View style={styles.boardContainer} {...panResponder.panHandlers}>
                <View style={styles.board}>
                    {/* Render grid lines */}
                    {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
                        <View
                            key={`v-line-${i}`}
                            style={[
                                styles.gridLine,
                                styles.verticalLine,
                                { left: i * CELL_SIZE },
                            ]}
                        />
                    ))}
                    {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
                        <View
                            key={`h-line-${i}`}
                            style={[
                                styles.gridLine,
                                styles.horizontalLine,
                                { top: i * CELL_SIZE },
                            ]}
                        />
                    ))}

                    {/* Render snake */}
                    {snake.map((segment, index) => (
                        <Animated.View
                            key={`snake-${index}`}
                            style={[
                                styles.segment,
                                {
                                    left: segment.x * CELL_SIZE,
                                    top: segment.y * CELL_SIZE,
                                    backgroundColor: index === 0 ? '#C8ACD6' : '#5A8F7B',
                                },
                                index === 0 ? scaleStyle : {},
                            ]}
                        />
                    ))}

                    {/* Render letters */}
                    {letters.map((letterItem, index) => (
                        <Animated.View
                            key={`letter-${index}`}
                            style={[
                                styles.segment,
                                letterItem.isCorrect ? styles.letterCorrect : styles.letterWrong,
                                {
                                    left: letterItem.position.x * CELL_SIZE,
                                    top: letterItem.position.y * CELL_SIZE,
                                },
                            ]}
                        >
                            <Text style={styles.letterText}>{letterItem.letter}</Text>
                        </Animated.View>
                    ))}

                    {/* Start Screen Overlay */}
                    {!gameStarted && !gameOver && (
                        <View style={styles.overlay}>
                            <View style={styles.startBox}>
                                <Ionicons name="game-controller" size={48} color="#C8ACD6" />
                                <Text style={styles.startText}>Snake Game</Text>
                                <Text style={styles.startSubtext}>Collect letters to spell the translation</Text>
                                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                                    <Text style={styles.startButtonText}>Start?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Feedback Animation */}
                    {feedbackMessage && (
                        <Animated.View style={[styles.feedbackContainer, feedbackStyle]}>
                            <Text style={[
                                styles.feedbackText,
                                feedbackMessage === 'perfect' ? styles.feedbackPerfect : styles.feedbackGood
                            ]}>
                                {feedbackMessage === 'perfect' ? 'Гайхамшигтай!' : 'Дажтүй шөө !'}
                            </Text>
                        </Animated.View>
                    )}

                    {/* Game Over Overlay */}
                    {gameOver && (
                        <View style={styles.overlay}>
                            <View style={styles.gameOverBox}>
                                <Ionicons name="game-controller" size={48} color="#C8ACD6" />
                                <Text style={styles.gameOverText}>Game Over!</Text>
                                <Text style={styles.finalScore}>Final Score: {score}</Text>
                                {score === highScore && highScore > 0 && (
                                    <Text style={styles.newRecord}>New Record!</Text>
                                )}
                                <View style={styles.gameOverButtons}>
                                    <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                                        <Text style={styles.resetButtonText}>Play Again</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                        <Text style={styles.backButtonText}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>

        </View>
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
        marginBottom: 12,
    },
    wordDisplay: {
        backgroundColor: '#2E236C',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#433D8B',
    },
    mongolianWord: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    translationProgress: {
        alignItems: 'center',
    },
    progressLabel: {
        fontSize: 12,
        color: '#C8ACD6',
        opacity: 0.8,
        marginBottom: 6,
        fontWeight: '600',
    },
    progressWord: {
        fontSize: 20,
        fontWeight: '700',
        color: '#C8ACD6',
        letterSpacing: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    scoreContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    scoreBox: {
        backgroundColor: '#433D8B',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 10,
        color: '#FFFFFF',
        opacity: 0.8,
        fontWeight: '600',
    },
    scoreValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#C8ACD6',
        marginTop: 2,
    },
    boardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    board: {
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        backgroundColor: '#2E236C',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#5A4FA3',
        overflow: 'hidden',
        position: 'relative',
    },
    gridLine: {
        position: 'absolute',
        backgroundColor: '#433D8B',
    },
    verticalLine: {
        width: 1,
        height: '100%',
    },
    horizontalLine: {
        height: 1,
        width: '100%',
    },
    segment: {
        position: 'absolute',
        width: CELL_SIZE - 2,
        height: CELL_SIZE - 2,
        margin: 1,
        borderRadius: 4,
    },
    letterCorrect: {
        backgroundColor: '#5A4FA3',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterWrong: {
        backgroundColor: '#5A4FA3',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    feedbackContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -80,
        marginTop: -30,
        zIndex: 1000,
    },
    feedbackText: {
        fontSize: 32,
        fontWeight: '800',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    feedbackPerfect: {
        color: '#58CC02',
    },
    feedbackGood: {
        color: '#C8ACD6',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
    },
    startBox: {
        backgroundColor: '#433D8B',
        paddingHorizontal: 32,
        paddingVertical: 28,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#5A4FA3',
    },
    startText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 12,
        marginBottom: 8,
    },
    startSubtext: {
        fontSize: 14,
        color: '#C8ACD6',
        marginBottom: 20,
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#C8ACD6',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 16,
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#17153B',
    },
    gameOverBox: {
        backgroundColor: '#433D8B',
        paddingHorizontal: 32,
        paddingVertical: 28,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#5A4FA3',
    },
    gameOverText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 12,
        marginBottom: 8,
    },
    finalScore: {
        fontSize: 16,
        fontWeight: '600',
        color: '#C8ACD6',
        marginBottom: 8,
    },
    newRecord: {
        fontSize: 14,
        fontWeight: '700',
        color: '#C8ACD6',
        marginTop: 8,
        marginBottom: 16,
    },
    gameOverButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    resetButton: {
        backgroundColor: '#C8ACD6',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 16,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#17153B',
    },
    backButton: {
        backgroundColor: '#433D8B',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#5A4FA3',
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#C8ACD6',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    placeholderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#C8ACD6',
    },
});
