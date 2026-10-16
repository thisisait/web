#!/bin/sh
# Copy the Iris eye + tone model from a local checkout of thisisait/design.
#   tools/sync-design.sh ../design
set -e
SRC="${1:?path to a thisisait/design checkout}"
DST="$(dirname "$0")/../src/vendor/ait"
cp "$SRC/src/js/iris-eye.js" "$SRC/src/js/iris-tone.js" "$DST/"
SHA=$(git -C "$SRC" rev-parse --short HEAD)
sed -i.bak "s/last synced at commit \`[0-9a-f]*\`/last synced at commit \`$SHA\`/" "$DST/README.md" && rm -f "$DST/README.md.bak"
echo "synced from design@$SHA"
