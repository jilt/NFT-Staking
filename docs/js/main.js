
/*========================================================================= */
/*  Preloader
/* ========================================================================= */

$(window).on("load", function() {
    $("#preloader").fadeOut("slow");

    /*=================================================================
        Parallax
    =================================================================*/
    if($(window).width() > 1024){
        $(".test-parallax").parallax("50%", 0.1);
        $(".text-parallax").parallax("50%", 0.6);
        $(".parallax-subs").parallax("50%", 0.3);
        $("#teatimonial").parallax("50%", 0.1);
        $("#parallax").parallax("50%", 0.1);
        $(".cta-parallax").parallax("50%", 0.5);
        $(".parallax1").parallax("50%", 0.1);
        $(".parallax2").parallax("50%", 0.1); // rsvp, wedding
        $(".parallax3").parallax("50%", 0.5);
        $(".parallax4").parallax("50%", 0.5);
        $(".parallax5").parallax("50%", 0.5);
        $(".parallax6").parallax("50%", 0.5);
        $(".parallax7").parallax("50%", 0.5);
        $(".parallax8").parallax("50%", 0.5);
        $(".parallax9").parallax("50%", 0.5);
        $(".parallax10").parallax("50%", 0.5);
        $(".parallax11").parallax("50%", 0.5);
        $(".parallax12").parallax("50%", 0.5);
        $(".parallax13").parallax("50%", 0.5);
        $(".parallax14").parallax("50%", 0.5);
        $(".parallax15").parallax("50%", 0.5);
        $(".parallax16").parallax("50%", 0.5);
        $(".parallax17").parallax("50%", 0.5);
        $(".parallax18").parallax("50%", 0.5);
        $(".parallax19").parallax("50%", 0.5);
        $(".parallax20").parallax("50%", 0.5);
        $(".parallax21").parallax("50%", 0.5);
        $(".parallax22").parallax("50%", 0.5);
        $(".parallax23").parallax("50%", 0.5);
        $(".parallax24").parallax("50%", 0.5);
        $(".parallax25").parallax("50%", 0.5);
        $(".parallax26").parallax("50%", 0.5);
        $(".parallax27").parallax("50%", 0.5);
        $(".parallax28").parallax("50%", 0.5);
        $(".parallax29").parallax("50%", 0.5);
        $(".parallax30").parallax("50%", 0.5);
        $(".app-home").parallax("50%", 0.5);
        $(".parallax-home").parallax("50%", 0.5);
        $(".parallax-cta").parallax("50%", 0.5);
    };  
    
    /// audio player photography home
    $(".pg-audio").mediaelementplayer({
        // width of audio player
        audioWidth: 50,
        // height of audio player
        audioHeight: 50,
        // useful for <audio> player loops
        loop: true,
        // the order of controls you want on the control bar (and other plugins below)
        features: ["playpause"],
        // play audio automatically when document ready
        success: function(mediaElement, domObject) {
            //mediaElement.play();
        }
    });
});

(function ($) {

    // end preview pannel 
    //========================================================================


    //initiating wow js
    var wow = new WOW({
        mobile:       false
      }
    );
    wow.init();


    // getting window width
    //var windowWidth  = $(window).width();
    var windowWidth =  {
        value:$(window).width()
    }

    $(window).resize(function(event) {
        windowWidth.value=$(window).width();
        canvasResponsive();
    });

    //window height
    var bannerHeight = $(window).height();

    //store navigation height
    var navigationHeight = $(".navbar-default").height();

    //calculate window height without nav height
    var fitScreen = bannerHeight-navigationHeight;

    //stucky header

    /*$(".sticky-header").sticky({
        topSpacing: 0
    });*/

    if (!$(".sticky-header").parent().is(".sticky-head-wrapper")) {
        $(".sticky-header").wrap('<div class="sticky-head-wrapper"></div>').parent().css("height", navigationHeight);
    }

    $(window).scroll(function () {
        if ($(window).scrollTop() >= 0) {
            $(".sticky-header").addClass("on");
        }else {
            $(".sticky-header").removeClass("on");
        }
    });  

/*=================================================================
    Animated Header
=================================================================*/

    $(window).scroll(function () {
        if ($(window).scrollTop() > 200) {
            $(".navbar-default").addClass("animated");
            $(".slidedown-nav").slideDown();
            $(".page-menu").addClass("page-navbg");
            $(".top-head").slideUp();
            $(".header-mid").slideUp();
            $(".header2 .header-top").slideUp();
            $(".show-top-bar .header-top").slideUp();
            $(".header-top.opened").slideUp();
        } else {
            $(".navbar-default").removeClass('animated');
            $(".slidedown-nav").slideUp();
            $(".page-menu").removeClass("page-navbg");
            $(".top-head").slideDown();
            $(".header-mid").slideDown();
            $(".header2 .header-top").slideDown();
            $(".show-top-bar .header-top").slideDown();
            $(".header-top.opened").slideDown();
        }
    });

    $(".header-widget-toogle").on("click", function() {
        $(".header-widget-inner").slideToggle(600);
    });

    $('.navbar-nav>li>a').each(function(){
        if($(this).next().is('ul')){
            $(this).append('<i class="drpdownSign"></i>');
        }
    });

    $(".navbar-nav > li:not(.mega-menu) > ul li a").each(function() {
        if($(this).next().is("ul")){
            $(this).append('<i class="fa fa-angle-right"></i>');
        }
    });

    // drop down for mobile from 320
    if ( windowWidth.value <= 767 ) {
        $(".navbar-nav li a").each(function(){
            if($(this).next().is("ul")){
                //change the dropdown icon, right arrow to down arrow
                $(this).children(".fa-angle-right").addClass("fa-angle-down");
            }
        });
    }

    $(window).resize(function() {
        if ( windowWidth.value <= 767 ) {
            $(".navbar-nav li a").each(function(){
                if($(this).next().is("ul")){
                    //change the dropdown icon, right arrow to down arrow
                    $(this).children(".fa-angle-right").addClass("fa-angle-down");
                }
            });
        }
    });

    $(".navbar-nav li a").on("click", function(event) {
        if ( windowWidth.value < 768 ) {
            if($(this).next().is("ul")){
                event.preventDefault();
                // slide down menu in mobile on click
                $(this).next("ul").slideToggle(800)
            }
        }
    });

    $(".vertical-nav li>a").each(function(){
        if($(this).next().is("ul")){
            $(this).append("<i class=\"drpdownSign\"></i>");
        }
    });
	
    // nav toggle in tablet
    $(".navbar-toggle2").on('click', function() {
        $(".ac-nav .navbar-nav").slideToggle();
    });
    
    $(".slide-top .hide-top").on("click", function() {
        $(".header-top").slideToggle();
    });

    //apply the height
    $(".fitscreen").css("height", fitScreen);
    $(".fullscreen").css("height", bannerHeight);

    $(window).resize(function() {
        $(".fitscreen").css("height", fitScreen);
        $(".fullscreen").css("height", bannerHeight);
    });

    if ($("body").children().hasClass("bordered")) {
        $("header > div").removeClass("container");
        $("section > div").removeClass("container");
        $("section > .overlay > div").removeClass("container");
        $("footer > div").removeClass("container");
        $("header > div").addClass("container-fluid");
        $("section > div").addClass("container-fluid");
        $("section > .overlay > div").addClass("container-fluid");
        $("footer > div").addClass("container-fluid");
        $("section > .overlay").removeClass("container-fluid");
        $("#parallax > .overlay > div").removeClass("container-fluid");
        $("#parallax > .overlay > div").addClass("container");
        $("#teatimonial > .overlay > div").removeClass("container-fluid");
        $("#teatimonial > .overlay > div").addClass("container");
        $(".home-banner13 > div").removeClass("container-fluid");
    }

    $(window).scroll(function () {
        if ($(window).scrollTop() > fitScreen ) {
            $(".bottom-head").addClass('navbar-fixed-top');
        } else {
            $(".bottom-head").removeClass('navbar-fixed-top');
        }
    });

    $(".navbar-nav").singlePageNav({
        offset: $(".navbar-default").outerHeight(),
        currentClass: "current",
        easing: "easeInOutExpo",
        filter: ":not(.external)"
    });

    $(".footer-nav").onePageNav({
        changeHash: false,
        scrollSpeed: 750,
        scrollThreshold: 0.5,
        easing: 'easeInOutExpo'
    });

    // vertical dropdown 
    $(".vertical-nav>ul>li").hover(
        function () {
            $(this).children(".dropdown").stop(true,true).slideDown("medium");
            $(this).children("a").find(".drpdownSign").addClass("opened");
        }, 
        function () {
            $(this).children(".dropdown").stop(true,true).slideUp("medium");
            $(this).children("a").find(".drpdownSign").removeClass("opened");
        }
    );
    $(".vertical-nav .dropdown>li").hover(
        function () {
            $(this).children("ul").stop(true,true).slideDown("medium");
            $(this).children("a").find(".drpdownSign").addClass("opened");
        }, 
        function () {
            $(this).children("ul").stop(true,true).slideUp('medium');
            $(this).children("a").find(".drpdownSign").removeClass("opened");
        }
    );

    if($(window).width() <= 768){
        $(".vertical-selector").removeClass("vertical-inner-content");
    };

    $(".mobile-nav-toggle").on("click", function() {
        $(".vertical-nav").slideToggle("slow");
    });
    
    // uncomment the code for landing page,
    // comment the code for multi page.
    // slide up expanded menu in mobile when click 
    // on a menu item

    $(".navbar-nav li a").on("click", function(e){
        e.preventDefault;
        if($(window).width() <= 767){
            if ($(this).next().is("ul")) {
                return false;
            }else {
                $(".navbar-toggle").trigger("click");
            }
        };
    });

    //Header 2 

    //on hover search form
    $(".search-form .fa-search").on('mouseover', function() {
        $(".form-inner").fadeIn();
        $(".form-inner .search-field").focus();
    });

    var searchfield = $(".search-field");

    $(".search-form .fa-search, .form-inner").on('mouseleave', function() {
        if (searchfield.val().length <= 0) {
            $(".form-inner").fadeOut();
        }
    });

    searchfield.focusout(function(){
        if (searchfield.val().length <= 0) {
            $(".form-inner").fadeOut();
        }
    });

    
    $(".nav-toggle").on('click', function(event) {
        event.preventDefault();
        $(".navbar-collapse .navbar-nav").slideToggle(400);
    });

    $(".side-nav").on("click", function(event) {
        event.preventDefault();
        $(".slide-menu-sec").toggleClass("opened");
    });

    $(".close-slide-nav").on("click", function(event) {
        event.preventDefault();
        $(".slide-menu-sec").removeClass("opened");
    });

    $(".sidebar-nav ul li").hover(
        function () {
            $(this).children("ul").stop(true,true).slideDown('medium');
        }, 
        function () {
            $(this).children("ul").stop(true,true).slideUp('medium');
        }
    );

    // Slider for business.php
    $(".init-slider1").owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        autoplay: false,
        smartSpeed: 800,
        mouseDrag: false,
        autoplayHoverPause: true
    });

    // home slider

    $("#home-carousel").carousel({
        interval: 4000
    });

    // home6 slider / index6 
    var slide6 = $('.slide6').bxSlider({
        controls: true,
        autoHover: true,
        touchEnabled: true,
        pager: false,
        mode: 'fade',
        auto: false,
        onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            $('.active').removeClass('active');
            $('.slide6 > .item').eq(currentSlideHtmlObject).addClass('active')
        },
        onSliderLoad: function () {
            $('.slide6 > .item').eq().addClass('active')
        }
    });

    // Backsttretch slider index 7
    $(".banner-3").backstretch([
        "img/slider/blurry-1.jpg",
        "img/slider/blurry-2.jpg"
    ],  {duration: 3000, fade: 750});

    // Backsttretch slider index 5
    $(".banner-5").backstretch([
        "img/slider/business-1.jpg",
        "img/slider/business-2.jpg"
    ],  {duration: 3000, fade: 750});

    // Backsttretch slider index 7
    $(".banner-7").backstretch([
        "img/slider/creative_girl-1.jpg",
        "img/slider/creative_girl-2.jpg"
    ],  {duration: 3000, fade: 750});

    // Backsttretch slider index 7
    $(".banner-10").backstretch([
        "img/slider/banner10_1.jpg",
        "img/slider/banner10_2.jpg"
    ],  {duration: 3000, fade: 750});

    // Backsttretch slider index 14
    /*$(".home14").backstretch([
        "img/slider/travel-1.jpg",
        "img/slider/travel-2.jpg"
    ],  {duration: 3000, fade: 750});*/

    // Backsttretch slider index 18
    $(".home18").backstretch([
        "img/slider/science-1.jpg",
        "img/slider/science-2.jpg"
    ],  {duration: 3000, fade: 750});

    // Backsttretch slider index 19
    $(".home19").backstretch([
        "img/slider/food-1.jpg",
        "img/slider/food-2.jpg"
    ],  {duration: 3000, fade: 750});

    // Backsttretch slider index 20
    $(".home20").backstretch([
        "img/slider/book-1.jpg",
        "img/slider/book-2.jpg"
    ],  {duration: 3000, fade: 750});

    // Backsttretch slider index 22
    $(".home22").backstretch([
        "img/slider/parallax-1.jpg",
        "img/slider/parallax-2.jpg"
    ],  {duration: 3000, fade: 750});

    // Backsttretch slider index 23
    $(".home23").backstretch([
        "img/slider/wedding-1.jpg",
        "img/slider/wedding-2.jpg",
        "img/slider/wedding-4.jpg"
    ],  {duration: 3000, fade: 750});

    // Backsttretch slider index 28 and restaurant.php
    $(".home28").backstretch([
        "img/restaurant/slider-head1.jpg",
        "img/restaurant/slider-head2.jpg"
    ],  {duration: 3000, fade: 750});

    // home12 slider / index12
    var slide12 = $('.slide12').bxSlider({
        controls: false,
        autoHover: true,
        touchEnabled: true,
        pager: false,
        auto: true,
        onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            $('.active').removeClass('active');
            $('.slide12 > .item').eq(currentSlideHtmlObject).addClass('active')
        },
        onSliderLoad: function () {
            $('.slide12 > .item').eq().addClass('active')
        }
    });

    // Index 13

    var slide13 = $('.slide13').bxSlider({
        controls: true,
        autoHover: true,
        touchEnabled: true,
        pager: false,
        mode: 'fade',
        speed: 1500,
        pause: 6000,
        auto: false,
        onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            $('.slide13 .active').removeClass('active');
            $('.slide13 > .slide-item').eq(currentSlideHtmlObject).addClass('active')
        },
        onSliderLoad: function () {
            $('.slide13 > .slide-item').eq().addClass('active')
        }
    });

    $(".banner-slider13").owlCarousel({
        loop: true,
        items : 1,
        autoplay: true,
        dots: false,
        nav: true,
        mouseDrag: false,
        smartSpeed: 800
    });

    $('a.link[href^="#"]').on('click',function (e) {
        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top+ $(".navbar-default").height()
        }, 900);
        return 0
    });

/*=================================================================
    Box Mode Slider
=================================================================*/

    $(".boxed-slider").owlCarousel({
        items: 1,
        nav: true,
        loop: true,
        dots: false,
        autoplay: true,
        smartSpeed: 800,
        mouseDrag: false,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-up"></i>', '<i class="fa fa-angle-down"></i>']
    });

/*=================================================================
    Box Mode Slider2
=================================================================*/

    $(".boxed-slide2").bxSlider({
        controls: true,
        autoHover: true,
        pager: false,
        touchEnabled: true,
        prevText: '<i class="fa fa-angle-up"></i>',
        nextText: '<i class="fa fa-angle-down"></i>',
        auto: false,
        onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            $('.boxed-slide2 .active').removeClass('active');
            $('.boxed-slide2 > .item').eq(currentSlideHtmlObject + 1).addClass('active')
        },
        onSliderLoad: function () {
            $('.boxed-slide2 > .item').eq(1).addClass('active')
        }
    });

/*=================================================================
    home slide / index24
=================================================================*/

    $(".slide17").bxSlider({
        controls: true,
        autoHover: true,
        pager: false,
        mode: 'fade',
        touchEnabled: true,
        auto: false,
        onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            $('.slide17 .active').removeClass('active');
            $('.slide17 > .item').eq(currentSlideHtmlObject).addClass('active')
        },
        onSliderLoad: function () {
            $('.slide17 > .item').eq().addClass('active')
        }
    });

/*=================================================================
    home slide / index24
=================================================================*/

    $(".slide24").bxSlider({
        controls: false,
        autoHover: true,
        pager: false,
        touchEnabled: true,
        auto: true,
        onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            $('.slide24 .active').removeClass('active');
            $('.slide24 > .item').eq(currentSlideHtmlObject + 1).addClass('active')
        },
        onSliderLoad: function () {
            $('.slide24 > .item').eq(1).addClass('active')
        }
    });

/*=================================================================
    home slide / index25
=================================================================*/

    $(".slide25").bxSlider({
        controls: false,
        autoHover: true,
        pager: false,
        touchEnabled: true,
        auto: true,
        onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            $('.slide25 .active').removeClass('active');
            $('.slide25 > .item').eq(currentSlideHtmlObject + 1).addClass('active')
        },
        onSliderLoad: function () {
            $('.slide25 > .item').eq(1).addClass('active')
        }
    });

/*=================================================================
    home slide / index25
=================================================================*/

    $(".slide26").bxSlider({
        controls: true,
        autoHover: true,
        pager: false,
        touchEnabled: true,
        auto: false,
        onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            $('.slide26 .active').removeClass('active');
            $('.slide26 > .item').eq(currentSlideHtmlObject + 1).addClass('active')
        },
        onSliderLoad: function () {
            $('.slide26 > .item').eq(1).addClass('active')
        }
    });

/*=================================================================
    home slide / index27
=================================================================*/

    $(".slide27").bxSlider({
        controls: false,
        autoHover: true,
        pager: false,
        touchEnabled: true,
        auto: true,
        onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            $('.slide27 .active').removeClass('active');
            $('.slide27 > .item').eq(currentSlideHtmlObject + 1).addClass('active')
        },
        onSliderLoad: function () {
            $('.homse27 > .item').eq(1).addClass('active')
        }
    });

/*=================================================================
    home slide / index31
=================================================================*/

    $(".slide31").bxSlider({
        controls: false,
        autoHover: true,
        pager: false,
        touchEnabled: true,
        auto: true,
        onSlideAfter: function (currentSlideNumber, totalSlideQty, currentSlideHtmlObject) {
            console.log(currentSlideHtmlObject);
            $('.slide31 .active').removeClass('active');
            $('.slide31 > .item').eq(currentSlideHtmlObject + 1).addClass('active')
        },
        onSliderLoad: function () {
            $('.homse31 > .item').eq(1).addClass('active')
        }
    });


/*=================================================================
    home slide / index31
=================================================================*/

    $(".portfolio-single2").bxSlider({
        controls: true,
        autoHover: true,
        pager: false,
        touchEnabled: true,
        auto: true
    });

    $(".home-flex").flexslider({
        animation: "slide",
        controlNav: false,
        directionNav: false
    });

    

    // Quote form validation
    $("#quote-form").validate({
        rules: {
            fullname: {
                required: false
            },
            message: {
                required: false
            },
            phone: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            policy: {
                required: true
            }
        },
        messages: {
            phone: {
                required: "Please Enter Phone Number",
                minlength: "please enter correct phone number"
            },
            email: {
                required: "Please Enter Your Email"
            },
            policy: "(Required)"
        },
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                type:"POST",
                data: $(form).serialize(),
                url:"quote-form.php",
                success: function() {
                    $('#quote-form :input').attr('disabled', 'disabled');
                    $('#quote-form').fadeTo( "slow", 0.15, function() {
                        $(this).find(':input').attr('disabled', 'disabled');
                        $(this).find('label').css('cursor','default');
                        $('#success').fadeIn();
                    });
                },
                error: function() {
                    $('#quote-form').fadeTo( "slow", 0.15, function() {
                        $('#error').fadeIn();
                    });
                }
            });
        }
    });


    /*-------------------------------------------------*/
    /* =  Photography
    /*-------------------------------------------------*/

    //init kenburn slider
    canvasResponsive();

    /*-------------------------------------------------*/
    /* =  video 
    /*-------------------------------------------------*/

  if (self.location.href == top.location.href){}

  $('#bgndVideo').on("YTPStart",function(e){
     var currentTime = e.time;
     $("#pause").show();
     $("#play").hide();
     $('.mbYTP_wrapper').removeClass('active');

  });

  $('#bgndVideo').on("YTPUnstarted",function(e){
     var currentTime = e.time;
     $("#pause").hide();
     $("#play").show();
     $('.mbYTP_wrapper').addClass('active');
  });
  $('#bgndVideo').on("YTPPause",function(e){
     var currentTime = e.time;
     $("#pause").hide();
     $("#play").show();
  });
  //debug functions
  $("#bgndVideo").on("YTPStart", function(){
      $("#eventListener").html("YTPStart");
      $("#eventListener").append(" :: (state= "+ $("#bgndVideo").getPlayer().getPlayerState()+")");
      $("#eventListener").append(" :: (quality= "+ $("#bgndVideo").getPlayer().getPlaybackQuality()+")");
  });
  $("#bgndVideo").on("YTPLoop", function(e){
      $("#eventListener").html("YTPLoop");
      $("#eventListener").append(" :: (state= "+ $("#bgndVideo").getPlayer().getPlayerState()+")");
      $("#eventListener").append(" :: "+ e.counter);
  });
  $("#bgndVideo").on("YTPEnd", function(){
      $("#eventListener").html("YTPEnd");
      $("#eventListener").append(" :: (state= "+ $("#bgndVideo").getPlayer().getPlayerState()+")");
      console.debug("YTPEnd")
  });
  $("#bgndVideo").on("YTPPause", function(){
      $("#eventListener").html("YTPPause");
      $("#eventListener").append(" :: (state= "+ $("#bgndVideo").getPlayer().getPlayerState()+")");
  });
  $("#bgndVideo").on("YTPBuffering", function(){
      $("#eventListener").html("YTPBuffering");
      $("#eventListener").append(" :: (state= "+ $("#bgndVideo").getPlayer().getPlayerState()+")");
  });

  $(".player").mb_YTPlayer({
      onReady: function(){
          $("#eventListener").append(" (Player is ready)");
          $(".console").show(); 
      }
  });


/*=================================================================
    Product Slider
=================================================================*/

    $(".product-slider").bxSlider({
        controls: false
    });

/*=================================================================
    gallery filter
=================================================================*/

    $(window).on('load', function() {
            // gallery 2 column (index 5)
            var $galleryFilter2c = $('.gallery-2column');
            $galleryFilter2c.isotope({
                filter: '*',
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
         
            $('.gallery-filter a').click(function(){
                $('.gallery-filter .active').removeClass('active');
                $(this).addClass('active');
         
                var selector = $(this).attr('data-filter');
                $galleryFilter2c.isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });
                return false;
            });

            // gallery 3 column (index 6)
            var $galleryFilter3c = $('.gallery-3column');
            $galleryFilter3c.isotope({
                filter: '*',
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
         
            $('.gallery-filter a').click(function(){
                $('.gallery-filter .active').removeClass('active');
                $(this).addClass('active');
         
                var selector = $(this).attr('data-filter');
                $galleryFilter3c.isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });
                return false;
            });

            //index 10
            var $galleryFilter = $('.gallery-filterable');
            $galleryFilter.isotope({
                filter: '*',
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
         
            $('.gallery-filter a').click(function(){
                $('.gallery-filter .active').removeClass('active');
                $(this).addClass('active');
         
                var selector = $(this).attr('data-filter');
                $galleryFilter.isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });
                return false;
            });

            //portfolio 3 col
            var $gallery3cols = $('.gallery-3cols');
            $gallery3cols.isotope({
                filter: '*',
                layoutMode: 'fitRows',
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
         
            $('.gallery-filter a').click(function(){
                $('.gallery-filter .active').removeClass('active');
                $(this).addClass('active');
         
                var selector = $(this).attr('data-filter');
                $gallery3cols.isotope({
                    filter: selector,
                    layoutMode: 'fitRows',
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });
                return false;
            });


            // gallery-masonry (index 7)
            var $galleryMasonry = $('.gallery-masonry');
            $galleryMasonry.isotope({
                filter: '*',
                itemSelector: '.col-xs-12',
                masonry: {
                  columnWidth: 0
                },
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
         
            $('.gallery-filter a').click(function(){
                $('.gallery-filter .active').removeClass('active');
                $(this).addClass('active');
         
                var selector = $(this).attr('data-filter');
                $galleryMasonry.isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });
                return false;
            });

            // gallery fullwidth (index 8)
            var $galleryFullwidth = $('.gallery-fullwidth');
            $galleryFullwidth.isotope({
                filter: '*',
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
         
            $('.gallery-filter a').click(function(){
                $('.gallery-filter .active').removeClass('active');
                $(this).addClass('active');
         
                var selector = $(this).attr('data-filter');
                $galleryFullwidth.isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });
                return false;
            });


            // staff filtering (team member.php)
            var $galleryFullwidth = $(".staff-filtering");
            $galleryFullwidth.isotope({
                filter: "*",
                animationOptions: {
                    duration: 750,
                    easing: "linear",
                    queue: false
                }
            });
         
            $(".gallery-filter a").click(function(){
                $(".gallery-filter .active").removeClass("active");
                $(this).addClass('active');
         
                var selector = $(this).attr("data-filter");
                $galleryFullwidth.isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: "linear",
                        queue: false
                    }
                });
                return false;
            });
    });


    // staff filtering (team member.php)
    var $shopFilter = $(".shop-wrapper");
    $shopFilter.isotope({
        filter: "*",
        animationOptions: {
            duration: 750,
            easing: "linear",
            queue: false
        }
    });


    $(".filter-cat a").click(function(){
        $('#expander-details').slideUp('slow');
        $('.pd-box').css({
            marginBottom: 0
        })
        $(".filter-cat .active").removeClass("active");
        $(this).addClass('active');
 
        var selector = $(this).attr("data-filter");
        $shopFilter.isotope({
            filter: selector,
            animationOptions: {
                duration: 750,
                easing: "linear",
                queue: false
            }
        });
        return false;
    });
 

    $(".spn_link").on("click",function(){
        $("#expander-details").slideUp(0);

        $(".spn_link").removeClass("current_action");
        $(this).addClass("current_action");
        var data = {
            currentPosition: parseInt($(".current_action").closest(".pd-box").offset().top),
            parrentHeight: parseInt($(".current_action").closest(".pd-box").innerHeight()),
            ajaxContentHeight: parseInt($("#expander-details").height()),
            id: $(this).closest(".chkProductID").attr("data-product-id")
        }
        $(".pd-box").css({
            marginBottom: 0
        })
        $(".pd-box").each(function(){
            var thisOffset = parseInt($(this).offset().top);
            if( thisOffset == parseInt($(".current_action").closest(".pd-box").offset().top)) {
                $(this).css({
                    marginBottom: data.ajaxContentHeight
                })
            }
        });

        var setTime = setInterval(function(){
            $("html, body").stop().animate({
                scrollTop: (parseInt($(".current_action").closest(".pd-box").offset().top))+220
            }, 1500, "easeInOutExpo");
            $("#expander-details").css({
                top: parseInt($(".current_action").closest(".pd-box").offset().top) + data.parrentHeight,
            }).slideDown(1000,function(){
                checkCompareId(data.id);
            });
            clearInterval(setTime);
        },500);
        
        // appear data product ID in compare button
        $(".enable_-_compare").attr("data-product-id",data.id)
        $shopFilter.isotope({"layout":"masonry"});
        return false;
    });

    $("body").on("click", ".enable_-_compare", function(){
        var data = {
            id: $(this).closest(".chkProductID").attr("data-product-id")
        }
        // appear data product ID in compare button
        $(this).attr("data-product-id",data.id)
    });

    if ($(".enable_-_compare").hasClass("added")) {
        $(".enable_-_compare").on("click", function(event) {
            event.preventDefault();
            return false;
        });
    };

    $("body").on("click",".expander-close",function(event){
        event.preventDefault();
        $(".portfolio-item").removeClass("current_item");
        $("#expander-details").slideUp("slow");
         $(".pd-box").each(function(){
            $(this).animate({
                marginBottom: 0
            },"slow",function(){
                $shopFilter.isotope({"layout": "masonry"});
                $("html, body").stop().animate({
                    scrollTop: (parseInt($(".current_action").closest(".pd-box").offset().top))-130
                }, 1500, "easeInOutExpo");
            })
        })
    });
    // end product expander

    var compareItemCount = $(".compareProductList li").length;

    $("body").on("click", ".enable_-_compare", function(event) {
        event.preventDefault();
        $(".compare-basket").addClass("is-open");
        var currentItem = {
            id: $(this).attr("data-product-id"),
            added: false
        }
        $(".compareProductList li").each(function(index, el) {
            if($(this).attr("data-product-id") == currentItem.id){
                currentItem.added = true;
            }
        });

        if(currentItem.added != true){
            var compareItemCount = $(".compareProductList li").length;
            if (compareItemCount < 6)  {
                $(".compare-basket .compareProductList").append('<li data-product-id="'+currentItem.id+'"><img src="img/shop/thumb.png" alt=""><button><i class="fa fa-remove"></i></button></li>');
            };
            var compareItemCount = $(".compareProductList li").length;
            if (compareItemCount >=6)  {
                $(".compare-basket").addClass("basket-full");
            }
            if ( compareItemCount > 1 ) {
                $(".compare-basket").addClass("compare-active");
            }
        }
        checkCompareId(currentItem.id,$(this));
    });

    $(".compare-action").on("click", function(event) {
        event.preventDefault();
        $(".compare-basket").removeClass("is-open");
    });


    $("body").on("click", ".compareProductList li button", function(event) {
        event.preventDefault();
        var ob = {
            id:$(this).closest('li').attr('data-product-id')
        }
        $(this).closest("li").remove();
        removeCompare(ob.id);

        var compareItemCount = $(".compareProductList li").length;
        if (compareItemCount <=6)  {
            $(".compare-basket").removeClass("basket-full");
        }
        if (compareItemCount < 2 ) {
            $(".compare-basket").removeClass("compare-active");
        }
        if (compareItemCount < 1 ) {
            $(".compare-basket").removeClass("is-open")
        }
    });

    // shop page product sizing select 
    $(".selectbox").selectbox();

    /*===================================
        Home Shop single
    ======================================*/

    $(".related-product-carousel").owlCarousel({
        loop: true,
        items : 4,
        autoplay: false,
        dots: false,
        nav: true,
        margin: 30,
        smartSpeed: 800,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            // breakpoint from 0 up
            0 : {
                items     : 1
            },
            // breakpoint from 480 up
            480 : {
                items     : 1
            },
            // breakpoint from 768 up
            768 : {
                items     : 2
            },
            // breakpoint from 1050 up
            1050 : {
                items     : 4
            }
        }
    });


    /*===================================
        Shop Checkout
    ======================================*/

    $("#select-country").selectize();

    $("input#createaccount").on("click", function() {
        if($(this).is(":checked")) {
            $(".form-group.account-password").slideDown("slow");
        }
        else{
            $(".form-group.account-password").slideUp("slow");
        }
    });

    $("input#shipping_toggle").on("click", function() {
        if($(this).is(":checked")) {
            $("#select-country2").selectize();
            $(".different_shipping-address").slideDown("slow");
        }
        else{
            $(".different_shipping-address").fadeOut("slow");
        }
    });

    $("a.showlogin").on("click", function(event) {
        event.preventDefault();
        $(".shop-login-form").slideToggle("slow")
    });

    $("a.showcoupon").on("click", function(event) {
        event.preventDefault();
        $(".checkout--coupon").slideToggle("slow")
    });

    $(".payment_methods li .input-radio").on("click", function() {
        if($(this).is(":checked")) {
            $(this).find(".payment_box").slideDown("slow");
        }
        else{
            $(this).find(".payment_box").fadeOut("slow");
        }
    });


    /*===================================
        Home Shop 2
    ======================================*/

    $(".nav-header .nav-burger").on("click", function() {
        $(this).closest(".shop-intro-wrapper").toggleClass("active")
    });

    $(".shop-search form span").on("click", function() {
        $(".shop-search").toggleClass("active");
        //$(".shop-search form input[type='text']").focus();
    });

    if ($(".shop-search").hasClass("active")) {
        $(document).on("click", function() {
            $(".shop-search").removeClass("active");
        });
    };

    $(".shopCatList li a").on("click", function(event) {
        event.preventDefault();
        $(this).closest(".shop-_-intro").addClass("active");
        $(this).closest(".shopLeft").slideUp(1450);
        $(".shop-_-intro .shopRight").fadeOut(1450,function(){
            $(".shop-_-intro").fadeOut();
        });
    });

    $(".shop-nav li.shop-nav-cat > a").on("click", function(event) {
        event.preventDefault();
        $(".shop-intro-wrapper").removeClass("active");
        $(".shop-_-intro").removeClass("active").fadeIn();;
        $(".shop-_-intro .shopLeft").slideDown(1450);
        $(".shop-_-intro .shopRight").fadeIn(1450);
    });

    $(".customScrollBar").niceScroll({
        cursorwidth: "1px",
        cursorborder: 0
    });

    $("body").on("click", ".singlePdDetails", function(event) {
        event.preventDefault();
        $(".shopSinglePage ").fadeIn(900);
        $(".shopSinglePage ").addClass("active");

        $(".shopSingleRPCarousel").owlCarousel({
            items: 2,
            nav: true,
            loop: true,
            dots: false,
            margin: 40,
            mouseDrag: false,
            smartSpeed: 800,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            responsive: {
                // breakpoint from 0 up
                // breakpoint from 768 up
                768 : {
                    items     : 1
                }
            }
        });
    });

    $("body").on("click", "a.closeShopSingle", function(event) {
        event.preventDefault();
        $(".shopSinglePage ").removeClass("active")
        $(".shopSinglePage ").fadeOut(900);
    });

    //masonry blog post landing page
    $(".masonry-2col").masonry({
        itemSelector: ".col-xs-12",
        columnWidth: 0
    });

    //masonry blog post landing page
    /*$(".timeline-blog > .posts-section").masonry({
        columnWidth: 0,
        itemSelector: ".post-entry"
    });

    $(".post-entry").each(function(){
        var test = $(this);
        var pos = jQuery(this).position();
        if(pos.left!='0'){
            $(this).addClass("right_con");
        }
        else{
            $(this).addClass("left_con");
        }
    });*/

    /*---------------- Home Shop 3 --------------*/

    $( ".priceRange" ).slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0, 300 ],
        slide: function( event, ui ) {
            $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
    });
    $( "#amount" ).val( "$" + $( ".priceRange" ).slider( "values", 0 ) +
      " - $" + $( ".priceRange" ).slider( "values", 1 ) );

    $('body').on('click','.close-product',function(e){
        $('.portfolio-item').removeClass('current_item');
        $('.portfolio_details').slideUp('slow');
        $('#portfolio_details').slideUp('slow');
        return false;
    });

    /*-----------------------------------------------
        SHop 4 
    -------------------------------------------------*/
    // append dropdown sign
    $(".product-categories.type2 li a").each(function() {
        if($(this).next().is("ul.children")){
            $(this).append('<i class="fa fa-angle-right"></i>');
            if ( windowWidth.value < 768 ) {
                //change the dropdown icon, right arrow to down arrow
                $(this).children(".fa-angle-right").addClass("fa-angle-down");
            }
        }
    });

    $(".product-categories.type2 li a").on("click", function(event) {
        if ( windowWidth.value < 768 ) {
            if($(this).next().is(".children")){
                event.preventDefault();
                // slide down menu in mobile on click
                $(this).next("ul").slideToggle("slow")
            }
        }
    });


    $(".product-colors .color-options li").each(function() {
        //get the color from data-color
        var colorName = $(this).attr("data-color-name");

        $(this).children("span").css("background-color", colorName);
        $(this).on("click", function() {
            $(this).parent().children().removeClass("active");
            $(this).addClass("active");
            $(this).parents().eq(2).next(".product-sizes").addClass("active");
        });
        //$(this).parent().children().css("border-color", "transparent");
    });

    $(".product-colors .color-options li").on("click",function() {
       var colorName = $(this).attr("data-color-name");

        $(this).parent().children().css("border-color", "transparent");
        $(this).css("border-color", colorName);
    });

    $(".product-sizes .size-list li").on("click", function() {
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
        //$(this).parents().eq(2).next(".cart-btn").slideDown("slow");
        $(this).closest(".productItem").addClass("active");
    });

    $(".productItem .itemHover .closehover").on("click", function() {
        $(this).closest(".productItem").removeClass("active");
        $(this).parent(".itemHover").find(".color-options li").removeClass("active").removeAttr("style");
        $(this).parent(".itemHover").find(".product-sizes").removeClass("active");
        $(this).parent(".itemHover").find(".product-sizes li").removeClass("active");
    });

    /*=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=--=
        Magnific popup init 
    =-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=--=*/
    
    // product lightbox wedding page
    $(".ajax-view").magnificPopup({
        type: "ajax"
    });

    // Image popups with gallery
    $(".image-popup-zoomin").magnificPopup({
        type: "image",
        removalDelay: 500, //delay removal by X to allow out-animation
        gallery: {
          enabled: true, // set to true to enable gallery
           arrowMarkup: '<button title="%title%" type="button" class="fa fa-angle-%dir%"></button>', // markup of an arrow button
        },
        callbacks: {
            beforeOpen: function() {
                $(".mfp-bg").addClass("mfp-bg-white");
                // just a hack that adds mfp-anim class to markup
                this.st.image.markup = this.st.image.markup.replace("mfp-figure", "mfp-figure mfp-with-anim");
                //this.st.image.markup = this.st.image.markup.addClass("mfp-bg-white");
                this.st.mainClass = this.st.el.attr("data-effect");

            }
        },
        closeOnContentClick: true,
        midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });

    //popup_iframe
    $(".popup-iframe").magnificPopup({
        disableOn: 200,
        type: "iframe",
        removalDelay: 160,
        preloader: false,

        fixedContentPos: false
    });

    //mpopup_inline
    $(".popup-inline").magnificPopup({
        type: "inline",

        fixedContentPos: false,
        fixedBgPos: true,

        overflowY: "auto",

        closeBtnInside: true,
        preloader: false,
        
        midClick: true,
        removalDelay: 300,
        mainClass: "my-mfp-zoom-in"
    });

    //zoom product image
    $(".zoom-img").zoom();


    var currentDate = new Date("Sat Jul 13 2017 20:38:31 GMT+0600 (Central Asia Standard Time)");

     $("div#clock").countdown(55 * 24 * 60 * 60 * 1000 + currentDate.valueOf(), function(event) {
        $this = $(this);
        switch(event.type) {
            case "seconds":
            case "minutes":
            case "hours":
            case "days":
            case "weeks":
            case "daysLeft":
            $this.find("h2#"+event.type).html(event.value);
            break;
            case "finished":
            $this.fadeTo("slow", .5);
            break;
       }
    });

    $(".rsvp").selectbox();


/*=================================================================
    RSVP Form Submit
=================================================================*/

    $(".rsvp-form").validate({
        
        rules: {
            yourname: {
                required: true
            },
            youremail: {
                required: true,
                email: true
            },
            attending: {
                required: true
            },
            guest: {
                required: true
            }
        },
        messages: {
            yourname: {
                required: "Please write your name"
            },
            youremail: {
                required: "Please enter your email"
            },
            attending: {
                required: "Please select the perty"
            },
            guest: {
                required: "Please mention that how many guest with you"
            }
        },
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                type:"POST",
                data: $(form).serialize(),
                url:"rsvp.php",
                success: function() {
                    $(".rsvp-form").fadeTo( "slow", 1, function() {
                        $(".rsvp-form .success").slideDown();
                    });
                },
                error: function() {
                    $(".rsvp-form").fadeTo( "slow", 1, function() {
                        $(".rsvp-form .failed").slideDown();
                    });
                }
            });
        }
    });


/*=================================================================
    Team Carousel
=================================================================*/

    $(".team-carousel").owlCarousel({
        loop: true,
        items : 4,
        autoplay: true,
        dots: false,
        margin: 30,
        nav: true,
        smartSpeed: 800,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            // breakpoint from 0 up
            0 : {
                items     : 1
            },
            // breakpoint from 480 up
            480 : {
                items     : 1
            },
            // breakpoint from 768 up
            768 : {
                items     : 2
            },
            // breakpoint from 1050 up
            1050 : {
                items     : 4
            }
        }
    });

/*=================================================================
    Client Carousel
=================================================================*/

    $(".client-list").bxSlider({
        controls: false,
        autoHover: true,
        minSlides: 1,
        maxSlides: 4,
        slideWidth: 300,
        slideMargin: 20,
        pager: false,
        moveSlides: 1,
        auto: true
    });

/*=================================================================
    Testimonial carousel fullwidth
=================================================================*/

    $(".testimonial-fullwidth").bxSlider({
        controls: false,
        autoHover: true,
        minSlides: 1,
        moveSlides: 1,
        slideMargin: 30,
        //slideWidth: dynamicWidth('.testimonial-fullwidth'),
        maxSlides: 2,
        touchEnabled: false,
        auto: true
    });

/*=================================================================
    Client page carousel
=================================================================*/

    $(".page-client-carousel").bxSlider({
        controls: true,
        autoHover: true,
        minSlides: 1,
        moveSlides: 1,
        slideWidth: 290,
        pager: false,
        slideMargin: 30,
        maxSlides: 4,
        touchEnabled: true,
        auto: false
    });

/*=================================================================
    Client page carousel
=================================================================*/

    $(".service-carousel").owlCarousel({
        loop: true,
        items : 3,
        autoplay: true,
        dots: false,
        margin: 30,
        nav: true,
        smartSpeed: 800,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            // breakpoint from 0 up
            0 : {
                items     : 1
            },
            // breakpoint from 480 up
            480 : {
                items     : 1
            },
            // breakpoint from 768 up
            768 : {
                items     : 2
            },
            // breakpoint from 1050 up
            1050 : {
                items     : 3
            }
        }
    });

/*=================================================================
    Client page carousel
=================================================================*/

    $(".portfolio-carousel").owlCarousel({
        loop: true,
        items : 4,
        autoplay: true,
        dots: false,
        nav: true,
        smartSpeed: 800,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            // breakpoint from 0 up
            0 : {
                items     : 1
            },
            // breakpoint from 480 up
            480 : {
                items     : 1
            },
            // breakpoint from 768 up
            768 : {
                items     : 2
            },
            // breakpoint from 1050 up
            1050 : {
                items     : 4
            }
        }
    });


/*=================================================================
    client carousel 2
=================================================================*/

    $(".client-carousel-2").bxSlider({
        controls: true,
        autoHover: true,
        minSlides: 1,
        moveSlides: 1,
        slideWidth: 270,
        pager: false,
        slideMargin: 30,
        maxSlides: 4,
        touchEnabled: true,
        auto: true
    });


/*=================================================================
    Testimonial Slider
=================================================================*/

    $(".testimonial-slider").bxSlider({
        controls: false,
        autoHover: true,
        touchEnabled: true,
        pager: true,
        auto: true
    });

    $(".testimonial2").bxSlider({
        controls: true,
        autoHover: true,
        touchEnabled: true,
        pager: false,
        auto: true,
        prevText: '<i class="fa fa-angle-left"></i>',
        nextText: '<i class="fa fa-angle-right"></i>'
    });

    //index 10
    var bxliders = $("#client-review").bxSlider({
        mode: 'horizontal',
        auto: false,
        controls: false,
        pager: true,
        onSlideBefore: function(){
            $('.client-item').removeClass('client_active');
            var dataSlide = bxliders.getCurrentSlide();
            $('.client-item').each(function(){
                if(dataSlide == parseInt(($(this).attr('data-slide')))){
                    $(this).addClass('client_active');
                }
            })
        }
    });
    $('.client-item').on('click',function(){
        $('.client-item').removeClass('client_active');
        var dataSliderNo = $(this).attr('data-slide');
        dataSliderNo = parseInt(dataSliderNo);
        $(this).addClass('client_active');
        bxliders.goToSlide(dataSliderNo);
    });

/*=================================================================
    Corporate
=================================================================*/

    $(".corporate .service-item:not(.service-item.active)").on("mouseover", function() {
        $(".corporate .service-item.active").css("background-color", "#f1f1f1");
    });
    $(".corporate .service-item:not(.service-item.active)").on("mouseleave", function() {
        $(".corporate .service-item.active").css("background-color", "#ffffff");
    });

/*=================================================================
    Similar project carousel
=================================================================*/

    $(".similar-project").bxSlider({
        autoHover: true,
        minSlides: 1,
        maxSlides: 4,
        slideWidth: 310,
        slideMargin: 10,
        pager: false,
        moveSlides: 1,
        auto: true
    });

    $(".socialShare").prettySocial();

    var projectHeight = $(".similar-project-item").innerHeight();

    $(".similar-project .project-hover").css('height', projectHeight);

/*=================================================================
    widget-img-slideshow
=================================================================*/

    $(".widget-img-slideshow").bxSlider({
        pager: false,
        autoHover: true,
        touchEnabled: true,
        adaptiveHeight: true,
        auto: true
    });


/*=================================================================
    Accordion
=================================================================*/

    $('.eydia-ac .panel-heading .panel-title a').on('click', function() {
        $('.panel-heading').removeClass('active');
        $(this).parents('.panel-heading').addClass('active');
    });

    $('#faq .panel-heading a').on('click',function(e){
        if($(this).parents('.panel').children('.panel-collapse').hasClass('in')){
            e.preventDefault();
            e.stopPropagation();
        }
    });

/*=================================================================
    Remove Placeholder On click
=================================================================*/

    
    $('input').focusin(function(){
        $('input').data('holder',$(this).attr('placeholder'));
        $(this).attr('placeholder','');
    });
    $('input').focusout(function(){
        $(this).attr('placeholder',$(this).data('holder'));
    });
    $('textarea').focusin(function(){
        $('textarea').data('holder',$(this).attr('placeholder'));
        $(this).attr('placeholder','');
    });
    $('textarea').focusout(function(){
        $(this).attr('placeholder',$(this).data('holder'));
    });

/*=================================================================
    Back to top
=================================================================*/
    
    
    $(window).scroll(function () {
        if ($(window).scrollTop() > 400) {
            $("#go-top").fadeIn(500)
        } else {
            $("#go-top").fadeOut(500)
        }
    });
    $("#go-top").on('click', function () {
        $("html, body").stop().animate({
            scrollTop: 0
        }, 1500, "easeInOutExpo")
    });


/*=================================================================
    pricing switcher
=================================================================*/

    $(".p-monthly").on('click', function() {
        $(".p-yearly").removeClass('active');
        $(this).removeClass('active');
        $(this).addClass('active');
        $(".pricing-yearly").css('display', 'none');
        $(".pricing-monthly").css('display', 'block');
    });

    $(".p-yearly").on('click', function() {
        $(".p-monthly").removeClass('active');
        $(this).removeClass('active');
        $(this).addClass('active');
        $(".pricing-yearly").css('display', 'block');
        $(".pricing-monthly").css('display', 'none');
    });

    // mag tickerr / index37 
    $(".mag-ticker").flexslider({
        directionNav: false,
        controlNav: false,
        animation: "slide",
        direction: "vertical"
    });

    // featured slider / index37 
    $(".featured-slider").flexslider({
        controlNav: false,
        animation: "fade",
        prevText: '<i class="fa fa-angle-left"></i>',
        nextText: '<i class="fa fa-angle-right"></i>'
    });

    // featured slider / index37 
    $(".rc-carousel").owlCarousel({
        items: 3,
        nav: true,
        loop: true,
        margin: 15,
        dots: false,
        autoplay: false,
        smartSpeed: 600,
        mouseDrag: false,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0 : {
                items: 1
            },
            480 : {
                items: 1
            },
            768 : {
                items: 2
            },
            1050 : {
                items: 3
            }
        }
    });

    //buddypress

    $("#members-order-by").selectbox();


    /* Medical */

    var appointmentformHeight = $(".appointment").outerHeight();

    $(".appointment-form .make-appoint").on('click', function() {
        $(".make-appoint i").toggleClass(" fa-caret-up");
        $(".appointment").slideToggle();
    });

    $(".datepicker").datepicker({
        minDate: 0,
    });

    $(".datepicker2").datepicker({
        minDate: 0,
    });

    $(".timepicker1").timepicker();
    $(".timepicker2").timepicker();

    $(".search-tab-nav .toggle-form").on('click', function() {
        $(".tab-content").slideToggle();
        $(".search-tab-nav").toggleClass("opened");
        $(".toggle-form i").toggleClass("fa-angle-down");
    });

    /*======================================
        Personal 2
    ========================================*/

    $(".service-block").on("click", function() {
        $(this).children().children(".sb-hover").fadeToggle("slow");
        $(this).siblings().children().children(".sb-hover").fadeOut("slow");
    });


    /*======================================
        Travel page promo form validation
    ========================================*/
    $(".promo-form").validate({
        rules: {
            name: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            person: {
                required: true
            },
            date: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Please write your name"
            },
            email: {
                required: "Please enter your email"
            },
            person: {
                required: "Please how meny person travel"
            },
            date: {
                required: "Please select travel date"
            }
        },
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                type: "POST",
                data: $(form).serialize(),
                url : "promo-form.php",
                success: function() {
                    //$('.promo-form :input').attr('disabled', 'disabled');
                    $('.promo-form').fadeTo( "slow", 1, function() {
                        //$(this).find(':input[type="submit"]').attr('disabled', 'disabled');
                        //$(this).find('label').css('cursor','default');
                        $('.promo-form .success').slideDown();
                    });
                },
                error: function() {
                    $('.promo-form').fadeTo( "slow", 1, function() {
                        $('.promo-form .failed').slideDown();
                    });
                }
            });
        }
    });

    /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        Travel 2
    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

    $(".reload-map").on("shown.bs.tab", function() {
        googleMap();
    });

    $(".reload-map").on("shown.bs.collapse", function() {
        googleMap();
    });



    // Medical Appointment form
    $(".appointment").validate({
        rules: {
            name: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            message: {
                required: true
            },
            date: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Please write your name"
            },
            email: {
                required: "Please enter your email"
            },
            message: {
                required: "Please select the perty"
            },
            date: {
                required: "Please mention that how many guest with you"
            }
        },
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                type:"POST",
                data: $(form).serialize(),
                url:"rsvp.php",
                success: function() {
                    //$('.rsvp-form :input').attr('disabled', 'disabled');
                    $('.rsvp-form').fadeTo( "slow", 1, function() {
                        //$(this).find(':input[type="submit"]').attr('disabled', 'disabled');
                        //$(this).find('label').css('cursor','default');
                        $('.rsvp-form .success').slideDown();
                    });
                },
                error: function() {
                    $('.rsvp-form').fadeTo( "slow", 1, function() {
                        $('.rsvp-form .failed').slideDown();
                    });
                }
            });
        }
    });

    /*Business 2 */

    $(".slide-search .search-sub").on("mouseover", function() {
        $(".header-search").addClass("active");
        $(".slide-search .search-field").focus();
    });

    $(".slide-search .search-sub, .slide-search .search-field").on("mouseleave", function() {
        if( $(".slide-search .search-field").val().length == 0  && !$(".slide-search .search-field").focus()) {
            $(".header-search").removeClass("active");
        }
    });
   $(".slide-search .search-field").on("focusout", function() {
        if( $(".slide-search .search-field").val().length == 0) {
            $(".header-search").removeClass("active");
        }
    });

    $(".one-slide").owlCarousel({
        loop:true,
        items: 1,
        dots: false,
        autoplay: true,
        autoplayHoverPause: true
    });

    $(".one-slide-control").owlCarousel({
        items: 1,
        nav: true,
        loop: true,
        dots: false,
        autoplay: true,
        mouseDrag: false,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
    });

    $(".two-slide-control").owlCarousel({
        items: 2,
        nav: true,
        loop: true,
        dots: false,
        margin: 40,
        mouseDrag: false,
        smartSpeed: 1200,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
    });

    $(".one-slide-anim").owlCarousel({
        items: 1,
        nav: true,
        loop: true,
        dots: false,
        autoplay: true,
        smartSpeed: 900,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
    });

    var carouselS  = $(".fourSlidesOwl");
    var carouselOptions = {
            items: 4,
            nav: true,
            loop: true,
            margin: 30,
            dots: false,
            autoplay: false,
            mouseDrag: false,
            smartSpeed: 600,
            autoplayHoverPause: true,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            responsive: {
                0 : {
                    items: 1
                },
                480 : {
                    items: 1
                },
                768 : {
                    items: 2
                },
                1050 : {
                    items: 3
                },
                1350 : {
                    items: 4
                }
            }
        };
    carouselS.owlCarousel(carouselOptions);

    $(".productCatNav a[data-toggle=\"tab\"]").on("shown.bs.tab", function (e) {

        carouselS.trigger("destroy.owl.carousel");
        $("body").find(".fourSlidesOwl").removeClass("owl-loaded");
        $("body").find(".fourSlidesOwl .owl-stage-outer").each(function() {
            var carouselMarkup = $(this).html();
            $(this).parent().html(carouselMarkup);
        });

        carouselS.owlCarousel(carouselOptions);
    });


    $(".carousel-event").owlCarousel({
        items: 3,
        nav: true,
        loop: true,
        margin: 30,
        dots: false,
        autoplay: true,
        mouseDrag: false,
        smartSpeed: 600,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0 : {
                items: 1
            },
            480 : {
                items: 1
            },
            768 : {
                items: 2
            },
            1050 : {
                items: 3
            }
        }
    });

    $(".tweet-carousel").owlCarousel({
        items: 1,
        nav: true,
        loop: true,
        dots: false,
        autoplay: false,
        mouseDrag: false,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>']
    });

    $(".agency-prtflo").each(function(){
        var bgcolor = $(this).attr("data-hover-color");
        var contentcolor = $(this).attr("data-content-color");
        $(this).find(".portfolio-desc").css({
            "background-color": bgcolor
        });
        $(this).find(".portfolio-desc-inner").css({
            "color": contentcolor
        });
        $(this).find(".portfolio-desc span a").css({
            "color": contentcolor,
            "border-color": contentcolor
        });
    });

    // college popover
    $(".course-popup").popover();

    /*=================================================================
        Donation form validation
    =================================================================*/

    $(".donate--form").validate({
        rules: {
            fname: {
                required: true
            },
            lname: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true
            },
            address: {
                required: true
            },
            note: {
                required: false
            }
        },
        messages: {
            fname: {
                required: "Please write your name"
            },
            lname: {
                required: "Please write your last name"
            },
            email: {
                required: "Please enter your email"
            },
            phone: {
                required: "Please write your phone number"
            },
            address: {
                required: "Please write your address"
            }
        },
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                type:"POST",
                data: $(form).serialize(),
                url:"rsvp.php",
                success: function() {
                    $('.donate--form').fadeTo( "slow", 1);
                },
                error: function() {
                    $('.rsvp-form').fadeTo( "slow", 1, function() {
                        $('.rsvp-form .failed').slideDown();
                    });
                }
            });
        }
    });

    /*=================================================================
        Map Form validation
    =================================================================*/

    $(".map-form").validate({
        rules: {
            name: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            message: {
                required: true
            },
        },
        messages: {
            name: {
                required: "Please write your name"
            },
            email: {
                required: "Please enter your email"
            },
            message: {
                required: "Please write your message"
            }
        },
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                type:"POST",
                data: $(form).serialize(),
                url:"rsvp.php",
                success: function() {
                    //$('.rsvp-form :input').attr('disabled', 'disabled');
                    $('.donate--form').fadeTo( "slow", 1, function() {
                        //$(this).find(':input[type="submit"]').attr('disabled', 'disabled');
                        //$(this).find('label').css('cursor','default');
                        //$('.rsvp-form .success').slideDown();
                    });
                },
                error: function() {
                    $('.rsvp-form').fadeTo( "slow", 1, function() {
                        $('.rsvp-form .failed').slideDown();
                    });
                }
            });
        }
    });

    $("#webticker").webTicker();

    
    $(".news-box-carousel").owlCarousel({
        loop: true,
        items : 3,
        autoplay: false,
        dots: false,
        nav: true,
        autoplayHoverPause: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            // breakpoint from 0 up
            0 : {
                items     : 1
            },
            // breakpoint from 480 up
            480 : {
                items     : 1
            },
            // breakpoint from 768 up
            768 : {
                items     : 3
            }
        }
    });


    /*
     * FP Carousel
     * for blog2.php
     *
     **/

    $(".fp-carousel").owlCarousel({
        items: 4,
        nav: true,
        loop: true,
        dots: false,
        autoplay: false,
        mouseDrag: false,
        autoplayHoverPause: true,
        autoWidth:true,
        smartSpeed: 1000,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        onInitialized: function () {
            $(".fp-item .fp-excerpt").each(function(){
                var fpText = $(this).height();
                $(this).css("margin-bottom", (-fpText-14));
            })
        },
        responsive: {
            0 : {
                items: 1
            },
            480 : {
                items: 1
            },
            768 : {
                items: 2
            },
            1150 : {
                items: 4
            }
        }
    });


    /**
    *   Restaurant Reservation Form Validation
    */
    $(".reservation-form").validate({
        rules: {
            name: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                digits: true,
                minlength: 8
            },
            date: {
                required: true
            },
            time: {
                required: true
            },
            person: {
                required: true,
                digits: true
            }
        },
        messages: {
            name: {
                required: "You have a name, don't you?"
            },
            email: {
                required: "No email, no reservation"
            },
            phone: {
                required: "No phone, no reservation",
                digits: "Phone must be numeric character",
                minlength: "Phone number seems invalid"
            },
            time: {
                required: "Ohh, select the time"
            },
            date: {
                required: "Date seems invalid"
            },
            person: {
                required: "How many guest with you?",
                digits: "Person must be numeric character"
            }
        },
        submitHandler: function(form) {
            $(form).ajaxSubmit({
                type:"POST",
                data: $(form).serialize(),
                url:"restaurant-reservation.php",
                success: function() {
                    //$('.rsvp-form :input').attr('disabled', 'disabled');
                    $(".reservation-form").fadeTo( "slow", 1, function() {
                        //$(this).find(':input[type="submit"]').attr('disabled', 'disabled');
                        //$(this).find('label').css('cursor','default');
                        $(".reservation-area .success").slideDown();
                    });
                },
                error: function() {
                    $(".reservation-form").fadeTo( "slow", 1, function() {
                        $(".reservation-area .failed").slideDown();
                    });
                }
            });
        }
    });

    /*==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-
        Restarunt 2
    ==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-==-*/

    var contentSections = $(".cd-section"),
        navigationItems = $("#cd-vertical-nav a");

    updateNavigation();
    $(window).on("scroll", function(){
        updateNavigation();
    });

    //smooth scroll to the section
    navigationItems.on("click", function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
    });
    //smooth scroll to second section
    $(".cd-scroll-down").on("click", function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
    });

    //open-close navigation on touch devices
    $(".touch .cd-nav-trigger").on("click", function(){
        $(".touch #cd-vertical-nav").toggleClass("open");
  
    });
    //close navigation on touch devices when selectin an elemnt from the list
    $(".touch #cd-vertical-nav a").on("click", function(){
        $(".touch #cd-vertical-nav").removeClass("open");
    });
    
    function updateNavigation() {
        contentSections.each(function(){
            $this = $(this);
            var activeSection = $('#cd-vertical-nav a[href="#'+$this.attr('id')+'"]').data("number") - 1;
            
            if ( ( $this.offset().top - $(window).height()/2 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height()/2 > $(window).scrollTop() ) ) {
                navigationItems.eq(activeSection).addClass("is-selected");
            }else {
                navigationItems.eq(activeSection).removeClass("is-selected");
            }

        });
    }
    /*
    $(window).scroll(function(){
        var temp ={
            position: $('#cd-vertical-nav').offset()
        } 
        $('.cd-section').each(function() {
         if(temp.position.top>=$(this).offset().top && temp.position.top<=($(this).offset().top+$(this).height()) ){
            $(this).addClass('activeTest');
            $('#cd-vertical-nav li span').css({
                'background-color': $(this).attr('data-nav-color')
            })
         }else{
            $(this).removeClass('activeTest');
         }
        });
    })*/
    $(window).scroll(function(){

        var navColor = $(".cd-section").attr("data-nav-color");

        if($(window).scrollTop()<=$(".slider-wrapper").height()){
            $("#cd-vertical-nav").fadeOut("slow");
        }else{
            $("#cd-vertical-nav").fadeIn("slow");
        }
        $("#cd-vertical-nav li").each(function() {
            var dataTemp = {
                top: $(this).offset().top,
                thisItem: $(this)
            }
            $(".cd-section").each(function() {
                if($(this).offset().top<=dataTemp.top && ($(this).offset().top + $(this).outerHeight())>=dataTemp.top){
                    dataTemp.thisItem.find("span").css("border-color",  $(this).attr("data-nav-color"));
                }
            });

        });
    })

    function smoothScroll(target) {
        $("body,html").animate({
            "scrollTop":target.offset().top - 100
        },600);
    };




})(jQuery);



$(function() {
    // post thumb slider
    $("ul.post-thumb").bxSlider({
        pager: false,
        adaptiveHeight: true,
        mode: "fade"
        //onSliderLoad: function(){}
    });

    // blog 2 column
    $(".blog-masonry").masonry({
        columnWidth: 0,
        itemSelector: '.col-xs-12'
    });

    // fun facts counting
    $(".fact-item").appear(function () {
        $(".fact-item [data-to]").each(function () {
            var e = $(this).attr("data-to");
            $(this).delay(6e3).countTo({
                from: 50,
                to: e,
                speed: 3e3,
                refreshInterval: 50
            })
        })
    });

    // single team stat counting
    $(".stat-item").appear(function () {
        $(".stat-item [data-to]").each(function () {
            var e = $(this).attr("data-to");
            $(this).delay(6e3).countTo({
                from: 50,
                to: e,
                speed: 3e3,
                refreshInterval: 50
            })
        })
    });

    // fun facts counting
    $('.pixelcoder_counter').countTo({
        speed: 800
    });


    // flickr feed

    $('.flickr-widget').jflickrfeed({
        limit: 9,
        qstrings: {
            id: '37304598@N02'
        },
        itemTemplate:
        '<li>' +
            '<a data-lightbox="flickr-feed" href="{{image}}" title="{{title}}">' +
                '<img src="{{image_m}}" alt="{{title}}">' +
            '</a>' +
        '</li>'
    });


    // flickr widget for multipage footer

    $('.flickr-footer').jflickrfeed({
        limit: 12,
        qstrings: {
            id: '37304598@N02'
        },
        itemTemplate:
        '<li>' +
            '<a data-lightbox="flickr-feed" href="{{image}}" title="{{title}}">' +
                '<img src="{{image_s}}" alt="{{title}}">' +
            '</a>' +
        '</li>'
    });

    // Progress bar
    //$(".progress .progress-bar").progressbar();

    // Counter Item
    $(".progress .progress-bar").appear(function () {
        $(".progress .progress-bar").progressbar();
    });

    $(".progress-set-5 .progress-bar").each(function () {
        if($(this).attr("data-transitiongoal") > "91") {
            $(this).parent(".progress").addClass("progress-full");
        }else{
            $(this).parent(".progress").removeClass("progress-full");
        }
    });

    $(".progress-set-3 .progress-bar").each(function(){
        if($(this).attr("data-transitiongoal") >= "92"){
            $(this).parent(".progress").addClass("progress-full");
        }else{
            $(this).parent(".progress").removeClass("progress-full");
        }
    });

    // Pie Chart
    $(".chart1").circliful();

    // Counter Item
    $(".counter-item").appear(function () {
        $(".counter-item [data-to]").each(function () {
            var e = $(this).attr("data-to");
            $(this).delay(6e3).countTo({
                from: 50,
                to: e,
                speed: 3e3,
                refreshInterval: 50
            })
        })
    });

    // Counter Item
    $(".timer-item").appear(function () {
        $(".timer-item [data-to]").each(function () {
            var e = $(this).attr("data-to");
            $(this).delay(6e3).countTo({
                from: 50,
                to: e,
                speed: 3e3,
                refreshInterval: 50
            })
        })
    });

});

$(".social_animation a i").on("mouseover",function(){
    $(".social_animation a span").removeClass("current");
    $(".social_animation a").each(function(){
        if($(this).hasClass("prev_color")){
            $(this).children("span").css("z-index", 3);
        }
        else{
            $(this).children("span").css("z-index","1")
        }
    });
    $(this).prev().css({
        "z-index" : 4
    }).addClass("current");

    $(this).prev("span").css({
        "width" : 0,
        "height" : 0,
        "margin" : "auto",
        "background-color": $(this).prev("span").attr("data-color")
    })
   $(this).prev("span").animate({
        "margin-left" : -2500,
        "margin-top" : -2500,
        "width" : 5000,
        "height" : 5000
    },2500)
})

$(".social_animation a i").on("mouseleave",function(){
    $(".social_animation a").removeClass("prev_color");
    $(this).parent().addClass("prev_color");
})

$(".social_animation").on("mouseleave",function(){
    $(".social_animation a span").each(function(){
        if($(this).hasClass("current")){
            $(this).animate({
                "width" : 0,
                "height" : 0,
                "margin" : 0
            },700)
        }else{
           $(this).animate({
                "width" : 0,
                "height" : 0,
                "margin" : 0
            },0) 
        }
    })
})

function checkCompareId(id,data){
    var cOptions ={
        id: id,
        added: false
    }
    if(typeof data !== "object")
        data = null;

     $(".compareProductList li").each(function(index, el) {
        if($(this).attr("data-product-id") == cOptions.id){
            cOptions.added = true;
        }
    });
     
    if(cOptions.added == true){
        if($.type(data) == "object"){
            data.addClass("added");
        } else {
            $(".enable_-_compare").addClass("added");
        }
        
    }else{
        if($.type(data) == "object"){
            data.removeClass("added");
        } else {
            $(".enable_-_compare").removeClass("added");
        }
    }
    return false;
}
function removeCompare(id){
    var cOptions ={
        id: id,
        added: false
    }
     $(".compareProductList li").each(function(index, el) {
        if($(this).attr("data-product-id") == cOptions.id){
            $(this).remove();
        }
    });
     
     $(".compareProductList li").each(function(index, el) {
        if($(this).attr("data-product-id") == cOptions.id){
            $(this).remove();
        }
    });
     
    $(".chkProductID").each(function(index, el) {
        if($(this).attr("data-product-id") == cOptions.id ){
            $(this).find(".enable_-_compare").removeClass("added");
        }
    });
    return false;
}

/* Canvas responsive */

function canvasResponsive() {
    $(".canvas-responsive").attr({
        "width": $(window).width(),
        "height": $(window).innerHeight()
    })
}
