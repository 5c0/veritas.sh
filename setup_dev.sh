#!/bin/bash

# Veritas Protocol 1-Click Dev Setup Script
# Supports macOS, Arch Linux, and Ubuntu (WSL)

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0;37m' # No Color

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}       Veritas Protocol Dev Environment Setup  ${NC}"
echo -e "${BLUE}===============================================${NC}"

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)
        if [ -f /etc/arch-release ]; then
            DISTRO="Arch"
        elif [ -f /etc/lsb-release ] || [ -f /etc/debian_version ]; then
            DISTRO="Ubuntu"
        else
            DISTRO="Linux-Unknown"
        fi
        ;;
    Darwin*)
        DISTRO="macOS"
        ;;
    CYGWIN*|MINGW32*|MSYS*|MINGW*)
        DISTRO="Windows"
        ;;
    *)
        DISTRO="Unknown"
        ;;
esac

echo -e "Detected OS: ${GREEN}${DISTRO}${NC}"

# Exit early for native Windows (Advise WSL)
if [ "$DISTRO" = "Windows" ]; then
    echo -e "${RED}Error: Native Windows shell detected.${NC}"
    echo -e "Solana and Anchor development requires a Linux-like environment."
    echo -e "Please install WSL2 by running: ${GREEN}wsl --install${NC} in PowerShell,"
    echo -e "then run this script inside your WSL Ubuntu terminal."
    exit 1
fi

# Check for node
if ! command -v node &> /dev/null; then
    echo -e "Installing Node.js..."
    if [ "$DISTRO" = "macOS" ]; then
        if ! command -v brew &> /dev/null; then
            echo -e "Installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install node
    elif [ "$DISTRO" = "Arch" ]; then
        sudo pacman -Sy --noconfirm nodejs npm
    elif [ "$DISTRO" = "Ubuntu" ]; then
        sudo apt-get update
        sudo apt-get install -y nodejs npm
    fi
else
    echo -e "Node.js is already installed: ${GREEN}$(node -v)${NC}"
fi

# Check for Rust
if ! command -v cargo &> /dev/null; then
    echo -e "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
else
    echo -e "Rust is already installed: ${GREEN}$(cargo --version)${NC}"
fi

# Check for Solana CLI
if ! command -v solana &> /dev/null; then
    echo -e "Installing Solana CLI..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    # Persist path
    if [ -f "$HOME/.bashrc" ]; then
        echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> "$HOME/.bashrc"
    fi
    if [ -f "$HOME/.zshrc" ]; then
        echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> "$HOME/.zshrc"
    fi
else
    echo -e "Solana CLI is already installed: ${GREEN}$(solana --version)${NC}"
fi

# Check for Anchor AVM
if ! command -v anchor &> /dev/null; then
    echo -e "Installing Anchor Version Manager (avm)..."
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
else
    echo -e "Anchor CLI is already installed: ${GREEN}$(anchor --version)${NC}"
fi

# Check for Java (JDK 17) for React Native
if ! command -v java &> /dev/null; then
    echo -e "Installing Java JDK 17..."
    if [ "$DISTRO" = "macOS" ]; then
        brew install openjdk@17
    elif [ "$DISTRO" = "Arch" ]; then
        sudo pacman -Sy --noconfirm jdk17-openjdk
    elif [ "$DISTRO" = "Ubuntu" ]; then
        sudo apt-get install -y openjdk-17-jdk
    fi
else
    echo -e "Java is already installed: ${GREEN}$(java -version 2>&1 | head -n 1)${NC}"
fi

# Final setup info
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}             Setup Complete!                    ${NC}"
echo -e "${GREEN}===============================================${NC}"
echo -e "Please restart your terminal to update paths."
echo -e "To start building:"
echo -e "  - Mobile app: ${BLUE}cd mobile && npm install && npx expo run:android${NC}"
echo -e "  - Web app:    ${BLUE}cd web && npm install && npm run dev${NC}"
echo -e "  - Contract:   ${BLUE}cd program && anchor build${NC}"
