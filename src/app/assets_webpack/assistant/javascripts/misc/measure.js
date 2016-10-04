export default function measure(name, fn) {
  return function ()  {
    const start = performance.now();
    const result = fn.apply(this, arguments);
    const duration = performance.now() - start;
    console.log(`Function ${name} executed in ${duration} ms`);
    return result;
  }
}