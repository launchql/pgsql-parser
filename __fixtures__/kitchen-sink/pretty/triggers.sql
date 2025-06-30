-- 1. Basic unquoted trigger
CREATE TRIGGER audit_insert_trigger
  AFTER INSERT
  ON public.users
  FOR EACH ROW
  EXECUTE PROCEDURE log_user_insert();

-- 2. Quoted trigger name and table
CREATE TRIGGER "AuditTrigger"
  AFTER DELETE
  ON "SensitiveData"
  FOR EACH ROW
  EXECUTE PROCEDURE public.log_deletion();

-- 3. Trigger with WHEN clause and quoted function name
CREATE TRIGGER archive_if_inactive
  BEFORE UPDATE
  ON accounts
  FOR EACH ROW
  WHEN (OLD.active = false)
  EXECUTE PROCEDURE "ArchiveFunction"();

-- 4. Schema-qualified trigger with arguments
CREATE TRIGGER update_stats_on_change
  AFTER UPDATE OR INSERT
  ON metrics.stats
  FOR EACH ROW
  EXECUTE PROCEDURE metrics.update_stats('user', true);

-- 5. Quoted everything: trigger, table, schema, function
CREATE TRIGGER "TrickyTrigger"
  BEFORE DELETE
  ON "weirdSchema"."ComplexTable"
  FOR EACH ROW
  WHEN (OLD."status" = 'pending')
  EXECUTE PROCEDURE "weirdSchema"."ComplexFn"('arg1', 42);

-- 6. Trigger with multiple events
CREATE TRIGGER user_activity_log
  AFTER INSERT OR DELETE OR UPDATE
  ON users
  FOR EACH ROW
  EXECUTE PROCEDURE audit.activity_log();

-- 7. Trigger with no schema qualification
CREATE TRIGGER no_schema
  BEFORE INSERT
  ON log_table
  FOR EACH ROW
  EXECUTE PROCEDURE update_log();

-- 8. Trigger with quoted column references in WHEN
CREATE TRIGGER flag_special_updates
  AFTER UPDATE
  ON profiles
  FOR EACH ROW
  WHEN (NEW."accessLevel" = 'admin')
  EXECUTE PROCEDURE flag_admin_change();

-- 9. Mixed-casing and quoted function args
CREATE TRIGGER "TriggerMixedCase"
  BEFORE INSERT
  ON dataPoints
  FOR EACH ROW
  EXECUTE PROCEDURE "HandleInsert"('TYPE_A', 'Region-1');

-- 10. Trigger for partitioned table
CREATE TRIGGER cascade_on_partition
  AFTER DELETE
  ON events_log_partition
  FOR EACH ROW
  EXECUTE PROCEDURE propagate_deletion();
