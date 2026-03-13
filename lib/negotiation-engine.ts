'use strict';

export interface NegotiationRound {
  round_number: number;
  buyer_offer: number;
  seller_asking: number;
  gap: number;
  buyer_motivation: string;
  seller_motivation: string;
  mediator_suggestion: string | null;
}

export interface NegotiationResult {
  success: boolean;
  final_price: number | null;
  agreed: boolean;
  rounds: NegotiationRound[];
  termination_reason: string;
}

const buyerMotivations = [
  'Looking for the best value possible',
  'Checking budget constraints carefully',
  'Seeking a fair market price',
  'Trying to secure a competitive rate',
  'Evaluating the total cost of ownership',
  'Aiming for mutual benefit',
];

const sellerMotivations = [
  'Maintaining acceptable profit margins',
  'Considering production costs',
  'Evaluating market conditions',
  'Assessing long-term viability',
  'Balancing supply and demand',
  'Seeking sustainable pricing',
];

const mediatorInsights = [
  'Both parties show willingness to negotiate. A small concession could bridge the gap.',
  'The gap is narrowing positively. Momentum is building toward agreement.',
  'Suggest focusing on shared interests rather than positions.',
  'A meeting at the midpoint could be mutually beneficial for both parties.',
  'Consider exploring flexible payment terms or alternative arrangements.',
  'Both parties are within a reasonable negotiation range.',
];

export function runNegotiation(params: {
  seller_asking_price: number;
  buyer_max_budget: number;
  buyer_min_acceptable: number;
  seller_min_acceptable: number;
  max_rounds: number;
}): NegotiationResult {
  const rounds: NegotiationRound[] = [];
  
  // Initial positions - more realistic starting points
  let buyer_offer = params.buyer_max_budget;
  let seller_asking = params.seller_asking_price;

  // Validate inputs
  if (buyer_offer > seller_asking) {
    return {
      success: true,
      final_price: Math.round((buyer_offer + seller_asking) / 2 * 100) / 100,
      agreed: true,
      rounds: [{
        round_number: 1,
        buyer_offer,
        seller_asking,
        gap: 0,
        buyer_motivation: 'Initial offer already exceeds asking price',
        seller_motivation: 'Ready to accept',
        mediator_suggestion: 'Immediate agreement possible',
      }],
      termination_reason: 'Buyer offer already meets or exceeds seller asking price',
    };
  }

  for (let i = 1; i <= params.max_rounds; i++) {
    const gap = seller_asking - buyer_offer;
    const gapPercentage = gap > 0 ? (gap / seller_asking) * 100 : 0;

    // Calculate progress factor: increases as we go through rounds
    const progressFactor = i / params.max_rounds;

    // Buyer increases offer gradually, reaching max budget by final rounds
    const remainingGap = seller_asking - buyer_offer;
    const buyerIncrement = remainingGap * (0.08 + progressFactor * 0.12);
    buyer_offer = Math.min(
      buyer_offer + buyerIncrement,
      params.buyer_max_budget
    );

    // Seller decreases asking price gradually, reaching min acceptable by final rounds
    const sellerDecrement = remainingGap * (0.06 + progressFactor * 0.10);
    seller_asking = Math.max(
      seller_asking - sellerDecrement,
      params.seller_min_acceptable
    );

    // Get mediator suggestion when gap is closing significantly
    let mediatorSuggestion: string | null = null;
    if (gapPercentage < 10 && gap > 0) {
      mediatorSuggestion =
        mediatorInsights[Math.floor(Math.random() * mediatorInsights.length)];
    }

    const currentGap = seller_asking - buyer_offer;
    
    rounds.push({
      round_number: i,
      buyer_offer: Math.round(buyer_offer * 100) / 100,
      seller_asking: Math.round(seller_asking * 100) / 100,
      gap: Math.round(currentGap * 100) / 100,
      buyer_motivation:
        buyerMotivations[Math.floor(Math.random() * buyerMotivations.length)],
      seller_motivation:
        sellerMotivations[Math.floor(Math.random() * sellerMotivations.length)],
      mediator_suggestion: mediatorSuggestion,
    });

    // Check for agreement: buyer offer >= seller asking
    if (buyer_offer >= seller_asking) {
      return {
        success: true,
        final_price: Math.round((buyer_offer + seller_asking) / 2 * 100) / 100,
        agreed: true,
        rounds,
        termination_reason: `Agreement reached at Round ${i}: Both parties converged on price ₹${Math.round((buyer_offer + seller_asking) / 2)}.`,
      };
    }

    // Check if both parties are within acceptable ranges
    if (
      buyer_offer >= params.buyer_min_acceptable &&
      seller_asking <= params.seller_min_acceptable &&
      currentGap <= (seller_asking * 0.05) // Gap is less than 5% of seller asking
    ) {
      return {
        success: true,
        final_price: Math.round((buyer_offer + seller_asking) / 2 * 100) / 100,
        agreed: true,
        rounds,
        termination_reason: `Agreement reached at Round ${i}: Both parties within acceptable ranges.`,
      };
    }
  }

  // Max rounds reached
  const finalGap = seller_asking - buyer_offer;
  const agreed = buyer_offer >= seller_asking;

  return {
    success: !agreed ? false : true,
    final_price: agreed ? Math.round((buyer_offer + seller_asking) / 2 * 100) / 100 : null,
    agreed,
    rounds,
    termination_reason: agreed
      ? `Negotiation concluded with agreement after ${params.max_rounds} rounds.`
      : `Maximum rounds (${params.max_rounds}) reached without agreement. Gap: ₹${Math.round(Math.abs(finalGap))}`,
  };
}
