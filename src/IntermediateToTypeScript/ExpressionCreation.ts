import {
  createObjectLiteral,
  PropertyAssignment,
  createPropertyAssignment,
  SyntaxKind,
  createLiteral,
  createArrayLiteral,
  Expression,
  createIdentifier,
  createArrowFunction,
  createBlock,
  createBinary,
  createReturn,
  createIf,
  Statement
} from "typescript";
import {
  ObjectValueDescription,
  ValueDescription,
  isObjectValueDescription,
  isPrimitiveValueDescription,
  PrimitiveValueDescription,
  isArrayValueDescription,
  ArrayValueDescription,
  PlaceholderFunctionValueDescription,
  isPlaceholderFunctionValueDescription,
  isPluralFunctionValueDescription,
  PluralFunctionValueDescription
} from "../Intermediate/IntermediateStructure";
import { pluralFormNthKey } from "../JsonToIntermediate/JsonStructure";
import createParameters from "./ParameterCreation";
import createTemplate from "./TemplateExpressionCreation";

export default function createExpression(valueDescription: ValueDescription): Expression {
  if (isPrimitiveValueDescription(valueDescription)) {
    return createValue(valueDescription);
  }

  if (isArrayValueDescription(valueDescription)) {
    return createArray(valueDescription);
  }

  if (isObjectValueDescription(valueDescription)) {
    return createObject(valueDescription);
  }

  if (isPlaceholderFunctionValueDescription(valueDescription)) {
    return createPlaceholderFunction(valueDescription);
  }

  if (isPluralFunctionValueDescription(valueDescription)) {
    return createPluralFunction(valueDescription);
  }

  return createLiteral(SyntaxKind.UndefinedKeyword);
}

function createValue(valueDescription: PrimitiveValueDescription) {
  return createLiteral(valueDescription.value);
}

function createArray(valueDescription: ArrayValueDescription) {
  const expressions = valueDescription.valueDescriptions.map((currentValueDescription) =>
    createExpression(currentValueDescription)
  );

  return createArrayLiteral(expressions);
}

function createObject(objectValueDescription: ObjectValueDescription) {
  const propertyAssignments = new Array<PropertyAssignment>();

  for (const [key, valueDescription] of objectValueDescription.propertyDescriptions) {
    propertyAssignments.push(createPropertyAssignment(key, createExpression(valueDescription)));
  }

  return createObjectLiteral(propertyAssignments);
}

function createPlaceholderFunction(valueDescription: PlaceholderFunctionValueDescription) {
  const parameters = createParameters(valueDescription.args);

  const templateExpression = createTemplate(valueDescription.stringParts);

  return createArrowFunction(undefined, undefined, parameters, undefined, undefined, templateExpression);
}

function createPluralFunction(valueDescription: PluralFunctionValueDescription) {
  const { args, values } = valueDescription;

  const parameters = createParameters(args);

  const valueKeys = Object.keys(values);

  const statements: Statement[] = valueKeys
    .filter((valueKey) => valueKey !== pluralFormNthKey)
    .map((valueKey) => {
      const value = values[valueKey];

      const condition = createBinary(
        createIdentifier("count"),
        SyntaxKind.EqualsEqualsEqualsToken,
        createLiteral(parseInt(valueKey, 10))
      );

      const ifBody = createBlock(
        [createReturn(typeof value === "string" ? createLiteral(value) : createTemplate(value))],
        false
      );

      return createIf(condition, ifBody);
    });

  const nthValue = valueDescription.values[pluralFormNthKey];

  statements.push(createReturn(typeof nthValue === "string" ? createLiteral(nthValue) : createTemplate(nthValue)));

  const block = createBlock(statements, false);

  return createArrowFunction(undefined, undefined, parameters, undefined, undefined, block);
}
