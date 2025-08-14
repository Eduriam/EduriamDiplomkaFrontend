FROM ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    git \
    perl \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install TeX Live with XeLaTeX and Biber support
RUN apt-get update && apt-get install -y \
    texlive-full \
    texlive-xetex \
    texlive-bibtex-extra \
    texlive-lang-czechslovak \
    texlive-lang-english \
    texlive-fonts-extra \
    texlive-science \
    texlive-publishers \
    texlive-latex-extra \
    && rm -rf /var/lib/apt/lists/*

# Install additional LaTeX packages that might be needed
RUN tlmgr update --self && \
    tlmgr install \
    arara \
    biblatex \
    biber \
    microtype \
    fontspec \
    polyglossia \
    xunicode \
    xltxtra \
    && rm -rf /tmp/*

# Set working directory
WORKDIR /workspace

# Create a non-root user
RUN useradd -m -s /bin/bash latex && \
    chown -R latex:latex /workspace

USER latex

# Default command
CMD ["/bin/bash"]
