export const sampleConcepts = [
  {
    id: 1,
    topic: "Photosynthesis",
    grade: "Class 7",
    explanation: {
      en: "Photosynthesis is how plants make their own food using sunlight, water, and carbon dioxide. The leaves act as tiny food factories!",
      hi: "प्रकाश संश्लेषण वह प्रक्रिया है जिसमें पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड का उपयोग करके अपना भोजन बनाते हैं। पत्तियाँ छोटी खाद्य कारखाने हैं!"
    },
    keyPoints: [
      { en: "Plants make their own food", hi: "पौधे अपना भोजन बनाते हैं" },
      { en: "Sunlight acts like a battery", hi: "सूर्य का प्रकाश बैटरी की तरह काम करता है" },
      { en: "Leaves are mini food factories", hi: "पत्तियाँ छोटी खाद्य कारखाने हैं" },
      { en: "Oxygen is released as a by-product", hi: "ऑक्सीजन उपोत्पाद के रूप में निकलती है" }
    ],
    funExample: {
      en: "Imagine the leaf as a solar-powered kitchen. The sun is the stove, water is the ingredient from roots, and CO₂ is the spice from air!",
      hi: "पत्ती को एक सौर ऊर्जा संचालित रसोई के रूप में कल्पना करें। सूर्य चूल्हा है, पानी जड़ों से सामग्री है, और CO₂ हवा से मसाला है!"
    },
    diagram: "photosynthesis"
  },
  {
    id: 2,
    topic: "Solar System",
    grade: "Class 6",
    explanation: {
      en: "Our Solar System has the Sun at the center, with 8 planets orbiting around it. Earth is the 3rd planet and the only one with life!",
      hi: "हमारा सौर मंडल सूर्य को केंद्र में रखता है, जिसके चारों ओर 8 ग्रह परिक्रमा करते हैं। पृथ्वी तीसरा ग्रह है और जीवन वाला एकमात्र ग्रह!"
    },
    keyPoints: [
      { en: "Sun is at the center", hi: "सूर्य केंद्र में है" },
      { en: "8 planets orbit the Sun", hi: "8 ग्रह सूर्य की परिक्रमा करते हैं" },
      { en: "Earth is the 3rd planet", hi: "पृथ्वी तीसरा ग्रह है" },
      { en: "Jupiter is the largest planet", hi: "बृहस्पति सबसे बड़ा ग्रह है" }
    ],
    funExample: {
      en: "If the Solar System was a family, the Sun is the parent and planets are children running around the house!",
      hi: "यदि सौर मंडल एक परिवार हो, तो सूर्य माता-पिता हैं और ग्रह घर के चारों ओर दौड़ते बच्चे हैं!"
    },
    diagram: "solar-system"
  },
  {
    id: 3,
    topic: "Water Cycle",
    grade: "Class 5",
    explanation: {
      en: "The Water Cycle is nature's recycling system. Water moves from Earth to sky and back again through evaporation, condensation, and precipitation!",
      hi: "जल चक्र प्रकृति की पुनर्चक्रण प्रणाली है। पानी वाष्पीकरण, संघनन और वर्षा के माध्यम से पृथ्वी से आकाश और वापस जाता है!"
    },
    keyPoints: [
      { en: "Evaporation: Water turns to vapor", hi: "वाष्पीकरण: पानी भाप में बदलता है" },
      { en: "Condensation: Vapor forms clouds", hi: "संघनन: भाप बादल बनाती है" },
      { en: "Precipitation: Rain falls down", hi: "वर्षा: बारिश नीचे गिरती है" },
      { en: "Collection: Water gathers in rivers", hi: "संग्रह: पानी नदियों में इकट्ठा होता है" }
    ],
    funExample: {
      en: "Think of clouds as water delivery trucks. They pick up water from oceans, drive to land, and deliver rain!",
      hi: "बादलों को पानी की डिलीवरी ट्रकों के रूप में सोचें। वे समुद्र से पानी उठाते हैं, भूमि पर जाते हैं और वर्षा करते हैं!"
    },
    diagram: "water-cycle"
  }
];

export const sampleQuizzes = [
  {
    id: 1,
    topic: "Solar System",
    questions: [
      {
        id: 1,
        question: { en: "Which planet is known as the Red Planet?", hi: "किस ग्रह को लाल ग्रह कहा जाता है?" },
        options: [
          { en: "Venus", hi: "शुक्र" },
          { en: "Mars", hi: "मंगल" },
          { en: "Jupiter", hi: "बृहस्पति" },
          { en: "Saturn", hi: "शनि" }
        ],
        correctIndex: 1,
        difficulty: "beginner" as const
      },
      {
        id: 2,
        question: { en: "What is the closest star to Earth?", hi: "पृथ्वी का सबसे निकटतम तारा कौन सा है?" },
        options: [
          { en: "Proxima Centauri", hi: "प्रॉक्सिमा सेंटौरी" },
          { en: "Sirius", hi: "सिरियस" },
          { en: "The Sun", hi: "सूर्य" },
          { en: "Polaris", hi: "पोलारिस" }
        ],
        correctIndex: 2,
        difficulty: "beginner" as const
      },
      {
        id: 3,
        question: { en: "How many planets are in our Solar System?", hi: "हमारे सौर मंडल में कितने ग्रह हैं?" },
        options: [
          { en: "7", hi: "७" },
          { en: "8", hi: "८" },
          { en: "9", hi: "९" },
          { en: "10", hi: "१०" }
        ],
        correctIndex: 1,
        difficulty: "intermediate" as const
      },
      {
        id: 4,
        question: { en: "Which is the largest planet?", hi: "सबसे बड़ा ग्रह कौन सा है?" },
        options: [
          { en: "Earth", hi: "पृथ्वी" },
          { en: "Saturn", hi: "शनि" },
          { en: "Jupiter", hi: "बृहस्पति" },
          { en: "Neptune", hi: "वरुण" }
        ],
        correctIndex: 2,
        difficulty: "intermediate" as const
      },
      {
        id: 5,
        question: { en: "What protects Earth from harmful solar radiation?", hi: "पृथ्वी को हानिकारक सौर विकिरण से कौन बचाता है?" },
        options: [
          { en: "Ozone Layer", hi: "ओजोन परत" },
          { en: "Atmosphere", hi: "वायुमंडल" },
          { en: "Magnetic Field", hi: "चुंबकीय क्षेत्र" },
          { en: "All of the above", hi: "उपरोक्त सभी" }
        ],
        correctIndex: 3,
        difficulty: "advanced" as const
      }
    ]
  },
  {
    id: 2,
    topic: "Photosynthesis",
    questions: [
      {
        id: 1,
        question: { en: "What gas do plants absorb from the air?", hi: "पौधे हवा से कौन सी गैस अवशोषित करते हैं?" },
        options: [
          { en: "Oxygen", hi: "ऑक्सीजन" },
          { en: "Carbon Dioxide", hi: "कार्बन डाइऑक्साइड" },
          { en: "Nitrogen", hi: "नाइट्रोजन" },
          { en: "Hydrogen", hi: "हाइड्रोजन" }
        ],
        correctIndex: 1,
        difficulty: "beginner" as const
      },
      {
        id: 2,
        question: { en: "Which part of the plant does photosynthesis?", hi: "पौधे का कौन सा भाग प्रकाश संश्लेषण करता है?" },
        options: [
          { en: "Roots", hi: "जड़ें" },
          { en: "Stem", hi: "तना" },
          { en: "Leaves", hi: "पत्तियाँ" },
          { en: "Flowers", hi: "फूल" }
        ],
        correctIndex: 2,
        difficulty: "beginner" as const
      },
      {
        id: 3,
        question: { en: "What color pigment captures sunlight in leaves?", hi: "पत्तियों में सूर्य के प्रकाश को कौन सा रंगीन वर्णक पकड़ता है?" },
        options: [
          { en: "Red", hi: "लाल" },
          { en: "Blue", hi: "नीला" },
          { en: "Green (Chlorophyll)", hi: "हरा (क्लोरोफिल)" },
          { en: "Yellow", hi: "पीला" }
        ],
        correctIndex: 2,
        difficulty: "intermediate" as const
      },
      {
        id: 4,
        question: { en: "What is released as a by-product of photosynthesis?", hi: "प्रकाश संश्लेषण के उपोत्पाद के रूप में क्या निकलता है?" },
        options: [
          { en: "Carbon Dioxide", hi: "कार्बन डाइऑक्साइड" },
          { en: "Oxygen", hi: "ऑक्सीजन" },
          { en: "Nitrogen", hi: "नाइट्रोजन" },
          { en: "Methane", hi: "मीथेन" }
        ],
        correctIndex: 1,
        difficulty: "intermediate" as const
      },
      {
        id: 5,
        question: { en: "When do plants do photosynthesis?", hi: "पौधे प्रकाश संश्लेषण कब करते हैं?" },
        options: [
          { en: "Only at night", hi: "केवल रात में" },
          { en: "Only in winter", hi: "केवल सर्दियों में" },
          { en: "During daylight", hi: "दिन के समय" },
          { en: "Only in rain", hi: "केवल बारिश में" }
        ],
        correctIndex: 2,
        difficulty: "beginner" as const
      }
    ]
  }
];

export const translations = [
  { en: "The Earth revolves around the Sun", hi: "पृथ्वी सूर्य के चारों ओर घूमती है" },
  { en: "Water is essential for life", hi: "जीवन के लिए पानी आवश्यक है" },
  { en: "Plants need sunlight to grow", hi: "पौधों को बढ़ने के लिए सूर्य के प्रकाश की आवश्यकता होती है" },
  { en: "Education is the key to success", hi: "शिक्षा सफलता की कुंजी है" },
  { en: "Science helps us understand the world", hi: "विज्ञान हमें दुनिया को समझने में मदद करता है" }
];

export const activityGuides = [
  {
    id: 1,
    title: "Seed Germination Experiment",
    steps: [
      "Take a transparent glass jar and fill it with cotton",
      "Place 3-4 bean seeds between the glass and cotton",
      "Sprinkle water to moisten the cotton",
      "Keep the jar in a warm, sunny place",
      "Observe and record changes daily for 7 days"
    ],
    safety: ["Adult supervision required", "Do not overwater", "Handle glass carefully"],
    duration: "7 days",
    materials: ["Glass jar", "Cotton", "Bean seeds", "Water"]
  },
  {
    id: 2,
    title: "Water Filtration Experiment",
    steps: [
      "Cut the bottom of a plastic bottle",
      "Layer gravel, sand, and cotton cloth inside",
      "Pour muddy water through the top",
      "Observe the filtered water at the bottom",
      "Compare clarity before and after"
    ],
    safety: ["Do not drink the filtered water", "Wash hands after handling"],
    duration: "30 minutes",
    materials: ["Plastic bottle", "Gravel", "Sand", "Cotton cloth", "Muddy water"]
  }
];

export const badges = [
  { id: "first-quiz", name: "Quiz Starter", icon: "🎯", color: "#4F46E5", condition: "Complete your first quiz" },
  { id: "perfect-score", name: "Perfect Score", icon: "⭐", color: "#F59E0B", condition: "Get 100% in any quiz" },
  { id: "streak-3", name: "On Fire", icon: "🔥", color: "#EF4444", condition: "3-day learning streak" },
  { id: "streak-7", name: "Week Warrior", icon: "🏆", color: "#22C55E", condition: "7-day learning streak" },
  { id: "translator", name: "Bilingual", icon: "🌐", color: "#8B5CF6", condition: "Use translator 5 times" },
  { id: "explorer", name: "Explorer", icon: "🔍", color: "#06B6D4", condition: "Explore 3 different topics" }
];
