#!/bin/bash
# validate_docs.sh - Ensures documentation stays in sync with code/data
# Run manually or as a pre-commit hook

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_ROOT"

ERRORS=0
WARNINGS=0

echo "========================================"
echo "  Mnemosyne Documentation Validator"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

error() {
    echo -e "${RED}ERROR: $1${NC}"
    ERRORS=$((ERRORS + 1))
}

warn() {
    echo -e "${YELLOW}WARNING: $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# ======================
# 1. Check for OLD NAMES that should not exist
# ======================
echo "Checking for deprecated names..."

OLD_NAMES="Lyra|Castor|Theron|Aethon|Nikos|Myrrine|Korinna|Helikon"
FOUND=$(grep -r -l -E "$OLD_NAMES" --include="*.md" --include="*.json" --include="*.gd" --include="*.tscn" . 2>/dev/null | grep -v ".git" | grep -v "validate_docs.sh" || true)

if [ -n "$FOUND" ]; then
    error "Old character/location names found in:"
    echo "$FOUND" | while read -r file; do
        echo "  - $file"
        grep -n -E "$OLD_NAMES" "$file" | head -3 | sed 's/^/      /'
    done
else
    success "No deprecated names found"
fi

# ======================
# 2. Validate characters.json matches README
# ======================
echo ""
echo "Checking character consistency..."

# Extract character IDs from JSON
CHAR_IDS=$(grep '"id":' data/characters.json | sed 's/.*"id": *"\([^"]*\)".*/\1/' | sort)

for char in $CHAR_IDS; do
    # Check main README
    if ! grep -qi "$char" README.md; then
        warn "Character '$char' not mentioned in README.md"
    fi
    # Check story README
    if ! grep -qi "$char" story/README.md; then
        warn "Character '$char' not mentioned in story/README.md"
    fi
done
success "Character check complete"

# ======================
# 3. Validate enemies.json matches story/README.md
# ======================
echo ""
echo "Checking enemy consistency..."

# Extract major enemy IDs (bosses)
BOSS_ENEMIES="python melinoe echidna typhon"
for enemy in $BOSS_ENEMIES; do
    if ! grep -qi "$enemy" story/README.md; then
        warn "Boss enemy '$enemy' not mentioned in story/README.md"
    fi
done
success "Enemy check complete"

# ======================
# 4. Check assets match characters
# ======================
echo ""
echo "Checking asset consistency..."

for char in $CHAR_IDS; do
    SPRITE_DIR="assets/sprites/characters/party/$char"
    if [ ! -d "$SPRITE_DIR" ]; then
        warn "Missing sprite directory for '$char'"
    elif [ -z "$(ls -A $SPRITE_DIR 2>/dev/null)" ]; then
        warn "Empty sprite directory for '$char'"
    fi
    
    PORTRAIT="assets/portraits/party/${char}_portrait.png"
    if [ ! -f "$PORTRAIT" ]; then
        warn "Missing portrait for '$char'"
    fi
done
success "Asset check complete"

# ======================
# 5. Check story files exist
# ======================
echo ""
echo "Checking story files..."

EXPECTED_STORIES="00_intro.md 00_story_baseline.md 01_chapter1_awakening.md 02_chapter2_call_of_memory.md 03_chapter3_memory_of_light.md 04_chapter4_memory_of_silence.md 05_chapter5_memory_of_ruin.md 06_chapter6_revelation.md 07_chapter7_binding.md"

for story in $EXPECTED_STORIES; do
    if [ ! -f "story/$story" ]; then
        error "Missing story file: story/$story"
    fi
done
success "Story files check complete"

# ======================
# 6. Validate locations mentioned
# ======================
echo ""
echo "Checking location consistency..."

LOCATIONS="Thespiae Delphi Lebadeia Delos Necromanteion Olympus"
for loc in $LOCATIONS; do
    if ! grep -q "$loc" README.md; then
        warn "Location '$loc' not in main README.md"
    fi
    if ! grep -q "$loc" story/README.md; then
        warn "Location '$loc' not in story/README.md"
    fi
done
success "Location check complete"

# ======================
# Summary
# ======================
echo ""
echo "========================================"
if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}FAILED: $ERRORS error(s), $WARNINGS warning(s)${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}PASSED with $WARNINGS warning(s)${NC}"
    exit 0
else
    echo -e "${GREEN}PASSED: All checks passed!${NC}"
    exit 0
fi
