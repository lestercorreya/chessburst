export function containsInList(list, item) {
  for (var i = 0; i < list.length; i++) {
    if (arraysAreEqual(list[i], item)) {
      return true;
    }
  }
  return false;
}

export function arraysAreEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
