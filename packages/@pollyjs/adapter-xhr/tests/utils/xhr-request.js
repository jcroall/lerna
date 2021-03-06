import serializeResponseHeaders from '../../src/utils/serialize-response-headers';

export default function request(url, obj = {}) {
  return new Promise((resolve) => {
    const xhr = obj.xhr || new XMLHttpRequest();

    xhr.open(obj.method || 'GET', url);

    if (obj.headers) {
      for (const h in obj.headers) {
        xhr.setRequestHeader(h, obj.headers[h]);
      }
    }

    if (obj.responseType) {
      xhr.responseType = obj.responseType;
    }

    xhr.onreadystatechange = () =>
      xhr.readyState === XMLHttpRequest.DONE && resolve(xhr);
    xhr.onerror = () => resolve(xhr);

    xhr.send(obj.body);
  }).then((xhr) => {
    const responseBody =
      xhr.status === 204 && xhr.response === '' ? null : xhr.response;

    return new Response(responseBody, {
      status: xhr.status || 500,
      statusText: xhr.statusText,
      headers: serializeResponseHeaders(xhr.getAllResponseHeaders())
    });
  });
}
