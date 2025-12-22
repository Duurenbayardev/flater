import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useApp } from '../../contexts/AppContext';

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

    const getLessonId = (sectionId: number, unitId: number, lessonNum: number) => {
        return `${sectionId}-${unitId}-${lessonNum}`;
    };

    const getCompletedUnits = (sectionId: number) => {
        return sections[sectionId - 1].units.filter((unit) => {
            const lessonId = getLessonId(sectionId, unit.id, 1);
            return userProgress.completedLessons.includes(lessonId);
        }).length;
    };

    const getTotalUnits = (sectionId: number) => {
        return sections[sectionId - 1].units.length;
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                {sections.map((section) => {
                    const completedUnits = getCompletedUnits(section.id);
                    const totalUnits = getTotalUnits(section.id);
                    const progress = (completedUnits / totalUnits) * 100;
                    const isExpanded = expandedSection === section.id;

                    return (
                        <Animated.View
                            key={section.id}
                            style={styles.sectionCard}
                            layout={Layout.springify()}
                        >
                            <TouchableOpacity
                                style={styles.sectionHeader}
                                onPress={() => toggleSection(section.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.sectionIconContainer}>
                                    <Ionicons name={section.iconName as any} size={36} color="#58CC02" />
                                </View>
                                <View style={styles.sectionInfo}>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                    <View style={styles.progressBarContainer}>
                                        <View style={[styles.progressBar, { width: `${progress}%` }]} />
                                    </View>
                                    <Text style={styles.progressText}>
                                        {completedUnits} of {totalUnits} units completed
                                    </Text>
                                </View>
                                <Ionicons
                                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={28}
                                    color="#58CC02"
                                />
                            </TouchableOpacity>

                            {isExpanded && (
                                <Animated.View
                                    style={styles.unitsContainer}
                                    entering={FadeInDown.duration(300)}
                                >
                                    {section.units.map((unit, index) => {
                                        const lessonId = getLessonId(section.id, unit.id, 1);
                                        const isCompleted = userProgress.completedLessons.includes(lessonId);

                                        return (
                                            <Animated.View
                                                key={unit.id}
                                                entering={FadeInDown.delay(index * 50).duration(300)}
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
                                                        <View style={styles.unitIcon}>
                                                            {isCompleted ? (
                                                                <Ionicons name="checkmark-circle" size={32} color="#58CC02" />
                                                            ) : (
                                                                <View style={styles.unitNumber}>
                                                                    <Text style={styles.unitNumberText}>{unit.id}</Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                        <View style={styles.unitInfo}>
                                                            <Text style={[
                                                                styles.unitTitle,
                                                                isCompleted && styles.unitTitleCompleted,
                                                            ]}>
                                                                {unit.title}
                                                            </Text>
                                                            <Text style={styles.unitSubtitle}>{unit.lessons} lessons</Text>
                                                        </View>
                                                        <Ionicons name="play-circle" size={32} color={isCompleted ? '#58CC02' : '#999'} />
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
        backgroundColor: '#F8F9FA',
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 80,
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
    },
    sectionIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    sectionInfo: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E5E5E5',
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#58CC02',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    unitsContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    unitCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 18,
        marginTop: 16,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    unitCardCompleted: {
        backgroundColor: '#E8F5E9',
        borderColor: '#58CC02',
    },
    unitContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    unitIcon: {
        marginRight: 20,
    },
    unitNumber: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E5E5E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unitNumberText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#999',
    },
    unitInfo: {
        flex: 1,
    },
    unitTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    unitTitleCompleted: {
        color: '#58CC02',
    },
    unitSubtitle: {
        fontSize: 14,
        color: '#999',
    },
});
