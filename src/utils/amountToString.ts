export function amountToString(
  amount: number,
  numDecimals: number = 0,
  numDigits: number = 1,
  locale: string = 'en-GB'
): string {
  const result: string = amount.toLocaleString(locale, {
    minimumFractionDigits: numDecimals,
    maximumFractionDigits: numDecimals,
    minimumIntegerDigits: numDigits,
  });

  return result;
}
