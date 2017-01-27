Tacticalmastery
==================

Forget Guns, This Flashlight is Blinding !

Usage
==================
Prerequisite :
- node w/ npm
- gulp

And then :

```
$ git clone {GIT_URL}
$ npm install
$ gulp
```

Ready to go!!

How does frontend works
=====================
This repo have mainly static HTML, CSS, images and client side javascripts file aimed to be served by web server as frontend code.
It interacts with backend api using function `callAPI` from file `src/scripts/app/utils.js`
Frontend code is executed in clients browser, and `callAPI` function uses client's browsers ajax capabilities to make
requests to backend api, working at `https://api.tacticalmastery.com/api/v2/` currently.

This approach is vulnerable to clickjacking, because `api.tacticalmastery.com` is not the SAME ORIGIN
to the host where the frontend being served, so it requires that `api.tacticalmastery.com` has permissive same origin headers.
And that's why it is too vulnerable for clickjacking!

Additional info on [same origin policy for browsers](https://en.wikipedia.org/wiki/Same-origin_policy).



Working with docker image
=====================

```shell

docker build -t frontend .
docker run frontend

```

It will start http server listening on 9000 port.
Not that this is simple static server, it do not calls the backend api.


How this repo can be fixed.
=====================
Very opinionated idea of Anatolij, freelance web developer since 2006 year,
and Russian Ministry of Defense engineer at 2002 - 2006.


Firstly, what does this repo do?
It ***generates frontend code using*** `gulp` in the directory of `{CURRENT_DIRECTORY}/tacticalsales/assets/`.
Frontend code is STATIC HTML, JS, CSS and other assets (unminified and quite ugly, but it is not urgent).
It does not require nodejs for operation, just simple web server - see proof -

```js

gulp.task("serve", ["new"], function () {
  connect.server({
    root: "tacticalsales",
    port: 9000
  });
});

```

somewhere near the end of `gulpfile.js`

Secondly, it calls the API on other domain via ajax calls.


Summary:

1. Frontend code is just few read only files that can be served by any web server
2. The code calls other domain as api in single point of code
 
What i propose:

We need nginx docker container that will do this things:
1. it will be serving domain `tacticalmastery.com` - both `http` and `https` using certs. 
2. Nginx container will share volume with frontend container, so it can have read only access to frontend files.
3. If clients request points to existent file, nginx will serve the file directly. It is very fast approach.
4. If clients request points to non existant file, for example, client asks for `GET /api/v1/something` or even `GET /something`, 
and there are no any similiarities with this files, nginx will treat this request as being the one aimed to backend api.
5. Requests for api are treated by nginx in different way that requests to existant files - they will be proxied to docker 
container that has the backend api running in it. I used this approach for few years, best example is this nginx config - 
https://github.com/vodolaz095/hunt/blob/master/examples/serverConfigsExamples/nginx.conf
6. So, `BOTH frontend and backend` is served FROM THE SAME origin `tacticalmastery.com` with very restrictive cross 
origin headers - clickjackers are very unhappy.

7. the '/' or '/index.html' route, the first route that users use to enter the site have to be served by backend api.
Backend api will start secure and http only cookie based session that is realy hard to tamper and fake - so, DDOSers need 
things much more sophisticated than curl to DDOS certain api endpoints - they will just recieve 500 or 400 errors 
for being unable to tamper session.
Also this `/` route will establish secure HTTP based session with CSRF tokens. The session will be stored in `redis` datase
container with whom i have created earlier today.






