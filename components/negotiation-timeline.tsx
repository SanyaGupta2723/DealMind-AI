'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Round {
  round_number: number;
  buyer_offer: number;
  seller_asking: number;
  gap: number;
  buyer_motivation: string;
  seller_motivation: string;
  mediator_suggestion: string | null;
}

interface NegotiationTimelineProps {
  rounds: Round[];
}

export function NegotiationTimeline({ rounds }: NegotiationTimelineProps) {
  if (rounds.length === 0) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl">Negotiation Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {rounds.map((round, index) => (
          <div key={round.round_number} className="relative">
            {/* Timeline connector */}
            {index < rounds.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-12 bg-border" />
            )}

            <div className="flex gap-4">
              {/* Timeline dot */}
              <div className="relative flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary mt-1.5 z-10" />
              </div>

              {/* Round content */}
              <div className="flex-1 pb-6">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg">
                    Round {round.round_number}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Gap: ₹{Math.abs(round.gap).toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card border border-border/30 p-5 rounded-lg">
                  {/* Buyer column */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Buyer's Offer</div>
                    <div className="text-3xl font-bold text-primary">
                      ₹{round.buyer_offer.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {round.buyer_motivation}
                    </p>
                  </div>

                  {/* Seller column */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Seller's Asking</div>
                    <div className="text-3xl font-bold text-accent">
                      ₹{round.seller_asking.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {round.seller_motivation}
                    </p>
                  </div>
                </div>

                {/* Mediator suggestion */}
                {round.mediator_suggestion && (
                  <div className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                    <div className="flex gap-2">
                      <span className="text-lg font-bold text-accent">💡</span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-accent/70 mb-1">Mediator's Insight</p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {round.mediator_suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
