"use client";

import React, { useState } from 'react';
import { TaxCalculatorForm } from '@/components/TaxCalculatorForm';
import { TaxResults } from '@/components/TaxResults';
import { TaxInputs, TaxComparison, compareTaxRegimes } from '@/lib/taxCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TaxCalculatorPage() {
  const [results, setResults] = useState<TaxComparison | null>(null);
  const [inputs, setInputs] = useState<TaxInputs | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async (formData: TaxInputs) => {
    setIsLoading(true);
    
    try {
      // Simulate a brief loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const comparison = compareTaxRegimes(formData);
      setResults(comparison);
      setInputs(formData);
    } catch (error) {
      console.error('Error calculating tax:', error);
      alert('An error occurred while calculating tax. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setInputs(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Tax Calculator FY 2024-25
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compare your tax liability between Old Tax Regime and New Tax Regime. 
            Get detailed calculations with surcharge, cess, and personalized recommendations.
          </p>
        </div>

        {/* Key Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              Comprehensive tax calculation for informed decision making
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">✓ Complete Tax Calculation</h4>
                <p className="text-muted-foreground">
                  Includes all deductions, surcharge, and Health & Education Cess
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">✓ Side-by-Side Comparison</h4>
                <p className="text-muted-foreground">
                  Clear comparison between Old and New Tax Regimes
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">✓ PDF Report Download</h4>
                <p className="text-muted-foreground">
                  Detailed summary report for your records
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            <TaxCalculatorForm onSubmit={handleCalculate} isLoading={isLoading} />
            
            {results && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Reset Calculator
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div>
            {results && inputs ? (
              <TaxResults comparison={results} inputs={inputs} />
            ) : (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Tax Calculation Results</CardTitle>
                  <CardDescription>
                    Fill in your income and deduction details to see the comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-muted-foreground">
                      Enter your details and click "Calculate Tax Liability" to see results
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            * This calculator is based on the tax slabs and rules for FY 2024-25. 
            Please consult a qualified tax advisor for personalized tax planning advice.
          </p>
        </div>
      </div>
    </div>
  );
}
