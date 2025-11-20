#!/bin/bash
# sync-master.sh

CURRENT_BRANCH=$(git branch --show-current)

git checkout master
git fetch upstream
git reset --hard upstream/master  # ← força sincronia total
git push origin master --force     # ← force push necessário
git checkout "$CURRENT_BRANCH"

echo "✅ Master resetada para upstream/master!"