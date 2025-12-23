import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';

// Sample learned words (in a real app, this would come from completed lessons)
const learnedWords = [
    { english: 'Hello', mongolian: 'Сайн уу', category: 'Greetings' },
    { english: 'Thank you', mongolian: 'Баярлалаа', category: 'Greetings' },
    { english: 'Please', mongolian: 'Та бүхэнд', category: 'Greetings' },
    { english: 'Water', mongolian: 'Ус', category: 'Daily Life' },
    { english: 'Food', mongolian: 'Хоол', category: 'Daily Life' },
    { english: 'Book', mongolian: 'Ном', category: 'Daily Life' },
    { english: 'Airport', mongolian: 'Нисэх буудал', category: 'Travel' },
    { english: 'Ticket', mongolian: 'Тасалбар', category: 'Travel' },
];

const games = [
    {
        id: 1,
        title: 'Word Match',
        iconName: 'swap-horizontal',
        description: 'Match English words with their Mongolian translations',
        color: '#58CC02',
    },
    {
        id: 2,
        title: 'Flashcards',
        iconName: 'albums',
        description: 'Test your memory with flashcard quizzes',
        color: '#1CB0F6',
    },
    {
        id: 3,
        title: 'Word Scramble',
        iconName: 'text',
        description: 'Unscramble letters to form English words',
        color: '#FF9600',
    },
    {
        id: 4,
        title: 'Speed Challenge',
        iconName: 'flash',
        description: 'Race against time to translate words',
        color: '#E63946',
    },
];

export default function GamesScreen() {
    const router = useRouter();
    const { userProgress } = useApp();
    const [selectedGame, setSelectedGame] = useState<number | null>(null);

    const availableWords = learnedWords.filter((word, index) =>
        index < Math.min(learnedWords.length, userProgress.completedLessons.length + 3)
    );

    const handleGamePress = (gameId: number) => {
        router.push(`/game/${gameId}` as any);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingTop: 110, paddingBottom: 20 }}
            bounces={false}
            showsVerticalScrollIndicator={false}
            decelerationRate="normal"
            scrollEventThrottle={16}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Games</Text>
                <Text style={styles.subtitle}>Practice with words you've learned</Text>
                <View style={styles.wordsCount}>
                    <Ionicons name="book" size={20} color="#58CC02" />
                    <Text style={styles.wordsCountText}>
                        {availableWords.length} words available
                    </Text>
                </View>
            </View>

            <View style={styles.gamesSection}>
                <Text style={styles.sectionTitle}>Choose a Game</Text>
                {games.map((game) => (
                    <TouchableOpacity
                        key={game.id}
                        style={[styles.gameCard, { borderLeftColor: game.color }]}
                        onPress={() => handleGamePress(game.id)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.gameIconContainer, { backgroundColor: `${game.color}20` }]}>
                            <Ionicons name={game.iconName as any} size={32} color={game.color} />
                        </View>
                        <View style={styles.gameInfo}>
                            <Text style={styles.gameTitle}>{game.title}</Text>
                            <Text style={styles.gameDescription}>{game.description}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={game.color} />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.wordsSection}>
                <Text style={styles.sectionTitle}>Your Learned Words</Text>
                <View style={styles.wordsGrid}>
                    {availableWords.map((word, index) => (
                        <View key={index} style={styles.wordCard}>
                            <View style={styles.wordCardHeader}>
                                <Text style={styles.wordEnglish}>{word.english}</Text>
                                <View style={styles.wordCategory}>
                                    <Text style={styles.wordCategoryText}>{word.category}</Text>
                                </View>
                            </View>
                            <Text style={styles.wordMongolian}>{word.mongolian}</Text>
                        </View>
                    ))}
                </View>
                {availableWords.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="book-outline" size={64} color="#CCCCCC" />
                        <Text style={styles.emptyText}>Complete lessons to unlock words for games!</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        marginTop: 0,
        paddingTop: 0, // Removed since we have fixed header above
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: '#58CC02',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 16,
    },
    wordsCount: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
        gap: 8,
    },
    wordsCountText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    gamesSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    gameCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    gameIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    gameIcon: {
        fontSize: 32,
    },
    gameInfo: {
        flex: 1,
    },
    gameTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    gameDescription: {
        fontSize: 14,
        color: '#999',
    },
    wordsSection: {
        padding: 20,
        paddingTop: 0,
    },
    wordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    wordCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    wordCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    wordEnglish: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    wordCategory: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    wordCategoryText: {
        fontSize: 10,
        color: '#58CC02',
        fontWeight: '600',
    },
    wordMongolian: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 16,
    },
});
