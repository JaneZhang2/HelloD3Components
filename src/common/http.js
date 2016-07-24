import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import history from './history'
import cache from './cache'
import constants from './constants'

function http(url, options) {
  options.headers['x-authToken'] =
    JSON.parse(localStorage.getItem(constants.cacheKeys.authToken));

  return fetch(url, options).then(function (response) {
    if (response.status !== 200) {
      var err = new Error('网络异常');
      err.status = response.status;
      throw err;
    }
    return response.json().then(function (res) {
      if (res.status !== 0) {
        var err = new Error(res.message || '未知错误');
        err.status = res.status;
        if (err.status === 400) {
          if (!/^#\/login?.*$/.test(location.hash) || !/\/logout$/.test(url)) {
            history.push('/login');
          }
        }
        throw err;
      }
      return res.data;
    }, function () {
      var err = new Error('数据解析异常');
      err.status = 'DATA-ERROR';
      throw err;
    })
  }, function (error) {
    console.log('fetch error : ' + error);
    error.status = 'FETCH-ERROR';
    throw error;
  })
}

http.defaults = {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
};

http.get = function (url, options) {
  options = options || {};
  options.method = "GET";
  options = _.merge({}, http.defaults, options);
  return http(url, options);
};

http.post = function (url, data, options) {
  options = options || {};
  options.body = JSON.stringify(data);
  options.method = "POST";
  options = _.merge({}, http.defaults, options);
  return http(url, options);
};

http.put = function (url, data, options) {
  options = options || {};
  options.body = JSON.stringify(data);
  options.method = "PUT";
  options = _.merge({}, http.defaults, options);
  return http(url, options);
};


http.delete = function (url, options) {
  options = options || {};
  options.method = "DELETE";
  options = _.merge({}, http.defaults, options);
  return http(url, options);
};

export default http;