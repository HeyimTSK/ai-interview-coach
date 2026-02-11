
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  target_role TEXT DEFAULT 'Software Engineer',
  experience_level TEXT DEFAULT 'mid' CHECK (experience_level IN ('junior', 'mid', 'senior', 'lead')),
  skills TEXT[] DEFAULT '{}',
  problems_solved INTEGER DEFAULT 0,
  interviews_completed INTEGER DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create interview_sessions table
CREATE TABLE public.interview_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('full', 'technical', 'behavioral', 'coding')),
  company_mode TEXT,
  overall_score NUMERIC(5,2),
  intro_score NUMERIC(5,2),
  technical_score NUMERIC(5,2),
  coding_score NUMERIC(5,2),
  behavioral_score NUMERIC(5,2),
  feedback TEXT,
  duration_minutes INTEGER,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions" ON public.interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON public.interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.interview_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Create coding_problems table (public read)
CREATE TABLE public.coding_problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('arrays', 'strings', 'linked-list', 'stack-queue', 'recursion', 'trees', 'graphs', 'dp', 'system-design')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  examples TEXT,
  constraints TEXT,
  starter_code JSONB DEFAULT '{}',
  test_cases JSONB DEFAULT '[]',
  hints TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coding_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view problems" ON public.coding_problems FOR SELECT USING (true);

-- Create user_submissions table
CREATE TABLE public.user_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  problem_id UUID REFERENCES public.coding_problems(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'wrong_answer', 'error')),
  runtime_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own submissions" ON public.user_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own submissions" ON public.user_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed some coding problems
INSERT INTO public.coding_problems (title, description, category, difficulty, examples, hints, starter_code) VALUES
('Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'arrays', 'easy', 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]', ARRAY['Try using a hash map', 'One pass solution exists'], '{"python": "def twoSum(nums, target):\n    pass", "javascript": "function twoSum(nums, target) {\n    \n}", "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}", "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};"}'),
('Valid Parentheses', 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.', 'stack-queue', 'easy', 'Input: s = "()[]{}"\nOutput: true', ARRAY['Use a stack', 'Match closing brackets with the top of stack'], '{"python": "def isValid(s):\n    pass", "javascript": "function isValid(s) {\n    \n}"}'),
('Reverse Linked List', 'Given the head of a singly linked list, reverse the list, and return the reversed list.', 'linked-list', 'easy', 'Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]', ARRAY['Use three pointers', 'Can also be done recursively'], '{"python": "def reverseList(head):\n    pass", "javascript": "function reverseList(head) {\n    \n}"}'),
('Maximum Subarray', 'Given an integer array nums, find the subarray with the largest sum, and return its sum.', 'arrays', 'medium', 'Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6', ARRAY['Kadanes algorithm', 'Track current sum and max sum'], '{"python": "def maxSubArray(nums):\n    pass", "javascript": "function maxSubArray(nums) {\n    \n}"}'),
('Binary Tree Inorder Traversal', 'Given the root of a binary tree, return the inorder traversal of its nodes values.', 'trees', 'easy', 'Input: root = [1,null,2,3]\nOutput: [1,3,2]', ARRAY['Left, Root, Right', 'Can be done iteratively with a stack'], '{"python": "def inorderTraversal(root):\n    pass", "javascript": "function inorderTraversal(root) {\n    \n}"}'),
('Climbing Stairs', 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?', 'dp', 'easy', 'Input: n = 3\nOutput: 3', ARRAY['This is a Fibonacci-like problem', 'dp[i] = dp[i-1] + dp[i-2]'], '{"python": "def climbStairs(n):\n    pass", "javascript": "function climbStairs(n) {\n    \n}"}'),
('Letter Combinations of a Phone Number', 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.', 'recursion', 'medium', 'Input: digits = "23"\nOutput: ["ad","ae","af","bd","be","bf","cd","ce","cf"]', ARRAY['Use backtracking', 'Map digits to letters first'], '{"python": "def letterCombinations(digits):\n    pass", "javascript": "function letterCombinations(digits) {\n    \n}"}'),
('Number of Islands', 'Given an m x n 2D binary grid which represents a map of 1s (land) and 0s (water), return the number of islands.', 'graphs', 'medium', 'Input: grid = [["1","1","0"],["1","1","0"],["0","0","1"]]\nOutput: 2', ARRAY['Use BFS or DFS', 'Mark visited cells'], '{"python": "def numIslands(grid):\n    pass", "javascript": "function numIslands(grid) {\n    \n}"}'),
('Longest Common Subsequence', 'Given two strings text1 and text2, return the length of their longest common subsequence.', 'dp', 'medium', 'Input: text1 = "abcde", text2 = "ace"\nOutput: 3', ARRAY['Use 2D DP table', 'Compare characters one by one'], '{"python": "def longestCommonSubsequence(text1, text2):\n    pass", "javascript": "function longestCommonSubsequence(text1, text2) {\n    \n}"}'),
('Design URL Shortener', 'Design a URL shortening service like TinyURL. Implement encode and decode methods.', 'system-design', 'medium', 'encode("https://example.com/long") -> "http://tiny.url/abc"\ndecode("http://tiny.url/abc") -> "https://example.com/long"', ARRAY['Think about hash functions', 'Consider collision handling'], '{"python": "class URLShortener:\n    def encode(self, url):\n        pass\n    def decode(self, short):\n        pass", "javascript": "class URLShortener {\n    encode(url) {\n    }\n    decode(short) {\n    }\n}"}');
