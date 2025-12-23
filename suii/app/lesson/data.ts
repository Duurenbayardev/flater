export interface ConversationMessage {
    speaker: 'A' | 'B';
    text: string;
}

export interface Phrase {
    id: number;
    text: string;
    translation: string;
    breakdown: Array<{ word: string; meaning: string }>;
    words: string[];
    extraWords: string[];
    vocabPairs: Array<{ english: string; mongolian: string }>;
    multipleChoice: Array<{
        question: string;
        options: string[];
        correct: number;
    }>;
}

export interface LessonData {
    conversation: ConversationMessage[];
    phrases: Phrase[];
}

/**
 * Lesson data mapped by lesson ID (format: "sectionId-unitId")
 * Example: "1-1" = Section 1, Unit 1
 * Each unit is a single lesson - no separate lesson numbers
 */
export const lessonsData: Record<string, LessonData> = {
    // Section 1: Greetings, Unit 1: Basic Greetings
    '1-1': {
        conversation: [
            { speaker: 'A', text: "Hey! Good morning. How are you?" },
            { speaker: 'B', text: "I'm good. I'm not busy today." },
            { speaker: 'A', text: "Nice! but I'm a little tired." },
            { speaker: 'B', text: "I'm not tired. I feel energetic." },
            { speaker: 'A', text: "Good for you" },
        ],
        phrases: [
            {
                id: 1,
                text: "Hey! Good morning. How are you?",
                translation: "Сайн уу! Өглөөний мэнд. Та яаж байна?",
                breakdown: [
                    { word: "Hey", meaning: "Сайн уу" },
                    { word: "Good morning", meaning: "Өглөөний мэнд" },
                    { word: "How are you?", meaning: "Та яаж байна?" },
                ],
                words: ["Hey", "Good", "morning", "How", "are", "you"],
                extraWords: ["Hello", "Hi"],
                vocabPairs: [
                    { english: "Hey", mongolian: "Сайн уу" },
                    { english: "Good morning", mongolian: "Өглөөний мэнд" },
                    { english: "How are you", mongolian: "Та яаж байна" },
                    { english: "Good", mongolian: "Сайн" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'Good morning' mean?",
                        options: ["Өглөөний мэнд", "Сайн уу", "Баяртай", "Баярлалаа"],
                        correct: 0,
                    },
                    {
                        question: "What does 'How' mean?",
                        options: ["яаж", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
            {
                id: 2,
                text: "I'm good. I'm not busy today.",
                translation: "Би сайн байна. Өнөөдөр би завгүй биш.",
                breakdown: [
                    { word: "I'm", meaning: "Би" },
                    { word: "good", meaning: "сайн" },
                    { word: "not busy", meaning: "завгүй биш" },
                    { word: "today", meaning: "өнөөдөр" },
                ],
                words: ["I'm", "good", "I'm", "not", "busy", "today"],
                extraWords: ["I", "am"],
                vocabPairs: [
                    { english: "I'm", mongolian: "Би" },
                    { english: "good", mongolian: "сайн" },
                    { english: "busy", mongolian: "завгүй" },
                    { english: "today", mongolian: "өнөөдөр" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'busy' mean?",
                        options: ["сайн", "завгүй", "өнөөдөр", "би"],
                        correct: 1,
                    },
                    {
                        question: "What does 'today' mean?",
                        options: ["сайн", "завгүй", "өнөөдөр", "биш"],
                        correct: 2,
                    },
                ],
            },
            {
                id: 3,
                text: "Nice! but I'm a little tired.",
                translation: "Сайн байна! Гэхдээ би бага зэрэг ядарсан байна.",
                breakdown: [
                    { word: "Nice", meaning: "Сайн байна" },
                    { word: "but", meaning: "гэхдээ" },
                    { word: "I'm", meaning: "би" },
                    { word: "a little", meaning: "бага зэрэг" },
                    { word: "tired", meaning: "ядарсан" },
                ],
                words: ["Nice", "but", "I'm", "a", "little", "tired"],
                extraWords: ["I", "am"],
                vocabPairs: [
                    { english: "Nice", mongolian: "Сайн байна" },
                    { english: "but", mongolian: "гэхдээ" },
                    { english: "tired", mongolian: "ядарсан" },
                    { english: "little", mongolian: "бага" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'tired' mean?",
                        options: ["ядарсан", "сайн", "гэхдээ", "бага"],
                        correct: 0,
                    },
                    {
                        question: "What does 'but' mean?",
                        options: ["Сайн байна", "гэхдээ", "бага", "ядарсан"],
                        correct: 1,
                    },
                ],
            },
            {
                id: 4,
                text: "I'm not tired. I feel energetic.",
                translation: "Би ядарсангүй. Би эрч хүчтэй мэдэрч байна.",
                breakdown: [
                    { word: "I'm not", meaning: "Би ... биш" },
                    { word: "tired", meaning: "ядарсан" },
                    { word: "I feel", meaning: "Би мэдэрч байна" },
                    { word: "energetic", meaning: "эрч хүчтэй" },
                ],
                words: ["I'm", "not", "tired", "I", "feel", "energetic"],
                extraWords: ["am", "I"],
                vocabPairs: [
                    { english: "tired", mongolian: "ядарсан" },
                    { english: "feel", mongolian: "мэдрэх" },
                    { english: "energetic", mongolian: "эрч хүчтэй" },
                    { english: "not", mongolian: "биш" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'energetic' mean?",
                        options: ["ядарсан", "эрч хүчтэй", "мэдрэх", "биш"],
                        correct: 1,
                    },
                    {
                        question: "What does 'feel' mean?",
                        options: ["ядарсан", "мэдрэх", "эрч хүчтэй", "биш"],
                        correct: 1,
                    },
                ],
            },
            {
                id: 5,
                text: "Good for you",
                translation: "Таны хувьд сайн байна",
                breakdown: [
                    { word: "Good", meaning: "Сайн" },
                    { word: "for", meaning: "хувьд" },
                    { word: "you", meaning: "та" },
                ],
                words: ["Good", "for", "you"],
                extraWords: ["I", "am"],
                vocabPairs: [
                    { english: "Good", mongolian: "Сайн" },
                    { english: "for", mongolian: "хувьд" },
                    { english: "you", mongolian: "та" },
                    { english: "Good for you", mongolian: "Таны хувьд сайн" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'for' mean?",
                        options: ["сайн", "хувьд", "та", "би"],
                        correct: 1,
                    },
                    {
                        question: "What does 'Good for you' mean?",
                        options: ["Сайн", "хувьд", "та", "Таны хувьд сайн"],
                        correct: 3,
                    },
                ],
            },
        ],
    },
    // Section 1: Greetings, Unit 2: Formal Greetings
    '1-2': {
        conversation: [
            { speaker: 'A', text: "Hello! How's it going?" },
            { speaker: 'B', text: "Pretty good, thanks! How about you?" },
            { speaker: 'A', text: "I'm doing well, thank you!" },
            { speaker: 'B', text: "That's great to hear!" },
        ],
        phrases: [
            {
                id: 1,
                text: "Hello! How's it going?",
                translation: "Сайн уу! Яаж байна?",
                breakdown: [
                    { word: "Hello", meaning: "Сайн уу" },
                    { word: "How's it going", meaning: "Яаж байна" },
                ],
                words: ["Hello", "How's", "it", "going"],
                extraWords: ["Hey", "Hi"],
                vocabPairs: [
                    { english: "Hello", mongolian: "Сайн уу" },
                    { english: "How's it going", mongolian: "Яаж байна" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'Hello' mean?",
                        options: ["Сайн уу", "Баяртай", "Баярлалаа", "Өглөөний мэнд"],
                        correct: 0,
                    },
                    {
                        question: "What does 'How's it going' mean?",
                        options: ["Яаж байна", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
            {
                id: 2,
                text: "Pretty good, thanks! How about you?",
                translation: "Маш сайн, баярлалаа! Чи яаж байна?",
                breakdown: [
                    { word: "Pretty good", meaning: "Маш сайн" },
                    { word: "thanks", meaning: "баярлалаа" },
                    { word: "How about you", meaning: "Чи яаж байна" },
                ],
                words: ["Pretty", "good", "thanks", "How", "about", "you"],
                extraWords: ["I", "am"],
                vocabPairs: [
                    { english: "Pretty good", mongolian: "Маш сайн" },
                    { english: "thanks", mongolian: "баярлалаа" },
                    { english: "How about you", mongolian: "Чи яаж байна" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'thanks' mean?",
                        options: ["сайн", "баярлалаа", "өнөөдөр", "би"],
                        correct: 1,
                    },
                    {
                        question: "What does 'Pretty good' mean?",
                        options: ["сайн", "Маш сайн", "өнөөдөр", "биш"],
                        correct: 1,
                    },
                ],
            },
        ],
    },
    // Section 2: At the Airport, Unit 1: Check-in
    '2-1': {
        conversation: [
            { speaker: 'A', text: "Good morning. I'd like to check in." },
            { speaker: 'B', text: "Of course. May I see your passport?" },
            { speaker: 'A', text: "Here you go." },
            { speaker: 'B', text: "Thank you. Window or aisle seat?" },
            { speaker: 'A', text: "Window seat, please." },
        ],
        phrases: [
            {
                id: 1,
                text: "Good morning. I'd like to check in.",
                translation: "Өглөөний мэнд. Би бүртгүүлэх хүсэж байна.",
                breakdown: [
                    { word: "Good morning", meaning: "Өглөөний мэнд" },
                    { word: "I'd like to", meaning: "Би хүсэж байна" },
                    { word: "check in", meaning: "бүртгүүлэх" },
                ],
                words: ["Good", "morning", "I'd", "like", "to", "check", "in"],
                extraWords: ["Hello", "Hi"],
                vocabPairs: [
                    { english: "check in", mongolian: "бүртгүүлэх" },
                    { english: "I'd like to", mongolian: "Би хүсэж байна" },
                    { english: "passport", mongolian: "паспорт" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'check in' mean?",
                        options: ["бүртгүүлэх", "Сайн уу", "Баяртай", "Баярлалаа"],
                        correct: 0,
                    },
                    {
                        question: "What does 'I'd like to' mean?",
                        options: ["Би хүсэж байна", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
            {
                id: 2,
                text: "Of course. May I see your passport?",
                translation: "Мэдээж. Би таны паспортыг харж болох уу?",
                breakdown: [
                    { word: "Of course", meaning: "Мэдээж" },
                    { word: "May I see", meaning: "Би харж болох уу" },
                    { word: "your passport", meaning: "таны паспорт" },
                ],
                words: ["Of", "course", "May", "I", "see", "your", "passport"],
                extraWords: ["the", "a"],
                vocabPairs: [
                    { english: "Of course", mongolian: "Мэдээж" },
                    { english: "May I see", mongolian: "Би харж болох уу" },
                    { english: "passport", mongolian: "паспорт" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'Of course' mean?",
                        options: ["сайн", "Мэдээж", "өнөөдөр", "би"],
                        correct: 1,
                    },
                    {
                        question: "What does 'passport' mean?",
                        options: ["сайн", "завгүй", "паспорт", "биш"],
                        correct: 2,
                    },
                ],
            },
        ],
    },
    // Section 3: Restaurant, Unit 1: Ordering Food
    '3-1': {
        conversation: [
            { speaker: 'A', text: "Good evening. Table for two, please." },
            { speaker: 'B', text: "Of course. This way, please." },
            { speaker: 'A', text: "Thank you. Can I see the menu?" },
            { speaker: 'B', text: "Here you are. What would you like to order?" },
            { speaker: 'A', text: "I'll have the pasta, please." },
        ],
        phrases: [
            {
                id: 1,
                text: "Good evening. Table for two, please.",
                translation: "Оройн мэнд. Хоёр хүний ширээ, гуйя.",
                breakdown: [
                    { word: "Good evening", meaning: "Оройн мэнд" },
                    { word: "Table for two", meaning: "Хоёр хүний ширээ" },
                    { word: "please", meaning: "гуйя" },
                ],
                words: ["Good", "evening", "Table", "for", "two", "please"],
                extraWords: ["Hello", "Hi"],
                vocabPairs: [
                    { english: "Good evening", mongolian: "Оройн мэнд" },
                    { english: "Table for two", mongolian: "Хоёр хүний ширээ" },
                    { english: "please", mongolian: "гуйя" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'Good evening' mean?",
                        options: ["Өглөөний мэнд", "Оройн мэнд", "Баяртай", "Баярлалаа"],
                        correct: 1,
                    },
                    {
                        question: "What does 'Table for two' mean?",
                        options: ["Хоёр хүний ширээ", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
            {
                id: 2,
                text: "Can I see the menu?",
                translation: "Би цэс харж болох уу?",
                breakdown: [
                    { word: "Can I see", meaning: "Би харж болох уу" },
                    { word: "the menu", meaning: "цэс" },
                ],
                words: ["Can", "I", "see", "the", "menu"],
                extraWords: ["a", "an"],
                vocabPairs: [
                    { english: "menu", mongolian: "цэс" },
                    { english: "Can I see", mongolian: "Би харж болох уу" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'menu' mean?",
                        options: ["сайн", "цэс", "өнөөдөр", "би"],
                        correct: 1,
                    },
                    {
                        question: "What does 'Can I see' mean?",
                        options: ["сайн", "завгүй", "Би харж болох уу", "биш"],
                        correct: 2,
                    },
                ],
            },
        ],
    },
    // Section 1: Greetings, Unit 3: Time-based Greetings
    '1-3': {
        conversation: [
            { speaker: 'A', text: "Hi there! Nice to meet you." },
            { speaker: 'B', text: "Nice to meet you too! What's your name?" },
            { speaker: 'A', text: "I'm John. And you?" },
            { speaker: 'B', text: "I'm Sarah. Pleasure to meet you!" },
        ],
        phrases: [
            {
                id: 1,
                text: "Hi there! Nice to meet you.",
                translation: "Сайн уу! Тантай уулзахад таатай байна.",
                breakdown: [
                    { word: "Hi there", meaning: "Сайн уу" },
                    { word: "Nice to meet you", meaning: "Тантай уулзахад таатай" },
                ],
                words: ["Hi", "there", "Nice", "to", "meet", "you"],
                extraWords: ["Hello", "Hey"],
                vocabPairs: [
                    { english: "Hi there", mongolian: "Сайн уу" },
                    { english: "Nice to meet you", mongolian: "Тантай уулзахад таатай" },
                    { english: "meet", mongolian: "уулзах" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'Nice to meet you' mean?",
                        options: ["Тантай уулзахад таатай", "Сайн уу", "Баяртай", "Баярлалаа"],
                        correct: 0,
                    },
                    {
                        question: "What does 'meet' mean?",
                        options: ["уулзах", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
            {
                id: 2,
                text: "What's your name?",
                translation: "Таны нэр юу вэ?",
                breakdown: [
                    { word: "What's", meaning: "юу вэ" },
                    { word: "your name", meaning: "таны нэр" },
                ],
                words: ["What's", "your", "name"],
                extraWords: ["the", "a"],
                vocabPairs: [
                    { english: "What's your name", mongolian: "Таны нэр юу вэ" },
                    { english: "name", mongolian: "нэр" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'name' mean?",
                        options: ["сайн", "нэр", "өнөөдөр", "би"],
                        correct: 1,
                    },
                    {
                        question: "What does 'What's your name' mean?",
                        options: ["сайн", "завгүй", "Таны нэр юу вэ", "биш"],
                        correct: 2,
                    },
                ],
            },
        ],
    },
    // Section 1: Greetings, Unit 4: Introductions
    '1-4': {
        conversation: [
            { speaker: 'A', text: "Good morning, sir. How may I help you?" },
            { speaker: 'B', text: "Good morning. I have an appointment." },
            { speaker: 'A', text: "Certainly. May I have your name?" },
            { speaker: 'B', text: "Yes, it's Mr. Smith." },
        ],
        phrases: [
            {
                id: 1,
                text: "Good morning, sir. How may I help you?",
                translation: "Өглөөний мэнд, эрхэм. Би танд яаж туслах вэ?",
                breakdown: [
                    { word: "Good morning", meaning: "Өглөөний мэнд" },
                    { word: "sir", meaning: "эрхэм" },
                    { word: "How may I help you", meaning: "Би танд яаж туслах вэ" },
                ],
                words: ["Good", "morning", "sir", "How", "may", "I", "help", "you"],
                extraWords: ["Hello", "Hi"],
                vocabPairs: [
                    { english: "sir", mongolian: "эрхэм" },
                    { english: "How may I help you", mongolian: "Би танд яаж туслах вэ" },
                    { english: "appointment", mongolian: "уулзалт" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'sir' mean?",
                        options: ["эрхэм", "Сайн уу", "Баяртай", "Баярлалаа"],
                        correct: 0,
                    },
                    {
                        question: "What does 'How may I help you' mean?",
                        options: ["Би танд яаж туслах вэ", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
            {
                id: 2,
                text: "I have an appointment.",
                translation: "Би уулзалттай байна.",
                breakdown: [
                    { word: "I have", meaning: "Би байна" },
                    { word: "an appointment", meaning: "уулзалт" },
                ],
                words: ["I", "have", "an", "appointment"],
                extraWords: ["the", "a"],
                vocabPairs: [
                    { english: "appointment", mongolian: "уулзалт" },
                    { english: "I have", mongolian: "Би байна" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'appointment' mean?",
                        options: ["сайн", "уулзалт", "өнөөдөр", "би"],
                        correct: 1,
                    },
                    {
                        question: "What does 'I have' mean?",
                        options: ["сайн", "завгүй", "Би байна", "биш"],
                        correct: 2,
                    },
                ],
            },
        ],
    },
    // Section 2: At the Airport, Unit 2: Security
    '2-2': {
        conversation: [
            { speaker: 'A', text: "I have a reservation for two." },
            { speaker: 'B', text: "Under what name?" },
            { speaker: 'A', text: "Johnson." },
            { speaker: 'B', text: "Found it. Here are your boarding passes." },
        ],
        phrases: [
            {
                id: 1,
                text: "I have a reservation for two.",
                translation: "Би хоёр хүний захиалгатай байна.",
                breakdown: [
                    { word: "I have", meaning: "Би байна" },
                    { word: "a reservation", meaning: "захиалга" },
                    { word: "for two", meaning: "хоёр хүний" },
                ],
                words: ["I", "have", "a", "reservation", "for", "two"],
                extraWords: ["the", "an"],
                vocabPairs: [
                    { english: "reservation", mongolian: "захиалга" },
                    { english: "for two", mongolian: "хоёр хүний" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'reservation' mean?",
                        options: ["захиалга", "Сайн уу", "Баяртай", "Баярлалаа"],
                        correct: 0,
                    },
                    {
                        question: "What does 'for two' mean?",
                        options: ["хоёр хүний", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
            {
                id: 2,
                text: "Under what name?",
                translation: "Ямар нэрээр?",
                breakdown: [
                    { word: "Under", meaning: "дор" },
                    { word: "what name", meaning: "ямар нэр" },
                ],
                words: ["Under", "what", "name"],
                extraWords: ["the", "a"],
                vocabPairs: [
                    { english: "Under what name", mongolian: "Ямар нэрээр" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'Under what name' mean?",
                        options: ["сайн", "Ямар нэрээр", "өнөөдөр", "би"],
                        correct: 1,
                    },
                ],
            },
        ],
    },
    // Section 3: Restaurant, Unit 2: Menu Items
    '3-2': {
        conversation: [
            { speaker: 'A', text: "Are you ready to order?" },
            { speaker: 'B', text: "Yes, I'll have the steak, please." },
            { speaker: 'A', text: "How would you like it cooked?" },
            { speaker: 'B', text: "Medium rare, please." },
        ],
        phrases: [
            {
                id: 1,
                text: "Are you ready to order?",
                translation: "Та захиалахад бэлэн үү?",
                breakdown: [
                    { word: "Are you ready", meaning: "Та бэлэн үү" },
                    { word: "to order", meaning: "захиалах" },
                ],
                words: ["Are", "you", "ready", "to", "order"],
                extraWords: ["Hello", "Hi"],
                vocabPairs: [
                    { english: "ready to order", mongolian: "захиалахад бэлэн" },
                    { english: "order", mongolian: "захиалах" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'order' mean?",
                        options: ["захиалах", "Сайн уу", "Баяртай", "Баярлалаа"],
                        correct: 0,
                    },
                    {
                        question: "What does 'ready to order' mean?",
                        options: ["захиалахад бэлэн", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
            {
                id: 2,
                text: "I'll have the steak, please.",
                translation: "Би стейк захиална, гуйя.",
                breakdown: [
                    { word: "I'll have", meaning: "Би захиална" },
                    { word: "the steak", meaning: "стейк" },
                    { word: "please", meaning: "гуйя" },
                ],
                words: ["I'll", "have", "the", "steak", "please"],
                extraWords: ["a", "an"],
                vocabPairs: [
                    { english: "steak", mongolian: "стейк" },
                    { english: "I'll have", mongolian: "Би захиална" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'steak' mean?",
                        options: ["сайн", "стейк", "өнөөдөр", "би"],
                        correct: 1,
                    },
                    {
                        question: "What does 'I'll have' mean?",
                        options: ["сайн", "завгүй", "Би захиална", "биш"],
                        correct: 2,
                    },
                ],
            },
        ],
    },
    // Section 1: Greetings, Unit 5: Farewells
    '1-5': {
        conversation: [
            { speaker: 'A', text: "I have to go now. See you later!" },
            { speaker: 'B', text: "Okay, take care! Goodbye!" },
            { speaker: 'A', text: "Bye! Have a great day!" },
        ],
        phrases: [
            {
                id: 1,
                text: "I have to go now. See you later!",
                translation: "Би одоо явах ёстой. Дараа уулзая!",
                breakdown: [
                    { word: "I have to go", meaning: "Би явах ёстой" },
                    { word: "See you later", meaning: "Дараа уулзая" },
                ],
                words: ["I", "have", "to", "go", "now", "See", "you", "later"],
                extraWords: ["Hello", "Hi"],
                vocabPairs: [
                    { english: "See you later", mongolian: "Дараа уулзая" },
                    { english: "I have to go", mongolian: "Би явах ёстой" },
                    { english: "Goodbye", mongolian: "Баяртай" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'See you later' mean?",
                        options: ["Дараа уулзая", "Сайн уу", "Баяртай", "Баярлалаа"],
                        correct: 0,
                    },
                    {
                        question: "What does 'Goodbye' mean?",
                        options: ["Баяртай", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
        ],
    },
    // Section 1: Greetings, Unit 6: Polite Expressions
    '1-6': {
        conversation: [
            { speaker: 'A', text: "Thank you so much for your help!" },
            { speaker: 'B', text: "You're welcome! It was my pleasure." },
            { speaker: 'A', text: "I really appreciate it." },
        ],
        phrases: [
            {
                id: 1,
                text: "Thank you so much for your help!",
                translation: "Тусласанд маш их баярлалаа!",
                breakdown: [
                    { word: "Thank you", meaning: "Баярлалаа" },
                    { word: "so much", meaning: "маш их" },
                    { word: "for your help", meaning: "тусласанд" },
                ],
                words: ["Thank", "you", "so", "much", "for", "your", "help"],
                extraWords: ["Hello", "Hi"],
                vocabPairs: [
                    { english: "Thank you", mongolian: "Баярлалаа" },
                    { english: "You're welcome", mongolian: "Зүгээсээ" },
                    { english: "help", mongolian: "туслах" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'Thank you' mean?",
                        options: ["Баярлалаа", "Сайн уу", "Баяртай", "Өглөөний мэнд"],
                        correct: 0,
                    },
                    {
                        question: "What does 'You're welcome' mean?",
                        options: ["Зүгээсээ", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
        ],
    },
    // Section 2: At the Airport, Unit 3: Boarding
    '2-3': {
        conversation: [
            { speaker: 'A', text: "Boarding will begin in 30 minutes." },
            { speaker: 'B', text: "Which gate is it?" },
            { speaker: 'A', text: "Gate 12. Please have your boarding pass ready." },
        ],
        phrases: [
            {
                id: 1,
                text: "Boarding will begin in 30 minutes.",
                translation: "Суух ажиллагаа 30 минутын дараа эхлэх болно.",
                breakdown: [
                    { word: "Boarding", meaning: "Суух ажиллагаа" },
                    { word: "will begin", meaning: "эхлэх болно" },
                    { word: "in 30 minutes", meaning: "30 минутын дараа" },
                ],
                words: ["Boarding", "will", "begin", "in", "30", "minutes"],
                extraWords: ["the", "a"],
                vocabPairs: [
                    { english: "Boarding", mongolian: "Суух ажиллагаа" },
                    { english: "gate", mongolian: "гарц" },
                    { english: "boarding pass", mongolian: "суух талон" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'Boarding' mean?",
                        options: ["Суух ажиллагаа", "Сайн уу", "Баяртай", "Баярлалаа"],
                        correct: 0,
                    },
                    {
                        question: "What does 'gate' mean?",
                        options: ["гарц", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
        ],
    },
    // Section 3: Restaurant, Unit 3: Special Requests
    '3-3': {
        conversation: [
            { speaker: 'A', text: "Can I have this without onions?" },
            { speaker: 'B', text: "Of course. Anything else?" },
            { speaker: 'A', text: "No, that's all. Thank you!" },
        ],
        phrases: [
            {
                id: 1,
                text: "Can I have this without onions?",
                translation: "Би үүнийг сонгино байхгүйгээр авч болох уу?",
                breakdown: [
                    { word: "Can I have", meaning: "Би авч болох уу" },
                    { word: "without", meaning: "байхгүйгээр" },
                    { word: "onions", meaning: "сонгино" },
                ],
                words: ["Can", "I", "have", "this", "without", "onions"],
                extraWords: ["the", "a"],
                vocabPairs: [
                    { english: "without", mongolian: "байхгүйгээр" },
                    { english: "Can I have", mongolian: "Би авч болох уу" },
                ],
                multipleChoice: [
                    {
                        question: "What does 'without' mean?",
                        options: ["байхгүйгээр", "Сайн уу", "Баяртай", "Баярлалаа"],
                        correct: 0,
                    },
                    {
                        question: "What does 'Can I have' mean?",
                        options: ["Би авч болох уу", "Сайн", "Өглөө", "та"],
                        correct: 0,
                    },
                ],
            },
        ],
    },
};

/**
 * Get lesson data by lesson ID (format: "sectionId-unitId")
 * Returns null if lesson not found
 */
export function getLessonData(lessonId: string): LessonData | null {
    return lessonsData[lessonId] || null;
}
