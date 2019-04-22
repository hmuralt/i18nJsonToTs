import { StringPart } from "../Intermediate/IntermediateStructure";
import {
  createTemplateHead,
  createTemplateTail,
  createTemplateMiddle,
  createTemplateSpan,
  createIdentifier,
  TemplateSpan,
  createTemplateExpression
} from "typescript";

export default function createTemplate(stringParts: StringPart) {
  const firstPart = typeof stringParts[0] === "string" ? (stringParts[0] as string) : "";
  const templateHead = createTemplateHead(firstPart);

  const templateSpans = stringParts
    .map((part, index) => {
      if (typeof part === "string") {
        return undefined;
      }

      const nextPart = stringParts[index + 1];

      let nextText = "";
      if (typeof nextPart === "string") {
        nextText = nextPart;
      }

      let templateMiddelOrTail;
      if (index === stringParts.length - 1 || index === stringParts.length - 2) {
        templateMiddelOrTail = createTemplateTail(nextText);
      } else {
        templateMiddelOrTail = createTemplateMiddle(nextText);
      }

      return createTemplateSpan(createIdentifier(part.name), templateMiddelOrTail);
    })
    .filter((templateSpan) => templateSpan !== undefined) as TemplateSpan[];

  return createTemplateExpression(templateHead, templateSpans);
}
