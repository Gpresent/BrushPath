#!/bin/bash

directory_path='public/joyo_kanji/'

find "$directory_path" -type f -exec basename {} \; | sed 's/.*/{url: "\/joyo_kanji\/&", revision: null},/' > 'list_kanji.txt'

# for file in $directory_path; do
#   # Extract file name from the path
#   file_name=$(basename "$file")
  
#   # Print the file name
#   echo "{url: /joyo_kanji/$file_name, revision: null}," >> 
# done