const createDelayedFunction = <T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  delay: number = 400,
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const start = Date.now();
    const result = await fn(...args);
    const end = Date.now();

    const elapsedTime = end - start;

    if (elapsedTime < delay) {
      const remainingTime = delay - elapsedTime;
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    return result as ReturnType<T>;
  };
};

export default createDelayedFunction;
