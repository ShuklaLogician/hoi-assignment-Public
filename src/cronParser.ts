export class CronParser {
  private readonly cronFieldNames = ['minute', 'hour', 'day of month', 'month', 'day of week'];
  private readonly validRanges: [number, number][] = [[0, 59], [0, 23], [1, 31], [1, 12], [1, 7]];

  parse(cronExpression: string): string {
    const expressionParts = cronExpression.trim().split(/\s+/);
    
    if (expressionParts.length < 6) {
      throw new Error('Invalid cron expression: must have 5 time fields and a command');
    }

    const cronFields = expressionParts.slice(0, 5);
    const commandToRun = expressionParts.slice(5).join(' ');
    
    const outputLines: string[] = [];
    
    // Process each cron field (minute, hour, day of month, month, day of week)
    for (let fieldIndex = 0; fieldIndex < 5; fieldIndex++) {
      const fieldValue = cronFields[fieldIndex];
      const [minValue, maxValue] = this.validRanges[fieldIndex]!;
      const expandedValues = this.expandCronField(fieldValue, minValue, maxValue);
      
      const fieldName = this.cronFieldNames[fieldIndex];
      const formattedLine = `${fieldName.padEnd(14)}${expandedValues.join(' ')}`;
      outputLines.push(formattedLine);
    }
    
    outputLines.push(`${'command'.padEnd(14)}${commandToRun}`);
    
    return outputLines.join('\n');
  }

  private expandCronField(fieldExpression: string, minValue: number, maxValue: number): number[] {
    // Handle wildcard: * means "all possible values"
    if (fieldExpression === '*') {
      return this.createNumberSequence(minValue, maxValue);
    }

    // Handle step values: */5 or 10-20/2
    if (fieldExpression.includes('/')) {
      return this.handleStepValues(fieldExpression, minValue, maxValue);
    }

    // Handle comma-separated lists: 1,5,10
    if (fieldExpression.includes(',')) {
      return this.handleCommaSeparatedValues(fieldExpression, minValue, maxValue);
    }

    // Handle ranges: 1-5
    if (fieldExpression.includes('-')) {
      return this.handleRangeValues(fieldExpression);
    }

    // Handle single number: 15
    return this.handleSingleValue(fieldExpression, minValue, maxValue);
  }

  private handleStepValues(expression: string, minValue: number, maxValue: number): number[] {
    const [rangeExpression, stepString] = expression.split('/');
    const stepSize = parseInt(stepString);
    
    // Get base values (either all values or a specific range)
    const baseValues = rangeExpression === '*' 
      ? this.createNumberSequence(minValue, maxValue)
      : this.expandCronField(rangeExpression, minValue, maxValue);
    
    // Take every nth value based on step size
    return baseValues.filter((_, index) => index % stepSize === 0);
  }

  private handleCommaSeparatedValues(expression: string, minValue: number, maxValue: number): number[] {
    const individualParts = expression.split(',');
    const allValues: number[] = [];
    
    for (const part of individualParts) {
      const partValues = this.expandCronField(part.trim(), minValue, maxValue);
      allValues.push(...partValues);
    }
    
    return allValues;
  }

  private handleRangeValues(expression: string): number[] {
    const [startString, endString] = expression.split('-');
    const startNumber = parseInt(startString);
    const endNumber = parseInt(endString);
    
    if (isNaN(startNumber) || isNaN(endNumber)) {
      throw new Error(`Invalid range: ${expression}`);
    }
    
    if (startNumber > endNumber) {
      throw new Error(`Invalid range: ${expression} (start > end)`);
    }
    
    return this.createNumberSequence(startNumber, endNumber);
  }

  private handleSingleValue(expression: string, minValue: number, maxValue: number): number[] {
    const singleNumber = parseInt(expression);
    
    if (isNaN(singleNumber) || singleNumber < minValue || singleNumber > maxValue) {
      throw new Error(`Invalid value: ${expression}`);
    }
    
    return [singleNumber];
  }

  private createNumberSequence(start: number, end: number): number[] {
    const sequence: number[] = [];
    for (let currentNumber = start; currentNumber <= end; currentNumber++) {
      sequence.push(currentNumber);
    }
    return sequence;
  }
}