import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, InteractionManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { useApp } from '../contexts/AppContext';

export default function LandingPage() {
  const router = useRouter();
  const { hasCompletedTest } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Only auto-navigate if user has completed test (logged in user)
    const interaction = InteractionManager.runAfterInteractions(() => {
      if (hasCompletedTest) {
        router.replace('/(tabs)/home' as any);
      }
      // Otherwise, show the landing page (user can sign up or login)
    });

    return () => interaction.cancel();
  }, [hasCompletedTest]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const slides = [
    {
      title: 'Learn English',
      titleMongolian: 'Англи хэл сур',
      description: 'Master English with interactive lessons',
      descriptionMongolian: 'Интерактив хичээлээр англи хэл сур',
      iconName: 'book',
    },
    {
      title: 'Track Progress',
      titleMongolian: 'Ахиц дэвшлээ харах',
      description: 'Monitor your learning journey',
      descriptionMongolian: 'Сурлагын аяллыг хянах',
      iconName: 'stats-chart',
    },
    {
      title: 'Build Streaks',
      titleMongolian: 'Цуваа үргэлжлүүл',
      description: 'Practice daily to maintain progress',
      descriptionMongolian: 'Өдөр бүр дасгал хийж ахиц дэвшлээ хадгал',
      iconName: 'flame',
    },
  ];

  return (
    <View style={styles.container}>
      <Swiper
        loop={false}
        showsPagination={true}
        paginationStyle={styles.pagination}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        autoplay={true}
        autoplayTimeout={4}
        onIndexChanged={(index) => setCurrentSlide(index)}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <View style={styles.logoBackground}>
                <Image
                  source={require('../assets/logo.png')}
                  style={styles.logo}
                  contentFit="contain"
                />
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.textContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={slide.iconName as any} size={48} color="#58CC02" />
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.titleMongolian}>{slide.titleMongolian}</Text>
            </Animated.View>
          </View>
        ))}
      </Swiper>
      {currentSlide === 2 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push('/auth/signup' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#58CC02" style={styles.buttonIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
    paddingBottom: 120,
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  logoBackground: {
    backgroundColor: '#48c04cff',
    borderRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 100,
    height: 100,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleMongolian: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  pagination: {
    bottom: 120,
  },
  dot: {
    backgroundColor: '#E5E5E5',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#58CC02',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    zIndex: 10,
    gap: 12,
  },
  getStartedButton: {
    backgroundColor: '#58CC02',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  loginButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});
