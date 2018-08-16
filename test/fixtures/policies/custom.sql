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

CREATE POLICY delete_user ON users."user" FOR DELETE TO authenticated USING ((id) = (current_setting('user.id')::uuid));

CREATE POLICY select_user ON users."user" FOR SELECT TO PUBLIC USING (TRUE);
