$(function () {
    var $window = $(window);
    var $body = $('body');
    var $items = $('.grid .item');

    // Scroll to top
    // var scrollToTopLimit = $window.height()/2;
    // var $scrollToTop = $('.button.scroll-to-top');
    //
    // $window.scroll(function() {
    //     if ($(this).scrollTop() > scrollToTopLimit) {
    //         $scrollToTop.addClass('active');
    //     } else {
    //         $scrollToTop.removeClass('active');
    //     }
    // });
    //
    // $scrollToTop.click(function() {
    //     $('html, body').animate({scrollTop: 0}, 600);
    //
    //     return false;
    // });

    // Table layout
    if ($body.hasClass('table')) {
        $items.each(function (i, item) {
            var $item = $(item);

            var src = $item.find('img').attr('src');
            $item.find('.content').css('background-image', 'url("'+src+'")');
        });
    }

    // Slideshow
    $.vegas.isVideoCompatible = function () {
        // var devices = /(Android|webOS|Phone|iPad|iPod|BlackBerry|Windows Phone)/i;
        // return !devices.test(navigator.userAgent);
        return true;
    };

    // Preparing slides
    var slides = [];
    $items.each(function (i, item) {
        var $item = $(item);

        var slide = {
            $item: $item
        };

        var $a = $item.find('a');
        var href = $a.attr('href');
        if (/\.(?:mp4|mov)$/i.test(href)) {
            slide.src = $a.data('alt');
            slide.video = {
                src: [
                    href
                ],
                loop: false,
                mute: false
            };
        } else {
            slide.src = href;
        }

        slides.push(slide);
    });

    // Preparing container
    $body.append('<div id="vegas-container"></div>');
    $vegasContainer = $('#vegas-container');

    // Preparing controls
    $vegasContainer.append('<span id="vegas-close" class="vegas-control icon-cancel"></span>');
    $vegasContainer.append('<span id="vegas-prev" class="vegas-control icon-left-open-big"></span>');
    $vegasContainer.append('<span id="vegas-next" class="vegas-control icon-right-open-big"></span>');
    $vegasContainer.append('<span id="vegas-playpause" class="vegas-control icon-play"></span>');
    if (fullscreenAvailable($vegasContainer.get(0))) {
        $vegasContainer.append('<span id="vegas-fullscreen" class="vegas-control icon-resize-full"></span>');
    }

    $vegasContainer.find('#vegas-close').on('click', function(e) {
        e.preventDefault();

        $vegasContainer.vegas('pause');
        $vegasContainer.vegas('destroy');
        $vegasContainer.removeClass('active');
        $body.removeClass('fixed');

        // Reverting history to the page itself
        window.history.replaceState({}, '', location.pathname);

        $(document).off('keyup', vegasKeyup);
    });
    $vegasContainer.find('#vegas-next').on('click', function(e) {
        e.preventDefault();

        // Pause
        $vegasContainer.vegas('pause');

        $vegasContainer.vegas('next');
    });
    $vegasContainer.find('#vegas-prev').on('click', function(e) {
        e.preventDefault();

        // Pause
        $vegasContainer.vegas('pause');

        $vegasContainer.vegas('previous');
    });
    $vegasContainer.find('#vegas-playpause').on('click', function(e) {
        e.preventDefault();

        var $this = $(this);
        if ($this.hasClass('icon-pause')) {
            $vegasContainer.vegas('pause');
        } else {
            $vegasContainer.vegas('play');
        }
    });
    $vegasContainer.find('#vegas-fullscreen').on('click', function(e) {
        e.preventDefault();

        var $this = $(this);
        if ($this.hasClass('icon-resize-full')) {
            fullscreenRequest($vegasContainer.get(0));
            $this.removeClass('icon-resize-full');
            $this.addClass('icon-resize-small');
        } else {
            fullscreenExit();
            $this.removeClass('icon-resize-small');
            $this.addClass('icon-resize-full');
        }
    });

    var vegasKeyup = function(e) {
        e.preventDefault();

        if (e.which == 37) { // left
            $('#vegas-prev').trigger('click');
        } else if (e.which == 39) { // right
            $('#vegas-next').trigger('click');
        } else if (e.which == 13 || e.which == 32) { // enter or space
            $('#vegas-playpause').trigger('click');
        } else if (e.which == 27){ // escape
            $('#vegas-close').trigger('click');
        }
    };

    // Swipe
    var hammer = new Hammer($vegasContainer.get(0));
    hammer.on('swipe', function(e) {
        if (e.direction === Hammer.DIRECTION_LEFT) {
            $('#vegas-next').trigger('click');
        } else if (e.direction === Hammer.DIRECTION_RIGHT) {
            $('#vegas-prev').trigger('click');
        }
    });

    //
    var $slideshow = $('.button.slideshow');

    $slideshow.on('click', function(e) {
        e.preventDefault();

        slideshowStart(false);
    });

    $items.on('click', function(e) {
        e.preventDefault();

        slideshowStart($(this).index());
    });

    window.onpopstate = function(e) {
        var hash = window.location.hash.substr(1);
        if (hash.length > 0) {
            // Hash set, starting slideshow with the hash as slide number -1
            slideshowStart(hash - 1);
        } else {
            // No hash, closing slideshow
            $('#vegas-close').trigger('click');
        }
    };
    window.onpopstate();

    function slideshowStart(slide) {
        // Preparing container
        $body.addClass('fixed');
        $vegasContainer.addClass('active');

        // Keyboard
        $(document).on('keyup', vegasKeyup);

        // Reverting history to the opening image
        index = (slide === false) ? 0 : slide;
        window.history.pushState({}, 'Image '+(index+1), '#'+(index+1));

        // Starting vegas
        $vegasContainer.vegas({
            slides: slides,
            cover: false,
            delay: 4500,
            transitionDuration: 2500,
            transition: ['fade2'],
            firstTransitionDuration: 250,
            // animationDuration: 4000,
            // animation: ['kenburns', 'kenburnsUp', 'kenburnsDown', 'kenburnsRight', 'kenburnsLeft', 'kenburnsUpLeft', 'kenburnsUpRight', 'kenburnsDownLeft', 'kenburnsDownRight']
            timer: false,
            autoplay: (slide === false) ? true : false,
            slide: (slide === false) ? 0 : slide,
            play: function (index, slideSettings) {
                $vegasContainer.find('#vegas-playpause').removeClass('icon-play').addClass('icon-pause');
            },
            pause: function (index, slideSettings) {
                $vegasContainer.find('#vegas-playpause').removeClass('icon-pause').addClass('icon-play');
            },
            walk: function (index, slideSettings) {
                // Reverting history to the current image, only keeping one
                window.history.replaceState({}, 'Image '+(index+1), '#'+(index+1));

                // Triggering callback for tracking
                if (typeof onSlideshowWalk === 'function') {
                    onSlideshowWalk((index+1), slides[index]);
                }
            }
        });

        // Fixing height
        setTimeout(function() {
            $vegasContainer.css('height', 'auto'); // overrides height set by Vegas, as we prefer an implied size
        }, 1);
    }
});

function fullscreenAvailable(elem) {
    if (elem.requestFullscreen) {
        return true;
    }
    else if (elem.mozRequestFullScreen) {
        return true;
    }
    else if (elem.webkitRequestFullScreen) {
        return true;
    }
    else if (elem.msRequestFullscreen) {
        return true;
    }

    return false;
}

function fullscreenRequest(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
    else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    }
    else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
    }
    else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function fullscreenExit() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
    else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}
