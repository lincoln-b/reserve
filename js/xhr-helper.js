function query_encode(obj) {
  var str = "";
  var sep = "";
  for (var key in obj) {
    str += sep + key + "=" + obj[key];
    sep = "&";
  }
  return str;
}

function del(url, headers = null, body = null, callback = null) {

  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('DELETE', url);
    for (var key in headers) {
      req.setRequestHeader(key, headers[key]);
    }

    req.onload = function() {
      if (req.status >= 200 && req.status < 300) {
        if (callback != null) {
          callback(req.response);
        }
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    }
    
    req.send();
  });
}

function post(url, headers = null, body = null, callback = null) {

  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('POST', url);
    for (var key in headers) {
      req.setRequestHeader(key, headers[key]);
    }

    req.onload = function() {
      if (req.status >= 200 && req.status < 300) {
        if (callback != null) {
          callback(req.response);
        }
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    }
    debugger;
    req.send(body);
  });
}

function get(url, headers = null, callback = null) {

  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);
    for (var key in headers) {
      req.setRequestHeader(key, headers[key]);
    }

    req.onload = function() {
      if (req.status >= 200 && req.status < 300) {
        if (callback != null) {
          callback(req.response);
        }
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };

    req.send();
  });
}