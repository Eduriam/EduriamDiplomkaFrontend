#!/bin/bash

# Manual PDF build script for the thesis
# Run this script to build the PDF without committing

echo "🔨 Building LaTeX PDF manually..."

# Check if XeLaTeX is available
if ! command -v xelatex &> /dev/null; then
    echo "❌ XeLaTeX not found. Please install TeX Live or MiKTeX"
    echo "   On Windows: Install MiKTeX or TeX Live"
    echo "   On macOS: brew install --cask mactex"
    echo "   On Linux: sudo apt-get install texlive-xetex"
    exit 1
fi

# Check if Biber is available
if ! command -v biber &> /dev/null; then
    echo "❌ Biber not found. Please install Biber"
    echo "   Biber is usually included with TeX Live or MiKTeX"
    exit 1
fi

# Build the PDF using the same process as the arara comments in your .tex file
echo "📄 Compiling with XeLaTeX (pass 1/3)..."
xelatex -interaction=nonstopmode -halt-on-error ctufit-thesis.tex

if [ $? -ne 0 ]; then
    echo "❌ XeLaTeX compilation failed"
    exit 1
fi

echo "📚 Running Biber for bibliography..."
biber ctufit-thesis

if [ $? -ne 0 ]; then
    echo "❌ Biber failed"
    exit 1
fi

echo "📄 Compiling with XeLaTeX (pass 2/3)..."
xelatex -interaction=nonstopmode -halt-on-error ctufit-thesis.tex

if [ $? -ne 0 ]; then
    echo "❌ XeLaTeX compilation failed"
    exit 1
fi

echo "📄 Compiling with XeLaTeX (pass 3/3)..."
xelatex -interaction=nonstopmode -halt-on-error ctufit-thesis.tex

if [ $? -ne 0 ]; then
    echo "❌ XeLaTeX compilation failed"
    exit 1
fi

# Check if PDF was created successfully
if [ ! -f "ctufit-thesis.pdf" ]; then
    echo "❌ PDF file was not created"
    exit 1
fi

echo "✅ PDF built successfully!"
echo "📄 Output: ctufit-thesis.pdf"

# Ask if user wants to clean up auxiliary files
read -p "🧹 Clean up auxiliary files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Cleaning up auxiliary files..."
    rm -f ctufit-thesis.aux ctufit-thesis.bbl ctufit-thesis.bcf ctufit-thesis.blg ctufit-thesis.log ctufit-thesis.out ctufit-thesis.run.xml ctufit-thesis.toc ctufit-thesis.lof ctufit-thesis.lot ctufit-thesis.lol ctufit-thesis.synctex.gz
    echo "✅ Cleanup completed"
fi
