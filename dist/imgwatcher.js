/*eslint-env es6*/
'use strict';

(function (document) {

    var defaults = {
        selector: 'img',
        progress: null,
        always: null,
        done: null,
        images: []
    };

    var mergeObjects = function mergeObjects(defaults, options) {
        var settings = defaults;

        for (var option in options) {
            settings[option] = options[option];
        }
        return settings;
    };

    var loadImg = function loadImg(element, settings) {
        var background = element.hasAttribute('data-background-src'),
            src = background ? element.getAttribute('data-background-src') : element.getAttribute('src'),
            imgObject = {
            element: element,
            src: src
        };

        return new Promise(function (resolve, reject) {
            var img = new Image();

            img.onload = function () {

                imgObject.loaded = true;

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
        if (fn !== null && typeof fn === 'function') {
            fn(param1, param2);
        } else {
            console.log('Callback not defined or not a function');
        }
    }

    function watchProgress(imgObject, settings) {
        var percentage = 0,
            total = settings.imageCount,
            errors = false;

        progress++;

        percentage = progress / total * 100;

        console.log(percentage);

        callback(settings.progress, imgObject, percentage);
    }

    document.imgWatcher = function (options) {

        var settings = mergeObjects(defaults, options),
            elements = Array.prototype.slice.call(document.querySelectorAll(settings.selector)),
            promises = elements.map(function (element) {
            return loadImg(element, settings);
        });

        settings.imageCount = elements.length;

        Promise.all(promises).then(function (images) {
            callback(settings.done, images);
        }).catch(function (image) {
            callback(settings.always, images);
        });
    };
})(document);