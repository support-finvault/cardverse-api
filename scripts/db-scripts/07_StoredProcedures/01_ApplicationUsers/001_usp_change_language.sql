DROP PROCEDURE if exists app.usp_change_language;
CREATE OR REPLACE PROCEDURE app.usp_change_language(
	p_in_user_id int,
	p_in_language int
)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	UPDATE app.users
	SET language = p_in_language
	WHERE id = p_in_user_id;
END;
$BODY$;