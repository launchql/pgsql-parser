export class SqlFormatter {
  private newlineChar: string;
  private tabChar: string;

  constructor(newlineChar: string = '\n', tabChar: string = '  ') {
    this.newlineChar = newlineChar;
    this.tabChar = tabChar;
  }

  format(parts: string[], separator: string = ' '): string {
    return parts.filter(part => part !== null && part !== undefined && part !== '').join(separator);
  }

  indent(text: string, count: number = 1): string {
    return text;
  }

  parens(content: string): string {
    return `(${content})`;
  }

  newline(): string {
    return this.newlineChar;
  }

  tab(): string {
    return this.tabChar;
  }
}
