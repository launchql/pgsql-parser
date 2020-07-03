CREATE TRIGGER _100_timestamps BEFORE INSERT OR UPDATE ON app_jobs.jobs
FOR EACH ROW EXECUTE PROCEDURE app_jobs.update_timestamps();

CREATE TRIGGER _500_increase_job_queue_count AFTER INSERT ON app_jobs.jobs
FOR EACH ROW EXECUTE PROCEDURE app_jobs.jobs__increase_job_queue_count();

CREATE TRIGGER _500_decrease_job_queue_count BEFORE DELETE ON app_jobs.jobs
FOR EACH ROW EXECUTE PROCEDURE app_jobs.jobs__decrease_job_queue_count();

CREATE TRIGGER _900_notify_worker AFTER INSERT ON app_jobs.jobs
FOR EACH STATEMENT EXECUTE PROCEDURE app_jobs.do_notify('jobs:insert');

CREATE TRIGGER check_update
    BEFORE UPDATE OF balance ON accounts
    FOR EACH ROW
    EXECUTE PROCEDURE check_account_update();

CREATE TRIGGER check_update
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE PROCEDURE check_account_update();

CREATE TRIGGER check_update
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    WHEN (OLD.balance IS DISTINCT FROM NEW.balance)
    EXECUTE PROCEDURE check_account_update();

CREATE TRIGGER log_update
    AFTER UPDATE ON accounts
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE PROCEDURE log_account_update();

CREATE TRIGGER view_insert
    INSTEAD OF INSERT ON my_view
    FOR EACH ROW
    EXECUTE PROCEDURE view_insert_row();

CREATE TRIGGER transfer_insert
    AFTER INSERT ON transfer
    REFERENCING NEW TABLE AS inserted
    FOR EACH STATEMENT
    EXECUTE PROCEDURE check_transfer_balances_to_zero();

CREATE TRIGGER paired_items_update
    AFTER UPDATE ON paired_items
    REFERENCING NEW TABLE AS newtab OLD TABLE AS oldtab
    FOR EACH ROW
    EXECUTE PROCEDURE check_matching_pairs();

CREATE TRIGGER paired_items_update
    AFTER UPDATE ON paired_items
    REFERENCING OLD TABLE AS oldtab NEW TABLE AS newtab
    FOR EACH ROW
    EXECUTE PROCEDURE check_matching_pairs();
