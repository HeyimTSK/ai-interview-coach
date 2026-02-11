import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Code2, Brain, BarChart3, Target, TrendingUp, Award, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { name: "Arrays", count: 0, color: "from-cyan-500 to-teal-500" },
  { name: "Strings", count: 0, color: "from-blue-500 to-cyan-500" },
  { name: "Linked List", count: 0, color: "from-teal-500 to-green-500" },
  { name: "Stack/Queue", count: 0, color: "from-emerald-500 to-teal-500" },
  { name: "Trees", count: 0, color: "from-green-500 to-emerald-500" },
  { name: "Graphs", count: 0, color: "from-cyan-600 to-blue-500" },
  { name: "DP", count: 0, color: "from-teal-600 to-cyan-600" },
  { name: "Recursion", count: 0, color: "from-blue-600 to-teal-600" },
  { name: "System Design", count: 0, color: "from-emerald-600 to-teal-600" },
];

const Dashboard = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: recentSessions } = useQuery({
    queryKey: ["recent-sessions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interview_sessions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const quickStats = [
    {
      icon: Code2,
      label: "Problems Solved",
      value: profile?.problems_solved ?? 0,
      change: "+12 this week",
    },
    {
      icon: Brain,
      label: "Interviews Done",
      value: profile?.interviews_completed ?? 0,
      change: "+3 this week",
    },
    {
      icon: TrendingUp,
      label: "Avg Score",
      value: `${profile?.average_score ?? 0}/100`,
      change: "+5 pts",
    },
    {
      icon: Target,
      label: "Target Role",
      value: profile?.target_role ?? "Software Engineer",
      change: profile?.experience_level ?? "Mid Level",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-1">
          Welcome back, <span className="gradient-text">{profile?.full_name || user?.email?.split("@")[0]}</span>
        </h1>
        <p className="text-muted-foreground mb-8">Here's your training overview</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-display font-bold">{stat.value}</div>
            <div className="text-muted-foreground text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-xl p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link to="/practice">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer group">
                  <Code2 className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">Practice Coding</h3>
                  <p className="text-sm text-muted-foreground mb-3">Solve DSA problems with built-in editor</p>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
              <Link to="/interview">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer group">
                  <Brain className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">Start Interview</h3>
                  <p className="text-sm text-muted-foreground mb-3">Full AI-powered mock interview</p>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Begin <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Category Progress */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Category Progress</h2>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div key={cat.name} className="p-3 rounded-lg bg-secondary/50 text-center">
                  <div className="text-sm font-medium mb-1">{cat.name}</div>
                  <div className="text-xs text-muted-foreground">{cat.count} solved</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-xl p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Recent Interviews</h2>
          {recentSessions && recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div key={session.id} className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{session.session_type}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(session.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {session.overall_score && (
                    <div className="flex items-center gap-2">
                      <Progress value={Number(session.overall_score)} className="h-2 flex-1" />
                      <span className="text-sm font-mono font-medium">{Math.round(Number(session.overall_score))}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No interviews yet</p>
              <Link to="/interview">
                <Button size="sm" className="mt-3 gradient-primary text-primary-foreground">
                  Start Your First
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
