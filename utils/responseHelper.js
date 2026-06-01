export async function ResponseTime(apiCall) {
  const start = Date.now();

  const response = await apiCall(); // execute API

  const time = Date.now() - start;

  return { response, time };
}