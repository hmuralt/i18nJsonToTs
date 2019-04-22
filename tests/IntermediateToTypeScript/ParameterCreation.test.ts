import createParameters from "../../src/IntermediateToTypeScript/ParameterCreation";
import { Arg, ArgType } from "../../src/Intermediate/IntermediateStructure";
import { Identifier, SyntaxKind } from "typescript";

describe("ParameterCreation", () => {
  it("Returns the parameters according to passed types", () => {
    // Arrange
    const args: Arg[] = [
      { name: "arg1", type: ArgType.String },
      { name: "arg2", type: ArgType.Number },
      { name: "arg3", type: ArgType.Object }
    ];

    // Act
    const result = createParameters(args);

    // Assert
    expect((result[0].name as Identifier).escapedText).toBe(args[0].name);
    expect(result[0].type!.kind).toBe(SyntaxKind.StringKeyword);
    expect((result[1].name as Identifier).escapedText).toBe(args[1].name);
    expect(result[1].type!.kind).toBe(SyntaxKind.NumberKeyword);
    expect((result[2].name as Identifier).escapedText).toBe(args[2].name);
    expect(result[2].type!.kind).toBe(SyntaxKind.ObjectKeyword);
  });
});
