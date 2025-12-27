import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useApp } from '../../contexts/AppContext';

// Dark theme colors for each section - distinct darker colors
const sectionColors = [
    '#6B5FBB', // Purple-blue
    '#4A7FA3', // Deep blue
    '#5A8F7B', // Muted teal-green
    '#8D6FAB', // Muted purple-pink
    '#7C6F9B', // Light purple-pink
];

const sections = [
    {
        id: 1,
        title: 'Greetings',
        iconName: 'hand-left',
        units: [
            { id: 1, title: 'Basic Greetings', lessons: 5 },
            { id: 2, title: 'Formal Greetings', lessons: 4 },
            { id: 3, title: 'Time-based Greetings', lessons: 3 },
            { id: 4, title: 'Introductions', lessons: 4 },
            { id: 5, title: 'Farewells', lessons: 5 },
            { id: 6, title: 'Polite Expressions', lessons: 4 },
        ],
    },
    {
        id: 2,
        title: 'At the Airport',
        iconName: 'airplane',
        units: [
            { id: 1, title: 'Check-in', lessons: 5 },
            { id: 2, title: 'Security', lessons: 4 },
            { id: 3, title: 'Boarding', lessons: 5 },
            { id: 4, title: 'On the Plane', lessons: 3 },
            { id: 5, title: 'Immigration', lessons: 4 },
            { id: 6, title: 'Baggage Claim', lessons: 5 },
        ],
    },
    {
        id: 3,
        title: 'Restaurant',
        iconName: 'restaurant',
        units: [
            { id: 1, title: 'Ordering Food', lessons: 5 },
            { id: 2, title: 'Menu Items', lessons: 4 },
            { id: 3, title: 'Special Requests', lessons: 3 },
            { id: 4, title: 'Paying the Bill', lessons: 4 },
            { id: 5, title: 'Complaints', lessons: 5 },
            { id: 6, title: 'Compliments', lessons: 4 },
        ],
    },
    {
        id: 4,
        title: 'Shopping',
        iconName: 'bag',
        units: [
            { id: 1, title: 'At the Store', lessons: 5 },
            { id: 2, title: 'Asking for Help', lessons: 4 },
            { id: 3, title: 'Prices & Payment', lessons: 5 },
            { id: 4, title: 'Returns & Exchanges', lessons: 3 },
            { id: 5, title: 'Bargaining', lessons: 4 },
            { id: 6, title: 'Receipts', lessons: 5 },
        ],
    },
    {
        id: 5,
        title: 'Daily Life',
        iconName: 'home',
        units: [
            { id: 1, title: 'Family', lessons: 5 },
            { id: 2, title: 'Daily Routines', lessons: 4 },
            { id: 3, title: 'Hobbies', lessons: 3 },
            { id: 4, title: 'Weather', lessons: 4 },
            { id: 5, title: 'Time & Dates', lessons: 5 },
            { id: 6, title: 'Numbers', lessons: 4 },
        ],
    },
];

export default function LessonsScreen() {
    const router = useRouter();
    const { userProgress } = useApp();
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    const toggleSection = (sectionId: number) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    /**
     * Generate lesson ID from section and unit (format: "sectionId-unitId")
     * Each unit is a single lesson, no separate lesson numbers
     */
    const getLessonId = (sectionId: number, unitId: number) => {
        return `${sectionId}-${unitId}`;
    };

    const getCompletedUnits = (sectionId: number) => {
        return sections[sectionId - 1].units.filter((unit) => {
            const lessonId = getLessonId(sectionId, unit.id);
            return userProgress.completedLessons.includes(lessonId);
        }).length;
    };

    const getTotalUnits = (sectionId: number) => {
        return sections[sectionId - 1].units.length;
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content} contentContainerStyle={{ paddingTop: 110, paddingBottom: 20 }}>
                {sections.map((section) => {
                    const completedUnits = getCompletedUnits(section.id);
                    const totalUnits = getTotalUnits(section.id);
                    const progress = (completedUnits / totalUnits) * 100;
                    const isExpanded = expandedSection === section.id;
                    const sectionColor = sectionColors[(section.id - 1) % sectionColors.length];

                    return (
                        <Animated.View
                            key={section.id}
                            style={[styles.sectionCard, { backgroundColor: sectionColor }]}
                            layout={Layout.springify()}
                        >
                            <TouchableOpacity
                                style={styles.sectionHeader}
                                onPress={() => toggleSection(section.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.sectionIconContainer}>
                                    <Ionicons name={section.iconName as any} size={48} color="#FFFFFF" />
                                </View>
                                <View style={styles.sectionInfo}>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                    <View style={styles.progressBarContainer}>
                                        <View style={[styles.progressBar, { width: `${progress}%` }]} />
                                    </View>
                                    <Text style={styles.progressText}>
                                        {completedUnits}/{totalUnits} units
                                    </Text>
                                </View>
                                <Ionicons
                                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={24}
                                    color="#FFFFFF"
                                    style={{ marginLeft: 12 }}
                                />
                            </TouchableOpacity>

                            {isExpanded && (
                                <Animated.View
                                    style={styles.unitsContainer}
                                    entering={FadeInDown.duration(300)}
                                >
                                    {section.units.map((unit, index) => {
                                        const lessonId = getLessonId(section.id, unit.id);
                                        const isCompleted = userProgress.completedLessons.includes(lessonId);

                                        return (
                                            <Animated.View
                                                key={unit.id}
                                                entering={FadeInDown.delay(index * 30).duration(300)}
                                                layout={Layout.springify()}
                                            >
                                                <TouchableOpacity
                                                    style={[
                                                        styles.unitCard,
                                                        isCompleted && styles.unitCardCompleted,
                                                    ]}
                                                    onPress={() => router.push(`/lesson/${lessonId}` as any)}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={styles.unitContent}>
                                                        <View style={styles.unitInfo}>
                                                            <Text style={[
                                                                styles.unitTitle,
                                                                isCompleted && styles.unitTitleCompleted,
                                                            ]}>
                                                                {unit.title}
                                                            </Text>
                                                            <Text style={styles.unitSubtitle}>{unit.lessons} lessons</Text>
                                                        </View>
                                                        {isCompleted ? (
                                                            <Ionicons name="checkmark-circle" size={24} color="#C8ACD6" />
                                                        ) : (
                                                            <Ionicons name="play-circle" size={24} color="#433D8B" />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        );
                                    })}
                                </Animated.View>
                            )}
                        </Animated.View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#17153B',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    sectionCard: {
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        minHeight: 120,
    },
    sectionIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionInfo: {
        flex: 1,
        marginLeft: 20,
        alignItems: 'flex-end',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 10,
        textAlign: 'right',
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        marginBottom: 6,
        overflow: 'hidden',
        width: '100%',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.9,
        fontWeight: '500',
        textAlign: 'right',
    },
    unitsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 12,
        backgroundColor: 'rgba(23, 21, 59, 0.5)',
    },
    unitCard: {
        backgroundColor: '#2E236C',
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#433D8B',
    },
    unitCardCompleted: {
        backgroundColor: '#433D8B',
        borderColor: '#C8ACD6',
    },
    unitContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        justifyContent: 'space-between',
    },
    unitInfo: {
        flex: 1,
    },
    unitTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    unitTitleCompleted: {
        color: '#C8ACD6',
    },
    unitSubtitle: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.7,
        fontWeight: '400',
    },
});
