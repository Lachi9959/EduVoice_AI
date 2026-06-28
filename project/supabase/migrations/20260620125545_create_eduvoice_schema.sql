/*
# EduVoice AI - Complete Database Schema

1. New Tables
- `lessons` - Stores AI-generated lesson twins (classroom replay system)
- `quizzes` - Stores generated quizzes with questions and answers
- `quiz_attempts` - Tracks student quiz attempts and scores
- `emotions` - Stores real-time emotion detection data from webcam
- `teams` - Classroom battle mode teams
- `team_members` - Student membership in teams
- `student_progress` - Personalized Learning DNA profiles
- `careers` - Future career information linked to topics
- `stories` - AI-generated comic stories for lessons
- `flashcards` - Exam mode flashcards and revision notes
- `badges` - Gamification badges earned by students
- `leaderboard` - Classroom battle rankings

2. Security
- Enable RLS on all tables
- Single-tenant policies (anon + authenticated) since this is a classroom demo app
*/

-- Lessons table (AI Classroom Twin)
CREATE TABLE IF NOT EXISTS lessons (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    topic text NOT NULL,
    grade text NOT NULL,
    explanation_en text,
    explanation_hi text,
    explanation_hinglish text,
    key_points jsonb DEFAULT '[]'::jsonb,
    fun_example jsonb,
    diagram_type text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    topic text NOT NULL,
    lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
    questions jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
    student_name text NOT NULL DEFAULT 'Anonymous',
    score integer NOT NULL DEFAULT 0,
    total_questions integer NOT NULL DEFAULT 0,
    accuracy integer NOT NULL DEFAULT 0,
    time_taken_seconds integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Emotion detection
CREATE TABLE IF NOT EXISTS emotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id text NOT NULL,
    student_name text NOT NULL DEFAULT 'Anonymous',
    emotion text NOT NULL CHECK (emotion IN ('understood', 'confused', 'bored', 'excited')),
    confidence numeric(3,2) NOT NULL DEFAULT 0.8,
    timestamp timestamptz DEFAULT now()
);

-- Teams (Classroom Battle Mode)
CREATE TABLE IF NOT EXISTS teams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    icon text NOT NULL DEFAULT '🔥',
    color text NOT NULL DEFAULT '#4F46E5',
    total_xp integer NOT NULL DEFAULT 0,
    coins integer NOT NULL DEFAULT 0,
    members_count integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
    student_name text NOT NULL,
    individual_xp integer NOT NULL DEFAULT 0,
    individual_coins integer NOT NULL DEFAULT 0,
    joined_at timestamptz DEFAULT now()
);

-- Student progress (Learning DNA)
CREATE TABLE IF NOT EXISTS student_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name text NOT NULL DEFAULT 'Anonymous',
    total_xp integer NOT NULL DEFAULT 0,
    streak_days integer NOT NULL DEFAULT 0,
    quizzes_taken integer NOT NULL DEFAULT 0,
    correct_answers integer NOT NULL DEFAULT 0,
    total_answers integer NOT NULL DEFAULT 0,
    strong_subjects jsonb DEFAULT '[]'::jsonb,
    weak_subjects jsonb DEFAULT '[]'::jsonb,
    learning_speed text DEFAULT 'normal',
    attention_score integer DEFAULT 80,
    career_goal text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Careers (Future Career Connector)
CREATE TABLE IF NOT EXISTS careers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    topic text NOT NULL,
    career_title text NOT NULL,
    description text,
    salary_range text,
    skills_needed jsonb DEFAULT '[]'::jsonb,
    colleges jsonb DEFAULT '[]'::jsonb,
    icon text DEFAULT '💼',
    created_at timestamptz DEFAULT now()
);

-- Stories (AI Story Generator)
CREATE TABLE IF NOT EXISTS stories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    topic text NOT NULL,
    title text NOT NULL,
    content jsonb NOT NULL DEFAULT '[]'::jsonb,
    characters jsonb DEFAULT '[]'::jsonb,
    moral text,
    created_at timestamptz DEFAULT now()
);

-- Flashcards (One-Click Exam Mode)
CREATE TABLE IF NOT EXISTS flashcards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    topic text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    difficulty text DEFAULT 'medium',
    tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_id text NOT NULL UNIQUE,
    name text NOT NULL,
    icon text NOT NULL,
    color text NOT NULL,
    condition text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Student badges
CREATE TABLE IF NOT EXISTS student_badges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name text NOT NULL DEFAULT 'Anonymous',
    badge_id text REFERENCES badges(badge_id) ON DELETE CASCADE,
    earned_at timestamptz DEFAULT now()
);

-- Leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name text NOT NULL,
    team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
    total_xp integer NOT NULL DEFAULT 0,
    quizzes_completed integer NOT NULL DEFAULT 0,
    accuracy integer NOT NULL DEFAULT 0,
    rank integer,
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Single-tenant policies (classroom demo - shared data)
DROP POLICY IF EXISTS "anon_select_lessons" ON lessons;
CREATE POLICY "anon_select_lessons" ON lessons FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_lessons" ON lessons;
CREATE POLICY "anon_insert_lessons" ON lessons FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_lessons" ON lessons;
CREATE POLICY "anon_update_lessons" ON lessons FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_quizzes" ON quizzes;
CREATE POLICY "anon_select_quizzes" ON quizzes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_quizzes" ON quizzes;
CREATE POLICY "anon_insert_quizzes" ON quizzes FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_quiz_attempts" ON quiz_attempts;
CREATE POLICY "anon_select_quiz_attempts" ON quiz_attempts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_quiz_attempts" ON quiz_attempts;
CREATE POLICY "anon_insert_quiz_attempts" ON quiz_attempts FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_emotions" ON emotions;
CREATE POLICY "anon_select_emotions" ON emotions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_emotions" ON emotions;
CREATE POLICY "anon_insert_emotions" ON emotions FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_teams" ON teams;
CREATE POLICY "anon_select_teams" ON teams FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_teams" ON teams;
CREATE POLICY "anon_insert_teams" ON teams FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_teams" ON teams;
CREATE POLICY "anon_update_teams" ON teams FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_team_members" ON team_members;
CREATE POLICY "anon_select_team_members" ON team_members FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_team_members" ON team_members;
CREATE POLICY "anon_insert_team_members" ON team_members FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_student_progress" ON student_progress;
CREATE POLICY "anon_select_student_progress" ON student_progress FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_student_progress" ON student_progress;
CREATE POLICY "anon_insert_student_progress" ON student_progress FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_student_progress" ON student_progress;
CREATE POLICY "anon_update_student_progress" ON student_progress FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_careers" ON careers;
CREATE POLICY "anon_select_careers" ON careers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_careers" ON careers;
CREATE POLICY "anon_insert_careers" ON careers FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_stories" ON stories;
CREATE POLICY "anon_select_stories" ON stories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_stories" ON stories;
CREATE POLICY "anon_insert_stories" ON stories FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_flashcards" ON flashcards;
CREATE POLICY "anon_select_flashcards" ON flashcards FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_flashcards" ON flashcards;
CREATE POLICY "anon_insert_flashcards" ON flashcards FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_badges" ON badges;
CREATE POLICY "anon_select_badges" ON badges FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_badges" ON badges;
CREATE POLICY "anon_insert_badges" ON badges FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_student_badges" ON student_badges;
CREATE POLICY "anon_select_student_badges" ON student_badges FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_student_badges" ON student_badges;
CREATE POLICY "anon_insert_student_badges" ON student_badges FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_leaderboard" ON leaderboard;
CREATE POLICY "anon_select_leaderboard" ON leaderboard FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_leaderboard" ON leaderboard;
CREATE POLICY "anon_insert_leaderboard" ON leaderboard FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_leaderboard" ON leaderboard;
CREATE POLICY "anon_update_leaderboard" ON leaderboard FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
