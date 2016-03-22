/*jshint esversion: 6*/
/*eslint-env es6*/

(function(document) {
  'use strict';

  const createSettings = (options) => {
    const defaults = {
      selector: 'img',
      progress: null,
      always: null,
      done: null,
      images: []
    };

    let settings = defaults;

    for (let option in options) settings[option] = options[option];

    return settings;
  };

  const loadImg = (element, settings) => {
    const background = element.hasAttribute('data-background-src');
    const src = background ? element.getAttribute('data-background-src') : element.getAttribute('src');
    const imgObject = {
      element: element,
      src: src,
      loaded: true
    };

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = function() {
        if (background) {
          element.style.backgroundImage = 'url(' + src + ')';
        } else {
          element.setAttribute('src', src);
        }

        watchProgress(imgObject, settings);

        resolve(imgObject);
      };

      img.onerror = function() {
        imgObject.loaded = false;

        watchProgress(imgObject, settings);

        reject(imgObject);
      };

      img.src = src;
    });
  };

  let progress = 0;

  function callback(fn, param1, param2) {
    if (fn === null) return;

    try {
      fn(param1, param2);
    } catch (error) {
      console.log('imgWatcher: Callback not is not a function');
    }
  }

  function watchProgress(imgObject, settings) {
    let percentage = 0,
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

  document.imgWatcher = function(options) {
    const settings = createSettings(options);
    const images = [].slice.call(document.querySelectorAll(settings.selector));
    const promises = images.map(element => loadImg(element, settings));

    settings.imageCount = images.length;

    Promise.all(promises).then(images => {
      callback(settings.done, images);
    }).catch(images => {
      callback(settings.always, images);
    });
  };

})(document);
