import createTemplate from "../../src/IntermediateToTypeScript/TemplateExpressionCreation";
import { Identifier, TemplateTail, TemplateMiddle } from "typescript";
import { ArgName } from "../../src/Intermediate/IntermediateStructure";

describe("TemplateExpressionCreation", () => {
  describe("when has only string", () => {
    it("sets string as head and not template spans", () => {
      // Arrange
      const testStringParts = ["sample text"];

      // Act
      const result = createTemplate(testStringParts);

      // Assert
      expect(result.head.text).toBe(testStringParts[0]);
      expect(result.templateSpans.length).toBe(0);
    });
  });

  describe("when has only arg", () => {
    it("sets empty string as head and template span with empty tail", () => {
      // Arrange
      const testStringParts = [{ name: "arg" }];

      // Act
      const result = createTemplate(testStringParts);

      // Assert
      expect(result.head.text).toBe("");
      expect((result.templateSpans[0].expression as Identifier).escapedText).toBe((testStringParts[0] as ArgName).name);
      expect((result.templateSpans[0].literal as TemplateTail).text).toBe("");
    });
  });

  describe("when starts with string and ends with arg", () => {
    it("sets string as head and template span with identifier and empty string as template tail", () => {
      // Arrange
      const testStringParts = ["sample text", { name: "arg" }];

      // Act
      const result = createTemplate(testStringParts);

      // Assert
      expect(result.head.text).toBe(testStringParts[0]);
      expect((result.templateSpans[0].expression as Identifier).escapedText).toBe((testStringParts[1] as ArgName).name);
      expect((result.templateSpans[0].literal as TemplateTail).text).toBe("");
    });
  });

  describe("when starts with arg and ends with string", () => {
    it("sets empty string as head and template span with identifier and string as template tail", () => {
      // Arrange
      const testStringParts = [{ name: "arg" }, "sample text"];

      // Act
      const result = createTemplate(testStringParts);

      // Assert
      expect(result.head.text).toBe("");
      expect((result.templateSpans[0].expression as Identifier).escapedText).toBe((testStringParts[0] as ArgName).name);
      expect((result.templateSpans[0].literal as TemplateTail).text).toBe(testStringParts[1]);
    });
  });

  describe("when starts with string, has arg in middle and ends with string", () => {
    it("sets string as head and template span with identifier and string as template tail", () => {
      // Arrange
      const testStringParts = ["sample text 1", { name: "arg" }, "sample text 2"];

      // Act
      const result = createTemplate(testStringParts);

      // Assert
      expect(result.head.text).toBe(testStringParts[0]);
      expect((result.templateSpans[0].expression as Identifier).escapedText).toBe((testStringParts[1] as ArgName).name);
      expect((result.templateSpans[0].literal as TemplateTail).text).toBe(testStringParts[2]);
    });
  });

  describe("when has multiple args", () => {
    it("sets string as head, template span with identifier and string as template middle and template span with identifier and string as template tail", () => {
      // Arrange
      const testStringParts = ["sample text 1", { name: "arg1" }, "sample text 2", { name: "arg2" }];

      // Act
      const result = createTemplate(testStringParts);

      // Assert
      expect(result.head.text).toBe(testStringParts[0]);
      expect((result.templateSpans[0].expression as Identifier).escapedText).toBe((testStringParts[1] as ArgName).name);
      expect((result.templateSpans[0].literal as TemplateMiddle).text).toBe(testStringParts[2]);
      expect((result.templateSpans[1].expression as Identifier).escapedText).toBe((testStringParts[3] as ArgName).name);
      expect((result.templateSpans[1].literal as TemplateTail).text).toBe("");
    });
  });
});
