import {Property} from "../types/Property"
const mortgageCalculate = require('mortgage-calculate');

// Use the external Mortgage Calculator library to calculate the monthly payments to purchase the property.
// Factors:
// 1) Property Price
// 2) Down Payment
// 3) Loan interest rate
// 4) Loan term
// 5) Monthly (HOA) fees
// 6) Monthly property tax
export function calculateMonthlyPayment(property: Property,  downPayment: number, rate: number) { 
    return (Math.round(mortgageCalculate(
        {loanAmount: property.price - 500000, APR: rate, termYears: 30}
        ).monthlyPayment * 100) / 100 + property.fees + property.tax)
}
