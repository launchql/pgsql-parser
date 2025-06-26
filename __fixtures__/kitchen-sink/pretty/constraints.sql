-- 1. Add a named primary key constraint
ALTER TABLE public.users
  ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- 2. Add a quoted unique constraint on a mixed-case column
ALTER TABLE "App"."User Data"
  ADD CONSTRAINT "Unique_Full Name" UNIQUE ("Full Name");

-- 3. Add a composite unique constraint with custom name
ALTER TABLE school.attendance
  ADD CONSTRAINT attendance_unique UNIQUE ("Student ID", "Class ID");

-- 4. Add a foreign key with quoted constraint and schema-qualified reference
ALTER TABLE "Orders"."OrderLines"
  ADD CONSTRAINT "FK_Order_Ref" FOREIGN KEY (order_id)
  REFERENCES "Orders"."Order"("OrderID");

-- 5. Add a check constraint with a regex pattern
ALTER TABLE "x-Schema"."z-Table"
  ADD CONSTRAINT "zNameFormatCheck" CHECK ("Z-Name" ~ '^[A-Z]');

-- 6. Add a check constraint on JSON key existence
ALTER TABLE data.snapshots
  ADD CONSTRAINT metadata_has_key CHECK (metadata ? 'type');

-- 7. Add a foreign key referencing quoted schema.table.column
ALTER TABLE "Billing"."Invoices"
  ADD CONSTRAINT "FK_Client_ID"
  FOREIGN KEY ("Client ID") REFERENCES "Clients"."ClientBase"("Client ID");

-- 8. Add a primary key on a quoted identifier
ALTER TABLE "API Keys"
  ADD CONSTRAINT "PK_KeyID" PRIMARY KEY ("KeyID");

-- 9. Add a check on numeric range
ALTER TABLE finance.transactions
  ADD CONSTRAINT tax_rate_range CHECK (tax_rate >= 0 AND tax_rate <= 1);

-- 10. Add a multi-column foreign key with custom name
ALTER TABLE school.enrollments
  ADD CONSTRAINT fk_student_course FOREIGN KEY (student_id, course_id)
  REFERENCES school.courses_students(student_id, course_id);

-- 11. 
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total DECIMAL(10,2) CHECK (total > 0),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_date UNIQUE (user_id, created_at),
  CONSTRAINT check_status CHECK (status IN ('pending', 'completed', 'cancelled'))
);

-- 12.

ALTER TABLE products ADD CONSTRAINT fk_category 
  FOREIGN KEY (category_id) 
  REFERENCES categories(id) 
  ON UPDATE CASCADE 
  ON DELETE SET NULL 
  DEFERRABLE INITIALLY DEFERRED;

-- 13

ALTER TABLE products ADD CONSTRAINT check_price CHECK (price > 0);

-- 14

ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);


-- 15 

ALTER TABLE school.enrollments
  ADD CONSTRAINT fk_student_course
  FOREIGN KEY (student_id, course_id)
  REFERENCES school.courses_students (student_id, course_id);

-- 16 

ALTER TABLE school.enrollments
  ADD CONSTRAINT chk_enrollment_date
  CHECK (
    enrollment_date <= CURRENT_DATE
    AND status IN ('active', 'completed', 'withdrawn')
  );

-- 17

CREATE TABLE school.enrollments (
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrollment_date DATE NOT NULL,
  status TEXT CHECK (
    status IN ('active', 'completed', 'withdrawn')
  ),
  CHECK (
    enrollment_date <= CURRENT_DATE
  )
);
