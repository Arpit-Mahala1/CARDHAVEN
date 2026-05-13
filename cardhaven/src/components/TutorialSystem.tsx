import React, { useState, useEffect } from 'react';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  trigger: 'start' | 'battle' | 'shop' | 'event';
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'intro',
    title: 'The Descent Begins',
    content: 'Welcome to the Gloom-bound Gallery. Your goal is to reach the 10th floor and defeat the Ink-Stained Eye. Use cards to strike enemies and defend yourself.',
    trigger: 'start'
  },
  {
    id: 'grid',
    title: 'Positioning Matters',
    content: 'Enemies move down the grid each turn. If they cross the Threshold (bottom row), you will take direct damage. Target them before they reach you!',
    trigger: 'battle'
  },
  {
    id: 'status',
    title: 'Eldritch Afflictions',
    content: 'Watch out for status effects like Bleed and Doom. Some cards can cleanse them, or use them to your advantage.',
    trigger: 'battle'
  }
];

export default function TutorialSystem() {
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  const [seenSteps, setSeenSteps] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cardhaven_tutorial');
    if (saved) setSeenSteps(JSON.parse(saved));
  }, []);

  const triggerTutorial = (trigger: 'start' | 'battle' | 'shop' | 'event') => {
    const next = TUTORIAL_STEPS.find(s => s.trigger === trigger && !seenSteps.includes(s.id));
    if (next) setCurrentStep(next);
  };

  // Expose trigger to window for easy access from other components
  useEffect(() => {
    (window as any).triggerTutorial = triggerTutorial;
    // Initial trigger
    triggerTutorial('start');
  }, [seenSteps]);

  const dismiss = () => {
    if (currentStep) {
      const newSeen = [...seenSteps, currentStep.id];
      setSeenSteps(newSeen);
      localStorage.setItem('cardhaven_tutorial', JSON.stringify(newSeen));
      setCurrentStep(null);
    }
  };

  if (!currentStep) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
      <div className="glass-panel p-8 max-w-md border-accent-gold border-opacity-40 shadow-gold pointer-events-auto animate-fade-in">
        <h4 className="text-accent-gold font-serif text-lg tracking-widest uppercase mb-4">{currentStep.title}</h4>
        <p className="text-text-secondary text-sm leading-relaxed font-serif italic mb-6">
          "{currentStep.content}"
        </p>
        <button 
          onClick={dismiss}
          className="btn-primary w-full py-3 text-[10px] uppercase tracking-widest"
        >
          Understood
        </button>
      </div>
    </div>
  );
}
