CREATE POLICY delete_user ON users.user
FOR DELETE
TO authenticated
USING (
    id = current_setting('user.id')::uuid
);

CREATE POLICY delete_user_no_to ON users.user
FOR DELETE
USING (
    id = current_setting('user.id')::uuid
);

CREATE POLICY delete_user_no_to ON users.user
FOR DELETE
WITH CHECK (
    id = current_setting('user.id')::uuid
);

CREATE POLICY delete_user ON users."user" FOR DELETE TO authenticated USING ((id) = (current_setting('user.id')::uuid));
CREATE POLICY select_user ON users."user" FOR SELECT TO PUBLIC USING (TRUE);

CREATE POLICY delete_own ON myschema.mytable FOR DELETE TO PUBLIC USING (group_id = ANY (otherschema.my_policy_fn()));
CREATE POLICY insert_own ON myschema.mytable FOR ALL TO PUBLIC WITH CHECK (group_id = ANY (otherschema.my_policy_fn()));
CREATE POLICY select_any ON myschema.mytable FOR SELECT TO PUBLIC USING (TRUE);
CREATE POLICY update_own ON myschema.mytable FOR UPDATE TO PUBLIC USING (group_id = ANY (otherschema.my_policy_fn()));
