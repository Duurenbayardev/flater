import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

const learnedWords = [
    { english: 'Hello', mongolian: 'Сайн уу' },
    { english: 'Thank you', mongolian: 'Баярлалаа' },
    { english: 'Please', mongolian: 'Гуйя' },
    { english: 'Water', mongolian: 'Ус' },
    { english: 'Food', mongolian: 'Хоол' },
];

export default function GameScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [score, setScore] = useState(0);
    const [currentRound, setCurrentRound] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const scale = useSharedValue(1);

    const gameId = parseInt(id || '1');
    const maxRounds = 5;
    const currentWord = learnedWords[currentRound % learnedWords.length];

    // Generate wrong answers
    const wrongAnswers = learnedWords
        .filter(w => w.english !== currentWord.english)
        .slice(0, 3)
        .map(w => w.mongolian);

    const allAnswers = [currentWord.mongolian, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = allAnswers.indexOf(currentWord.mongolian);

    const handleAnswer = (index: number) => {
        setSelectedAnswer(index);
        const correct = index === correctIndex;
        setIsCorrect(correct);

        if (correct) {
            setScore(score + 1);
            scale.value = withSequence(
                withSpring(1.2),
                withSpring(1)
            );
        }

        setTimeout(() => {
            if (currentRound < maxRounds - 1) {
                setCurrentRound(currentRound + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                // Game over
                router.back();
            }
        }, correct ? 1000 : 2000);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    if (currentRound >= maxRounds) {
        return (
            <View style={styles.container}>
                <View style={styles.completionContainer}>
                    <Animated.View style={animatedStyle}>
                        <Ionicons name="trophy" size={80} color="#FFD700" />
                    </Animated.View>
                    <Text style={styles.completionTitle}>Game Complete!</Text>
                    <Text style={styles.completionScore}>Score: {score}/{maxRounds}</Text>
                    <TouchableOpacity
                        style={styles.completionButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.completionButtonText}>Back to Games</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Score: {score}/{maxRounds}</Text>
                </View>
                <View style={styles.roundContainer}>
                    <Text style={styles.roundText}>Round {currentRound + 1}/{maxRounds}</Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionLabel}>What is the Mongolian translation of:</Text>
                    <Text style={styles.questionWord}>{currentWord.english}</Text>
                </View>

                <View style={styles.answersContainer}>
                    {allAnswers.map((answer, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.answerButton,
                                selectedAnswer === index && isCorrect === true && styles.answerButtonCorrect,
                                selectedAnswer === index && isCorrect === false && styles.answerButtonIncorrect,
                                selectedAnswer === index && isCorrect === null && styles.answerButtonSelected,
                            ]}
                            onPress={() => handleAnswer(index)}
                            disabled={isCorrect !== null}
                        >
                            <Text style={[
                                styles.answerText,
                                selectedAnswer === index && isCorrect === true && styles.answerTextCorrect,
                                selectedAnswer === index && isCorrect === false && styles.answerTextIncorrect,
                            ]}>
                                {answer}
                            </Text>
                            {selectedAnswer === index && isCorrect !== null && (
                                <Ionicons
                                    name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                                    size={24}
                                    color={isCorrect ? '#58CC02' : '#FF3B30'}
                                />
                            )}
                        </TouchableOpacity>
                    ))}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    scoreContainer: {
        backgroundColor: '#58CC02',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    scoreText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    roundContainer: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    roundText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    questionContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 32,
        marginBottom: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    questionLabel: {
        fontSize: 16,
        color: '#999',
        marginBottom: 16,
    },
    questionWord: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#58CC02',
    },
    answersContainer: {
        gap: 16,
    },
    answerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    answerButtonSelected: {
        borderColor: '#58CC02',
        backgroundColor: '#E8F5E9',
    },
    answerButtonCorrect: {
        borderColor: '#58CC02',
        backgroundColor: '#E8F5E9',
    },
    answerButtonIncorrect: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFEBEE',
    },
    answerText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    answerTextCorrect: {
        color: '#58CC02',
        fontWeight: 'bold',
    },
    answerTextIncorrect: {
        color: '#FF3B30',
        fontWeight: 'bold',
    },
    completionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    completionTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 24,
        marginBottom: 16,
    },
    completionScore: {
        fontSize: 24,
        color: '#58CC02',
        fontWeight: 'bold',
        marginBottom: 32,
    },
    completionButton: {
        backgroundColor: '#58CC02',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 16,
    },
    completionButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

