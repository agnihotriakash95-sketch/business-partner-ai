import type { BusinessAnalysisInput } from '../types';

export const validateBusinessInput = (input: BusinessAnalysisInput) => {
  const errors: Partial<Record<keyof BusinessAnalysisInput, string>> = {};
  if (!input.businessName.trim()) errors.businessName = 'Business name is required';
  if (!input.industry.trim()) errors.industry = 'Industry is required';
  if (input.monthlyRevenue < 0) errors.monthlyRevenue = 'Revenue cannot be negative';
  if (input.monthlyExpenses < 0) errors.monthlyExpenses = 'Expenses cannot be negative';
  if (input.employeeCount < 0) errors.employeeCount = 'Employee count cannot be negative';
  if (!input.location.trim()) errors.location = 'Location is required';
  if (!input.problemsFacing.trim()) errors.problemsFacing = 'Tell AI what problems you are facing';
  return errors;
};
