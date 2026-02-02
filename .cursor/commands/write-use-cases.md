# Write Use Cases

You will be given a functional requirement and jour job is to write a use case (or use cases) based on the requirement.

## Use Case Format

The use case should be written in the following format.

```latex
\subsubsection{UC-X Name of the use case}

\begin{tabular}{lp{0.7\linewidth}}
  \textbf{Popis:} & Use case description \\
  \textbf{Požadavek:} & LaTeX nameref to the functional requirement \\
  \textbf{Hlavní aktér:} & Actor name  \\
  \textbf{Hlavní scénář:} & Main scenario description (approximately 1-3 sentences) \\
  \textbf{Alternativní scénář 1:} & Alternative scenario description (approximately 1-3 sentences) \\
  \textbf{Alternativní scénář 2:} & Alternative scenario description (approximately 1-3 sentences) \\
\end{tabular}
```

### Example use case

```latex
% Review
\subsubsection{UC-1 Volba přihlášení nebo registrace}

% Review
\begin{tabular}{lp{0.7\linewidth}}
  \textbf{Popis:} & Umožňuje uživateli si zobrazit úvodní stránku aplikace a zvolit, zda se chce přihlásit nebo registrovat. \\
  \textbf{Požadavek:} & \nameref{sec:fp-welcome-page} \\
  \textbf{Hlavní aktér:} & Nepřihlášený uživatel \\
  \textbf{Hlavní scénář:} & Nepřihlášený uživatel otevře aplikaci, zobrazí se mu úvodní stránka, uživatel zvolí možnost přihlášení a bude přesměrován na stránku přihlášení. \\
  \textbf{Alternativní scénář 1:} & Nepřihlášený uživatel otevře aplikaci, zobrazí se mu úvodní stránka, uživatel zvolí možnost registrace a bude přesměrován na stránku registrace. \\
  \textbf{Alternativní scénář 2:} & Přihlášený uživatel otevře aplikaci na úvodní stránce, systém ho automaticky přesměruje na hlavní stránku v aplikaci. \\
\end{tabular}
```

## Rules

- For the given requirement write down all important use cases. Usually it will be only one use case or a few use cases per requirement.
- Make the use cases short and concise.
- Main and alternative scenarios should be described with a few sentences. Don't write step-by-step scenarios. Write a short summary.
- For the alternative scenarios, write down all important alternative scenarios that might occur.
- When creating nameref links to the requirements, you might have to define the label in the requirement subsubsection. Use the format `\label{sec:fp-requirement-short-name}`
- Use cases should be written in the `\subsection{Specifikace případů užití}` inside the `text/chapters/03 design/4 function design.tex` document
