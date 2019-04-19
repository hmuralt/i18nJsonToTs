import {
  createObjectLiteral,
  PropertyAssignment,
  createPropertyAssignment,
  SyntaxKind,
  createLiteral
} from "typescript";
import { ObjectValueDescription } from "./IntermediateStructure";

export function createObject(objectValueDescription: ObjectValueDescription) {
  const propertyAssignments = new Array<PropertyAssignment>();

  for (const [key] of objectValueDescription.propertyDescriptions) {
    propertyAssignments.push(createPropertyAssignment(key, createLiteral(SyntaxKind.UndefinedKeyword)));
  }

  return createObjectLiteral(propertyAssignments);
}
