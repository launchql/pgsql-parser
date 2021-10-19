CREATE AGGREGATE group_concat(text) (
    SFUNC = _group_concat,
    STYPE = text
);