# Cron Expression Parser

A command-line application that parses cron expressions and expands each field to show the times at which it will run.

## Requirements Met

✅ Standard 5-field cron format (minute, hour, day of month, month, day of week) + command  
✅ No external cron parser libraries used  
✅ Single command line argument input  
✅ Formatted table output with 14-character field names  

## Setup & Usage

```bash
# Install and build
npm install
npm run build

# Run with cron expression
npm start "*/15 0 1,15 * 1-5 /usr/bin/find"
```

## Expected Output

```
minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       /usr/bin/find
```

## Supported Syntax

- `*` - All values
- `5` - Specific value  
- `1-5` - Range
- `1,15` - List
- `*/15` - Step values
- `10-50/10` - Range with steps

## Testing

```bash
npm test
```

## Project Structure

```
src/
├── index.ts          # CLI entry point
├── cronParser.ts     # Core parsing logic
└── cronParser.test.ts # Test suite
```

## Field Ranges

| Field | Range | 
|-------|-------|
| Minute | 0-59 |
| Hour | 0-23 |
| Day of Month | 1-31 |
| Month | 1-12 |
| Day of Week | 1-7 |