import { promises as fs } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import os from "node:os";

const repoRoot = process.cwd();
const diagramsRoot = path.join(repoRoot, "diagrams");
const outputRoot = path.join(repoRoot, "images", "diagrams");
const puppeteerConfigPath = path.join(repoRoot, "scripts", "puppeteer-mermaid-config.json");
const puppeteerCacheRoot = path.join(os.homedir(), ".cache", "puppeteer");

function quoteForShell(value) {
  return `"${value.replace(/"/g, '\\"')}"`;
}

function runShellCommand(command, envOverrides = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      env: {
        ...process.env,
        ...envOverrides
      }
    });

    let output = "";

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stderr.write(text);
    });

    child.on("error", (error) => reject(error));
    child.on("close", (code) => resolve({ code, output }));
  });
}

async function findMmdFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMmdFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".mmd")) {
      files.push(fullPath);
    }
  }

  return files;
}

function isMissingChromeError(output) {
  return (
    output.includes("Could not find Chrome") ||
    output.includes("Could not find Chromium")
  );
}

function isMissingSharedLibraryError(output) {
  return output.includes("error while loading shared libraries");
}

function compareLinuxVersionDirsDesc(left, right) {
  const parse = (name) =>
    name
      .replace(/^linux-/, "")
      .split(".")
      .map((part) => Number.parseInt(part, 10) || 0);

  const a = parse(left);
  const b = parse(right);
  const maxLength = Math.max(a.length, b.length);

  for (let index = 0; index < maxLength; index += 1) {
    const av = a[index] ?? 0;
    const bv = b[index] ?? 0;
    if (av !== bv) {
      return bv - av;
    }
  }

  return 0;
}

async function findInstalledChromeExecutable() {
  const candidates = [
    {
      browserDirectory: "chrome",
      executableTail: ["chrome-linux64", "chrome"]
    },
    {
      browserDirectory: "chrome-headless-shell",
      executableTail: ["chrome-headless-shell-linux64", "chrome-headless-shell"]
    }
  ];

  for (const candidate of candidates) {
    const browserRoot = path.join(puppeteerCacheRoot, candidate.browserDirectory);
    let entries = [];

    try {
      entries = await fs.readdir(browserRoot, { withFileTypes: true });
    } catch {
      continue;
    }

    const linuxDirs = entries
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("linux-"))
      .map((entry) => entry.name)
      .sort(compareLinuxVersionDirsDesc);

    for (const linuxDir of linuxDirs) {
      const executablePath = path.join(browserRoot, linuxDir, ...candidate.executableTail);
      try {
        await fs.access(executablePath);
        return executablePath;
      } catch {
        // Try next candidate path
      }
    }
  }

  return null;
}

async function installBrowsersForPuppeteer() {
  console.log("Puppeteer browser was not found. Installing browser binaries now...");

  const installCommands = [
    "yarn puppeteer browsers install chrome",
    "yarn puppeteer browsers install chrome-headless-shell"
  ];

  let succeeded = 0;
  for (const installCommand of installCommands) {
    const result = await runShellCommand(installCommand);
    if (result.code === 0) {
      succeeded += 1;
      continue;
    }

    console.warn(`Warning: '${installCommand}' failed with exit code ${result.code}.`);
  }

  if (succeeded === 0) {
    throw new Error(
      "Automatic browser installation failed. Run `yarn diagrams:setup` manually and verify `yarn puppeteer browsers list`."
    );
  }
}

async function runMmdcCommand(inputPath, outputPath, executablePath) {
  const envOverrides = {};
  if (executablePath) {
    envOverrides.PUPPETEER_EXECUTABLE_PATH = executablePath;
  }

  const command = `yarn mmdc -p ${quoteForShell(puppeteerConfigPath)} -i ${quoteForShell(inputPath)} -o ${quoteForShell(outputPath)}`;
  return runShellCommand(command, envOverrides);
}

async function runMmdc(inputPath, outputPath) {
  let executablePath = await findInstalledChromeExecutable();
  let result = await runMmdcCommand(inputPath, outputPath, executablePath);
  if (result.code === 0) {
    return;
  }

  if (isMissingChromeError(result.output)) {
    await installBrowsersForPuppeteer();
    executablePath = await findInstalledChromeExecutable();
    result = await runMmdcCommand(inputPath, outputPath, executablePath);
    if (result.code === 0) {
      return;
    }

    if (isMissingChromeError(result.output)) {
      throw new Error(
        "Puppeteer browser is still not resolved after installation. Run `yarn puppeteer browsers list` and verify the browser cache under ~/.cache/puppeteer."
      );
    }
  }

  if (isMissingSharedLibraryError(result.output)) {
    throw new Error(
      "Chrome is installed but required OS libraries are missing in this environment. Rebuild the devcontainer image to apply the Dockerfile Puppeteer library dependencies."
    );
  }

  throw new Error(`mmdc exited with code ${result.code} for ${inputPath}`);
}

async function main() {
  try {
    await fs.access(diagramsRoot);
  } catch {
    console.log("Diagrams directory does not exist, skipping Mermaid generation.");
    return;
  }

  let diagramFiles = [];
  try {
    diagramFiles = await findMmdFiles(diagramsRoot);
  } catch (error) {
    console.error("Failed to scan diagrams directory.");
    throw error;
  }

  if (diagramFiles.length === 0) {
    console.log("No .mmd files found, skipping Mermaid generation.");
    return;
  }

  await fs.mkdir(outputRoot, { recursive: true });

  for (const inputPath of diagramFiles) {
    const relativePath = path.relative(diagramsRoot, inputPath);
    const outputRelativePath = relativePath.replace(/\.mmd$/i, ".png");
    const outputPath = path.join(outputRoot, outputRelativePath);
    const outputDirectory = path.dirname(outputPath);

    await fs.mkdir(outputDirectory, { recursive: true });
    console.log(`Generating diagram: ${relativePath}`);
    await runMmdc(inputPath, outputPath);
  }

  console.log(`Generated ${diagramFiles.length} Mermaid diagram(s).`);
}

main().catch((error) => {
  console.error("Mermaid diagram build failed.");
  console.error(error.message);
  process.exit(1);
});