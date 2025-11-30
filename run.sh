#!/usr/bin/bash
git ls-files --directory ./blog/source | while read path; do
    touch -d "$(git log -1 --format='@%ct' $path)" "$path"; 
    printf "$(git log -1 --format="%ct" "$path" | xargs -I{} date -d @{} "+%Y-%m-%d %H:%M:%S")"
done
