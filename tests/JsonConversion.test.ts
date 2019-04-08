import { convertJson } from "../src/JsonConversion";
import {
  PropertyType,
  ArgType,
  PlaceholderFunctionPropertyDescription,
  ObjectPropertyDescription
} from "../src/IntermediateStructure";

describe("JsonConversion", () => {
  describe("convertJson", () => {
    describe("when converting none string properties", () => {
      // tslint:disable-next-line: no-any
      function noneStringPropertyDescriptionTest(testPropertyValue: any) {
        // Arrange
        const testPropertyName = "myNoneStringProp";
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject)).propertyDescriptions[0];

        // Assert
        expect(result.type).toBe(PropertyType.NoneString);
        expect(result.key).toBe(testPropertyName);
        expect(result.valueDescription).toEqual({
          value: testPropertyValue
        });
      }

      it("converts boolean property to NoneStringPropertyDescription", () => noneStringPropertyDescriptionTest(true));
      it("converts number property to NoneStringPropertyDescription", () => noneStringPropertyDescriptionTest(23236));
      it("converts array property to NoneStringPropertyDescription", () =>
        noneStringPropertyDescriptionTest([3, 7, 8]));
    });

    describe("when converting string properties", () => {
      it("converts simple string to StringPropertyDescription", () => {
        // Arrange
        const testPropertyName = "myStringProp";
        const testPropertyValue = "This is a test value";
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject)).propertyDescriptions[0];

        // Assert
        expect(result.type).toBe(PropertyType.String);
        expect(result.key).toBe(testPropertyName);
        expect(result.valueDescription).toEqual({
          value: testPropertyValue
        });
      });

      it("converts string with placeholders to PlaceholderFunctionValueDescription", () => {
        // Arrange
        const testPropertyName = "myStringProp";
        const testPlaceholderName = "adj";
        const testPlaceholderType = "string";
        const testPropertyValue = `This is a test with a {${testPlaceholderName}: ${testPlaceholderType}} placeholder.`;
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject)).propertyDescriptions[0];

        // Assert
        expect(result.type).toBe(PropertyType.PlaceholderFunction);
        expect(result.key).toBe(testPropertyName);
        expect(result.valueDescription).toEqual({
          args: [
            {
              name: testPlaceholderName,
              type: ArgType.String
            }
          ],
          stringTemplate: [
            "This is a test with a ",
            {
              name: testPlaceholderName,
              type: ArgType.String
            },
            " placeholder."
          ]
        });
      });

      it("converts string with placeholders at the start to correct string template", () => {
        // Arrange
        const testPropertyName = "myStringProp";
        const testPlaceholderName = "adj";
        const testPlaceholderType = "string";
        const testPropertyValue = `{${testPlaceholderName}: ${testPlaceholderType}} placeholder.`;
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject))
          .propertyDescriptions[0] as PlaceholderFunctionPropertyDescription;

        // Assert
        expect(result.valueDescription.stringTemplate).toEqual([
          {
            name: testPlaceholderName,
            type: ArgType.String
          },
          " placeholder."
        ]);
      });

      it("converts string with placeholders at the start to correct string template", () => {
        // Arrange
        const testPropertyName = "myStringProp";
        const testPlaceholderName = "adj";
        const testPlaceholderType = "string";
        const testPropertyValue = `it begins with {${testPlaceholderName}: ${testPlaceholderType}}`;
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject))
          .propertyDescriptions[0] as PlaceholderFunctionPropertyDescription;

        // Assert
        expect(result.valueDescription.stringTemplate).toEqual([
          "it begins with ",
          {
            name: testPlaceholderName,
            type: ArgType.String
          }
        ]);
      });

      it("converts string with unkown placeholders type per default to string", () => {
        // Arrange
        const testPropertyName = "myStringProp";
        const testPlaceholderName = "adj";
        const testPlaceholderType = "foo";
        const testPropertyValue = `{${testPlaceholderName}: ${testPlaceholderType}}`;
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject))
          .propertyDescriptions[0] as PlaceholderFunctionPropertyDescription;

        // Assert
        expect(result.valueDescription).toEqual({
          args: [
            {
              name: testPlaceholderName,
              type: ArgType.String
            }
          ],
          stringTemplate: [
            {
              name: testPlaceholderName,
              type: ArgType.String
            }
          ]
        });
      });

      it("lists a placeholder appearing multiple times in string just once", () => {
        // Arrange
        const testPropertyName = "myStringProp";
        const testPlaceholderName = "adj";
        const testPlaceholderType = "foo";
        const testPropertyValue = `1: {${testPlaceholderName}: ${testPlaceholderType}}, 2: {${testPlaceholderName}: ${testPlaceholderType}}.`;
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject))
          .propertyDescriptions[0] as PlaceholderFunctionPropertyDescription;

        // Assert
        expect(result.type).toBe(PropertyType.PlaceholderFunction);
        expect(result.valueDescription.args).toEqual([
          {
            name: testPlaceholderName,
            type: ArgType.String
          }
        ]);
      });
    });

    describe("when converting object properties", () => {
      it("converts to ObjectPropertyDescription", () => {
        // Arrange
        const testPropertyName = "myObjectProp";
        const testPropertyValue = {};
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject)).propertyDescriptions[0];

        // Assert
        expect(result.type).toBe(PropertyType.Object);
        expect(result.key).toBe(testPropertyName);
        expect(result.valueDescription).toEqual({
          propertyDescriptions: []
        });
      });

      it("converts properties of the object", () => {
        // Arrange
        const testInnerPropertyName = "myStringProp";
        const testInnerPropertyValue = "This is a test value";
        const testPropertyName = "myObjectProp";
        const testPropertyValue = {
          [testInnerPropertyName]: testInnerPropertyValue
        };
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject)).propertyDescriptions[0] as ObjectPropertyDescription;

        // Assert
        expect(result.type).toBe(PropertyType.Object);
        expect(result.key).toBe(testPropertyName);
        expect(result.valueDescription.propertyDescriptions[0].type).toEqual(PropertyType.String);
        expect(result.valueDescription.propertyDescriptions[0].key).toEqual(testInnerPropertyName);
      });
    });
  });
});
