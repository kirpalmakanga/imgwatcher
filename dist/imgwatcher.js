'use strict';

(function (document) {
  'use strict';

  var createSettings = function createSettings(options) {
    var defaults = {
      selector: 'img',
      progress: null,
      always: null,
      done: null,
      images: []
    };

    var settings = defaults;

    for (var option in options) {
      settings[option] = options[option];
    }return settings;
  };

  var loadImg = function loadImg(element, settings) {
    var background = element.hasAttribute('data-background-src');
    var src = background ? element.getAttribute('data-background-src') : element.getAttribute('src');
    var imgObject = {
      element: element,
      src: src,
      loaded: true
    };

    return new Promise(function (resolve, reject) {
      var img = new Image();

      img.onload = function () {
        if (background) {
          element.style.backgroundImage = 'url(' + src + ')';
        } else {
          element.setAttribute('src', src);
        }

        watchProgress(imgObject, settings);

        resolve(imgObject);
      };

      img.onerror = function () {
        imgObject.loaded = false;

        watchProgress(imgObject, settings);

        reject(imgObject);
      };

      img.src = src;
    });
  };

  var progress = 0;

  function callback(fn, param1, param2) {
    if (fn === null) return;

    try {
      fn(param1, param2);
    } catch (error) {
      console.error(error);
    }
  }

  function watchProgress(imgObject, settings) {
    var percentage = 0,
        total = settings.imageCount,
        errors = false;

    if (progress === total) {
      progress = 0;
    } else {
      progress++;

      percentage = progress / total * 100;

      callback(settings.progress, imgObject, percentage);
    }
  }

  document.imgWatcher = function (options) {
    var settings = createSettings(options);
    var images = [].slice.call(document.querySelectorAll(settings.selector));
    var promises = images.map(function (element) {
      return loadImg(element, settings);
    });

    settings.imageCount = images.length;

    Promise.all(promises).then(function (images) {
      callback(settings.done, images);
    }).catch(function (images) {
      callback(settings.always, images);
    });
  };
})(document);
