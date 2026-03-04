---
name: thesis-write-use-cases
description: Generate concise LaTeX use cases from functional requirements in this thesis project. Use when drafting or updating use-case specifications in the function design chapter.
---

# Write Use Cases

Convert each given functional requirement into one or more concise use cases.

## Target Location

- Write into `\subsection{Specifikace pripadu uziti}` in `text/chapters/03 design/4 function design.tex`.

## Required Format

```latex
\subsubsection{UC-X Name of the use case}

\begin{tabular}{lp{0.7\linewidth}}
  \textbf{Popis:} & Use case description \\
  \textbf{Pozadavek:} & \nameref{sec:fp-requirement-short-name} \\
  \textbf{Hlavni akter:} & Actor name \\
  \textbf{Hlavni scenar:} & Main scenario summary (1-3 sentences) \\
  \textbf{Alternativni scenar 1:} & Alternative scenario summary (1-3 sentences) \\
  \textbf{Alternativni scenar 2:} & Alternative scenario summary (1-3 sentences) \\
\end{tabular}
```

## Rules

- Cover all important use cases for the requirement, usually one or a few.
- Keep each use case short and concrete.
- Write scenario fields as short summaries, not step-by-step procedures.
- Include all important alternative scenarios that can realistically occur.
- Add missing requirement labels when needed, using `\label{sec:fp-requirement-short-name}`.