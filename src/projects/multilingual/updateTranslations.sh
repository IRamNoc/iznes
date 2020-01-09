#!/bin/bash

# Set the translations filename which is going to be used by the multilingual module
filename='translations.ts'

# Define constants
iznesSiteId=1
apiUrl="http://10.0.2.72"
apiPort="8000"

# Set API endpoint
apiEndpoint="$apiUrl:$apiPort/api/sites/$iznesSiteId/export-translations"

# Function that builds the new translations file
function buildTranslationFile() {
    #  Fetch translations
    echo '---> Fetch new translations'
    local response="`wget -qO- $2`"

    # Insert API response into file
    echo '---> Build translations file'
    echo "export const Translations = {'core': $response};" >> $1
    echo $'\r' >> $1
}

# Check if translations file already exists
if [ -f $filename ]; then
    # Get today date and last update date of translations file
    todayDate='date "+%Y-%m-%d"'
    lastUpdatedDate="stat -f '%Sm' -t '%Y-%m-%d' $filename"

    # Check if translations are up-to-date
    if [ "$todayDate != $lastUpdatedDate" ]; then
        echo ''
        read -p $'⚠️  Translations are not up-to-date ⚠️\nWould you want to update these? (Y/n) [Y] ' input

        if [ ! $input ] || [ $input == 'Y' ]; then
            # Remove the old one
            echo '---> Remove old translation file'
            rm -rf $filename

            # Build translations file
            buildTranslationFile $filename $apiEndpoint
        fi
    fi
else
    # Build translations file
    buildTranslationFile $filename $apiEndpoint
fi
