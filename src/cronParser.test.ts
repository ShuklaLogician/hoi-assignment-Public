import { CronParser } from './cronParser';

describe('CronParser', () => {
  let cronParser: CronParser;

  beforeEach(() => {
    cronParser = new CronParser();
  });

  describe('Basic functionality', () => {
    test('parses the example cron expression correctly', () => {
      const cronExpression = '*/15 0 1,15 * 1-5 /usr/bin/find';
      const parsedOutput = cronParser.parse(cronExpression);
      
      expect(parsedOutput).toContain('minute        0 15 30 45');
      expect(parsedOutput).toContain('hour          0');
      expect(parsedOutput).toContain('day of month  1 15');
      expect(parsedOutput).toContain('month         1 2 3 4 5 6 7 8 9 10 11 12');
      expect(parsedOutput).toContain('day of week   1 2 3 4 5');
      expect(parsedOutput).toContain('command       /usr/bin/find');
    });

    test('handles single specific values', () => {
      const specificValuesExpression = '30 14 1 6 2 /bin/test';
      const parsedOutput = cronParser.parse(specificValuesExpression);
      expect(parsedOutput).toContain('minute        30');
      expect(parsedOutput).toContain('hour          14');
      expect(parsedOutput).toContain('day of month  1');
      expect(parsedOutput).toContain('month         6');
      expect(parsedOutput).toContain('day of week   2');
    });
  });

  describe('Wildcard (*) handling', () => {
    test('handles asterisk wildcard for all values', () => {
      const allWildcardsExpression = '* * * * * /bin/echo';
      const parsedOutput = cronParser.parse(allWildcardsExpression);
      expect(parsedOutput).toContain('minute        0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59');
      expect(parsedOutput).toContain('hour          0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23');
      expect(parsedOutput).toContain('day of month  1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31');
      expect(parsedOutput).toContain('month         1 2 3 4 5 6 7 8 9 10 11 12');
      expect(parsedOutput).toContain('day of week   1 2 3 4 5 6 7');
    });
  });

  describe('Range (-) handling', () => {
    test('handles simple ranges', () => {
      const rangeExpression = '1-5 9-17 10-15 3-8 2-6 /usr/bin/backup';
      const parsedOutput = cronParser.parse(rangeExpression);
      expect(parsedOutput).toContain('minute        1 2 3 4 5');
      expect(parsedOutput).toContain('hour          9 10 11 12 13 14 15 16 17');
      expect(parsedOutput).toContain('day of month  10 11 12 13 14 15');
      expect(parsedOutput).toContain('month         3 4 5 6 7 8');
      expect(parsedOutput).toContain('day of week   2 3 4 5 6');
    });

    test('handles edge case ranges', () => {
      const edgeRangeExpression = '0-2 22-23 1-3 11-12 6-7 /test';
      const parsedOutput = cronParser.parse(edgeRangeExpression);
      expect(parsedOutput).toContain('minute        0 1 2');
      expect(parsedOutput).toContain('hour          22 23');
      expect(parsedOutput).toContain('day of month  1 2 3');
      expect(parsedOutput).toContain('month         11 12');
      expect(parsedOutput).toContain('day of week   6 7');
    });
  });

  describe('List (,) handling', () => {
    test('handles comma-separated lists', () => {
      const listExpression = '0,15,30,45 6,12,18 1,15,31 1,6,12 1,3,5,7 /script';
      const parsedOutput = cronParser.parse(listExpression);
      expect(parsedOutput).toContain('minute        0 15 30 45');
      expect(parsedOutput).toContain('hour          6 12 18');
      expect(parsedOutput).toContain('day of month  1 15 31');
      expect(parsedOutput).toContain('month         1 6 12');
      expect(parsedOutput).toContain('day of week   1 3 5 7');
    });

    test('handles single item lists', () => {
      const singleListExpression = '5 10 25 8 4 /single';
      const parsedOutput = cronParser.parse(singleListExpression);
      expect(parsedOutput).toContain('minute        5');
      expect(parsedOutput).toContain('hour          10');
      expect(parsedOutput).toContain('day of month  25');
      expect(parsedOutput).toContain('month         8');
      expect(parsedOutput).toContain('day of week   4');
    });
  });

  describe('Step (/) handling', () => {
    test('handles step values with wildcards', () => {
      const stepExpression = '*/10 */6 */5 */3 */2 /backup';
      const parsedOutput = cronParser.parse(stepExpression);
      expect(parsedOutput).toContain('minute        0 10 20 30 40 50');
      expect(parsedOutput).toContain('hour          0 6 12 18');
      expect(parsedOutput).toContain('day of month  1 6 11 16 21 26 31');
      expect(parsedOutput).toContain('month         1 4 7 10');
      expect(parsedOutput).toContain('day of week   1 3 5 7');
    });

    test('handles step values with ranges', () => {
      const rangeStepExpression = '10-50/10 8-20/4 5-25/5 2-10/2 1-7/3 /task';
      const parsedOutput = cronParser.parse(rangeStepExpression);
      expect(parsedOutput).toContain('minute        10 20 30 40 50');
      expect(parsedOutput).toContain('hour          8 12 16 20');
      expect(parsedOutput).toContain('day of month  5 10 15 20 25');
      expect(parsedOutput).toContain('month         2 4 6 8 10');
      expect(parsedOutput).toContain('day of week   1 4 7');
    });

    test('handles different step sizes', () => {
      const differentStepsExpression = '*/1 */1 */1 */1 */1 /every';
      const parsedOutput = cronParser.parse(differentStepsExpression);
      expect(parsedOutput).toContain('minute        0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59');
    });
  });

  describe('Complex combinations', () => {
    test('handles mixed syntax in single expression', () => {
      const mixedExpression = '0,30 9-17/2 1,15 1-6,12 1-5,7 /complex';
      const parsedOutput = cronParser.parse(mixedExpression);
      expect(parsedOutput).toContain('minute        0 30');
      expect(parsedOutput).toContain('hour          9 11 13 15 17');
      expect(parsedOutput).toContain('day of month  1 15');
      expect(parsedOutput).toContain('month         1 2 3 4 5 6 12');
      expect(parsedOutput).toContain('day of week   1 2 3 4 5 7');
    });

    test('handles real-world cron expressions', () => {
      // Every weekday at 9 AM
      const weekdayMorning = '0 9 * * 1-5 /usr/bin/backup';
      let parsedOutput = cronParser.parse(weekdayMorning);
      expect(parsedOutput).toContain('minute        0');
      expect(parsedOutput).toContain('hour          9');
      expect(parsedOutput).toContain('day of week   1 2 3 4 5');

      // Every 15 minutes during business hours
      const businessHours = '*/15 9-17 * * 1-5 /usr/bin/monitor';
      parsedOutput = cronParser.parse(businessHours);
      expect(parsedOutput).toContain('minute        0 15 30 45');
      expect(parsedOutput).toContain('hour          9 10 11 12 13 14 15 16 17');
      expect(parsedOutput).toContain('day of week   1 2 3 4 5');
    });
  });

  describe('Command handling', () => {
    test('handles simple commands', () => {
      const simpleCommand = '0 0 * * * /bin/echo';
      const parsedOutput = cronParser.parse(simpleCommand);
      expect(parsedOutput).toContain('command       /bin/echo');
    });

    test('handles commands with arguments', () => {
      const commandWithArgs = '0 0 * * * /usr/bin/find /home -name "*.log" -delete';
      const parsedOutput = cronParser.parse(commandWithArgs);
      expect(parsedOutput).toContain('command       /usr/bin/find /home -name "*.log" -delete');
    });

    test('handles commands with pipes and redirects', () => {
      const complexCommand = '0 0 * * * /bin/ls -la | grep test > /tmp/output.txt';
      const parsedOutput = cronParser.parse(complexCommand);
      expect(parsedOutput).toContain('command       /bin/ls -la | grep test > /tmp/output.txt');
    });
  });

  describe('Edge cases and boundary values', () => {
    test('handles minimum values', () => {
      const minValues = '0 0 1 1 1 /min';
      const parsedOutput = cronParser.parse(minValues);
      expect(parsedOutput).toContain('minute        0');
      expect(parsedOutput).toContain('hour          0');
      expect(parsedOutput).toContain('day of month  1');
      expect(parsedOutput).toContain('month         1');
      expect(parsedOutput).toContain('day of week   1');
    });

    test('handles maximum values', () => {
      const maxValues = '59 23 31 12 7 /max';
      const parsedOutput = cronParser.parse(maxValues);
      expect(parsedOutput).toContain('minute        59');
      expect(parsedOutput).toContain('hour          23');
      expect(parsedOutput).toContain('day of month  31');
      expect(parsedOutput).toContain('month         12');
      expect(parsedOutput).toContain('day of week   7');
    });

    test('handles whitespace in expression', () => {
      const whitespaceExpression = '  0   12   *   *   1-5   /usr/bin/test  ';
      const parsedOutput = cronParser.parse(whitespaceExpression);
      expect(parsedOutput).toContain('minute        0');
      expect(parsedOutput).toContain('hour          12');
      expect(parsedOutput).toContain('day of week   1 2 3 4 5');
      expect(parsedOutput).toContain('command       /usr/bin/test');
    });
  });

  describe('Error handling', () => {
    test('throws error for insufficient fields', () => {
      expect(() => cronParser.parse('0 12 * *')).toThrow('Invalid cron expression: must have 5 time fields and a command');
      expect(() => cronParser.parse('0 12')).toThrow('Invalid cron expression: must have 5 time fields and a command');
      expect(() => cronParser.parse('')).toThrow('Invalid cron expression: must have 5 time fields and a command');
    });

    test('throws error for out of range values', () => {
      expect(() => cronParser.parse('60 * * * * /test')).toThrow('Invalid value: 60');
      expect(() => cronParser.parse('* 24 * * * /test')).toThrow('Invalid value: 24');
      expect(() => cronParser.parse('* * 0 * * /test')).toThrow('Invalid value: 0');
      expect(() => cronParser.parse('* * 32 * * /test')).toThrow('Invalid value: 32');
      expect(() => cronParser.parse('* * * 0 * /test')).toThrow('Invalid value: 0');
      expect(() => cronParser.parse('* * * 13 * /test')).toThrow('Invalid value: 13');
      expect(() => cronParser.parse('* * * * 0 /test')).toThrow('Invalid value: 0');
      expect(() => cronParser.parse('* * * * 8 /test')).toThrow('Invalid value: 8');
    });

    test('throws error for negative values', () => {
      expect(() => cronParser.parse('-1 * * * * /test')).toThrow();
      expect(() => cronParser.parse('* -5 * * * /test')).toThrow();
    });

    test('throws error for non-numeric values', () => {
      expect(() => cronParser.parse('abc * * * * /test')).toThrow('Invalid value: abc');
      expect(() => cronParser.parse('* xyz * * * /test')).toThrow('Invalid value: xyz');
    });

    test('handles ranges correctly', () => {
      const validRange = '3-5 10-12 * * * /test';
      const parsedOutput = cronParser.parse(validRange);
      expect(parsedOutput).toContain('minute        3 4 5');
      expect(parsedOutput).toContain('hour          10 11 12');
    });
  });

  describe('Output formatting', () => {
    test('ensures proper field name padding', () => {
      const expression = '0 0 1 1 1 /test';
      const parsedOutput = cronParser.parse(expression);
      const lines = parsedOutput.split('\n');
      
      lines.forEach(line => {
        const fieldName = line.substring(0, 14);
        expect(fieldName.length).toBe(14);
      });
    });

    test('ensures proper line structure', () => {
      const expression = '*/15 0 1,15 * 1-5 /usr/bin/find';
      const parsedOutput = cronParser.parse(expression);
      const lines = parsedOutput.split('\n');
      
      expect(lines).toHaveLength(6);
      expect(lines[0]).toMatch(/^minute\s+/);
      expect(lines[1]).toMatch(/^hour\s+/);
      expect(lines[2]).toMatch(/^day of month\s+/);
      expect(lines[3]).toMatch(/^month\s+/);
      expect(lines[4]).toMatch(/^day of week\s+/);
      expect(lines[5]).toMatch(/^command\s+/);
    });
  });
});