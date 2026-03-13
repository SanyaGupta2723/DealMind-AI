'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NegotiationResultProps {
  success: boolean;
  agreed: boolean;
  finalPrice: number | null;
  terminationReason: string;
  onReset: () => void;
}

export function NegotiationResult({
  success,
  agreed,
  finalPrice,
  terminationReason,
  onReset,
}: NegotiationResultProps) {
  return (
    <Card className={agreed ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20' : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {agreed ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <span className="text-green-900 dark:text-green-100">Agreement Reached!</span>
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6 text-red-600" />
              <span className="text-red-900 dark:text-red-100">No Agreement</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {agreed && finalPrice && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Final Agreed Price</p>
            <p className="text-4xl font-bold text-green-600">
              ₹{finalPrice.toFixed(2)}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Reason</p>
          <p className={agreed ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}>
            {terminationReason}
          </p>
        </div>

        <Button onClick={onReset} variant="outline" className="w-full">
          Start New Negotiation
        </Button>
      </CardContent>
    </Card>
  );
}
