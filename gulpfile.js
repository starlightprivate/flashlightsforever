/* jshint node: true */

"use strict";

var _         = require("lodash"),
  gulp        = require("gulp"),
  sass        = require("gulp-sass"),
  cleanCSS    = require("gulp-clean-css"),
  jshint      = require("gulp-jshint"),
  uglify      = require("gulp-uglify"),
  rename      = require("gulp-rename"),
  del         = require("del"),
  concat      = require("gulp-concat"),
  cache       = require("gulp-cache"),
  size        = require("gulp-size"),
  plumber     = require('gulp-plumber'),
  purify      = require("gulp-purifycss"),
  newer       = require("gulp-newer"),
  connect     = require('gulp-connect'),
  glob        = require("glob"),
  runSequence = require("run-sequence"),
  addsrc      = require("gulp-add-src"),
  XSSLint     = require("xsslint");

var config = {
  src: "src", // source directory
  dist: "tacticalsales", // destination directory
  port: 3000
};

// External scripts from jsdelivr.com
var jsDelivrScripts = [
  "src/scripts/jsdelivr/jquery.min.js",
  "src/scripts/jsdelivr/jquery.lazyload.min.js",
  "src/scripts/jsdelivr/jquery.mask.min.js",
  "src/scripts/jsdelivr/tether.min.js",
  "src/scripts/jsdelivr/mailcheck.min.js",
  "src/scripts/jsdelivr/modernizr.min.js"
];

// External scripts - vendors unknown
var externalScripts = [
  "src/scripts/vendor/addclear.js",
  "src/scripts/vendor/detect-card.js",
  "src/scripts/vendor/autofill-event.js"
];

gulp.task("purifycss", function() {
  return gulp.src(config.dist + "/assets/temp/bundle.css")
    .pipe(purify(
        [
          "src/scripts/app/config.js",
          "src/scripts/app/utils.js",
          "src/scripts/app/pages/*.js",
          "src/html/*.html"
        ]
      ))
    
    .pipe(gulp.dest(config.dist + "/assets/css"))
    .pipe(rename({
        suffix: ".min"
     }))
    .pipe(cleanCSS({compatibility: "ie8"}))
    .pipe(gulp.dest(config.dist + "/assets/css"))
    .pipe(size());
});

// Styles
gulp.task("styles", function() {
  return gulp.src("src/styles/bundle.scss")
      .pipe(plumber())
      // gulp-sass config
      .pipe(sass({
        outputStyle: "expanded",
        precision: 10,
        sourceComments: "none",
        imagePath: "src/images"
      }))
      .pipe(addsrc.prepend("src/scripts/bootstrap-4.0.0-alpha.4/dist/css/bootstrap.min.css"))
      .pipe(addsrc.append("src/styles/**/*.css"))
      .pipe(concat("bundle.css"))
      .pipe(gulp.dest(config.dist + "/assets/temp"))
      // .pipe(rename({
      //   suffix: ".min"
      // }))
      // .pipe(cleanCSS({compatibility: "ie8"}))
      // .pipe(gulp.dest(config.dist + "/assets/css"))
      .pipe(size());
});

// Fonts
gulp.task("fonts", function() {
  return gulp.src(_.flatten([config.src + "/fonts/**/*"]))
      .pipe(newer(config.dist + "/assets/fonts"))
      .pipe(gulp.dest(config.dist + "/assets/fonts"));
});

// Scripts
gulp.task("scripts", function() {
  return gulp.src(_.flatten([
            //jsDelivrScripts,

            // bootstrap v4 alpha.4
            //"src/scripts/bootstrap-4.0.0-alpha.4/dist/js/bootstrap.min.js",

            // formValidation
            // "src/scripts/formvalidation-v0.8.1/formValidation.js",
            // "src/scripts/formvalidation-v0.8.1/bootstrap4.js",

            // // Vendor
            // "src/scripts/vendor/addclear.js"
            //externalScripts,

            // Custom scripts
            // "src/scripts/app/config.js",
            // "src/scripts/app/utils.js",
            // "src/scripts/app/pages/*.js"
        ]))
        .pipe(plumber())
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(concat("bundle.js"))
        .pipe(gulp.dest(config.dist + "/assets/js"))
        .pipe(rename({
          suffix: ".min"
        }))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist + "/assets/js"))
        .pipe(size());
});

// Images
gulp.task("images", function() {
  return gulp.src(["src/images/**/*"])
    .pipe(gulp.dest(config.dist + "/assets/images"))
    .pipe(size());
});

// HTML
gulp.task("html", function() {
  return gulp.src(["src/html/**/*.html", "src/html/favicon.ico"])
      .pipe(newer(config.dist, ".html"))
      .pipe(gulp.dest(config.dist));
});

gulp.task("libcopy", function() {
  return gulp.src(["src/scripts/libs/formvalidation/**/*"], { base: './src/scripts/libs' })
      .pipe(newer(config.dist + "/assets/libs"))
      .pipe(gulp.dest(config.dist + "/assets/libs"));
});

gulp.task("jscopy", function() {
  return gulp.src(["src/scripts/app/pages/*.js", 
                   "src/scripts/app/config.js" , 
                   "src/scripts/app/utils.js" , 
                   "src/scripts/vendor/addclear.js",
                   "src/scripts/vendor/detect-card.js",
                   "src/scripts/app/validate_form_fields.js"])
      .pipe(newer(config.dist + "/assets/js"))
      .pipe(gulp.dest(config.dist + "/assets/js"));
});

gulp.task("csscopy", function() {
  return gulp.src(["src/styles/style.css"])
      .pipe(newer(config.dist + "/assets/temp"))
      .pipe(gulp.dest(config.dist + "/assets/temp"));
});

// Clean
gulp.task("clean", function() {
  del.sync([
    config.dist + "/assets"
  ]);
});

// Clean-all
gulp.task("clean-all", function() {
  del.sync([
    config.dist
  ]);
});

gulp.task("cleantemp" , function () {
  del.sync([config.dist + "/assets/temp"]);
});

// Build task
gulp.task("build", ["clean-all"], function(done) {
  runSequence(
    "scripts",
    "jscopy",
    "fonts",
    "images",
    "html",
    "styles",
    "purifycss",
    function() {
      console.log("Build successful!");
      done();
    }
  );
});

var stripCssComments = require('gulp-strip-css-comments');
 
gulp.task('stripcss', function () {
    return gulp.src(config.dist + "/assets/temp/style.css")
        .pipe(stripCssComments())
        .pipe(gulp.dest(config.dist + "/assets/temp/"));
});

gulp.task("csspurify", function() {
  return gulp.src(config.dist + "/assets/temp/style.css")
    .pipe(purify(
        [
          "src/scripts/app/config.js",
          "src/scripts/app/utils.js",
          "src/scripts/app/pages/*.js",
          "src/html/*.html"
        ]
      ))
    
    .pipe(gulp.dest(config.dist + "/assets/css"))

    .pipe(cleanCSS({compatibility: "ie8"}))
    .pipe(gulp.dest(config.dist + "/assets/css"))
    .pipe(size());
});

gulp.task("new", ["clean-all"], function(done) {
  runSequence(
    "libcopy",
    "jscopy",
    "fonts",
    "images",
    "html",
    "csscopy",
    "stripcss",
    "csspurify",
    "cleantemp",
    function() {
      console.log("Build successful!");
      done();
    }
  );
});

// XSSLint
gulp.task("xsslint", function() {
  var files = glob.sync("src/scripts/app/**/*.js");
  files.forEach(function(file) {
    var warnings = XSSLint.run(file);
    warnings.forEach(function(warning) {
      console.error(file + ":" + warning.line + ": possibly XSS-able `" + warning.method + "` call");
    });
  });
});



// Static Server + watching scss/html files
// gulp.task("serve", ["build"], function() {
//   gulp.src("tactical")
//       .pipe(webserver({
//         livereload: true,
//         open: true
//       }));
//   gulp.watch("src/styles/**/*.scss", ["styles"]);
//   gulp.watch("src/scripts/**/*.js", ["scripts"]);
//   gulp.watch("src/images/**/*", ["images"]);
//   gulp.watch("src/html/**/*.html", ["html"]);
// });

gulp.task("serve", ["new"], function() {
  connect.server({
    root: 'tacticalsales',
    port : 8000
  });
  // gulp.watch("src/styles/**/*.scss", ["styles"]);
  // gulp.watch("src/scripts/**/*.js", ["scripts"]);
  // gulp.watch("src/images/**/*", ["images"]);
  // gulp.watch("src/html/**/*.html", ["html"]);
});

// Default task
gulp.task("default", ["serve"]);
