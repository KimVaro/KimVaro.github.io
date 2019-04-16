/// <reference path="jQuery/jquery.min.js" />
/// <reference path="jQuery/jquery.ui.min.js" />
/*jslint browser: true*/

//--------------------------------------------------------------
//--------------------------------------------------------------

//      Initialise any global functions 

//          ::WARNING:: These will load on everypage!!!

//--------------------------------------------------------------
//--------------------------------------------------------------

jQuery(function () {

    initNavigationMenus();
    initQuickLinks();
    initAjax();
    new initPostCodeField(jQuery("#findDealer").find("input"), jQuery("#findDealer").find("a"), jQuery("#DealerLocatorPath").val(), jQuery("#findDealer").find(".error")).init();
    initNewWindow(jQuery('.liveChat'));
    new subscription.init();
    new initCurrentLocation().init();
    footerUI.init();
});

//--------------------------------------------------------------
//--------------------------------------------------------------

//      Create Library Functions

//--------------------------------------------------------------
//--------------------------------------------------------------

//function getEnum
function getEnum(enumName, enumValue, enumAttribute) {

    if (typeof (enumName[enumValue]) !== 'undefined') {
        var enumObjectValue = enumName[enumValue];
        if (typeof (enumObjectValue[enumAttribute]) !== 'undefined') {
            return enumObjectValue[enumAttribute];
        } else {
            return enumObjectValue.Value;
        }
    }
};

// Setup a gallery
function gallery(thisGallery, itemsInLine) {

    if (thisGallery.length > 0) {

        var gallery = this,
            itemsInLine = (typeof itemsInLine === "undefined") ? 4 : itemsInLine,
            blackout = jQuery("#blackout"),
            thumbsList = thisGallery.find(".thumbsList"),
            thumbs = thumbsList.find("li"),
            imageContainer = thisGallery.find(".imageContainer"),
            videoContainer = thisGallery.find(".videoContainer"),
            controls = thumbsList.next().add(thumbsList.next().next()),
            currentThumb = 0,
            swipeBoxes = thisGallery.find("a.swipebox,a.swipebox-video");

        gallery.load = function () {

            if (swipeBoxes.length > 0) {
                gallery.setupSwipeBox();
            }

            if (thumbs.filter(".isSelected").hasClass("isVideo")) {
                imageContainer.hide();
                videoContainer.show();
            }

            jQuery(window).on("resize", function () {
                var paging = thisGallery.find(".paging"),
                    pageNumber = paging.find(".isSelected").find(".pageNumber").text();
                gallery.setThumbWidth();
                gallery.scrollToThumb(currentThumb, pageNumber);
            });

            return this;
        }

        gallery.setThumbWidth = function () {

            var thumbsRightMargin = thumbs.filter(":first").css("marginRight").replace("px", "");

            thumbs.width((thumbsList.width() - (thumbsRightMargin * (itemsInLine - 1))) / itemsInLine);

            var thumbsParent = thumbs.parent();

            var numberOfThumbs = thumbs.size();

            var thumbWidth = thumbs.first().width();

            var totalWidth = numberOfThumbs * thumbWidth;

            var bufferSpace = numberOfThumbs * 0.5

            var newWidth = (totalWidth + (thumbsRightMargin * numberOfThumbs)) + bufferSpace;

            thumbsParent.width(Math.round(newWidth));

            return this;
        }

        gallery.loadEnlarged = function () {

            var imageThumbs = thisGallery.find(".thumbsList").find("li").not(".isVideo");

            imageThumbs.on("click", function () {

                thumbs.removeClass("isSelected");

                videoContainer.css({ 'z-index': -9999, 'width': 0, 'height': 0, 'position': 'fixed' });

                var selectedImage = jQuery(this).addClass("isSelected").find("img");

                imageContainer.show()
                    .find("img")
                    .attr("src", selectedImage.attr("src"))
                    .attr("alt", selectedImage.attr("alt"));

                thisGallery.attr("data-thumbindex", thumbs.index(jQuery(this)));

                return false;
            });

            return this;
        }

        gallery.createPagination = function () {

            var numberOfPages = Math.ceil(thumbs.length / itemsInLine),
                pagesToOutput = '';

            for (var i = 0; i < numberOfPages; i++) {

                if (i === 0) {

                    pagesToOutput += '<a href="#" class="button isSelected"><span class="pageNumber">' + i + '</span></a>';

                } else {

                    pagesToOutput += '<a href="#" class="button"><span class="pageNumber">' + i + '</span></a>';

                }
            }

            thisGallery.children(".paging").append(pagesToOutput).on("click", ".button", function () {

                var thisButton = jQuery(this),
                    buttons = thisButton.siblings().addBack(),
                    currentPage = buttons.index(thisButton);

                gallery.scrollToThumb(currentPage * itemsInLine, currentPage, buttons);

                return false;
            });

            return this;
        }

        gallery.setupThumbs = function () {

            controls.on("click", function () {

                var thisControl = jQuery(this),
                    thumbsZeroLength = thumbs.length,
                    nextSlide = (currentThumb + itemsInLine >= thumbsZeroLength) ? thumbsZeroLength : currentThumb + itemsInLine,
                    prevSlide = (currentThumb - itemsInLine < 0) ? null : currentThumb - itemsInLine;

                if (thisControl.hasClass("previous") && prevSlide !== null) {

                    gallery.scrollToThumb(prevSlide, prevSlide / itemsInLine);

                } else if (thisControl.hasClass("next") && nextSlide !== thumbsZeroLength) {

                    gallery.scrollToThumb(nextSlide, nextSlide / itemsInLine);

                }

                return false;

            });

            return this;
        }

        gallery.scrollToThumb = function (thisThumb, thisPage, buttons) {

            if (typeof buttons === "undefined") {
                buttons = thisGallery.children(".paging").find(".button");
            }

            thumbsList.stop(true, true).scrollTo(thumbs.eq(thisThumb), 500);

            currentThumb = thisThumb;

            buttons.removeClass("isSelected");
            buttons.eq(thisPage).addClass("isSelected");

        }

        gallery.setupVideo = function () {

            var videoThumb = thumbs.filter(".isVideo");

            if (videoThumb.length > 0) {

                videoThumb.on("click", function () {

                    thumbs.removeClass("isSelected");

                    videoContainer.css('z-index', 1).css({ 'width': '', 'height': '', 'position': '' });

                    imageContainer.hide();

                    thisGallery.attr("data-thumbindex", thumbs.index(jQuery(this).addClass("isVideo isSelected")));

                    return false;
                });
            }

            return this;
        }

        gallery.setupSwipeBox = function () {

            var thumbsArray = [];

            thisGallery.find(".enlarge").on("click", function () {

                var thumbIndex = parseInt(thisGallery.attr("data-thumbindex"));

                var index = 0;

                swipeBoxes.each(function (i) {

                    var thisThumb = jQuery(this);

                    if (thisThumb.attr("href").indexOf("www.youtube.com") <= 0) {

                        thumbsArray[index] = { href: thisThumb.attr("href"), title: thisThumb.attr("title") };

                        index++;

                    } else {

                        thumbIndex = thumbIndex - 1;
                    }

                });

                jQuery.swipebox(thumbsArray, { initialIndexOnArray: thumbIndex, hideBarsDelay: 3000 });

                return false;
            });

            return this;
        }

        if (thumbs.length > 0) {
            gallery.load().setThumbWidth().loadEnlarged().createPagination().setupThumbs().setupVideo();
        }
    }
}

function redirect(location) {
    if (!location) {
        window.location.href = document.URL;
    } else {
        window.location.href = location;
    }
}

function initCurrentLocation() {

    var thisObj = this,
        $currentLocationBtn = jQuery("#CurrentLocationButton"),
        $useCurrentLocationKey = "UseCurrentLocation";

    var setCurrentLocationValues = function (position) {
        cookie("Lat", position.coords.latitude);
        cookie("Lng", position.coords.longitude);
        cookie("KeepFilters", "true");
        cookie("UsersPostcode", "");
    };

    var initSuccessHandler = function (position) {

        setCurrentLocationValues(position);

        cookie($useCurrentLocationKey, "True");

        redirect();
    };

    var errorHandler = function (error) {
        cookie("Lat", "");
        cookie("Lng", "");
        cookie($useCurrentLocationKey, "");

        console.log(error);

        $currentLocationBtn.hide();
    };

    thisObj.init = function (location) {

        var $postCodeCookieValue = cookie("UsersPostcode");

        if ($postCodeCookieValue !== undefined && $postCodeCookieValue.length > 0) {
            return;
        }

        if ($currentLocationBtn.length > 0) {

            getGeolocation(setCurrentLocationValues, false, errorHandler);

            $currentLocationBtn.on("click", function (e) {
                e.preventDefault();
                getGeolocation(initSuccessHandler, false, errorHandler);

            });

        }

    };
}

function initPostCodeField(inputToBind, button, location, errorControl) {

    var thisObj = this,
        postCodeCookieValue = cookie("UsersPostcode");


    thisObj.submitOnEnterEventHandler = function (inputToBind, button, location, errorControl) {

        if (inputToBind.data("fieldtype") == "postcode" || inputToBind.data("fieldtype") == "mandatoryPostcode") {

            if (!ValidateField(inputToBind.val(), inputToBind.data("fieldtype"))) {

                errorControl.removeClass("isHidden");

                return false;
            }
            else {
                errorControl.addClass("isHidden");
            }

            thisObj.setUsersPostcodeCookie(inputToBind.val());

        }

        cookie("KeepFilters", "true");

        redirect(location);

        return true;
    }

    thisObj.setUsersPostcodeCookie = function (postcodeValue) {

        if (postcodeValue !== "" || postcodeValue !== "undefined") {

            cookie("UsersPostcode", postcodeValue, 90);

        }
    }

    thisObj.init = function () {

        if (postCodeCookieValue !== "undefined" && inputToBind !== "undefined") {

            inputToBind.val(postCodeCookieValue);

            button.on('click', function () {

                cookie("KeepFilters", "true");

            })

            initSubmitOnEnter(inputToBind, button, location, errorControl, thisObj.submitOnEnterEventHandler, thisObj.submitOnEnterEventHandler);

        }

    }

}

function savePostcodeInCookie() {

    var thisObj = this,
        postcode = jQuery('#PostCodeTextBox'),
        postcodeSearch = jQuery('#MergedTextboxPostcodeSearchLink'),
        errorMessage = jQuery('#distanceFilter').find('.error');

    thisObj.load = function () {

        initSubmitOnEnter(postcode, postcodeSearch, null, errorMessage, thisObj.clickOrEnterEventHandler, thisObj.clickOrEnterEventHandler);
    }

    thisObj.clickOrEnterEventHandler = function () {
        var postocodeValue = postcode.val(),
            postcodeType = postcode.data("fieldtype");

        if (postcodeType == "postcode" || postcodeType == "mandatoryPostcode") {

            if (!ValidateField(postocodeValue, postcodeType)) {
                errorMessage.removeClass("isHidden");
                return false;
            }
            else {
                errorMessage.addClass("isHidden");
            }

            if (postocodeValue !== "" || postocodeValue !== "undefined") {
                cookie("UsersPostcode", postocodeValue, 90);
                cookie("KeepFilters", "true");
            }
        }
    }
}

// Prompt to enter postcode or use current location
function locationPromptPopup(popupContainer) {

    if (popupContainer.length) {

        var thisObj = this,
            geoCoordinates = {
                latitude: cookie('Latitude'),
                longitude: cookie('Longitude')
            },
            usersPostcode = cookie('UsersPostcode'),
            blackout = jQuery('#blackout'),
            thisPopup = popupContainer,
            locationPopup = jQuery("#locationPopup"),
            updateMessageContainer = thisPopup.find("#updateMessageContainer"),
            errorText = locationPopup.find(".error"),
            closeButton = jQuery("#locationPromptClose"),
            sharePane = jQuery("[data-panecontent=\"share\"]").length,
            functionToolbar = jQuery(".functionToolbar");

        thisObj.load = function () {

            if (typeof usersPostcode === 'undefined' || usersPostcode === '') {

                var locationPopupPostcodeField = locationPopup.find("#LocationPromptPopupTextBox"),
                    locationPopupSearchButton = locationPopup.find("#LocationPromptPopupSearchButton");

                new initPostCodeField(locationPopupPostcodeField, locationPopupSearchButton, null, errorText).init();

                initSubmitOnEnter(locationPopupPostcodeField, locationPopupSearchButton, null, errorText, thisObj.clickOrEnterEventHandler, thisObj.clickOrEnterEventHandler);

                if (jQuery.cookie('popupDismissed') != "true") {

                    thisPopup.show();

                }

                if (sharePane && locationPopup.is(":visible")) {

                    functionToolbar.addClass("noPostcode");

                }

                if (jQuery.cookie("UseCurrentLocation") == "True") {
                    thisPopup.hide();
                }
            }
        }

        closeButton.on('click', function () {
            thisPopup.hide();
            jQuery.cookie('popupDismissed', true, { expires: 3, path: '/' });
            if (sharePane) {

                functionToolbar.removeClass("noPostcode");

            }
        });

        thisObj.clickOrEnterEventHandler = function () {
            if (errorText.hasClass('isHidden')) {
                updateMessageContainer.removeClass('isHidden');
            }
        }
    }
}

//  Bind Enter Key press on a merged textbox field
function initSubmitOnEnter(inputToBind, button, location, errorControl, keyDownEventHandler, buttonClickEventHandler) {

    if (inputToBind !== "undefined") {

        inputToBind.on("keydown", function (e) {

            if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {

                return keyDownEventHandler(inputToBind, button, location, errorControl);

            }
        });
    }

    if (button !== "undefined" && inputToBind !== "undefined") {

        button.on("click", function (e) {

            return buttonClickEventHandler(inputToBind, button, location, errorControl);

        });

    }
}

//  Sets up an instance of the Carousel control
function initCarousel(carousel, speed) {

    if (speed === "undefined" || typeof speed !== "number") {
        speed = 7000;
    }

    var slideMask = carousel.find('div.slideMask'),
        slideContainer = slideMask.find('ul.slides'),
        slides = slideContainer.children('li'),
        backgrounds = slides.find("img.background"),
        currentSlide = slides.filter('li.current').length ? slides.filter('li.current') : slides.filter(':first').addClass("current"),
        slideNextPrevious = carousel.find('a.previous,a.next'),
        controls = carousel.find('ul.controls'),
        showControls = false,
        showFullControls = false,
        run,
        activateControls = 2,
        thisObj = this;

    thisObj.load = function () {

        if (carousel.length > 0) {

            if (slides.length == 1) {

                slideNextPrevious.hide();

            } else if (slides.length > 1) {

                // if there is a parameter class of showControls or showFullControls then set up the pagination

                if (carousel.hasClass('showControls')) {

                    showControls = true;
                    thisObj.showControls();

                } else if (carousel.hasClass('showFullControls')) {

                    showFullControls = true;
                    thisObj.showControls();
                }

                // Setup the width and resize event so that if the browser is resized the width is recalculated

                thisObj.setWidth();

                jQuery(window).on("resize", function () {

                    thisObj.setWidth();

                });

                // Set an interval which will call the slide method

                run = setInterval(function () { thisObj.slide("next"); }, speed);

                // Set an hover event so that the interval is paused when the mouse is over the carousel

                carousel.on({

                    mouseover: function () {

                        if (run !== null) {

                            clearInterval(run);

                            run = null;

                        }
                    },
                    mouseout: function () {

                        if (run === null) {

                            run = setInterval(function () { thisObj.slide("next"); }, speed);

                        }

                    }
                })
            }
        }

        // If the carousel is a hero-section component make sure the search section is positioned correctly

        thisObj.searchOverlay();

        jQuery(window).on("resize", function () {
            thisObj.searchOverlay();
        });

    };

    thisObj.searchOverlay = function () {

        var homeHero = carousel.parent(".hero-section");

        if (carousel.width() == jQuery(window).width() && homeHero.length) {

            homeHero.find(".filter").css("left", jQuery(".main-header").offset().left + 25);

        }
    };

    thisObj.showControls = function () {

        controls.show();

        var controlsNextPrevious = function (direction) {

            clearInterval(run);

            thisObj.slide(direction);

            run = setInterval(function () { thisObj.slide("next"); }, speed);

            return false;

        };

        slideNextPrevious.on("click", function () {

            if (jQuery(this).hasClass("previous")) {

                controlsNextPrevious("prev");

            } else {

                controlsNextPrevious("next");

            }

            return false;

        });

        // Detecting if browser is an older version of IE
        var oldIE = false;

        if (jQuery('html').is('.oldIE')) {

            oldIE = true;

        }

        // Carousel touch event - only in modern browsers
        if (oldIE === false) {

            // New hammer js instance for touch events
            var swipeNextPrevious = new Hammer(slideMask[0]);

            // Set threshold/velocity options
            swipeNextPrevious.get("swipe").set({
                threshold: 1, velocity: 0.2
            });

            // Touch events
            swipeNextPrevious.on("swipeleft", function (ev) {
                controlsNextPrevious("next");
            });

            swipeNextPrevious.on("swiperight", function (ev) {
                controlsNextPrevious("prev");
            });

        }

        // Check if the pip controls need to be activated
        if (slides.length >= activateControls && showFullControls) {

            slides.each(function (index) {

                if (index == 0) {
                    markupToInsert = '<li class="current page"><a href="">' + (index + 1) + '</a></li>';
                } else {

                    markupToInsert = '<li class="page"><a href="">' + (index + 1) + '</a></li>';
                }

                jQuery(markupToInsert).appendTo(controls).click(function () {

                    clearInterval(run);

                    thisObj.slide(index);

                    run = setInterval(function () { thisObj.slide("next"); }, speed);

                    return false;

                });
            });
        }
    };

    thisObj.setWidth = function () {

        var carouselParentWidth = carousel.parent().width(),
            allWidths = [],
            windowWidth = jQuery(window).width();

        // loop through each slide - add image widths to allWidths array 
        slides.each(function () {

            allWidths.push(jQuery(this).find('img')[0].naturalWidth);

        });

        // find highest value in allWidths array 
        var maxWidth = Math.max.apply(Math, allWidths);

        // find lowest value from two width variables
        var maxImageWidth = Math.min(carouselParentWidth, maxWidth);

        // full width carousel settings
        if (carousel.is(".hero-section_carousel")) {

            // set the width of the carousel to be the width of one slide
            carousel.width("100%");

            // set the slide container to be the width of all the slides
            slideContainer.width(carousel.width() * slides.length);

            slides.each(function () {

                var currentSlide = jQuery(this),
                    slideImage = currentSlide.find('img');

                // Set the dimensions of the current slide to match the image dimensions.
                currentSlide.width(slideContainer.width() / slides.length);

                if (jQuery(this).width() > jQuery(this).find("img").width()) {

                    currentSlide.find(".slideLink").addClass("is-overflow").width(maxImageWidth).css("left", ((jQuery(this).width() - jQuery(this).find("img").width()) / 2));

                } else {

                    currentSlide.find(".slideLink").removeClass("is-overflow").width(maxImageWidth).css("left", "auto");

                }

                slideImage.each(function () {

                    var thisImage = jQuery(this),
                        thisImageWidth = thisImage.width();

                    if (windowWidth < 999 && thisImageWidth > windowWidth) {

                        thisImage.css("margin-left", (carousel.width() - thisImageWidth) / 2);

                    } else {

                        thisImage.css("margin-left", "0");

                    }

                });

            });

        } else {

            slides.each(function () {

                var currentSlide = jQuery(this),
                    slideImage = currentSlide.find('img');

                // Ensure image fills entire space
                slideImage.width(maxImageWidth);

                // Set the dimensions of the current slide to match the image dimensions.
                currentSlide.width(maxImageWidth);
            });

            // set the width of the carousel to be the width of one slide
            carousel.width(maxImageWidth);

            // set the slide container to be the width of all the slides
            slideContainer.width(carousel.width() * slides.length);

        }

        slideMask.stop(true, true).scrollTo(slides.filter('.current'), 200);

    };

    thisObj.slide = function (direction) {

        var currentSlide = slides.filter('.current').length ? slides.filter('.current').removeClass('current') : slides.filter(':first').removeClass('current');

        switch (direction) {
            case "prev":

                var nextSlide = (currentSlide.prev().length) ? currentSlide.prev().addClass('current') : slides.filter('li:last').addClass('current');

                break;

            case "next":

                var nextSlide = (currentSlide.next().length) ? currentSlide.next().addClass('current') : slides.filter('li:first').addClass('current');

                break;

            default:

                var nextSlide = slides.filter("li:eq(" + direction + ")").addClass('current');
        }

        slideMask.stop(true, true).scrollTo(nextSlide, 500);

        // Add class to pip control signify current slide
        if (slides.length >= activateControls && showFullControls) {

            controls.find("li").removeClass("current").filter(":eq(" + slides.index(nextSlide) + ")").addClass("current");

        }
    };
}

//  Creates an accordion from a compatible markup structure
function initAccordion(container) {

    if (container.length > 0) { // Check to make sure the container exists

        var animationSpeed = 200;

        container.each(function (idx) {

            var accordion = jQuery(this),
                stateStorage = accordion.next(),
                headers = accordion.children().children(".accordionHeader"),
                panes = headers.next().parent().addClass("hasMenu").end(),
                eventToBind;

            if (stateStorage.val() !== "") {

                panes.filter(":eq(" + stateStorage.val() + ")").show().parent().addClass("open");

            }

            if (headers.children('input[type=radio]').length || headers.children('input[type=checkbox]').length) {
                eventToBind = 'change';
            } else {
                eventToBind = 'click';
            }

            headers.on(eventToBind, function (event) {   // Set up the click event on the pane header

                var header = jQuery(this),
                    pane = jQuery(event.delegateTarget).next(),
                    headParent = pane.parent();

                if (!headParent.hasClass("open")) { // If the header parent does not have a class of open then slide the pane down.

                    panes				// close all open panes
                        .stop(true)
                        .slideUp(animationSpeed, function () {
                            jQuery(this)
                                .parent()
                                .removeClass("open");
                        });


                    pane				// Open Selected pane
                        .stop(true)
                        .slideDown(animationSpeed)
                        .parent()
                        .addClass("open");

                    stateStorage.val(panes.index(pane));


                } else {	 // If the header parent has a class of open then slide the pane up.

                    pane
                        .stop(true)
                        .slideUp(animationSpeed, function () {
                            jQuery(this)
                                .parent()
                                .removeClass("open");
                        });

                    stateStorage.val("");

                }
            });
        });
    }
}

//  Creates an accordion from a compatible markup structure
function initFilterAccordion(container) {

    if (container.length > 0) { // Check to make sure the container exists

        var thisObj = this,
            animationSpeed = 200,
            accordionParent = container.parent(),
            lastSelectedId = cookie('LastClickedId');

        thisObj.load = function () {
            // Temporary fix until we refactor the filters
            jQuery('#Panel_Trucks').children().unwrap();

            container.each(function (idx) {

                var accordion = jQuery(this),
                    stateStorage = accordion.next(),
                    headers = accordion.children().children(".accordionHeader"),
                    panes = headers.next().parent().addClass("hasMenu").end(),
                    nestedAccordion = panes.find('.accordion'),
                    selectedItem = container.find('.isSelected');

                if (nestedAccordion.length) {

                    nestedAccordion.closest('.hasMenu').addClass('hasNestedAccordion');

                }

                // Store state for filters selected via another page
                if (stateStorage.val() === "" && selectedItem.length) {

                    var paneIndex;

                    if (headers.hasClass('filterHeader')) {
                        paneIndex = panes.index(selectedItem.closest('.pane'));
                    }
                    else {
                        paneIndex = panes.index(selectedItem.find('.pane'));
                    }
                    if (paneIndex !== 'undefined') {
                        stateStorage.val(paneIndex);
                    }
                }

                if (stateStorage.val() !== "" && stateStorage.val() >= 0) {

                    panes.filter(":eq(" + stateStorage.val() + ")").show().parent().addClass("open");

                    var filterContainer = accordion.closest('.filterContainer');
                    if (filterContainer.length && filterContainer.hasClass('hasNestedAccordion')) {
                        filterContainer.addClass('open');
                    }
                }

                if (typeof lastSelectedId !== 'undefined') { // If there is a selection
                    thisObj.initScrollToSelected(lastSelectedId);
                }

                panes
                    .children()
                    .children('.isSelected')
                    .closest('.hasMenu')
                    .addClass('hasSelectedItems');

                headers.on("click", function (event) {   // Set up the click event on the pane header

                    var header = jQuery(this),
                        pane = jQuery(event.delegateTarget).next(),
                        headParent = pane.parent(),
                        headParents = panes.parent();

                    if (!headParent.hasClass('open')) { // If the header parent does not have a class of open then slide the pane down.

                        headParents.each(function () {

                            var thisHeadParent = jQuery(this),
                                thisPane = thisHeadParent.children('.pane');

                            if (thisHeadParent.hasClass('open')) {

                                if (!thisHeadParent.hasClass('hasSelectedItems')) { // If there are no selected items

                                    thisPane
                                        .stop(true)
                                        .slideUp(animationSpeed)
                                        .parent()
                                        .removeClass('open');

                                } else { // If there are selected items

                                    if (!thisHeadParent.hasClass('hasNestedAccordion')) { // If the accordion doesn't have a nested accordion

                                        thisPane
                                            .children()
                                            .children(':not(.isSelected)')
                                            .stop(true)
                                            .slideUp(animationSpeed)
                                            .closest('.hasMenu')
                                            .removeClass('open');

                                    } else { // If the accordion has a nested accordion

                                        thisPane
                                            .children()
                                            .children(':not(.isSelected)')
                                            .stop(true)
                                            .slideUp(animationSpeed) // Slide up all nested headPrents that have no 'isSelected' class
                                            .end()
                                            .children('.isSelected')
                                            .children('.accordionHeader')
                                            .stop(true)
                                            .slideUp(animationSpeed) // Slide up all nested accordionHeaders of headParents that have 'isSelected' class
                                            .next()
                                            .children()
                                            .children(':not(.isSelected)') // Slide up all list items of accordions that have no 'isSelected' class
                                            .stop(true)
                                            .slideUp(animationSpeed)
                                            .end()
                                            .end()
                                            .end()
                                            .end()
                                            .end()
                                            .end()
                                            .parent()
                                            .removeClass('open');

                                    }

                                }
                            }

                        });

                        if (!headParent.hasClass('hasSelectedItems')) { // If there are no selected items 

                            pane				// close all open panes
                                .stop(true)
                                .slideDown(animationSpeed, function () {
                                })
                                .parent()
                                .addClass("open");

                        } else { // If there are selected items

                            if (!headParent.hasClass('hasNestedAccordion')) { // If the accordion doesn't have a nested accordion

                                pane
                                    .children()
                                    .children(':not(.isSelected)')
                                    .stop(true)
                                    .slideDown(animationSpeed)
                                    .queue(function () { // Call initScrollToHeader after the last item animation has finished 
                                    })
                                    .closest('.hasMenu')
                                    .addClass('open');

                            } else { // If the accordion has a nested accordion

                                pane
                                    .children()
                                    .children(':not(.isSelected)')
                                    .stop(true)
                                    .slideDown(animationSpeed) // Slide down all nested headPrents that have no 'isSelected' class
                                    .end()
                                    .children('.isSelected')
                                    .children('.accordionHeader')
                                    .stop(true)
                                    .slideDown(animationSpeed)  // Slide down all nested accordionHeaders of headParents that have 'isSelected' class
                                    .queue(function () { // Call initScrollToHeader after the last item animation has finished 
                                    })
                                    .parent('.open')
                                    .children('.pane')
                                    .children()
                                    .children(':not(.isSelected)')
                                    .stop(true)
                                    .slideDown(animationSpeed) // Slide down all list items of accordions that have no 'isSelected' class
                                    .end()
                                    .end()
                                    .end()
                                    .end()
                                    .end()
                                    .end()
                                    .end()
                                    .parent()
                                    .addClass('open');

                            }

                        }

                        stateStorage.val(panes.index(pane));

                    } else { // If the header parent has a class of open then slide the pane up.

                        if (!headParent.hasClass('hasSelectedItems')) { // If there are no selected items 

                            pane				// close all open panes
                                .stop(true)
                                .slideUp(animationSpeed)
                                .parent()
                                .removeClass("open");

                        } else { // If there are selected items 

                            if (!headParent.hasClass('hasNestedAccordion')) { // If the accordion doesn't have a nested accordion

                                pane
                                    .children()
                                    .children(':not(.isSelected)')
                                    .stop(true)
                                    .slideUp(animationSpeed, function () {
                                        jQuery(this)
                                            .closest('.hasMenu')
                                            .removeClass('open');
                                    });

                            } else { // If the accordion has a nested accordion

                                pane
                                    .children()
                                    .children(':not(.isSelected)')
                                    .stop(true)
                                    .slideUp(animationSpeed) // Slide up all nested headPrents that have no 'isSelected' class
                                    .end()
                                    .children('.isSelected')
                                    .children('.accordionHeader')
                                    .stop(true)
                                    .slideUp(animationSpeed) // Slide up all nested accordionHeaders of headParents that have 'isSelected' class
                                    .next()
                                    .children()
                                    .children(':not(.isSelected)')
                                    .stop(true)
                                    .slideUp(animationSpeed) // Slide up all list items of accordions that have no 'isSelected' class
                                    .end()
                                    .end()
                                    .end()
                                    .end()
                                    .end()
                                    .end()
                                    .parent()
                                    .removeClass('open');

                            }

                        }

                        stateStorage.val('');

                    }

                    return false;

                });
            });
        }

        thisObj.initScrollToHeader = function (header) {
            if (accordionParent.outerHeight() < container.outerHeight()) {
                new initScrollToElement(header, accordionParent).top();
            } else {
                new initScrollToElement(header, undefined).top();
            }
        };

        thisObj.initScrollToSelected = function (elementId) {
            var element = jQuery('#' + elementId),
                elementParent = element.parent(),
                elementParentHeight = elementParent.outerHeight(),
                accordionParentHeight = accordionParent.outerHeight(),
                halfScreenOffset = accordionParentHeight / 2 - elementParentHeight / 2,
                elementTopScroll;
            if (elementParent.length > 0) {
                elementTopScroll = accordionParent.scrollTop() + elementParent.offset().top - accordionParent.offset().top;
                // Position in the middle of the screen
                if (accordionParent.outerHeight() < container.outerHeight()) {
                    accordionParent.scrollTop(elementTopScroll - halfScreenOffset);
                } else {
                    jQuery('html, body').scrollTop(elementParent.offset().top - (jQuery(window).height() / 2 - elementParentHeight / 2));
                }
            }
        };
    }
}

//  Sets up the geo location script for mobile devices
function getGeolocation(positionHandler, errorEnabled, errorHandler) {

    if (navigator.geolocation) {

        var options = {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            function (data) {
                positionHandler(data);
            },
            function (error) {
                if (errorEnabled) {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert("Denied \n\nYou denied the geolocation lookup; please use the postcode field instead.")
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert("Position Unavailable \n\nWe were not able to retrieve the location information from your device. Please make sure GPS is enabled, or you have an active internet connection and try again.")
                            break;
                        case error.TIMEOUT:
                            alert("Timout \n\nWe have tried to get the location information but it took too long; please try again.")
                            break;
                        case error.UNKNOWN_ERROR:
                            alert("Error \n\nYour device returned an unknown error when returning your location, please try again.")
                            break;
                    }
                }

                if (errorHandler) {
                    errorHandler(error);
                }

            }, options);
    }
}

//  Sets up the default AJAX functions
function initAjax() {

    var container = jQuery("#container"),
        loader = jQuery("#loader");

    jQuery.ajaxSetup({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });

    jQuery(document).ajaxStart(function () {

        if (loader.length > 0) {

            loader.show();

        }

    }).ajaxStop(function () {

        if (loader.length > 0) {

            loader.hide();

        }
    });

};

// Sets the cookie and sub cookie
function setFinanceTermsSubCookies() {
    var deposit = jQuery('#TextBoxDeposit').val();
    var mileage = jQuery('#DropDownListMileage').val();
    var term = jQuery('#DropDownListTerm').val();

    if (deposit == "undefined" || deposit == "") {
        // set deposit to its default value
        deposit = -1;
    }

    var cookieValue = 'Deposit=' + deposit + '&Mileage=' + mileage + '&Term=' + term;

    // Prevent encoding of ampersands and equals characters.
    jQuery.cookie.raw = true;

    cookie('Finance', cookieValue, null);
}

//  jQuery cookie plugin functionality 
function cookie(name, value, expiration) {

    if (typeof name === "undefined") {
        return;
    }

    if (typeof value !== "undefined" && typeof expiration === "undefined") {
        jQuery.cookie(name, value, { path: '/' });
    }
    else {
        if (typeof expiration === "undefined") {
            return jQuery.cookie(name);
        }
        else {
            jQuery.cookie(name, value, { expires: expiration, path: '/' });
        }
    }
}

//  Initialise the top navigation menus
function initNavigationMenus() {

    var navigationMenu = jQuery(".main-header_nav"),
        menus = jQuery("ul ul", navigationMenu).has('li'),
        menuTriggers = menus.parent().addClass("has-submenu"),
        menuLabel = navigationMenu.children(".main-header_nav_label").addClass("is-closed"),
        currentPageUrl = jQuery("#CurrentPageUrl").val();

    var methods = {

        // This method sets up the script when the page loads
        init: function () {

            menuTriggers.find("a").append("<span class=\"inline-navigation_expand\"></span>")

            methods.checkWidth();

            // Setup a resize event so that if the window width reduces past a specific size, the menus no longer show
            jQuery(window).on("resize", function () {

                methods.checkWidth();

            });
        },

        // This method initialises the drop down menus
        initMenus: function () {

            menuTriggers.off().on({

                mouseenter: function () {

                    if (!menuLabel.is(":visible")) {

                        var thisTrigger = jQuery(this),
                            thisMenu = thisTrigger.children("ul").removeAttr("style");

                        menus.hide();
                        thisMenu.stop(true).slideDown(100);
                        thisTrigger.addClass("open");

                        return false;
                    }
                },

                mouseleave: function () {

                    if (!menuLabel.is(":visible")) {

                        var thisTrigger = jQuery(this),
                            thisMenu = thisTrigger.children("ul").removeAttr("style");

                        thisMenu.removeClass("open").stop(true).slideUp(100);
                        thisTrigger.removeClass("open");

                        return false;
                    }
                }

            })

        },

        // This method hides or shows the menus depending on the window width
        checkWidth: function () {

            if (menuLabel.is(":visible")) {

                menuTriggers.off("hover");
                methods.initDropMenu();

            } else {

                methods.initMenus();

                menuTriggers.removeClass("open dropped");
                menus.removeAttr("style");
                menuLabel.removeAttr("style").next().removeAttr("style");
            }
        },

        initDropMenu: function () {

            var menu = menuLabel.next();

            menuLabel
                .off("click")
                .on("click", function (e) {

                    menuTriggers.on("click", function (e) {

                        e.stopPropagation();

                    });

                    if (menuLabel.hasClass("is-closed")) {

                        menu.slideDown(200);

                        menuLabel.removeClass("is-closed").addClass("is-open");

                    } else {

                        menu.slideUp(200);

                        menuLabel.removeClass("is-open").addClass("is-closed");
                    }

                    return false;

                });

            menuTriggers.find(".inline-navigation_expand")
                .off("click")
                .on("click", function (e) {

                    var thisTrigger = jQuery(this).closest(".inline-navigation_item"),
                        thisMenu = thisTrigger.children("ul");

                    thisTrigger.on("click", function (e) {

                        e.stopPropagation();

                    });

                    if (!thisTrigger.hasClass("dropped")) {

                        menus.stop(true).slideUp(200);
                        menuTriggers.removeClass("dropped");

                        thisMenu.slideDown(200);
                        thisTrigger.addClass("dropped");


                    } else {

                        thisMenu.stop(true).slideUp(200, function () {
                            thisTrigger.removeClass("dropped");
                        });

                    }

                    return false;

                });
        },

        //Highlights the parent section of the current page
        highlightSection: function () {


            //Highlight current page
            var items = navigationMenu.find("li").removeClass("is-current");

            if (currentPageUrl == "/") {
                navigationMenu.find("li[data-url='" + currentPageUrl + "']").addClass("is-current");
            }
            else {
                items.each(function () {
                    var thisItem = jQuery(this);
                    var thisItemDataUrl = thisItem.data("url");

                    if (currentPageUrl.indexOf(thisItemDataUrl) != -1 && thisItemDataUrl != "/") {
                        thisItem.addClass("is-current");
                        return false;
                    }
                });
            }
        }
    }

    methods.init();
}

// Initialise the quick links animation
function initQuickLinks() {

    quickLinksAnimation();

    jQuery(window).on("resize", function () {

        quickLinksAnimation();

    });

    function quickLinksAnimation() {

        jQuery(".quick-links").each(function () {

            var thisObj = jQuery(this),
                thisQuickLinkItem = thisObj.find(".quick-links_item");

            if (jQuery(window).width() < 800) {

                thisQuickLinkItem.removeClass("is-active");
                thisQuickLinkItem.eq(0).addClass("is-active");

                if (!thisObj.hasClass("is-carousel")) {
                    thisObj.addClass("is-carousel");
                }

                var index = 1;

                setInterval(function () {

                    var thisPreviousItem = thisQuickLinkItem.eq(index - 1);

                    if (thisPreviousItem.length) {
                        thisPreviousItem.removeClass("is-active");
                    }

                    if (!thisQuickLinkItem.hasClass("is-active")) {
                        thisQuickLinkItem.eq(index).addClass("is-active");
                    }

                    if (index == (thisQuickLinkItem.length - 1)) {
                        index = 0;
                    } else {
                        index++;
                    }

                }, 6000);

            }

        });
    }
}

function SetSubmitButtonText(enquiryType) {
    var submitButton = jQuery("#ButtonSubmit"),
        buttonProcessPayment = jQuery("#ButtonProcessPayment"),
        buttonTextJSON = JSON.parse(jQuery('#HiddenFieldEnquiryButtonTexts').val());

    switch (enquiryType) {
        case EnquiryType.MoveMeCloser:
            submitButton.val(buttonTextJSON.mmcButtonText);
            break;
        case EnquiryType.MoveMeCloserPayment:
            buttonProcessPayment.html(buttonTextJSON.mmcPaymentButtonText);
            break;
        case EnquiryType.ReservationRequest:
            submitButton.val(buttonTextJSON.reservationButtonText);
            break;
        case EnquiryType.ReservationPayment:
            buttonProcessPayment.html(buttonTextJSON.reservationPaymentButtonText);
            break;
        default:
            submitButton.val(buttonTextJSON.enquiryButtonText);
            break;
    }
}
function textAreaMaxLength(element) {

    jQuery(window).on("load", function () {
        textAreaChangeMaxLength(element);
    });

    element.on("input propertychange", function () {

        var $inputElement = jQuery(this),
            maxlength = $inputElement.attr("maxlength");

        if (maxlength != undefined) {

            var remainingCharacters = (maxlength - $inputElement.val().length);
            $inputElement.next().text(remainingCharacters + " " + maxLengthPlural(remainingCharacters) + " remaining");
        }
    });
}

function textAreaChangeMaxLength(element) {
    element.each(function () {

        var $element = jQuery(this),
            maxlength = $element.data("maxlength");
        $element.attr('maxlength', maxlength);
        if (maxlength != undefined) {

            if (maxlength != undefined) {
                var nextElement = $element.next();
                var divInnterText = maxlength + " " + maxLengthPlural(maxlength) + " remaining";
                if (nextElement.hasClass('textarea_maxLength ')) {
                    nextElement.html(divInnterText);
                } else {
                    var charCount = "<div class='textarea_maxLength '>" + divInnterText + "</div>";
                    $element.after(charCount);
                }
            }
        }

    });
}

function maxLengthPlural(value) {

    if (value != 1) {
        return "characters";
    } else {
        return "character";
    }
}

function ResetReservationOptions() {
    jQuery('#VehicleLocationsOptions').find("input[type=radio]").each(function () {
        jQuery(this).prop('checked', false);
        jQuery(".accordion").find('.pane:first').hide();
    });
}
function SetReservationCheckBox(checked) {
    var vehicleReservationCheckBox = jQuery('#VehicleReservationCheckBox'),
        vehicleLocationsOptions = jQuery('#VehicleLocationsOptions'),
        moveMeCloserEnquirySummary = jQuery('#MoveMeCloserEnquirySummary'),
        submitButton = jQuery("#ButtonSubmit"),
        processPaymentContainer = jQuery('#processPaymentContainer');
    var fieldRow = $(vehicleReservationCheckBox).closest(".fieldRow");

    if (checked) {
        vehicleLocationsOptions.show();
        var locationOptions = vehicleLocationsOptions.find("input[type=radio]");
        if (locationOptions.length == 1) {
            locationOptions.first().click();
            moveMeCloserEnquirySummary.show();
        }
        fieldRow.addClass("selectionExpand");
    } else {

        vehicleLocationsOptions.hide();
        moveMeCloserEnquirySummary.hide();
        submitButton.show();
        processPaymentContainer.hide();
        fieldRow.removeClass("selectionExpand");
    }
    vehicleReservationCheckBox.prop('checked', checked);

}
//  Setup the javascript for the enquiry form modals
function loadEnquiryForm() {

    var thisObj = this,
        modal = jQuery("#enquiryModal"),
        trigger = jQuery(".enquiryTrigger"),
        stateStore = jQuery("#modalState"),
        blackout = jQuery("#enquiryModal_blackout"),
        closeModal = jQuery("#closeModal"),
        contactForm = jQuery(".contactForm"),
        contactFormFeedback = jQuery("#EnquiryFeedbackContainer"),
        itemPath = contactForm.data('itempath'),
        enquiryFeedbackHeader = jQuery('#enquiryFeedbackHeader'),
        vehicleReservationCheckBox = jQuery("#VehicleReservationCheckBox");

    thisObj.init = function (preOpenEventHandler) {

        if (stateStore.val() === "open") {
            blackout.show();
            modal.show();
        }

        thisObj.initFeedbackContent();

        closeModal.add(blackout).on("click", function () {
            thisObj.closeModal();
        });


        if (trigger.length > 0) {

            jQuery(document).on('click', '.enquiryTrigger', function () {

                var currentTrigger = jQuery(this);
                var enquiryTypeId = jQuery(this).data('enquirytype'),
                    dealerId = jQuery(this).data('dealerid'),
                    showContactFormOnly = jQuery(this).data('showcontactformonly'),
                    contactFormEnquiryType = jQuery('#HiddenFieldEnquiryTypeID'),
                    contactFormDealerId = jQuery('#HiddenFieldDealerID'),
                    contactFormMessageTextBox = jQuery('#TextBoxMessage'),
                    titleContent = jQuery(this).data('titlecontent'),
                    subContent = jQuery(this).data('subcontent'),
                    moveMeCloserEnquirySummary = jQuery('#MoveMeCloserEnquirySummary'),
                    defaultMMCLocationOption = jQuery('#DefaultMMCLocationOption'),
                    currentLocationOption = jQuery('#CurrentLocationOption'),
                    contactFormMessageTextBoxMaxCharCount = jQuery(this).data('contactformmessagelength'),
                    contactFormMessageTextBoxNoOfRows = jQuery(this).data('contactformmessagenoofrows'),
                    divMMCContainer = jQuery('#mmcContainer');

                if (typeof (showContactFormOnly) === 'undefined' || showContactFormOnly == false) {
                    divMMCContainer.show();
                }
                else if (showContactFormOnly == true) {
                    divMMCContainer.hide();
                }

                if (stateStore.val() !== "open") {

                    // Reset the message box field
                    contactFormMessageTextBox.val('');

                    // Set contact form parameters and use default values if they are not provided
                    if (contactFormMessageTextBoxMaxCharCount) {

                        contactFormMessageTextBox.data("maxlength", contactFormMessageTextBoxMaxCharCount);
                        textAreaChangeMaxLength(contactFormMessageTextBox);
                    }
                    if (contactFormMessageTextBoxNoOfRows) {

                        contactFormMessageTextBox.attr("Rows", contactFormMessageTextBoxNoOfRows);
                    }

                    if (typeof (enquiryTypeId) === 'undefined' || enquiryTypeId === '') {
                        enquiryTypeId = -1;
                    }
                    contactFormEnquiryType.val(enquiryTypeId);

                    if (typeof (dealerId) === 'undefined' || dealerId === '') {
                        dealerId = 0;
                    }
                    contactFormDealerId.val(dealerId);
                    moveMeCloserEnquirySummary.hide();
                    thisObj.addContentToContainer(titleContent, subContent, jQuery('#contactFormHeader'));
                    var reservationChecked = false;
                    if (typeof (enquiryTypeId) !== 'undefined') {
                        ResetReservationOptions();
                        switch (enquiryTypeId) {
                            case EnquiryType.MoveMeCloser:
                            case EnquiryType.MoveMeCloserPayment:
                                reservationChecked = true;
                                defaultMMCLocationOption.click();
                                break;
                            case EnquiryType.ReservationRequest:
                            case EnquiryType.ReservationPayment:
                                reservationChecked = true;
                                currentLocationOption.click();
                                break;
                            case EnquiryType.UsedVehicle:
                                //Used vehicle enquiry type must show the Reservation Options
                                //and MMC Options
                                break;
                            default:
                                //Used vehicle enquiry type must not show the Reservation Options
                                //and MMC Options
                                divMMCContainer.hide();
                                break;
                        }
                    } else {
                        divMMCContainer.hide()
                    }
                    SetSubmitButtonText(enquiryTypeId);
                    SetReservationCheckBox(reservationChecked);
                    SetTermsAndConditions(enquiryTypeId);

                    if (typeof (preOpenEventHandler) !== 'undefined') {
                        preOpenEventHandler(trigger);
                    }

                    var contentLabel = currentTrigger.data('contentlabel'),
                        requestReferer = currentTrigger.data('referer');

                    if (typeof (itemPath) !== 'undefined' && typeof (contentLabel) !== 'undefined') {

                        new contentManagement().getRelatedContent(itemPath, contentLabel, 'Default', thisObj.getContentHandler, currentTrigger, jQuery('#contactFormHeader'), true);
                    }

                    thisObj.openModal();


                } else {

                    thisObj.closeModal();

                }

                return false;
            });


        } else {

            var contentLabel,
                preDefinedContentLabel = contactForm.data('contentlabel');

            if (typeof (preDefinedContentLabel) === 'undefined' || preDefinedContentLabel === '') {
                contentLabel = 'Default';
            } else {
                contentLabel = preDefinedContentLabel;
            }

            if (typeof (contactForm.data('itempath')) !== 'undefined' &&
                typeof (contentLabel) !== 'undefined') {

                new contentManagement().getRelatedContent(itemPath, contentLabel, 'Default', thisObj.getContentHandler, contactForm, jQuery('#contactFormHeader'), true);
            }
        }
    }

    thisObj.initFeedbackContent = function () {
        if (contactFormFeedback.length) {
            var feedbackContentLabel = contactFormFeedback.data('contentlabel');
            if (typeof (itemPath) !== 'undefined' && typeof (feedbackContentLabel) !== 'undefined') {
                new contentManagement().getRelatedContent(itemPath, feedbackContentLabel, '', thisObj.getContentHandler, contactFormFeedback, enquiryFeedbackHeader, true);
            }
        }
    }

    thisObj.addContentToContainer = function (titleContent, subContent, contentContainer, requestReferer, showContactForm) {
        contentContainer.find('.titleContent').html(titleContent);
        contentContainer.find('.subContent').html(subContent);

        if (typeof (showContactForm) !== 'undefined' && !showContactForm) {
            contactForm.addClass('hidden');

            if (typeof (requestReferer) !== 'undefined') {
                createEnquiryFeedbackButton(requestReferer, contentContainer, 'Go Back to Previous Page');
                closeModal.hide();
            }

        }
    };

    thisObj.getContentHandler = function (relatedContentResponse, referer, contentContainer, isAddToContainerEnabled) {
        if (typeof (relatedContentResponse) !== 'undefined' &&
            !relatedContentResponse.HasError) {

            if (isAddToContainerEnabled) {

                var referalURL = (referer.data('referer') !== '') ? referer.data('referer') : enquiryFeedbackHeader.data('referer'),
                    showForm = (referer.data('showform') !== '') ? referer.data('showform') : enquiryFeedbackHeader.data('showform');

                if (typeof (showForm) === 'undefined' || showForm) {
                    thisObj.addContentToContainer(relatedContentResponse.Title, relatedContentResponse.Content, contentContainer, referalURL, showForm);

                } else {

                    thisObj.addContentToContainer(relatedContentResponse.Title, relatedContentResponse.Content, contactFormFeedback, referalURL, showForm);

                }

            } else if (typeof (referer) !== 'undefined') {
                referer.data('titlecontent', relatedContentResponse.Title);
                referer.data('subcontent', relatedContentResponse.Content);
            }
        }
    }

    thisObj.openModal = function () {
        blackout.fadeIn(200, function () {
            stateStore.val("open");
            modal.show(200);
            jQuery('html,body').animate({ scrollTop: 0 }, 300);
        });
    }

    thisObj.closeModal = function () {
        modal.hide(200, function () {
            thisObj.resetForm();
            stateStore.val("");
            blackout.fadeOut(200);
        });
    }

    thisObj.resetForm = function () {
        var enquiryFormContainer = jQuery('#EnquiryFormContainer'),
            processPaymentContainer = jQuery('#processPaymentContainer'),
            customValidatorTerms = jQuery("#CustomValidatorTerms");

        customValidatorTerms.hide();

        jQuery('#Postcode').val(cookie("UsersPostcode"));

        enquiryFormContainer
            .find('#DropDownListTitle option:first')
            .attr('selected', 'selected')
            .end()
            .find('input')
            .val('');

        jQuery('.basicContent')
            .find('.hasError')
            .removeClass('hasError')
            .find('.errorMessage')
            .removeAttr('style');

        contactForm.removeClass('hidden');

        if (processPaymentContainer.css('display') !== 'none') {
            processPaymentContainer.find('#CheckboxTermsAndConditions').prop('checked', false);
        }

        thisObj.resetFeedback();
    }

    thisObj.resetFeedback = function () {
        contactFormFeedback.find('.titleContent').html('')
            .find('.subContent').html('');

        contactFormFeedback.data('showform', false);

        enquiryFeedbackHeader.hide();

        jQuery('.referal').remove();
    };
}

function getVehicleStatusACMContentAttribute(enumValue) {
    return getEnum(VehicleStatus, enumValue, 'ACMContent');
};

function createEnquiryFeedbackButton(requestReferer, contentContainer, feedbackMessage) {
    var html = '<a class="button referal" href="' + requestReferer + '">' + feedbackMessage + '</a>';
    contentContainer.append(html);
}

//  Shows and hides the left column
function hideNavColumn(trigger, hidden, visibleClass) {

    var menuModifier = false,
        visibleSidebar = 'hasVisibleSidebar';

    if (trigger != undefined && hidden != undefined && visibleClass != undefined) {
        menuModifier = true,
            visibleSidebar = visibleClass;
    }

    var showButton = ((menuModifier) ? trigger : jQuery('#showColumn')),
        showStatus = showButton.next(),
        globalForm = jQuery('body'),
        menu = ((menuModifier) ? hidden : globalForm.find('.column').filter('.column1')),
        menuToolbar = menu.children('.menuToolbar'),
        blackout = jQuery('.blackout');

    if (!blackout.length) {
        jQuery('body').append('<div class="blackout"></div>');
        blackout = jQuery('.blackout')
    }

    jQuery(window).on('resize orientationchange', function () {
        if (showStatus.val() === 'open') {
            globalForm.height(jQuery(window).outerHeight());
        }
    });

    if (showStatus.val() === 'open') {

        globalForm
            .addClass(visibleSidebar)
            .height(jQuery(window).outerHeight());

        blackout.addClass('blackout--visible');

    }

    showButton.on('click', function () {

        globalForm
            .addClass(visibleSidebar)
            .height(jQuery(window).outerHeight());

        blackout.addClass('blackout--visible');

        showStatus.val('open');

        return false;

    });

    menuToolbar.on('click', '.hideColumn', function () {

        jQuery('body')
            .removeClass(visibleSidebar)
            .removeAttr('style');

        blackout.removeClass('blackout--visible').removeAttr('style');

        showStatus.val('');

        return false;
    })

}

var financeDataLevelEnum = {
    All: 0,
    MonthlyOnly: 1
};
//  Initialises the Ajax for the finance information
function initFinance(divFinanceDetails, financeDataLevel) {

    var thisObj = this;

    thisObj.load = function () {

        divFinanceDetails.each(function (index) {

            var vehicle = jQuery(this),
                capCode = vehicle.data('capcode'),
                annualMileage = vehicle.data('annualmileage'),
                startMileage = vehicle.data('startmileage'),
                deposit = vehicle.data('deposit'),
                term = vehicle.data('term'),
                price = vehicle.data('price'),
                supplierID = vehicle.data('supplierid'),
                regYear = vehicle.data('regyear'),
                regPlate = vehicle.data('regplate'),
                plusVAT = vehicle.data('plusvat'),
                vehIndex = vehicle.data('index'),
                vehicleAge = vehicle.data('vehicleage'),
                financeType = vehicle.data('financetype');

            switch (Number(financeDataLevel)) {

                case financeDataLevelEnum.MonthlyOnly:
                    thisObj.getMonthlyFinanceInfo(capCode, annualMileage, startMileage, deposit, term, price, supplierID, regYear, regPlate, plusVAT, vehIndex, vehicleAge, financeType);
                    break;
                case financeDataLevelEnum.All:
                    thisObj.getFinanceInfo(capCode, annualMileage, startMileage, deposit, term, price, supplierID, regYear, regPlate, plusVAT, vehIndex, vehicleAge, financeType);
                    break;
            }
        });
    }

    thisObj.getFinanceInfo = function (CapCode, AnnualMileage, StartMileage, Deposit, Term, Price, SupplierID, RegYear, RegPlate, PlusVAT, Index, VehicleAge, FinanceType) {

        jQuery.ajax({
            type: 'POST', url: '/Services/GetFinanceInfo.asmx/GetFinanceInformationForVehicle',
            data: "{ 'CapCode': '" + CapCode + "', 'AnnualMileage': '" + AnnualMileage + "', 'StartMileage': '" + StartMileage + "', 'Deposit': '" + Deposit + "', 'Term': '" + Term + "', 'Price': '" + Price + "', 'SupplierID': '" + SupplierID + "', 'RegYear': '" + RegYear + "', 'RegPlate': '" + RegPlate + "', 'PlusVAT': '" + PlusVAT + "' , 'VehicleAge' : '" + VehicleAge + "', 'FinanceType': '" + FinanceType + "'}",
            dataType: "json",
            contentType: "application/json",
            global: false,
            success: function (msg) {
                thisObj.displayFinanceDetails(msg, "financeDetails", Index);
            },
            error: function (xhr, error) {
            }
        });
    }

    thisObj.getMonthlyFinanceInfo = function (CapCode, AnnualMileage, StartMileage, Deposit, Term, Price, SupplierID, RegYear, RegPlate, PlusVAT, Index, VehicleAge, FinanceType) {

        jQuery.ajax({
            type: 'POST', url: '/Services/GetFinanceInfo.asmx/GetFinanceMonthlyRepaymentInformationForVehicle',
            data: "{ 'CapCode': '" + CapCode + "', 'AnnualMileage': '" + AnnualMileage + "', 'StartMileage': '" + StartMileage + "', 'Deposit': '" + Deposit + "', 'Term': '" + Term + "', 'Price': '" + Price + "', 'SupplierID': '" + SupplierID + "', 'RegYear': '" + RegYear + "', 'RegPlate': '" + RegPlate + "', 'PlusVAT': '" + PlusVAT + "' , 'VehicleAge' : '" + VehicleAge + "', 'FinanceType': '" + FinanceType + "'}",
            dataType: "json",
            contentType: "application/json",
            global: false,
            success: function (msg) {
                thisObj.displayMonthlyFinance(msg, "monthlyfinance", Index);
            },
            error: function (xhr, error) {
            }
        });
    }

    thisObj.displayFinanceDetails = function (json, className, Index) {

        try {
            var financeData = json.d,
                financeContainer = jQuery('div.' + className + Index),
                calculatorContainer = jQuery("#calculator"),
                noFinanceDataMessage = jQuery("#noFinanceDataMessage"),
                keys,
                financeType;

            for (var item = 0; item < financeData.length; item++) {
                keys = GetFinanceKeys(financeData[item]);
                if (financeData[item].Error == null) {
                    financeType = financeData[item].Name;
                    for (var key = 0; key < keys.length; key++) {
                        financeContainer.find("." + keys[key]).text(financeData[item][keys[key]]);
                    }
                }
                else {
                    financeContainer.hide();
                    noFinanceDataMessage.removeClass('isHidden');
                    calculatorContainer.addClass('noData');
                }
            }
            if (typeof financeType != "undefined") {
                jQuery('#' + financeType + 'LiteralModalHeader').show();
                jQuery('#' + financeType + 'LiteralModalContent').show();
                jQuery('#' + financeType + 'LastPayment').show();
            }

            financeContainer.find('.financePanel').show();

            if (financeData.length > 0) {
                financeContainer.removeClass("loading").find("#loadingTab").hide().end();
                jQuery("#calculator").fadeIn(250);
            }
        }
        catch (err) {
            return "";
        }
    }

    thisObj.displayMonthlyFinance = function (json, className, Index) {

        try {
            var financeData = json.d,
                financeContainer = jQuery('div.' + className + Index),
                enquiryFormFinanceContainer = jQuery('.vehicleDetailsControl .monthlyfinance');

            if (financeData.length > 0 && financeData[0].Error == null && financeData[0].RegularMonthlyPayments != null) {
                financeContainer.find("." + 'RegularMonthlyPayments').text(financeData[0].RegularMonthlyPayments);
                financeContainer.removeClass("loading").find("span.financePerMonth").removeClass("isHidden").end();
                if (enquiryFormFinanceContainer.length) {
                    enquiryFormFinanceContainer.show();
                    enquiryFormFinanceContainer.find('.price').text(financeData[0].RegularMonthlyPayments);
                    jQuery('.financeRequired').removeClass('isHidden');
                }
                else {
                    jQuery('.financeNotRequired').removeClass('isHidden');
                }

                if (jQuery('.faq_question').not('.isHidden').length == 0) {
                    jQuery('.faq').hide();
                }
            }
            else {
                financeContainer.hide().parent().filter('.monthlyPayment').hide();
                if (enquiryFormFinanceContainer.length) {
                    enquiryFormFinanceContainer.hide();
                }
            }

            financeContainer.find('.financePanel').show();
        }
        catch (err) {
            return "";
        }
    }
    function GetFinanceKeys(object) {
        var keys = new Array();
        for (var key in object) {
            if (key != "__type") {
                keys.push(key);
            }
        }
        return keys;
    }
}

//  Initialise the twitter scrolling ticker
function initTwitterScroller(tickerObj, speed, imgSize) {

    if (tickerObj.length > 0) {

        if (typeof speed === "undefined" || typeof speed != "number") {
            var speed = 6000;
        }

        var count = tickerObj.data('count'),
            screenName = tickerObj.data('screenname');

        tickerObj.tweet({

            username: screenName,
            page: 1,
            avatar_size: imgSize,
            count: count,
            loading_text: "loading ..."

        }).on("loaded", function () {

            var ul = tickerObj.find(".tweet_list").find('li:gt(0)').hide().end(),
                toolbars = ul.find(".toolbar");

            ticker = function () {

                setTimeout(function () {

                    toolbars.fadeOut(250, function () {

                        ul.find('li:first').fadeOut(500, function () {

                            jQuery(this).next().fadeIn(500, function () {

                                toolbars.fadeIn(250);

                            }).end().detach().appendTo(ul).removeAttr('style').hide();

                        });
                    });
                    ticker();
                }, speed);
            };
            ticker();


            !function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (!d.getElementById(id)) {
                    js = d.createElement(s); js.id = id; js.src = "//platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
                }
            }
                (document, "script", "twitter-wjs");

        });
    }
}

//  Changes select lists with a class of replace
function changeSelects(selects) {

    var thisObj = this,
        z = 9999,
        speed = 0;

    thisObj.load = function () {

        if (selects.length > 0) {

            selects.each(function () {

                z--; // ---- Makes sure each subsequent dropdown has a lower z-index value so that when the menu drops down it doesn't overlap

                var thisSelect = jQuery(this),
                    thisDropDown = thisSelect.wrap('<div class="select ' + thisSelect.attr("class") + '">').parent().css('zIndex', z).prepend('<div class="trigger"><a href="#"></a><span class="arrow"></span></div><ul class="options"></ul>'),
                    ddTrigger = thisDropDown.children(":first-child"), //This is what opens the list
                    ddOptions = ddTrigger.next().hide(); //This is the ul that contains the list items

                thisObj.bindList(thisSelect, thisDropDown, ddTrigger, ddOptions);
            });
        }
    };

    thisObj.bindList = function (thisSelect, thisDropDown, ddTrigger, ddOptions) {

        if (thisDropDown === undefined && ddTrigger === undefined && ddOptions === undefined) {

            var thisDropDown = thisSelect.parent(),
                ddTrigger = thisDropDown.children(":first-child"),
                ddOptions = thisDropDown.children(".options").children().remove().end();
        }

        var thisSelectOptions = thisSelect.children('option'),
            thisSelectDisabled = (thisSelect.attr("disabled") === "disabled"),
            ddTriggerText = ddTrigger.children("a"),
            listItemsToInsert = "",
            listHeight = ddOptions.outerHeight(),
            scrollBarWidth,
            i = 0;

        thisSelectOptions.each(function () {

            var thisOption = jQuery(this),
                thisOptionText = thisOption.text(),
                thisOptionValue = thisOption.attr("value");

            if (jQuery(this).is(":selected")) {

                ddTriggerText.text(thisOptionText).attr("title", thisOptionText);
                listItemsToInsert += '<li class="current" data-value="' + thisOptionValue + '"><a href="#"><span>' + thisOptionText + '</span></a></li>';

            } else {

                if (i === 0) {
                    ddTriggerText.text(thisOptionText).attr("title", thisOptionText);
                }
                listItemsToInsert += '<li data-value="' + thisOptionValue + '"><a href="#"><span>' + thisOptionText + '</span></a></li>';

            }

            i++;
        });

        jQuery(listItemsToInsert).appendTo(ddOptions);

        if (listHeight > ddOptions.height()) {
            scrollBarWidth = 17;
        } else {
            scrollBarWidth = 0;
        }

        if (thisSelectDisabled) {

            thisDropDown.addClass("disabled");

            ddTrigger.off("click").on("click", function () {

                return false;

            });

        } else {

            var listOptions = ddOptions.children();

            thisDropDown.removeClass("disabled");

            ddTrigger.off("click").on("click", function (e) {

                e.stopPropagation();

                // ---- if the selected class IS NOT present

                if (!thisDropDown.hasClass("open")) {

                    // ---- check the position of the select list, if it goes off the page then change the default position
                    ddOptions.css({
                        "top": (ddTrigger.innerHeight()) + "px",
                        "min-width": ddTrigger.innerWidth()
                    });

                    jQuery(".select").removeClass("open").children(".options").hide(); // close all other open lists

                    thisDropDown.addClass("open");

                    ddOptions.stop(true, true).show(speed, function () {

                        thisObj.scrollList(ddOptions.children(".current"), ddOptions);

                        jQuery(document).off("click").off("keydown").on({
                            click: function () {
                                thisObj.closeOptions(ddOptions, thisDropDown);
                            },
                            keydown: function (keyDownEvent) {

                                keyDownEvent.preventDefault(); //Prevents page from scrolling when the up arrow is pressed

                                var currentItem;

                                if (keyDownEvent.keyCode === 27) { // Capture Esc key 27

                                    thisObj.closeOptions(ddOptions, thisDropDown);

                                } else if (keyDownEvent.keyCode === 13) { // Capture enter key 13

                                    thisSelect.trigger("change");
                                    thisObj.closeOptions(ddOptions, thisDropDown);

                                } else if (keyDownEvent.keyCode === 38) { // Capture Arrow Up key 38

                                    currentItem = ddOptions.children("li.current:not(:first-child)").removeClass("current").prev().addClass("current");

                                    if (currentItem.length > 0) {

                                        currentItemText = currentItem.text();
                                        thisSelect.val(currentItem.data("value"));
                                        ddTriggerText.text(currentItemText).attr("title", currentItemText);
                                        thisObj.scrollList(currentItem, ddOptions);

                                    }

                                } else if (keyDownEvent.keyCode === 40) { // Capture Arrow Down key 40

                                    currentItem = ddOptions.children("li.current:not(:last-child)").removeClass("current").next().addClass("current");

                                    if (currentItem.length > 0) {

                                        currentItemText = currentItem.text();
                                        thisSelect.val(currentItem.data("value"));
                                        ddTriggerText.text(currentItemText).attr("title", currentItemText);
                                        thisObj.scrollList(currentItem, ddOptions);

                                    }
                                }
                            }
                        });

                        ddOptions.on("click", function (e) {
                            e.stopPropagation();
                        });

                        // ---- Add keyboard support: esc closes, up and down move through the options and enter selects the option

                    });

                } else {

                    thisObj.closeOptions(ddOptions, thisDropDown);

                }

                return false;
            });

            ddOptions.off("click").on("click", "a", function () {

                var currentItemTrigger = jQuery(this),
                    currentItem = currentItemTrigger.parent(),
                    currentItemText = currentItemTrigger.text();

                thisSelect.val(currentItem.data("value")).trigger("change");

                ddTriggerText.text(currentItemText).attr("title", currentItemText);

                currentItem.addClass("current").siblings().removeClass("current");

                thisObj.closeOptions(ddOptions, thisDropDown);

                return false;
            });
        }
    };

    thisObj.changeSelected = function (selectedOption) {

        var selectOptions = selectedOption.siblings().removeAttr("selected").addBack(),
            ddOptions = selectedOption.parent().prev(),
            thisListItem = ddOptions.prev().children(":first"),
            listOptions = ddOptions.children().removeClass("current");

        thisListItem.text(selectedOption.text());

        listOptions.filter(":eq(" + selectOptions.index(selectedOption) + ")").addClass("current");

        selectedOption.parent().val(selectedOption.attr("value"));

    };

    thisObj.scrollList = function (currentItem, ddOptions) {

        currentItem = jQuery(currentItem);

        var firstItemTop = currentItem.parent().find("li").eq(0).position().top,
            currentItemTop = currentItem.position().top;

        ddOptions.scrollTop(Math.abs(firstItemTop) + currentItemTop);

    };

    thisObj.closeOptions = function (ddOptions, thisDropDown) {

        ddOptions.hide(speed);
        thisDropDown.removeClass("open");
        jQuery(document).off("click").off("keydown");

    };
}

//  Initialises the tiles on the homepage and other places
function initIsotope(container, masonryObj, columnSize) {

    // modified Isotope methods for gutters in masonry
    $.Isotope.prototype._getMasonryGutterColumns = function () {
        var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
        containerWidth = this.element.width();

        this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
            // or use the size of the first item
            this.$filteredAtoms.outerWidth(true) ||
            // if there's no items, use size of container
            containerWidth;

        this.masonry.columnWidth += gutter;
        this.masonry.cols = Math.floor((containerWidth + gutter) / this.masonry.columnWidth);
        this.masonry.cols = Math.max(this.masonry.cols, 1);
    };

    $.Isotope.prototype._masonryReset = function () {
        // layout-specific props
        this.masonry = {};
        // FIXME shouldn't have to call this again
        this._getMasonryGutterColumns();
        var i = this.masonry.cols;
        this.masonry.colYs = [];
        while (i--) {
            this.masonry.colYs.push(0);
        }
    };

    $.Isotope.prototype._masonryResizeChanged = function () {
        var prevSegments = this.masonry.cols;
        // update cols/rows
        this._getMasonryGutterColumns();
        // return if updated cols/rows is not equal to previous
        return (this.masonry.cols !== prevSegments);
    };

    jQuery(window).on("load", function () {

        if (typeof columnSize === "undefined") {
            columnSize = 155;
        }

        container.isotope({
            itemSelector: masonryObj,
            masonry: {
                columnWidth: parseInt(columnSize),
                gutterWidth: 10
            }
        });
    });
}

//  Applies to the homepage only
function showHideLoading() {

    var loader = jQuery("#loader").show();

    jQuery(window).on("load", function () {
        loader.fadeOut(250);
    });
}

function initFollowMe(followMe, column) {

    if (followMe.offset() !== "undefined" && followMe.is(':visible')) {
        var followMeOffset = followMe.offset().top;

        jQuery(window).on("scroll", function () {

            var topValue = jQuery(window).scrollTop();

            if (followMeOffset < topValue) {

                if (topValue >= (column.offset().top + column.outerHeight()) - followMe.outerHeight()) {
                    followMe.css({
                        "position": "absolute",
                        "top": column.outerHeight() - followMe.outerHeight(),
                        "left": "0"
                    }).removeClass('floating');
                } else {
                    followMe.css({
                        "position": "fixed",
                        "top": "0",
                        "left": "0"
                    }).addClass('floating');
                }
            } else {
                followMe
                    .removeAttr("style")
                    .removeClass('floating');
            }

        });
    }
}

//  Fixes problems with standard .NET field validators and allows them to have customised markup
function validatorUpdateDisplay(val) {

    jQuery(val).removeAttr("style").hide().removeClass("invalid");

    if (typeof (val.display) == "string") {

        if (val.display == "None") {
            return;
        }
        if (val.display == "Dynamic") {

            if (val.isvalid && !jQuery(val).siblings(".field").hasClass("invalid")) {

                jQuery(val).siblings(".field").removeClass("invalid");

            } else {

                jQuery(val).siblings(".field").addClass("invalid");

            }
            return;
        }
    }
}

// Error message custom visibility
function customErrorMessageDisplay(element, displayValue) {

    var fieldRow = element.closest('.fieldRow'),
        errorMessage = fieldRow.find('.error');

    //if (fieldRow.hasClass('hasError') && errorMessage.css('display') === 'inline') {

    errorMessage
        .siblings('.label')
        .addClass('isHidden')
        .end()
        .css('display', displayValue);

    setTimeout(function () {
        fieldRow.addClass('hasError');
    }, 1)
    //}
}

// Sets up tiles
function tileInitialiser() {

    var thisObj = this;

    thisObj.setUp = function () {

        var tiles = jQuery('.tile');

        tiles.each(function () {

            var thisTile = jQuery(this),
                nestedButton = thisTile.find('.button'),
                gtmElement = thisTile, // This is the element that the GTM event will be fired from
                pageNameField = thisTile.find("[id*='HiddenFieldPageName']"),
                tileNameField = thisTile.find("[id*='HiddenFieldTileName']");

            if (typeof (nestedButton) !== 'undefined' && nestedButton.length > 0) {

                // If there is a nested button we want that to fire the GTM event rather than
                // the main tile
                gtmElement = nestedButton;

            }

            gtmElement.on('click', function () {

                if (typeof (pageNameField.val()) !== 'undefined' && pageNameField.val() !== ''
                    && typeof (tileNameField.val()) !== 'undefined' && tileNameField.val() !== '') {

                    new googleTagManagerUtilities().pushData('Tile', pageNameField.val(), tileNameField.val(), 'click');

                }
            });
        });
    }
}

//  Sets up the AJAX for the vehicle search tile. Applies to the homepage only
function initVehicleSearchTile(replaceSelects) {

    var thisObj = this,
        filterContainer = jQuery("#FilterContainer"),
        tiles = filterContainer.find(".carStyles").find("a"),
        make = replaceSelects.find("select.make"),
        model = replaceSelects.find("select.model"),
        minPrice = replaceSelects.find("select.minPrice"),
        maxPrice = replaceSelects.find("select.maxPrice"),
        postCode = replaceSelects.find(".vehicleSearchPostcode"),
        postCodeFieldValue = cookie("UsersPostcode"),
        changeMade, modelSelected;

    thisObj.load = function () {

        if (replaceSelects.length > 0) {

            postCode.val(postCodeFieldValue);

            make.add(model).add(minPrice).add(maxPrice).on("change", function (e) {

                e.preventDefault();

                var thisSelect = jQuery(this),
                    thisSelectVal = parseInt(thisSelect.val());

                changeMade = thisSelect.attr("class");

                thisSelect.children(":selected").attr("selected", "selected").siblings().removeAttr("selected");

                modelSelected = model.val();

                //Make needs to clear other filters also
                if (thisSelect.hasClass("make")) {
                    thisObj.ClearModelAndPrice();
                }

                if (thisSelect.hasClass("minPrice") && thisSelectVal >= parseInt(maxPrice.val())) {

                    var valueChanged = false;

                    maxPrice.children().not(":first").each(function () {

                        var thisOptionValue = jQuery(this).removeAttr("selected").attr("value");

                        if (parseInt(thisOptionValue) > thisSelectVal && valueChanged === false) {

                            valueChanged = true;
                            maxPrice.val(thisOptionValue).children(":selected").attr("selected", "selected");

                            new changeSelects().changeSelected(jQuery(this));

                        }
                    });
                }

                if (thisSelect.hasClass("maxPrice") && thisSelectVal <= parseInt(minPrice.val())) {

                    minPrice.children().not(":first").each(function () {

                        var valueChanged = false;

                        var thisOptionValue = jQuery(this).removeAttr("selected").attr("value");

                        if (parseInt(thisOptionValue) < thisSelectVal && valueChanged === false) {

                            minPrice.val(thisOptionValue).children(":selected").attr("selected", "selected");
                            valueChanged = true;

                            new changeSelects().changeSelected(jQuery(this));

                        }
                    });
                }

                var carTypes = thisObj.CreateCarTypeList();

                thisObj.InitialiseWebServiceCall(carTypes, thisSelect);
            });

            if (make.find('option:selected').text() != 'Choose a make&hellip;') {

                make.change();

            }

            tiles.on("click", function (e) {
                e.preventDefault();

                var thisTile = jQuery(this).parent();

                if (thisTile.hasClass("disabled")) {
                    return;
                }
                changeMade = "cartype";

                var carTypes = null;

                if (thisTile.hasClass("selected")) {
                    thisTile.removeClass("selected");
                }
                else {
                    thisTile.addClass("selected");
                }

                //Need to keep models for profile
                modelSelected = model.val();

                carTypes = thisObj.CreateCarTypeList();

                thisObj.InitialiseWebServiceCall(carTypes);

            });

            replaceSelects.on("click", ".search", function (e) {
                e.preventDefault();

                var gtmUtilities = new googleTagManagerUtilities();

                if (postCode.length) {
                    if (!ValidateField(postCode.val(), postCode.data("fieldtype"))) {
                        replaceSelects.find("#errorPostcode").removeClass("isHidden");
                        return;
                    }
                }

                cookie("UsersPostcode", postCode.val(), 90);
                cookie("KeepFilters", "true");
                cookie("Page", "0");

                if (typeof dataLayer !== 'undefined') {

                    var selectedMake = make.val(),
                        selectedModel = model.val(),
                        selectedMinPrice = minPrice.val(),
                        selectedMaxPrice = maxPrice.val();

                    jQuery.each(tiles, function (index) {
                        var thisTile = jQuery(this);
                        if (thisTile.parent().hasClass("selected")) {

                            gtmUtilities.pushData('Tile', 'Vehicle Search - Vehicle Type', thisTile.children('span').text(), 'click');

                        }
                    });

                    if (selectedMake !== '') {
                        var selectedMakeModel = selectedMake;
                        if (selectedModel !== '') {
                            selectedMakeModel += ' ' + selectedModel;
                        }

                        gtmUtilities.pushData('Tile', 'Vehicle Search - Make Model', selectedMakeModel, 'click');

                    }

                    if (selectedMinPrice !== "0" || selectedMaxPrice !== "9999999") {

                        gtmUtilities.pushData('Tile', 'Vehicle Search - Price Range', selectedMinPrice + " - " + selectedMaxPrice, 'click');

                    }

                    if (selectedMake === '' && selectedMinPrice === "0" && selectedMaxPrice === "9999999") {

                        gtmUtilities.pushData('Tile', 'Vehicle Search', '', 'click');
                    }
                }

                window.location.href = "/search/";
            });
        }
    }

    thisObj.ValidatePostcode = function (postcodeValue) {

        if (postcodeValue != "") {
            var regExp = new RegExp("^([a-zA-Z][0-9][a-zA-Z]?|[a-zA-Z][0-9]{1,2}|[a-zA-Z][a-zA-Z][0-9]{1,2}|[a-zA-Z][a-zA-Z][0-9][a-zA-Z]) ?[0-9][a-zA-Z]{2}$"),
                test = regExp.test(postcodeValue);

            if (!test) {
                //Display error for postcode fields
                replaceSelects.find("#errorPostcode").removeClass("isHidden");
                return false;
            }
        }

        return true;
    }

    thisObj.CreateCarTypeList = function () {
        var vehicleType = jQuery('#HiddenVehicleType');

        if (vehicleType.val().length > 0) {
            return vehicleType.val();
        }
        else {
            if (tiles.length > 0) {
                return tiles.parent().filter(".selected").map(function () {
                    return jQuery(this).data().style;
                }).get().join("|");
            }
        }
    }

    thisObj.ClearModelAndPrice = function () {
        model.val("");
        minPrice.val("");
        maxPrice.val("");
    }

    thisObj.InitialiseWebServiceCall = function (carType, domEle) {
        var methodName = "";
        if (domEle != null) {
            if (domEle.hasClass("make")) {
                if (tiles.length > 0) {
                    methodName = "CarType";
                }
                thisObj.DistinctWebServiceCall(methodName + ",Models,Prices", carType);
            }

            if (domEle.hasClass("model")) {
                if (tiles.length > 0) {
                    methodName = "CarType";
                }
                thisObj.DistinctWebServiceCall(methodName + ",Prices", carType);
            }

            if (domEle.hasClass("minPrice") || domEle.hasClass("maxPrice")) {
                methodName = "Makes";
                if (tiles.length > 0) {
                    methodName += ",CarType";
                }
                thisObj.DistinctWebServiceCall(methodName + ",Models", carType);
            }
        }
        else {
            methodName = "Makes";
            if (tiles.length > 0) {
                methodName += ",CarType";
            }
            methodName += ",Models";
            thisObj.DistinctWebServiceCall(methodName + ",Prices", carType);
        }

        cookie("UsersPostcode", postCode.val(), 90);
    }

    thisObj.DistinctWebServiceCall = function (methodName, carType) {

        var postCodeVal = postCode.val(),
            makeSelected = make.val(),
            modelSelected = model.val(),
            minPriceSelected = minPrice.length > 0 ? minPrice.val() : "undefined",
            maxPriceSelected = maxPrice.length > 0 ? maxPrice.val() : "undefined";

        if (makeSelected == "undefined" || makeSelected == null) {
            makeSelected = "";
        }

        if (modelSelected == "undefined" || modelSelected == null) {
            modelSelected = "";
        }

        if (minPriceSelected == "undefined" || minPriceSelected == null) {
            minPriceSelected = "";
        }

        if (maxPriceSelected == "undefined" || maxPriceSelected == null) {
            maxPriceSelected = "";
        }

        if (typeof (carType) == "undefined" || carType == null) {
            carType = "";
        }

        if (methodName == "Models") {
            modelSelected = "";
        }

        var ajaxData = '{"MinPrice":"' + minPriceSelected + '",' + '"MaxPrice":"' + maxPriceSelected + '",' + '"Make":"' + makeSelected + '",' + '"Model":"' + modelSelected + '",' + '"Postcode":"' + postCodeVal + '",' + '"CarType":"' + carType + '",' + '"MethodName":"' + methodName + '"}';

        jQuery.ajax({
            type: "POST",
            url: "/services/distinctvalues.asmx/GetDistinctValues",
            data: ajaxData,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            global: false,
            success: function (msg) {
                //received html from server
                thisObj.DistinctResponseCallbacks(msg.d);
            }
        });
    }

    thisObj.DistinctResponseCallbacks = function (data) {
        var vehicleCount = -1;
        var methodName;
        var distinctValueList;

        var formattedVehicleCount = '0';

        var displayVehicleCount = function () {
            var searchResultsCount = jQuery("[id*='SearchResultsCount']"),
                vehiclesText = jQuery("[id*='LabelVehiclesText']");

            searchResultsCount.text(formattedVehicleCount);
            if (vehicleCount == 1) {
                vehiclesText.text(' vehicle matches');
            } else {
                vehiclesText.text(' vehicles match');
            }
        };

        jQuery.each(data, function (index, groupedDistinctValue) {
            methodName = groupedDistinctValue.DistinctValueType;
            distinctValueList = groupedDistinctValue.DistinctValueList;
            vehicleCount = groupedDistinctValue.TotalCount;
            formattedVehicleCount = groupedDistinctValue.FormattedTotalCount;

            switch (methodName) {
                case "CarType":
                    if (changeMade != "cartype") {
                        tiles.parent().addClass("disabled");
                    }

                    jQuery.each(distinctValueList, function (index, domEle) {
                        filterContainer.find("li[data-style='" + domEle.Value + "']").removeClass("disabled");
                    });

                    break;
                case "Makes":
                    var selectedValue = make.val();
                    if ((changeMade.indexOf("make") == -1 && changeMade.indexOf("model") == -1) && selectedValue == "") {
                        var makeOptionsToCreate = '<option value="">Choose a make&hellip;</option>';
                        jQuery.each(distinctValueList, function (index, domEle) {
                            makeOptionsToCreate += '<option value="' + domEle.Value + '">' + domEle.Value + '</option>';
                        });

                        make
                            .empty()
                            .append(makeOptionsToCreate)
                            .val(selectedValue);

                        new changeSelects().bindList(make);
                    }

                    var searchButton = jQuery('#ButtonSearch');

                    searchButton.removeClass("disabled")
                        .off('click', false);
                    displayVehicleCount();
                    if (vehicleCount == 0) {
                        searchButton.on('click', false)
                            .addClass('disabled');
                    }

                    break;
                case "Models":
                    if (modelSelected == "" || changeMade.indexOf("make") != -1 || changeMade == "cartype") {

                        var modelOptionsToAdd = '<option value="">Choose a model&hellip;</option>';
                        jQuery.each(distinctValueList, function (index, domEle) {
                            modelOptionsToAdd += '<option value="' + domEle.Value + '">' + domEle.Value + '</option>';
                        });

                        model
                            .empty()
                            .append(modelOptionsToAdd)
                            .val(modelSelected);

                        if (make.val() == "") {
                            model.prop("disabled", true);
                        }
                        else {
                            model.prop("disabled", false);
                        }

                        new changeSelects().bindList(model);
                    }
                    break;
                case "Prices":
                    if (changeMade.indexOf("minPrice") == -1 && changeMade.indexOf("maxPrice") == -1) {
                        //Min Price Update

                        var minPriceOptionsToAdd = '<option value="0">Min price (&pound;)</option>';
                        jQuery.each(distinctValueList, function (index, domEle) {
                            minPriceOptionsToAdd += '<option value="' + domEle.MinValue + '">' + domEle.MinValue + '</option>';
                        });

                        minPrice
                            .empty()
                            .append(minPriceOptionsToAdd)
                            .find("option:first-child")
                            .attr("selected", "selected");

                        //Max Price Update
                        var MaxPrices = "<option value='9999999'>Max price (&pound;)</option>",
                            maxValue;
                        jQuery.each(distinctValueList, function (index, domEle) {
                            MaxPrices += "<option value=" + domEle.MaxValue + ">" + domEle.MaxValue + "</option>";
                            if (index == jQuery(distinctValueList.DistinctValue).length - 1) {
                                maxValue = domEle.MaxValue;
                            }
                        });

                        MaxPrices = MaxPrices.replace("<option value=''>Max price (&pound;)</option>", "<option value='" + maxValue + "'>Max price (&pound;)</option>");
                        maxPrice
                            .empty()
                            .html(MaxPrices)
                            .find("option:first-child").attr("selected", "selected");

                        new changeSelects().bindList(minPrice);
                        new changeSelects().bindList(maxPrice);
                    }
                    break;
            }
        });

        if (vehicleCount > 0) {
            displayVehicleCount();
        }

    }
}

//  Cookie Popup
function initCookiePopup() {

    var thisObj = this,
        countContainer = jQuery("#autoHideCount");
    countdown = countContainer.text();

    jQuery("#ok").on("click", function () {
        thisObj.hidePopup();

        return false;
    });

    thisObj.setCountDown = function () {

        countdown = countdown - 1;

        if (countdown > 0) {
            countContainer.text(countdown);

        } else {
            thisObj.hidePopup();
        }
    }

    thisObj.hidePopup = function () {

        jQuery("#cookiePopup").fadeOut("250");


        clearInterval(counter);

    }

    var counter = setInterval(thisObj.setCountDown, 1000);
}

// Analytics Event tracking on filters
function usedFiltersEventTracking() {
    var filters = jQuery('.filterContainer[data-action]'),
        filterItems = filters.find('li').not('hasMenu'),
        controls = filterItems.children('input[type=checkbox]', 'label'),
        filterRange = filters.find('.range'),
        filterRangeButton = filterRange.find('.searchButton');

    controls.on('click', function (e) {
        if (!jQuery(this).closest('li').hasClass('isSelected')) { // Don't trigger event if the item is already selected
            e.stopPropagation();

            var thisLi = jQuery(this).closest('li'),
                category = 'Vehicle Search',
                action = thisLi.closest('.filterContainer').data('action'),
                data = thisLi.data(),
                label = [];

            for (x in data) { // Loop through data object and retrieve values
                if (data.hasOwnProperty(x)) {
                    label.push(data[x]);
                }
            }

            if (label.length > 1) { // If it's a 'make model' or 'cartype' or a 'range' filter
                if (typeof (data.make) !== 'undefined') {
                    label = label.join(' ');
                } else if (typeof (data.cartype) !== 'undefined') {
                    label = label[1];
                } else {
                    label = label.join(' - ');
                }
            } else {
                label = label.join('');
            }

            new googleTagManagerUtilities().pushData(category, action, label, 'click');

        }
    });

    filterRangeButton.on('click', function () {

        var thisButton = jQuery(this),
            action = thisButton.closest('.filterContainer').data('action'),
            range = thisButton.closest('.range'),
            selectDropdowns = range.find('select'),
            label = [];

        selectDropdowns.each(function () {// Retrieve selected values
            label.push(jQuery(this).val());
        });

        if (typeof label !== 'undefined' && label.length > 1) {
            label = label.join(' - ');
        }

        new googleTagManagerUtilities().pushData('Vehicle Search', action, label, 'click');
    });
}

//  Initialises the Product views on the buy page
function initProductViews() {

    var container = jQuery("#products").children(".sorting").find(".productViews"),
        views = container.children().children(),
        financeOpenSectionBtn = jQuery("#financeSectionHandler"),
        financeSortingHiddenDiv = financeOpenSectionBtn.next(),
        financeSortingCookieValue = cookie("financeSorting"),
        cookieValue = cookie("TileView"),
        productList = jQuery("#productList"),
        productView = jQuery("#productView"),
        productDetails = productList.find(".productHeader"),
        thisObj = this;

    thisObj.load = function () {

        if (cookieValue != undefined) {

            thisObj.setView(views.filter(":eq(" + cookieValue + ")"));
        }
        else {

            thisObj.setView(views.eq(0));
        }

        views.on("click", function () {

            thisObj.setView(jQuery(this));

            return false;

        });

        thisObj.financeSortingCookieHandler(financeSortingHiddenDiv, financeSortingCookieValue);

        financeOpenSectionBtn.on("click", function () {

            thisObj.financeSortingVisibility(financeSortingHiddenDiv);

            return false;
        });

        jQuery(window).on("resize", function () {

            if (productView.hasClass("tiles")) {

                productDetails
                    .matchDimensions("height")
                    .prev()
                    .children()
                    .children('.text')
                    .matchDimensions('height');

            }
        });
    }

    thisObj.setView = function (thisView) {

        productList.fadeOut(200, function () {

            cookie("TileView", views.removeClass("selected").index(thisView), 90);
            container.find("span:contains('" + thisView.text() + "')").parent().addClass("selected");
            productView.removeAttr("class").addClass(thisView.text().toLowerCase().replace(" ", ""));

            productList.fadeIn(200, function () {

                if (productView.hasClass("tiles")) {

                    productDetails
                        .matchDimensions("height")
                        .prev()
                        .children()
                        .children('.text')
                        .matchDimensions('height');

                } else {

                    productDetails
                        .removeAttr("style")
                        .prev()
                        .children()
                        .children('.text')
                        .removeAttr("style");

                }

                // Required for recalculating layout when MMC SlideUp is expanded
                new initMoveMeCloser().resizeHoldingContainer();
            });
        });
    }

    thisObj.financeSortingVisibility = function (hiddenSection) {
        var arrow = financeOpenSectionBtn.find("span");

        if (hiddenSection.hasClass("show")) {

            cookie("financeSorting", "0", 90);
            hiddenSection.removeClass("show");
            arrow.removeClass("arrowRightOpen").addClass("arrowRight");
        } else {

            cookie("financeSorting", "1", 90);
            hiddenSection.addClass("show");
            arrow.removeClass("arrowRight").addClass("arrowRightOpen");
        }
    }

    thisObj.financeSortingCookieHandler = function (hiddenSection, cookieValue) {
        var arrow = financeOpenSectionBtn.find("span");

        if (cookieValue == "1") {
            hiddenSection.addClass("show");
            arrow.removeClass("arrowRight").addClass("arrowRightOpen");
        } else {
            hiddenSection.removeClass("show");
            arrow.removeClass("arrowRightOpen").addClass("arrowRight");
        }
    }
}

// Wish List
function initWishList(wishList) {

    if (wishList.length) {

        var thisObj = this,
            productsToWishList = jQuery('#products'),
            wishListOverlay = productsToWishList.find('.wishListOverlay'),
            productContainer = wishList.find('.productContainer'),
            productLength = productContainer.find('.product').length,
            productArray = [],
            productWidth,
            currentThumb = 0,
            productsInLine = 0,
            isTouchDevice = ('ontouchstart' in document.documentElement) || navigator.msMaxTouchPoints > 0,
            regNumbers = [];

        thisObj.load = function () {

            jQuery(window).resize(function () {
                if (productContainer.find('.product').length) {

                    thisObj.scrollToProduct(0).getProductInLine();
                }
            });

            productsToWishList.find('.product').draggable({
                appendTo: 'body',
                helper: 'clone',
                zIndex: 10010,
                scroll: false
            });

            productContainer.droppable({
                tolerance: 'touch',
                activeClass: "ui-state-default",
                activate: function (event, ui) {

                    if (!wishList.hasClass('visible')) {
                        wishList.animate({ 'bottom': 0 }).removeClass('preview').addClass('visible');
                    }

                    jQuery(ui.helper).find('.productDetails').removeAttr('style');

                },
                deactivate: function (event, ui) {

                    if (!productContainer.find('.product').length) {
                        wishList.animate({ 'bottom': '-' + wishList.outerHeight() }).removeClass('visible');
                    }
                },
                drop: function (event, ui) {

                    thisObj.wishListHandler(ui.draggable, 'add').productCountHandler();
                }
            });

            wishListOverlay
                .on('click', '.add', function (e) {

                    thisObj.wishListHandler(jQuery(this).closest('.product'), 'add').productCountHandler();

                    return false;
                });

            wishList
                .on('mouseenter', function () {

                    jQuery('#viewAll').fadeIn(200);

                    if (productArray.length) {
                        wishList
                            .animate({ 'bottom': 0 })
                            .removeClass('preview')
                            .addClass('visible')
                            .find('#visibilityHandler')
                            .fadeIn(200);
                    }
                })
                .on('click', '#visibilityHandler', function () {
                    wishList
                        .animate({
                            'bottom': '-' + (wishList.outerHeight() - wishList.find('header').outerHeight())
                        }, 200, function () {
                            jQuery('#visibilityHandler').fadeOut(200);
                        })
                        .removeClass('visible')
                        .addClass('preview');

                    return false;
                })
                .on('click', '.remove', function (e) {

                    thisObj.wishListHandler(jQuery(this).closest('.product'), 'remove').productCountHandler();

                    return false;
                })
                .on('click', '.product a', function (e) {

                    var thisProduct = jQuery(this).parent();

                    e.preventDefault();

                    thisProduct
                        .find('.controls')
                        .animate({
                            'right': 0
                        }, 200, function () {
                            // This control
                            jQuery(this)
                                .closest('.product')
                                .siblings()
                                .find('.controls')
                                .animate({
                                    'right': '-100%'
                                }, 200); // All controls
                        });

                    return false;
                });

            // Product scrolling
            productContainer.prev().add(productContainer.next()).on('click', function () {

                var thisControl = jQuery(this),
                    nextSlide = (currentThumb + productsInLine) >= productLength ? productLength : currentThumb + productsInLine,
                    prevSlide = (currentThumb - productsInLine) < 0 ? null : currentThumb - productsInLine;

                if (thisControl.hasClass('prev')) {

                    thisObj.slideAnimationHandler("left", prevSlide === null, prevSlide);

                } else if (thisControl.hasClass('next')) {

                    thisObj.slideAnimationHandler("right", nextSlide === productLength, nextSlide);

                }

                return false;
            });

            if (isTouchDevice) {

                productContainer.hammer()
                    .on('swipe', function (e) {
                        var gestureDirection = e.gesture.direction,
                            nextSlide = (currentThumb + productsInLine) >= productLength ? productLength : currentThumb + productsInLine,
                            prevSlide = (currentThumb - productsInLine) < 0 ? null : currentThumb - productsInLine;

                        if (gestureDirection === 'left') {

                            thisObj.slideAnimationHandler("right", nextSlide === productLength, nextSlide);

                        } else if (gestureDirection === 'right') {

                            thisObj.slideAnimationHandler("left", prevSlide === null, prevSlide);

                        }

                    });
            }

        };

        thisObj.wishListHandler = function (thisProduct, action) {
            var productToWishList = thisProduct
                .clone()
                .removeAttr('style')
                .find('.wishListOverlay')
                .remove()
                .end()
                .find('.productDetails')
                .removeAttr('style')
                .end()
                .append('<div class="controls"><div class="column"><span class="button remove">Remove</span></div><div class="column"><span class="button view">View</span></div></div>'),
                productRegNumber = productToWishList.data('regnumber'),
                shortlistedProducts = wishList.find('.products');

            if (action === 'add') {
                productArray.push(productToWishList);

                shortlistedProducts.append(productArray);

                regNumbers.push(productRegNumber);

                cookie('regnumbers', regNumbers);// Set to session for development

                if (!wishList.hasClass('preview') && !wishList.hasClass('visible')) {
                    wishList
                        .animate({
                            'bottom': '-' + (wishList.outerHeight() - wishList.find('header').outerHeight())
                        })
                        .addClass('preview');
                }

                thisObj.productWidthHandler();

                thisProduct.draggable('disable').find('.wishListOverlay').hide();

            } else {
                var productIndex = jQuery.inArray(productRegNumber, regNumbers);

                productArray.splice(productIndex, 1);

                regNumbers.splice(productIndex, 1);

                if (regNumbers.length) {

                    cookie('regnumbers', regNumbers);// Set to session for development

                } else {

                    jQuery.removeCookie('regnumber');

                }

                thisObj.productWidthHandler();

                shortlistedProducts.empty().append(productArray);

                productsToWishList.find('.product[data-regnumber="' + productRegNumber + '"]').draggable('enable').find('.wishListOverlay').show();
            }

            productLength = productContainer.find('.product').length;

            return this;
        };

        thisObj.productCountHandler = function () {
            var productCount = jQuery('#productCount'),
                numberOfProducts = productContainer.find('.product').length;

            if (numberOfProducts) {

                productCount.text(numberOfProducts);
            } else {
                productCount.text(numberOfProducts);

                wishList
                    .animate({
                        'bottom': '-' + wishList.outerHeight()
                    }, 300)
                    .removeClass('preview')
                    .removeClass('visible');
            }

            return this;
        };

        thisObj.productWidthHandler = function () {

            var shortlistedProduct = productContainer.find('.product');

            productWidth = shortlistedProduct.filter(':first').width();

            productsInLine = Math.floor(productContainer.width() / productWidth);

            productContainer.find('.products').width(Math.round(productWidth * productArray.length + (shortlistedProduct.filter(':first').css('marginRight').replace('px', '') * shortlistedProduct.length)));

        };

        thisObj.getProductInLine = function () {

            productsInLine = Math.floor(productContainer.width() / productWidth);

            return this;

        }

        thisObj.scrollToProduct = function (thisThumb) {

            productContainer.stop(true, true).scrollTo(productContainer.find('.product').eq(thisThumb), 500);

            currentThumb = thisThumb;

            return this;
        };

        thisObj.slideAnimationHandler = function (direction, condition, control) {
            var cssProperty = direction,
                animationPropertyStart = {},
                animationPropertyEnd = {};

            animationPropertyStart[cssProperty] = 5;
            animationPropertyEnd[cssProperty] = 0;

            if (condition) {

                productContainer
                    .removeAttr('style')
                    .stop(true, true)
                    .animate(animationPropertyStart, 100)
                    .animate(animationPropertyEnd, 100)
                    .removeAttr('style');

            } else {

                thisObj.scrollToProduct(control);

            }

        };

    }

};

//  Initialises the Product comparison on the buy page (not yet fully implemented)
function initProductComparison() {

    var maxItems = 4,
        comparedItems = jQuery("#comparedItems"),
        comparisonBasket = jQuery("#comparisonBasket"),
        clearCompare = comparisonBasket.find(".clearCompare"),
        products = jQuery("#productList").find("li"),
        methods = {};

    methods.init = function () {

        products
            .draggable({
                appendTo: "body",
                helper: "clone",
                opacity: 0.95
            });

        comparedItems
            .droppable({
                activeClass: "ui-state-default",
                tolerance: "touch",
                over: function (event, ui) {

                    jQuery(this).addClass("hover");

                },
                out: function (event, ui) {

                    jQuery(this).removeClass("hover");

                },
                activate: function () {

                    comparisonBasket.fadeIn();

                },
                deactivate: function () {

                    var target = jQuery(this);

                    if (target.children("li").length == 0) {

                        comparisonBasket.fadeOut();

                    }
                },
                drop: function (event, ui) {

                    var target = jQuery(this),
                        targetLength = target.children("li").length;

                    if (targetLength >= 0 && targetLength < maxItems) {

                        clearCompare.show();

                        ui.helper.clone(false)
                            .removeClass('ui-draggable-dragging')
                            .removeAttr("style")
                            .appendTo(jQuery(this))
                            .find(".compareCount").text(target.children("li").length)
                            .end();

                        ui.draggable
                            .addClass("compared")
                            .draggable("disable")
                            .find(".compareCount").text(target.children("li").length);

                        if (target.children("li").length == maxItems) {

                            products
                                .draggable("disable")
                                .parent()
                                .addClass("maxReached");

                        }
                    }

                    target
                        .removeClass("hover");
                }
            });
    }

    methods.clear = function () {

        comparisonBasket
            .find(".clearCompare")
            .on("click", function () {

                comparedItems.empty();
                comparisonBasket.fadeOut(250);

                products
                    .removeClass("compared")
                    .draggable("enable")
                    .parent()
                    .removeClass("maxReached");

                return false;

            })
    }

    methods.init();
    methods.clear();
}

//Validate Field
function ValidateField(FieldValue, ValidationType) {

    if (ValidationType == "postcode" || ValidationType == "mandatoryPostcode") {
        if (FieldValue != "") {
            var regExp = new RegExp("^([a-zA-Z][0-9][a-zA-Z]?|[a-zA-Z][0-9]{1,2}|[a-zA-Z][a-zA-Z][0-9]{1,2}|[a-zA-Z][a-zA-Z][0-9][a-zA-Z]) ?[0-9][a-zA-Z]{2}$");
            return regExp.test(FieldValue);
        }
        if (ValidationType == "postcode") return true; else return false;
    }
}


function initModals(modals, dialogue, acceptEventHandler) {

    if (modals.length > 0) {

        var blackout = jQuery("#blackout"),
            container = jQuery(".container"),
            thisObj = this,
            methods = {

                init: function () {

                    modals.each(function () {

                        var thisModal = jQuery(this),
                            thisTrigger = thisModal.children(".trigger"),
                            thisDialogue,
                            thisState = thisModal.children("input");

                        if (dialogue) {

                            thisDialogue = dialogue;
                            thisState = dialogue.children("input[id=State]");
                        }
                        else {

                            thisDialogue = thisModal.children(".dialogue");
                            thisState = thisModal.children("input");
                        }

                        if (thisState.val() === "open") {

                            methods.openModal(thisModal, thisDialogue, thisState);

                        }

                        thisDialogue.find(".close").on("click", function () {

                            methods.closeModal(thisModal, thisDialogue, thisState);

                            return false;
                        });

                        thisTrigger.on("click", function () {

                            if (thisState.val() !== "open") {

                                if (dialogue) {

                                    thisObj.disjointModalTriggerHandler(jQuery(this), thisDialogue);

                                }

                                methods.openModal(thisModal, thisDialogue, thisState);

                            } else {

                                methods.closeModal(thisModal, thisDialogue, thisState);

                            }

                            return false;
                        });
                    });
                },

                openModal: function (thisModal, thisDialogue, thisState) {

                    thisState.val("open");

                    blackout.fadeIn(200, function () {
                        thisDialogue.show(200);

                        if (thisModal.hasClass('scrollToTop')) {
                            jQuery('html,body').animate({ scrollTop: 0 }, 300);
                        }
                    });

                    jQuery(document).on("click", function () {

                        methods.closeModal(thisModal, thisDialogue, thisState);
                    });

                    thisDialogue.on("click", function (e) {
                        e.stopPropagation();
                    });
                },

                closeModal: function (thisModal, thisDialogue, thisState) {

                    thisState.val("");

                    thisDialogue.hide(200, function () {
                        blackout.fadeOut(200);
                    });
                }
            }

        methods.init();

        thisObj.disjointModalTriggerHandler = function (trigger, dialogue) {

            var content = trigger.children("span[id*=MessageContentField]").text(),
                eventHandlerParameter = trigger.children("input[id*=EventHandlerParameters]").val(),
                titleContent = trigger.children("input[id*=MessageHeaderField]"),
                contentDiv = dialogue.find(".content"),
                eventHandlerParameters = dialogue.find("input[id=EventHandlerParameter]"),
                confirmButton = dialogue.find("#confirmButton");

            // add content to dialogue
            contentDiv.children(".MessageContentField").html(content);

            //add title to dialogue
            if (typeof (titleContent) !== "undefined" && titleContent.val() !== "") {
                dialogue.find(".headerText").text(titleContent.val());
            }

            // copy event handler parameters to the dialogue
            eventHandlerParameters.val(eventHandlerParameter);

            confirmButton.off('click');
            confirmButton.on('click', function () {
                eval(acceptEventHandler);
            });
        };
    }
}

function urlUtilities() {

    var thisObj = this;

    thisObj.redirectToUrl = function (url, target) {

        window.open(url, target);

    };
};

// Service Booking
function initServiceBooking(serviceBooking) {
    if (serviceBooking.length) {

        var thisObj = this,
            steps = serviceBooking.find('.steps'),
            stepContent = serviceBooking.find('.stepContent'),
            buttonHolder = jQuery('#formButtonHolder');

        // Vehicle Details Step
        thisObj.vehicleDetails = function () {

            thisObj.getCurrentLocation();

            var vehicleNotFoundContainer = jQuery("#vehicleNotFoundContainer"),
                numberPlateContainer = serviceBooking.find('#numberPlateContainer'),
                numberPlateInput = numberPlateContainer.find("input"),
                mileageInput = jQuery("#mileageContainer").find("input"),
                isVehicleFoundField = jQuery('#HiddenFieldVehicleFound');

            if (isVehicleFoundField.val() === 'False') {

                // Expand the vehicleNotFound section
                if (jQuery('#HiddenFieldAnimationState').val() === 'True') {
                    vehicleNotFoundContainer.slideDown(200);
                } else {
                    vehicleNotFoundContainer.show();
                }

                thisObj.progressWizard(numberPlateInput.data("class"), true, numberPlateInput);
                thisObj.progressWizard(mileageInput.data("class"), true, mileageInput);

                steps.find('.vehicleNotFound').slideDown(200);

                stepContent
                    .find('*[data-valid="required"]')
                    .each(function () {
                        //Need to check mutiple validators here as dynamic
                        var thisField = jQuery(this),
                            thisFieldValue = thisField.val(),
                            classValue = thisField.data("class");

                        if (thisFieldValue !== "" && thisFieldValue !== "0" && !thisField.is(":disabled")) {
                            thisObj.progressWizard(classValue, true, thisField);
                        }
                        else {
                            thisObj.progressWizard(classValue, false, thisField);
                        }
                    });

                jQuery("select[id*='DropDownListMake']").focus();

            } else {
                // Expand the vehicleFound section
                jQuery("#vehicleFoundContainer").slideDown(200);

                thisObj.progressWizard(numberPlateInput.data("class"), true, numberPlateInput);
                thisObj.progressWizard(mileageInput.data("class"), true, mileageInput);

                steps.find('.vehicleNotFound').slideUp(200);

                mileageInput.focus();

            }

            thisObj.inputRequired().selectRequired();

            jQuery('*[placeholder]').each(function () {
                thisInput = jQuery(this);
                var placeholder = thisInput.attr('placeholder');
                if (thisInput.val() === '') {
                    thisInput.val(placeholder);
                }
                thisInput.on({
                    focus: function () {
                        var inputOnFocus = jQuery(this);

                        if (inputOnFocus.val() === placeholder) {
                            this.plchldr = placeholder;
                            inputOnFocus.val('');
                        }
                    },
                    blur: function () {
                        var inputOnBlur = jQuery(this);

                        if (inputOnBlur.val() === '' && inputOnBlur.val() !== this.plchldr) {
                            inputOnBlur.val(this.plchldr);
                        }
                    }
                });
            });

            // Show vehicleFound section on Enter or Tab
            numberPlateContainer.on('keyup', 'input', function (e) {
                var registrationNumberValid = thisObj.validateRegistrationNumber();
                thisObj.progressWizard(jQuery(this).data("class"), registrationNumberValid);
            })
                .on('click', '.button', function () {
                    return thisObj.validateRegistrationNumber();
                });

            jQuery("#mileageContainer").on('keyup', 'input', function (e) {
                var isValid = thisObj.validateVehicleDetails();

                if (!isValid) {
                    Page_BlockSubmit = false;
                }
                return isValid;
            });

            buttonHolder.on('click', '.nextStep', function () {
                var isValid = thisObj.validateVehicleDetails();

                if (!isValid) {
                    Page_BlockSubmit = false;
                }
                return isValid;
            });
        };

        //call geo locations
        thisObj.getCurrentLocation = function () {
            var cookieLongitude = cookie("Longitude"),
                cookieLatitude = cookie("Latitude"),
                cookiePostcode = cookie("UsersPostcode");

            if (typeof (cookieLongitude) === 'undefined' || typeof (cookieLatitude) === 'undefined') {
                if (typeof (cookiePostcode) === 'undefined' || cookiePostcode === '') {
                    getGeolocation(thisObj.setCurrentLocationData, false);
                }
            }
        }

        //position handler for select dealer geolocations
        //call geo locations
        thisObj.setCurrentLocationData = function (data) {
            cookie("Longitude", data.coords.longitude);
            cookie("Latitude", data.coords.latitude);
        }

        thisObj.validateRegistrationNumber = function () {

            if (typeof (numberPlateInput) === 'undefined') {

                numberPlateInput = jQuery('#numberPlateContainer').find('input');
            }

            //Need to reset the value for IE7 as placeholder is unsupported
            if (typeof (numberPlateInput) !== 'undefined' && numberPlateInput.val() === numberPlateInput.attr("placeholder")) {
                numberPlateInput.val("");
            }
            return thisObj.highlightValidators(numberPlateContainer, "RegistrationNumber");
        };

        thisObj.validateVehicleDetails = function () {
            var validationGroup = jQuery('#RequiredFieldValidatorMileage').attr('validation-group');

            return thisObj.highlightValidators(jQuery("#vehicleDetailsArea"), validationGroup);
        };

        // Select Dealer Step
        thisObj.selectDealer = function () {
            var postcodeContainer = jQuery('#postcodeContainer'),
                selectDealer = jQuery('#selectDealer'),
                selectedDealer = jQuery('#TextBoxSelectedDealerID'),
                dealers = selectDealer.find('.dealer'),
                buttonHolderTop = jQuery('#formButtonHolderTop'),
                buttonHolderBottom = jQuery('#formButtonHolderBottom'),
                hasChildren = dealers.length > 0,
                viewMapLink = selectDealer.find(".viewMapLink").children(),
                mapModal = jQuery("#mapModal"),
                postcodeInput = jQuery('#TextBoxPostcode'),
                isDealerSelected = (typeof (selectedDealer) !== 'undefined' && selectedDealer.text() !== '')

            // If a postcode is already populated set it as completed in the progress indicator
            if (typeof (postcodeInput) !== 'undefined' && postcodeInput.val() !== '') {

                thisObj.progressWizard(postcodeInput.data('class'), true);

            }

            // If a dealer is already populated set it as completed in the progress indicator
            thisObj.progressWizard(selectDealer.data('class'), isDealerSelected);

            if (typeof (dealers) !== 'undefined') {

                initModals(jQuery(".modal"), mapModal);
                initModals(jQuery("#dealerRatingInformation"), null, null);

                dealers.on('click', '.selectDealerButton', function () {

                    var currentDealer = jQuery(this).parents('.dealer'),
                        currentDealerEditionFeedID = currentDealer.find("input[id*='HiddenFieldCurrentDealerEditionFeedID']"),
                        selectedDealer = jQuery('#TextBoxSelectedDealerID');

                    // Store the edition feed ID in the selected ID
                    selectedDealer.val(currentDealerEditionFeedID.val());

                    thisObj.highlightValidators(selectDealer.parent(), "SelectDealerGroup");

                    thisObj.toggleSelectedDealer(currentDealer);

                    return false;

                });

            }

            jQuery(window).on("resize orientationchange", function () {

                if (dealers.is(':visible')) {

                    dealers.matchDimensions("height");

                }

            });

            jQuery(viewMapLink).on('click', function (e) {

                var viewMap = jQuery(this),
                    Title = viewMap.closest(".vcard").find(".org").prop("title"),
                    Latitude = viewMap.next(),
                    Longitude = Latitude.next();

                mapModal.find("h3").html(Title);
                loadGoogleMaps(Latitude.val(), Longitude.val(), jQuery("#mapContent"));

            });

            // If there are dealers for a the users current location, show them
            if (hasChildren) {

                selectDealer.slideDown(200)
                    .find('.dealer')
                    .matchDimensions("height");

                jQuery('#formButtonHolderTop').addClass('top');

                // Check if there is a pinnacleeditionfeedid prepropulated and if so set a dealer with that value to selected
                if (typeof (selectedDealer) !== 'undefined' && selectedDealer.val() !== '') {

                    var dealers = jQuery('#UpdatePanelDealerSelection').find('.dealer');

                    dealers.each(function (index, value) {

                        var currentDealer = jQuery(value),
                            currentPinnacleDealerEditionFeedID = currentDealer.find("input[id*='HiddenFieldCurrentDealerEditionFeedID']"),
                            currentDealerSelectButton = currentDealer.find('.selectDealerButton');

                        if (currentPinnacleDealerEditionFeedID.val() === selectedDealer.val()) {

                            thisObj.toggleSelectedDealer(currentDealer);

                        }
                    });
                }
            }

            postcodeContainer.on('click', '.button', function () {

                jQuery('#RequiredFieldValidatorTextBoxSelectedDealerID').hide();

                var isValid = thisObj.highlightValidators(postcodeContainer, "PostcodeGroup");

                if (isValid) {

                    postcodeInput.attr('placeholder', '');

                }

                jQuery('span.error:visible').css('display', 'block');

                return isValid;
            });

            postcodeInput.on('blur', function () {
                jQuery('#RequiredFieldValidatorTextBoxSelectedDealerID').hide();
            });

            buttonHolderTop.add(buttonHolderBottom).on('click', '.nextStep', function () {

                var postcodePlaceHolder = jQuery('#TextBoxPostcode').attr('placeholder'),
                    isValid = false,
                    usingCurrentLocation = false,
                    longitudeCookie = cookie('Longitude'),
                    latitudeCookie = cookie('Latitude');


                if (typeof (longitudeCookie) !== 'undefined' && longitudeCookie !== '' &&
                    typeof (latitudeCookie) !== 'undefined' && latitudeCookie !== '' && postcodePlaceHolder !== '') {

                    isValid = true;
                    usingCurrentLocation = true;
                    postcodeInput.val('');
                }
                else if (postcodePlaceHolder === '') {

                    isValid = thisObj.highlightValidators(postcodeContainer, "PostcodeGroup");

                }

                if (isValid) {

                    isValid = Page_ClientValidate("SelectDealerGroup");

                }
                else {

                    postcodeContainer.find(".button").first().focus();

                }

                jQuery('span.error:visible').css('display', 'block');

                return isValid;
            });

        };

        // Displays the selected dealer with the selected class and removes it from any other select dealer button
        thisObj.toggleSelectedDealer = function (dealerToBeSelected) {

            var currentDealerSelectButton = dealerToBeSelected.find('.selectDealerButton'),
                formButtonHolder = jQuery('#formButtonHolderBottom');

            if (typeof (dealerToBeSelected) !== 'undefined' && typeof (currentDealerSelectButton) !== 'undefined') {

                if (!currentDealerSelectButton.hasClass('selected')) {

                    var otherDealers = dealerToBeSelected.siblings();

                    otherDealers.find('.selectDealerButton')
                        .removeClass('selected')
                        .text('Select')
                        .end();
                    currentDealerSelectButton.addClass('selected')
                        .text('Selected');
                }

                thisObj.progressWizard(jQuery('#selectDealer').data('class'), true);
            }

        }

        // Select Service Step
        thisObj.selectService = function () {
            var selectRequirements = serviceBooking.find('.selectRequirements'),
                paneContainers = selectRequirements.find('.paneContainer'),
                serviceTypeInputs = selectRequirements.children("ul").children().children("input[type='checkbox']");

            //Select Requirements handler
            selectRequirements.on('click', 'input[type="checkbox"]', function () {
                var thisCheckbox = jQuery(this),
                    thisServiceName = thisCheckbox.data('servicetype'),
                    serviceTypeOptions = thisCheckbox.closest('.selectRequirements').next().find('.serviceTypeOptions');

                thisCheckbox
                    .closest('.selectRequirements')
                    .next()
                    .find('.options')
                    .next()
                    .val('')
                    .end()
                    .find('.button')
                    .removeClass('selected');

                serviceTypeOptions.find('div[data-servicetype=' + thisServiceName + ']').slideToggle(200);
            });


            //Service Type Pane Containers
            paneContainers.each(function () {
                var thisPaneContainer = jQuery(this);

                if (thisPaneContainer.hasClass('isHidden')) {
                    thisPaneContainer
                        .slideDown(250)
                        .find('.pane')
                        .fadeIn(800);
                }
                else {
                    thisPaneContainer
                        .find('.pane')
                        .filter('.isHidden')
                        .slideDown(250);
                }
            });

            serviceTypeInputs.on("change", function () {
                var thisInput = jQuery(this);
                if (!thisInput.is(":checked")) {
                    thisInput.siblings(".paneContainer")
                        .slideUp(250)
                        .find('.pane')
                        .fadeOut(800);
                }

            });


        };

        // Select Date Step
        thisObj.selectDate = function () {

            //removes inline styles of calendar control
            stepContent.find('.calendar').first().find("[style]").removeAttr("style");
        };

        // Enter Details Step
        thisObj.enterDetails = function () {
            var personalDetails = stepContent.find(".personalDetails");

            thisObj.inputRequired().selectRequired();

            //on page load updates progress wizard if fields are pre-populated
            var inputFields = personalDetails.find('*[data-valid="required"]')

            inputFields.each(function () {
                var thisInput = jQuery(this),
                    dataClass = thisInput.data('class');
                if (thisInput.is('select')) {
                    var firstOption = thisInput.children().first();
                    if (firstOption.attr('selected') !== 'selected') {
                        thisObj.progressWizard(dataClass, true);
                    }
                }
                else if (thisInput.val() !== '') {
                    thisObj.progressWizard(dataClass, true);
                }
            });

            buttonHolder.find(".nextStep").on("click", function () {
                //Need to set focus on error client side as now validating on change
                var validation = thisObj.highlightValidators(personalDetails, "EnterDetails");
                personalDetails.find(".error[data-validator-highlight]").first().find('*[data-valid="required"]').focus();
                return validation;
            });

            inputFields.on("change", function () {
                var validationGroup = "EnterDetails",
                    requiredField = jQuery(this);
                if (requiredField.data('class') === 'pNumber') {
                    var numberFields = requiredField.closest('.form').find('input[data-class="pNumber"]');
                    thisObj.highlightValidators(numberFields.eq(0).closest(".fieldRow"), validationGroup);
                    thisObj.highlightValidators(numberFields.eq(1).closest(".fieldRow"), validationGroup);
                }
                else {
                    thisObj.highlightValidators(requiredField.closest(".fieldRow"), validationGroup);
                }
            });
        }

        thisObj.progressWizard = function (name, valid, input) {
            var itemToValidate = steps.find('span[data-item="' + name + '"]');
            if (valid) {
                if (typeof input !== 'undefined') {
                    if (input.val() !== "") {
                        itemToValidate.toggleClass('valid', valid);
                    }
                } else {
                    itemToValidate.toggleClass('valid', valid);
                }

            } else {
                itemToValidate.toggleClass('valid', valid);
            }
        };

        thisObj.inputRequired = function () {
            stepContent
                .find('input[data-valid="required"]')
                .each(function () {
                    var thisField = jQuery(this);

                    if (thisField.length) {
                        thisField
                            .on('keyup', function () {
                                var thisInput = jQuery(this),
                                    inputVal = thisInput.val(),
                                    dataClass = thisInput.data('class');

                                // Validate either Telephone number or Mobile number
                                if (dataClass === 'pNumber') {

                                    var pNumberValues = thisInput.closest('.form').find('input[data-class="pNumber"]');
                                    var isNumberProvided = CheckNumberIsProvidedForServiceBookingEnterDetails(pNumberValues);

                                    thisObj.progressWizard(dataClass, isNumberProvided);

                                } else {
                                    if (inputVal.length) {
                                        thisObj.progressWizard(dataClass, true);

                                    } else {
                                        thisObj.progressWizard(dataClass, false);
                                    }
                                }
                            });
                    }
                });

            return this;
        };

        thisObj.selectRequired = function () {
            stepContent
                .find('select[data-valid="required"]')
                .each(function () {
                    jQuery(this).on('change', function () {
                        var thisSelect = jQuery(this),
                            selectVal = thisSelect.val(),
                            dataClass = thisSelect.data('class'),
                            defaultVal = dataClass === 'title' || dataClass === 'serviceType' || dataClass === 'selectDate' ? 'Select' : '0';

                        if (selectVal !== defaultVal) {
                            thisObj.progressWizard(dataClass, true);
                        } else {
                            thisObj.progressWizard(dataClass, false);
                        }
                    });

                });

            return this;
        }

        /* Setup validator highlighting
		Pass in a validationgroup and the dom element to search within 
		all fields will highlight when invalid according to the data-validator-highlight value */
        thisObj.highlightValidators = function (container, validationGroup) {

            if (container === 'undefined') {
                container = jQuery("#form1");
            }

            if (validationGroup === 'undefined') {
                validationGroup = "";
            }

            var validators = jQuery(container).find("span.error[data-validator-message]");
            var groupValid = true;

            jQuery(container).find("[data-validator-highlight]").removeClass("error");

            if (validators.length) {
                validators.each(function () {
                    if (this.validationGroup === validationGroup) {
                        ValidatorValidate(this);
                    }

                    var validatorValue = jQuery(this).data("validator-message");
                    var highlightField = jQuery(container).find("[data-validator-highlight='" + validatorValue + "']");

                    if (highlightField.length === 0) {
                        //No relevant field found
                        return;
                    }
                    if (!this.isvalid) {
                        groupValid = false;
                        highlightField.addClass("error");
                    }
                });
            }

            return groupValid;
        }
    }
}

//Custom validator scripts for Service Booking
function ValidateRequirement(source, arguments) {

    var isValid = false;

    jQuery('#RequirementOptions').find('li').each(function () {

        var serviceType = jQuery(this).find("[id$='LabelServiceType']").first().text(),
            serviceTypeCheckBox = jQuery(this).find("[id$='CheckBoxServiceType']");

        if (typeof (serviceType) !== 'undefined' && serviceType !== '' && serviceTypeCheckBox.is(':checked')) {

            if (serviceType === 'Other') {

                var otherTextBox = jQuery(this).find('textarea');

                isValid = (typeof (otherTextBox.val()) !== 'undefined' && otherTextBox.val() !== '' && otherTextBox.val() !== ' ');

                if (!isValid) {

                    isValid = jQuery(this).find("[id$='PaneOther'] input[type=checkbox]").first().is(':checked');
                }

            } else {

                isValid = jQuery(this).find('input[type=checkbox]').first().is(':checked');

            }
        }
    });

    arguments.IsValid = isValid;
}
//Custom validation for service bracket
function ValidateServiceBracket(source, arguments) {

    arguments.IsValid = jQuery('#ServiceBrackets').find('input[type=radio]').is(':checked');

    if (!arguments.IsValid) {
        jQuery('#RadioButtonLowerBracket').focus();
    }

    return arguments.IsValid;
}

//Custom validation for service plan type
function ValidateServicePlanType(source, arguments) {
    var selectedServicePlanType = jQuery('#HiddenFieldServicePlanType').val();

    if (typeof (selectedServicePlanType) !== 'undefined' && selectedServicePlanType !== '') {
        return arguments.IsValid = true;
    }
    else {
        jQuery("[id$='RadioButtonServicePlanType']").first().focus();
        return arguments.IsValid = false;

    }
}

// ValidateServicePlanRefId
function ValidateServicePlanRefId(source, arguments) {
    var requirmentContainer = jQuery(source).parent(),
        selectedServicePlanRefIdInput = requirmentContainer.children('input[type=hidden]').first(),
        otherComment = requirmentContainer.find('.serviceTypeTextArea'),
        isValid = ((typeof (selectedServicePlanRefIdInput) !== 'undefined' && selectedServicePlanRefIdInput.val() !== ''));

    if (otherComment.length > 0) {
        isValid = (isValid || (typeof otherComment !== 'undefined' && otherComment.val() !== ''));
    }

    if (!isValid) {
        requirmentContainer.find('input[type=checkbox]').first().focus();
    }
    return isValid;
}

//Custom validator script for Service Booking Enter Details
function ValidateTelephoneNumbers(source, arguments) {
    var numberFields = jQuery("#serviceBooking").find(".stepContent").find('input[data-class="pNumber"]');
    arguments.IsValid = CheckNumberIsProvidedForServiceBookingEnterDetails(numberFields);
}


//Service booking number validation 
//Returns boolean if at least one number is provided 
//NumberFields should be a jquery list of inputs
function CheckNumberIsProvidedForServiceBookingEnterDetails(NumberFields) {
    return NumberFields.length === 2 && (NumberFields.eq(0).val().length > 0 || NumberFields.eq(1).val().length > 0);
}

//Google Maps 
//MarkerLatitude and MarkerLongitude are floats all other parameters should be jquery objects
//MarkerImagePath is the relative path for the marker image
//DirectionsArgs made of directionsContainer, directionsButton, postcodeFrom, postcodeTo
function loadGoogleMaps(MarkerLatitude, MarkerLongitude, Container, MarkerImagePath, userOptions, directionsArgs) {

    var thisFunc = this,
        map,
        marker,
        directionsDisplay;

    function getOriginValue(postCodeFrom) {

        if (postCodeFrom.length > 0) {
            return postCodeFrom;
        }

        var currentGeoLocation = directionsArgs.currentGeoLocation;

        if (currentGeoLocation != undefined && currentGeoLocation.val().length > 0) {
            var latLngData = JSON.parse(currentGeoLocation.val());

            if (latLngData != null) {
                return latLngData.lat + "," + latLngData.lng;
            }
        }

        return "";
    }

    thisFunc.init = function () {

        var markerImage = '/Images/Common/Icons/icon_map_marker.png';

        if (typeof (MarkerImagePath) !== 'undefined' && MarkerImagePath !== '') {
            markerImage = MarkerImagePath;
        }

        var LatLng = new google.maps.LatLng(parseFloat(MarkerLatitude), parseFloat(MarkerLongitude)),
            mapOptions = {
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: LatLng
            }

        if (typeof userOptions !== 'undefined' && userOptions !== '') {
            jQuery.extend(mapOptions, userOptions);
        }

        map = new google.maps.Map(Container.get(0), mapOptions);

        image = markerImage,
            marker = new google.maps.Marker({
                position: LatLng,
                map: map,
                icon: image
            });

        google.maps.event.addListenerOnce(map, 'idle', function () {
            google.maps.event.trigger(map, 'resize');
            map.setCenter(LatLng);
            google.maps.event.addDomListener(window, 'resize', function () {
                map.setCenter(LatLng);
            });
        });
    }

    thisFunc.calcRoute = function (DirectionsPanel, GetDirectionsButton, PostcodeFrom, PostcodeTo) {

        var postcodeTo = JSON.parse(PostcodeTo.val()),
            request = {
                origin: getOriginValue(PostcodeFrom.val()),
                destination: postcodeTo.Latitude + "," + postcodeTo.Longitude,
                travelMode: google.maps.DirectionsTravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.IMPERIAL
            };

        if (directionsDisplay != null) {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
        }

        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(DirectionsPanel.get(0));

        cookie("UsersPostcode", PostcodeFrom.val());
        marker.setMap(null);

        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }

    thisFunc.getMap = function () {
        return map;
    }

    thisFunc.init();

    if (typeof directionsArgs !== 'undefined') {
        directionsArgs.directionsButton.on("click", function () {
            directionsArgs.postcodeFrom.focus();
            directionsArgs.directionsContainer.empty();

            thisFunc.calcRoute(directionsArgs.directionsContainer, directionsArgs.directionsButton, directionsArgs.postcodeFrom, directionsArgs.postcodeTo);
            return false;
        });

        directionsArgs.postcodeFrom.keyup(function (event) {
            if (event.keyCode == 13) {
                directionsArgs.directionsButton.click();
            }
        });
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Process the booking confirmation
function ProcessBookingConfirmation() {
    var accept = getParameterByName("accept"),
        aguid = getParameterByName("AGUID"),
        bguid = getParameterByName("BGUID");

    jQuery.ajax({
        type: "POST",
        url: "/services/servicebooking.asmx/ProcessBookingConfirmation",
        data: '{"ServiceEmailGuid":"' + aguid + '",' + '"BranchGuid":"' + bguid + '",' + '"Response":"' + accept + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });
}

// Check confirm booking response and redirect		
function ServiceBookingConfirmRedirect() {
    var loader = jQuery("#loader"),
        guid = getParameterByName("AGUID");

    if (guid != null && guid.length > 0) {
        // Override ajaxStop so that loader is always shown
        jQuery(document).ajaxStop(function () {
            if (loader.length > 0) {
                loader.show();
            }
        });

        jQuery.ajax({
            type: "POST",
            url: "/services/servicebooking.asmx/GetResponseRedirectURL",
            data: '{"ServiceEmailGuid":"' + guid + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var redirectUrl = msg.d;
                if (redirectUrl != null && redirectUrl.length > 0) {
                    window.location = redirectUrl;
                }
                else {
                    setTimeout(function () { ServiceBookingConfirmRedirect() }, 1000);
                }
            }
        });
    }
}

function initScrollToElement(target, container) {
    var thisObj = this,
        animationSpeed = 250;

    thisObj.top = function () { // Scroll to the top of the element
        if (typeof container !== 'undefined') {
            container.stop(true).animate({ scrollTop: container.scrollTop() + target.offset().top - container.offset().top }, animationSpeed);
        } else {
            jQuery('html, body').stop(true).animate({ scrollTop: target.offset().top }, animationSpeed);
        }
    };
}

var mathUtilities = {
    round: function (target, places) { // Cross-browser number rounder
        var handler = 1;

        for (var i = 0; i < places; i++) {
            handler = handler * 10;
        }

        return parseFloat((Math.round(handler * target) / handler).toFixed(places));
    },
    computeHeight: function (target) {
        if (target.length) {
            var targetClientRect = target[0].getBoundingClientRect(),
                targetHeight = targetClientRect.height,
                targetComputedHeight = targetClientRect.bottom - targetClientRect.top,
                result;

            if (typeof targetHeight !== 'undefined') {
                result = targetHeight;
            } else {
                result = targetComputedHeight;
            }

            return result;
        }
    }
}

// Contains functions for retrieveing CMS content.
function contentManagement() {

    var thisObj = this;

    thisObj.getRelatedContent = function (itemPath, contentLabel, defaultContentLabel, contentHandler, referer, contentContainer, isAddToContainerEnabled) {

        var relatedContent,
            contentRequest = function (itemPath, contentLabel, isFallBackContentRequestEnabled, defaultRequest) {
                this.ItemPath = itemPath;
                this.ContentLabel = contentLabel;
                this.IsFallBackContentRequestEnabled = isFallBackContentRequestEnabled;
                this.FallBackContentRequest = defaultRequest;
            },
            defaultRelatedContentRequest = new contentRequest(itemPath, defaultContentLabel, false),
            relatedContentRequest = new contentRequest(itemPath, contentLabel, (typeof (defaultContentLabel) !== 'undefined'), defaultRelatedContentRequest);

        jQuery.ajax({
            type: "POST",
            url: "/services/ACMContent.asmx/GetPageRelatedContent",
            data: "{'RelatedContentRequest':" + JSON.stringify(relatedContentRequest) + "}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                contentHandler(msg.d, referer, contentContainer, isAddToContainerEnabled);
            }
        });
    }
}

// Contains methods for interacting with Google Tag Manager
function googleTagManagerUtilities() {

    var thisObj = this;

    thisObj.pushData = function (category, action, label, event) {

        if (typeof (dataLayer) !== 'undefined') {

            if (label) {
                dataLayer.push({ 'ecategory': category, 'eaction': action, 'elabel': label, 'event': event });
            }
            else {
                dataLayer.push({ 'ecategory': category, 'eaction': action, 'event': event });
            }

        }
    };

    thisObj.createEnquiryEventQuerystring = function (enquiryId, userId, enquiryType, id, idType) {
        var qsParams = {};

        if (enquiryId) {
            qsParams.EnquiryID = enquiryId;
        }

        if (userId) {
            qsParams.UserID = userId;
        }

        if (enquiryType) {
            qsParams.EnquiryType = enquiryType;
        }

        if (id) {
            qsParams.id = id;
        }

        if (idType) {
            qsParams.idType = idType;
        }


        return jQuery.param(qsParams);
    };
}

// Transfer Location Options
function transferLocationMapManager(container) {
    if (container) {
        var thisObj = this,
            mapMarker = '/Images/Common/Icons/icon_move_me_closer.png';

        thisObj.load = function () {
            var header = container.find('.mapTrigger'),
                expandedAccordionItem = header.parent('.open');

            // After expanding alternative options accordion item, if nearest dealer accordion item is selected alternative options accordion item needs to be reset
            if (expandedAccordionItem.length) {
                expandedAccordionItem
                    .removeClass('open')
                    .find('.pane')
                    .removeAttr('style')
                    .closest('.accordion')
                    .next()
                    .val('');
            }

            header.on('click', function () {
                var thisHeader = jQuery(this),
                    thisLocationOption = thisHeader.closest('.locationOption'),
                    lat = thisLocationOption.data('latitude'),
                    long = thisLocationOption.data('longitude');

                thisObj.initGoogleMap(thisHeader, lat, long);
            });
        };

        thisObj.initGoogleMap = function (header, lat, long) {
            var headers = header.closest('.locationOption').siblings().children('.mapTrigger'),
                mapCanvas = header.next().children(),
                mapOptions = {
                    scrollwheel: false,
                    draggable: false // Disable draggable to prevent bad user experience on mobile until 'Map enlarge' functionality is implemented
                };

            headers.next().children().empty().removeAttr('style');
            loadGoogleMaps(lat, long, mapCanvas, mapMarker, mapOptions);

        }
    }
}

// Utilities to interact with drop down lists.
function dropDownListUtils() {

    var thisObj = this;

    thisObj.disableDropDown = function (dropDown, valueToSelect) {
        dropDown.prop("disabled", true);
        thisObj.selectItem(dropDown, valueToSelect);
    };

    thisObj.selectItem = function (dropDown, valueToSelect) {
        dropDown.find("option[value='" + valueToSelect + "']")
            .prop("selected", true);
    };

    thisObj.selectValueIfExist = function (dropdownControl, valueToSelect) {
        var matchingOption = dropdownControl.find('option[value="' + valueToSelect + '"]');
        if (matchingOption.length) {
            dropdownControl.val(valueToSelect);
        }
    };
}

var validationUtility = {
    validate: function (field, regex) {
        var isValid, fieldValue = field.val();
        if (fieldValue.length > 0) {
            isValid = this.validateRegex(fieldValue, regex);
        } else {
            isValid = false;
        }

        return isValid;
    },
    validateRegex: function (fieldValue, regex) {
        var isValid;
        if (regex != '') {
            var rgx = new RegExp(regex);
            if (rgx.test(fieldValue)) {
                isValid = true;
            } else {
                isValid = false;
            }
        } else {
            isValid = true;
        }

        return isValid;
    },

    updateErrorClass: function (field, isValid) {
        if (!isValid) {
            field.addClass("hasError");
        } else {
            field.removeClass("hasError");
        }
    },

    validateTelephoneNumber: function (telNumber) {
        var spaces = 0,
            digits = 0;

        for (var i = 0; i < telNumber.length; i++) {
            if (telNumber[i] == ' ') {
                spaces++;
            } else if (telNumber[i] >= 0 && telNumber[i] <= 9) {
                digits++;
            } else {
                return false;
            }
        }

        return (digits >= 10 && digits <= 12 && spaces <= 3);

    },

    resetValidation: function (selectors, className) {
        jQuery.each(selectors, function (index, selector) {
            selector.removeClass(className);
        });
    }

}

// Constructs an AJAX request to a given URL using the provided parameters
var ajaxJsonServiceCall = function (url, data, isAsync, successHandler, errorHandler, successHandlerAdditionalData, errorHandlerAdditionalData) {

    jQuery.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType: "json",
        contentType: "application/json",
        global: false,
        async: isAsync,
        success: function (data) {
            if (typeof (successHandler) !== 'undefined') {
                successHandler(data, successHandlerAdditionalData);
            }
        },
        error: function (xhr, error) {
            if (typeof (errorHandler) !== 'undefined') {
                errorHandler(xhr, errorHandlerAdditionalData);
            }
        }
    });
};

// Brochure page presentational features
var brochure = function () {

    var initialise = function () {

        headerFooterClass();
        copyrightYear();
        scroll();
        share();

    };

    var headerFooterClass = function () {

        var brochure = jQuery('.brochurePage'),
            article = brochure.find('>article'),
            articleChildren = article.find('div > div');

        articleChildren.first().addClass('brochureHeader');

        articleChildren.last().addClass('brochureFooter').prev('h3').remove();

    };

    var copyrightYear = function () {

        var currentYear = new Date().getFullYear(),
            copyrightYear = jQuery('.thisYear');

        copyrightYear.text(currentYear + " ");

    };

    var scroll = function () {

        jQuery(window).on('scroll', function () {

            var windowTop = jQuery(window).scrollTop(),
                brochure = jQuery('.brochurePage'),
                article = brochure.find('>article'),
                headerHeight = article.find('div:first-of-type').outerHeight();

            if (windowTop > (headerHeight * 4)) {

                article.css('margin-top', headerHeight);

                brochure.addClass('scrolling');

            } else {

                if (brochure.hasClass('scrolling')) {

                    article.removeAttr('style');

                    brochure.removeClass('scrolling');

                }
            }

        });

    };

    var share = function () {

        var currentURL = window.location.href,
            facebookButton = jQuery('.socialLinks .facebook'),
            twitterButton = jQuery('.socialLinks .twitter');

        if (facebookButton.length) {

            facebookButton.attr('href', 'http://www.facebook.com/sharer.php?u=' + currentURL);

        }

        if (twitterButton.length) {

            twitterButton.attr('href', 'http://twitter.com/home?status=' + currentURL);

        }

    };

    return {

        initialise: initialise

    }

}();

//Popup in new window (used primarily for live chat)
function initNewWindow(newWindowLink) {

    if (newWindowLink.length > 0) {

        newWindowLink.on('click', function () {

            var thisObj = jQuery(this),
                newWindowURL = thisObj.attr('href'),
                newWindowWidth = thisObj.data('width') || 836, // defaults to width of chat window
                newWindowHeight = thisObj.data('height') || 608, // defaults to height of chat window
                newWindow = window.open(newWindowURL, '', 'height=' + newWindowHeight + ',width=' + newWindowWidth);

            if (window.focus) {

                newWindow.focus();

            }

            return false;

        });

    }

}

//Image gallery
var imageGallery = function () {

    var initialise = function (heroImageArgs, heroGallery) {

        gallerySwipebox(jQuery(heroImageArgs.mask), heroGallery);

    };

    var gallerySwipebox = function (trigger, gallery) {

        if (jQuery().swipebox && gallery.length > 1) {

            var more = jQuery('.gallery__more');

            if (!jQuery('html').hasClass('ltIE8')) {

                if (more.length) {

                    more.append('<span class="icon icon--camera"></span>');

                }
                trigger.on('click', function () {
                    jQuery.swipebox(gallery);
                });

            } else {

                trigger.css({
                    'cursor': 'default'
                });
                more.hide();
            }

        } else {

            trigger.css({
                'cursor': 'default'
            });

        }
    };

    return {

        initialise: initialise
    }
}();

// Display a tooltip on list items if text is too long
function specificationToolTip(parent, item) {

    parent.on('mouseenter', item, function () {

        var thisObj = jQuery(this),
            outerWidth = thisObj.outerWidth(),
            cloneContent = thisObj.clone().attr('id', 'tooltipClone').appendTo(thisObj);

        if (thisObj.width() <= cloneContent.width()) {

            jQuery('body').append('<div id="tooltip">' + cloneContent.text() + '</div>');

            var tooltip = jQuery('#tooltip').css({ 'max-width': outerWidth }),
                thisObjOffset = thisObj.offset();

            setTimeout(function () {

                tooltip.css({
                    'display': 'block',
                    'top': thisObjOffset.top - (tooltip.outerHeight() + 6),
                    'left': thisObjOffset.left + ((outerWidth - tooltip.outerWidth()) / 2)
                });

            }, 250);
        }

        jQuery('#tooltipClone').remove();

    })
        .on('mouseleave', item, function () {

            var tooltip = jQuery('#tooltip');

            if (tooltip.length) {

                tooltip.remove();

            }

        });
};

// Resize specification content if list item contains a button
function specificationWidth(element) {

    element.each(function () {

        var thisObj = jQuery(this),
            button = thisObj.find('.button');

        if (button.length) {

            thisObj.attr('style', '');

            thisObj.outerWidth(thisObj.outerWidth() - button.outerWidth());

        }

    });

};

// Convert long select menus to overlay control
function longSelectMenu(fieldRow, message) {

    if (!message) {
        var message = "Please select your option from the list";
    }

    var overlayID = fieldRow.attr("id") + "Overlay",
        longSelectInput = fieldRow.find(".longSelectInput"),
        $body = jQuery("body"),
        $blackout = jQuery("#navColumnBlackout"),
        $select = fieldRow.find("select"),
        $overlay = jQuery("#" + overlayID);

    if (longSelectInput.length) {
        longSelectInput.remove();
    }

    if ($overlay.length) {
        $overlay.remove();
    }

    if ($blackout.length) {
        $blackout.remove();
    }

    $select.prop('selectedIndex', 0);

    $body.append("<div id=" + overlayID + " class=\"longSelectInputModal\"><a href=\"#\" class=\"button close\"><span>Close</span></a><header><h3>" + message + "</h3></header><ul></ul></div><div id=\"navColumnBlackout\"></div>");

    var $overlay = jQuery("#" + overlayID),
        $blackout = jQuery("#navColumnBlackout");

    fieldRow.find(".inputContainer").append("<div  class=\"longSelectInput\">" + message + "</div>");

    longSelectInput = fieldRow.find(".longSelectInput");

    $select.hide().find("option").each(function () {
        var thisObj = jQuery(this);
        if (thisObj.index() > 0) {
            $overlay.find("ul").append("<li data-value=" + thisObj.val() + ">" + thisObj.text() + "</li>");
        }
    });

    //Open input modal
    longSelectInput.on("click", function () {
        $blackout.fadeIn(200, function () {
            $overlay.show(200).scrollTop(0);
            $body.css("overflow", "hidden");
        });
    });

    //Close input modal
    jQuery("#navColumnBlackout, .button.close").on("click", function () {
        closeLongSelect();
    });

    //Option selected
    $overlay.on("click", "li", function () {
        var thisText = jQuery(this).text();
        $select.find("option").filter(function () {
            return $(this).text() == thisText;
        }).prop('selected', true).change();
        longSelectInput.text(thisText);
        closeLongSelect();
    });

    function closeLongSelect() {
        $overlay.hide(200, function () {
            $blackout.fadeOut(200);
            $body.css("overflow", "auto");
        });
    }

};

var isValidEmailAddress = function (email) {
    var emailRegex = /^([a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]){1,70}$/;

    var isValid = emailRegex.test(email);

    return isValid;
};

var subscription = function () {

    var subscribeButton,
        emailInput,
        emailSubscribeLabelHidden = "is-hidden";

    var init = function () {
        subscribeButton = jQuery(".email-subscribe_button");
        emailInput = jQuery(".email-subscribe_input");
        subscribeButton.on("click", onButtonClick);
    };

    var onButtonClick = function () {

        var emailValue = emailInput.val(),
            invalidLabel = jQuery(".email-subscribe_invalid"),
            requestData = {
                EmailAddress: emailValue
            };

        if (isValidEmailAddress(emailValue)) {

            if (!invalidLabel.hasClass(emailSubscribeLabelHidden)) {
                invalidLabel.addClass(emailSubscribeLabelHidden);
            }
            disableInput(true);

            ajaxJsonServiceCall(
                "/Services/Subscription.asmx/SubmitSubscription",
                JSON.stringify(requestData),
                true,
                submitSuccess,
                submitError
            );
        } else {
            invalidLabel.removeClass(emailSubscribeLabelHidden);
            setTimeout(function () {

                invalidLabel.addClass(emailSubscribeLabelHidden);

            }, 1500);
        }
    };

    var submitSuccess = function (data) {
        if (dataLayer != 'undefined') {
            var enquiryData = {
                'event': 'enquiry',
                'enquiryType': 'Subscription'
            };
            if (data.EnquiryID != null) {
                enquiryData.enquiryID = data.EnquiryID;
            }
            if (data.UserID != null) {
                enquiryData.userID = data.UserID;
            }
            dataLayer.push(enquiryData);
        }
        jQuery(".email-subscribe_thanks").removeClass(emailSubscribeLabelHidden);
    };

    var submitError = function (data) {
        disableInput(false);
    };

    var disableInput = function (toggle) {
        subscribeButton.prop("disabled", toggle);
        emailInput.prop("disabled", toggle);
    };

    return {
        init: init
    };
}();

// Footer accordion and poisitioning functions
var footerUI = function () {

    var thisWindow,
        windowWidth,
        footerHeader,
        footerItems,
        activeClass = "is-active";

    var init = function () {

        thisWindow = jQuery(window),
            windowWidth = thisWindow.width(),
            footerHeader = jQuery(".invert-list_header"),
            footerItems = jQuery(".invert-list_items");

        thisWindow.on("load resize", function () {
            footerPosition();

            // this allows for behaviour where iOS fires a resize event on scroll
            if (jQuery(window).width() != windowWidth) {

                windowWidth = jQuery(window).width();

                footerItems.attr("style", "");
                footerHeader.removeClass(activeClass);
            }
        });

        footerHeader.on("click", function () {
            footerAccordion(jQuery(this));
        });

    };

    var footerPosition = function () {

        var mainContent = jQuery(".main-content"),
            footer = jQuery(".site-footer"),
            push = jQuery(".footer-push");

        if (thisWindow.width() != footerHeader.outerWidth() && jQuery(".dealerContent").length == 0) {

            resetStyles();

            var footerHeight = footer.height();

            mainContent.css({
                "margin-bottom": "-" + footerHeight + "px"
            });
            footer.css({
                "height": footerHeight
            })
            push.css({
                "height": footerHeight
            })

        } else {

            resetStyles();

        }

        function resetStyles() {
            mainContent.attr("style", "");
            footer.attr("style", "");
            push.attr("style", "");
        }

    };

    var footerAccordion = function (trigger) {

        if (thisWindow.width() < 599) {

            if (!trigger.next().is(":visible")) {

                footerHeader.removeClass(activeClass);
                footerItems.slideUp(200);
                trigger.addClass(activeClass).next().slideDown(200);

            } else {

                trigger.removeClass(activeClass).next().slideUp(200);

            }
        }
    };

    return {
        init: init
    };

}();

var searchToggle = function (trigger, container) {

    trigger.on("click",
        function () {

            var $this = jQuery(this);
            if (!$this.hasClass("is-active")) {
                trigger.removeClass("is-active");
                $this.addClass("is-active");

                container.each(function () {

                    var $thisContainer = jQuery(this);

                    if ($thisContainer.data("section") == $this.data("section")) {
                        $thisContainer.show();
                    } else {
                        $thisContainer.hide();
                    }
                });
            }
        });
};

function removeURLParameter(url, parameter) {
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        for (var i = pars.length; i-- > 0;) {
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        url = urlparts[0] + '?' + pars.join('&');
        return url;
    } else {
        return url;
    }
}

// Creates a GUID
function createGuid() {
    /// <summary>Generate 128-bit, 32 hexadecimal, globally unique UUID</summary>
    //Generate 4-digit random hex value
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function ImageError(source) {
    source.src = "/images/notfound/icon_noimage.jpg";
    source.onerror = "";
    return true;
}

//Generic modals
function generalModalToggle(trigger) {

    jQuery("#blackout").fadeToggle(200);

    if (trigger != undefined) {

        var modalData = trigger.data("modal"),
            modal = jQuery(".general-modal[data-modal=\"" + modalData + "\"]");

        if (modal.length) {

            modal.toggleClass("general-modal--visible");
            jQuery("html,body").toggleClass("noScroll");

        }

    } else {
        jQuery(".general-modal--visible").toggleClass("general-modal--visible");
        jQuery("html,body").toggleClass("noScroll");
    }

}

//FAQ Dropdown
function faqDropdown() {

    var $faq = jQuery(".faq"),
        notContactPage = jQuery(".contactPage").length < 1;

    if ($faq.length && notContactPage) {

        jQuery(".faq_question").each(function () {

            var $faqQuestionItem = jQuery(this),
                linkUrl = $faqQuestionItem.data("linkurl");

            if (typeof (linkUrl) != "undefined" && linkUrl.length > 0) {

                $faqQuestionItem.addClass("hasLink").wrapInner("<a href=\"" + linkUrl + "\" target=\"" + $faqQuestionItem.data("linktarget") + "\" class=\"faq_link\" \"></span>");

            }

        });

        jQuery("body").on("click", function () {

            var $faq_questions = jQuery(".faq_questions");

            if ($faq_questions.is(":visible")) {
                $faq_questions.toggle();
            }

        });

    }

    $faq.on("click", ".faq_select", function (e) {

        if (notContactPage) {

            jQuery(this).siblings(".faq_questions").toggle(200);
            e.stopPropagation();

        }

    }).on("click", ".faq_question", function (e) {

        var $faqQuestionItem = jQuery(this),
            modalData = $faqQuestionItem.data("modal");

        if (notContactPage) {

            $faqQuestionItem.closest(".faq_questions").hide();

        }

        if (typeof (modalData) != "undefined") {

            generalModalToggle($faqQuestionItem);
            e.stopPropagation();

        }

    });

    jQuery("#blackout, .general-modal_close").on("click", function (e) {

        if (jQuery(".general-modal--visible").length) {
            generalModalToggle();
        }
        e.stopPropagation();

    });

}