import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Play, Lightbulb, ChevronRight, RotateCcw } from "lucide-react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

const categoryLabels: Record<string, string> = {
  arrays: "Arrays",
  strings: "Strings",
  "linked-list": "Linked List",
  "stack-queue": "Stack & Queue",
  recursion: "Recursion",
  trees: "Trees",
  graphs: "Graphs",
  dp: "Dynamic Programming",
  "system-design": "System Design",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  hard: "bg-destructive/10 text-destructive border-destructive/20",
};

const Practice = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [output, setOutput] = useState("");

  const { data: problems } = useQuery({
    queryKey: ["problems", selectedCategory],
    queryFn: async () => {
      let query = supabase.from("coding_problems").select("*").order("difficulty");
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const selectProblem = (problem: any) => {
    setSelectedProblem(problem);
    const starterCode = problem.starter_code as Record<string, string> | null;
    setCode(starterCode?.[language] || `// ${problem.title}\n// Write your solution here\n`);
    setShowHints(false);
    setOutput("");
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (selectedProblem) {
      const starterCode = selectedProblem.starter_code as Record<string, string> | null;
      setCode(starterCode?.[lang] || `// Write your solution here\n`);
    }
  };

  const monacoLangMap: Record<string, string> = {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "cpp",
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Problem List Sidebar */}
      <div className="w-80 border-r border-border/50 flex flex-col bg-card/50 shrink-0 hidden lg:flex">
        <div className="p-4 border-b border-border/50">
          <h2 className="font-display font-bold text-lg mb-3">Problems</h2>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 overflow-y-auto">
          {problems?.map((problem) => (
            <button
              key={problem.id}
              onClick={() => selectProblem(problem)}
              className={`w-full text-left p-4 border-b border-border/30 hover:bg-secondary/50 transition-colors ${
                selectedProblem?.id === problem.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{problem.title}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${difficultyColors[problem.difficulty]}`}>
                  {problem.difficulty}
                </Badge>
                <span className="text-xs text-muted-foreground">{categoryLabels[problem.category]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {selectedProblem ? (
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Problem Description */}
          <div className="lg:w-2/5 border-r border-border/50 flex flex-col">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="font-display font-bold text-xl">{selectedProblem.title}</h1>
                <Badge variant="outline" className={difficultyColors[selectedProblem.difficulty]}>
                  {selectedProblem.difficulty}
                </Badge>
              </div>
              <Badge variant="secondary" className="text-xs">
                {categoryLabels[selectedProblem.category]}
              </Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <p className="text-sm leading-relaxed">{selectedProblem.description}</p>
              {selectedProblem.examples && (
                <div>
                  <h3 className="font-semibold text-sm mb-2">Examples:</h3>
                  <pre className="bg-secondary/50 rounded-lg p-3 text-xs font-mono whitespace-pre-wrap">
                    {selectedProblem.examples}
                  </pre>
                </div>
              )}
              {showHints && selectedProblem.hints?.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-primary" /> Hints
                  </h3>
                  <ul className="space-y-1">
                    {selectedProblem.hints.map((hint: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground">• {hint}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="gap-1"
              >
                <Lightbulb className="w-4 h-4" />
                {showHints ? "Hide Hints" : "Show Hints"}
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-border/50 bg-card/50">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const starterCode = selectedProblem.starter_code as Record<string, string> | null;
                    setCode(starterCode?.[language] || "");
                  }}
                  className="gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </Button>
                <Button
                  size="sm"
                  className="gradient-primary text-primary-foreground gap-1"
                  onClick={() => setOutput("✓ Code submitted successfully!\n\nNote: Code execution will be available with AI integration.")}
                >
                  <Play className="w-3 h-3" /> Run Code
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={monacoLangMap[language]}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>
            {output && (
              <div className="border-t border-border/50 bg-card/50 p-3 max-h-32 overflow-y-auto">
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{output}</pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <Code2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="font-display font-semibold text-xl mb-2">Select a Problem</h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              Choose a coding problem from the sidebar to start practicing
            </p>
            {/* Mobile category selector */}
            <div className="lg:hidden mt-6 space-y-3 max-w-sm mx-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {problems?.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => selectProblem(problem)}
                    className="w-full text-left p-3 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{problem.title}</span>
                      <Badge variant="outline" className={`text-xs ${difficultyColors[problem.difficulty]}`}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Practice;
