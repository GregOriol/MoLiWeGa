MoLiWeGa - Modern Lightroom Web Gallery
----

MoLiWeGa is a modern web gallery plugin for Lightroom.

It brings HTML5 responsive galleries to Lightroom.

# Features
* Single page, but with links to each indiviual image
* SEO friendly (images can be indexed)
* Slideshow
* Responsive from mobile to large desktops

# How to use it
## Installation
Double-click on dist/MoLiWeGa.lrwebengine if your system allows it, or copy it to your Lightroom's Web Galleries folder (on macOS: ~/Library/Application Support/Adobe/Lightroom/Web Galleries).
Re-open Lightroom and it will appear in the gallery models' list.

## Settings
A lot of settings are available for the 

## Tracking
If you want to use a tracking system, add the Javascript code into the Add-ons > Tracking field, it will be added to the page.
For example with Matomo it would be:
```
<script type="text/javascript">
	  var _paq = _paq || [];
	  _paq.push(['trackPageView']);
	  _paq.push(['enableLinkTracking']);
	  (function() {
	    var u="//matomo.website.com/";
	    _paq.push(['setTrackerUrl', u+'piwik.php']);
	    _paq.push(['setSiteId', '1']);
	    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
	    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
	  })();
	function onSlideshowWalk(index, slide) {
		_paq.push(['setDocumentTitle', document.title + ' - Image ' +index]);
		_paq.push(['trackPageView']);
	}
</script>
```
and could of course be adapted to your tracking tool.

Note the onSlideshowWalk function: it will be called when a slideshow image is displayed. Use it to track them if you'd like to.

# Uses
* Vegas slideshows (http://vegas.jaysalvat.com/)
* Hammer.js swipe events (https://hammerjs.github.io)
* Normalize.css
* jQuery

# Inspired by
* http://w3bits.com/labs/css-masonry/
* http://www.andrewbriggsphotography.co.uk/simplicity/
* https://github.com/brggs/Simplicity-for-Lightroom/blob/master/simplicity-gallery-v1.lrwebengine/
* https://github.com/kreuzerkrieg/LUAJunk/blob/41724b2c101dfc45a50ea39ee93d7359197aad19/LightRoom/KreuzerkriegHTML.lrwebengine/galleryInfo.lrweb
