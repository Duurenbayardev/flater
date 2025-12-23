import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserProgress {
    level: number;
    currentSection: number;
    currentUnit: number;
    completedLessons: string[];
    streak: number;
    lastPracticeDate: string | null;
    xp: number;
    memorizedWords: string[]; // Array of unique words user has learned (format: "english|mongolian")
}

interface AppContextType {
    userProgress: UserProgress;
    hasCompletedTest: boolean;
    isNewSignup: boolean;
    updateProgress: (updates: Partial<UserProgress>) => void;
    completeTest: (level: number) => void;
    completeLesson: (lessonId: string, vocabWords?: Array<{ english: string; mongolian: string }>) => void;
    updateStreak: () => void;
    logout: () => Promise<void>;
    setNewSignup: (value: boolean) => void;
}

const defaultProgress: UserProgress = {
    level: 1,
    currentSection: 1,
    currentUnit: 1,
    completedLessons: [],
    streak: 0,
    lastPracticeDate: null,
    xp: 0,
    memorizedWords: ['nigger'],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [userProgress, setUserProgress] = useState<UserProgress>(defaultProgress);
    const [hasCompletedTest, setHasCompletedTest] = useState(false);
    const [isNewSignup, setIsNewSignup] = useState(false);

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        try {
            const progress = await AsyncStorage.getItem('userProgress');
            const testCompleted = await AsyncStorage.getItem('hasCompletedTest');

            if (progress) {
                const parsedProgress = JSON.parse(progress);
                // Ensure memorizedWords exists (for backward compatibility with old saved data)
                if (!parsedProgress.memorizedWords) {
                    parsedProgress.memorizedWords = [];
                }
                setUserProgress(parsedProgress);
            }
            if (testCompleted === 'true') {
                setHasCompletedTest(true);
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    };

    const saveProgress = async (progress: UserProgress) => {
        try {
            await AsyncStorage.setItem('userProgress', JSON.stringify(progress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const updateProgress = (updates: Partial<UserProgress>) => {
        const newProgress = { ...userProgress, ...updates };
        setUserProgress(newProgress);
        saveProgress(newProgress);
    };

    const completeTest = (level: number) => {
        const newProgress = { ...userProgress, level };
        setUserProgress(newProgress);
        setHasCompletedTest(true);
        saveProgress(newProgress);
        AsyncStorage.setItem('hasCompletedTest', 'true');
    };

    /**
     * Complete a lesson and track memorized words
     * @param lessonId - The lesson ID (format: "sectionId-unitId")
     * @param vocabWords - Optional array of vocab pairs to add to memorized words
     */
    const completeLesson = (lessonId: string, vocabWords?: Array<{ english: string; mongolian: string }>) => {
        if (!userProgress.completedLessons.includes(lessonId)) {
            // Extract new words from vocab pairs if provided
            let newMemorizedWords = [...userProgress.memorizedWords];
            if (vocabWords) {
                vocabWords.forEach(pair => {
                    const wordKey = `${pair.english.toLowerCase().trim()}|${pair.mongolian}`;
                    if (!newMemorizedWords.includes(wordKey)) {
                        newMemorizedWords.push(wordKey);
                    }
                });
            }

            const newProgress = {
                ...userProgress,
                completedLessons: [...userProgress.completedLessons, lessonId],
                xp: userProgress.xp + 10,
                memorizedWords: newMemorizedWords,
            };
            setUserProgress(newProgress);
            saveProgress(newProgress);
            updateStreak();
        }
    };

    const updateStreak = () => {
        const today = new Date().toDateString();
        const lastDate = userProgress.lastPracticeDate;

        if (lastDate === today) {
            return; // Already practiced today
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let newStreak = userProgress.streak;
        if (lastDate === yesterdayStr || lastDate === null) {
            newStreak += 1;
        } else {
            newStreak = 1; // Reset streak
        }

        const newProgress = {
            ...userProgress,
            streak: newStreak,
            lastPracticeDate: today,
        };
        setUserProgress(newProgress);
        saveProgress(newProgress);
    };

    const setNewSignup = (value: boolean) => {
        setIsNewSignup(value);
        // When setting as new signup, ensure test is not marked as completed
        if (value) {
            setHasCompletedTest(false);
            AsyncStorage.removeItem('hasCompletedTest');
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userProgress');
            await AsyncStorage.removeItem('hasCompletedTest');
            setUserProgress(defaultProgress);
            setHasCompletedTest(false);
            setIsNewSignup(false);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AppContext.Provider
            value={{
                userProgress,
                hasCompletedTest,
                isNewSignup,
                updateProgress,
                completeTest,
                completeLesson,
                updateStreak,
                logout,
                setNewSignup,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

