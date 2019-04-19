import { convertJson } from "../src/JsonConversion";
import {
  ArgType,
  isObjectValueDescription,
  ValueDescription,
  isNoneStringValueDescription,
  isStringValueDescription,
  isPlaceholderFunctionValueDescription,
  isPluralFunctionValueDescription
} from "../src/IntermediateStructure";

describe("JsonConversion", () => {
  describe("convertJson", () => {
    describe("when converting none string properties", () => {
      // tslint:disable-next-line: no-any
      function noneStringValueDescriptionTest(testPropertyValue: any) {
        // Arrange
        const testPropertyName = "myNoneStringProp";
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        const objectValueDescription = getAs(isObjectValueDescription, result);
        const noneStringValueDescription = getAs(
          isNoneStringValueDescription,
          objectValueDescription.propertyDescriptions.get(testPropertyName)
        );
        expect(noneStringValueDescription.value).toEqual(testPropertyValue);
      }

      it("converts boolean property to NoneStringValueDescription", () => noneStringValueDescriptionTest(true));
      it("converts number property to NoneStringValueDescription", () => noneStringValueDescriptionTest(23236));
      it("converts array property to NoneStringValueDescription", () => noneStringValueDescriptionTest([3, 7, 8]));
    });

    describe("when converting string properties", () => {
      it("converts simple string to StringValueDescription", () => {
        // Arrange
        const testPropertyName = "myStringProp";
        const testPropertyValue = "This is a test value";
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        const objectValueDescription = getAs(isObjectValueDescription, result);
        const stringValueDescription = getAs(
          isStringValueDescription,
          objectValueDescription.propertyDescriptions.get(testPropertyName)
        );
        expect(stringValueDescription.value).toEqual(testPropertyValue);
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
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        const objectValueDescription = getAs(isObjectValueDescription, result);
        const placeholderFunctionValueDescription = getAs(
          isPlaceholderFunctionValueDescription,
          objectValueDescription.propertyDescriptions.get(testPropertyName)
        );
        expect(placeholderFunctionValueDescription.args).toEqual([
          {
            name: testPlaceholderName,
            type: ArgType.String
          }
        ]);
        expect(placeholderFunctionValueDescription.stringTemplate).toEqual([
          "This is a test with a ",
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
        const testPropertyValue = `{${testPlaceholderName}: ${testPlaceholderType}} placeholder.`;
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        const objectValueDescription = getAs(isObjectValueDescription, result);
        const placeholderFunctionValueDescription = getAs(
          isPlaceholderFunctionValueDescription,
          objectValueDescription.propertyDescriptions.get(testPropertyName)
        );
        expect(placeholderFunctionValueDescription.stringTemplate).toEqual([
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
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        const objectValueDescription = getAs(isObjectValueDescription, result);
        const placeholderFunctionValueDescription = getAs(
          isPlaceholderFunctionValueDescription,
          objectValueDescription.propertyDescriptions.get(testPropertyName)
        );
        expect(placeholderFunctionValueDescription.stringTemplate).toEqual([
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
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        const objectValueDescription = getAs(isObjectValueDescription, result);
        const placeholderFunctionValueDescription = getAs(
          isPlaceholderFunctionValueDescription,
          objectValueDescription.propertyDescriptions.get(testPropertyName)
        );
        expect(placeholderFunctionValueDescription.args).toEqual([
          {
            name: testPlaceholderName,
            type: ArgType.String
          }
        ]);
        expect(placeholderFunctionValueDescription.stringTemplate).toEqual([
          {
            name: testPlaceholderName,
            type: ArgType.String
          }
        ]);
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
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        const objectValueDescription = getAs(isObjectValueDescription, result);
        const placeholderFunctionValueDescription = getAs(
          isPlaceholderFunctionValueDescription,
          objectValueDescription.propertyDescriptions.get(testPropertyName)
        );
        expect(placeholderFunctionValueDescription.args).toEqual([
          {
            name: testPlaceholderName,
            type: ArgType.String
          }
        ]);
      });
    });

    describe("when converting object properties", () => {
      it("converts to ObjectValueDescription", () => {
        // Arrange
        const testPropertyName = "myObjectProp";
        const testPropertyValue = {};
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        const objectValueDescription = getAs(isObjectValueDescription, result);
        const innerObjectValueDescription = getAs(
          isObjectValueDescription,
          objectValueDescription.propertyDescriptions.get(testPropertyName)
        );
        expect(innerObjectValueDescription.propertyDescriptions).toEqual(new Map());
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
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        const objectValueDescription = getAs(isObjectValueDescription, result);
        const innerObjectValueDescription = getAs(
          isObjectValueDescription,
          objectValueDescription.propertyDescriptions.get(testPropertyName)
        );
        const innerStringValueDescription = getAs(
          isStringValueDescription,
          innerObjectValueDescription.propertyDescriptions.get(testInnerPropertyName)
        );
        expect(innerStringValueDescription.value).toEqual(testInnerPropertyValue);
      });

      it("converts plural form objects to PluralFunctionValueDescription", () => {
        // Arrange
        const testPropertyName = "myObjectProp";
        const testPropertyValue = {
          0: "No tests",
          1: "One test",
          n: "{count: number} tests"
        };
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        const objectValueDescription = getAs(isObjectValueDescription, result);
        const pluralFunctionValueDescription = getAs(
          isPluralFunctionValueDescription,
          objectValueDescription.propertyDescriptions.get(testPropertyName)
        );
        expect(pluralFunctionValueDescription.args).toEqual([
          {
            name: "count",
            type: "number"
          }
        ]);
        expect(pluralFunctionValueDescription.values).toEqual({
          0: "No tests",
          1: "One test",
          n: [
            {
              name: "count",
              type: ArgType.Number
            },
            " tests"
          ]
        });
      });

      it("adds all args of the plural form objects property values", () => {
        // Arrange
        const testPropertyName = "myObjectProp";
        const testPropertyValue = {
          0: "No { somePlaceholder: toString } tests",
          1: "One { anotherPlaceholder: string } test",
          n: "{count: number} tests"
        };
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        const objectValueDescription = getAs(isObjectValueDescription, result);
        const pluralFunctionValueDescription = getAs(
          isPluralFunctionValueDescription,
          objectValueDescription.propertyDescriptions.get(testPropertyName)
        );
        expect(pluralFunctionValueDescription.args).toEqual([
          {
            name: "count",
            type: "number"
          },
          {
            name: "somePlaceholder",
            type: "toString"
          },
          {
            name: "anotherPlaceholder",
            type: "string"
          }
        ]);
      });
    });
  });
});

function getAs<TValueDescription extends ValueDescription>(
  check: (v: ValueDescription) => v is TValueDescription,
  valueDescription: ValueDescription | undefined
): TValueDescription {
  if (valueDescription === undefined) {
    throw Error("valueDescription is undefined");
  }

  if (!check(valueDescription)) {
    throw Error("Passed valueDescription is not of expected type");
  }

  return valueDescription;
}
