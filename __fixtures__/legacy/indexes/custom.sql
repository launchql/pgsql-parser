CREATE INDEX CONCURRENTLY boom_merkle_tree_tag_created_reference_idx ON boom.merkle_tree (tag, created, reference);

CREATE UNIQUE INDEX databases_database_unique_name_idx ON databases.database (
  tenant_id, database_name_hash(name)
);

CREATE UNIQUE INDEX boom_worktree_idx ON boom.worktree (tag, reference, created, DECODE(MD5(LOWER(path)), 'hex'));

CREATE UNIQUE INDEX uniq_service_when_not_null
  ON schema2.table3 (uid, svc)
  WHERE svc IS NOT NULL;

CREATE UNIQUE INDEX new_unique_idx ON new_example(a, b) INCLUDE (c);

CREATE INDEX idx_users_email_hash ON users USING hash (email);

CREATE INDEX idx_users_email_btree ON users USING btree (email);

CREATE INDEX idx_users_email_gin ON users USING gin (email gin_trgm_ops);

CREATE INDEX idx_products_metadata_gin ON products USING gin (metadata);

SELECT * FROM products WHERE metadata @> '{"color": "blue"}';

CREATE INDEX idx_products_metadata_gin ON products USING gin (metadata);


