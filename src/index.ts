#!/usr/bin/env node

import { CronParser } from './cronParser';

function main() {
  const commandLineArguments = process.argv.slice(2);
  
  if (commandLineArguments.length !== 1) {
    console.error('Usage: cron-parser "<cron-expression>"');
    process.exit(1);
  }

  try {
    const cronParser = new CronParser();
    const cronExpression = commandLineArguments[0];
    const parsedOutput = cronParser.parse(cronExpression);
    console.log(parsedOutput);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error:', errorMessage);
    process.exit(1);
  }
}

main();