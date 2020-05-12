(function (win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaViewport = doc.querySelector('meta[name="viewport"]');
    var metaFlexible = doc.querySelector('meta[name="flexible"]');
    var flexible = lib.flexible || (lib.flexible = {});
    var initialScale = 0;
    var dataDpr = 0;
    var timeId;

    if (metaViewport) {
        let match = metaViewport.getAttribute('content').match(/initial\-scale=([\d]+)/);
        if (match) {
            initialScale = parseFloat(match[1]);
            dataDpr = parseInt(1 / initialScale);
        }
    } else if (metaFlexible) {
        let content = metaFlexible.getAttribute('content');
        if (content) {
            let initialDpr = content.match(/initial-dpr=([\d]+)/);
            let maximumDpr = content.match(/maximum-dpr=([\d]+)/);
            if (initialDpr) {
                dataDpr = parseFloat(initialDpr[1]);
                initialScale = parseFloat((1 / dataDpr).toFixed(2));
            }
            if (maximumDpr) {
                dataDpr = parseFloat(maximumDpr[1]);
                initialScale = parseFloat((1 / dataDpr).toFixed(2));
            }
        }
    }

    if (!dataDpr && !initialScale) {
        let isAndroid = win.navigator.appVersion.match(/android/gi);
        let isIPhone = win.navigator.appVersion.match(/iphone/gi);
        let devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            if (devicePixelRatio >= 3 && (!dataDpr || dataDpr >= 3)) {
                dataDpr = 3;
            } else if (devicePixelRatio >= 2 && (!dataDpr || dataDpr >= 2)) {
                dataDpr = 2;
            } else {
                dataDpr = 1;
            }
        } else if (isAndroid) {
            dataDpr = 1;
        } else {
            dataDpr = 1;
        }
        initialScale = (1 / dataDpr).toFixed(2);
    }

    if (!metaViewport) {
        metaViewport = doc.createElement('meta');
        metaViewport.setAttribute('name', 'viewport');

        metaViewport.setAttribute('content', "width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable='0',viewport-fit=cover");
        // metaViewport.setAttribute('content', 'width=device-width,initial-scale=' + initialScale + ', maximum-scale=' + initialScale + ', minimum-scale=' + initialScale + ', user-scalable=no,viewport-fit=cover');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaViewport);
        } else {
            let wrap = doc.createElement('div');
            wrap.appendChild(metaViewport);
            doc.write(wrap.innerHTML);
        }
    }

    if (docEl) {
        docEl.setAttribute('phone', win.navigator.appVersion.match(/iphone/gi) ? 'iphone' : 'android');
        docEl.setAttribute('data-dpr', dataDpr);
        docEl.setAttribute('scale', initialScale);
    }

    // if (doc.readyState === 'complete') {
    //     doc.body.style.fontSize = 14 * dataDpr + 'px';
    // } else {
    //     doc.addEventListener('DOMContentLoaded', function (e) {
    //         doc.body.style.fontSize = 14 * dataDpr + 'px';
    //     }, false);
    // }

    function refreshRem() {
        let width = docEl.getBoundingClientRect().width;
        if (width / dataDpr > 540) {
            width = 540 * dataDpr;
        }
        let rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function () {
        clearTimeout(timeId);
        timeId = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(timeId);
            timeId = setTimeout(refreshRem, 300);
        }
    }, false);

    refreshRem();

    flexible.dataDpr = win.dataDpr = dataDpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function (d) {
        let val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function (d) {
        let val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }
})(window, window['lib'] || (window['lib'] = {}));
