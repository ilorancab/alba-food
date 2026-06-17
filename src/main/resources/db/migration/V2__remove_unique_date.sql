DO $$
DECLARE
    c_name text;
BEGIN
    SELECT tc.constraint_name 
    INTO c_name
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu 
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'UNIQUE' 
      AND tc.table_name = 'feeding_entries' 
      AND kcu.column_name = 'date';

    IF c_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE feeding_entries DROP CONSTRAINT ' || quote_ident(c_name);
    END IF;
END $$;
