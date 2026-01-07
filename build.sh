#!/bin/bash

# Create the dist directory if it doesn't exist
mkdir -p dist

# Get the current version and name from manifest.json using sed for better portability
VERSION=$(sed -n 's/.*"version": "\(.*\)".*/\1/p' manifest.json)
EXTENSION_NAME=$(sed -n 's/.*"name": "\(.*\)".*/\1/p' manifest.json | sed 's/ /-/g' | tr '[:upper:]' '[:lower:]')

ZIP_FILE="dist/${EXTENSION_NAME}-v${VERSION}.zip"

# Remove any existing zip file
if [ -f "$ZIP_FILE" ]; then
    rm "$ZIP_FILE"
fi

# Create the zip archive
zip -j "$ZIP_FILE" \
    content.js \
    manifest.json \
    options.html \
    options.js \
    popup.html \
    popup.js

echo "Successfully created package: $ZIP_FILE"

# Generate checksums
echo ""
echo "Checksums for $ZIP_FILE:"
sha1sum "$ZIP_FILE" | tee "${ZIP_FILE}.sha1"
md5sum "$ZIP_FILE" | tee "${ZIP_FILE}.md5"

echo "Checksums saved to ${ZIP_FILE}.sha1 and ${ZIP_FILE}.md5"