# Cron Expression Parser

Hey there! 👋 This is a simple command-line tool that takes cron expressions and shows you exactly when they'll run. No more guessing what `*/15 0 1,15 * 1-5` actually means!

## What does it do?

You know those cryptic cron expressions that look like hieroglyphics? This tool breaks them down into plain English (well, numbers) so you can actually understand when your scheduled jobs will run.

**Input:** `*/15 0 1,15 * 1-5 /usr/bin/find`

**Output:**
```
minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       /usr/bin/find
```

Much clearer, right?

## Getting Started

You'll need Node.js (version 16 or newer) on your machine. If you don't have it, grab it from [nodejs.org](https://nodejs.org/).

```bash
# Get the code
git clone <your-repo-url>
cd cron-parser

# Install stuff
npm install

# Build it
npm run build
```

## How to use it

Super simple - just pass your cron expression as a string:

```bash
npm start "*/15 0 1,15 * 1-5 /usr/bin/find"
```

Or if you've built it already:

```bash
node dist/index.js "*/15 0 1,15 * 1-5 /usr/bin/find"
```

## What cron syntax works?

I've implemented all the standard stuff you'd expect:

- **`*`** - Everything (all minutes, all hours, etc.)
- **`5`** - Just that number (minute 5, hour 5, etc.)
- **`1-5`** - A range (Monday through Friday)
- **`1,15,30`** - A list (1st, 15th, and 30th)
- **`*/15`** - Every 15th (every 15 minutes)
- **`10-50/10`** - Every 10th in a range (10, 20, 30, 40, 50)

You can mix and match these however you want!

## Try these examples

Here are some real-world examples you can test:

```bash
# Every 15 minutes during business hours on weekdays
npm start "*/15 9-17 * * 1-5 /usr/bin/check-servers"

# Daily backup at 2 AM
npm start "0 2 * * * /usr/bin/backup"

# Every Monday at 9 AM
npm start "0 9 * * 1 /usr/bin/weekly-report"

# First day of every quarter at midnight
npm start "0 0 1 1,4,7,10 * /usr/bin/quarterly-cleanup"

# Every 30 minutes, but only on weekends
npm start "*/30 * * * 6,7 /usr/bin/weekend-task"
```

## Running the tests

I wrote a bunch of tests to make sure this thing actually works:

```bash
# Run all tests
npm test

# See test coverage
npm test -- --coverage

# Watch mode (reruns tests when you change code)
npm test -- --watch
```

The tests cover:
- All the basic syntax (wildcards, ranges, lists, steps)
- Edge cases (like maximum/minimum values)
- Error handling (what happens with bad input)
- Real-world examples
- Output formatting

## What the fields mean

Just in case you're new to cron:

| Field | Range | What it is |
|-------|-------|------------|
| Minute | 0-59 | Which minute of the hour |
| Hour | 0-23 | Which hour of the day (24-hour format) |
| Day of Month | 1-31 | Which day of the month |
| Month | 1-12 | Which month (1=January, 12=December) |
| Day of Week | 1-7 | Which day of the week (1=Monday, 7=Sunday) |

## Error handling

The tool will yell at you (politely) if you give it bad input:

```bash
# Not enough fields
npm start "0 12 *"
# Error: Invalid cron expression: must have 5 time fields and a command

# Invalid values
npm start "60 * * * * /test"
# Error: Invalid value: 60

# Nonsense input
npm start "banana * * * * /test"
# Error: Invalid value: banana
```

## Development stuff

If you want to hack on this:

```bash
# Development mode (auto-reloads)
npm run dev "*/15 0 1,15 * 1-5 /usr/bin/find"

# Build for production
npm run build

# Clean up build files
npm run clean
```

The code is pretty straightforward:
- `src/index.ts` - Command line interface
- `src/cronParser.ts` - The actual parsing logic
- `src/cronParser.test.ts` - All the tests

## Why I built this

Honestly? I got tired of staring at cron expressions and trying to figure out in my head when they'd actually run. This tool does the math for you so you can focus on more important things.

No external dependencies, no bloat - just a simple parser that does one thing well.

## Contributing

Found a bug? Want to add a feature? Cool! Just:

1. Fork it
2. Make your changes
3. Add tests (seriously, please add tests)
4. Make sure everything passes: `npm test`
5. Send a pull request

## License

MIT - do whatever you want with it.

---

**Pro tip:** If you're setting up cron jobs in production, always test your expressions with this tool first. Trust me, you'll save yourself some headaches! 😅