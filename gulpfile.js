const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass"); // перевод из scss, sass в css
const concat = require("gulp-concat"); // объеденение строк, файлов
const browserSync = require("browser-sync").create(); // вывод в браузер
const uglify = require("gulp-uglify-es").default; // минификация(сжатие) js
const autoprefixer = require("gulp-autoprefixer"); // сканирует css и вставляет префиксеры для совместимости с разными браузерами
const imagemin = require("gulp-imagemin"); // сжимает фотографии
const del = require("del"); // удаление папоки файлов

// вывод в браузер

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
    browser: 'chrome',
    // browser: 'chromium',
    // browser: 'firefox',
  });
}

// удаление папки dist

function clean() {
  return del("dist");
}

// картинки берутся из папки images, сжимаются и копируются в папку dist/images

function images() {
  return src("app/images/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/images"));
}

// объединение и сжатие и сохранение в папку js и обновление страницы

function scripts() {
  return src([
    "node_modules/jquery/dist/jquery.js",
    "node_modules/slick-carousel/slick/slick.js",
    "node_modules/wow.js/dist/wow.js",
    "app/js/main.js",
  ])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

// все файлы scss сжимаются, объединяются и вставляются префиксы, а потом сохраняются в папку css и обновление страницы

function styles() {
  return src([
    "node_modules/normalize.css/normalize.css",
    "node_modules/slick-carousel/slick/slick.css",
    "node_modules/animate.css/animate.css",
    "app/scss/**/*.scss",
  ])
    .pipe(scss({ outputStyle: "expanded" }))
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 version"],
        grid: true,
      })
    )
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

// сохранение проекта в папку dist

function build() {
  return src(
    [
      "app/css/**/*.css",
      "app/fonts/**/*",
      "app/js/**/*.js",
      "app/**/*.html",
      // "app/images/**/*.*"
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

// отслеживание изменений в файлах scss, js(кроме !main.min.js), html и обновление страницы

function watching() {
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.clean = clean;

exports.build = series(clean, images, build, );
exports.default = parallel(styles, scripts, browsersync, watching);
