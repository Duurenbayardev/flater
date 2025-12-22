import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../contexts/AppContext';

type QuestionType = 'multiple-choice' | 'translation' | 'word-bank' | 'listen';

interface Question {
    id: number;
    type: QuestionType;
    question: string;
    questionMongolian?: string;
    options?: string[];
    correct: number | string;
    audio?: string;
}

const questions: Question[] = [
    {
        id: 1,
        type: 'translation',
        question: 'Select the correct translation',
        questionMongolian: '"Сайн уу" гэж англиар юу гэж хэлэх вэ?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
        correct: 0,
    },
    {
        id: 2,
        type: 'multiple-choice',
        question: 'Complete the sentence: "I ___ a student."',
        questionMongolian: 'Өгүүлбэрийг бөглөнө үү: "I ___ a student."',
        options: ['am', 'is', 'are', 'be'],
        correct: 0,
    },
    {
        id: 3,
        type: 'word-bank',
        question: 'Arrange the words to form a sentence',
        questionMongolian: 'Үгсийг зөв дарааллаар байрлуул',
        options: ['I', 'am', 'happy', 'today'],
        correct: 'I am happy today',
    },
    {
        id: 4,
        type: 'multiple-choice',
        question: 'What is the plural of "book"?',
        questionMongolian: '"Book" гэдэг үгийн олон тоо юу вэ?',
        options: ['books', 'bookes', 'bookies', 'book'],
        correct: 0,
    },
    {
        id: 5,
        type: 'translation',
        question: 'Select the correct translation',
        questionMongolian: '"Баярлалаа" гэж англиар юу гэж хэлэх вэ?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
        correct: 2,
    },
    {
        id: 6,
        type: 'multiple-choice',
        question: 'Choose the correct verb: "She ___ to school every day."',
        questionMongolian: 'Зөв үйл үгийг сонго: "She ___ to school every day."',
        options: ['go', 'goes', 'going', 'went'],
        correct: 1,
    },
    {
        id: 7,
        type: 'word-bank',
        question: 'Arrange the words to form a sentence',
        questionMongolian: 'Үгсийг зөв дарааллаар байрлуул',
        options: ['My', 'name', 'is', 'Bat'],
        correct: 'My name is Bat',
    },
    {
        id: 8,
        type: 'translation',
        question: 'Select the correct translation',
        questionMongolian: '"Уучлаарай" гэж англиар юу гэж хэлэх вэ?',
        options: ['Please', 'Sorry', 'Thank you', 'Hello'],
        correct: 1,
    },
    {
        id: 9,
        type: 'multiple-choice',
        question: 'What is "water" in English?',
        questionMongolian: '"Ус" гэж англиар юу гэж хэлэх вэ?',
        options: ['water', 'fire', 'earth', 'air'],
        correct: 0,
    },
    {
        id: 10,
        type: 'multiple-choice',
        question: 'Complete: "I have ___ apple."',
        questionMongolian: 'Бөглөнө үү: "I have ___ apple."',
        options: ['a', 'an', 'the', 'some'],
        correct: 1,
    },
];

const calculateLevel = (score: number): number => {
    // More accurate level calculation based on score
    if (score <= 2) return 1; // Beginner (Б1)
    if (score <= 4) return 2; // Elementary (Б2)
    if (score <= 6) return 3; // Intermediate (А1)
    if (score <= 8) return 4; // Upper Intermediate (А2)
    return 5; // Advanced (С1)
};

export default function LevelTest() {
    const router = useRouter();
    const { completeTest, hasCompletedTest, setNewSignup } = useApp();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<(number | string)[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [shakeAnimation] = useState(new Animated.Value(0));

    // Reset test state when component mounts
    useEffect(() => {
        setCurrentQuestion(0);
        setAnswers([]);
        setSelectedAnswer(null);
        setSelectedWords([]);
        setIsCorrect(null);
    }, []);

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const handleAnswer = (index: number | string) => {
        setSelectedAnswer(index);
        // Normalize comparison for string answers (word-bank questions)
        let correct = false;
        if (typeof question.correct === 'string' && typeof index === 'string') {
            correct = index.toLowerCase().trim() === question.correct.toLowerCase().trim();
        } else {
            correct = index === question.correct;
        }
        setIsCorrect(correct);

        if (!correct) {
            Animated.sequence([
                Animated.timing(shakeAnimation, {
                    toValue: 10,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: -10,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 10,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true,
                }),
            ]).start();
        }

        setTimeout(() => {
            const newAnswers = [...answers, index];
            setAnswers(newAnswers);

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
                setSelectedWords([]);
                setIsCorrect(null);
            } else {
                // Calculate final score
                const score = newAnswers.filter((ans, idx) => {
                    const correctAnswer = questions[idx].correct;
                    if (typeof correctAnswer === 'string' && typeof ans === 'string') {
                        return ans.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
                    }
                    return ans === correctAnswer;
                }).length;

                const level = calculateLevel(score);
                completeTest(level);

                // Wait a bit before navigating to show completion
                setTimeout(() => {
                    setNewSignup(false); // Clear new signup flag
                    router.replace('/(tabs)/home' as any);
                }, 1500);
            }
        }, correct ? 800 : 1500);
    };

    const handleWordSelect = (word: string) => {
        if (selectedWords.includes(word)) {
            setSelectedWords(selectedWords.filter(w => w !== word));
        } else {
            setSelectedWords([...selectedWords, word]);
        }
    };

    const handleWordBankSubmit = () => {
        const answer = selectedWords.join(' ');
        handleAnswer(answer);
    };

    const renderQuestion = () => {
        switch (question.type) {
            case 'multiple-choice':
            case 'translation':
                return (
                    <View style={styles.optionsContainer}>
                        {question.options?.map((option, index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    { transform: [{ translateX: shakeAnimation }] },
                                    isCorrect === false && selectedAnswer === index && styles.shakeContainer,
                                ]}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        selectedAnswer === index && isCorrect === true && styles.optionCorrect,
                                        selectedAnswer === index && isCorrect === false && styles.optionIncorrect,
                                        selectedAnswer === index && isCorrect === null && styles.optionSelected,
                                    ]}
                                    onPress={() => handleAnswer(index)}
                                    disabled={isCorrect !== null}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            selectedAnswer === index && isCorrect === true && styles.optionTextCorrect,
                                            selectedAnswer === index && isCorrect === false && styles.optionTextIncorrect,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                    {selectedAnswer === index && isCorrect === true && (
                                        <Ionicons name="checkmark-circle" size={24} color="#fff" />
                                    )}
                                    {selectedAnswer === index && isCorrect === false && (
                                        <Ionicons name="close-circle" size={24} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                );

            case 'word-bank':
                return (
                    <View style={styles.wordBankContainer}>
                        <View style={styles.selectedWordsContainer}>
                            {selectedWords.length === 0 ? (
                                <Text style={styles.placeholderText}>Tap words below to form a sentence</Text>
                            ) : (
                                selectedWords.map((word, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={styles.selectedWord}
                                        onPress={() => handleWordSelect(word)}
                                    >
                                        <Text style={styles.selectedWordText}>{word}</Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                        <View style={styles.wordsGrid}>
                            {question.options
                                ?.filter(w => !selectedWords.includes(w))
                                .map((word, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.wordButton}
                                        onPress={() => handleWordSelect(word)}
                                    >
                                        <Text style={styles.wordButtonText}>{word}</Text>
                                    </TouchableOpacity>
                                ))}
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                selectedWords.length === 0 && styles.submitButtonDisabled,
                            ]}
                            onPress={handleWordBankSubmit}
                            disabled={selectedWords.length === 0 || isCorrect !== null}
                        >
                            <Text style={styles.submitButtonText}>Submit Answer</Text>
                        </TouchableOpacity>
                        {isCorrect === false && (
                            <Text style={styles.incorrectText}>
                                Try again! The correct answer is: {question.correct}
                            </Text>
                        )}
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>
                    Question {currentQuestion + 1} of {questions.length}
                </Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <View style={styles.questionContainer}>
                    <View style={styles.questionHeader}>
                        <Ionicons name="help-circle" size={32} color="#58CC02" />
                        <Text style={styles.questionType}>
                            {question.type === 'translation' ? 'Translation' :
                                question.type === 'word-bank' ? 'Sentence Builder' :
                                    'Multiple Choice'}
                        </Text>
                    </View>
                    <Text style={styles.question}>{question.question}</Text>
                    {question.questionMongolian && (
                        <Text style={styles.questionMongolian}>{question.questionMongolian}</Text>
                    )}
                </View>

                {renderQuestion()}
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
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#E5E5E5',
        borderRadius: 3,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#58CC02',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600',
        textAlign: 'center',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    questionContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    questionType: {
        fontSize: 14,
        fontWeight: '600',
        color: '#58CC02',
        marginLeft: 8,
        textTransform: 'uppercase',
    },
    question: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        lineHeight: 32,
    },
    questionMongolian: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
        lineHeight: 24,
    },
    optionsContainer: {
        gap: 12,
    },
    option: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    optionSelected: {
        borderColor: '#58CC02',
        backgroundColor: '#E8F5E9',
    },
    optionCorrect: {
        borderColor: '#58CC02',
        backgroundColor: '#58CC02',
    },
    optionIncorrect: {
        borderColor: '#FF3B30',
        backgroundColor: '#FF3B30',
    },
    optionText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
        flex: 1,
    },
    optionTextCorrect: {
        color: '#fff',
    },
    optionTextIncorrect: {
        color: '#fff',
    },
    shakeContainer: {
        opacity: 1,
    },
    wordBankContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    selectedWordsContainer: {
        minHeight: 80,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
    },
    selectedWord: {
        backgroundColor: '#58CC02',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    selectedWordText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    wordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    wordButton: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    wordButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#58CC02',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    incorrectText: {
        marginTop: 16,
        fontSize: 14,
        color: '#FF3B30',
        textAlign: 'center',
    },
});
