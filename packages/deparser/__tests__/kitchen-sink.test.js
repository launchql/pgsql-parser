import { parse } from 'pgsql-parser';
import { deparse } from '../src';
import { cleanTree, cleanLines } from '../src/utils';
import { readFileSync } from 'fs';
import { sync as glob } from 'glob';

const FIXTURE_DIR = `${__dirname}/../../../__fixtures__`;

export const check = (file) => {
  const testsql = glob(`${FIXTURE_DIR}/${file}`).map((f) =>
    readFileSync(f).toString()
  )[0];
  const tree = parse(testsql);
  expect(tree).toMatchSnapshot();
  const sql = deparse(tree);
  expect(cleanLines(sql)).toMatchSnapshot();
  expect(cleanTree(parse(sql))).toEqual(cleanTree(tree));
};

it('parens', () => {
  check('parens.sql');
});

it('comment', () => {
  check('comment.sql');
});

it('drops', () => {
  check('drops.sql');
});

it('a_expr', () => {
  check('a_expr.sql');
});

it('pg_catalog', () => {
  check('pg_catalog.sql');
});

describe('kitchen sink', () => {
  it('alter', () => {
    check('alter/alter.sql');
  });
  it('default privs', () => {
    check('alter/default-privs.sql');
  });
  it('set', () => {
    check('set/custom.sql');
  });
  it('comments', () => {
    check('comments/custom.sql');
  });
  it('sequences', () => {
    check('sequences/sequences.sql');
  });
  it('policies', () => {
    check('policies/custom.sql');
  });
  it('grants', () => {
    check('grants/custom.sql');
  });
  it('types', () => {
    check('types/composite.sql');
  });
  it('domains', () => {
    check('domains/create.sql');
  });
  it('indexes', () => {
    check('indexes/custom.sql');
  });
  it('enums', () => {
    check('enums/create.sql');
  });
  it('do stmt', () => {
    check('do/custom.sql');
  });
  it('insert', () => {
    check('statements/insert.sql');
  });
  it('update', () => {
    check('statements/update.sql');
  });
  it('select', () => {
    check('statements/select.sql');
  });
  it('conflicts', () => {
    check('statements/conflicts.sql');
  });
  it('delete', () => {
    check('statements/delete.sql');
  });
  it('alias', () => {
    check('statements/alias.sql');
  });
  it('domain', () => {
    check('domains/create.sql');
  });
  describe('tables', () => {
    it('match', () => {
      check('tables/match.sql');
    });
    it('temp', () => {
      check('tables/temp.sql');
    });
    it('custom', () => {
      check('tables/custom.sql');
    });
    it('check', () => {
      check('tables/check.sql');
    });
    it('defaults', () => {
      check('tables/defaults.sql');
    });
    it('exclude', () => {
      check('tables/exclude.sql');
    });
    it('foreign', () => {
      check('tables/foreign.sql');
    });
    it('nulls', () => {
      check('tables/nulls.sql');
    });
    it('on_delete', () => {
      check('tables/on_delete.sql');
    });
    it('on_update', () => {
      check('tables/on_update.sql');
    });
    it('unique', () => {
      check('tables/unique.sql');
    });
  });
  describe('functions', () => {
    it('basic', () => {
      check('functions/basic.sql');
    });
    it('returns_table', () => {
      check('functions/returns_table.sql');
    });
    it('returns_trigger', () => {
      check('functions/returns_trigger.sql');
    });
    it('setof', () => {
      check('functions/setof.sql');
    });
  });
  describe('roles', () => {
    it('create', () => {
      check('roles/create.sql');
    });
    it('grants', () => {
      check('roles/grants.sql');
    });
  });
  describe('rules', () => {
    it('create', () => {
      check('rules/create.sql');
    });
  });
  describe('views', () => {
    it('create', () => {
      check('views/create.sql');
    });
  });
  describe('transactions', () => {
    it('begin_commit', () => {
      check('transactions/begin_commit.sql');
    });
  });
  describe('triggers', () => {
    it('create', () => {
      check('triggers/create.sql');
    });
    it('custom', () => {
      check('triggers/custom.sql');
    });
  });
  describe('fixtures', () => {
    it('complex.sql', () => {
      check('complex.sql');
    });
    it('custom.sql', () => {
      check('custom.sql');
    });
    it('param-ref.sql', () => {
      check('param-ref.sql');
    });
    it('query-001.sql', () => {
      check('query-001.sql');
    });
    it('query-002.sql', () => {
      check('query-002.sql');
    });
    it('query-003.sql', () => {
      check('query-003.sql');
    });
    it('simple.sql', () => {
      check('simple.sql');
    });
  });
  describe('upstream', () => {
    it('upstream/abstime.sql', () => {
      check('upstream/abstime.sql');
    });
    it('upstream/advisory_lock.sql', () => {
      check('upstream/advisory_lock.sql');
    });
    xit('upstream/aggregates.sql', () => {
      check('upstream/aggregates.sql');
    });
    xit('upstream/alter_generic.sql', () => {
      check('upstream/alter_generic.sql');
    });
    xit('upstream/alter_operator.sql', () => {
      check('upstream/alter_operator.sql');
    });
    xit('upstream/alter_table.sql', () => {
      check('upstream/alter_table.sql');
    });
    xit('upstream/arrays.sql', () => {
      check('upstream/arrays.sql');
    });
    xit('upstream/async.sql', () => {
      check('upstream/async.sql');
    });
    xit('upstream/bit.sql', () => {
      check('upstream/bit.sql');
    });
    it('upstream/bitmapops.sql', () => {
      check('upstream/bitmapops.sql');
    });
    it('upstream/boolean.sql', () => {
      check('upstream/boolean.sql');
    });
    xit('upstream/box.sql', () => {
      check('upstream/box.sql');
    });
    xit('upstream/brin.sql', () => {
      check('upstream/brin.sql');
    });
    xit('upstream/btree_index.sql', () => {
      check('upstream/btree_index.sql');
    });
    xit('upstream/case.sql', () => {
      check('upstream/case.sql');
    });
    it('upstream/char.sql', () => {
      check('upstream/char.sql');
    });
    it('upstream/circle.sql', () => {
      check('upstream/circle.sql');
    });
    xit('upstream/cluster.sql', () => {
      check('upstream/cluster.sql');
    });
    xit('upstream/collate.linux.utf8.sql', () => {
      check('upstream/collate.linux.utf8.sql');
    });
    xit('upstream/collate.sql', () => {
      check('upstream/collate.sql');
    });
    xit('upstream/combocid.sql', () => {
      check('upstream/combocid.sql');
    });
    it('upstream/comments.sql', () => {
      check('upstream/comments.sql');
    });
    xit('upstream/conversion.sql', () => {
      check('upstream/conversion.sql');
    });
    xit('upstream/copy2.sql', () => {
      check('upstream/copy2.sql');
    });
    xit('upstream/copydml.sql', () => {
      check('upstream/copydml.sql');
    });
    xit('upstream/copyselect.sql', () => {
      check('upstream/copyselect.sql');
    });
    xit('upstream/create_aggregate.sql', () => {
      check('upstream/create_aggregate.sql');
    });
    xit('upstream/create_am.sql', () => {
      check('upstream/create_am.sql');
    });
    xit('upstream/create_cast.sql', () => {
      check('upstream/create_cast.sql');
    });
    xit('upstream/create_function_3.sql', () => {
      check('upstream/create_function_3.sql');
    });
    xit('upstream/create_index.sql', () => {
      check('upstream/create_index.sql');
    });
    it('upstream/create_misc.sql', () => {
      check('upstream/create_misc.sql');
    });
    xit('upstream/create_operator.sql', () => {
      check('upstream/create_operator.sql');
    });
    xit('upstream/create_table.sql', () => {
      check('upstream/create_table.sql');
    });
    xit('upstream/create_table_like.sql', () => {
      check('upstream/create_table_like.sql');
    });
    xit('upstream/create_type.sql', () => {
      check('upstream/create_type.sql');
    });
    xit('upstream/create_view.sql', () => {
      check('upstream/create_view.sql');
    });
    it('upstream/date.sql', () => {
      check('upstream/date.sql');
    });
    it('upstream/dbsize.sql', () => {
      check('upstream/dbsize.sql');
    });
    it('upstream/delete.sql', () => {
      check('upstream/delete.sql');
    });
    xit('upstream/dependency.sql', () => {
      check('upstream/dependency.sql');
    });
    xit('upstream/domain.sql', () => {
      check('upstream/domain.sql');
    });
    xit('upstream/drop_if_exists.sql', () => {
      check('upstream/drop_if_exists.sql');
    });
    xit('upstream/drop_operator.sql', () => {
      check('upstream/drop_operator.sql');
    });
    xit('upstream/enum.sql', () => {
      check('upstream/enum.sql');
    });
    xit('upstream/equivclass.sql', () => {
      check('upstream/equivclass.sql');
    });
    xit('upstream/errors.sql', () => {
      check('upstream/errors.sql');
    });
    xit('upstream/event_trigger.sql', () => {
      check('upstream/event_trigger.sql');
    });
    it('upstream/float4.sql', () => {
      check('upstream/float4.sql');
    });
    it('upstream/float8.sql', () => {
      check('upstream/float8.sql');
    });
    xit('upstream/foreign_data.sql', () => {
      check('upstream/foreign_data.sql');
    });
    xit('upstream/foreign_key.sql', () => {
      check('upstream/foreign_key.sql');
    });
    xit('upstream/functional_deps.sql', () => {
      check('upstream/functional_deps.sql');
    });
    it('upstream/geometry.sql', () => {
      check('upstream/geometry.sql');
    });
    xit('upstream/gin.sql', () => {
      check('upstream/gin.sql');
    });
    xit('upstream/gist.sql', () => {
      check('upstream/gist.sql');
    });
    xit('upstream/groupingsets.sql', () => {
      check('upstream/groupingsets.sql');
    });
    xit('upstream/guc.sql', () => {
      check('upstream/guc.sql');
    });
    it('upstream/hash_index.sql', () => {
      check('upstream/hash_index.sql');
    });
    xit('upstream/horology.sql', () => {
      check('upstream/horology.sql');
    });
    it('upstream/hs_primary_extremes.sql', () => {
      check('upstream/hs_primary_extremes.sql');
    });
    it('upstream/hs_primary_setup.sql', () => {
      check('upstream/hs_primary_setup.sql');
    });
    xit('upstream/hs_standby_allowed.sql', () => {
      check('upstream/hs_standby_allowed.sql');
    });
    it('upstream/hs_standby_check.sql', () => {
      check('upstream/hs_standby_check.sql');
    });
    xit('upstream/hs_standby_disallowed.sql', () => {
      check('upstream/hs_standby_disallowed.sql');
    });
    it('upstream/hs_standby_functions.sql', () => {
      check('upstream/hs_standby_functions.sql');
    });
    xit('upstream/indirect_toast.sql', () => {
      check('upstream/indirect_toast.sql');
    });
    xit('upstream/inet.sql', () => {
      check('upstream/inet.sql');
    });
    xit('upstream/inherit.sql', () => {
      check('upstream/inherit.sql');
    });
    it('upstream/init_privs.sql', () => {
      check('upstream/init_privs.sql');
    });
    it('upstream/insert.sql', () => {
      check('upstream/insert.sql');
    });
    xit('upstream/insert_conflict.sql', () => {
      check('upstream/insert_conflict.sql');
    });
    it('upstream/int2.sql', () => {
      check('upstream/int2.sql');
    });
    it('upstream/int4.sql', () => {
      check('upstream/int4.sql');
    });
    xit('upstream/int8.sql', () => {
      check('upstream/int8.sql');
    });
    xit('upstream/interval.sql', () => {
      check('upstream/interval.sql');
    });
    xit('upstream/join.sql', () => {
      check('upstream/join.sql');
    });
    xit('upstream/json.sql', () => {
      check('upstream/json.sql');
    });
    it('upstream/json_encoding.sql', () => {
      check('upstream/json_encoding.sql');
    });
    xit('upstream/jsonb.sql', () => {
      check('upstream/jsonb.sql');
    });
    xit('upstream/limit.sql', () => {
      check('upstream/limit.sql');
    });
    it('upstream/line.sql', () => {
      check('upstream/line.sql');
    });
    xit('upstream/lock.sql', () => {
      check('upstream/lock.sql');
    });
    it('upstream/lseg.sql', () => {
      check('upstream/lseg.sql');
    });
    xit('upstream/macaddr.sql', () => {
      check('upstream/macaddr.sql');
    });
    xit('upstream/matview.sql', () => {
      check('upstream/matview.sql');
    });
    it('upstream/misc_functions.sql', () => {
      check('upstream/misc_functions.sql');
    });
    it('upstream/money.sql', () => {
      check('upstream/money.sql');
    });
    xit('upstream/name.sql', () => {
      check('upstream/name.sql');
    });
    xit('upstream/namespace.sql', () => {
      check('upstream/namespace.sql');
    });
    xit('upstream/numeric.sql', () => {
      check('upstream/numeric.sql');
    });
    xit('upstream/numeric_big.sql', () => {
      check('upstream/numeric_big.sql');
    });
    it('upstream/numerology.sql', () => {
      check('upstream/numerology.sql');
    });
    xit('upstream/object_address.sql', () => {
      check('upstream/object_address.sql');
    });
    it('upstream/oid.sql', () => {
      check('upstream/oid.sql');
    });
    it('upstream/oidjoins.sql', () => {
      check('upstream/oidjoins.sql');
    });
    xit('upstream/opr_sanity.sql', () => {
      check('upstream/opr_sanity.sql');
    });
    it('upstream/path.sql', () => {
      check('upstream/path.sql');
    });
    xit('upstream/pg_lsn.sql', () => {
      check('upstream/pg_lsn.sql');
    });
    xit('upstream/plancache.sql', () => {
      check('upstream/plancache.sql');
    });
    xit('upstream/plpgsql.sql', () => {
      check('upstream/plpgsql.sql');
    });
    xit('upstream/point.sql', () => {
      check('upstream/point.sql');
    });
    it('upstream/polygon.sql', () => {
      check('upstream/polygon.sql');
    });
    xit('upstream/polymorphism.sql', () => {
      check('upstream/polymorphism.sql');
    });
    xit('upstream/portals.sql', () => {
      check('upstream/portals.sql');
    });
    xit('upstream/portals_p2.sql', () => {
      check('upstream/portals_p2.sql');
    });
    xit('upstream/prepare.sql', () => {
      check('upstream/prepare.sql');
    });
    xit('upstream/prepared_xacts.sql', () => {
      check('upstream/prepared_xacts.sql');
    });
    xit('upstream/privileges.sql', () => {
      check('upstream/privileges.sql');
    });
    xit('upstream/psql.sql', () => {
      check('upstream/psql.sql');
    });
    xit('upstream/psql_crosstab.sql', () => {
      check('upstream/psql_crosstab.sql');
    });
    it('upstream/random.sql', () => {
      check('upstream/random.sql');
    });
    xit('upstream/rangefuncs.sql', () => {
      check('upstream/rangefuncs.sql');
    });
    xit('upstream/rangetypes.sql', () => {
      check('upstream/rangetypes.sql');
    });
    xit('upstream/regex.sql', () => {
      check('upstream/regex.sql');
    });
    xit('upstream/regproc.sql', () => {
      check('upstream/regproc.sql');
    });
    it('upstream/reltime.sql', () => {
      check('upstream/reltime.sql');
    });
    xit('upstream/replica_identity.sql', () => {
      check('upstream/replica_identity.sql');
    });
    xit('upstream/returning.sql', () => {
      check('upstream/returning.sql');
    });
    xit('upstream/roleattributes.sql', () => {
      check('upstream/roleattributes.sql');
    });
    xit('upstream/rolenames.sql', () => {
      check('upstream/rolenames.sql');
    });
    xit('upstream/rowsecurity.sql', () => {
      check('upstream/rowsecurity.sql');
    });
    xit('upstream/rowtypes.sql', () => {
      check('upstream/rowtypes.sql');
    });
    xit('upstream/rules.sql', () => {
      check('upstream/rules.sql');
    });
    xit('upstream/sanity_check.sql', () => {
      check('upstream/sanity_check.sql');
    });
    xit('upstream/security_label.sql', () => {
      check('upstream/security_label.sql');
    });
    xit('upstream/select.sql', () => {
      check('upstream/select.sql');
    });
    xit('upstream/select_distinct.sql', () => {
      check('upstream/select_distinct.sql');
    });
    it('upstream/select_distinct_on.sql', () => {
      check('upstream/select_distinct_on.sql');
    });
    it('upstream/select_having.sql', () => {
      check('upstream/select_having.sql');
    });
    it('upstream/select_implicit.sql', () => {
      check('upstream/select_implicit.sql');
    });
    xit('upstream/select_into.sql', () => {
      check('upstream/select_into.sql');
    });
    xit('upstream/select_views.sql', () => {
      check('upstream/select_views.sql');
    });
    xit('upstream/sequence.sql', () => {
      check('upstream/sequence.sql');
    });
    xit('upstream/spgist.sql', () => {
      check('upstream/spgist.sql');
    });
    xit('upstream/stats.sql', () => {
      check('upstream/stats.sql');
    });
    xit('upstream/strings.sql', () => {
      check('upstream/strings.sql');
    });
    xit('upstream/subselect.sql', () => {
      check('upstream/subselect.sql');
    });
    xit('upstream/tablesample.sql', () => {
      check('upstream/tablesample.sql');
    });
    xit('upstream/temp.sql', () => {
      check('upstream/temp.sql');
    });
    it('upstream/text.sql', () => {
      check('upstream/text.sql');
    });
    it('upstream/time.sql', () => {
      check('upstream/time.sql');
    });
    xit('upstream/timestamp.sql', () => {
      check('upstream/timestamp.sql');
    });
    xit('upstream/timestamptz.sql', () => {
      check('upstream/timestamptz.sql');
    });
    it('upstream/timetz.sql', () => {
      check('upstream/timetz.sql');
    });
    it('upstream/tinterval.sql', () => {
      check('upstream/tinterval.sql');
    });
    xit('upstream/transactions.sql', () => {
      check('upstream/transactions.sql');
    });
    xit('upstream/triggers.sql', () => {
      check('upstream/triggers.sql');
    });
    xit('upstream/truncate.sql', () => {
      check('upstream/truncate.sql');
    });
    xit('upstream/tsdicts.sql', () => {
      check('upstream/tsdicts.sql');
    });
    xit('upstream/tsearch.sql', () => {
      check('upstream/tsearch.sql');
    });
    it('upstream/tstypes.sql', () => {
      check('upstream/tstypes.sql');
    });
    it('upstream/txid.sql', () => {
      check('upstream/txid.sql');
    });
    xit('upstream/type_sanity.sql', () => {
      check('upstream/type_sanity.sql');
    });
    xit('upstream/typed_table.sql', () => {
      check('upstream/typed_table.sql');
    });
    xit('upstream/union.sql', () => {
      check('upstream/union.sql');
    });
    xit('upstream/updatable_views.sql', () => {
      check('upstream/updatable_views.sql');
    });
    xit('upstream/update.sql', () => {
      check('upstream/update.sql');
    });
    xit('upstream/uuid.sql', () => {
      check('upstream/uuid.sql');
    });
    xit('upstream/vacuum.sql', () => {
      check('upstream/vacuum.sql');
    });
    it('upstream/varchar.sql', () => {
      check('upstream/varchar.sql');
    });
    xit('upstream/window.sql', () => {
      check('upstream/window.sql');
    });
    xit('upstream/with.sql', () => {
      check('upstream/with.sql');
    });
    xit('upstream/without_oid.sql', () => {
      check('upstream/without_oid.sql');
    });
    xit('upstream/xml.sql', () => {
      check('upstream/xml.sql');
    });
    xit('upstream/xmlmap.sql', () => {
      check('upstream/xmlmap.sql');
    });
  });
});
