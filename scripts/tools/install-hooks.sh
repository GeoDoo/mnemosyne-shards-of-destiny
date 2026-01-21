#!/bin/bash
# install-hooks.sh - Install git hooks for the project
# Run once: ./scripts/tools/install-hooks.sh

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
HOOKS_DIR="$PROJECT_ROOT/.git/hooks"

echo "Installing git hooks..."

# Create pre-commit hook
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash
# Pre-commit hook: validate documentation

echo "Running documentation validator..."

# Run validation script
./scripts/tools/validate_docs.sh

# If validation fails, abort commit
if [ $? -ne 0 ]; then
    echo ""
    echo "Commit aborted due to documentation errors."
    echo "Fix the issues above or use 'git commit --no-verify' to skip."
    exit 1
fi
EOF

chmod +x "$HOOKS_DIR/pre-commit"
chmod +x "$PROJECT_ROOT/scripts/tools/validate_docs.sh"

echo "✓ Pre-commit hook installed!"
echo ""
echo "The validator will now run automatically before each commit."
echo "To skip: git commit --no-verify"
echo "To run manually: ./scripts/tools/validate_docs.sh"
