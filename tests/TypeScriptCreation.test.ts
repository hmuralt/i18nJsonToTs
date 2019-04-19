import { isObjectLiteralExpression, isPropertyAssignment, Identifier } from "typescript";
import { createObject } from "../src/TypeScriptCreation";
import { ObjectValueDescription, ValueType } from "../src/IntermediateStructure";

describe("TypeScriptCreation", () => {
  describe("createObject", () => {
    it("returns object literal expression", () => {
      // Arrange
      const testObjectDescription: ObjectValueDescription = {
        type: ValueType.Object,
        propertyDescriptions: new Map([
          ["testKey1", { type: ValueType.NoneString, value: true }],
          ["testKey2", { type: ValueType.String, value: "Simple string" }]
        ])
      };

      // Act
      const result = createObject(testObjectDescription);

      // Assert
      expect(isObjectLiteralExpression(result)).toBe(true);
    });

    it("returns object literal expression with property assignments", () => {
      // Arrange
      const testKey1 = "testKey1";
      const testKey2 = "testKey2";
      const testObjectDescription: ObjectValueDescription = {
        type: ValueType.Object,
        propertyDescriptions: new Map([
          [testKey1, { type: ValueType.NoneString, value: true }],
          [testKey2, { type: ValueType.String, value: "Simple string" }]
        ])
      };

      // Act
      const result = createObject(testObjectDescription);

      // Assert
      expect(result.properties.length).toBe(2);
      expect(isPropertyAssignment(result.properties[0])).toBe(true);
      expect((result.properties[0].name as Identifier).escapedText).toBe(testKey1);
      expect(isPropertyAssignment(result.properties[1])).toBe(true);
      expect((result.properties[1].name as Identifier).escapedText).toBe(testKey2);
    });
  });

  describe("createString", () => {
    it("returns object literal expression", () => {
      // Arrange
      const testObjectDescription: ObjectValueDescription = {
        type: ValueType.Object,
        propertyDescriptions: new Map([
          ["testKey1", { type: ValueType.NoneString, value: true }],
          ["testKey2", { type: ValueType.String, value: "Simple string" }]
        ])
      };

      // Act
      const result = createObject(testObjectDescription);

      // Assert
      expect(isObjectLiteralExpression(result)).toBe(true);
    });
  });
});
