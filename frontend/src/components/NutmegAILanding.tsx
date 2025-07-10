"use client";

import React, { useRef, useState, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Play, MessageCircle, Zap, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Spline = lazy(() => import('@splinetool/react-spline'));

const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

function FootballSplineBackground() {
  // Use fallback by default due to common Spline loading issues
  const [useSpline] = useState(false);

  const fallbackBackground = (
    <div className="w-full h-full relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0" style={{ backgroundColor: '#191a1a' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        
        {/* Additional animated gradients */}
        <motion.div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(135deg, rgba(32, 184, 205, 0.1) 0%, transparent 50%, rgba(32, 184, 205, 0.05) 100%)'
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      {/* Animated football field pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-x-0 top-1/2 h-px bg-white transform -translate-y-1/2"></div>
        <div className="absolute left-1/2 inset-y-0 w-px bg-white transform -translate-x-1/2"></div>
        <motion.div 
          className="absolute left-1/2 top-1/2 w-32 h-32 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute left-4 top-1/2 w-16 h-24 border-2 border-white transform -translate-y-1/2"></div>
        <div className="absolute right-4 top-1/2 w-16 h-24 border-2 border-white transform -translate-y-1/2"></div>
        
        {/* Corner arcs */}
        <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white border-b-0 border-r-0 rounded-tl-full"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white border-b-0 border-l-0 rounded-tr-full"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-white border-t-0 border-r-0 rounded-bl-full"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-white border-t-0 border-l-0 rounded-br-full"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: 'rgba(32, 184, 205, 0.3)',
              left: `${15 + (Math.random() * 70)}%`,
              top: `${15 + (Math.random() * 70)}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
        
        {/* Football icons */}
        <motion.div
          className="absolute text-4xl"
          style={{ left: "20%", top: "30%" }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ⚽
        </motion.div>
        
        <motion.div
          className="absolute text-3xl"
          style={{ right: "25%", top: "60%" }}
          animate={{
            rotate: [360, 0],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🥅
        </motion.div>
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      pointerEvents: 'auto',
      overflow: 'hidden',
    }}>
      {useSpline ? (
        <Suspense fallback={fallbackBackground}>
          <Spline
            style={{
              width: '100%',
              height: '100vh',
              pointerEvents: 'auto',
            }}
            scene="https://prod.spline.design/6Wq1Q3yNyDKUeJJd/scene.splinecode"
          />
        </Suspense>
      ) : (
        fallbackBackground
      )}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.7), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.7)),
            linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.8))
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function FloatingFootballElements() {
  const footballParticles = Array.from({ length: 8 }).map((_, index) => (
    <motion.div
      key={index}
      className="absolute text-green-400/60 text-2xl"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.5, 1.2, 0.5],
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150,
        rotate: [0, 360]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        delay: index * 1.2,
        ease: "easeInOut",
      }}
    >
      ⚽
    </motion.div>
  ));

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {footballParticles}
      <motion.div
        className="absolute top-20 right-20 text-green-400/40 text-6xl"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        🥅
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-16 text-emerald-400/40 text-5xl"
        animate={{ y: [-15, 15, -15], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        🏆
      </motion.div>
    </div>
  );
}

function HeroContent() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="text-white px-4 max-w-screen-xl mx-auto w-full flex flex-col lg:flex-row justify-between items-start lg:items-center py-16">
      <div className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-8 lg:mb-0">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-4"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'rgba(32, 184, 205, 0.2)', 
                  borderColor: 'rgba(32, 184, 205, 0.3)', 
                  color: '#20B8CD' 
                }}>
            <Zap className="w-4 h-4 mr-2" />
            ⚽ AI-Powered Football Intelligence
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-wide"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.span
            className="bg-clip-text text-transparent"
            style={{ 
              background: 'linear-gradient(135deg, #20B8CD 0%, #60A5FA 50%, #20B8CD 100%)',
              WebkitBackgroundClip: 'text'
            }}
            animate={isHovered ? {
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            NutmegAI
          </motion.span>
          <br />
          <span style={{ color: '#FCFAF6' }}>Your Ultimate</span>
          <br />
          <span style={{ color: '#FCFAF6' }}>Football Companion</span>
        </motion.h1>

        <motion.div
          className="text-sm opacity-90 mt-4 flex items-center space-x-4"
          style={{ color: 'rgba(32, 184, 205, 0.8)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <span className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            AI CHAT
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Target className="w-4 h-4 mr-1" />
            LIVE STATS
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            COMMUNITY
          </span>
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 pl-0 lg:pl-8 flex flex-col items-start">
        <motion.p
          className="text-base sm:text-lg opacity-80 mb-8 max-w-md leading-relaxed"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          From Messi's magic to tactical masterclasses - get instant insights, live match analysis, 
          player stats, and tactical breakdowns. Chat with the smartest football AI that knows 
          everything about the beautiful game.
        </motion.p>

        <motion.div
          className="flex pointer-events-auto flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link to="/chat">
            <Button
              size="lg"
              className="font-semibold py-4 px-8 rounded-2xl transition-all duration-300 w-full sm:w-auto border-0 shadow-lg hover:shadow-xl hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #20B8CD 0%, #1A9CB8 100%)',
                color: '#191a1a'
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chatting
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="border-2 backdrop-blur-sm font-semibold py-4 px-8 rounded-2xl transition-all duration-300 w-full sm:w-auto hover:scale-105"
            style={{
              borderColor: 'rgba(32, 184, 205, 0.5)',
              backgroundColor: 'rgba(32, 184, 205, 0.1)',
              color: '#FCFAF6'
            }}
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </motion.div>

        <motion.div
          className="mt-8 grid grid-cols-3 gap-6 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#20B8CD' }}>50K+</div>
            <div className="text-xs" style={{ color: 'rgba(252, 250, 246, 0.6)' }}>Football Fans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#20B8CD' }}>1M+</div>
            <div className="text-xs" style={{ color: 'rgba(252, 250, 246, 0.6)' }}>Goals Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#20B8CD' }}>24/7</div>
            <div className="text-xs" style={{ color: 'rgba(252, 250, 246, 0.6)' }}>Match Coverage</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Navbar() {

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-20 border-b"
      style={{
        backgroundColor: 'rgba(25, 26, 26, 0.9)',
        borderBottomColor: 'rgba(32, 184, 205, 0.2)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8 flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
               style={{ background: 'linear-gradient(135deg, #20B8CD 0%, #1A9CB8 100%)' }}>
            ⚽
          </div>
          <span className="font-bold text-xl" style={{ color: '#FCFAF6' }}>NutmegAI</span>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          <button className="text-sm transition duration-300" 
                  style={{ color: 'rgba(252, 250, 246, 0.8)' }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#20B8CD'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = 'rgba(252, 250, 246, 0.8)'}>
            Live Scores
          </button>
          <button className="text-sm transition duration-300" 
                  style={{ color: 'rgba(252, 250, 246, 0.8)' }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#20B8CD'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = 'rgba(252, 250, 246, 0.8)'}>
            Player Stats
          </button>
          <button className="text-sm transition duration-300" 
                  style={{ color: 'rgba(252, 250, 246, 0.8)' }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#20B8CD'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = 'rgba(252, 250, 246, 0.8)'}>
            Tactics
          </button>
          <button className="text-sm transition duration-300" 
                  style={{ color: 'rgba(252, 250, 246, 0.8)' }}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#20B8CD'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = 'rgba(252, 250, 246, 0.8)'}>
            Transfers
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="hidden sm:flex border-0"
            style={{ 
              color: '#FCFAF6',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.color = '#20B8CD';
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(32, 184, 205, 0.1)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.color = '#FCFAF6';
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Sign In
          </Button>
          <Link to="/chat">
            <Button
              className="border-0"
              style={{
                background: 'linear-gradient(135deg, #20B8CD 0%, #1A9CB8 100%)',
                color: '#191a1a'
              }}
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function FeatureShowcase() {
  const features = [
    {
      icon: <div className="text-3xl">🧠⚽</div>,
      title: "Football Oracle",
      description: "Ask about Ronaldo vs Messi, tactical formations, or latest transfers"
    },
    {
      icon: <div className="text-3xl">📊⚽</div>,
      title: "Match Intelligence",
      description: "Real-time analysis of dribbles, passes, shots, and tactical movements"
    },
    {
      icon: <div className="text-3xl">🔮🏆</div>,
      title: "Victory Predictor",
      description: "AI predictions for goals, corners, cards, and match outcomes"
    }
  ];

  return (
    <section className="relative z-10 py-20" style={{ backgroundColor: 'rgba(25, 26, 26, 0.95)' }}>
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          style={{ color: '#FCFAF6' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Why Choose <span style={{ color: '#20B8CD' }}>NutmegAI</span>?
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl border backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(31, 33, 33, 0.8)',
                borderColor: 'rgba(32, 184, 205, 0.2)'
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="mb-4" style={{ color: '#20B8CD' }}>{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#FCFAF6' }}>{feature.title}</h3>
              <p style={{ color: 'rgba(252, 250, 246, 0.7)' }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const NutmegAILanding = () => {
  const heroContentRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#191a1a' }}>
      <Navbar />

      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0">
          <FootballSplineBackground />
        </div>

        <FloatingFootballElements />

        <motion.div
          ref={heroContentRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            pointerEvents: 'none',
            opacity: heroOpacity,
            scale: heroScale,
          }}
        >
          <HeroContent />
        </motion.div>
      </div>

      <FeatureShowcase />

      <section className="py-20" style={{ background: 'linear-gradient(to top, rgba(32, 184, 205, 0.1), rgba(25, 26, 26, 1))' }}>
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl font-bold mb-8"
            style={{ color: '#FCFAF6' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to become a football tactical genius?
          </motion.h2>
          <Link to="/chat">
            <Button
              size="lg"
              className="font-semibold py-4 px-12 rounded-2xl text-lg border-0"
              style={{
                background: 'linear-gradient(135deg, #20B8CD 0%, #1A9CB8 100%)',
                color: '#191a1a'
              }}
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Join the Football Revolution
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NutmegAILanding; 