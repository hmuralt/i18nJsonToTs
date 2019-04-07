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
  });
});
