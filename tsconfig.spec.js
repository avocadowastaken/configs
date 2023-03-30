import { test } from "uvu";
import * as assert from "uvu/assert";

import ts from "typescript";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

test("warnings", () => {
  const cwd = path.dirname(fileURLToPath(import.meta.url));
  const configFilePath = ts.findConfigFile(
    cwd,
    ts.sys.fileExists,
    "tsconfig.json"
  );

  assert.ok(configFilePath, `Failed to resolve "tsconfig.json" from "${cwd}"`);

  const configFile = ts.readConfigFile(configFilePath, ts.sys.readFile);
  const { options, fileNames, errors } = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    cwd
  );

  const program = ts.createProgram(
    fileNames,
    options,
    undefined,
    undefined,
    errors
  );

  const optionsDiagnostics = program.getOptionsDiagnostics();
  assert.ok(
    optionsDiagnostics.length === 0,
    `Found ${
      optionsDiagnostics.length
    } diagnostics issues:\n${optionsDiagnostics
      .map(
        (x) =>
          `\t${
            typeof x.messageText == "string"
              ? x.messageText
              : x.messageText.messageText
          }`
      )
      .join("\n")}`
  );
});

test.run();
