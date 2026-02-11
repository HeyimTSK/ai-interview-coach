import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, TrendingUp, Calendar, Brain } from "lucide-react";
import { motion } from "framer-motion";

const Reports = () => {
  const { user } = useAuth();

  const { data: sessions } = useQuery({
    queryKey: ["all-sessions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const avgScore = sessions?.length
    ? sessions.reduce((acc, s) => acc + (Number(s.overall_score) || 0), 0) / sessions.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Performance Reports</h1>
            <p className="text-muted-foreground">Track your interview performance over time</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-xl p-5 text-center">
          <div className="text-4xl font-display font-black gradient-text mb-1">
            {Math.round(avgScore)}
          </div>
          <div className="text-muted-foreground text-sm">Average Score</div>
        </div>
        <div className="glass rounded-xl p-5 text-center">
          <div className="text-4xl font-display font-black gradient-text mb-1">
            {sessions?.length || 0}
          </div>
          <div className="text-muted-foreground text-sm">Total Interviews</div>
        </div>
        <div className="glass rounded-xl p-5 text-center">
          <div className="text-4xl font-display font-black gradient-text mb-1">
            {sessions?.filter(s => s.status === 'completed').length || 0}
          </div>
          <div className="text-muted-foreground text-sm">Completed</div>
        </div>
      </div>

      {/* Skill Breakdown */}
      <div className="glass rounded-xl p-6 mb-8">
        <h2 className="font-display font-semibold text-lg mb-4">Skill Breakdown</h2>
        <div className="space-y-4">
          {[
            { name: "Introduction & Communication", score: 72 },
            { name: "Technical Knowledge", score: 65 },
            { name: "Coding & Problem Solving", score: 78 },
            { name: "Behavioral & Soft Skills", score: 80 },
            { name: "System Design", score: 55 },
          ].map((skill) => (
            <div key={skill.name} className="flex items-center gap-4">
              <span className="text-sm w-52 shrink-0">{skill.name}</span>
              <Progress value={skill.score} className="h-3 flex-1" />
              <span className="text-sm font-mono font-medium w-10 text-right">{skill.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Session History */}
      <div className="glass rounded-xl p-6">
        <h2 className="font-display font-semibold text-lg mb-4">Interview History</h2>
        {sessions && sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm capitalize">{session.session_type} Interview</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(session.created_at).toLocaleDateString()}
                    {session.company_mode && (
                      <Badge variant="secondary" className="text-xs">{session.company_mode}</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-display font-bold">
                    {session.overall_score ? Math.round(Number(session.overall_score)) : "—"}
                  </div>
                  <Badge
                    variant="outline"
                    className={session.status === "completed" ? "text-success border-success/30" : "text-warning border-warning/30"}
                  >
                    {session.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No interviews completed yet</p>
            <p className="text-sm">Complete an AI interview to see your reports here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
