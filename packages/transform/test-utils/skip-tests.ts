export type SkipTest = [
    versionPrevious: number,
    versionNext: number,
    test: string,
    reason: string
];

export const skipTests: SkipTest[] = [
    [15, 16, "latest/postgres/create_am-62.sql", "PG15 parser fails with 'syntax error at or near 'DEFAULT'"],
    [15, 16, "latest/postgres/create_am-65.sql", "PG15 parser fails with 'syntax error at or near 'DEFAULT'"],
    [15, 16, "latest/postgres/create_am-74.sql", "PG15 parser fails with 'syntax error at or near 'DEFAULT'"],
    [15, 16, "latest/postgres/create_am-96.sql", "PG15 parser fails with 'syntax error at or near 'DEFAULT'"],
    [15, 16, "latest/postgres/create_am-106.sql", "PG15 parser fails with 'syntax error at or near 'DEFAULT'"],
    [15, 16, "latest/postgres/create_am-109.sql", "PG15 parser fails with 'syntax error at or near 'DEFAULT'"],
    /////
    [13, 14, "latest/postgres/create_am-53.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-55.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-57.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-62.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-65.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-70.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-73.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-74.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-75.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-86.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-90.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-94.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-96.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-104.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-106.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-109.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
    [13, 14, "latest/postgres/create_am-112.sql", "PG13 parser fails with 'syntax error at or near 'ACCESS'"],
];
