/*
# Seed EduVoice AI Demo Data v2

1. Inserts sample data for all features with proper escaping.
*/

-- Seed badges
INSERT INTO badges (badge_id, name, icon, color, condition)
VALUES
  ('first-quiz', 'Quiz Starter', '🎯', '#4F46E5', 'Complete your first quiz'),
  ('perfect-score', 'Perfect Score', '⭐', '#F59E0B', 'Get 100% in any quiz'),
  ('streak-3', 'On Fire', '🔥', '#EF4444', '3-day learning streak'),
  ('streak-7', 'Week Warrior', '🏆', '#22C55E', '7-day learning streak'),
  ('translator', 'Bilingual', '🌐', '#8B5CF6', 'Use translator 5 times'),
  ('explorer', 'Explorer', '🔍', '#06B6D4', 'Explore 3 different topics'),
  ('team-player', 'Team Player', '👥', '#EC4899', 'Join a classroom team'),
  ('story-reader', 'Story Explorer', '📖', '#F97316', 'Read 3 AI stories'),
  ('career-dreamer', 'Dream Builder', '🚀', '#6366F1', 'Set a career goal'),
  ('flashcard-master', 'Flashcard Master', '🧠', '#14B8A6', 'Complete 10 flashcards')
ON CONFLICT (badge_id) DO NOTHING;

-- Seed teams for Classroom Battle Mode
INSERT INTO teams (name, icon, color, total_xp, coins, members_count)
VALUES
  ('Team Rocket', '🚀', '#EF4444', 2450, 120, 5),
  ('Team Thunder', '⚡', '#F59E0B', 2100, 95, 4),
  ('Team Ocean', '🌊', '#3B82F6', 1800, 80, 6),
  ('Team Forest', '🌲', '#22C55E', 1950, 85, 4)
ON CONFLICT DO NOTHING;

-- Seed careers for Future Career Connector
INSERT INTO careers (topic, career_title, description, salary_range, skills_needed, colleges, icon)
VALUES
  ('Photosynthesis', 'Agriculture Scientist', 'Research ways to improve crop yields and develop sustainable farming practices using knowledge of plant biology.', '6-15 LPA', '["Plant Biology", "Research Methods", "Data Analysis", "Soil Science"]', '["IARI New Delhi", "Punjab Agricultural University", "Tamil Nadu Agricultural University"]', '👨‍🌾'),
  ('Photosynthesis', 'Environmental Engineer', 'Design solutions for environmental problems including air/water pollution and sustainable energy systems.', '5-18 LPA', '["Chemistry", "Engineering", "Problem Solving", "Environmental Science"]', '["IIT Bombay", "IIT Delhi", "NIT Trichy"]', '🌍'),
  ('Photosynthesis', 'Biotechnologist', 'Use biological processes to develop new products and technologies in medicine, agriculture, and industry.', '4-20 LPA', '["Molecular Biology", "Genetics", "Lab Techniques", "Research"]', '["IISc Bangalore", "JNU Delhi", "BHU Varanasi"]', '🧬'),
  ('Solar System', 'Astrophysicist', 'Study the physics of the universe, including stars, planets, galaxies, and cosmic phenomena.', '8-25 LPA', '["Physics", "Mathematics", "Programming", "Data Analysis"]', '["IISc Bangalore", "IUCAA Pune", "ARIES Nainital"]', '🔭'),
  ('Solar System', 'Space Scientist', 'Work with ISRO or private space companies on satellite missions, rocket technology, and space exploration.', '6-20 LPA', '["Aerospace", "Mechanics", "Electronics", "Programming"]', '["IIST Thiruvananthapuram", "IIT Bombay", "IIT Madras"]', '🛰️'),
  ('Water Cycle', 'Hydrologist', 'Study water movement through the Earth crust and help manage water resources sustainably.', '5-16 LPA', '["Geology", "Data Analysis", "Climate Science", "GIS"]', '["IIT Roorkee", "NIH Roorkee", "Anna University"]', '💧'),
  ('Gravity', 'Data Scientist', 'Analyze complex data sets to extract insights and build predictive models for businesses and research.', '8-30 LPA', '["Mathematics", "Programming", "Statistics", "Machine Learning"]', '["IIT Bombay", "IIT Delhi", "IISc Bangalore", "BITS Pilani"]', '📊'),
  ('Gravity', 'Aerospace Engineer', 'Design aircraft, spacecraft, satellites, and missiles using principles of physics and engineering.', '6-22 LPA', '["Physics", "CAD", "Thermodynamics", "Materials"]', '["IIT Bombay", "IIT Kanpur", "IIST Thiruvananthapuram"]', '✈️')
ON CONFLICT DO NOTHING;

-- Seed stories for AI Story Generator
INSERT INTO stories (topic, title, content, characters, moral)
VALUES
  ('Gravity', 'Newton and the Falling Apple', 
   '[{"panel": 1, "text": "Once upon a time, young Isaac Newton sat under an apple tree, thinking about the stars...", "scene": "Apple tree in a garden"}, {"panel": 2, "text": "THUD! An apple fell right on his head! Ouch! cried Newton.", "scene": "Apple falling"}, {"panel": 3, "text": "But then he wondered: Why did the apple fall DOWN and not UP or sideways?", "scene": "Newton thinking"}, {"panel": 4, "text": "He realized: Everything pulls everything else! The Earth pulls the apple, and the apple pulls the Earth too!", "scene": "Earth and apple with arrows"}, {"panel": 5, "text": "This same force keeps the Moon orbiting Earth and planets orbiting the Sun! Newton exclaimed excitedly.", "scene": "Solar system with gravity lines"}, {"panel": 6, "text": "And that is how Newton discovered Gravity - the invisible force that holds our universe together!", "scene": "Newton celebrating"}]'::jsonb,
   '[{"name": "Newton", "role": "Curious Scientist", "avatar": "🧑‍🔬"}, {"name": "Apple", "role": "Falling Fruit", "avatar": "🍎"}, {"name": "Earth", "role": "Giant Planet", "avatar": "🌍"}]'::jsonb,
   'Curiosity and observation can lead to the greatest discoveries!'),
  
  ('Photosynthesis', 'The Leaf Factory Adventure',
   '[{"panel": 1, "text": "In the tiny Leaf Factory, worker Chlorophyll was getting ready for the day shift...", "scene": "Inside a leaf cell"}, {"panel": 2, "text": "Sunlight delivery arriving! shouted the guard at the gate. Golden rays poured in through the windows.", "scene": "Sunlight entering leaf"}, {"panel": 3, "text": "Chlorophyll grabbed the sunlight energy and mixed it with water from the roots and CO2 from the air.", "scene": "Mixing ingredients"}, {"panel": 4, "text": "Stir, stir, stir! went the chloroplast machines. We are making GLUCOSE - plant food!", "scene": "Factory machines working"}, {"panel": 5, "text": "As a bonus, the factory released fresh OXYGEN into the air! Free oxygen for everyone!", "scene": "Oxygen bubbles floating out"}, {"panel": 6, "text": "And that is how every leaf is a tiny food factory, feeding the plant and giving us the air we breathe!", "scene": "Happy plants and animals"}]'::jsonb,
   '[{"name": "Chlorophyll", "role": "Factory Worker", "avatar": "🟢"}, {"name": "Leaf", "role": "Food Factory", "avatar": "🍃"}, {"name": "Sun", "role": "Energy Supplier", "avatar": "☀️"}]'::jsonb,
   'Every small part of nature has an important job!'),

  ('Water Cycle', 'Droplets Big Journey',
   '[{"panel": 1, "text": "Little Droplet lived happily in the vast blue Ocean with millions of friends...", "scene": "Ocean with waves"}, {"panel": 2, "text": "One sunny day, Droplet felt warm and started floating UP into the sky! Wheee!", "scene": "Evaporation from ocean"}, {"panel": 3, "text": "Up in the clouds, Droplet met other droplets. We are getting heavy! they giggled, joining together.", "scene": "Clouds forming"}, {"panel": 4, "text": "SPLASH! They fell back to Earth as rain, landing on a green mountain. What a view! said Droplet.", "scene": "Rain falling on mountains"}, {"panel": 5, "text": "Droplet traveled down the mountain as a stream, then a river, saying hello to fish and plants along the way.", "scene": "River flowing"}, {"panel": 6, "text": "Finally, Droplet reached the Ocean again. See you next cycle! And the journey begins again!", "scene": "Back to ocean"}]'::jsonb,
   '[{"name": "Droplet", "role": "Water Molecule", "avatar": "💧"}, {"name": "Cloud", "role": "Sky Home", "avatar": "☁️"}, {"name": "River", "role": "Pathway", "avatar": "🌊"}]'::jsonb,
   'Natures cycles are beautiful and never-ending!')
ON CONFLICT DO NOTHING;

-- Seed flashcards for Exam Mode
INSERT INTO flashcards (topic, question, answer, difficulty, tags)
VALUES
  ('Photosynthesis', 'What gas do plants absorb during photosynthesis?', 'Carbon Dioxide (CO2)', 'easy', '["photosynthesis", "gases"]'),
  ('Photosynthesis', 'What is the green pigment in leaves called?', 'Chlorophyll', 'easy', '["photosynthesis", "pigments"]'),
  ('Photosynthesis', 'What are the 3 raw materials needed for photosynthesis?', 'Sunlight, Water, and Carbon Dioxide', 'medium', '["photosynthesis", "ingredients"]'),
  ('Photosynthesis', 'What is produced as a by-product of photosynthesis?', 'Oxygen', 'easy', '["photosynthesis", "output"]'),
  ('Solar System', 'Which planet is known as the Red Planet?', 'Mars', 'easy', '["solar-system", "planets"]'),
  ('Solar System', 'How many planets are in our Solar System?', 'Eight (8)', 'easy', '["solar-system", "count"]'),
  ('Solar System', 'What is the largest planet in our Solar System?', 'Jupiter', 'medium', '["solar-system", "planets"]'),
  ('Solar System', 'What protects Earth from harmful solar radiation?', 'The Ozone Layer and Magnetic Field', 'hard', '["solar-system", "earth"]'),
  ('Water Cycle', 'What is the process of water turning into vapor called?', 'Evaporation', 'easy', '["water-cycle", "processes"]'),
  ('Water Cycle', 'What forms when water vapor cools in the sky?', 'Clouds (through condensation)', 'medium', '["water-cycle", "clouds"]'),
  ('Gravity', 'Who discovered the law of gravity?', 'Isaac Newton', 'easy', '["gravity", "scientists"]'),
  ('Gravity', 'What does Newton law say about gravity?', 'Every object attracts every other object with a force proportional to their masses', 'hard', '["gravity", "laws"]')
ON CONFLICT DO NOTHING;

-- Seed sample lessons for Classroom Twin
INSERT INTO lessons (topic, grade, explanation_en, explanation_hi, explanation_hinglish, key_points, fun_example, diagram_type)
VALUES
  ('Photosynthesis', 'Class 7', 
   'Photosynthesis is how plants make their own food using sunlight, water, and carbon dioxide. The leaves act as tiny food factories!',
   'प्रकाश संश्लेषण वह प्रक्रिया है जिसमें पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड का उपयोग करके अपना भोजन बनाते हैं। पत्तियाँ छोटी खाद्य कारखाने हैं!',
   'Photosynthesis woh process hai jismein paudhe sooraj ki roshni, paani aur carbon dioxide ka use karke apna khana banate hain. Pattiyan chhoti food factories hain!',
   '[{"en": "Plants make their own food", "hi": "पौधे अपना भोजन बनाते हैं", "hinglish": "Paudhe apna khana banate hain"}, {"en": "Sunlight acts like a battery", "hi": "सूर्य का प्रकाश बैटरी की तरह काम करता है", "hinglish": "Sooraj ki roshni battery ki tarah kaam karti hai"}, {"en": "Leaves are mini food factories", "hi": "पत्तियाँ छोटी खाद्य कारखाने हैं", "hinglish": "Pattiyan chhoti food factories hain"}, {"en": "Oxygen is released as a by-product", "hi": "ऑक्सीजन उपोत्पाद के रूप में निकलती है", "hinglish": "Oxygen by-product ke roop mein nikalti hai"}]'::jsonb,
   '{"en": "Imagine the leaf as a solar-powered kitchen. The sun is the stove, water is the ingredient from roots, and CO2 is the spice from air!", "hi": "पत्ती को एक सौर ऊर्जा संचालित रसोई के रूप में कल्पना करें। सूर्य चूल्हा है, पानी जड़ों से सामग्री है, और CO2 हवा से मसाला है!", "hinglish": "Socho ki patti ek solar kitchen hai. Sooraj chulha hai, paani roots se aata hai, aur CO2 hawa se masala hai!"}'::jsonb,
   'photosynthesis'),

  ('Solar System', 'Class 6',
   'Our Solar System has the Sun at the center, with 8 planets orbiting around it. Earth is the 3rd planet and the only one with life!',
   'हमारा सौर मंडल सूर्य को केंद्र में रखता है, जिसके चारों ओर 8 ग्रह परिक्रमा करते हैं। पृथ्वी तीसरा ग्रह है और जीवन वाला एकमात्र ग्रह!',
   'Hamara Solar System mein Sooraj center mein hai, aur 8 planets uske chaaro taraf ghoomte hain. Prithvi teesra grah hai aur sirf yahin pe life hai!',
   '[{"en": "Sun is at the center", "hi": "सूर्य केंद्र में है", "hinglish": "Sooraj center mein hai"}, {"en": "8 planets orbit the Sun", "hi": "8 ग्रह सूर्य की परिक्रमा करते हैं", "hinglish": "8 planets Sooraj ke chaaro taraf ghoomte hain"}, {"en": "Earth is the 3rd planet", "hi": "पृथ्वी तीसरा ग्रह है", "hinglish": "Prithvi teesra grah hai"}, {"en": "Jupiter is the largest planet", "hi": "बृहस्पति सबसे बड़ा ग्रह है", "hinglish": "Brihaspati sabse bada grah hai"}]'::jsonb,
   '{"en": "If the Solar System was a family, the Sun is the parent and planets are children running around the house!", "hi": "यदि सौर मंडल एक परिवार हो, तो सूर्य माता-पिता हैं और ग्रह घर के चारों ओर दौड़ते बच्चे हैं!", "hinglish": "Agar Solar System ek family ho, toh Sooraj mummy-papa hain aur planets ghar ke chaaro taraf bhaagte bachche hain!"}'::jsonb,
   'solar-system')
ON CONFLICT DO NOTHING;

-- Seed leaderboard
INSERT INTO leaderboard (student_name, total_xp, quizzes_completed, accuracy, rank)
VALUES
  ('Rahul Sharma', 1250, 15, 92, 1),
  ('Priya Patel', 1100, 12, 88, 2),
  ('Amit Kumar', 980, 11, 85, 3),
  ('Sneha Gupta', 920, 10, 90, 4),
  ('Vikram Singh', 850, 9, 82, 5),
  ('Neha Reddy', 780, 8, 87, 6),
  ('Arjun Mehta', 720, 7, 80, 7),
  ('Divya Iyer', 650, 6, 85, 8)
ON CONFLICT DO NOTHING;
