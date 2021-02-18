import request from './request';

export default function(baseUrl) {
  return function(path) {
    return request(`${baseUrl}${path}`);
  }
}