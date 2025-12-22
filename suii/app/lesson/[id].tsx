import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';

interface ConversationMessage {
    speaker: 'A' | 'B';
    text: string;
}

interface Phrase {
    id: number;
    text: string;
    translation: string;
    breakdown: Array<{ word: string; meaning: string }>;
    words: string[];
    extraWords: string[];
    vocabPairs: Array<{ english: string; mongolian: string }>;
    multipleChoice: Array<{
        question: string;
        options: string[];
        correct: number;
    }>;
}

const conversation: ConversationMessage[] = [
    { speaker: 'A', text: "Hey! Good morning. How are you?" },
    { speaker: 'B', text: "I'm good. I'm not busy today." },
    { speaker: 'A', text: "Nice! but I'm a little tired." },
    { speaker: 'B', text: "I'm not tired. I feel energetic." },
    { speaker: 'A', text: "Good for you" },
];

const phrases: Phrase[] = [
    {
        id: 1,
        text: "Hey! Good morning. How are you?",
        translation: "Сайн уу! Өглөөний мэнд. Та яаж байна?",
        breakdown: [
            { word: "Hey", meaning: "Сайн уу" },
            { word: "Good morning", meaning: "Өглөөний мэнд" },
            { word: "How are you?", meaning: "Та яаж байна?" },
        ],
        words: ["Hey", "Good", "morning", "How", "are", "you"],
        extraWords: ["Hello", "Hi"],
        vocabPairs: [
            { english: "Hey", mongolian: "Сайн уу" },
            { english: "Good morning", mongolian: "Өглөөний мэнд" },
            { english: "How are you", mongolian: "Та яаж байна" },
            { english: "Good", mongolian: "Сайн" },
        ],
        multipleChoice: [
            {
                question: "What does 'Good morning' mean?",
                options: ["Өглөөний мэнд", "Сайн уу", "Баяртай", "Баярлалаа"],
                correct: 0,
            },
            {
                question: "Which word means 'How'?",
                options: ["Good", "How", "morning", "you"],
                correct: 1,
            },
        ],
    },
    {
        id: 2,
        text: "I'm good. I'm not busy today.",
        translation: "Би сайн байна. Өнөөдөр би завгүй биш.",
        breakdown: [
            { word: "I'm", meaning: "Би" },
            { word: "good", meaning: "сайн" },
            { word: "not busy", meaning: "завгүй биш" },
            { word: "today", meaning: "өнөөдөр" },
        ],
        words: ["I'm", "good", "I'm", "not", "busy", "today"],
        extraWords: ["I", "am"],
        vocabPairs: [
            { english: "I'm", mongolian: "Би" },
            { english: "good", mongolian: "сайн" },
            { english: "busy", mongolian: "завгүй" },
            { english: "today", mongolian: "өнөөдөр" },
        ],
        multipleChoice: [
            {
                question: "What does 'busy' mean?",
                options: ["сайн", "завгүй", "өнөөдөр", "би"],
                correct: 1,
            },
            {
                question: "Which word means 'today'?",
                options: ["good", "busy", "today", "not"],
                correct: 2,
            },
        ],
    },
    {
        id: 3,
        text: "Nice! but I'm a little tired.",
        translation: "Сайн байна! Гэхдээ би бага зэрэг ядарсан байна.",
        breakdown: [
            { word: "Nice", meaning: "Сайн байна" },
            { word: "but", meaning: "гэхдээ" },
            { word: "I'm", meaning: "би" },
            { word: "a little", meaning: "бага зэрэг" },
            { word: "tired", meaning: "ядарсан" },
        ],
        words: ["Nice", "but", "I'm", "a", "little", "tired"],
        extraWords: ["I", "am"],
        vocabPairs: [
            { english: "Nice", mongolian: "Сайн байна" },
            { english: "but", mongolian: "гэхдээ" },
            { english: "tired", mongolian: "ядарсан" },
            { english: "little", mongolian: "бага" },
        ],
        multipleChoice: [
            {
                question: "What does 'tired' mean?",
                options: ["ядарсан", "сайн", "гэхдээ", "бага"],
                correct: 0,
            },
            {
                question: "Which word means 'but'?",
                options: ["Nice", "but", "little", "tired"],
                correct: 1,
            },
        ],
    },
    {
        id: 4,
        text: "I'm not tired. I feel energetic.",
        translation: "Би ядарсангүй. Би эрч хүчтэй мэдэрч байна.",
        breakdown: [
            { word: "I'm not", meaning: "Би ... биш" },
            { word: "tired", meaning: "ядарсан" },
            { word: "I feel", meaning: "Би мэдэрч байна" },
            { word: "energetic", meaning: "эрч хүчтэй" },
        ],
        words: ["I'm", "not", "tired", "I", "feel", "energetic"],
        extraWords: ["am", "I"],
        vocabPairs: [
            { english: "tired", mongolian: "ядарсан" },
            { english: "feel", mongolian: "мэдрэх" },
            { english: "energetic", mongolian: "эрч хүчтэй" },
            { english: "not", mongolian: "биш" },
        ],
        multipleChoice: [
            {
                question: "What does 'energetic' mean?",
                options: ["ядарсан", "эрч хүчтэй", "мэдрэх", "биш"],
                correct: 1,
            },
            {
                question: "Which word means 'feel'?",
                options: ["tired", "feel", "energetic", "not"],
                correct: 1,
            },
        ],
    },
    {
        id: 5,
        text: "Good for you",
        translation: "Таны хувьд сайн байна",
        breakdown: [
            { word: "Good", meaning: "Сайн" },
            { word: "for", meaning: "хувьд" },
            { word: "you", meaning: "та" },
        ],
        words: ["Good", "for", "you"],
        extraWords: ["I", "am"],
        vocabPairs: [
            { english: "Good", mongolian: "Сайн" },
            { english: "for", mongolian: "хувьд" },
            { english: "you", mongolian: "та" },
            { english: "Good for you", mongolian: "Таны хувьд сайн" },
        ],
        multipleChoice: [
            {
                question: "What does 'for' mean?",
                options: ["сайн", "хувьд", "та", "би"],
                correct: 1,
            },
            {
                question: "Which phrase means 'Good for you'?",
                options: ["Good", "for", "you", "Good for you"],
                correct: 3,
            },
        ],
    },
];

type LessonStep = 'conversation' | 'phrase-breakdown' | 'multiple-choice-1' | 'multiple-choice-2' | 'sentence-builder' | 'vocab-match' | 'completion';

export default function LessonDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { completeLesson } = useApp();
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState<LessonStep>('conversation');
    const [displayedMessages, setDisplayedMessages] = useState<number>(0);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
    const [selectedMongolian, setSelectedMongolian] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Array<{ english: string; mongolian: string }>>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [scrambledWords, setScrambledWords] = useState<string[]>([]);

    const currentPhrase = phrases[currentPhraseIndex];
    const isLastPhrase = currentPhraseIndex === phrases.length - 1;
    const isLastStep = currentStep === 'vocab-match';

    // Scramble words when entering sentence builder
    useEffect(() => {
        if (currentStep === 'sentence-builder') {
            const allWords = [...currentPhrase.words, ...currentPhrase.extraWords];
            // Shuffle array
            const shuffled = [...allWords].sort(() => Math.random() - 0.5);
            setScrambledWords(shuffled);
            setSelectedWords([]);
            setIsCorrect(null);
        }
    }, [currentStep, currentPhraseIndex]);

    useEffect(() => {
        if (currentStep === 'conversation') {
            setDisplayedMessages(0);
            const timer = setInterval(() => {
                setDisplayedMessages((prev) => {
                    if (prev < conversation.length) {
                        return prev + 1;
                    } else {
                        clearInterval(timer);
                        return prev;
                    }
                });
            }, 2000);
            return () => clearInterval(timer);
        }
    }, [currentStep, currentPhraseIndex]);

    const handleNext = () => {
        if (currentStep === 'conversation') {
            setCurrentStep('phrase-breakdown');
        } else if (currentStep === 'phrase-breakdown') {
            setCurrentStep('multiple-choice-1');
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else if (currentStep === 'multiple-choice-1') {
            setCurrentStep('multiple-choice-2');
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else if (currentStep === 'multiple-choice-2') {
            setCurrentStep('sentence-builder');
            setSelectedWords([]);
        } else if (currentStep === 'sentence-builder') {
            setCurrentStep('vocab-match');
            setSelectedEnglish(null);
            setSelectedMongolian(null);
            setMatchedPairs([]);
        } else if (currentStep === 'vocab-match') {
            if (isLastPhrase && isLastStep) {
                setCurrentStep('completion');
            } else {
                setCurrentPhraseIndex(currentPhraseIndex + 1);
                setCurrentStep('phrase-breakdown');
                setSelectedWords([]);
                setSelectedAnswer(null);
                setSelectedEnglish(null);
                setSelectedMongolian(null);
                setMatchedPairs([]);
                setIsCorrect(null);
            }
        }
    };

    const handleMultipleChoice = (index: number) => {
        setSelectedAnswer(index);
        const correct = index === currentPhrase.multipleChoice[currentStep === 'multiple-choice-1' ? 0 : 1].correct;
        setIsCorrect(correct);
    };

    const handleWordSelect = (word: string) => {
        if (selectedWords.includes(word)) {
            setSelectedWords(selectedWords.filter(w => w !== word));
        } else {
            setSelectedWords([...selectedWords, word]);
        }
    };

    const handleSentenceSubmit = () => {
        if (selectedWords.length === 0) return;

        // Normalize words - lowercase and trim
        const normalizeWord = (word: string) => word.toLowerCase().trim();

        // Get expected words from phrase data (already split correctly)
        const expectedWords = currentPhrase.words.map(normalizeWord);

        // Get user's selected words
        const userWords = selectedWords.map(normalizeWord);

        // Check if all words match in exact order
        const correct = userWords.length === expectedWords.length &&
            userWords.every((word, idx) => word === expectedWords[idx]);

        setIsCorrect(correct);

        if (correct) {
            // Wait to show success message, then advance
            setTimeout(() => {
                handleNext();
            }, 2000);
        }
    };

    const handleVocabWordSelect = (word: string, isEnglish: boolean) => {
        if (isEnglish) {
            setSelectedEnglish(selectedEnglish === word ? null : word);
        } else {
            setSelectedMongolian(selectedMongolian === word ? null : word);
        }

        if (isEnglish && selectedMongolian) {
            checkVocabMatch(word, selectedMongolian);
        } else if (!isEnglish && selectedEnglish) {
            checkVocabMatch(selectedEnglish, word);
        }
    };

    const checkVocabMatch = (english: string, mongolian: string) => {
        const pair = currentPhrase.vocabPairs.find(p => p.english === english && p.mongolian === mongolian);
        if (pair && !matchedPairs.find(p => p.english === english)) {
            setMatchedPairs([...matchedPairs, pair]);
            setSelectedEnglish(null);
            setSelectedMongolian(null);

            if (matchedPairs.length + 1 === currentPhrase.vocabPairs.length) {
                setTimeout(() => {
                    handleNext();
                }, 1000);
            }
        } else {
            setTimeout(() => {
                setSelectedEnglish(null);
                setSelectedMongolian(null);
            }, 500);
        }
    };

    const handleComplete = () => {
        completeLesson(id || '1');
        router.back();
    };

    const renderConversation = () => {
        return (
            <View style={styles.conversationContainer}>
                <Text style={styles.conversationTitle}>Read the Conversation</Text>
                <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
                    {conversation.slice(0, displayedMessages).map((msg, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.message,
                                msg.speaker === 'A' ? styles.messageA : styles.messageB,
                            ]}
                        >
                            <Text style={[
                                styles.messageText,
                                msg.speaker === 'A' ? styles.messageTextA : styles.messageTextB,
                            ]}>
                                {msg.text}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
                {displayedMessages >= conversation.length && (
                    <TouchableOpacity style={styles.startButton} onPress={handleNext}>
                        <Text style={styles.startButtonText}>Start Learning</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderPhraseBreakdown = () => {
        return (
            <View style={styles.breakdownContainer}>
                <Text style={styles.breakdownTitle}>Phrase {currentPhraseIndex + 1}</Text>
                <View style={styles.phraseCard}>
                    <Text style={styles.phraseText}>{currentPhrase.text}</Text>
                    <Text style={styles.translationText}>{currentPhrase.translation}</Text>
                </View>
                <View style={styles.breakdownSection}>
                    <Text style={styles.breakdownLabel}>Breakdown:</Text>
                    {currentPhrase.breakdown.map((item, idx) => (
                        <View key={idx} style={styles.breakdownItem}>
                            <Text style={styles.breakdownWord}>{item.word}</Text>
                            <Text style={styles.breakdownMeaning}>{item.meaning}</Text>
                        </View>
                    ))}
                </View>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    };

    const renderMultipleChoice = () => {
        const questionIndex = currentStep === 'multiple-choice-1' ? 0 : 1;
        const question = currentPhrase.multipleChoice[questionIndex];
        const progress = currentStep === 'multiple-choice-1' ? 1 : 2;

        return (
            <View style={styles.mcContainer}>
                <Text style={styles.mcTitle}>Question {progress} of 2</Text>
                <Text style={styles.mcQuestion}>{question.question}</Text>
                <View style={styles.mcOptions}>
                    {question.options.map((option, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[
                                styles.mcOption,
                                selectedAnswer === idx && isCorrect === true && styles.mcOptionCorrect,
                                selectedAnswer === idx && isCorrect === false && styles.mcOptionIncorrect,
                                selectedAnswer === idx && isCorrect === null && styles.mcOptionSelected,
                            ]}
                            onPress={() => handleMultipleChoice(idx)}
                            disabled={isCorrect !== null}
                        >
                            <Text style={[
                                styles.mcOptionText,
                                selectedAnswer === idx && isCorrect === true && styles.mcOptionTextCorrect,
                                selectedAnswer === idx && isCorrect === false && styles.mcOptionTextIncorrect,
                            ]}>
                                {option}
                            </Text>
                            {selectedAnswer === idx && isCorrect === true && (
                                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                            )}
                            {selectedAnswer === idx && isCorrect === false && (
                                <Ionicons name="close-circle" size={24} color="#fff" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
                {isCorrect === true && (
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Continue</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderSentenceBuilder = () => {
        const availableWords = scrambledWords.filter(w => !selectedWords.includes(w));

        return (
            <View style={styles.builderContainer}>
                <Text style={styles.builderTitle}>Build the Sentence</Text>
                <View style={styles.selectedWordsContainer}>
                    {selectedWords.length === 0 ? (
                        <Text style={styles.placeholderText}>Tap words below to form the sentence</Text>
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
                    {availableWords.map((word, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.wordButton}
                            onPress={() => handleWordSelect(word)}
                        >
                            <Text style={styles.wordButtonText}>{word}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity
                    style={[styles.submitButton, (selectedWords.length === 0 || isCorrect === true) && styles.submitButtonDisabled]}
                    onPress={handleSentenceSubmit}
                    disabled={selectedWords.length === 0 || isCorrect === true}
                >
                    <Text style={styles.submitButtonText}>
                        {isCorrect === true ? 'Correct!' : 'Check Answer'}
                    </Text>
                </TouchableOpacity>
                {isCorrect === false && (
                    <View>
                        <Text style={styles.incorrectText}>Try again! The correct sentence is:</Text>
                        <Text style={styles.correctSentenceText}>{currentPhrase.text}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => {
                                setSelectedWords([]);
                                setIsCorrect(null);
                            }}
                        >
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {isCorrect === true && (
                    <Text style={styles.correctText}>Correct! Great job! Moving to next task...</Text>
                )}
            </View>
        );
    };

    const renderVocabMatch = () => {
        const englishWords = currentPhrase.vocabPairs.map(p => p.english);
        const mongolianWords = currentPhrase.vocabPairs.map(p => p.mongolian);
        const matchedEnglish = matchedPairs.map(p => p.english);
        const matchedMongolian = matchedPairs.map(p => p.mongolian);

        return (
            <View style={styles.matchContainer}>
                <Text style={styles.matchTitle}>Match the Words</Text>
                <View style={styles.matchColumns}>
                    <View style={styles.matchColumn}>
                        <Text style={styles.matchColumnTitle}>English</Text>
                        {englishWords.map((word, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.matchItem,
                                    matchedEnglish.includes(word) && styles.matchItemMatched,
                                    selectedEnglish === word && styles.matchItemSelected,
                                ]}
                                onPress={() => handleVocabWordSelect(word, true)}
                                disabled={matchedEnglish.includes(word)}
                            >
                                <Text style={styles.matchText}>{word}</Text>
                                {matchedEnglish.includes(word) && (
                                    <Ionicons name="checkmark-circle" size={20} color="#58CC02" />
                                )}
                                {selectedEnglish === word && !matchedEnglish.includes(word) && (
                                    <Ionicons name="radio-button-on" size={20} color="#1CB0F6" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.matchColumn}>
                        <Text style={styles.matchColumnTitle}>Mongolian</Text>
                        {mongolianWords.map((word, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.matchItem,
                                    matchedMongolian.includes(word) && styles.matchItemMatched,
                                    selectedMongolian === word && styles.matchItemSelected,
                                ]}
                                onPress={() => handleVocabWordSelect(word, false)}
                                disabled={matchedMongolian.includes(word)}
                            >
                                <Text style={styles.matchText}>{word}</Text>
                                {matchedMongolian.includes(word) && (
                                    <Ionicons name="checkmark-circle" size={20} color="#58CC02" />
                                )}
                                {selectedMongolian === word && !matchedMongolian.includes(word) && (
                                    <Ionicons name="radio-button-on" size={20} color="#1CB0F6" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        );
    };

    const renderCompletion = () => {
        return (
            <View style={styles.completionContainer}>
                <Ionicons name="checkmark-circle" size={100} color="#58CC02" />
                <Text style={styles.completionTitle}>Lesson Complete!</Text>
                <Text style={styles.completionSubtitle}>Great job! You've mastered this conversation.</Text>
                <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                    <Text style={styles.completeButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Lesson {id}</Text>
                    <Text style={styles.headerSubtitle}>
                        Phrase {currentPhraseIndex + 1} of {phrases.length}
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                {currentStep === 'conversation' && renderConversation()}
                {currentStep === 'phrase-breakdown' && renderPhraseBreakdown()}
                {currentStep === 'multiple-choice-1' && renderMultipleChoice()}
                {currentStep === 'multiple-choice-2' && renderMultipleChoice()}
                {currentStep === 'sentence-builder' && renderSentenceBuilder()}
                {currentStep === 'vocab-match' && renderVocabMatch()}
                {currentStep === 'completion' && renderCompletion()}
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
    conversationContainer: {
        flex: 1,
        padding: 20,
    },
    conversationTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    messagesContainer: {
        flex: 1,
        marginBottom: 20,
    },
    messagesContent: {
        paddingBottom: 20,
    },
    message: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        maxWidth: '80%',
    },
    messageA: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5E5',
        borderTopLeftRadius: 4,
    },
    messageB: {
        alignSelf: 'flex-end',
        backgroundColor: '#58CC02',
        borderTopRightRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    messageTextA: {
        color: '#333',
    },
    messageTextB: {
        color: '#fff',
    },
    startButton: {
        backgroundColor: '#58CC02',
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    breakdownContainer: {
        padding: 20,
    },
    breakdownTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    phraseCard: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    phraseText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        lineHeight: 32,
    },
    translationText: {
        fontSize: 18,
        color: '#666',
        fontStyle: 'italic',
        lineHeight: 26,
    },
    breakdownSection: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    breakdownLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    breakdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    breakdownWord: {
        fontSize: 16,
        fontWeight: '600',
        color: '#58CC02',
    },
    breakdownMeaning: {
        fontSize: 16,
        color: '#666',
    },
    nextButton: {
        backgroundColor: '#58CC02',
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    mcContainer: {
        padding: 20,
    },
    mcTitle: {
        fontSize: 16,
        color: '#999',
        marginBottom: 8,
    },
    mcQuestion: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 24,
    },
    mcOptions: {
        gap: 12,
        marginBottom: 20,
    },
    mcOption: {
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
    mcOptionSelected: {
        borderColor: '#58CC02',
        backgroundColor: '#E8F5E9',
    },
    mcOptionCorrect: {
        borderColor: '#58CC02',
        backgroundColor: '#58CC02',
    },
    mcOptionIncorrect: {
        borderColor: '#FF3B30',
        backgroundColor: '#FF3B30',
    },
    mcOptionText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
        flex: 1,
    },
    mcOptionTextCorrect: {
        color: '#fff',
    },
    mcOptionTextIncorrect: {
        color: '#fff',
    },
    builderContainer: {
        padding: 20,
    },
    builderTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },
    selectedWordsContainer: {
        minHeight: 100,
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
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
        paddingVertical: 12,
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
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    wordButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#58CC02',
        paddingVertical: 18,
        borderRadius: 16,
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
    feedbackContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    incorrectText: {
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '600',
    },
    correctSentenceText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
        fontStyle: 'italic',
    },
    retryButton: {
        backgroundColor: '#1CB0F6',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginTop: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    correctText: {
        marginTop: 16,
        fontSize: 16,
        color: '#58CC02',
        textAlign: 'center',
        fontWeight: '600',
    },
    matchContainer: {
        padding: 20,
    },
    matchTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 24,
    },
    matchColumns: {
        flexDirection: 'row',
        gap: 16,
    },
    matchColumn: {
        flex: 1,
    },
    matchColumnTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    matchItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    matchItemSelected: {
        borderColor: '#1CB0F6',
        backgroundColor: '#E3F2FD',
    },
    matchItemMatched: {
        backgroundColor: '#E8F5E9',
        borderColor: '#58CC02',
    },
    matchText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
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
        marginBottom: 12,
    },
    completionSubtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    completeButton: {
        backgroundColor: '#58CC02',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 25,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    completeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
});
