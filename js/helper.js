function load_template(dom_element, template_name) {
  return get("/app/templates/" + template_name + ".html", null, function(response) {
    dom_element.innerHTML = response;
  });
}

function delete_article(uuid) {
  // refresh_access_token();
  var access_token = docCookies.getItem("access_token");
  var headers = {
    "Authorization": "Bearer " + access_token
  };
  return del("/jsonapi/node/article/" + uuid, headers);
}

function has_text(str) {
  return /\S/.test(str);
}

function add_new_article(title, body) {
  // refresh_access_token();
  if (is_user_authenticated() && has_text(title) && has_text(body)) {
    var access_token = docCookies.getItem("access_token");
    var headers = {
      "Content-Type": "application/vnd.api+json",
      "Authorization": "Bearer " + access_token
    };
    var body = {
      "data": {
        "attributes": {
          "langcode": "en",
          "status": true,
          "title": title,
          "body": {
            "value": body,
            "format": "basic_html",
            "summary": null
          }
        }
      }
    };
    return post("/jsonapi/node/article", headers, JSON.stringify(body));
  }
}

function load_articles_list() {
  return get("/jsonapi/node/article").then(function (response) {
    var articles_html = "";
    var r = JSON.parse(response);
    for (var i = 0; i < r.data.length; i++) {
      var article = r.data[i].attributes;
      articles_html += "<div class='article'><h2>" + article.title + "</h2>";
      if (article.body != undefined) {
        articles_html += "<p>" + article.body.value + "</p>"
      } else {
        articles_html += "<p>No body text for this article.</p>";
      }
      articles_html += "<p class='delete' data-uuid='" + article.uuid + "'>Delete</p></div>";
    }
    return articles_html;
  }, function() {
    return "Articles could not be loaded.";
  });
}

function is_user_authenticated() {
  return docCookies.getItem("authenticated") == "yes";
}

function logout_user() {
  docCookies.setItem("authenticated", "no");
  docCookies.setItem("access_token", "");
  docCookies.setItem("refresh_token", "");
}

function authenticate_user(username, password) {
  var headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  var body = {
    "grant_type": "password",
    "client_id": client_id,
    "client_secret": client_secret,
    "username": username,
    "password": password
  };
  logout_user();
  return post("/oauth/token", headers, query_encode(body), function(response) {
    r = JSON.parse(response);
    console.log(r);
    docCookies.setItem("authenticated", "yes");
    docCookies.setItem("access_token", r.access_token)
    docCookies.setItem("refresh_token", r.refresh_token);
    console.log(r.refresh_token);
  });
}

function refresh_access_token() {
  // this doesn't work
  var refresh_token = docCookies.getItem("refresh_token");
  logout_user();
  var headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
  };
  var body = {
    "client_id": client_id,
    "client_secret": client_secret,
    "refresh_token": refresh_token,
    "grant_type": "refresh_token"
  };
  return post("/oauth/token", headers, query_encode(body)).then(function(response) {
    r = JSON.parse(response);
    docCookies.setItem("authenticated", "yes");
    docCookies.setItem("access_token", r.access_token)
    docCookies.setItem("refresh_token", r.refresh_token);
  });
}