"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Rocket, 
  Zap, 
  Shield, 
  CreditCard,
  Database,
  Code,
  Clock,
  Star,
  ArrowRight,
  Check
} from 'lucide-react';

const RocketStartLanding = (): React.ReactElement => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Authentication & Security",
      description: "Complete auth system with social logins, email verification, and secure session management",
      color: "bg-primary",
      textColor: "text-white"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Stripe Payments",
      description: "Full payment integration with subscriptions, webhooks, and customer management",
      color: "bg-accent-orange",
      textColor: "text-white"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Supabase Backend",
      description: "Production-ready database with RLS policies, real-time features, and auto-scaling",
      color: "bg-accent-yellow",
      textColor: "text-neutral-dark"
    }
  ];

  const techStack = [
    { name: "Next.js 15", description: "Latest React framework" },
    { name: "TypeScript", description: "Type-safe development" },
    { name: "Tailwind CSS", description: "Modern styling" },
    { name: "Supabase", description: "Backend as a service" },
    { name: "Stripe", description: "Payment processing" },
    { name: "Resend", description: "Email delivery" }
  ];

  const whyChoose = [
    "No more 'authentication hell' - Google & email auth ready in 5 minutes",
    "Stripe payments & subscriptions that actually work (with webhooks!)",
    "Production-ready database with proper RLS security",
    "Save 2-4 weeks of boring setup work",
    "Built with 15+ years of real-world experience (not tutorials)",
    "Deploy to Vercel in one click"
  ];

  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <header className="bg-neutral-light shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-xl">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-text-dark">Rocket Start</span>
            </div>

            {/* Navigation - Single Page Sections */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-text hover:text-primary transition-colors">Features</a>
              <a href="#tech-stack" className="text-text hover:text-primary transition-colors">Tech Stack</a>
              <a href="#why-choose" className="text-text hover:text-primary transition-colors">Why Choose</a>
              <a href="#pricing" className="text-text hover:text-primary transition-colors">Pricing</a>
            </nav>

            {/* CTA Button */}
            <motion.a
              href="https://buy.stripe.com/test_7sYcN582T5L54nX05EgEg00"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-medium transition-colors inline-block"
            >
              Get RocketStart
            </motion.a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative min-h-[600px] flex flex-col justify-center">
            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute top-5 right-5 lg:top-10 lg:right-20 bg-neutral-dark text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg z-10"
            >
              100%
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <span className="bg-accent-green text-white px-4 py-1 rounded-full text-sm font-medium">
                WELCOME TO ROCKET START
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-black text-text-dark mb-6 leading-tight"
            >
              Ship your SaaS in
              <br />
              <span className="text-primary">days, not months</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-text-light max-w-2xl mx-auto mb-6"
            >
              Skip the boring stuff. Get a complete Next.js 15 + Supabase + Stripe boilerplate 
              built by a developer with 15+ years of experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm text-text-light mb-10 font-mono bg-neutral-light px-4 py-2 rounded-lg inline-block"
            >
              Next.js 15 + TypeScript + Supabase + Stripe + Tailwind CSS + Auth
            </motion.div>

            <motion.a
              href="https://buy.stripe.com/test_7sYcN582T5L54nX05EgEg00"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-neutral-dark hover:bg-neutral-darker text-white px-6 py-3 rounded-full font-medium inline-flex items-center space-x-2 w-fit mx-auto"
            >
              <span>Get RocketStart</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-8 lg:left-24 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-primary text-white px-4 py-2 rounded-lg transform -rotate-12 font-bold shadow-lg text-sm"
              >
                NEXT.JS
              </motion.div>
            </div>

            <div className="absolute top-1/3 right-8 lg:right-24 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-accent-orange text-white p-4 rounded-full shadow-lg"
              >
                <Zap className="w-6 h-6" />
              </motion.div>
            </div>

            <div className="absolute bottom-16 left-8 lg:left-16 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-accent-yellow text-neutral-dark px-4 py-2 rounded-lg font-bold shadow-lg flex items-center space-x-2 text-sm"
              >
                <span>TypeScript</span>
                <Code className="w-4 h-4" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-accent-orange text-white px-4 py-1 rounded-full text-sm font-medium">
              FEATURES
            </span>
            <h2 className="text-4xl font-bold text-text-dark mt-4 mb-4">
              Everything You Need to Build
            </h2>
            <p className="text-text-light text-lg">
              The complete stack that saves you months of development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group cursor-pointer"
              >
                <div className="bg-neutral-light rounded-2xl p-8 h-full relative overflow-hidden">
                  <div className={`${feature.color} ${feature.textColor} p-4 rounded-xl inline-flex mb-6`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-text-dark mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-text-light mb-6">
                    {feature.description}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className={`${feature.color} ${feature.textColor} px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2`}
                  >
                    <span>START HERE</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  {hoveredCard === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="why-choose" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="bg-accent-blue text-white px-4 py-1 rounded-full text-sm font-medium">
                WHY CHOOSE US
              </span>
              <h2 className="text-4xl font-bold text-text-dark mt-4 mb-6">
                Stop Wasting Time on Setup
              </h2>
              <p className="text-text-light text-lg mb-8">
                You know the drill: spend weeks setting up auth, payments, database, 
                emails... or just grab this battle-tested foundation and start building 
                your actual product.
              </p>

              <div className="space-y-4">
                {whyChoose.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="bg-secondary text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-text">{reason}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-accent-yellow p-8 rounded-2xl text-center"
              >
                <Clock className="w-16 h-16 text-neutral-dark mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-neutral-dark mb-2">2-4 Weeks</h3>
                <p className="text-neutral-dark">Development Time Saved</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-4 -right-4 bg-primary text-white p-4 rounded-xl"
              >
                <Star className="w-6 h-6" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Credibility Section */}
      <section className="py-20 bg-gradient-to-r from-neutral-light to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <div className="text-5xl mb-4">👨‍💻</div>
            <h3 className="text-2xl font-bold text-text-dark mb-4">
              Built by a Senior Full-Stack Developer
            </h3>
            <p className="text-text-light text-lg mb-6 max-w-2xl mx-auto">
              I've spent 15+ years building production SaaS applications, making every mistake 
              so you don't have to. This isn't some course project - it's battle-tested code 
              from real-world applications.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-text-light">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-text-light">Projects Shipped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-text-light">Production Ready</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-20 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-dark mb-4">
              Built with Modern Tech Stack
            </h2>
            <p className="text-text-light text-lg">
              Production-ready technologies that scale with your business
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-neutral-light border-2 border-gray-200 rounded-xl p-6 text-center hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-text-dark mb-1">{tech.name}</h3>
                <p className="text-sm text-text-light">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-text-dark mb-4">
              Simple, One-Time Payment
            </h2>
            <p className="text-text-light text-lg mb-12">
              No subscriptions, no hidden fees. Buy once, use forever.
            </p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-2 border-primary relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold">
                  🔥 LAUNCH OFFER
                </span>
              </div>
              
              <div className="mb-6">
                <div className="text-5xl font-black text-text-dark mb-2">
                  $97
                  <span className="text-lg font-normal text-text-light line-through ml-2">$197</span>
                </div>
                <p className="text-text-light">One-time payment • Unlimited projects</p>
              </div>
              
              <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
                {[
                  "Complete Next.js 15 + Supabase + Stripe setup",
                  "Authentication with Google & email",
                  "Payment processing & subscriptions",
                  "Production-ready database schema",
                  "Email templates & transactional emails",
                  "Deployment scripts & documentation",
                  "Lifetime updates"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-text">{feature}</span>
                  </div>
                ))}
              </div>
              
              <motion.a
                href="https://buy.stripe.com/test_7sYcN582T5L54nX05EgEg00"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 px-8 rounded-full font-bold text-lg mb-4 inline-block text-center"
              >
                Get RocketStart Now
              </motion.a>
              
              <p className="text-sm text-text-light">
                ⚡ Launch offer ends soon • 30-day money-back guarantee
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Stop Building From Scratch
            </h2>
            <p className="text-xl text-white/90 mb-8">
              While your competitors are still setting up authentication, 
              you'll already be building features that matter.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://buy.stripe.com/test_7sYcN582T5L54nX05EgEg00"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors inline-block text-center"
              >
                Get RocketStart for $97
              </motion.a>
              
              <motion.a
                href="#features"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-colors inline-block text-center"
              >
                See What's Included
              </motion.a>
            </div>
            
            <p className="text-sm text-white/80 mt-6">
              🔥 Launch offer • Save $100 • Ends soon
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-xl">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Rocket Start</span>
            </div>
            
            <p className="text-gray-400">
              © 2024 Rocket Start. Launch your SaaS faster.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RocketStartLanding;