set shell := ["bash", "-uc"]
set dotenv-load

fix:
    #!/usr/bin/env bash
    set -euo pipefail
    TAGS=$(git rev-list --tags --max-count=1)
    TAG=$(git describe --tags $TAGS)
    TAGARR=(${TAG//./ })
    MINOR=${TAGARR[1]}
    ((MINOR++))
    TAGARR[1]=$MINOR
    NEWTAG=$(IFS=.; echo "${TAGARR[*]}")
    echo "New tag: $NEWTAG"

    git tag "${NEWTAG}" -m "fix: ${NEWTAG}"
    git push --tags
