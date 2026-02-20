
// 

const GulpClient = require('gulp')

GulpClient.task('js', async () => {
  const terser = (await import('gulp-terser')).default
  const GulpUglify = (await import('gulp-uglify')).default

  GulpClient.src([
    'public/**/*.js', '!public/**/*.min.js', '!public/**/*-min.js'
  ])
    .pipe(terser())
    .pipe(GulpUglify())
    .pipe(GulpClient.dest('public'))
})

GulpClient.task('css', async () => {
  const GulpCleanCss = (await import('gulp-clean-css')).default

  return GulpClient.src([
    'public/**/*.css', '!public/**/*.min.css', '!public/**/*-min.css'
  ])
    .pipe(GulpCleanCss({
      compatibility: 'ie11'
    }))
    .pipe(GulpClient.dest('public'))
})

GulpClient.task('html', async () => {
  const htmlclean = (await import('gulp-htmlclean')).default
  const html_minifier_terser = (await import('gulp-html-minifier-terser')).default

  return GulpClient.src([
    'public/**/*.html'
  ])
    .pipe(htmlclean())
    .pipe(html_minifier_terser({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }))
    .pipe(GulpClient.dest('public'))
})

GulpClient.task('jpg|png', async () => {
  const readMetadata = (await import('gulp-scale-images/read-metadata.js')).default
  const path = (await import('path')).default
  const through = (await import('through2')).default
  const scaleImages = (await import('gulp-scale-images')).default
  const imagemin = (await import('gulp-imagemin')).default
  const mozjpeg = (await import('gulp-imagemin')).mozjpeg
  const optipng = (await import('gulp-imagemin')).optipng

  const computeScaleInstructions = (file, _, cb) => {
    readMetadata(file, (err, meta) => {
      if (err) return cb(err)
      file = file.clone()
      file.scale = {
        // maxWidth: Math.floor(meta.width / 2),
        // maxHeight: Math.floor(meta.height / 2)
        maxWidth: 1920,
        maxHeight: 1080,
        fit: 'inside',
        metadata: true,
        formatOptions: {
          quality: 100
        }
      }
      cb(null, file)
    })
  }

  const computeFileName = (output, scale, cb) => {
    const suffix = []
    // if (scale.maxWidth) suffix.push(scale.maxWidth + 'w')
    // if (scale.maxHeight) suffix.push(scale.maxHeight + 'h')

    const ext = path.extname(output.path)
    const fileName = [path.basename(output.path, ext)]
    if (suffix.length > 0) fileName.push(suffix.join('-'))
    fileName.push(scale.format || ext.slice(1))

    cb(null, fileName.join('.'))
  }

  return GulpClient
    .src(['public/**/*.(jpg|png)'], { encoding: false })
    .pipe(through.obj(computeScaleInstructions))
    .pipe(scaleImages(computeFileName))
    .pipe(
      imagemin([
        mozjpeg({ quality: 80, progressive: false }),
        optipng({ optimizationLevel: 5 })
      ], { verbose: true })
    )
    .pipe(GulpClient.dest('public'))
})

GulpClient.task('gif|svg', async () => {
  const imagemin = (await import('gulp-imagemin')).default
  const gifsicle = (await import('gulp-imagemin')).gifsicle
  const svgo = (await import('gulp-imagemin')).svgo

  return GulpClient
    .src(['public/**/*.(gif|svg)'], { encoding: false })
    .pipe(imagemin([
      gifsicle({ optimizationLevel: 3 }),
      svgo()
    ], { verbose: true }))
    .pipe(GulpClient.dest('public'))
})

GulpClient.task('default', GulpClient.parallel(
//   'jpg|png', 'gif|svg', 'js', 'css', 'html'
  'jpg|png', 'gif|svg'
))




