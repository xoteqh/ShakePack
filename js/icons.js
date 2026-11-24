/**
 * icons.js
 */

(function () {
    'use strict';

    var PATHS = {
        settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',

        constructor: '<path d="M10 3H5a2 2 0 0 0-2 2v5h2a2 2 0 1 1 0 4H3v5a2 2 0 0 0 2 2h5v-2a2 2 0 1 1 4 0v2h5a2 2 0 0 0 2-2v-5h-2a2 2 0 1 1 0-4h2V5a2 2 0 0 0-2-2h-5v2a2 2 0 1 1-4 0V3z"/>',

        folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M8 12h8M8 16h5"/>',

        palette: '<path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.4-3.4 2 2 0 0 1 1.4-3.4H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3z"/><circle cx="7.5" cy="10.5" r="0.9"/><circle cx="11" cy="7" r="0.9"/><circle cx="15.5" cy="8" r="0.9"/><circle cx="17.5" cy="11.5" r="0.9"/>',

        star: '<path d="M12 2.4L14.41 8.68L21.13 9.03L15.9 13.27L17.64 19.77L12 16.1L6.36 19.77L8.1 13.27L2.87 9.03L9.59 8.68Z"/>',

        help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.3a2.6 2.6 0 1 1 3.8 2.3c-.9.5-1.3 1.1-1.3 2v.4"/><circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none"/>',

        eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><circle cx="13.2" cy="10.8" r="0.8" fill="currentColor" stroke="none"/>'
    };

    function get(name, extraClass) {
        var body = PATHS[name] || PATHS.star;
        var cls = 'icon-svg' + (extraClass ? ' ' + extraClass : '');
        return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ' +
            'aria-hidden="true" focusable="false">' + body + '</svg>';
    }

    function hydrate(root) {
        var scope = root || document;
        var nodes = scope.querySelectorAll('[data-icon]');
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            if (el.getAttribute('data-icon-done')) continue;
            el.innerHTML = get(el.getAttribute('data-icon'));
            el.setAttribute('data-icon-done', '1');
        }
    }

    window.ShakeIcons = { get: get, hydrate: hydrate, paths: PATHS };

    if (document.readyState !== 'loading') hydrate();
    else document.addEventListener('DOMContentLoaded', function () { hydrate(); });
})();
