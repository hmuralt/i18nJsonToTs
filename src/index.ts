import { createSourceFile, ScriptTarget, ScriptKind, createPrinter, EmitHint } from "typescript";
import convertObject from "./JsonToIntermediate/JsonConversion";
import createExpression from "./IntermediateToTypeScript/ExpressionCreation";

export function getTypeScriptFromString(i18nJson: string) {
  return getTypeScriptFromObject(JSON.parse(i18nJson));
}

export function getTypeScriptFromObject(i18nJson: {}) {
  const intermediate = convertObject(i18nJson);
  const typeScriptAst = createExpression(intermediate);
  const resultFile = createSourceFile("notExisting.ts", "", ScriptTarget.Latest, false, ScriptKind.TS);
  const printer = createPrinter();
  return printer.printNode(EmitHint.Unspecified, typeScriptAst, resultFile);
}
