import {
  createSourceFile,
  ScriptTarget,
  ScriptKind,
  createPrinter,
  EmitHint,
  createObjectLiteral,
  createPropertyAssignment,
  createTemplateExpression,
  createTemplateHead,
  createTemplateSpan,
  createIdentifier,
  createTemplateTail
} from "typescript";

export function print() {
  const resultFile = createSourceFile("notExisting.ts", "", ScriptTarget.Latest, false, ScriptKind.TS);
  const printer = createPrinter();
  const result = printer.printNode(
    EmitHint.Unspecified,
    createObjectLiteral([
      createPropertyAssignment(
        "myprop",
        createTemplateExpression(createTemplateHead("test"), [
          createTemplateSpan(createIdentifier("foo"), createTemplateTail("no"))
        ])
      )
    ]),
    resultFile
  );

  return result;
}
