import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useApp } from '../../contexts/AppContext';
import { playCompletionSound, playUnitCompleteSound } from '../../utils/audio';

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
                question: "What does 'How' mean?",
                options: ["яаж", "Сайн", "Өглөө", "та"],
                correct: 0,
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
                question: "What does 'today' mean?",
                options: ["сайн", "завгүй", "өнөөдөр", "биш"],
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
                question: "What does 'but' mean?",
                options: ["Сайн байна", "гэхдээ", "бага", "ядарсан"],
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
                question: "What does 'feel' mean?",
                options: ["ядарсан", "мэдрэх", "эрч хүчтэй", "биш"],
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
                question: "What does 'Good for you' mean?",
                options: ["Сайн", "хувьд", "та", "Таны хувьд сайн"],
                correct: 3,
            },
        ],
    },
];

type LessonStep = 'conversation' | 'phrase-breakdown' | 'multiple-choice-1' | 'multiple-choice-2' | 'sentence-builder' | 'vocab-match' | 'completion';

/**
 * Encouragement message component with animation
 * Displays at the top of the screen when user gets a question right
 */
const EncouragementMessage = ({
    message,
    scale,
    opacity
}: {
    message: string;
    scale: any;
    opacity: any;
}) => {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    if (!message) return null;

    return (
        <Animated.View style={[styles.encouragementTopContainer, animatedStyle]}>
            <Text style={styles.encouragementText}>{message}</Text>
        </Animated.View>
    );
};

export default function LessonDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { completeLesson } = useApp();
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState<LessonStep>('conversation');
    const [displayedMessages, setDisplayedMessages] = useState<number>(0);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [selectedWordIndices, setSelectedWordIndices] = useState<number[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
    const [selectedMongolian, setSelectedMongolian] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Array<{ english: string; mongolian: string }>>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [scrambledWords, setScrambledWords] = useState<string[]>([]);
    const [scrambledEnglish, setScrambledEnglish] = useState<string[]>([]);
    const [scrambledMongolian, setScrambledMongolian] = useState<string[]>([]);
    const [encouragementMessage, setEncouragementMessage] = useState<string>('');

    // Animation values for encouraging message
    const encouragementScale = useSharedValue(0);
    const encouragementOpacity = useSharedValue(0);

    // Encouraging messages to show when user gets questions right
    const encouragementMessages = [
        "Excellent! 🎉",
        "Perfect! You're doing great! ⭐",
        "Amazing work! Keep it up! 💪",
        "Outstanding! You're a star! ✨",
        "Fantastic! You're on fire! 🔥",
        "Brilliant! Well done! 👏",
        "Superb! You're incredible! 🌟",
        "Wonderful! Keep going! 🚀"
    ];

    const currentPhrase = phrases[currentPhraseIndex];
    const isLastPhrase = currentPhraseIndex === phrases.length - 1;
    const isLastStep = currentStep === 'vocab-match';

    // Calculate progress
    const getProgress = () => {
        const totalSteps = phrases.length * 6; // 6 steps per phrase (conversation, breakdown, mc1, mc2, builder, vocab)
        const completedSteps = currentPhraseIndex * 6;
        let currentStepProgress = 0;

        if (currentStep === 'conversation') currentStepProgress = 0;
        else if (currentStep === 'phrase-breakdown') currentStepProgress = 1;
        else if (currentStep === 'multiple-choice-1') currentStepProgress = 2;
        else if (currentStep === 'multiple-choice-2') currentStepProgress = 3;
        else if (currentStep === 'sentence-builder') currentStepProgress = 4;
        else if (currentStep === 'vocab-match') currentStepProgress = 5;
        else if (currentStep === 'completion') currentStepProgress = 6;

        return ((completedSteps + currentStepProgress) / totalSteps) * 100;
    };

    /**
     * Scramble words when entering sentence builder step
     * Combines required words and extra (distractor) words, then shuffles them
     */
    useEffect(() => {
        if (currentStep === 'sentence-builder') {
            // Combine required words with extra distractor words
            const allWords = [...currentPhrase.words, ...currentPhrase.extraWords];
            // Shuffle array randomly
            const shuffled = [...allWords].sort(() => Math.random() - 0.5);
            setScrambledWords(shuffled);
            setSelectedWords([]);
            setSelectedWordIndices([]);
            setIsCorrect(null);
            setEncouragementMessage(''); // Reset encouragement message
        }
    }, [currentStep, currentPhraseIndex]);

    // Scramble vocab words when entering vocab match
    useEffect(() => {
        if (currentStep === 'vocab-match') {
            const englishWords = [...currentPhrase.vocabPairs.map(p => p.english)];
            const mongolianWords = [...currentPhrase.vocabPairs.map(p => p.mongolian)];
            setScrambledEnglish(englishWords.sort(() => Math.random() - 0.5));
            setScrambledMongolian(mongolianWords.sort(() => Math.random() - 0.5));
            setSelectedEnglish(null);
            setSelectedMongolian(null);
            setMatchedPairs([]);
        }
    }, [currentStep, currentPhraseIndex]);

    /**
     * Display conversation messages one by one with a timer
     * Shows messages every 2 seconds when on the conversation step
     */
    useEffect(() => {
        if (currentStep === 'conversation') {
            setDisplayedMessages(0);
            // Create interval to show messages progressively
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
            return () => clearInterval(timer); // Cleanup on unmount
        }
    }, [currentStep, currentPhraseIndex]);

    /**
     * Play unit complete sound when lesson completion screen appears
     * This triggers when user finishes all phrases and reaches the completion step
     */
    useEffect(() => {
        if (currentStep === 'completion') {
            playUnitCompleteSound();
        }
    }, [currentStep]);

    /**
     * Handle navigation to next step in the lesson flow
     * Manages state transitions between different lesson steps
     */
    const handleNext = () => {
        if (currentStep === 'conversation') {
            // Move from conversation to phrase breakdown
            setCurrentStep('phrase-breakdown');
        } else if (currentStep === 'phrase-breakdown') {
            // Move to first multiple choice question
            setCurrentStep('multiple-choice-1');
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else if (currentStep === 'multiple-choice-1') {
            // Move to second multiple choice question
            setCurrentStep('multiple-choice-2');
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else if (currentStep === 'multiple-choice-2') {
            // Move to sentence builder task
            setCurrentStep('sentence-builder');
            setSelectedWords([]);
            setSelectedWordIndices([]);
        } else if (currentStep === 'sentence-builder') {
            // Move to vocabulary matching task
            setCurrentStep('vocab-match');
            setSelectedEnglish(null);
            setSelectedMongolian(null);
            setMatchedPairs([]);
        } else if (currentStep === 'vocab-match') {
            // Check if this is the last phrase and last step
            if (isLastPhrase && isLastStep) {
                // All phrases completed - show completion screen
                setCurrentStep('completion');
            } else {
                // Move to next phrase
                setCurrentPhraseIndex(currentPhraseIndex + 1);
                setCurrentStep('phrase-breakdown');
                // Reset all state for new phrase
                setSelectedWords([]);
                setSelectedWordIndices([]);
                setSelectedAnswer(null);
                setSelectedEnglish(null);
                setSelectedMongolian(null);
                setMatchedPairs([]);
                setIsCorrect(null);
            }
        }
    };

    /**
     * Handle multiple choice answer selection
     * @param index - The index of the selected answer option
     */
    const handleMultipleChoice = (index: number) => {
        setSelectedAnswer(index);
        // Determine which question we're on (first or second multiple choice)
        const questionIndex = currentStep === 'multiple-choice-1' ? 0 : 1;
        const correct = index === currentPhrase.multipleChoice[questionIndex].correct;
        setIsCorrect(correct);

        if (correct) {
            // Play completion sound for correct answer
            playCompletionSound();
            // Show random encouraging message with animation
            const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
            setEncouragementMessage(randomMessage);
            // Animate encouragement message
            encouragementScale.value = withSpring(1, { damping: 10, stiffness: 100 });
            encouragementOpacity.value = withTiming(1, { duration: 300 });
        } else {
            setEncouragementMessage(''); // Clear message on incorrect answer
            encouragementScale.value = withTiming(0, { duration: 200 });
            encouragementOpacity.value = withTiming(0, { duration: 200 });
        }
    };

    /**
     * Handle word selection in sentence builder
     * Toggles word selection - adds if not selected, removes if already selected
     * @param word - The word text
     * @param wordIndex - The index of the word in the scrambled words array
     */
    const handleWordSelect = (word: string, wordIndex: number) => {
        const indexInSelected = selectedWordIndices.indexOf(wordIndex);
        if (indexInSelected !== -1) {
            // Word already selected - remove it
            setSelectedWords(selectedWords.filter((_, idx) => idx !== indexInSelected));
            setSelectedWordIndices(selectedWordIndices.filter((_, idx) => idx !== indexInSelected));
        } else {
            // Word not selected - add it
            setSelectedWords([...selectedWords, word]);
            setSelectedWordIndices([...selectedWordIndices, wordIndex]);
        }
    };

    /**
     * Remove a word from the selected words array
     * Called when user taps on a selected word in the sentence builder
     * @param index - The index in the selectedWords array to remove
     */
    const handleRemoveSelectedWord = (index: number) => {
        setSelectedWords(selectedWords.filter((_, idx) => idx !== index));
        setSelectedWordIndices(selectedWordIndices.filter((_, idx) => idx !== index));
    };

    /**
     * Handle sentence builder submission
     * Validates if the user's selected words match the correct sentence in order
     */
    const handleSentenceSubmit = () => {
        if (selectedWords.length === 0) return;

        // Normalize words - lowercase and trim for comparison
        const normalizeWord = (word: string) => word.toLowerCase().trim();

        // Get expected words from phrase data (already split correctly)
        const expectedWords = currentPhrase.words.map(normalizeWord);

        // Get user's selected words and normalize them
        const userWords = selectedWords.map(normalizeWord);

        // Check if all words match in exact order
        const correct = userWords.length === expectedWords.length &&
            userWords.every((word, idx) => word === expectedWords[idx]);

        setIsCorrect(correct);

        if (correct) {
            // Play completion sound for correct answer
            playCompletionSound();
            // Show random encouraging message with animation
            const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
            setEncouragementMessage(randomMessage);
            // Animate encouragement message
            encouragementScale.value = withSpring(1, { damping: 10, stiffness: 100 });
            encouragementOpacity.value = withTiming(1, { duration: 300 });
            // Wait to show success message, then advance to next step
            setTimeout(() => {
                handleNext();
            }, 2000);
        } else {
            setEncouragementMessage(''); // Clear message on incorrect answer
            encouragementScale.value = withTiming(0, { duration: 200 });
            encouragementOpacity.value = withTiming(0, { duration: 200 });
        }
    };

    /**
     * Handle vocabulary word selection in vocab matching task
     * Toggles selection and automatically checks for matches when both words are selected
     * @param word - The selected word text
     * @param isEnglish - True if English word, false if Mongolian word
     */
    const handleVocabWordSelect = (word: string, isEnglish: boolean) => {
        if (isEnglish) {
            // Toggle English word selection
            setSelectedEnglish(selectedEnglish === word ? null : word);
        } else {
            // Toggle Mongolian word selection
            setSelectedMongolian(selectedMongolian === word ? null : word);
        }

        // If both words are now selected, check if they match
        if (isEnglish && selectedMongolian) {
            checkVocabMatch(word, selectedMongolian);
        } else if (!isEnglish && selectedEnglish) {
            checkVocabMatch(selectedEnglish, word);
        }
    };

    /**
     * Check if selected English and Mongolian words form a valid vocabulary pair
     * @param english - The selected English word
     * @param mongolian - The selected Mongolian word
     */
    const checkVocabMatch = (english: string, mongolian: string) => {
        // Find if this pair exists in the phrase's vocabulary pairs
        const pair = currentPhrase.vocabPairs.find(p => p.english === english && p.mongolian === mongolian);

        // Check if pair is valid and not already matched
        if (pair && !matchedPairs.find(p => p.english === english)) {
            // Play completion sound for correct match
            playCompletionSound();
            // Show encouraging message with animation
            const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
            setEncouragementMessage(randomMessage);
            // Animate encouragement message
            encouragementScale.value = withSpring(1, { damping: 10, stiffness: 100 });
            encouragementOpacity.value = withTiming(1, { duration: 300 });
            // Add to matched pairs
            setMatchedPairs([...matchedPairs, pair]);
            setSelectedEnglish(null);
            setSelectedMongolian(null);

            // Check if all pairs are matched (task complete)
            if (matchedPairs.length + 1 === currentPhrase.vocabPairs.length) {
                setTimeout(() => {
                    handleNext();
                }, 1000);
            }
        } else {
            // Invalid match - clear selection after short delay
            setTimeout(() => {
                setSelectedEnglish(null);
                setSelectedMongolian(null);
            }, 500);
        }
    };

    /**
     * Handle lesson completion - called when user clicks continue on completion screen
     * Marks the lesson as complete and navigates back
     */
    const handleComplete = () => {
        // Play unit complete sound before completing
        playUnitCompleteSound();
        // Mark lesson as completed in app context
        completeLesson(id || '1');
        // Navigate back to previous screen
        router.back();
    };

    const renderConversation = () => {
        const skipConversation = () => {
            setDisplayedMessages(conversation.length);
        };

        return (
            <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                style={styles.conversationContainer}
            >
                <View style={styles.conversationHeader}>
                    <Text style={styles.conversationTitle}>Read the Conversation</Text>
                    {displayedMessages < conversation.length && (
                        <TouchableOpacity style={styles.skipButton} onPress={skipConversation}>
                            <Text style={styles.skipButtonText}>Skip</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
                    {conversation.slice(0, displayedMessages).map((msg, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.messageContainer,
                                msg.speaker === 'A' ? styles.messageContainerA : styles.messageContainerB,
                            ]}
                        >
                            <View style={styles.avatarContainer}>
                                <View style={[
                                    styles.avatar,
                                    msg.speaker === 'A' ? styles.avatarA : styles.avatarB,
                                ]}>
                                    <Ionicons
                                        name={msg.speaker === 'A' ? 'person' : 'person-outline'}
                                        size={24}
                                        color={msg.speaker === 'A' ? '#58CC02' : '#fff'}
                                    />
                                </View>
                            </View>
                            <View
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
                        </View>
                    ))}
                </ScrollView>
                {displayedMessages >= conversation.length && (
                    <TouchableOpacity style={styles.startButton} onPress={handleNext}>
                        <Text style={styles.startButtonText}>Start Learning</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </Animated.View>
        );
    };

    const renderPhraseBreakdown = () => {
        return (
            <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                style={styles.breakdownContainer}
            >
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
            </Animated.View>
        );
    };

    const renderMultipleChoice = () => {
        const questionIndex = currentStep === 'multiple-choice-1' ? 0 : 1;
        const question = currentPhrase.multipleChoice[questionIndex];
        const progress = currentStep === 'multiple-choice-1' ? 1 : 2;

        return (
            <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                style={styles.mcContainer}
            >
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
                {isCorrect === false && (
                    <TouchableOpacity
                        style={styles.tryAgainButton}
                        onPress={() => {
                            setSelectedAnswer(null);
                            setIsCorrect(null);
                        }}
                    >
                        <Text style={styles.tryAgainButtonText}>Try Again</Text>
                        <Ionicons name="refresh" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </Animated.View>
        );
    };

    const renderSentenceBuilder = () => {
        return (
            <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                style={styles.builderContainer}
            >
                <Text style={styles.builderTitle}>Build the Sentence</Text>
                <View style={styles.translationHint}>
                    <Text style={styles.translationHintLabel}>Translation:</Text>
                    <Text style={styles.translationHintText}>{currentPhrase.translation}</Text>
                </View>
                <View style={styles.selectedWordsContainer}>
                    {selectedWords.length === 0 ? (
                        <Text style={styles.placeholderText}>Tap words below to form the sentence</Text>
                    ) : (
                        selectedWords.map((word, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.selectedWord}
                                onPress={() => handleRemoveSelectedWord(idx)}
                            >
                                <Text style={styles.selectedWordText}>{word}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
                <View style={styles.wordsGrid}>
                    {scrambledWords.map((word, idx) => {
                        const isSelected = selectedWordIndices.includes(idx);
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.wordButton,
                                    isSelected && styles.wordButtonSelected,
                                ]}
                                onPress={() => handleWordSelect(word, idx)}
                                disabled={isSelected}
                            >
                                <Text style={[
                                    styles.wordButtonText,
                                    isSelected && styles.wordButtonTextSelected,
                                ]}>
                                    {word}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
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
                {/* Improved error feedback design - cleaner and more appealing */}
                {isCorrect === false && (
                    <Animated.View entering={FadeIn.duration(300)} style={styles.errorFeedbackContainer}>
                        <View style={styles.errorIconContainer}>
                            <Ionicons name="close-circle" size={32} color="#FF3B30" />
                        </View>
                        <Text style={styles.incorrectText}>Not quite right</Text>
                        <Text style={styles.correctSentenceLabel}>The correct sentence is:</Text>
                        <View style={styles.correctSentenceBox}>
                            <Text style={styles.correctSentenceText}>{currentPhrase.text}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => {
                                setSelectedWords([]);
                                setSelectedWordIndices([]);
                                setIsCorrect(null);
                                setEncouragementMessage('');
                            }}
                        >
                            <Ionicons name="refresh" size={18} color="#fff" style={styles.retryIcon} />
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
                {isCorrect === true && (
                    <Text style={styles.correctText}>Moving to next task...</Text>
                )}
            </Animated.View>
        );
    };

    /**
     * Render vocabulary matching interface
     * Shows English and Mongolian words in two columns for matching
     */
    const renderVocabMatch = () => {
        const matchedEnglish = matchedPairs.map(p => p.english);
        const matchedMongolian = matchedPairs.map(p => p.mongolian);

        return (
            <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                style={styles.matchContainer}
            >
                <Text style={styles.matchTitle}>Match the Words</Text>
                <View style={styles.matchColumns}>
                    <View style={styles.matchColumn}>
                        <Text style={styles.matchColumnTitle}>English</Text>
                        {scrambledEnglish.map((word, idx) => (
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
                        {scrambledMongolian.map((word, idx) => (
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
            </Animated.View>
        );
    };

    const renderCompletion = () => {
        return (
            <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                style={styles.completionContainer}
            >
                <Ionicons name="checkmark-circle" size={100} color="#58CC02" />
                <Text style={styles.completionTitle}>Lesson Complete!</Text>
                <Text style={styles.completionSubtitle}>Great job! You've mastered this conversation.</Text>
                <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                    <Text style={styles.completeButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Fixed position header */}
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

            {/* Fixed position progress bar */}
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${getProgress()}%` }]} />
            </View>

            {/* Encouraging message at the top with animation */}
            <EncouragementMessage
                message={encouragementMessage}
                scale={encouragementScale}
                opacity={encouragementOpacity}
            />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
            >
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
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
    progressBarContainer: {
        position: 'absolute',
        top: 120, // Below header
        left: 0,
        right: 0,
        zIndex: 99,
        height: 4,
        backgroundColor: '#E5E5E5',
        width: '100%',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#58CC02',
        borderRadius: 2,
    },
    content: {
        flex: 1,
        marginTop: 124, // Space for fixed header and progress bar
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    // Encouraging message at the top with fixed position
    encouragementTopContainer: {
        position: 'absolute',
        top: 124, // Below progress bar
        left: 0,
        right: 0,
        zIndex: 98,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#E8F5E9',
        borderBottomWidth: 2,
        borderBottomColor: '#58CC02',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    conversationContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    conversationTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    skipButton: {
        backgroundColor: '#E5E5E5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    skipButtonText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
    messagesContainer: {
        flex: 1,
        marginBottom: 20,
    },
    messagesContent: {
        paddingBottom: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        maxWidth: '85%',
    },
    messageContainerA: {
        alignSelf: 'flex-start',
    },
    messageContainerB: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    avatarContainer: {
        marginHorizontal: 8,
        justifyContent: 'flex-end',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarA: {
        backgroundColor: '#E5E5E5',
    },
    avatarB: {
        backgroundColor: '#58CC02',
    },
    message: {
        padding: 16,
        borderRadius: 20,
        flex: 1,
    },
    messageA: {
        backgroundColor: '#E5E5E5',
        borderTopLeftRadius: 4,
    },
    messageB: {
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
        justifyContent: 'center',
        flex: 1,
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
    tryAgainButton: {
        backgroundColor: '#ca1cf6ff',
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    tryAgainButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    mcContainer: {
        padding: 20,
        justifyContent: 'center',
        flex: 1,
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
        justifyContent: 'center',
        flex: 1,
    },
    builderTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    translationHint: {
        backgroundColor: '#E3F2FD',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#1CB0F6',
    },
    translationHintLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 6,
    },
    translationHintText: {
        fontSize: 18,
        color: '#333',
        fontStyle: 'italic',
        lineHeight: 26,
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
    wordButtonSelected: {
        backgroundColor: '#E5E5E5',
        borderColor: '#999',
        opacity: 0.5,
    },
    wordButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    wordButtonTextSelected: {
        color: '#999',
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
    encouragementText: {
        fontSize: 18,
        color: '#2E7D32',
        textAlign: 'center',
        fontWeight: '700',
    },
    // Improved error feedback container - cleaner design
    errorFeedbackContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#FFF5F5',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#FFE0E0',
        alignItems: 'center',
    },
    errorIconContainer: {
        marginBottom: 12,
    },
    incorrectText: {
        fontSize: 18,
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    correctSentenceLabel: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '500',
    },
    // Box container for correct sentence - more visually appealing
    correctSentenceBox: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginBottom: 16,
        width: '100%',
    },
    correctSentenceText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: '500',
    },
    // Improved retry button - better styling, no weird blue
    retryButton: {
        backgroundColor: '#58CC02',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    retryIcon: {
        marginRight: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
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
        justifyContent: 'center',
        flex: 1,
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
