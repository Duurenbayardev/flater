import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
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
                color: (opacity = 1) => `rgba(88, 204, 2, ${opacity})`,
                strokeWidth: 3,
            },
        ],
    };

    const chartConfig = {
        backgroundColor: '#fff',
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(88, 204, 2, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#58CC02',
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

    const radius = 35;
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
        { id: '1-1-1', title: 'Basic Greetings', section: 1, unit: 1 },
        { id: '1-2-1', title: 'Formal Greetings', section: 1, unit: 2 },
        { id: '2-1-1', title: 'Check-in', section: 2, unit: 1 },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>Сайн уу!</Text>
                        <Text style={styles.level}>Level {userProgress.level}</Text>
                    </View>
                    <View style={styles.streakContainer}>
                        <Ionicons name="flame" size={28} color="#FF9600" />
                        <Text style={styles.streak}>{userProgress.streak}</Text>
                    </View>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <View style={styles.statIcon}>
                            <Ionicons name="star" size={24} color="#FFD700" />
                        </View>
                        <Text style={styles.statValue}>{userProgress.xp}</Text>
                        <Text style={styles.statLabel}>XP</Text>
                    </View>
                    <View style={styles.stat}>
                        <View style={styles.statIcon}>
                            <Ionicons name="book" size={24} color="#58CC02" />
                        </View>
                        <Text style={styles.statValue}>{userProgress.completedLessons.length}</Text>
                        <Text style={styles.statLabel}>Lessons</Text>
                    </View>
                    <View style={styles.stat}>
                        <View style={styles.statIcon}>
                            <Ionicons name="flame" size={24} color="#FF9600" />
                        </View>
                        <Text style={styles.statValue}>{userProgress.streak}</Text>
                        <Text style={styles.statLabel}>Streak</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Continue Learning</Text>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => router.push(`/lesson/${userProgress.currentSection}-${userProgress.currentUnit}-1` as any)}
                    activeOpacity={0.8}
                >
                    <View style={styles.continueButtonContent}>
                        <View style={styles.continueLeft}>
                            <View style={styles.sectionBadge}>
                                <Ionicons name={currentSection.iconName as any} size={28} color="#58CC02" />
                            </View>
                            <View style={styles.continueText}>
                                <Text style={styles.continueButtonTitle}>{currentSection.title}</Text>
                                <Text style={styles.continueButtonSubtitle}>
                                    {sectionProgress.completed} of {sectionProgress.total} units completed
                                </Text>
                            </View>
                        </View>
                        <View style={styles.progressCircleContainer}>
                            <Svg width={80} height={80}>
                                <Circle
                                    cx={40}
                                    cy={40}
                                    r={radius}
                                    stroke="#E5E5E5"
                                    strokeWidth={8}
                                    fill="transparent"
                                />
                                <AnimatedCircle
                                    cx={40}
                                    cy={40}
                                    r={radius}
                                    stroke="#58CC02"
                                    strokeWidth={8}
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    animatedProps={animatedProps}
                                    strokeLinecap="round"
                                    transform="rotate(-90 40 40)"
                                />
                            </Svg>
                            <View style={styles.progressTextContainer}>
                                <Text style={styles.progressText}>{Math.round(progressPercentage)}%</Text>
                            </View>
                            <Ionicons name="play-circle" size={36} color="#58CC02" style={styles.playIcon} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Progress</Text>
                <View style={styles.chartContainer}>
                    <LineChart
                        data={progressData}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                        withInnerLines={false}
                        withVerticalLabels={true}
                        withHorizontalLabels={true}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Lessons</Text>
                {recentLessons.map((lesson) => (
                    <TouchableOpacity
                        key={lesson.id}
                        style={styles.lessonItem}
                        onPress={() => router.push(`/lesson/${lesson.id}` as any)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.lessonIcon}>
                            <Ionicons
                                name={userProgress.completedLessons.includes(lesson.id) ? 'checkmark-circle' : 'play-circle'}
                                size={28}
                                color={userProgress.completedLessons.includes(lesson.id) ? '#58CC02' : '#999'}
                            />
                        </View>
                        <View style={styles.lessonContent}>
                            <Text style={styles.lessonTitle}>{lesson.title}</Text>
                            <Text style={styles.lessonSubtitle}>
                                Section {lesson.section} • Unit {lesson.unit}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>History</Text>
                <View style={styles.historyContainer}>
                    {userProgress.completedLessons.length > 0 ? (
                        userProgress.completedLessons.slice(-5).reverse().map((lessonId, index) => (
                            <View key={index} style={styles.historyItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#58CC02" />
                                <Text style={styles.historyText}>Completed: {lessonId}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No lessons completed yet</Text>
                    )}
                </View>
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
        backgroundColor: '#58CC02',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    level: {
        fontSize: 18,
        color: '#fff',
        opacity: 0.9,
        fontWeight: '600',
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    streak: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 12,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    statIcon: {
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.9,
        fontWeight: '600',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    continueButton: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    continueButtonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    continueLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    sectionBadge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    continueText: {
        flex: 1,
    },
    continueButtonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    continueButtonSubtitle: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    progressCircleContainer: {
        position: 'relative',
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressTextContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#58CC02',
    },
    playIcon: {
        position: 'absolute',
        bottom: -8,
        right: -8,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    chartContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    chart: {
        borderRadius: 16,
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    lessonIcon: {
        marginRight: 16,
    },
    lessonContent: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    lessonSubtitle: {
        fontSize: 14,
        color: '#999',
    },
    historyContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 12,
    },
    historyText: {
        fontSize: 14,
        color: '#333',
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        paddingVertical: 20,
    },
});
