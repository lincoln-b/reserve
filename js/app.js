var app;
restart();

function restart() {
  app = document.getElementById("app")
  app.innerHTML = "";
  if (is_user_authenticated()) {
    show_dashboard();
  } else {
    show_login();
  }
}

function show_dashboard() {
  load_template(app, "dashboard").then(load_dashboard_functions);
}

function load_dashboard_functions() {
  var articles_list = document.getElementById("articles_list");
  load_articles_list().then(function (response) {
    articles_list.innerHTML = response;
    var delete_btns = document.getElementsByClassName('delete');
    for (var i = 0; i < delete_btns.length; i++) {
      delete_btns[i].onclick = function() {
        delete_article(this.dataset.uuid).then(restart);
      };
    }
  });

  var articles_submit = document.getElementById("articles_submit");
  articles_submit.onsubmit = function(e) {
    e.preventDefault();
    var title = document.getElementById("title").value;
    var body = document.getElementById("body").value;
    add_new_article(title, body).then(restart);
  }

  var logout_btn = document.getElementById("logout");
  logout_btn.onclick = function() {
    logout_user();
    restart();
  };
}

function show_login() {
  load_template(app, "login_form").then(load_login_functions);
}

function load_login_functions() {
  var login_form = document.getElementById("login_form");
  login_form.onsubmit = function(e) {
    e.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    authenticate_user(username, password).then(function(response) {
      restart();
    }, function() {
      failed_login_attempt();
    });
  }
}

function failed_login_attempt() {
  app.innerHTML += "<p class='red'>The username/password combo was incorrect!</p>";
  load_login_functions();
}