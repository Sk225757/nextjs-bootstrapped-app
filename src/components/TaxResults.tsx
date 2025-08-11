"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TaxComparison, TaxInputs, formatCurrency } from '@/lib/taxCalculator';
import { generateTaxReportPdf } from '@/lib/pdfGenerator';

interface TaxResultsProps {
  comparison: TaxComparison;
  inputs: TaxInputs;
}

export function TaxResults({ comparison, inputs }: TaxResultsProps) {
  const { oldRegime, newRegime, savings, recommendedRegime } = comparison;

  const handleDownloadPdf = () => {
    try {
      const reportData = {
        inputs,
        comparison,
        generatedDate: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      generateTaxReportPdf(reportData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={recommendedRegime === 'old' ? 'ring-2 ring-green-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Old Tax Regime</CardTitle>
              {recommendedRegime === 'old' && (
                <Badge variant="default" className="bg-green-500">
                  Recommended
                </Badge>
              )}
            </div>
            <CardDescription>
              Traditional regime with multiple deductions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Income:</span>
                <span className="font-medium">{formatCurrency(oldRegime.totalIncome)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Deductions:</span>
                <span className="font-medium text-green-600">-{formatCurrency(oldRegime.totalDeductions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxable Income:</span>
                <span className="font-medium">{formatCurrency(oldRegime.taxableIncome)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Tax Before Rebate:</span>
                <span className="font-medium">{formatCurrency(oldRegime.taxBeforeRebate)}</span>
              </div>
              {oldRegime.rebateAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Rebate u/s 87A:</span>
                  <span className="font-medium text-green-600">-{formatCurrency(oldRegime.rebateAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax After Rebate:</span>
                <span className="font-medium">{formatCurrency(oldRegime.taxAfterRebate)}</span>
              </div>
              {oldRegime.surcharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Surcharge:</span>
                  <span className="font-medium">{formatCurrency(oldRegime.surcharge)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Health & Education Cess:</span>
                <span className="font-medium">{formatCurrency(oldRegime.cess)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Tax Liability:</span>
                <span className="text-red-600">{formatCurrency(oldRegime.totalTax)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={recommendedRegime === 'new' ? 'ring-2 ring-green-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">New Tax Regime</CardTitle>
              {recommendedRegime === 'new' && (
                <Badge variant="default" className="bg-green-500">
                  Recommended
                </Badge>
              )}
            </div>
            <CardDescription>
              Simplified regime with lower rates, limited deductions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Income:</span>
                <span className="font-medium">{formatCurrency(newRegime.totalIncome)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Deductions:</span>
                <span className="font-medium text-green-600">-{formatCurrency(newRegime.totalDeductions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxable Income:</span>
                <span className="font-medium">{formatCurrency(newRegime.taxableIncome)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Tax Before Rebate:</span>
                <span className="font-medium">{formatCurrency(newRegime.taxBeforeRebate)}</span>
              </div>
              {newRegime.rebateAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Rebate u/s 87A:</span>
                  <span className="font-medium text-green-600">-{formatCurrency(newRegime.rebateAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax After Rebate:</span>
                <span className="font-medium">{formatCurrency(newRegime.taxAfterRebate)}</span>
              </div>
              {newRegime.surcharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Surcharge:</span>
                  <span className="font-medium">{formatCurrency(newRegime.surcharge)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Health & Education Cess:</span>
                <span className="font-medium">{formatCurrency(newRegime.cess)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Tax Liability:</span>
                <span className="text-red-600">{formatCurrency(newRegime.totalTax)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Savings Analysis</CardTitle>
          <CardDescription>
            Comparison and recommendation based on your inputs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Recommended Regime</p>
                <p className="text-sm text-muted-foreground">
                  {recommendedRegime === 'old' ? 'Old Tax Regime' : 'New Tax Regime'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">Potential Savings</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(savings)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Key Insights:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {recommendedRegime === 'old' ? (
                  <>
                    <li>• The Old Tax Regime is more beneficial due to available deductions</li>
                    <li>• Your total deductions of {formatCurrency(oldRegime.totalDeductions)} significantly reduce taxable income</li>
                    <li>• Consider maximizing deductions under sections 80C, 80D, and others</li>
                  </>
                ) : (
                  <>
                    <li>• The New Tax Regime offers lower tax rates despite limited deductions</li>
                    <li>• Simplified tax structure with fewer compliance requirements</li>
                    <li>• Consider if the convenience outweighs the tax savings</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download PDF Button */}
      <div className="flex justify-center">
        <Button onClick={handleDownloadPdf} size="lg" className="w-full md:w-auto">
          Download PDF Summary Report
        </Button>
      </div>
    </div>
  );
}
