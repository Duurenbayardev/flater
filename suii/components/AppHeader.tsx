import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../contexts/AppContext';

/**
 * Fixed header component for tab pages
 * Shows streak count and number of memorized words
 * Should be added to tab layout, not individual pages
 */
export default function AppHeader() {
    const { userProgress } = useApp();

    // Count unique memorized words (with safety check for undefined)
    const memorizedWordsCount = userProgress.memorizedWords?.length || 0;

    return (
        <View style={styles.header}>
            <View style={styles.statsContainer}>
                {/* Streak display */}
                <View style={styles.statItem}>
                    <Ionicons name="flame" size={22} color="#fff" />
                    <Text style={styles.statValue}>{userProgress.streak}</Text>
                    <Text style={styles.statLabel}>Streak</Text>
                </View>

                {/* Memorized words display */}
                <View style={styles.statItem}>
                    <Ionicons name="book" size={22} color="#fff" />
                    <Text style={styles.statValue}>{memorizedWordsCount}</Text>
                    <Text style={styles.statLabel}>Words</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#58CC02', // Theme color
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 0, // Remove border since we're using theme color
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minHeight: 110, // Total header height for padding calculations
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginRight: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
        opacity: 0.9,
    },
});
