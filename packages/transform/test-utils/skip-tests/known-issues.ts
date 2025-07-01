import { SkipTest } from "./types";

export const knownIssues: SkipTest[] = [
    // PG13-PG16 treated \v as 'v'
    // PG17 treats \v as '\u000b'
    // So yes — PG17 fixed a real bug, and the current output with \u000b is the spec-compliant behavior.
    [16, 17, "misc/quotes_etc-26.sql", "16-17 Parser-level \v character escape sequence difference: PG16 parser outputs 'v' but PG17 parser outputs '\u000b' (vertical tab)"],
];  