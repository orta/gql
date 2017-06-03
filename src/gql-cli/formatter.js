/* @flow */
import fs from 'fs';
import chalk from 'chalk';
import plur from 'plur';
import logSymbols from 'log-symbols';
import codeFrame from 'code-frame';
import { type GQLError } from 'gql-shared/GQLError';

export default function formatter(results: Array<GQLError>) {
  if (!results || !results.length) {
    return 'Found 0 errors.';
  }

  let errorCount = 0;
  let warningCount = 0;

  const filesOutput = results.map(({ message, locations, severity }) => {
    let symbol = '';
    if (severity === 'warn') {
      symbol = logSymbols.warning;
      warningCount += 1;
    } else if (severity === 'error') {
      symbol = logSymbols.error;
      errorCount += 1;
    }

    const loc = locations ? locations[0] : null;
    const messagesOutput =
      ` ${symbol} ${message}` +
      `${loc
        ? `\n${chalk.dim(
            codeFrame(fs.readFileSync(loc.path, 'utf8'), loc.line, loc.column, {
              frameSize: 4,
              tabSize: 1,
            }),
          )}`
        : ''}`;

    const filename = loc
      ? chalk.underline(`${loc.path}(${loc.line},${loc.column})`)
      : '';
    return `  ${filename}\n\n${messagesOutput}`;
  });

  let finalOutput = `${filesOutput.filter(s => s).join('\n\n\n')}\n\n`;

  if (errorCount > 0) {
    finalOutput += `  ${chalk.red(
      `${errorCount}  ${plur('error', errorCount)}`,
    )}\n`;
  }

  if (warningCount > 0) {
    finalOutput += `  ${chalk.yellow(
      `${warningCount} ${plur('warning', warningCount)}`,
    )}\n`;
  }

  return errorCount + warningCount > 0 ? finalOutput : '';
}
