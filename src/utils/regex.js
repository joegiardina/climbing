export default function regex(pattern, input) {
  const matches = input.match(pattern);
  if (matches && matches.length) {
    return matches[1];
  }
}
