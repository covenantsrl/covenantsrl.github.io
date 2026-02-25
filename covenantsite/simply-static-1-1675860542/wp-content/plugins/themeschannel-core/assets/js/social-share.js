(function($) {
    'use strict';

    function openWindow(url, title, w, h) {
        var dualScreenLeft = window.screenLeft !== 'undefined' ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== 'undefined' ? window.screenTop : screen.top;

        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;
        var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus) {
            newWindow.focus();
        }
    }

    $(document).on('click', '.tc-js-social-share', function(e) {
        e.preventDefault();

        var $this = $(this),
            social = $this.data('social'),
            $container = $this.closest('.tc-share-socials'),
            postUrl = $container.data('url'),
            postTitle = $container.data('title'),
            url;

        switch ( social ) {
            case 'facebook':
                url = 'https://www.facebook.com/sharer/sharer.php?u=' + postUrl;
                break;
            case 'google':
                url = 'https://plus.google.com/share?url=' + postUrl;
                break;
            case 'twitter':
                url = 'http://twitter.com/home?status=' + postUrl;
                break;
            case 'linkedin':
                url = 'http://linkedin.com/shareArticle?mini=true' +
                    '&url=' + postUrl +
                    '&title=' + postTitle;
                break;
        }

        if( url !== null ) {
            openWindow( url, 'share', 800, 600 );
        }
    });

})(jQuery);