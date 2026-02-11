import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Code2, BarChart3, Users, Zap, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Interviews",
    description: "Realistic mock interviews with cross-questioning, behavioral rounds, and live coding observed by AI.",
  },
  {
    icon: Code2,
    title: "Coding Practice",
    description: "LeetCode-style problems across 9 categories with built-in Monaco editor, test cases, and hints.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Detailed score breakdowns, section reports, AI feedback, and downloadable PDF reports.",
  },
  {
    icon: Zap,
    title: "Multiple Languages",
    description: "Code in Java, Python, C++, or JavaScript with syntax highlighting and auto-completion.",
  },
  {
    icon: Shield,
    title: "Company Modes",
    description: "Practice with interview styles from top tech companies like Google, Amazon, and Meta.",
  },
  {
    icon: Users,
    title: "Progress Tracking",
    description: "Track your skills, solved problems, interview scores, and improvement over time.",
  },
];

const stats = [
  { value: "500+", label: "Coding Problems" },
  { value: "50+", label: "Interview Scenarios" },
  { value: "4", label: "Languages Supported" },
  { value: "9", label: "Topic Categories" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Interview Training</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black leading-tight mb-6">
              Ace Your Next{" "}
              <span className="gradient-text">Software</span>{" "}
              Interview
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Practice coding problems, simulate realistic AI interviews, and get detailed performance analysis. Your personal interview coach, available 24/7.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="gradient-primary text-primary-foreground glow-primary text-lg px-8 h-14 gap-2">
                  Start Training Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-display font-black gradient-text mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete platform designed to prepare you for every aspect of the software engineering interview process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-center mb-16">
            How It <span className="gradient-text">Works</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Practice Coding", desc: "Solve problems across 9 DSA categories with built-in code editor." },
              { step: "02", title: "Simulate Interviews", desc: "Face AI interviewers with intro, technical, coding, and HR rounds." },
              { step: "03", title: "Analyze & Improve", desc: "Get detailed scores, AI feedback, and track your progress over time." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-6xl font-display font-black gradient-text mb-4">{item.step}</div>
                <h3 className="font-display font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold mb-4">
            Ready to <span className="gradient-text">Level Up</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of developers who aced their interviews with AI-powered training.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="gradient-primary text-primary-foreground glow-primary text-lg px-10 h-14 gap-2">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm">AI Interview Trainer</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 AI Interview Trainer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
