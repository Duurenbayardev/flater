import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useApp } from '../../contexts/AppContext';

// Word pairs for the memory game
const wordPairs = [
    { english: 'Hello', mongolian: 'Сайн уу' },
    { english: 'Thanks', mongolian: 'Баярлалаа' },
    { english: 'Water', mongolian: 'Ус' },
    { english: 'Food', mongolian: 'Хоол' },
    { english: 'Book', mongolian: 'Ном' },
    { english: 'Teacher', mongolian: 'Багш' },
    { english: 'Class', mongolian: 'Анги' },
    { english: 'Christmas', mongolian: 'Зул сар' },
];

type Card = {
    id: number;
    word: string;
    language: 'english' | 'mongolian';
    pairId: number;
    isFlipped: boolean;
    isMatched: boolean;
};

export default function MemoryCardGame() {
    const router = useRouter();
    const { updateProgress } = useApp();
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number>(0);
    const [moves, setMoves] = useState(0);
    const [gameWon, setGameWon] = useState(false);

    // Initialize game
    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const newCards: Card[] = [];
        let id = 0;

        // Create cards for each word pair
        wordPairs.forEach((pair, pairIndex) => {
            // English card
            newCards.push({
                id: id++,
                word: pair.english,
                language: 'english',
                pairId: pairIndex,
                isFlipped: false,
                isMatched: false,
            });
            // Mongolian card
            newCards.push({
                id: id++,
                word: pair.mongolian,
                language: 'mongolian',
                pairId: pairIndex,
                isFlipped: false,
                isMatched: false,
            });
        });

        // Shuffle cards
        for (let i = newCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
        }

        setCards(newCards);
        setFlippedCards([]);
        setMatchedPairs(0);
        setMoves(0);
        setGameWon(false);
    };

    const handleCardPress = (cardId: number) => {
        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
            return;
        }

        // Flip the card
        setCards(prevCards =>
            prevCards.map(c => (c.id === cardId ? { ...c, isFlipped: true } : c))
        );

        const newFlippedCards = [...flippedCards, cardId];
        setFlippedCards(newFlippedCards);

        // If two cards are flipped, check for match
        if (newFlippedCards.length === 2) {
            setMoves(prev => prev + 1);
            checkMatch(newFlippedCards);
        }
    };

    const checkMatch = (flippedIds: number[]) => {
        setTimeout(() => {
            setCards(prevCards => {
                const [card1, card2] = flippedIds.map(id => prevCards.find(c => c.id === id)!);

                // Check if they're a matching pair
                if (card1 && card2 && card1.pairId === card2.pairId && card1.language !== card2.language) {
                    // Match found!
                    const updatedCards = prevCards.map(c =>
                        flippedIds.includes(c.id) ? { ...c, isMatched: true, isFlipped: true } : c
                    );

                    setMatchedPairs(prev => {
                        const newCount = prev + 1;
                        if (newCount === wordPairs.length) {
                            setGameWon(true);
                            updateProgress({ xp: 100 });
                        }
                        return newCount;
                    });
                    setFlippedCards([]);
                    return updatedCards;
                } else {
                    // No match, flip back after 1 second
                    setFlippedCards([]);
                    return prevCards.map(c =>
                        flippedIds.includes(c.id) ? { ...c, isFlipped: false } : c
                    );
                }
            });
        }, 1000);
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
                        <Text style={styles.statLabel}>Moves</Text>
                        <Text style={styles.statValue}>{moves}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Pairs</Text>
                        <Text style={styles.statValue}>{matchedPairs}/{wordPairs.length}</Text>
                    </View>
                </View>
            </View>

            {/* Game Board */}
            <View style={styles.board}>
                {cards.map(card => (
                    <CardComponent
                        key={card.id}
                        card={card}
                        onPress={() => handleCardPress(card.id)}
                    />
                ))}
            </View>

            {/* Win Screen */}
            {gameWon && (
                <View style={styles.overlay}>
                    <View style={styles.winBox}>
                        <Ionicons name="trophy" size={64} color="#58CC02" />
                        <Text style={styles.winText}>Congratulations!</Text>
                        <Text style={styles.winSubtext}>You matched all pairs!</Text>
                        <Text style={styles.winMoves}>Moves: {moves}</Text>
                        <View style={styles.winButtons}>
                            <TouchableOpacity style={styles.playAgainButton} onPress={initializeGame}>
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

function CardComponent({ card, onPress }: { card: Card; onPress: () => void }) {
    const frontOpacity = useSharedValue(1);
    const backOpacity = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        // Don't animate if card is already matched
        if (card.isMatched) {
            frontOpacity.value = 0;
            backOpacity.value = 1;
            scale.value = 1;
            return;
        }

        if (card.isFlipped) {
            frontOpacity.value = withTiming(0, { duration: 200 });
            backOpacity.value = withTiming(1, { duration: 200 });
            scale.value = withSpring(1.05, { damping: 8, stiffness: 150 });
        } else {
            frontOpacity.value = withTiming(1, { duration: 200 });
            backOpacity.value = withTiming(0, { duration: 200 });
            scale.value = withSpring(1, { damping: 8, stiffness: 150 });
        }
    }, [card.isFlipped, card.isMatched]);

    const frontStyle = useAnimatedStyle(() => {
        return {
            opacity: frontOpacity.value,
            transform: [{ scale: scale.value }],
        };
    });

    const backStyle = useAnimatedStyle(() => {
        return {
            opacity: backOpacity.value,
            transform: [{ scale: scale.value }],
        };
    });

    const matchedOverlayStyle = useAnimatedStyle(() => {
        return {
            opacity: card.isMatched ? 1 : 0,
        };
    });

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={onPress}
            disabled={card.isFlipped || card.isMatched}
            activeOpacity={0.8}
        >
            <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
                <Ionicons name="help-circle" size={40} color="#C8ACD6" />
            </Animated.View>
            <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
                <Text style={styles.cardText} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.7}>
                    {card.word}
                </Text>
                <Text style={styles.cardLanguage}>
                    {card.language === 'english' ? 'EN' : 'MN'}
                </Text>
            </Animated.View>
            <Animated.View style={[styles.card, styles.cardMatched, matchedOverlayStyle]} pointerEvents="none">
                <Ionicons name="checkmark-circle" size={32} color="#58CC02" />
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
        gap: 12,
    },
    statBox: {
        backgroundColor: '#433D8B',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: 'center',
        minWidth: 80,
    },
    statLabel: {
        fontSize: 10,
        color: '#FFFFFF',
        opacity: 0.8,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#C8ACD6',
        marginTop: 2,
    },
    board: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignContent: "center",
        paddingBottom: 20,
    },
    cardContainer: {
        width: '22%',
        height: 140,
        marginBottom: 12,
    },
    card: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        position: 'absolute',
        top: 0,
        left: 0,
        backfaceVisibility: 'hidden',
    },
    cardFront: {
        backgroundColor: '#2E236C',
        borderColor: '#5A4FA3',
        position: 'absolute',
    },
    cardBack: {
        backgroundColor: '#433D8B',
        borderColor: '#5A4FA3',
        position: 'absolute',
    },
    cardMatched: {
        backgroundColor: 'rgba(88, 204, 2, 0.3)',
        borderColor: '#58CC02',
        borderWidth: 3,
        zIndex: 10,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 4,
    },
    cardLanguage: {
        fontSize: 10,
        fontWeight: '600',
        color: '#C8ACD6',
        opacity: 0.8,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    winBox: {
        backgroundColor: '#433D8B',
        paddingHorizontal: 32,
        paddingVertical: 28,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#5A4FA3',
        minWidth: 280,
    },
    winText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 16,
        marginBottom: 8,
    },
    winSubtext: {
        fontSize: 16,
        fontWeight: '600',
        color: '#C8ACD6',
        marginBottom: 8,
    },
    winMoves: {
        fontSize: 18,
        fontWeight: '700',
        color: '#58CC02',
        marginBottom: 24,
    },
    winButtons: {
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

