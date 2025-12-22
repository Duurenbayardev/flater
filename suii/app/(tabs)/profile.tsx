import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';

export default function ProfileScreen() {
    const { userProgress, logout } = useApp();
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout? Your progress will be saved.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/' as any);
                    },
                },
            ]
        );
    };

    const achievements = [
        { id: 1, title: 'First Steps', description: 'Complete your first lesson', earned: userProgress.completedLessons.length > 0 },
        { id: 2, title: 'Week Warrior', description: 'Maintain a 7-day streak', earned: userProgress.streak >= 7 },
        { id: 3, title: 'Century Club', description: 'Earn 100 XP', earned: userProgress.xp >= 100 },
        { id: 4, title: 'Dedicated Learner', description: 'Complete 10 lessons', earned: userProgress.completedLessons.length >= 10 },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color="#58CC02" />
                </View>
                <Text style={styles.name}>Language Learner</Text>
                <Text style={styles.level}>Level {userProgress.level}</Text>
            </View>

            <View style={styles.statsSection}>
                <View style={styles.statCard}>
                    <Ionicons name="flame" size={32} color="#FF9600" />
                    <Text style={styles.statValue}>{userProgress.streak}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="star" size={32} color="#FFD700" />
                    <Text style={styles.statValue}>{userProgress.xp}</Text>
                    <Text style={styles.statLabel}>Total XP</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle" size={32} color="#58CC02" />
                    <Text style={styles.statValue}>{userProgress.completedLessons.length}</Text>
                    <Text style={styles.statLabel}>Lessons</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Progress</Text>
                <View style={styles.progressCard}>
                    <View style={styles.progressRow}>
                        <Text style={styles.progressLabel}>Current Section</Text>
                        <Text style={styles.progressValue}>Section {userProgress.currentSection}</Text>
                    </View>
                    <View style={styles.progressRow}>
                        <Text style={styles.progressLabel}>Current Unit</Text>
                        <Text style={styles.progressValue}>Unit {userProgress.currentUnit}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                {achievements.map((achievement) => (
                    <View
                        key={achievement.id}
                        style={[
                            styles.achievementCard,
                            !achievement.earned && styles.achievementCardLocked,
                        ]}
                    >
                        <View style={[
                            styles.achievementIcon,
                            !achievement.earned && styles.achievementIconLocked,
                        ]}>
                            <Ionicons
                                name={achievement.earned ? 'trophy' : 'lock-closed'}
                                size={24}
                                color={achievement.earned ? '#FFD700' : '#999'}
                            />
                        </View>
                        <View style={styles.achievementContent}>
                            <Text style={[
                                styles.achievementTitle,
                                !achievement.earned && styles.achievementTitleLocked,
                            ]}>
                                {achievement.title}
                            </Text>
                            <Text style={styles.achievementDescription}>
                                {achievement.description}
                            </Text>
                        </View>
                        {achievement.earned && (
                            <Ionicons name="checkmark-circle" size={24} color="#58CC02" />
                        )}
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.settingsButton}>
                    <Ionicons name="settings" size={24} color="#333" />
                    <Text style={styles.settingsText}>Settings</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsButton}>
                    <Ionicons name="help-circle" size={24} color="#333" />
                    <Text style={styles.settingsText}>Help & Support</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingsButton, styles.logoutButton]} onPress={handleLogout}>
                    <Ionicons name="log-out" size={24} color="#FF3B30" />
                    <Text style={[styles.settingsText, styles.logoutText]}>Logout</Text>
                    <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 30,
        backgroundColor: '#58CC02',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    level: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    statsSection: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        marginTop: -20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#999',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    progressCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    progressLabel: {
        fontSize: 16,
        color: '#333',
    },
    progressValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#58CC02',
    },
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    achievementCardLocked: {
        opacity: 0.6,
    },
    achievementIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF9E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    achievementIconLocked: {
        backgroundColor: '#F5F5F5',
    },
    achievementContent: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    achievementTitleLocked: {
        color: '#999',
    },
    achievementDescription: {
        fontSize: 14,
        color: '#999',
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    settingsText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 16,
    },
    logoutButton: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        marginTop: 12,
        paddingTop: 16,
    },
    logoutText: {
        color: '#FF3B30',
        fontWeight: '600',
    },
});

