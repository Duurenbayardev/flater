import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../../../contexts/AppContext';

type TaskType = 'sentence-builder' | 'vocabulary-match' | 'chat-bot';

interface SentenceTask {
    id: number;
    sentence: string;
    words: string[];
    scrambledWords: string[];
}

interface VocabMatchTask {
    id: number;
    pairs: Array<{ english: string; mongolian: string }>;
}

const sentenceTasks: SentenceTask[] = [
    {
        id: 1,
        sentence: 'I am happy today',
        words: ['I', 'am', 'happy', 'today'],
        scrambledWords: ['today', 'I', 'happy', 'am'],
    },
    {
        id: 2,
        sentence: 'Hello how are you',
        words: ['Hello', 'how', 'are', 'you'],
        scrambledWords: ['you', 'Hello', 'are', 'how'],
    },
    {
        id: 3,
        sentence: 'Thank you very much',
        words: ['Thank', 'you', 'very', 'much'],
        scrambledWords: ['much', 'Thank', 'very', 'you'],
    },
    {
        id: 4,
        sentence: 'I love learning English',
        words: ['I', 'love', 'learning', 'English'],
        scrambledWords: ['English', 'I', 'learning', 'love'],
    },
];

const vocabMatchTasks: VocabMatchTask[] = [
    {
        id: 1,
        pairs: [
            { english: 'Hello', mongolian: 'Сайн уу' },
            { english: 'Thank you', mongolian: 'Баярлалаа' },
            { english: 'Please', mongolian: 'Гуйя' },
            { english: 'Goodbye', mongolian: 'Баяртай' },
        ],
    },
    {
        id: 2,
        pairs: [
            { english: 'Water', mongolian: 'Ус' },
            { english: 'Food', mongolian: 'Хоол' },
            { english: 'Book', mongolian: 'Ном' },
            { english: 'Friend', mongolian: 'Найз' },
        ],
    },
];

const completionMessages = [
    "Wow, you're amazing!",
    "Incredible work! You're a star!",
    "Perfect! You're doing great!",
    "Excellent! Keep it up!",
    "Outstanding! You're a natural!",
    "Fantastic! You're on fire!",
    "Brilliant! You're unstoppable!",
    "Superb! You're incredible!",
];

export default function TaskScreen() {
    const router = useRouter();
    const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
    const { completeLesson } = useApp();
    const taskType = type as TaskType;

    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [currentVocabIndex, setCurrentVocabIndex] = useState(0);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
    const [selectedMongolian, setSelectedMongolian] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Array<{ english: string; mongolian: string }>>([]);
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [completionMessage, setCompletionMessage] = useState('');
    const [showCompletion, setShowCompletion] = useState(false);
    const [wordAnimations] = useState<Animated.Value[]>(
        sentenceTasks[0].scrambledWords.map(() => new Animated.Value(0))
    );

    const animateWord = (index: number) => {
        Animated.sequence([
            Animated.timing(wordAnimations[index], {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(wordAnimations[index], {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleWordSelect = (word: string) => {
        const wordIndex = sentenceTasks[currentSentenceIndex].scrambledWords.indexOf(word);
        if (wordIndex >= 0) {
            animateWord(wordIndex);
        }
        if (selectedWords.includes(word)) {
            setSelectedWords(selectedWords.filter(w => w !== word));
        } else {
            setSelectedWords([...selectedWords, word]);
        }
    };

    const handleSentenceSubmit = () => {
        const currentTask = sentenceTasks[currentSentenceIndex];
        const answer = selectedWords.join(' ');
        const correct = answer.toLowerCase().trim() === currentTask.sentence.toLowerCase().trim();
        setIsCorrect(correct);

        if (correct) {
            const randomMessage = completionMessages[Math.floor(Math.random() * completionMessages.length)];
            setCompletionMessage(randomMessage);
            setShowCompletion(true);

            setTimeout(() => {
                setShowCompletion(false);
                if (currentSentenceIndex < sentenceTasks.length - 1) {
                    setCurrentSentenceIndex(currentSentenceIndex + 1);
                    setSelectedWords([]);
                    setIsCorrect(null);
                } else {
                    completeLesson(id || '1');
                    router.back();
                }
            }, 2000);
        }
    };

    const handleVocabWordSelect = (word: string, isEnglish: boolean) => {
        if (isEnglish) {
            if (selectedEnglish === word) {
                setSelectedEnglish(null);
            } else {
                setSelectedEnglish(word);
                // Check if we can match
                if (selectedMongolian) {
                    checkVocabMatch(word, selectedMongolian);
                }
            }
        } else {
            if (selectedMongolian === word) {
                setSelectedMongolian(null);
            } else {
                setSelectedMongolian(word);
                // Check if we can match
                if (selectedEnglish) {
                    checkVocabMatch(selectedEnglish, word);
                }
            }
        }
    };

    const checkVocabMatch = (english: string, mongolian: string) => {
        const currentTask = vocabMatchTasks[currentVocabIndex];
        const pair = currentTask.pairs.find(p => p.english === english && p.mongolian === mongolian);

        if (pair && !matchedPairs.find(p => p.english === english)) {
            setMatchedPairs([...matchedPairs, pair]);
            setSelectedEnglish(null);
            setSelectedMongolian(null);

            if (matchedPairs.length + 1 === currentTask.pairs.length) {
                const randomMessage = completionMessages[Math.floor(Math.random() * completionMessages.length)];
                setCompletionMessage(randomMessage);
                setShowCompletion(true);

                setTimeout(() => {
                    setShowCompletion(false);
                    if (currentVocabIndex < vocabMatchTasks.length - 1) {
                        setCurrentVocabIndex(currentVocabIndex + 1);
                        setMatchedPairs([]);
                        setSelectedEnglish(null);
                        setSelectedMongolian(null);
                    } else {
                        completeLesson(id || '1');
                        router.back();
                    }
                }, 2000);
            }
        } else {
            // Wrong match - reset selection
            setTimeout(() => {
                setSelectedEnglish(null);
                setSelectedMongolian(null);
            }, 500);
        }
    };

    const handleChatSend = () => {
        if (chatMessage.trim()) {
            setChatMessages([...chatMessages, { text: chatMessage, isUser: true }]);
            setTimeout(() => {
                setChatMessages([
                    ...chatMessages,
                    { text: chatMessage, isUser: true },
                    { text: 'Great! Keep practicing!', isUser: false },
                ]);
            }, 500);
            setChatMessage('');

            if (chatMessages.length >= 4) {
                const randomMessage = completionMessages[Math.floor(Math.random() * completionMessages.length)];
                setCompletionMessage(randomMessage);
                setShowCompletion(true);
                setTimeout(() => {
                    setShowCompletion(false);
                    completeLesson(id || '1');
                    router.back();
                }, 2000);
            }
        }
    };

    const renderSentenceBuilder = () => {
        const currentTask = sentenceTasks[currentSentenceIndex];
        const availableWords = currentTask.scrambledWords.filter(w => !selectedWords.includes(w));

        return (
            <View style={styles.taskContainer}>
                <View style={styles.taskHeader}>
                    <Text style={styles.taskProgress}>
                        Sentence {currentSentenceIndex + 1} of {sentenceTasks.length}
                    </Text>
                </View>
                <Text style={styles.question}>Build the sentence:</Text>
                <View style={styles.selectedWordsContainer}>
                    {selectedWords.length === 0 ? (
                        <Text style={styles.placeholderText}>Tap words below to form a sentence</Text>
                    ) : (
                        selectedWords.map((word, idx) => {
                            const animValue = wordAnimations[currentTask.scrambledWords.indexOf(word)] || new Animated.Value(0);
                            const scale = animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.1],
                            });
                            return (
                                <Animated.View
                                    key={idx}
                                    style={[styles.selectedWord, { transform: [{ scale }] }]}
                                >
                                    <TouchableOpacity onPress={() => handleWordSelect(word)}>
                                        <Text style={styles.selectedWordText}>{word}</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            );
                        })
                    )}
                </View>
                <View style={styles.wordBank}>
                    <Text style={styles.wordBankLabel}>Available words:</Text>
                    <View style={styles.wordsGrid}>
                        {availableWords.map((word, index) => {
                            const animValue = wordAnimations[index] || new Animated.Value(0);
                            const scale = animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.2],
                            });
                            return (
                                <Animated.View key={index} style={{ transform: [{ scale }] }}>
                                    <TouchableOpacity
                                        style={styles.wordButton}
                                        onPress={() => handleWordSelect(word)}
                                    >
                                        <Text style={styles.wordButtonText}>{word}</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            );
                        })}
                    </View>
                </View>
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        selectedWords.length === 0 && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSentenceSubmit}
                    disabled={selectedWords.length === 0 || isCorrect !== null}
                >
                    <Text style={styles.submitButtonText}>Check Answer</Text>
                </TouchableOpacity>
                {isCorrect === false && (
                    <Text style={styles.incorrectText}>
                        Try again! The correct sentence is: {currentTask.sentence}
                    </Text>
                )}
            </View>
        );
    };

    const renderVocabMatch = () => {
        const currentTask = vocabMatchTasks[currentVocabIndex];
        const englishWords = currentTask.pairs.map(p => p.english);
        const mongolianWords = currentTask.pairs.map(p => p.mongolian);
        const matchedEnglish = matchedPairs.map(p => p.english);
        const matchedMongolian = matchedPairs.map(p => p.mongolian);

        return (
            <View style={styles.taskContainer}>
                <View style={styles.taskHeader}>
                    <Text style={styles.taskProgress}>
                        Match {currentVocabIndex + 1} of {vocabMatchTasks.length}
                    </Text>
                </View>
                <Text style={styles.question}>Match English words with their Mongolian translations:</Text>
                <Text style={styles.matchHint}>
                    {selectedEnglish && !selectedMongolian && 'Now select a Mongolian word'}
                    {selectedMongolian && !selectedEnglish && 'Now select an English word'}
                    {!selectedEnglish && !selectedMongolian && 'Select one word from each column to match'}
                </Text>
                <View style={styles.matchContainer}>
                    <View style={styles.matchColumn}>
                        <Text style={styles.matchColumnTitle}>English</Text>
                        {englishWords.map((word, index) => (
                            <TouchableOpacity
                                key={index}
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
                        {mongolianWords.map((word, index) => (
                            <TouchableOpacity
                                key={index}
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

    const renderChatBot = () => {
        return (
            <View style={styles.taskContainer}>
                <Text style={styles.question}>Chat with the bot:</Text>
                <View style={styles.chatContainer}>
                    {chatMessages.map((msg, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.chatMessage,
                                msg.isUser ? styles.chatMessageUser : styles.chatMessageBot,
                            ]}
                        >
                            <Text style={[
                                styles.chatText,
                                msg.isUser ? styles.chatTextUser : styles.chatTextBot,
                            ]}>
                                {msg.text}
                            </Text>
                        </View>
                    ))}
                </View>
                <View style={styles.chatInputContainer}>
                    <TextInput
                        style={styles.chatInput}
                        placeholder="Type your message..."
                        value={chatMessage}
                        onChangeText={setChatMessage}
                        onSubmitEditing={handleChatSend}
                    />
                    <TouchableOpacity
                        style={styles.chatSendButton}
                        onPress={handleChatSend}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (showCompletion) {
        return (
            <View style={styles.completionOverlay}>
                <View style={styles.completionContent}>
                    <Ionicons name="checkmark-circle" size={80} color="#58CC02" />
                    <Text style={styles.completionTitle}>{completionMessage}</Text>
                    <Text style={styles.completionSubtitle}>Keep up the amazing work!</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>
                        {taskType === 'sentence-builder' ? 'Sentence Builder' :
                            taskType === 'vocabulary-match' ? 'Vocabulary Match' :
                                'Chat with Bot'}
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                {taskType === 'sentence-builder' && renderSentenceBuilder()}
                {taskType === 'vocabulary-match' && renderVocabMatch()}
                {taskType === 'chat-bot' && renderChatBot()}
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
        textTransform: 'capitalize',
    },
    content: {
        flex: 1,
    },
    taskContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
    },
    taskHeader: {
        marginBottom: 20,
    },
    taskProgress: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600',
    },
    question: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 24,
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
    wordBank: {
        marginBottom: 20,
    },
    wordBankLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    wordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
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
    matchContainer: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 20,
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
    matchHint: {
        fontSize: 14,
        color: '#1CB0F6',
        marginBottom: 16,
        fontStyle: 'italic',
    },
    matchItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
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
    chatContainer: {
        minHeight: 200,
        maxHeight: 300,
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
    },
    chatMessage: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        maxWidth: '80%',
    },
    chatMessageUser: {
        alignSelf: 'flex-end',
        backgroundColor: '#58CC02',
    },
    chatMessageBot: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5E5',
    },
    chatText: {
        fontSize: 16,
    },
    chatTextUser: {
        color: '#fff',
    },
    chatTextBot: {
        color: '#333',
    },
    chatInputContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    chatInput: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#E5E5E5',
    },
    chatSendButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#58CC02',
        justifyContent: 'center',
        alignItems: 'center',
    },
    completionOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    completionContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    completionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        textAlign: 'center',
    },
    completionSubtitle: {
        fontSize: 16,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
});

