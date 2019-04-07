import { convertJson } from "../src/JsonConvertion";

describe("JsonConvertion", () => {
  describe("convertJson", () => {
    describe("when converting boolean property", () => {
      it("converts property to NoneStringValueDescription", () => {
        // Arrange
        const testPropertyName = "myBooleanProp";
        const testPropertyValue = true;
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        expect(result.propertyDescriptions[0].key).toBe(testPropertyName);
        expect(result.propertyDescriptions[0].valueDescription).toEqual({
          value: testPropertyValue
        });
      });
    });

    describe("when converting number property", () => {
      it("converts property to NoneStringValueDescription", () => {
        // Arrange
        const testPropertyName = "myNumberProp";
        const testPropertyValue = 23662;
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        expect(result.propertyDescriptions[0].key).toBe(testPropertyName);
        expect(result.propertyDescriptions[0].valueDescription).toEqual({
          value: testPropertyValue
        });
      });
    });

    describe("when converting array property", () => {
      it("converts property to NoneStringValueDescription", () => {
        // Arrange
        const testPropertyName = "myArrayProp";
        const testPropertyValue = [3, 7, 4, 8];
        const testJsonObject = {
          [testPropertyName]: testPropertyValue
        };

        // Act
        const result = convertJson(JSON.stringify(testJsonObject));

        // Assert
        expect(result.propertyDescriptions[0].key).toBe(testPropertyName);
        expect(result.propertyDescriptions[0].valueDescription).toEqual({
          value: testPropertyValue
        });
      });
    });
  });
});
