export function awaitToJs<T, U = Error>(
    promise: Promise<T>,
    errorExt?: object,
  ): Promise<[U | null, T | undefined]> {
    return promise
      .then<[null, T]>((data: T) => [null, data])
      .catch<[U, undefined]>((err: U) => {
        if (errorExt) {
          Object.assign(err, errorExt);
        }
  
        return [err, undefined];
      });
  }

  
export const safePromise = (promise: Promise<any>) => {
    return promise.then(data => [data, null]).catch(error => [null, error]);
}
  