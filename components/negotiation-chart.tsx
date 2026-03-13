'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Round {
  round_number: number;
  buyer_offer: number;
  seller_asking: number;
  gap: number;
}

interface NegotiationChartProps {
  rounds: Round[];
}

export function NegotiationChart({ rounds }: NegotiationChartProps) {
  if (rounds.length === 0) {
    return null;
  }

  const chartData = rounds.map((round) => ({
    round: round.round_number,
    buyer: round.buyer_offer,
    seller: round.seller_asking,
  }));

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-xl">Price Convergence Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="round" 
              label={{ value: 'Round', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => `₹${value.toFixed(2)}`}
              labelFormatter={(label) => `Round ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="buyer" 
              stroke="#2563eb" 
              name="Buyer's Offer"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="seller" 
              stroke="#16a34a" 
              name="Seller's Asking"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
