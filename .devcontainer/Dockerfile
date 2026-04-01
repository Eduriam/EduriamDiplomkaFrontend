#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

    FROM ubuntu:latest

    ENV DEBIAN_FRONTEND=noninteractive
    RUN apt-get update \
        && apt-get -y install --no-install-recommends apt-utils 2>&1
    
    # Verify git and needed tools are installed
    RUN apt-get install --no-install-recommends -y git procps
    RUN apt-get update && apt-get install -y --no-install-recommends openssh-client

    # Install Node.js tooling for Mermaid diagram generation
    RUN apt-get update && apt-get install -y --no-install-recommends nodejs npm
    RUN npm install --global corepack && corepack enable && corepack prepare yarn@4.12.0 --activate
    # Runtime libraries required by Puppeteer/Chrome (used by Mermaid CLI)
    RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        fonts-liberation \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libcups2 \
        libdbus-1-3 \
        libdrm2 \
        libgbm1 \
        libglib2.0-0 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxrandr2 \
        xdg-utils \
        && (apt-get install -y --no-install-recommends libasound2t64 || apt-get install -y --no-install-recommends libasound2)
    
    # Install Tex Live with XeLaTeX support
    RUN apt-get update && apt-get -y upgrade \
        && apt-get -y install --no-install-recommends \
        texlive-latex-base \
        texlive-extra-utils \
        texlive-latex-extra \
        texlive-xetex \
        texlive-fonts-extra \
        texlive-lang-english \
        texlive-lang-czechslovak \
        texlive-lang-european \
        texlive-bibtex-extra \
        texlive-science \
        texlive-publishers \
        biber chktex latexmk make python3-pygments python3-pkg-resources \
        texlive-lang-chinese \
        texlive-lang-japanese
    
    # latexindent modules
    RUN apt-get install --no-install-recommends -y curl
    RUN curl -L http://cpanmin.us | perl - App::cpanminus \
        && cpanm Log::Dispatch::File \
        && cpanm YAML::Tiny \
        && cpanm File::HomeDir \
        && cpanm Unicode::GCString
    
    # Clean up
    RUN apt-get autoremove -y \
        && apt-get clean -y \
        && rm -rf /var/lib/apt/lists/*
    ENV DEBIAN_FRONTEND=dialog \
        LANG=C.UTF-8 \
        LC_ALL=C.UTF-8
