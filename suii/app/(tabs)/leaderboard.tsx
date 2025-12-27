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
        title: 'Mogoi',
        iconName: 'game-controller',
        description: 'By Hatna',
        color: '#6B5FBB',
    },
    {
        id: 2,
        title: 'Flashcards',
        iconName: 'albums',
        description: 'Memory test',
        color: '#4A7FA3',
    },
    {
        id: 3,
        title: 'Glass Bridge',
        iconName: 'walk',
        description: 'Choose wisely',
        color: '#7C6FD3',
    },
    {
        id: 4,
        title: 'Word Scramble',
        iconName: 'shuffle',
        description: 'Unscramble words',
        color: '#5A8F7B',
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
            contentContainerStyle={{ paddingTop: 110, paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>Games</Text>
                <Text style={styles.subtitle}>Practice with words you've learned</Text>
                <View style={styles.wordsCount}>
                    <Ionicons name="book" size={18} color="#C8ACD6" />
                    <Text style={styles.wordsCountText}>
                        {availableWords.length} words available
                    </Text>
                </View>
            </View>

            {/* Games Grid Section */}
            <View style={styles.gamesSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Choose a Game</Text>
                </View>
                <View style={styles.gamesGrid}>
                    {games.map((game) => (
                        <TouchableOpacity
                            key={game.id}
                            style={[styles.gameCard, { backgroundColor: game.color }]}
                            onPress={() => handleGamePress(game.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.gameIconContainer}>
                                <Ionicons name={game.iconName as any} size={32} color="#FFFFFF" />
                            </View>
                            <Text style={styles.gameTitle}>{game.title}</Text>
                            <Text style={styles.gameDescription}>{game.description}</Text>
                            <View style={styles.playButton}>
                                <Ionicons name="play" size={16} color={game.color} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Learned Words Section */}
            <View style={styles.wordsSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Your Learned Words</Text>
                </View>
                {availableWords.length > 0 ? (
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
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="book-outline" size={48} color="#433D8B" />
                        </View>
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
        backgroundColor: '#17153B',
    },
    // Header Section
    header: {
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 24,
        backgroundColor: '#2E236C',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
        marginBottom: 16,
    },
    wordsCount: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#433D8B',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        alignSelf: 'flex-start',
        gap: 8,
    },
    wordsCountText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    // Games Section
    gamesSection: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    gamesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gameCard: {
        width: '48%',
        borderRadius: 20,
        padding: 20,
        minHeight: 160,
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
    },
    gameIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    gameDescription: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.9,
        fontWeight: '500',
    },
    playButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Words Section
    wordsSection: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    wordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    wordCard: {
        width: '48%',
        backgroundColor: '#2E236C',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#433D8B',
    },
    wordCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    wordEnglish: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        flex: 1,
    },
    wordCategory: {
        backgroundColor: '#433D8B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    wordCategoryText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    wordMongolian: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
        fontStyle: 'italic',
    },
    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#2E236C',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#433D8B',
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#433D8B',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.7,
        textAlign: 'center',
        paddingHorizontal: 20,
        fontWeight: '500',
    },
});
