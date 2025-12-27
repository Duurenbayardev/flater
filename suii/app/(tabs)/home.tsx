import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { useApp } from '../../contexts/AppContext';

const screenWidth = Dimensions.get('window').width;

const sections = [
    { id: 1, title: 'Greetings', iconName: 'hand-left' },
    { id: 2, title: 'At the Airport', iconName: 'airplane' },
    { id: 3, title: 'Restaurant', iconName: 'restaurant' },
    { id: 4, title: 'Shopping', iconName: 'bag' },
    { id: 5, title: 'Daily Life', iconName: 'home' },
];

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function HomeScreen() {
    const router = useRouter();
    const { userProgress } = useApp();

    // Generate sample progress data for the last 7 days
    const progressData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43, 50],
                color: (opacity = 1) => `rgba(200, 172, 214, ${opacity})`,
                strokeWidth: 3,
            },
        ],
    };

    const chartConfig = {
        backgroundColor: '#433D8B',
        backgroundGradientFrom: '#433D8B',
        backgroundGradientTo: '#433D8B',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(200, 172, 214, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(200, 172, 214, ${opacity * 0.8})`,
        style: {
            borderRadius: 14,
        },
        propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#C8ACD6',
        },
    };

    const getCurrentSection = () => {
        return sections.find(s => s.id === userProgress.currentSection) || sections[0];
    };

    const getSectionProgress = () => {
        const section = sections.find(s => s.id === userProgress.currentSection);
        if (!section) return { completed: 0, total: 6 };

        const completed = Math.min(6, Math.floor(userProgress.completedLessons.length / 2));
        return { completed, total: 6 };
    };

    const currentSection = getCurrentSection();
    const sectionProgress = getSectionProgress();
    const progressPercentage = (sectionProgress.completed / sectionProgress.total) * 100;

    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = useSharedValue(circumference);

    React.useEffect(() => {
        const offset = circumference - (progressPercentage / 100) * circumference;
        strokeDashoffset.value = withTiming(offset, { duration: 1000 });
    }, [progressPercentage]);

    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: strokeDashoffset.value,
        };
    });

    const recentLessons = [
        { id: '1-1', title: 'Basic Greetings', section: 1, unit: 1 },
        { id: '1-2', title: 'Formal Greetings', section: 1, unit: 2 },
        { id: '1-3', title: 'Check-in', section: 2, unit: 1 },
    ];

    // Animated flame for streak
    const flameScale = useSharedValue(1);
    React.useEffect(() => {
        flameScale.value = withRepeat(
            withSpring(1.15, { damping: 3, stiffness: 100 }),
            -1,
            true
        );
    }, []);

    const flameAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: flameScale.value }],
    }));

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingTop: 110, paddingBottom: 30 }}
            bounces={true}
            showsVerticalScrollIndicator={false}
        >
            {/* Hero Header with Gradient Background */}
            <View style={styles.heroHeader}>
                <View style={styles.heroTop}>
                    <View style={styles.heroTextContainer}>
                        <Text style={styles.heroGreeting}>Hellooooo</Text>
                        <Text style={styles.heroSubtext}>Даалгавраа хийснү чи.</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.streakBadge}
                        activeOpacity={0.8}
                    >
                        <Animated.View style={flameAnimatedStyle}>
                            <Ionicons name="flame" size={20} color="#C8ACD6" />
                        </Animated.View>
                        <View style={styles.streakTextContainer}>
                            <Text style={styles.streakNumber}>{userProgress.streak}</Text>
                            <Text style={styles.streakLabel}>Streak</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Ionicons name="star" size={20} color="#C8ACD6" />
                        <Text style={styles.statCardValue}>{userProgress.xp}</Text>
                        <Text style={styles.statCardLabel}>XP</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="book" size={20} color="#C8ACD6" />
                        <Text style={styles.statCardValue}>{userProgress.completedLessons.length}</Text>
                        <Text style={styles.statCardLabel}>Lessons</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="trophy" size={20} color="#C8ACD6" />
                        <Text style={styles.statCardValue}>Lv.{userProgress.level}</Text>
                        <Text style={styles.statCardLabel}>Level</Text>
                    </View>
                </View>
            </View>

            {/* Continue Learning Card - Featured */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Continue Learning</Text>
                    {/* <Text style={styles.sectionSubtitle}>Keep your momentum going! 🚀</Text> */}
                </View>
                <TouchableOpacity
                    style={styles.featuredCard}
                    onPress={() => router.push(`/lesson/${userProgress.currentSection}-${userProgress.currentUnit}` as any)}
                    activeOpacity={0.9}
                >
                    <Svg width="100%" height="100%" style={styles.cardGradient}>
                        <Defs>
                            <SvgLinearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor="#58CC02" stopOpacity="0.1" />
                                <Stop offset="100%" stopColor="#4CAF50" stopOpacity="0.05" />
                            </SvgLinearGradient>
                        </Defs>
                        <Circle cx="50%" cy="0%" r="200" fill="url(#cardGradient)" />
                    </Svg>
                    <View style={styles.featuredContent}>
                        <View style={styles.featuredLeft}>
                            <View style={styles.featuredIconContainer}>
                                <Ionicons name={currentSection.iconName as any} size={28} color="#C8ACD6" />
                            </View>
                            <View style={styles.featuredText}>
                                <Text style={styles.featuredTitle}>{currentSection.title}</Text>
                                <Text style={styles.featuredSubtitle}>
                                    {sectionProgress.completed}/{sectionProgress.total} units
                                </Text>
                            </View>
                        </View>
                        <View style={styles.featuredProgress}>
                            <Svg width={70} height={70}>
                                <Circle
                                    cx={35}
                                    cy={35}
                                    r={28}
                                    stroke="rgba(255, 255, 255, 0.2)"
                                    strokeWidth={6}
                                    fill="transparent"
                                />
                                <AnimatedCircle
                                    cx={35}
                                    cy={35}
                                    r={28}
                                    stroke="#C8ACD6"
                                    strokeWidth={6}
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    animatedProps={animatedProps}
                                    strokeLinecap="round"
                                    transform="rotate(-90 35 35)"
                                />
                            </Svg>
                            <View style={styles.featuredProgressText}>
                                <Text style={styles.featuredProgressPercent}>{Math.round(progressPercentage)}%</Text>
                            </View>
                            <View style={styles.playButton}>
                                <Ionicons name="play" size={18} color="#433D8B" />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Progress Chart - Redesigned */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Weekly Progress</Text>
                    {/* <Text style={styles.sectionSubtitle}>Your learning journey 📈</Text> */}
                </View>
                <View style={styles.chartCard}>
                    <LineChart
                        data={progressData}
                        width={screenWidth - 40}
                        height={200}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                        withInnerLines={false}
                        withVerticalLabels={true}
                        withHorizontalLabels={true}
                        withDots={true}
                        withShadow={false}
                    />
                </View>
            </View>

            {/* Quick Access Lessons */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Access</Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/lessons' as any)}>
                        <Text style={styles.seeAllText}>See All →</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.lessonsScroll}
                >
                    {recentLessons.map((lesson, index) => (
                        <TouchableOpacity
                            key={lesson.id}
                            style={[styles.lessonCard, index === 0 && styles.lessonCardFirst]}
                            onPress={() => router.push(`/lesson/${lesson.id}` as any)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.lessonCardHeader}>
                                <View style={[
                                    styles.lessonCardIcon,
                                    userProgress.completedLessons.includes(lesson.id) && styles.lessonCardIconCompleted
                                ]}>
                                    <Ionicons
                                        name={userProgress.completedLessons.includes(lesson.id) ? 'checkmark-circle' : 'play-circle'}
                                        size={26}
                                        color="#C8ACD6"
                                    />
                                </View>
                                {userProgress.completedLessons.includes(lesson.id) && (
                                    <View style={styles.completedBadge}>
                                        <Ionicons name="checkmark" size={12} color="#fff" />
                                    </View>
                                )}
                            </View>
                            <Text style={styles.lessonCardTitle}>{lesson.title}</Text>
                            <Text style={styles.lessonCardSubtitle}>
                                Section {lesson.section} • Unit {lesson.unit}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Achievements Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                </View>
                <View style={styles.activityCard}>
                    {userProgress.completedLessons.length > 0 ? (
                        <>
                            {userProgress.completedLessons.slice(-3).reverse().map((lessonId, index) => (
                                <View key={index} style={styles.activityItem}>
                                    <View style={styles.activityIcon}>
                                        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                                    </View>
                                    <View style={styles.activityContent}>
                                        <Text style={styles.activityTitle}>Lesson Completed</Text>
                                        <Text style={styles.activitySubtitle}>{lessonId}</Text>
                                    </View>
                                    <Text style={styles.activityTime}>Today</Text>
                                </View>
                            ))}
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="rocket-outline" size={40} color="#C8ACD6" />
                            <Text style={styles.emptyStateText}>Start your learning journey!</Text>
                            <Text style={styles.emptyStateSubtext}>Complete your first lesson to see activity here</Text>
                        </View>
                    )}
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
    // Hero Header
    heroHeader: {
        backgroundColor: '#2E236C',
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    heroTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    heroTextContainer: {
        flex: 1,
    },
    heroGreeting: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    heroSubtext: {
        fontSize: 13,
        color: '#FFFFFF',
        opacity: 0.8,
        fontWeight: '400',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#433D8B',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        gap: 8,
    },
    streakTextContainer: {
        alignItems: 'flex-start',
    },
    streakNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    streakLabel: {
        fontSize: 10,
        color: '#FFFFFF',
        opacity: 0.8,
        fontWeight: '600',
    },
    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#433D8B',
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        gap: 8,
    },
    statCardValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    statCardLabel: {
        fontSize: 10,
        color: '#FFFFFF',
        opacity: 0.8,
        fontWeight: '600',
    },
    // Sections
    section: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#C8ACD6',
        opacity: 0.6,
        fontWeight: '400',
        marginTop: 2,
    },
    seeAllText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    // Featured Card
    featuredCard: {
        backgroundColor: '#433D8B',
        borderRadius: 18,
        padding: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#5A4FA3',
    },
    cardGradient: {
        position: 'absolute',
        top: -100,
        right: -100,
    },
    featuredContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    featuredIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    featuredText: {
        flex: 1,
    },
    featuredTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    featuredSubtitle: {
        fontSize: 13,
        color: '#FFFFFF',
        opacity: 0.8,
        fontWeight: '500',
    },
    featuredProgress: {
        position: 'relative',
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredProgressText: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredProgressPercent: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    playButton: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#C8ACD6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Chart Card
    chartCard: {
        backgroundColor: '#433D8B',
        borderRadius: 18,
        padding: 0,
        borderWidth: 1,
        borderColor: '#5A4FA3',
    },
    chart: {
        borderRadius: 14,
        marginVertical: 0,
    },
    // Lessons Scroll
    lessonsScroll: {
        paddingRight: 16,
        gap: 8,
    },
    lessonCard: {
        width: 150,
        backgroundColor: '#433D8B',
        borderRadius: 16,
        padding: 14,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#5A4FA3',
    },
    lessonCardFirst: {
        borderColor: '#C8ACD6',
        backgroundColor: '#5A4FA3',
    },
    lessonCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    lessonCardIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lessonCardIconCompleted: {
        backgroundColor: 'rgba(200, 172, 214, 0.3)',
    },
    completedBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#C8ACD6',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -6,
        marginRight: -6,
    },
    lessonCardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    lessonCardSubtitle: {
        fontSize: 11,
        color: '#FFFFFF',
        opacity: 0.7,
        fontWeight: '500',
    },
    // Activity Card
    activityCard: {
        backgroundColor: '#433D8B',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: '#5A4FA3',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#5A4FA3',
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 3,
    },
    activitySubtitle: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.7,
        fontWeight: '400',
    },
    activityTime: {
        fontSize: 11,
        color: '#FFFFFF',
        opacity: 0.6,
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyStateText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 12,
        marginBottom: 6,
    },
    emptyStateSubtext: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.7,
        textAlign: 'center',
    },
});
