export default function useFetchData(key, url, options = {}) {
    // useAsyncData works both universally (SSR) and on the client.
    // It accepts a key (for caching/identification) and a function that returns a promise.
    const { data, error, refresh } = useAsyncData(key, () => $fetch(url, options));
    return { data, error, refresh };
  }


