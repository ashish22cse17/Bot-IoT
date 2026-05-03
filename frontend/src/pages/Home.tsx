import { Shield, Cpu, Lock, Wifi, AlertTriangle, Target, Server } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Protecting IoT Networks with Machine Learning';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Wifi,
      title: 'IoT Vulnerability',
      description: 'IoT devices often lack robust security measures, making them prime targets for cyber attacks.',
    },
    {
      icon: AlertTriangle,
      title: 'Growing Threats',
      description: 'With billions of connected devices, the attack surface for malicious actors continues to expand.',
    },
    {
      icon: Shield,
      title: 'Intrusion Detection',
      description: 'IDS monitors network traffic to identify suspicious patterns and potential security breaches.',
    },
    {
      icon: Target,
      title: 'ML-Based Detection',
      description: 'Machine learning enables real-time identification of novel attack patterns and zero-day threats.',
    },
    {
      icon: Server,
      title: 'Network Protection',
      description: 'Comprehensive monitoring of network traffic to detect and prevent unauthorized access.',
    },
    {
      icon: Lock,
      title: 'Secure IoT Ecosystem',
      description: 'Building resilient IoT networks through intelligent threat detection and prevention.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-grid">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-magenta/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Cpu className="absolute top-20 left-[10%] w-8 h-8 text-primary/30 animate-float" />
          <Lock className="absolute top-32 right-[15%] w-10 h-10 text-neon-green/30 animate-float" style={{ animationDelay: '0.5s' }} />
          <Wifi className="absolute bottom-32 left-[20%] w-8 h-8 text-neon-magenta/30 animate-float" style={{ animationDelay: '1s' }} />
          <Shield className="absolute bottom-40 right-[10%] w-12 h-12 text-primary/20 animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 text-center relative z-10 pt-16">
          <div className="fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-sm font-mono text-primary">College Project - 8th Semester</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-foreground">Smart </span>
              <span className="gradient-text">IoT Intrusion</span>
              <br />
              <span className="text-foreground">Detection System</span>
            </h1>

            {/* Subtitle with Typing Effect */}
            <div className="h-8 mb-8">
              <p className="font-mono text-lg md:text-xl text-primary neon-text-cyan">
                {typedText}
                <span className="animate-pulse">_</span>
              </p>
            </div>

            {/* Algorithms Badge */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <span className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary font-mono text-sm neon-border-cyan">
                Random Forest
              </span>
              <span className="px-4 py-2 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green font-mono text-sm neon-border-green">
                Support Vector Machine
              </span>
            </div>

            {/* Student Info */}
            <div className="cyber-card inline-block px-8 py-6 mb-12">
              <p className="text-lg font-semibold text-foreground mb-2">Guide By: DR. SUDHIR KR. PANDEY</p>
              <p className="text-muted-foreground text-sm">Department of Computer Science & Engineering</p>
              <p className="text-primary text-sm font-mono mt-2">LNJPIT, Chapra</p>
              
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="neon-border-cyan">
                <Link to="/system">Explore System</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">Try Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Intro Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16 fade-in-up">
            <span className="font-mono text-primary text-sm tracking-wider uppercase mb-4 block">
              [ Introduction ]
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Understanding <span className="gradient-text">IoT Security</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              An intelligent approach to protecting Internet of Things networks from malicious intrusions using advanced machine learning algorithms.
            </p>
          </div>

          {/* What is IoT IDS */}
          <div className="cyber-card p-8 md:p-12 mb-16 fade-in-up stagger-1 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display text-2xl font-bold mb-4 text-primary neon-text-cyan">
                  What is IoT Intrusion Detection?
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  An Intrusion Detection System (IDS) for IoT is a security solution that monitors network traffic and device behavior to identify potential security threats, unauthorized access attempts, and malicious activities targeting IoT devices and networks.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Unlike traditional security systems, IoT-specific IDS must handle the unique challenges of resource-constrained devices, diverse protocols, and the massive scale of connected ecosystems.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent flex items-center justify-center">
                  <Shield className="w-32 h-32 text-primary/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border border-primary/20 rounded-full animate-pulse" />
                    <div className="absolute w-64 h-64 border border-neon-green/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute w-80 h-80 border border-neon-magenta/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`cyber-card p-6 hover-lift fade-in-up stagger-${(index % 5) + 1}`}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Purpose Section */}
          <div className="mt-16 text-center fade-in-up">
            <div className="inline-block cyber-card px-8 py-6">
              <h3 className="font-display text-xl font-bold mb-3 text-neon-green neon-text-green">
                Purpose of This Project
              </h3>
              <p className="text-muted-foreground max-w-xl">
                To develop an efficient, lightweight intrusion detection system using Random Forest and SVM algorithms that can effectively identify and classify various types of cyber attacks in IoT environments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
