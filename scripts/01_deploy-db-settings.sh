#!/bin/sh
#!/bin/echo
read -p 'Username: [postgres]' uservar
uservar=${uservar:-postgres}
echo $uservar
read -p "HOST IP/Name: [localhost]" IP
IP=${IP:-localhost}
echo $IP
read -p "Database Name: [vault-qa]" DBNAME
DBNAME=${DBNAME:-vault-qa}
echo $DBNAME
echo " <---------- Deleting transaction table data, Please enter the password for Hosted DB  ----------> "
echo " "
echo " <--------- This Script will delete tables like virtual_inventory, inventory, status, documents, document_rows, document_attachment ---------->"
echo ""
export PGPASSWORD= # update to local db password
# psql -h $IP -p 5432 -U $uservar -d $DBNAME -a -f "./db-scripts/00_database_settings/001_set_timezone.sql" << EOF 

print_folder_recurse() { 
    for x in "$1"/*; 
    do
        if [ -d "$x" ]; then
            print_folder_recurse "$x"
        elif [ -f "$x" ]; then
            echo "$x";
            psql -h $IP -p 5432 -U $uservar -d $DBNAME -a -f "$x";
        fi
    done
}

print_folder_recurse ./db-settings
