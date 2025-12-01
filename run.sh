#!/usr/bin/bash
export TZ='Asia/Shanghai'
# git ls-files --directory ./blog/source | while read path; do
#     touch -d "$(git log -1 --format='@%ct' $path)" "$path"; 
#     echo "$path: $(git log -1 --format="%ct" "$path" | xargs -I{} date -d @{} "+%Y-%m-%d %H:%M:%S")"
# done
