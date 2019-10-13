const parser = require('../src');
import { cleanTree, cleanLines } from './utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { sync as glob } from 'glob';

const FIXTURE_DIR = `${__dirname}/../test/fixtures`;

export const check = (file) => {
  const testsql = glob(`${FIXTURE_DIR}/${file}`).map(f => readFileSync(f).toString());
  const tree = parser.parse(testsql);
  expect(tree).toMatchSnapshot();
  const sql = parser.deparse(tree.query);
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
    const sql = parser.deparse(tree.query);
    expect(cleanLines(sql)).toMatchSnapshot();
    expect(cleanTree(parser.parse(cleanLines(sql)))).toEqual(cleanTree(parser.parse(cleanLines(dosql))));
  });
  it('insert', () => {
    check('statements/insert.sql');
  });
  it('domain', () => {
    check('domains/create.sql');
  });
  describe('tables', () => {
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
      check('upstream/upstream/abstime.sql');
    });
    it('upstream/advisory_lock.sql', () => {
      check('upstream/upstream/advisory_lock.sql');
    });
    it('upstream/aggregates.sql', () => {
      check('upstream/upstream/aggregates.sql');
    });
    it('upstream/alter_generic.sql', () => {
      check('upstream/upstream/alter_generic.sql');
    });
    it('upstream/alter_operator.sql', () => {
      check('upstream/upstream/alter_operator.sql');
    });
    it('upstream/alter_table.sql', () => {
      check('upstream/upstream/alter_table.sql');
    });
    it('upstream/arrays.sql', () => {
      check('upstream/upstream/arrays.sql');
    });
    it('upstream/async.sql', () => {
      check('upstream/upstream/async.sql');
    });
    it('upstream/bit.sql', () => {
      check('upstream/upstream/bit.sql');
    });
    it('upstream/bitmapops.sql', () => {
      check('upstream/upstream/bitmapops.sql');
    });
    it('upstream/boolean.sql', () => {
      check('upstream/upstream/boolean.sql');
    });
    it('upstream/box.sql', () => {
      check('upstream/upstream/box.sql');
    });
    it('upstream/brin.sql', () => {
      check('upstream/upstream/brin.sql');
    });
    it('upstream/btree_index.sql', () => {
      check('upstream/upstream/btree_index.sql');
    });
    it('upstream/case.sql', () => {
      check('upstream/upstream/case.sql');
    });
    it('upstream/char.sql', () => {
      check('upstream/upstream/char.sql');
    });
    it('upstream/circle.sql', () => {
      check('upstream/upstream/circle.sql');
    });
    it('upstream/cluster.sql', () => {
      check('upstream/upstream/cluster.sql');
    });
    it('upstream/collate.linux.utf8.sql', () => {
      check('upstream/upstream/collate.linux.utf8.sql');
    });
    it('upstream/collate.sql', () => {
      check('upstream/upstream/collate.sql');
    });
    it('upstream/combocid.sql', () => {
      check('upstream/upstream/combocid.sql');
    });
    it('upstream/comments.sql', () => {
      check('upstream/upstream/comments.sql');
    });
    it('upstream/conversion.sql', () => {
      check('upstream/upstream/conversion.sql');
    });
    it('upstream/copy2.sql', () => {
      check('upstream/upstream/copy2.sql');
    });
    it('upstream/copydml.sql', () => {
      check('upstream/upstream/copydml.sql');
    });
    it('upstream/copyselect.sql', () => {
      check('upstream/upstream/copyselect.sql');
    });
    it('upstream/create_aggregate.sql', () => {
      check('upstream/upstream/create_aggregate.sql');
    });
    it('upstream/create_am.sql', () => {
      check('upstream/upstream/create_am.sql');
    });
    it('upstream/create_cast.sql', () => {
      check('upstream/upstream/create_cast.sql');
    });
    it('upstream/create_function_3.sql', () => {
      check('upstream/upstream/create_function_3.sql');
    });
    it('upstream/create_index.sql', () => {
      check('upstream/upstream/create_index.sql');
    });
    it('upstream/create_misc.sql', () => {
      check('upstream/upstream/create_misc.sql');
    });
    it('upstream/create_operator.sql', () => {
      check('upstream/upstream/create_operator.sql');
    });
    it('upstream/create_table.sql', () => {
      check('upstream/upstream/create_table.sql');
    });
    it('upstream/create_table_like.sql', () => {
      check('upstream/upstream/create_table_like.sql');
    });
    it('upstream/create_type.sql', () => {
      check('upstream/upstream/create_type.sql');
    });
    it('upstream/create_view.sql', () => {
      check('upstream/upstream/create_view.sql');
    });
    it('upstream/date.sql', () => {
      check('upstream/upstream/date.sql');
    });
    it('upstream/dbsize.sql', () => {
      check('upstream/upstream/dbsize.sql');
    });
    it('upstream/delete.sql', () => {
      check('upstream/upstream/delete.sql');
    });
    it('upstream/dependency.sql', () => {
      check('upstream/upstream/dependency.sql');
    });
    it('upstream/domain.sql', () => {
      check('upstream/upstream/domain.sql');
    });
    it('upstream/drop_if_exists.sql', () => {
      check('upstream/upstream/drop_if_exists.sql');
    });
    it('upstream/drop_operator.sql', () => {
      check('upstream/upstream/drop_operator.sql');
    });
    it('upstream/enum.sql', () => {
      check('upstream/upstream/enum.sql');
    });
    it('upstream/equivclass.sql', () => {
      check('upstream/upstream/equivclass.sql');
    });
    it('upstream/errors.sql', () => {
      check('upstream/upstream/errors.sql');
    });
    it('upstream/event_trigger.sql', () => {
      check('upstream/upstream/event_trigger.sql');
    });
    it('upstream/float4.sql', () => {
      check('upstream/upstream/float4.sql');
    });
    it('upstream/float8.sql', () => {
      check('upstream/upstream/float8.sql');
    });
    it('upstream/foreign_data.sql', () => {
      check('upstream/upstream/foreign_data.sql');
    });
    it('upstream/foreign_key.sql', () => {
      check('upstream/upstream/foreign_key.sql');
    });
    it('upstream/functional_deps.sql', () => {
      check('upstream/upstream/functional_deps.sql');
    });
    it('upstream/geometry.sql', () => {
      check('upstream/upstream/geometry.sql');
    });
    it('upstream/gin.sql', () => {
      check('upstream/upstream/gin.sql');
    });
    it('upstream/gist.sql', () => {
      check('upstream/upstream/gist.sql');
    });
    it('upstream/groupingsets.sql', () => {
      check('upstream/upstream/groupingsets.sql');
    });
    it('upstream/guc.sql', () => {
      check('upstream/upstream/guc.sql');
    });
    it('upstream/hash_index.sql', () => {
      check('upstream/upstream/hash_index.sql');
    });
    it('upstream/horology.sql', () => {
      check('upstream/upstream/horology.sql');
    });
    it('upstream/hs_primary_extremes.sql', () => {
      check('upstream/upstream/hs_primary_extremes.sql');
    });
    it('upstream/hs_primary_setup.sql', () => {
      check('upstream/upstream/hs_primary_setup.sql');
    });
    it('upstream/hs_standby_allowed.sql', () => {
      check('upstream/upstream/hs_standby_allowed.sql');
    });
    it('upstream/hs_standby_check.sql', () => {
      check('upstream/upstream/hs_standby_check.sql');
    });
    it('upstream/hs_standby_disallowed.sql', () => {
      check('upstream/upstream/hs_standby_disallowed.sql');
    });
    it('upstream/hs_standby_functions.sql', () => {
      check('upstream/upstream/hs_standby_functions.sql');
    });
    it('upstream/indirect_toast.sql', () => {
      check('upstream/upstream/indirect_toast.sql');
    });
    it('upstream/inet.sql', () => {
      check('upstream/upstream/inet.sql');
    });
    it('upstream/inherit.sql', () => {
      check('upstream/upstream/inherit.sql');
    });
    it('upstream/init_privs.sql', () => {
      check('upstream/upstream/init_privs.sql');
    });
    it('upstream/insert.sql', () => {
      check('upstream/upstream/insert.sql');
    });
    it('upstream/insert_conflict.sql', () => {
      check('upstream/upstream/insert_conflict.sql');
    });
    it('upstream/int2.sql', () => {
      check('upstream/upstream/int2.sql');
    });
    it('upstream/int4.sql', () => {
      check('upstream/upstream/int4.sql');
    });
    it('upstream/int8.sql', () => {
      check('upstream/upstream/int8.sql');
    });
    it('upstream/interval.sql', () => {
      check('upstream/upstream/interval.sql');
    });
    it('upstream/join.sql', () => {
      check('upstream/upstream/join.sql');
    });
    it('upstream/json.sql', () => {
      check('upstream/upstream/json.sql');
    });
    it('upstream/json_encoding.sql', () => {
      check('upstream/upstream/json_encoding.sql');
    });
    it('upstream/jsonb.sql', () => {
      check('upstream/upstream/jsonb.sql');
    });
    it('upstream/limit.sql', () => {
      check('upstream/upstream/limit.sql');
    });
    it('upstream/line.sql', () => {
      check('upstream/upstream/line.sql');
    });
    it('upstream/lock.sql', () => {
      check('upstream/upstream/lock.sql');
    });
    it('upstream/lseg.sql', () => {
      check('upstream/upstream/lseg.sql');
    });
    it('upstream/macaddr.sql', () => {
      check('upstream/upstream/macaddr.sql');
    });
    it('upstream/matview.sql', () => {
      check('upstream/upstream/matview.sql');
    });
    it('upstream/misc_functions.sql', () => {
      check('upstream/upstream/misc_functions.sql');
    });
    it('upstream/money.sql', () => {
      check('upstream/upstream/money.sql');
    });
    it('upstream/name.sql', () => {
      check('upstream/upstream/name.sql');
    });
    it('upstream/namespace.sql', () => {
      check('upstream/upstream/namespace.sql');
    });
    it('upstream/numeric.sql', () => {
      check('upstream/upstream/numeric.sql');
    });
    it('upstream/numeric_big.sql', () => {
      check('upstream/upstream/numeric_big.sql');
    });
    it('upstream/numerology.sql', () => {
      check('upstream/upstream/numerology.sql');
    });
    it('upstream/object_address.sql', () => {
      check('upstream/upstream/object_address.sql');
    });
    it('upstream/oid.sql', () => {
      check('upstream/upstream/oid.sql');
    });
    it('upstream/oidjoins.sql', () => {
      check('upstream/upstream/oidjoins.sql');
    });
    it('upstream/opr_sanity.sql', () => {
      check('upstream/upstream/opr_sanity.sql');
    });
    it('upstream/path.sql', () => {
      check('upstream/upstream/path.sql');
    });
    it('upstream/pg_lsn.sql', () => {
      check('upstream/upstream/pg_lsn.sql');
    });
    it('upstream/plancache.sql', () => {
      check('upstream/upstream/plancache.sql');
    });
    it('upstream/plpgsql.sql', () => {
      check('upstream/upstream/plpgsql.sql');
    });
    it('upstream/point.sql', () => {
      check('upstream/upstream/point.sql');
    });
    it('upstream/polygon.sql', () => {
      check('upstream/upstream/polygon.sql');
    });
    it('upstream/polymorphism.sql', () => {
      check('upstream/upstream/polymorphism.sql');
    });
    it('upstream/portals.sql', () => {
      check('upstream/upstream/portals.sql');
    });
    it('upstream/portals_p2.sql', () => {
      check('upstream/upstream/portals_p2.sql');
    });
    it('upstream/prepare.sql', () => {
      check('upstream/upstream/prepare.sql');
    });
    it('upstream/prepared_xacts.sql', () => {
      check('upstream/upstream/prepared_xacts.sql');
    });
    it('upstream/privileges.sql', () => {
      check('upstream/upstream/privileges.sql');
    });
    it('upstream/psql.sql', () => {
      check('upstream/upstream/psql.sql');
    });
    it('upstream/psql_crosstab.sql', () => {
      check('upstream/upstream/psql_crosstab.sql');
    });
    it('upstream/random.sql', () => {
      check('upstream/upstream/random.sql');
    });
    it('upstream/rangefuncs.sql', () => {
      check('upstream/upstream/rangefuncs.sql');
    });
    it('upstream/rangetypes.sql', () => {
      check('upstream/upstream/rangetypes.sql');
    });
    it('upstream/regex.sql', () => {
      check('upstream/upstream/regex.sql');
    });
    it('upstream/regproc.sql', () => {
      check('upstream/upstream/regproc.sql');
    });
    it('upstream/reltime.sql', () => {
      check('upstream/upstream/reltime.sql');
    });
    it('upstream/replica_identity.sql', () => {
      check('upstream/upstream/replica_identity.sql');
    });
    it('upstream/returning.sql', () => {
      check('upstream/upstream/returning.sql');
    });
    it('upstream/roleattributes.sql', () => {
      check('upstream/upstream/roleattributes.sql');
    });
    it('upstream/rolenames.sql', () => {
      check('upstream/upstream/rolenames.sql');
    });
    it('upstream/rowsecurity.sql', () => {
      check('upstream/upstream/rowsecurity.sql');
    });
    it('upstream/rowtypes.sql', () => {
      check('upstream/upstream/rowtypes.sql');
    });
    it('upstream/rules.sql', () => {
      check('upstream/upstream/rules.sql');
    });
    it('upstream/sanity_check.sql', () => {
      check('upstream/upstream/sanity_check.sql');
    });
    it('upstream/security_label.sql', () => {
      check('upstream/upstream/security_label.sql');
    });
    it('upstream/select.sql', () => {
      check('upstream/upstream/select.sql');
    });
    it('upstream/select_distinct.sql', () => {
      check('upstream/upstream/select_distinct.sql');
    });
    it('upstream/select_distinct_on.sql', () => {
      check('upstream/upstream/select_distinct_on.sql');
    });
    it('upstream/select_having.sql', () => {
      check('upstream/upstream/select_having.sql');
    });
    it('upstream/select_implicit.sql', () => {
      check('upstream/upstream/select_implicit.sql');
    });
    it('upstream/select_into.sql', () => {
      check('upstream/upstream/select_into.sql');
    });
    it('upstream/select_views.sql', () => {
      check('upstream/upstream/select_views.sql');
    });
    it('upstream/sequence.sql', () => {
      check('upstream/upstream/sequence.sql');
    });
    it('upstream/spgist.sql', () => {
      check('upstream/upstream/spgist.sql');
    });
    it('upstream/stats.sql', () => {
      check('upstream/upstream/stats.sql');
    });
    it('upstream/strings.sql', () => {
      check('upstream/upstream/strings.sql');
    });
    it('upstream/subselect.sql', () => {
      check('upstream/upstream/subselect.sql');
    });
    it('upstream/tablesample.sql', () => {
      check('upstream/upstream/tablesample.sql');
    });
    it('upstream/temp.sql', () => {
      check('upstream/upstream/temp.sql');
    });
    it('upstream/text.sql', () => {
      check('upstream/upstream/text.sql');
    });
    it('upstream/time.sql', () => {
      check('upstream/upstream/time.sql');
    });
    it('upstream/timestamp.sql', () => {
      check('upstream/upstream/timestamp.sql');
    });
    it('upstream/timestamptz.sql', () => {
      check('upstream/upstream/timestamptz.sql');
    });
    it('upstream/timetz.sql', () => {
      check('upstream/upstream/timetz.sql');
    });
    it('upstream/tinterval.sql', () => {
      check('upstream/upstream/tinterval.sql');
    });
    it('upstream/transactions.sql', () => {
      check('upstream/upstream/transactions.sql');
    });
    it('upstream/triggers.sql', () => {
      check('upstream/upstream/triggers.sql');
    });
    it('upstream/truncate.sql', () => {
      check('upstream/upstream/truncate.sql');
    });
    it('upstream/tsdicts.sql', () => {
      check('upstream/upstream/tsdicts.sql');
    });
    it('upstream/tsearch.sql', () => {
      check('upstream/upstream/tsearch.sql');
    });
    it('upstream/tstypes.sql', () => {
      check('upstream/upstream/tstypes.sql');
    });
    it('upstream/txid.sql', () => {
      check('upstream/upstream/txid.sql');
    });
    it('upstream/type_sanity.sql', () => {
      check('upstream/upstream/type_sanity.sql');
    });
    it('upstream/typed_table.sql', () => {
      check('upstream/upstream/typed_table.sql');
    });
    it('upstream/union.sql', () => {
      check('upstream/upstream/union.sql');
    });
    it('upstream/updatable_views.sql', () => {
      check('upstream/upstream/updatable_views.sql');
    });
    it('upstream/update.sql', () => {
      check('upstream/upstream/update.sql');
    });
    it('upstream/uuid.sql', () => {
      check('upstream/upstream/uuid.sql');
    });
    it('upstream/vacuum.sql', () => {
      check('upstream/upstream/vacuum.sql');
    });
    it('upstream/varchar.sql', () => {
      check('upstream/upstream/varchar.sql');
    });
    it('upstream/window.sql', () => {
      check('upstream/upstream/window.sql');
    });
    it('upstream/with.sql', () => {
      check('upstream/upstream/with.sql');
    });
    it('upstream/without_oid.sql', () => {
      check('upstream/upstream/without_oid.sql');
    });
    it('upstream/xml.sql', () => {
      check('upstream/upstream/xml.sql');
    });
    it('upstream/xmlmap.sql', () => {
      check('upstream/upstream/xmlmap.sql');
    });
  });
});
