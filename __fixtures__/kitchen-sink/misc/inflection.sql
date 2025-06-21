CREATE SCHEMA inflection;

GRANT USAGE ON SCHEMA inflection TO PUBLIC;

ALTER DEFAULT PRIVILEGES IN SCHEMA inflection 
 GRANT EXECUTE ON FUNCTIONS  TO PUBLIC;

CREATE FUNCTION inflection.no_consecutive_caps_till_end ( str text ) RETURNS text AS $EOFCODE$
DECLARE
  result text[];
  temp text;
BEGIN
    FOR result IN
    SELECT regexp_matches(str, E'([A-Z])([A-Z]+$)', 'g')
      LOOP
        temp = result[1] || lower(result[2]);
        str = replace(str, result[1] || result[2], temp);
      END LOOP;
  return str;
END;
$EOFCODE$ LANGUAGE plpgsql STABLE;

CREATE FUNCTION inflection.no_consecutive_caps_till_lower ( str text ) RETURNS text AS $EOFCODE$
DECLARE
  result text[];
  temp text;
BEGIN
    FOR result IN
    SELECT regexp_matches(str, E'([A-Z])([A-Z]+)[A-Z][a-z]', 'g')
      LOOP
        temp = result[1] || lower(result[2]);
        str = replace(str, result[1] || result[2], temp);
      END LOOP;

  return str;
END;
$EOFCODE$ LANGUAGE plpgsql STABLE;

CREATE FUNCTION inflection.no_consecutive_caps ( str text ) RETURNS text AS $EOFCODE$
  select inflection.no_consecutive_caps_till_lower(inflection.no_consecutive_caps_till_end(str));
$EOFCODE$ LANGUAGE sql STABLE;

CREATE FUNCTION inflection.pg_slugify ( value text, allow_unicode boolean ) RETURNS text AS $EOFCODE$
  WITH normalized AS (
    SELECT
      CASE WHEN allow_unicode THEN
        value
      ELSE
        unaccent (value)
      END AS value
),
no_consecutive_caps AS (
  SELECT
    inflection.no_consecutive_caps (value) AS value
FROM
  normalized
),
remove_chars AS (
  SELECT
    regexp_replace(value, E'[^\\w\\s-]', '', 'gi') AS value
FROM
  no_consecutive_caps
),
trimmed AS (
  SELECT
    trim(value) AS value
FROM
  remove_chars
),
hyphenated AS (
  SELECT
    regexp_replace(value, E'[-\\s]+', '-', 'gi') AS value
FROM
  trimmed
),
underscored AS (
  SELECT
    regexp_replace(value, E'[-]+', '_', 'gi') AS value
FROM
  hyphenated
),
removedups AS (
  SELECT
    regexp_replace(value, E'[_]+', '_', 'gi') AS value
FROM
  underscored
)
SELECT
  value
FROM
  removedups;
$EOFCODE$ LANGUAGE sql STRICT IMMUTABLE;

CREATE FUNCTION inflection.pg_slugify (  text ) RETURNS text AS $EOFCODE$SELECT inflection.pg_slugify($1, false)$EOFCODE$ LANGUAGE sql IMMUTABLE;

CREATE FUNCTION inflection.no_single_underscores_in_beginning ( str text ) RETURNS text AS $EOFCODE$
DECLARE
  result text[];
  temp text;
BEGIN
    FOR result IN
    SELECT regexp_matches(str, E'(^[a-z])(_)', 'g')
      LOOP
        str = replace(str, result[1] || result[2], result[1]);
      END LOOP;
  return str;
END;
$EOFCODE$ LANGUAGE plpgsql STABLE;

CREATE FUNCTION inflection.no_single_underscores_at_end ( str text ) RETURNS text AS $EOFCODE$
DECLARE
  result text[];
  temp text;
BEGIN
    FOR result IN
    SELECT regexp_matches(str, E'(_)([a-z]$)', 'g')
      LOOP
        str = replace(str, result[1] || result[2], result[2]);
      END LOOP;

  return str;
END;
$EOFCODE$ LANGUAGE plpgsql STABLE;

CREATE FUNCTION inflection.no_single_underscores_in_middle ( str text ) RETURNS text AS $EOFCODE$
DECLARE
  result text[];
  temp text;
BEGIN
    FOR result IN
    SELECT regexp_matches(str, E'(_)([a-z]_)', 'g')
      LOOP
        str = replace(str, result[1] || result[2], result[2]);
      END LOOP;

  return str;
END;
$EOFCODE$ LANGUAGE plpgsql STABLE;

CREATE FUNCTION inflection.no_single_underscores ( str text ) RETURNS text AS $EOFCODE$
  select 
    inflection.no_single_underscores_in_middle(inflection.no_single_underscores_at_end(inflection.no_single_underscores_in_beginning(str)));
$EOFCODE$ LANGUAGE sql STABLE;

CREATE FUNCTION inflection.underscore ( str text ) RETURNS text AS $EOFCODE$
  WITH slugged AS (
    SELECT
      inflection.pg_slugify(str) AS value
),
convertedupper AS (
  SELECT
    lower(regexp_replace(value, E'([A-Z])', E'\_\\1', 'g')) AS value
  FROM
    slugged
),
noprefix AS (
  SELECT
    regexp_replace(value, E'^_', '', 'g') AS value
  FROM
    convertedupper
),
removedups AS (
  SELECT
    regexp_replace(value, E'[_]+', '_', 'gi') AS value
FROM
  noprefix
),
stripedges AS (
  SELECT
    regexp_replace(regexp_replace(value, E'([A-Z])_$', E'\\1', 'gi'), E'^_([A-Z])', E'\\1', 'gi') AS value
FROM
  removedups
),
nosingles AS (
  SELECT
    inflection.no_single_underscores(value) AS value
FROM
  stripedges
)
SELECT
  value
FROM
  nosingles;
$EOFCODE$ LANGUAGE sql IMMUTABLE;

CREATE FUNCTION inflection.camel ( str text ) RETURNS text AS $EOFCODE$
DECLARE
  result text[];
BEGIN
    str = inflection.underscore(str);
    FOR result IN
    SELECT regexp_matches(str,  E'(_[a-zA-Z0-9])', 'g')
      LOOP
        str = replace(str, result[1], upper(result[1]));
      END LOOP;
  return regexp_replace(substring(str FROM 1 FOR 1) || substring(str FROM 2 FOR length(str)), E'[_]+', '', 'gi');
END;
$EOFCODE$ LANGUAGE plpgsql STABLE;

CREATE FUNCTION inflection.dashed ( str text ) RETURNS text AS $EOFCODE$
  WITH underscored AS (
    SELECT
      inflection.underscore(str) AS value
),
dashes AS (
  SELECT
    regexp_replace(value, '_', '-', 'gi') AS value
  FROM
    underscored
)
SELECT
  value
FROM
  dashes;
$EOFCODE$ LANGUAGE sql IMMUTABLE;

CREATE FUNCTION inflection.pascal ( str text ) RETURNS text AS $EOFCODE$
DECLARE
  result text[];
BEGIN
    str = inflection.camel(str);
  return upper(substring(str FROM 1 FOR 1)) || substring(str FROM 2 FOR length(str));
END;
$EOFCODE$ LANGUAGE plpgsql STABLE;

CREATE TABLE inflection.inflection_rules (
 	id uuid PRIMARY KEY DEFAULT ( uuid_generate_v4() ),
	type text,
	test text,
	replacement text 
);

GRANT SELECT ON TABLE inflection.inflection_rules TO PUBLIC;

CREATE FUNCTION inflection.plural ( str text ) RETURNS text AS $EOFCODE$
DECLARE
  result record;
  matches text[];
BEGIN
    FOR result IN
    SELECT * FROM inflection.inflection_rules where type='plural'
      LOOP
        matches = regexp_matches(str, result.test, 'gi');
        IF (array_length(matches, 1) > 0) THEN
           IF (result.replacement IS NULL) THEN
				return str;        
           END IF;
           str = regexp_replace(str, result.test, result.replacement, 'gi');
           return str;
        END IF;
      END LOOP;
  return str;
END;
$EOFCODE$ LANGUAGE plpgsql IMMUTABLE;

CREATE FUNCTION inflection.uncountable_words (  ) RETURNS text[] AS $EOFCODE$
select ARRAY[ 'accommodation', 'adulthood', 'advertising', 'advice', 'aggression', 'aid', 'air', 'aircraft', 'alcohol', 'anger', 'applause', 'arithmetic', 'assistance', 'athletics', 'bacon', 'baggage', 'beef', 'biology', 'blood', 'botany', 'bread', 'butter', 'carbon', 'cardboard', 'cash', 'chalk', 'chaos', 'chess', 'crossroads', 'countryside', 'dancing', 'deer', 'dignity', 'dirt', 'dust', 'economics', 'education', 'electricity', 'engineering', 'enjoyment', 'envy', 'equipment', 'ethics', 'evidence', 'evolution', 'fame', 'fiction', 'flour', 'flu', 'food', 'fuel', 'fun', 'furniture', 'gallows', 'garbage', 'garlic', 'genetics', 'gold', 'golf', 'gossip', 'grammar', 'gratitude', 'grief', 'guilt', 'gymnastics', 'happiness', 'hardware', 'harm', 'hate', 'hatred', 'health', 'heat', 'help', 'homework', 'honesty', 'honey', 'hospitality', 'housework', 'humour', 'hunger', 'hydrogen', 'ice', 'importance', 'inflation', 'information', 'innocence', 'iron', 'irony', 'jam', 'jewelry', 'judo', 'karate', 'knowledge', 'lack', 'laughter', 'lava', 'leather', 'leisure', 'lightning', 'linguine', 'linguini', 'linguistics', 'literature', 'litter', 'livestock', 'logic', 'loneliness', 'luck', 'luggage', 'macaroni', 'machinery', 'magic', 'management', 'mankind', 'marble', 'mathematics', 'mayonnaise', 'measles', 'methane', 'milk', 'minus', 'money', 'mud', 'music', 'mumps', 'nature', 'news', 'nitrogen', 'nonsense', 'nurture', 'nutrition', 'obedience', 'obesity', 'oxygen', 'pasta', 'patience', 'physics', 'poetry', 'pollution', 'poverty', 'pride', 'psychology', 'publicity', 'punctuation', 'quartz', 'racism', 'relaxation', 'reliability', 'research', 'respect', 'revenge', 'rice', 'rubbish', 'rum', 'safety', 'scenery', 'seafood', 'seaside', 'series', 'shame', 'sheep', 'shopping', 'sleep', 'smoke', 'smoking', 'snow', 'soap', 'software', 'soil', 'spaghetti', 'species', 'steam', 'stuff', 'stupidity', 'sunshine', 'symmetry', 'tennis', 'thirst', 'thunder', 'timber', 'traffic', 'transportation', 'trust', 'underwear', 'unemployment', 'unity', 'validity', 'veal', 'vegetation', 'vegetarianism', 'vengeance', 'violence', 'vitality', 'warmth', 'wealth', 'weather', 'welfare', 'wheat', 'wildlife', 'wisdom', 'yoga', 'zinc', 'zoology' ];
$EOFCODE$ LANGUAGE sql IMMUTABLE;

CREATE FUNCTION inflection.should_skip_uncountable ( str text ) RETURNS boolean AS $EOFCODE$
  SELECT
    str = ANY (inflection.uncountable_words ());
$EOFCODE$ LANGUAGE sql IMMUTABLE;

CREATE FUNCTION inflection.singular ( str text ) RETURNS text AS $EOFCODE$
DECLARE
  result record;
  matches text[];
BEGIN
    FOR result IN
    SELECT * FROM inflection.inflection_rules where type='singular'
      LOOP
        matches = regexp_matches(str, result.test, 'gi');
        IF (array_length(matches, 1) > 0) THEN
           IF (result.replacement IS NULL) THEN
				return str;        
           END IF;
           str = regexp_replace(str, result.test, result.replacement, 'gi');
           return str;
        END IF;
      END LOOP;
  return str;
END;
$EOFCODE$ LANGUAGE plpgsql IMMUTABLE;

CREATE FUNCTION inflection.slugify ( value text, allow_unicode boolean ) RETURNS text AS $EOFCODE$
  WITH normalized AS (
    SELECT
      CASE WHEN allow_unicode THEN
        value
      ELSE
        unaccent (value)
      END AS value
),
remove_chars AS (
  SELECT
    regexp_replace(value, E'[^\\w\\s-]', '', 'gi') AS value
FROM
  normalized
),
lowercase AS (
  SELECT
    lower(value) AS value
FROM
  remove_chars
),
trimmed AS (
  SELECT
    trim(value) AS value
FROM
  lowercase
),
hyphenated AS (
  SELECT
    regexp_replace(value, E'[-\\s]+', '-', 'gi') AS value
FROM
  trimmed
)
SELECT
  value
FROM
  hyphenated;
$EOFCODE$ LANGUAGE sql STRICT IMMUTABLE;

CREATE FUNCTION inflection.slugify (  text ) RETURNS text AS $EOFCODE$SELECT inflection.slugify($1, false)$EOFCODE$ LANGUAGE sql IMMUTABLE;

INSERT INTO inflection.inflection_rules ( type, test, replacement ) VALUES ('plural', '^(m|wom)en$', NULL), ('plural', '(pe)ople$', NULL), ('plural', '(child)ren$', NULL), ('plural', '([ti])a$', NULL), ('plural', '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$', NULL), ('plural', '(hi|ti)ves$', NULL), ('plural', '(curve)s$', NULL), ('plural', '([lr])ves$', NULL), ('plural', '([^fo])ves$', NULL), ('plural', '([^aeiouy]|qu)ies$', NULL), ('plural', '(s)eries$', NULL), ('plural', '(m)ovies$', NULL), ('plural', '(x|ch|ss|sh)es$', NULL), ('plural', '([m|l])ice$', NULL), ('plural', '(bus)es$', NULL), ('plural', '(o)es$', NULL), ('plural', '(shoe)s$', NULL), ('plural', '(cris|ax|test)es$', NULL), ('plural', '(octop|vir)i$', NULL), ('plural', '(alias|canvas|status|campus)es$', NULL), ('plural', '^(summons)es$', NULL), ('plural', '^(ox)en', NULL), ('plural', '(matr)ices$', NULL), ('plural', '^feet$', NULL), ('plural', '^teeth$', NULL), ('plural', '^geese$', NULL), ('plural', '(quiz)zes$', NULL), ('plural', '^(whereas)es$', NULL), ('plural', '^(criteri)a$', NULL), ('plural', '^genera$', NULL), ('plural', '^(m|wom)an$', '\1en'), ('plural', '(pe)rson$', '\1ople'), ('plural', '(child)$', '\1ren'), ('plural', '^(ox)$', '\1en'), ('plural', '(ax|test)is$', '\1es'), ('plural', '(octop|vir)us$', '\1i'), ('plural', '(alias|status|canvas|campus)$', '\1es'), ('plural', '^(summons)$', '\1es'), ('plural', '(bu)s$', '\1ses'), ('plural', '(buffal|tomat|potat)o$', '\1oes'), ('plural', '([ti])um$', '\1a'), ('plural', 'sis$', 'ses'), ('plural', '(?:([^f])fe|([lr])f)$', '\1\2ves'), ('plural', '(hi|ti)ve$', '\1ves'), ('plural', '([^aeiouy]|qu)y$', '\1ies'), ('plural', '(matr)ix$', '\1ices'), ('plural', '(vert|ind)ex$', '\1ices'), ('plural', '(x|ch|ss|sh)$', '\1es'), ('plural', '([m|l])ouse$', '\1ice'), ('plural', '^foot$', 'feet'), ('plural', '^tooth$', 'teeth'), ('plural', '^goose$', 'geese'), ('plural', '(quiz)$', '\1zes'), ('plural', '^(whereas)$', '\1es'), ('plural', '^(criteri)on$', '\1a'), ('plural', '^genus$', 'genera'), ('plural', 's$', 's'), ('plural', '$', 's'), ('singular', '^(m|wom)an$', NULL), ('singular', '(pe)rson$', NULL), ('singular', '(child)$', NULL), ('singular', '^(ox)$', NULL), ('singular', '(ax|test)is$', NULL), ('singular', '(octop|vir)us$', NULL), ('singular', '(alias|status|canvas|campus)$', NULL), ('singular', '^(summons)$', NULL), ('singular', '(bu)s$', NULL), ('singular', '(buffal|tomat|potat)o$', NULL), ('singular', '([ti])um$', NULL), ('singular', 'sis$', NULL), ('singular', '(?:([^f])fe|([lr])f)$', NULL), ('singular', '(hi|ti)ve$', NULL), ('singular', '([^aeiouy]|qu)y$', NULL), ('singular', '(x|ch|ss|sh)$', NULL), ('singular', '(matr)ix$', NULL), ('singular', '([m|l])ouse$', NULL), ('singular', '^foot$', NULL), ('singular', '^tooth$', NULL), ('singular', '^goose$', NULL), ('singular', '(quiz)$', NULL), ('singular', '^(whereas)$', NULL), ('singular', '^(criteri)on$', NULL), ('singular', '^genus$', NULL), ('singular', '^(m|wom)en$', '\1an'), ('singular', '(pe)ople$', '\1rson'), ('singular', '(child)ren$', '\1'), ('singular', '^genera$', 'genus'), ('singular', '^(criteri)a$', '\1on'), ('singular', '([ti])a$', '\1um'), ('singular', '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$', '\1\2sis'), ('singular', '(hi|ti)ves$', '\1ve'), ('singular', '(curve)s$', '\1'), ('singular', '([lr])ves$', '\1f'), ('singular', '([a])ves$', '\1ve'), ('singular', '([^fo])ves$', '\1fe'), ('singular', '(m)ovies$', '\1ovie'), ('singular', '([^aeiouy]|qu)ies$', '\1y'), ('singular', '(s)eries$', '\1eries'), ('singular', '(x|ch|ss|sh)es$', '\1'), ('singular', '([m|l])ice$', '\1ouse'), ('singular', '(bus)es$', '\1'), ('singular', '(o)es$', '\1'), ('singular', '(shoe)s$', '\1'), ('singular', '(cris|ax|test)es$', '\1is'), ('singular', '(octop|vir)i$', '\1us'), ('singular', '(alias|canvas|status|campus)es$', '\1'), ('singular', '^(summons)es$', '\1'), ('singular', '^(ox)en', '\1'), ('singular', '(matr)ices$', '\1ix'), ('singular', '(vert|ind)ices$', '\1ex'), ('singular', '^feet$', 'foot'), ('singular', '^teeth$', 'tooth'), ('singular', '^geese$', 'goose'), ('singular', '(quiz)zes$', '\1'), ('singular', '^(whereas)es$', '\1'), ('singular', 'ss$', 'ss'), ('singular', 's$', '');

CREATE INDEX inflection_rules_type_idx ON inflection.inflection_rules ( type );