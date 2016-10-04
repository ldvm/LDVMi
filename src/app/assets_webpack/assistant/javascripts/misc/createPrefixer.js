export default function createPrefixer(prefix) {
  return str => {
    if (str) {
      return prefix + '/' + str;
    } else {
      return prefix;
    }
  }
}
