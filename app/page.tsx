'use client';

import Link from 'next/link';
import { ArrowRight, Users, Shield, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-main-gradient overflow-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 px-6 py-4 glass-panel border-0 border-b border-glass-border rounded-none top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">T</div>
            <span className="text-xl font-bold text-white">TALENTHUB</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors py-2 px-4">Login</Link>
            <Link href="/signup" className="glass-btn glass-btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Recruitment</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            AI-powered candidate tracking, real-time analytics, and a premium experience for modern hiring teams.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="glass-btn glass-btn-primary text-lg px-8 py-4 flex items-center gap-2">
              Start Hiring Now <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="glass-btn px-8 py-4 text-lg">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Users}
            title="Smart Candidate Tracking"
            desc="Manage your pipeline with our intuitive kanban-style glassmorphic interface."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Real-time Analytics"
            desc="Visualize hiring metrics, conversion rates, and time-to-hire in real high-definition."
          />
          <FeatureCard
            icon={Shield}
            title="Secure & Compliant"
            desc="Enterprise-grade security with JWT authentication and encrypted data storage."
          />
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

function FeatureCard({ icon: Icon, title, desc }: FeatureCardProps) {
  return (
    <div className="glass-panel p-8 hover:-translate-y-2 transition-transform duration-300">
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-primary">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}
