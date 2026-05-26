#!/bin/bash

# Exit immediately if any command fails
set -e

echo "=== Initializing Python Virtual Environment for World of Warcrest ==="

# Determine python executable
if command -v python3.12 &> /dev/null; then
    PYTHON_EXE="python3.12"
elif command -v /opt/homebrew/bin/python3.12 &> /dev/null; then
    PYTHON_EXE="/opt/homebrew/bin/python3.12"
elif command -v python3.11 &> /dev/null; then
    PYTHON_EXE="python3.11"
elif command -v /opt/homebrew/bin/python3.11 &> /dev/null; then
    PYTHON_EXE="/opt/homebrew/bin/python3.11"
elif command -v python3 &> /dev/null; then
    PYTHON_EXE="python3"
else
    echo "Error: Neither python3.12, python3.11, nor python3 was found in PATH."
    exit 1
fi

echo "Using Python executable: $PYTHON_EXE"

# Define local library override if Homebrew expat is present
ENV_PREFIX=""
if [ -d "/opt/homebrew/opt/expat/lib" ]; then
    echo "Detected Homebrew expat library. Applying inline SIP bypass for python/pip executions..."
    ENV_PREFIX="DYLD_LIBRARY_PATH=/opt/homebrew/opt/expat/lib"
fi

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment in .venv..."
    eval "$ENV_PREFIX \$PYTHON_EXE -m venv .venv"
else
    echo "Virtual environment (.venv) already exists."
fi

# Inject DYLD_LIBRARY_PATH into activate script so it is automatic for the user in their active shells
if [ -f ".venv/bin/activate" ]; then
    if ! grep -q "DYLD_LIBRARY_PATH" ".venv/bin/activate"; then
        echo "Injecting expat library path to .venv/bin/activate..."
        cat << 'EOF' >> .venv/bin/activate

# For Homebrew expat compatibility on macOS
if [ -d "/opt/homebrew/opt/expat/lib" ]; then
    export DYLD_LIBRARY_PATH="/opt/homebrew/opt/expat/lib:$DYLD_LIBRARY_PATH"
fi
EOF
    fi
fi

# Upgrade pip
echo "Upgrading pip..."
eval "$ENV_PREFIX .venv/bin/python -m pip install --upgrade pip"

# Install dependencies
echo "Installing dependencies..."
if [ -f "requirements.txt" ]; then
    eval "$ENV_PREFIX .venv/bin/python -m pip install -r requirements.txt"
else
    echo "Warning: requirements.txt not found. Installing google-antigravity directly..."
    eval "$ENV_PREFIX .venv/bin/python -m pip install google-antigravity python-decouple typing-extensions"
fi

echo "=== Setup Completed Successfully ==="
echo "To activate this environment in your terminal, run:"
echo "source .venv/bin/activate"
