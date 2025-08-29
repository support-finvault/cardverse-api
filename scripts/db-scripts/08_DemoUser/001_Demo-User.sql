DO $$
DECLARE 
		Language_Id integer; 
		
    ALTER TABLE app.users DISABLE TRIGGER ALL;
	SELECT id INTO Language_Id FROM mst.languages WHERE code = 'EN';

	
	INSERT INTO app.users(username, first_name, last_name, contact,language_id)
	VALUES ('demouser', 'Demo', 'User', 'support@finvault.com',Language_Id)
	RETURNING app.users.id INTO user_id;
	
	ALTER TABLE app.users ENABLE TRIGGER ALL;

	
	commit;
END $$
