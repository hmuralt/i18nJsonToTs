export function* getAllMatches(value: string, regex: RegExp) {
  const clone = new RegExp(regex.source, regex.flags);
  let match = null;
  do {
    match = clone.exec(value);
    if (match) {
      yield match;
    }
  } while (match);
}
