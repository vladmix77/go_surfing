// Подключение gulp и gulp-scss и browser-sync...

let gulp = require("gulp"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  del = require("del"),
  autoprefixer = require("gulp-autoprefixer");

// task для очистки файлов и папок (папки (dist)).

gulp.task("clean", async function() {
  del.sync("dist");
});

// task для scss и browserSync (компиляция в css и настройки (outputStyle) и переименование)

gulp.task("scss", function() {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.reload({ stream: true }));
});

// task для normalize.css и.т.д. обьединение файлов concat

gulp.task("css", function() {
  return gulp
    .src([
      "node_modules/normalize.css/normalize.css",
      "node_modules/slick-carousel/slick/slick.css",
      "node_modules/animate.css/animate.css"
    ])
    .pipe(concat("_libs.scss"))
    .pipe(gulp.dest("app/scss"))
    .pipe(browserSync.reload({ stream: true }));
});

// task для browser-sync - html

gulp.task("html", function() {
  return gulp.src("app/*.html").pipe(browserSync.reload({ stream: true }));
});

// task для browser-sync - js

gulp.task("script", function() {
  return gulp.src("app/js/*.js").pipe(browserSync.reload({ stream: true }));
});

// task для всех файлов js и обьеденение (slik и jsmagnific-popup в lib.min.js)

gulp.task("js", function() {
  return gulp
    .src(["node_modules/slick-carousel/slick/slick.js"])
    .pipe(concat("libs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("app/js"))
    .pipe(browserSync.reload({ stream: true }));
});

// Live Server (Browser Reloading) синхронизация с browser-sync

gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
});

// task - build для создания папки dist и переноса файлов

gulp.task("export", function() {
  let buildHtml = gulp.src("app/**/*.html").pipe(gulp.dest("dist"));
  let buildCss = gulp.src("app/css/**/*.css").pipe(gulp.dest("dist/css"));
  let buildJs = gulp.src("app/js/**/*.js").pipe(gulp.dest("dist/js"));
  let buildFonts = gulp.src("app/fonts/**/*.*").pipe(gulp.dest("dist/fonts"));
  let buildImg = gulp.src("app/images/**/*.*").pipe(gulp.dest("dist/images"));
});

// task - watch для отслеживания и сохранения изменений в scss и html и js

gulp.task("watch", function() {
  gulp.watch("app/scss/**/*.scss", gulp.parallel("scss"));
  gulp.watch("app/*.html", gulp.parallel("html"));
  gulp.watch("app/js/*.js", gulp.parallel("script"));
});

// task для удаления и экспортирования папки dist

gulp.task("build", gulp.series("clean", "export"));

// Запуск task css scss js browser-sync и watch (имя gulp)

gulp.task(
  "default",
  gulp.parallel("css", "scss", "js", "browser-sync", "watch")
);
