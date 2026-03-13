'use client';

import { useState } from 'react';
import { NegotiationForm } from '@/components/negotiation-form';
import { NegotiationTimeline } from '@/components/negotiation-timeline';
import { NegotiationChart } from '@/components/negotiation-chart';
import { NegotiationResult } from '@/components/negotiation-result';
import { runNegotiation } from '@/lib/negotiation-engine';
import type { NegotiationResult as NegotiationResultType } from '@/lib/negotiation-engine';
import { toast } from 'sonner';

export default function Home() {
  const [negotiationData, setNegotiationData] = useState<NegotiationResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNegotiate = async (formData: {
    seller_asking_price: number;
    buyer_max_budget: number;
    buyer_min_acceptable: number;
    seller_min_acceptable: number;
    max_rounds: number;
  }) => {
    setIsLoading(true);
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const result = runNegotiation(formData);
      setNegotiationData(result);
      
      toast.success(
        result.agreed
          ? 'Agreement reached! Negotiation successful.'
          : 'Negotiation completed. Review the timeline for details.',
        { duration: 4000 }
      );
    } catch (error) {
      console.error('[v0] Negotiation error:', error);
      toast.error('Failed to process negotiation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setNegotiationData(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">AI-Powered Negotiations</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-foreground text-balance leading-tight">
              Intelligent Price <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Convergence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              Watch AI agents negotiate in real-time. Buyer, seller, and mediator collaborate to find fair market prices through dynamic, strategic exchanges.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-8">
          {!negotiationData ? (
            // Form only
            <NegotiationForm onSubmit={handleNegotiate} isLoading={isLoading} />
          ) : (
            // Results
            <>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <NegotiationChart rounds={negotiationData.rounds} />
                </div>
                <div>
                  <NegotiationResult
                    success={negotiationData.success}
                    agreed={negotiationData.agreed}
                    finalPrice={negotiationData.final_price}
                    terminationReason={negotiationData.termination_reason}
                    onReset={handleReset}
                  />
                </div>
              </div>

              <NegotiationTimeline rounds={negotiationData.rounds} />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-24 pt-16 border-t border-border/30 text-center text-sm text-muted-foreground space-y-2">
          <p className="font-medium">Powered by Advanced Multi-Agent Negotiation AI</p>
          <p className="text-xs text-muted-foreground/70">
            Real-time price convergence • Dynamic strategy adaptation • Mediator-assisted resolution
          </p>
        </div>
      </div>
    </main>
  );
}
