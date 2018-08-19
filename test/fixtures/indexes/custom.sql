CREATE INDEX CONCURRENTLY boom_merkle_tree_tag_created_reference_idx ON boom.merkle_tree (tag, created, reference);

CREATE UNIQUE INDEX databases_database_unique_name_idx ON databases.database (
  tenant_id, database_name_hash(name)
);

CREATE UNIQUE INDEX boom_worktree_idx ON boom.worktree (tag, reference, created, DECODE(MD5(LOWER(path)), 'hex'));
