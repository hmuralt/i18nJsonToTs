import { createSourceFile, ScriptTarget, ScriptKind, createPrinter, EmitHint, createExportDefault } from "typescript";
import convertObject from "./JsonToIntermediate/JsonConversion";
import createExpression from "./IntermediateToTypeScript/ExpressionCreation";

export function getTypeScriptFromString(i18nJson: string, isDefaultExport: boolean = false) {
  return getTypeScriptFromObject(JSON.parse(i18nJson));
}

export function getTypeScriptFromObject(i18nJson: {}, isDefaultExport: boolean = false) {
  const intermediate = convertObject(i18nJson);
  const typeScriptAst = createExpression(intermediate);
  const resultFile = createSourceFile("notExisting.ts", "", ScriptTarget.Latest, false, ScriptKind.TS);
  const printer = createPrinter();
  return printer.printNode(
    EmitHint.Unspecified,
    isDefaultExport ? createExportDefault(typeScriptAst) : typeScriptAst,
    resultFile
  );
}
