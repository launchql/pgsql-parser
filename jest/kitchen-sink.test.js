const parser = require('../src');
import { cleanTree, cleanLines } from './utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { sync as glob } from 'glob';

const FIXTURE_DIR = `${__dirname}/../test/fixtures`;

export const check = (file) => {
  const testsql = glob(`${FIXTURE_DIR}/${file}`).map(f => readFileSync(f).toString())[0];
  const tree = parser.parse(testsql);
  expect(tree).toMatchSnapshot();
  const sql = parser.deparse(tree);
  expect(cleanLines(sql)).toMatchSnapshot();
  expect(cleanTree(parser.parse(sql))).toEqual(cleanTree(tree));
};

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
    const dosql = readFileSync(resolve(__dirname + '/../test/fixtures/do/custom.sql')).toString();
    const tree = parser.parse(dosql);
    expect(tree).toMatchSnapshot();
    const sql = parser.deparse(tree);
    expect(cleanLines(sql)).toMatchSnapshot();
    expect(cleanTree(parser.parse(cleanLines(sql)))).toEqual(cleanTree(parser.parse(cleanLines(dosql))));
  });
  it('insert', () => {
    check('statements/insert.sql');
  });
  it('update', () => {
    check('statements/update.sql');
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
  xdescribe('upstream', () => {
    it('upstream/abstime.sql', () => {
      check('upstream/abstime.sql');
    });
    it('upstream/advisory_lock.sql', () => {
      check('upstream/advisory_lock.sql');
    });
    it('upstream/aggregates.sql', () => {
      check('upstream/aggregates.sql');
    });
    it('upstream/alter_generic.sql', () => {
      check('upstream/alter_generic.sql');
    });
    it('upstream/alter_operator.sql', () => {
      check('upstream/alter_operator.sql');
    });
    it('upstream/alter_table.sql', () => {
      check('upstream/alter_table.sql');
    });
    it('upstream/arrays.sql', () => {
      check('upstream/arrays.sql');
    });
    it('upstream/async.sql', () => {
      check('upstream/async.sql');
    });
    it('upstream/bit.sql', () => {
      check('upstream/bit.sql');
    });
    it('upstream/bitmapops.sql', () => {
      check('upstream/bitmapops.sql');
    });
    it('upstream/boolean.sql', () => {
      check('upstream/boolean.sql');
    });
    it('upstream/box.sql', () => {
      check('upstream/box.sql');
    });
    it('upstream/brin.sql', () => {
      check('upstream/brin.sql');
    });
    it('upstream/btree_index.sql', () => {
      check('upstream/btree_index.sql');
    });
    it('upstream/case.sql', () => {
      check('upstream/case.sql');
    });
    it('upstream/char.sql', () => {
      check('upstream/char.sql');
    });
    it('upstream/circle.sql', () => {
      check('upstream/circle.sql');
    });
    it('upstream/cluster.sql', () => {
      check('upstream/cluster.sql');
    });
    it('upstream/collate.linux.utf8.sql', () => {
      check('upstream/collate.linux.utf8.sql');
    });
    it('upstream/collate.sql', () => {
      check('upstream/collate.sql');
    });
    it('upstream/combocid.sql', () => {
      check('upstream/combocid.sql');
    });
    it('upstream/comments.sql', () => {
      check('upstream/comments.sql');
    });
    it('upstream/conversion.sql', () => {
      check('upstream/conversion.sql');
    });
    it('upstream/copy2.sql', () => {
      check('upstream/copy2.sql');
    });
    it('upstream/copydml.sql', () => {
      check('upstream/copydml.sql');
    });
    it('upstream/copyselect.sql', () => {
      check('upstream/copyselect.sql');
    });
    it('upstream/create_aggregate.sql', () => {
      check('upstream/create_aggregate.sql');
    });
    it('upstream/create_am.sql', () => {
      check('upstream/create_am.sql');
    });
    it('upstream/create_cast.sql', () => {
      check('upstream/create_cast.sql');
    });
    it('upstream/create_function_3.sql', () => {
      check('upstream/create_function_3.sql');
    });
    it('upstream/create_index.sql', () => {
      check('upstream/create_index.sql');
    });
    it('upstream/create_misc.sql', () => {
      check('upstream/create_misc.sql');
    });
    it('upstream/create_operator.sql', () => {
      check('upstream/create_operator.sql');
    });
    it('upstream/create_table.sql', () => {
      check('upstream/create_table.sql');
    });
    it('upstream/create_table_like.sql', () => {
      check('upstream/create_table_like.sql');
    });
    it('upstream/create_type.sql', () => {
      check('upstream/create_type.sql');
    });
    it('upstream/create_view.sql', () => {
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
    it('upstream/dependency.sql', () => {
      check('upstream/dependency.sql');
    });
    it('upstream/domain.sql', () => {
      check('upstream/domain.sql');
    });
    it('upstream/drop_if_exists.sql', () => {
      check('upstream/drop_if_exists.sql');
    });
    it('upstream/drop_operator.sql', () => {
      check('upstream/drop_operator.sql');
    });
    it('upstream/enum.sql', () => {
      check('upstream/enum.sql');
    });
    it('upstream/equivclass.sql', () => {
      check('upstream/equivclass.sql');
    });
    it('upstream/errors.sql', () => {
      check('upstream/errors.sql');
    });
    it('upstream/event_trigger.sql', () => {
      check('upstream/event_trigger.sql');
    });
    it('upstream/float4.sql', () => {
      check('upstream/float4.sql');
    });
    it('upstream/float8.sql', () => {
      check('upstream/float8.sql');
    });
    it('upstream/foreign_data.sql', () => {
      check('upstream/foreign_data.sql');
    });
    it('upstream/foreign_key.sql', () => {
      check('upstream/foreign_key.sql');
    });
    it('upstream/functional_deps.sql', () => {
      check('upstream/functional_deps.sql');
    });
    it('upstream/geometry.sql', () => {
      check('upstream/geometry.sql');
    });
    it('upstream/gin.sql', () => {
      check('upstream/gin.sql');
    });
    it('upstream/gist.sql', () => {
      check('upstream/gist.sql');
    });
    it('upstream/groupingsets.sql', () => {
      check('upstream/groupingsets.sql');
    });
    it('upstream/guc.sql', () => {
      check('upstream/guc.sql');
    });
    it('upstream/hash_index.sql', () => {
      check('upstream/hash_index.sql');
    });
    it('upstream/horology.sql', () => {
      check('upstream/horology.sql');
    });
    it('upstream/hs_primary_extremes.sql', () => {
      check('upstream/hs_primary_extremes.sql');
    });
    it('upstream/hs_primary_setup.sql', () => {
      check('upstream/hs_primary_setup.sql');
    });
    it('upstream/hs_standby_allowed.sql', () => {
      check('upstream/hs_standby_allowed.sql');
    });
    it('upstream/hs_standby_check.sql', () => {
      check('upstream/hs_standby_check.sql');
    });
    it('upstream/hs_standby_disallowed.sql', () => {
      check('upstream/hs_standby_disallowed.sql');
    });
    it('upstream/hs_standby_functions.sql', () => {
      check('upstream/hs_standby_functions.sql');
    });
    it('upstream/indirect_toast.sql', () => {
      check('upstream/indirect_toast.sql');
    });
    it('upstream/inet.sql', () => {
      check('upstream/inet.sql');
    });
    it('upstream/inherit.sql', () => {
      check('upstream/inherit.sql');
    });
    it('upstream/init_privs.sql', () => {
      check('upstream/init_privs.sql');
    });
    it('upstream/insert.sql', () => {
      check('upstream/insert.sql');
    });
    it('upstream/insert_conflict.sql', () => {
      check('upstream/insert_conflict.sql');
    });
    it('upstream/int2.sql', () => {
      check('upstream/int2.sql');
    });
    it('upstream/int4.sql', () => {
      check('upstream/int4.sql');
    });
    it('upstream/int8.sql', () => {
      check('upstream/int8.sql');
    });
    it('upstream/interval.sql', () => {
      check('upstream/interval.sql');
    });
    it('upstream/join.sql', () => {
      check('upstream/join.sql');
    });
    it('upstream/json.sql', () => {
      check('upstream/json.sql');
    });
    it('upstream/json_encoding.sql', () => {
      check('upstream/json_encoding.sql');
    });
    it('upstream/jsonb.sql', () => {
      check('upstream/jsonb.sql');
    });
    it('upstream/limit.sql', () => {
      check('upstream/limit.sql');
    });
    it('upstream/line.sql', () => {
      check('upstream/line.sql');
    });
    it('upstream/lock.sql', () => {
      check('upstream/lock.sql');
    });
    it('upstream/lseg.sql', () => {
      check('upstream/lseg.sql');
    });
    it('upstream/macaddr.sql', () => {
      check('upstream/macaddr.sql');
    });
    it('upstream/matview.sql', () => {
      check('upstream/matview.sql');
    });
    it('upstream/misc_functions.sql', () => {
      check('upstream/misc_functions.sql');
    });
    it('upstream/money.sql', () => {
      check('upstream/money.sql');
    });
    it('upstream/name.sql', () => {
      check('upstream/name.sql');
    });
    it('upstream/namespace.sql', () => {
      check('upstream/namespace.sql');
    });
    it('upstream/numeric.sql', () => {
      check('upstream/numeric.sql');
    });
    it('upstream/numeric_big.sql', () => {
      check('upstream/numeric_big.sql');
    });
    it('upstream/numerology.sql', () => {
      check('upstream/numerology.sql');
    });
    it('upstream/object_address.sql', () => {
      check('upstream/object_address.sql');
    });
    it('upstream/oid.sql', () => {
      check('upstream/oid.sql');
    });
    it('upstream/oidjoins.sql', () => {
      check('upstream/oidjoins.sql');
    });
    it('upstream/opr_sanity.sql', () => {
      check('upstream/opr_sanity.sql');
    });
    it('upstream/path.sql', () => {
      check('upstream/path.sql');
    });
    it('upstream/pg_lsn.sql', () => {
      check('upstream/pg_lsn.sql');
    });
    it('upstream/plancache.sql', () => {
      check('upstream/plancache.sql');
    });
    it('upstream/plpgsql.sql', () => {
      check('upstream/plpgsql.sql');
    });
    it('upstream/point.sql', () => {
      check('upstream/point.sql');
    });
    it('upstream/polygon.sql', () => {
      check('upstream/polygon.sql');
    });
    it('upstream/polymorphism.sql', () => {
      check('upstream/polymorphism.sql');
    });
    it('upstream/portals.sql', () => {
      check('upstream/portals.sql');
    });
    it('upstream/portals_p2.sql', () => {
      check('upstream/portals_p2.sql');
    });
    it('upstream/prepare.sql', () => {
      check('upstream/prepare.sql');
    });
    it('upstream/prepared_xacts.sql', () => {
      check('upstream/prepared_xacts.sql');
    });
    it('upstream/privileges.sql', () => {
      check('upstream/privileges.sql');
    });
    it('upstream/psql.sql', () => {
      check('upstream/psql.sql');
    });
    it('upstream/psql_crosstab.sql', () => {
      check('upstream/psql_crosstab.sql');
    });
    it('upstream/random.sql', () => {
      check('upstream/random.sql');
    });
    it('upstream/rangefuncs.sql', () => {
      check('upstream/rangefuncs.sql');
    });
    it('upstream/rangetypes.sql', () => {
      check('upstream/rangetypes.sql');
    });
    it('upstream/regex.sql', () => {
      check('upstream/regex.sql');
    });
    it('upstream/regproc.sql', () => {
      check('upstream/regproc.sql');
    });
    it('upstream/reltime.sql', () => {
      check('upstream/reltime.sql');
    });
    it('upstream/replica_identity.sql', () => {
      check('upstream/replica_identity.sql');
    });
    it('upstream/returning.sql', () => {
      check('upstream/returning.sql');
    });
    it('upstream/roleattributes.sql', () => {
      check('upstream/roleattributes.sql');
    });
    it('upstream/rolenames.sql', () => {
      check('upstream/rolenames.sql');
    });
    it('upstream/rowsecurity.sql', () => {
      check('upstream/rowsecurity.sql');
    });
    it('upstream/rowtypes.sql', () => {
      check('upstream/rowtypes.sql');
    });
    it('upstream/rules.sql', () => {
      check('upstream/rules.sql');
    });
    it('upstream/sanity_check.sql', () => {
      check('upstream/sanity_check.sql');
    });
    it('upstream/security_label.sql', () => {
      check('upstream/security_label.sql');
    });
    it('upstream/select.sql', () => {
      check('upstream/select.sql');
    });
    it('upstream/select_distinct.sql', () => {
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
    it('upstream/select_into.sql', () => {
      check('upstream/select_into.sql');
    });
    it('upstream/select_views.sql', () => {
      check('upstream/select_views.sql');
    });
    it('upstream/sequence.sql', () => {
      check('upstream/sequence.sql');
    });
    it('upstream/spgist.sql', () => {
      check('upstream/spgist.sql');
    });
    it('upstream/stats.sql', () => {
      check('upstream/stats.sql');
    });
    it('upstream/strings.sql', () => {
      check('upstream/strings.sql');
    });
    it('upstream/subselect.sql', () => {
      check('upstream/subselect.sql');
    });
    it('upstream/tablesample.sql', () => {
      check('upstream/tablesample.sql');
    });
    it('upstream/temp.sql', () => {
      check('upstream/temp.sql');
    });
    it('upstream/text.sql', () => {
      check('upstream/text.sql');
    });
    it('upstream/time.sql', () => {
      check('upstream/time.sql');
    });
    it('upstream/timestamp.sql', () => {
      check('upstream/timestamp.sql');
    });
    it('upstream/timestamptz.sql', () => {
      check('upstream/timestamptz.sql');
    });
    it('upstream/timetz.sql', () => {
      check('upstream/timetz.sql');
    });
    it('upstream/tinterval.sql', () => {
      check('upstream/tinterval.sql');
    });
    it('upstream/transactions.sql', () => {
      check('upstream/transactions.sql');
    });
    it('upstream/triggers.sql', () => {
      check('upstream/triggers.sql');
    });
    it('upstream/truncate.sql', () => {
      check('upstream/truncate.sql');
    });
    it('upstream/tsdicts.sql', () => {
      check('upstream/tsdicts.sql');
    });
    it('upstream/tsearch.sql', () => {
      check('upstream/tsearch.sql');
    });
    it('upstream/tstypes.sql', () => {
      check('upstream/tstypes.sql');
    });
    it('upstream/txid.sql', () => {
      check('upstream/txid.sql');
    });
    it('upstream/type_sanity.sql', () => {
      check('upstream/type_sanity.sql');
    });
    it('upstream/typed_table.sql', () => {
      check('upstream/typed_table.sql');
    });
    it('upstream/union.sql', () => {
      check('upstream/union.sql');
    });
    it('upstream/updatable_views.sql', () => {
      check('upstream/updatable_views.sql');
    });
    it('upstream/update.sql', () => {
      check('upstream/update.sql');
    });
    it('upstream/uuid.sql', () => {
      check('upstream/uuid.sql');
    });
    it('upstream/vacuum.sql', () => {
      check('upstream/vacuum.sql');
    });
    it('upstream/varchar.sql', () => {
      check('upstream/varchar.sql');
    });
    it('upstream/window.sql', () => {
      check('upstream/window.sql');
    });
    it('upstream/with.sql', () => {
      check('upstream/with.sql');
    });
    it('upstream/without_oid.sql', () => {
      check('upstream/without_oid.sql');
    });
    it('upstream/xml.sql', () => {
      check('upstream/xml.sql');
    });
    it('upstream/xmlmap.sql', () => {
      check('upstream/xmlmap.sql');
    });
  });
});
