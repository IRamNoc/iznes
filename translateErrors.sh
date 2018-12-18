#!/bin/bash

# Translate errors and status messages from database stored procedures

# Define database constants
user="root"
pwd="alex01"
database="setlnet"
query="SELECT errorMessage FROM tblErrors"

# Define API constants
iznesSiteId=1
apiUrl="http://10.0.2.72"
apiPort="8000"

# Set API endpoint
apiEndpoint="$apiUrl:$apiPort/api/sites/$iznesSiteId/whitelist-translations"

# Get errors from tblErrors 
mysql -u${user} -p${pwd} ${database} -N -e "${query}" | while IFS= read -r item
do
   
    # Create mltag for each item
    mltag=`echo "console.log('txt_' + '$item'.replace(/[^a-z0-9A-Z]/g, '').toLowerCase());" | node`
    
    # Truncate mltag if length is longer than 34 characters
    length=${#mltag}

    if [ $length -gt 34 ]; then
        hash=`echo -n "$mltag" | shasum -a 256`
        mltag=`echo "console.log('$mltag'.substring(0, 34) + '$hash'.substring(10, 20));" | node`
    fi    

    # Create payload object using mltag and item
    payload=`echo "console.log(JSON.stringify({ mltag: '$mltag', value: '$item', location: 'stored_procedure' }));" | node`
    
    # Send payload to API
    curl -d "$payload" -H "Content-Type: application/json" -X POST ${apiEndpoint}

    # Testing
    # echo "$payload"
   
done 
