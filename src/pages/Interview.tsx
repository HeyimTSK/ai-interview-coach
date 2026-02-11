import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Brain, Play, Timer, Mic, Code2, Users, CheckCircle2, ArrowRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type InterviewStage = "setup" | "intro" | "technical" | "coding" | "behavioral" | "complete";

const stages: { key: InterviewStage; label: string; icon: any; description: string }[] = [
  { key: "intro", label: "Introduction", icon: Users, description: "Tell us about yourself" },
  { key: "technical", label: "Technical Q&A", icon: Brain, description: "DSA & system design questions" },
  { key: "coding", label: "Live Coding", icon: Code2, description: "Solve a problem in real-time" },
  { key: "behavioral", label: "Behavioral/HR", icon: Users, description: "Situational and cultural questions" },
];

const companies = ["General", "Google", "Amazon", "Meta", "Microsoft", "Apple", "Netflix"];

const Interview = () => {
  const [stage, setStage] = useState<InterviewStage>("setup");
  const [company, setCompany] = useState("General");
  const [difficulty, setDifficulty] = useState("medium");
  const [timer, setTimer] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const startInterview = () => {
    setStage("intro");
    setCurrentStageIndex(0);
  };

  const nextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
      setStage(stages[currentStageIndex + 1].key);
    } else {
      setStage("complete");
    }
  };

  const progress = stage === "setup" ? 0 : stage === "complete" ? 100 : ((currentStageIndex + 1) / stages.length) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {stage === "setup" ? (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">AI Interview Simulation</h1>
              <p className="text-muted-foreground">
                Experience a realistic 4-round interview with AI-powered cross-questioning
              </p>
            </div>

            <div className="glass rounded-2xl p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Mode</label>
                  <Select value={company} onValueChange={setCompany}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {companies.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3">Interview Rounds</h3>
                <div className="space-y-2">
                  {stages.map((s, i) => (
                    <div key={s.key} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-mono font-bold text-primary">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{s.label}</div>
                        <div className="text-xs text-muted-foreground">{s.description}</div>
                      </div>
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full gradient-primary text-primary-foreground h-12 text-lg gap-2"
                onClick={startInterview}
              >
                <Play className="w-5 h-5" /> Start Interview
              </Button>
            </div>
          </motion.div>
        </div>
      ) : stage === "complete" ? (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 glow-primary">
              <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">Interview Complete!</h1>
            <p className="text-muted-foreground mb-8">Your performance is being analyzed by AI</p>
            <div className="glass rounded-2xl p-8 text-left space-y-4">
              <div className="text-center">
                <div className="text-5xl font-display font-black gradient-text mb-1">78</div>
                <div className="text-muted-foreground text-sm">Overall Score</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stages.map((s) => (
                  <div key={s.key} className="p-3 rounded-lg bg-secondary/50">
                    <div className="text-sm font-medium mb-1">{s.label}</div>
                    <Progress value={65 + Math.random() * 30} className="h-2" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStage("setup")}>
                  Try Again
                </Button>
                <Button className="flex-1 gradient-primary text-primary-foreground" onClick={() => window.location.href = "/reports"}>
                  View Full Report
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          {/* Top bar */}
          <div className="border-b border-border/50 bg-card/50 px-4 py-3">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gradient-primary text-primary-foreground border-0">
                  Round {currentStageIndex + 1}/{stages.length}
                </Badge>
                <span className="font-display font-semibold">{stages[currentStageIndex].label}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Timer className="w-4 h-4" />
                  <span className="font-mono text-sm">15:00</span>
                </div>
                <Progress value={progress} className="w-32 h-2" />
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 container mx-auto px-4 py-6 max-w-3xl overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm p-4 max-w-lg">
                    <p className="text-sm">
                      {stage === "intro" && "Hello! Welcome to your interview. Let's start with an introduction. Could you tell me about yourself, your background, and what interests you about this role?"}
                      {stage === "technical" && "Great introduction! Now let's move to the technical round. Can you explain the difference between a stack and a queue? When would you use one over the other?"}
                      {stage === "coding" && "Excellent! Now for the live coding round. I'll give you a problem and observe your approach. Please think aloud as you solve it. Here's your problem: Given an array of integers, find two numbers that add up to a target sum."}
                      {stage === "behavioral" && "Well done on the coding! Final round - behavioral questions. Tell me about a time when you faced a challenging technical problem at work. How did you approach it and what was the outcome?"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="border-t border-border/50 bg-card/50 p-4">
            <div className="container mx-auto max-w-3xl flex gap-3">
              <textarea
                placeholder="Type your response..."
                className="flex-1 bg-secondary/50 border border-border/50 rounded-xl p-3 text-sm resize-none h-12 focus:h-24 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button className="gradient-primary text-primary-foreground shrink-0" onClick={nextStage}>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;
