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
                    <Ionicons name="flame" size={18} color="#C8ACD6" />
                    <Text style={styles.statValue}>{userProgress.streak}</Text>
                    <Text style={styles.statLabel}>Streak</Text>
                </View>

                {/* Memorized words display */}
                <View style={styles.statItem}>
                    <Ionicons name="book" size={18} color="#C8ACD6" />
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
        backgroundColor: '#2E236C',
        paddingTop: 60,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#433D8B',
        minHeight: 110,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#C8ACD6',
        marginRight: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#C8ACD6',
        fontWeight: '500',
        opacity: 0.7,
    },
});
