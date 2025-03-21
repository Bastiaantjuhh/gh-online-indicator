const fs = require("fs");
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const terser = require("gulp-terser");
const cleanCSS = require("gulp-clean-css");
const archiver = require("archiver");
const htmlmin = require("gulp-htmlmin");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const jsonMinify = require("gulp-jsonminify");

// Paths
const paths = {
    manifest: "src/manifest.json",
    locales: "locales/**/**/*.json",
    js: "src/**/*.js",
    scss: "src/**/*.scss",
    html: "src/**/*.html",
    assets: "assets/**/*",
    dist: "dist",
};

// Minify JS
function scripts() {
    return gulp
        .src(paths.js)
        .pipe(terser())
        .pipe(gulp.dest(paths.dist));
}

// SCSS -> CSS
function styles() {
    return gulp
        .src(paths.scss)
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.dist));
}

// HTML copy and minify
function html() {
    return gulp
        .src(paths.html)
        .pipe(
            htmlmin({
                collapseWhitespace: true,
                continueOnParseError: true,
                html5: true,
                removeComments: true,
                removeStyleLinkTypeAttributes: true,
                sortClassName: true,
                sortAttributes: true,
            })
        )
        .pipe(gulp.dest(paths.dist));
}

// manifest.json copy and minify
function manifest() {
    return gulp
        .src(paths.manifest)
        .pipe(jsonMinify())
        .pipe(gulp.dest(paths.dist));
}

function locales() {
    return gulp
        .src(paths.locales)
        .pipe(jsonMinify())
        .pipe(gulp.dest(paths.dist + "/_locales"));
}

// Assets copy
function assets() {
    return gulp
        .src(paths.assets, { encoding: false })
        .pipe(gulp.dest(paths.dist));
}

// Zipping dist
function zipDist(done) {
    const output = fs.createWriteStream("release.zip");
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
        console.log("==========================");
        console.log("ZIP-file (release) created");
        console.log("==========================");
        done();
    });

    archive.on("error", (err) => {
        throw err;
    });

    archive.pipe(output);
    archive.directory(paths.dist, false);
    archive.finalize();
}

// Default task
exports.default = gulp.series(
    gulp.parallel(scripts, styles, html, manifest, locales, assets),
    zipDist
);
