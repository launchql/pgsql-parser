CREATE POLICY delete_user ON users.user FOR DELETE TO authenticated
USING (
    id = current_setting('user.id')::uuid
);
