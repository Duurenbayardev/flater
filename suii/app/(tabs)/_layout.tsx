import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import AppHeader from '../../components/AppHeader';

export default function TabsLayout() {
    return (
        <View style={{ flex: 1 }}>
            {/* Fixed header for all tab pages */}
            <AppHeader />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#C8ACD6',
                    tabBarInactiveTintColor: '#433D8B',
                    tabBarStyle: {
                        backgroundColor: '#2E236C',
                        borderTopWidth: 1,
                        borderTopColor: '#433D8B',
                        height: 80,
                        paddingBottom: 12,
                        paddingTop: 12,
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="lessons"
                    options={{
                        title: 'Lessons',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="book" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="leaderboard"
                    options={{
                        title: 'Games',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="game-controller" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}

