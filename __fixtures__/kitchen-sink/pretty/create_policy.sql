CREATE POLICY user_policy ON users FOR ALL TO authenticated_users USING (user_id = current_user_id());

CREATE POLICY admin_policy ON sensitive_data 
  AS RESTRICTIVE 
  FOR SELECT 
  TO admin_role 
  USING (department = current_user_department()) 
  WITH CHECK (approved = true);

CREATE POLICY complex_policy ON documents 
  FOR UPDATE 
  TO document_editors 
  USING (
    owner_id = current_user_id() OR 
    (shared = true AND permissions @> '{"edit": true}')
  ) 
  WITH CHECK (
    status != 'archived' AND 
    last_modified > now() - interval '1 day'
  );

CREATE POLICY simple_policy ON posts FOR SELECT TO public USING (published = true);

CREATE POLICY "simple_policy" ON posts FOR SELECT TO public USING (published = true);

CREATE POLICY "Simple Policy" ON posts FOR SELECT TO public USING (published = true);

CREATE POLICY SimplePolicy ON posts FOR SELECT TO public USING (published = true);
