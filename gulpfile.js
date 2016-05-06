var gulp = require('gulp')
var gm = require('gulp-gm')
var path = require('path')
var fs = require('fs')

var searchString = '*.jpg'
var outputDir = 'dist'

gulp.task('png', function () {
  return gulp.src(searchString)
    .pipe(gm(function (gmfile) {
      return gmfile.setFormat('png')
    }, {
      imageMagick: true
    }))
    .pipe(gulp.dest(outputDir))
})

gulp.task('jpg', function () {
  return gulp.src(searchString)
    .pipe(gm(function (gmfile) {
      return gmfile.setFormat('jpg')
    }, {
      imageMagick: true
    }))
    .pipe(gulp.dest(outputDir))
})

gulp.task('delete-larger', ['jpg', 'png'], function () {
  var filenames = []
  fs.readdir(outputDir, function(err, files){
    if(err) console.log(err)
    files.forEach(function(file){
      var currFile = path.parse(file).name
      if (filenames.indexOf(currFile) < 0) {
        filenames.push(currFile)
      }
    })

    for (var fileName of filenames) {
      var jpgFile = path.join(outputDir, fileName + '.jpg')
      var pngFile = path.join(outputDir, fileName + '.png')
      if (fileSize(jpgFile) > fileSize(pngFile)) {
        console.log('jpg')
        fs.unlinkSync(jpgFile)
      } else {
        console.log('png')
        fs.unlinkSync(pngFile)
      }
    }

   })

})

function fileSize (file) {
 var stats = fs.statSync(file)
 return stats.size
}

gulp.task('default', ['jpg', 'png', 'delete-larger']);
