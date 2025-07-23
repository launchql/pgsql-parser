export class SqlFormatter {
  private newlineChar: string;
  private tabChar: string;
  private prettyMode: boolean;

  constructor(newlineChar: string = '\n', tabChar: string = '  ', prettyMode: boolean = true) {
    this.newlineChar = newlineChar;
    this.tabChar = tabChar;
    this.prettyMode = prettyMode;
  }

  format(parts: string[], separator: string = ' '): string {
    return parts.filter(part => part !== null && part !== undefined && part !== '').join(separator);
  }

  indent(text: string, count: number = 1): string {
    if (!this.prettyMode) {
      return text;
    }
    const indentation = this.tabChar.repeat(count);
    return text.split(this.newlineChar).map(line => 
      line.trim() ? indentation + line : line
    ).join(this.newlineChar);
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

  isPretty(): boolean {
    return this.prettyMode;
  }
}
