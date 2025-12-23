import { Audio } from 'expo-av';

/**
 * Audio utility module for managing sound effects in the app
 * Preloads sounds on app startup for instant playback
 */

// Store preloaded sound objects in memory for reuse
let completionSound: Audio.Sound | null = null;
let unitCompleteSound: Audio.Sound | null = null;

/**
 * Preload the completion sound (played when user gets a question right)
 * Called during app startup to ensure instant playback
 */
export const preloadCompletionSound = async (): Promise<void> => {
    try {
        if (completionSound) {
            // Already loaded, skip
            return;
        }
        // Load the sound file and store the sound object
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/completion.mp3')
        );
        completionSound = sound;
    } catch (error) {
        console.log('Error preloading completion sound:', error);
    }
};

/**
 * Preload the unit complete sound (played when user completes a lesson/unit)
 * Called during app startup to ensure instant playback
 */
export const preloadUnitCompleteSound = async (): Promise<void> => {
    try {
        if (unitCompleteSound) {
            // Already loaded, skip
            return;
        }
        // Load the sound file and store the sound object
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/unitcomplete.mp3')
        );
        unitCompleteSound = sound;
    } catch (error) {
        console.log('Error preloading unit complete sound:', error);
    }
};

/**
 * Play the completion sound when user gets a question right
 * Uses preloaded sound if available, otherwise loads on demand
 */
export const playCompletionSound = async (): Promise<void> => {
    try {
        if (completionSound) {
            // Reset to beginning and play the preloaded sound
            await completionSound.setPositionAsync(0); // Reset to start
            await completionSound.playAsync();
        } else {
            // If not preloaded, load and play on demand
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/completion.mp3')
            );
            await sound.playAsync();
            // Clean up after playback finishes
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        }
    } catch (error) {
        console.log('Error playing completion sound:', error);
    }
};

/**
 * Play the unit complete sound when user finishes a lesson/unit
 * Uses preloaded sound if available, otherwise loads on demand
 */
export const playUnitCompleteSound = async (): Promise<void> => {
    try {
        if (unitCompleteSound) {
            // Reset to beginning and play the preloaded sound
            await unitCompleteSound.setPositionAsync(0); // Reset to start
            await unitCompleteSound.playAsync();
        } else {
            // If not preloaded, load and play on demand
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/unitcomplete.mp3')
            );
            await sound.playAsync();
            // Clean up after playback finishes
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        }
    } catch (error) {
        console.log('Error playing unit complete sound:', error);
    }
};

export const unloadCompletionSound = async (): Promise<void> => {
    try {
        if (completionSound) {
            await completionSound.unloadAsync();
            completionSound = null;
        }
    } catch (error) {
        console.log('Error unloading completion sound:', error);
    }
};

export const unloadUnitCompleteSound = async (): Promise<void> => {
    try {
        if (unitCompleteSound) {
            await unitCompleteSound.unloadAsync();
            unitCompleteSound = null;
        }
    } catch (error) {
        console.log('Error unloading unit complete sound:', error);
    }
};
