'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface NegotiationFormProps {
  onSubmit: (data: {
    seller_asking_price: number;
    buyer_max_budget: number;
    buyer_min_acceptable: number;
    seller_min_acceptable: number;
    max_rounds: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function NegotiationForm({ onSubmit, isLoading = false }: NegotiationFormProps) {
  const [formData, setFormData] = useState({
    seller_asking_price: 100000,
    buyer_max_budget: 85000,
    buyer_min_acceptable: 75000,
    seller_min_acceptable: 80000,
    max_rounds: 10,
  });

  const gap = formData.seller_asking_price - formData.buyer_max_budget;
  const gapPercentage = ((gap / formData.seller_asking_price) * 100).toFixed(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'max_rounds' ? parseInt(value) : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl">Start Negotiation</CardTitle>
        <CardDescription className="text-base">Configure the negotiation parameters for buyer, seller, and mediator agents</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field>
              <FieldLabel>Seller's Asking Price</FieldLabel>
              <Input
                type="number"
                name="seller_asking_price"
                value={formData.seller_asking_price}
                onChange={handleChange}
                placeholder="100000"
                step="1000"
              />
            </Field>

            <Field>
              <FieldLabel>Buyer's Max Budget</FieldLabel>
              <Input
                type="number"
                name="buyer_max_budget"
                value={formData.buyer_max_budget}
                onChange={handleChange}
                placeholder="85000"
                step="1000"
              />
            </Field>

            <Field>
              <FieldLabel>Buyer's Min Acceptable</FieldLabel>
              <Input
                type="number"
                name="buyer_min_acceptable"
                value={formData.buyer_min_acceptable}
                onChange={handleChange}
                placeholder="75000"
                step="1000"
              />
            </Field>

            <Field>
              <FieldLabel>Seller's Min Acceptable</FieldLabel>
              <Input
                type="number"
                name="seller_min_acceptable"
                value={formData.seller_min_acceptable}
                onChange={handleChange}
                placeholder="80000"
                step="1000"
              />
            </Field>

            <Field>
              <FieldLabel>Max Rounds</FieldLabel>
              <Input
                type="number"
                name="max_rounds"
                value={formData.max_rounds}
                onChange={handleChange}
                placeholder="10"
                min="1"
                max="20"
              />
            </Field>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-semibold">
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Initiating negotiation...
              </>
            ) : (
              'Launch Negotiation'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
