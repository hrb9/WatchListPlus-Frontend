#!/usr/bin/env bash
set -e

VERSION_FILE="version.txt"

if [ ! -f "$VERSION_FILE" ]; then
  echo "0.0.0.0" > "$VERSION_FILE"
fi

current_version=$(cat "$VERSION_FILE")
IFS='.' read -r -a parts <<< "$current_version"
A=${parts[0]}
B=${parts[1]}
C=${parts[2]}
D=${parts[3]}

# Increment the last octet
D=$((D + 1))
if [ $D -ge 200 ]; then
  D=0
  C=$((C + 1))
fi
if [ $C -ge 200 ]; then
  C=0
  B=$((B + 1))
fi
if [ $B -ge 200 ]; then
  B=0
  A=$((A + 1))
fi

new_version="$A.$B.$C.$D"
echo "$new_version" > "$VERSION_FILE"
echo "New version: $new_version"
