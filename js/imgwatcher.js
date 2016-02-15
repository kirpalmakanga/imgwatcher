(document => {

    var progress = 0,
        defaults = {
            selector: 'img',
            progress: null,
            always: null,
            done: null,
            images: []
        };

    //Private functions
    function mergeObjects(defaults, options) {
        var settings = {};
        for (var defaultName in defaults) {
            settings[defaultName] = defaults[defaultName];
        }
        for (var optionName in options) {
            settings[optionName] = options[optionName];
        }
        return settings;
    }

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

        callback(settings.progress, imgObject, percentage);

        if (progress === total) {
            callback(settings.always, settings.images);
        }
    }

    function loadImg(element, settings) {
        let background = element.hasAttribute('data-background-src'),
            src = background ? element.getAttribute('data-background-src') : element.getAttribute('src'),
            imgObject = {
                element: element,
                src: src
            };

        return new Promise((resolve, reject) => {
            let img = new Image();

            img.onload = function() {

                imgObject.loaded = true;

                if (background) {
                    element.style.backgroundImage = 'url(' + src + ')';
                } else {
                    element.setAttribute('src', src);
                }

                watchProgress(imgObject, settings);

                resolve(imgObject);
            }

            img.onerror = function() {
                imgObject.loaded = false;

                watchProgress(imgObject, settings);

                reject(imgObject);
            }

            img.src = src;
        });
    }

    //Public method
    document.imgWatcher = function(options) {

        let settings = mergeObjects(defaults, options),
            elements = Array.prototype.slice.call(document.querySelectorAll(settings.selector)),
            promises = elements.map(element => loadImg(element, settings));

        settings.imageCount = elements.length;

        Promise.all(promises).then(images => {
            callback(settings.done, images);
        }).catch(image => {
        });
    };

})(document);
