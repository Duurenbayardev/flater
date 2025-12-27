import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSpring } from 'react-native-reanimated';
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
        {
            id: 1,
            title: 'First Steps',
            description: 'Complete your first lesson',
            earned: userProgress.completedLessons.length > 0,
            icon: 'footsteps',
            color: '#FF6B9D'
        },
        {
            id: 2,
            title: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            earned: userProgress.streak >= 7,
            icon: 'flame',
            color: '#FFE66D'
        },
        {
            id: 3,
            title: 'Century Club',
            description: 'Earn 100 XP',
            earned: userProgress.xp >= 100,
            icon: 'star',
            color: '#4ECDC4'
        },
        {
            id: 4,
            title: 'Dedicated Learner',
            description: 'Complete 10 lessons',
            earned: userProgress.completedLessons.length >= 10,
            icon: 'trophy',
            color: '#AA96DA'
        },
    ];

    const earnedAchievements = achievements.filter(a => a.earned).length;
    const totalAchievements = achievements.length;
    const achievementProgress = (earnedAchievements / totalAchievements) * 100;

    // Animated flame for streak
    const flameScale = useSharedValue(1);
    React.useEffect(() => {
        if (userProgress.streak > 0) {
            flameScale.value = withRepeat(
                withSpring(1.1, { damping: 3, stiffness: 100 }),
                -1,
                true
            );
        }
    }, [userProgress.streak]);

    const flameAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: flameScale.value }],
    }));

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingTop: 110, paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Hero Profile Section */}
            <View style={styles.heroSection}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarRing}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={40} color="#FFFFFF" />
                        </View>
                    </View>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>Lv.{userProgress.level}</Text>
                    </View>
                </View>
                <Text style={styles.userName}>Language Learner</Text>
                <Text style={styles.userSubtitle}>Keep up the great work! 🎯</Text>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsSection}>
                <View style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 107, 157, 0.2)' }]}>
                        <Animated.View style={flameAnimatedStyle}>
                            <Ionicons name="flame" size={24} color="#FF6B9D" />
                        </Animated.View>
                    </View>
                    <Text style={styles.statValue}>{userProgress.streak}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: 'rgba(78, 205, 196, 0.2)' }]}>
                        <Ionicons name="star" size={24} color="#4ECDC4" />
                    </View>
                    <Text style={styles.statValue}>{userProgress.xp}</Text>
                    <Text style={styles.statLabel}>Total XP</Text>
                </View>
                <View style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: 'rgba(170, 150, 218, 0.2)' }]}>
                        <Ionicons name="book" size={24} color="#AA96DA" />
                    </View>
                    <Text style={styles.statValue}>{userProgress.completedLessons.length}</Text>
                    <Text style={styles.statLabel}>Lessons</Text>
                </View>
            </View>

            {/* Learning Progress */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Learning Progress</Text>
                </View>
                <View style={styles.progressCard}>
                    <View style={styles.progressItem}>
                        <View style={styles.progressItemLeft}>
                            <Ionicons name="bookmark" size={20} color="#C8ACD6" />
                            <Text style={styles.progressItemLabel}>Current Section</Text>
                        </View>
                        <Text style={styles.progressItemValue}>Section {userProgress.currentSection}</Text>
                    </View>
                    <View style={styles.progressDivider} />
                    <View style={styles.progressItem}>
                        <View style={styles.progressItemLeft}>
                            <Ionicons name="layers" size={20} color="#C8ACD6" />
                            <Text style={styles.progressItemLabel}>Current Unit</Text>
                        </View>
                        <Text style={styles.progressItemValue}>Unit {userProgress.currentUnit}</Text>
                    </View>
                </View>
            </View>

            {/* Achievements Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <Text style={styles.sectionSubtitle}>{earnedAchievements}/{totalAchievements}</Text>
                </View>
                <View style={styles.achievementProgressCard}>
                    <View style={styles.achievementProgressBar}>
                        <View style={[styles.achievementProgressFill, { width: `${achievementProgress}%` }]} />
                    </View>
                    <Text style={styles.achievementProgressText}>{Math.round(achievementProgress)}% Complete</Text>
                </View>
                <View style={styles.achievementsGrid}>
                    {achievements.map((achievement) => (
                        <TouchableOpacity
                            key={achievement.id}
                            style={[
                                styles.achievementCard,
                                achievement.earned && styles.achievementCardEarned,
                            ]}
                            activeOpacity={0.8}
                        >
                            <View style={[
                                styles.achievementIconContainer,
                                achievement.earned && { backgroundColor: `${achievement.color}20` }
                            ]}>
                                <Ionicons
                                    name={achievement.earned ? achievement.icon as any : 'lock-closed'}
                                    size={32}
                                    color={achievement.earned ? achievement.color : '#433D8B'}
                                />
                            </View>
                            <Text style={[
                                styles.achievementTitle,
                                !achievement.earned && styles.achievementTitleLocked,
                            ]}>
                                {achievement.title}
                            </Text>
                            <Text style={styles.achievementDescription}>
                                {achievement.description}
                            </Text>
                            {achievement.earned && (
                                <View style={styles.achievementBadge}>
                                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Settings Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                </View>
                <View style={styles.settingsCard}>
                    <TouchableOpacity style={styles.settingsItem} activeOpacity={0.7}>
                        <View style={styles.settingsItemLeft}>
                            <View style={[styles.settingsIconContainer, { backgroundColor: 'rgba(200, 172, 214, 0.2)' }]}>
                                <Ionicons name="settings" size={22} color="#C8ACD6" />
                            </View>
                            <Text style={styles.settingsItemText}>Settings</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#433D8B" />
                    </TouchableOpacity>
                    <View style={styles.settingsDivider} />
                    <TouchableOpacity style={styles.settingsItem} activeOpacity={0.7}>
                        <View style={styles.settingsItemLeft}>
                            <View style={[styles.settingsIconContainer, { backgroundColor: 'rgba(200, 172, 214, 0.2)' }]}>
                                <Ionicons name="help-circle" size={22} color="#C8ACD6" />
                            </View>
                            <Text style={styles.settingsItemText}>Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#433D8B" />
                    </TouchableOpacity>
                    <View style={styles.settingsDivider} />
                    <TouchableOpacity
                        style={styles.settingsItem}
                        onPress={handleLogout}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingsItemLeft}>
                            <View style={[styles.settingsIconContainer, { backgroundColor: 'rgba(255, 107, 157, 0.2)' }]}>
                                <Ionicons name="log-out" size={22} color="#FF6B9D" />
                            </View>
                            <Text style={[styles.settingsItemText, styles.logoutText]}>Logout</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#433D8B" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#17153B',
    },
    // Hero Section
    heroSection: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 30,
        backgroundColor: '#2E236C',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarRing: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(200, 172, 214, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#C8ACD6',
    },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: '#433D8B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#C8ACD6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#17153B',
    },
    levelBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#17153B',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    userSubtitle: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
    },
    // Stats Section
    statsSection: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 20,
        gap: 12,
        marginTop: 0,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#2E236C',
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#433D8B',
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#FFFFFF',
        opacity: 0.7,
        fontWeight: '500',
    },
    // Sections
    section: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.7,
        fontWeight: '600',
    },
    // Progress Card
    progressCard: {
        backgroundColor: '#2E236C',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: '#433D8B',
    },
    progressItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    progressItemLabel: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    progressItemValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#C8ACD6',
    },
    progressDivider: {
        height: 1,
        backgroundColor: '#433D8B',
        marginVertical: 14,
    },
    // Achievements
    achievementProgressCard: {
        backgroundColor: '#2E236C',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#433D8B',
    },
    achievementProgressBar: {
        height: 8,
        backgroundColor: '#433D8B',
        borderRadius: 4,
        marginBottom: 10,
        overflow: 'hidden',
    },
    achievementProgressFill: {
        height: '100%',
        backgroundColor: '#C8ACD6',
        borderRadius: 4,
    },
    achievementProgressText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    achievementCard: {
        width: '48%',
        backgroundColor: '#2E236C',
        borderRadius: 18,
        padding: 18,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#433D8B',
        position: 'relative',
    },
    achievementCardEarned: {
        borderColor: '#C8ACD6',
        borderWidth: 2,
    },
    achievementIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: '#433D8B',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    achievementTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 6,
        textAlign: 'center',
    },
    achievementTitleLocked: {
        opacity: 0.5,
    },
    achievementDescription: {
        fontSize: 11,
        color: '#FFFFFF',
        opacity: 0.7,
        textAlign: 'center',
        lineHeight: 14,
    },
    achievementBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#C8ACD6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Settings
    settingsCard: {
        backgroundColor: '#2E236C',
        borderRadius: 18,
        padding: 8,
        borderWidth: 1,
        borderColor: '#433D8B',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingsItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    settingsIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsItemText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    logoutText: {
        color: '#FF6B9D',
        fontWeight: '600',
    },
    settingsDivider: {
        height: 1,
        backgroundColor: '#433D8B',
        marginHorizontal: 16,
    },
});

