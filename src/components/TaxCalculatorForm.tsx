"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TaxInputs } from '@/lib/taxCalculator';

const taxInputSchema = z.object({
  grossSalary: z.number().min(0, 'Gross salary must be positive').max(100000000, 'Amount too large'),
  otherIncome: z.number().min(0, 'Other income must be positive').max(100000000, 'Amount too large'),
  basicSalary: z.number().min(0, 'Basic salary must be positive').max(100000000, 'Amount too large'),
  // Old regime deductions
  section80C: z.number().min(0, 'Amount must be positive').max(150000, 'Maximum limit is ₹1,50,000'),
  section80D: z.number().min(0, 'Amount must be positive').max(50000, 'Maximum limit is ₹50,000'),
  section80CCD1B: z.number().min(0, 'Amount must be positive').max(50000, 'Maximum limit is ₹50,000'),
  section80E: z.number().min(0, 'Amount must be positive').max(10000000, 'Amount too large'),
  section80G: z.number().min(0, 'Amount must be positive').max(10000000, 'Amount too large'),
  hraExemption: z.number().min(0, 'Amount must be positive').max(10000000, 'Amount too large'),
  lta: z.number().min(0, 'Amount must be positive').max(10000000, 'Amount too large'),
  homeLoanInterest: z.number().min(0, 'Amount must be positive').max(200000, 'Maximum limit is ₹2,00,000'),
  // New regime deductions
  employerNPS: z.number().min(0, 'Amount must be positive').max(10000000, 'Amount too large'),
  transportAllowance: z.number().min(0, 'Amount must be positive').max(1000000, 'Amount too large'),
  conveyanceAllowance: z.number().min(0, 'Amount must be positive').max(10000000, 'Amount too large'),
  gratuity: z.number().min(0, 'Amount must be positive').max(10000000, 'Amount too large'),
  vrs: z.number().min(0, 'Amount must be positive').max(500000, 'Maximum limit is ₹5,00,000'),
  leaveEncashment: z.number().min(0, 'Amount must be positive').max(10000000, 'Amount too large'),
  isDisabled: z.boolean(),
});

type TaxInputFormData = z.infer<typeof taxInputSchema>;

interface TaxCalculatorFormProps {
  onSubmit: (data: TaxInputs) => void;
  isLoading?: boolean;
}

export function TaxCalculatorForm({ onSubmit, isLoading = false }: TaxCalculatorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TaxInputFormData>({
    resolver: zodResolver(taxInputSchema),
    defaultValues: {
      grossSalary: 0,
      otherIncome: 0,
      basicSalary: 0,
      section80C: 0,
      section80D: 0,
      section80CCD1B: 0,
      section80E: 0,
      section80G: 0,
      hraExemption: 0,
      lta: 0,
      homeLoanInterest: 0,
      employerNPS: 0,
      transportAllowance: 0,
      conveyanceAllowance: 0,
      gratuity: 0,
      vrs: 0,
      leaveEncashment: 0,
      isDisabled: false,
    },
  });

  const grossSalary = watch('grossSalary');
  const otherIncome = watch('otherIncome');
  const basicSalary = watch('basicSalary');
  const isDisabled = watch('isDisabled');
  const totalIncome = (grossSalary || 0) + (otherIncome || 0);

  const onFormSubmit = (data: TaxInputFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Income Details</CardTitle>
          <CardDescription>
            Enter your income information for FY 2024-25
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossSalary">Gross Salary *</Label>
              <Input
                id="grossSalary"
                type="number"
                placeholder="0"
                {...register('grossSalary', { valueAsNumber: true })}
              />
              {errors.grossSalary && (
                <p className="text-sm text-red-600">{errors.grossSalary.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherIncome">Other Income (Interest, etc.)</Label>
              <Input
                id="otherIncome"
                type="number"
                placeholder="0"
                {...register('otherIncome', { valueAsNumber: true })}
              />
              {errors.otherIncome && (
                <p className="text-sm text-red-600">{errors.otherIncome.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="basicSalary">Basic Salary (for NPS calculation)</Label>
              <Input
                id="basicSalary"
                type="number"
                placeholder="0"
                {...register('basicSalary', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Required for employer NPS contribution calculation</p>
              {errors.basicSalary && (
                <p className="text-sm text-red-600">{errors.basicSalary.message}</p>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">
              Total Income: ₹{totalIncome.toLocaleString('en-IN')}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deductions (Old Regime Only)</CardTitle>
          <CardDescription>
            These deductions are only applicable under the Old Tax Regime. 
            Standard deduction of ₹50,000 is automatically applied for both regimes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section80C">Section 80C (PF, LIC, ELSS, etc.)</Label>
              <Input
                id="section80C"
                type="number"
                placeholder="0"
                {...register('section80C', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Maximum: ₹1,50,000</p>
              {errors.section80C && (
                <p className="text-sm text-red-600">{errors.section80C.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="section80D">Section 80D (Health Insurance)</Label>
              <Input
                id="section80D"
                type="number"
                placeholder="0"
                {...register('section80D', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Maximum: ₹25,000 / ₹50,000</p>
              {errors.section80D && (
                <p className="text-sm text-red-600">{errors.section80D.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="section80CCD1B">Section 80CCD(1B) - NPS</Label>
              <Input
                id="section80CCD1B"
                type="number"
                placeholder="0"
                {...register('section80CCD1B', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Maximum: ₹50,000</p>
              {errors.section80CCD1B && (
                <p className="text-sm text-red-600">{errors.section80CCD1B.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="section80E">Section 80E (Education Loan)</Label>
              <Input
                id="section80E"
                type="number"
                placeholder="0"
                {...register('section80E', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Actual - if eligible</p>
              {errors.section80E && (
                <p className="text-sm text-red-600">{errors.section80E.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="section80G">Section 80G (Donations)</Label>
              <Input
                id="section80G"
                type="number"
                placeholder="0"
                {...register('section80G', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Percentage based</p>
              {errors.section80G && (
                <p className="text-sm text-red-600">{errors.section80G.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hraExemption">HRA Exemption</Label>
              <Input
                id="hraExemption"
                type="number"
                placeholder="0"
                {...register('hraExemption', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Based on rent & city</p>
              {errors.hraExemption && (
                <p className="text-sm text-red-600">{errors.hraExemption.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lta">LTA (Leave Travel Allowance)</Label>
              <Input
                id="lta"
                type="number"
                placeholder="0"
                {...register('lta', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">As per bills</p>
              {errors.lta && (
                <p className="text-sm text-red-600">{errors.lta.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="homeLoanInterest">Home Loan Interest (Sec 24)</Label>
              <Input
                id="homeLoanInterest"
                type="number"
                placeholder="0"
                {...register('homeLoanInterest', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Maximum: ₹2,00,000</p>
              {errors.homeLoanInterest && (
                <p className="text-sm text-red-600">{errors.homeLoanInterest.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Regime Deductions</CardTitle>
          <CardDescription>
            These deductions are applicable under the New Tax Regime in addition to the standard deduction of ₹75,000.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employerNPS">Employer's NPS Contribution (80CCD(2))</Label>
              <Input
                id="employerNPS"
                type="number"
                placeholder="0"
                {...register('employerNPS', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Maximum: 10% of Basic Salary</p>
              {errors.employerNPS && (
                <p className="text-sm text-red-600">{errors.employerNPS.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conveyanceAllowance">Conveyance Allowance</Label>
              <Input
                id="conveyanceAllowance"
                type="number"
                placeholder="0"
                {...register('conveyanceAllowance', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">For official duty - fully exempt if used for office purpose</p>
              {errors.conveyanceAllowance && (
                <p className="text-sm text-red-600">{errors.conveyanceAllowance.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  id="isDisabled"
                  {...register('isDisabled')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isDisabled" className="text-sm">I am specially-abled</Label>
              </div>
              <Label htmlFor="transportAllowance">Transport Allowance</Label>
              <Input
                id="transportAllowance"
                type="number"
                placeholder="0"
                disabled={!isDisabled}
                {...register('transportAllowance', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Only for specially-abled employees</p>
              {errors.transportAllowance && (
                <p className="text-sm text-red-600">{errors.transportAllowance.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gratuity">Gratuity</Label>
              <Input
                id="gratuity"
                type="number"
                placeholder="0"
                {...register('gratuity', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Retirement-related exemptions</p>
              {errors.gratuity && (
                <p className="text-sm text-red-600">{errors.gratuity.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vrs">Voluntary Retirement (VRS)</Label>
              <Input
                id="vrs"
                type="number"
                placeholder="0"
                {...register('vrs', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Exempt up to ₹5,00,000</p>
              {errors.vrs && (
                <p className="text-sm text-red-600">{errors.vrs.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leaveEncashment">Leave Encashment</Label>
              <Input
                id="leaveEncashment"
                type="number"
                placeholder="0"
                {...register('leaveEncashment', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Death-cum-retirement benefits</p>
              {errors.leaveEncashment && (
                <p className="text-sm text-red-600">{errors.leaveEncashment.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSubmit(onFormSubmit)} 
        className="w-full" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? 'Calculating...' : 'Calculate Tax Liability'}
      </Button>
    </div>
  );
}
