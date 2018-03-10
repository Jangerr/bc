// Focus Slider Variablen

// Settings
var fs_fade_in_time = 400;                      // Zeit zum Einblenden des Sliders beim ersten Starten in ms
var fs_fade_in_easing = "easeInQuad";                // Nicht ohne Erfahrung anpassen
var fs_transition_easing = "easeInOutQuart";    // Übergangsanimationsart
var fs_container_ratio = 3;
var fs_time_transition = 1200;                  // Zeit für den Übergang
var fs_time_show_article = 10000;               // Übergangszeit in ms
var fs_title_max_length = 100;
var fs_description_max_length = 300;

// Interne Variablen
var fs_in_use = 0;
var fs_current_slide = 0;
var fs_frames = new Array();
var fsd_set_ratio_to;
var fs_showing_slide = 0;
fs_frames[0] = 'div[data-fs-frame=1]';
fs_frames[1] = 'div[data-fs-frame=2]';
var fs_current_frame = fs_frames[0];
var fs_next_frame = fs_frames[1];
var fs_image_relation = new Array();
fs_image_relation["x"] = "100% auto";
fs_image_relation["y"] = "auto 100%";
fs_pages = new Array();
var test;
// On Ready Functions
jQuery("document").ready(function () {

    // Focus Slider initialisieren
    focus_slider_initiate();
    
});
jQuery(window).resize(function () {

    // Resize Slider
    jQuery('[data-fs-main-container]').height(jQuery('[data-fs-main-container]').width() / fs_container_ratio);

    // Den Content Container zentrieren
    centerContent(jQuery("[data-fs-autocenter]"));

});

function focus_slider_initiate () {

    console.log("Initiating Slider");
    console.log("1.1: Resizing Mainframe");

    // Resize Slider
    jQuery('[data-fs-main-container]').height(jQuery('[data-fs-main-container]').width() / fs_container_ratio);

    /*
    // Loading Imagegery
    $.ajax({
        url: 'fs-load-images.php',
        async: false,
        method: 'post',
        data: { album: window.location.href.split("=")[1] },
        success: function (data) {
            fs_pages = JSON.parse(data);
        }
    });
    */

    fs_pages = local_data;
    console.log(fs_pages);
    // Not for production
    //load_offline_content();
    
    // PRELOADER BEFUELLEN
    console.log("1.2 Preloader Image wird geladen (" + fs_pages[0].image +")");
    $('[data-fs-image-preload]').attr("src", fs_pages[0].image);

    // Restliche Images preloaden
    for (var i = 1; i < fs_pages.length; i++ ){
        $(".preloading-images").append('<img alt="preloader Image" class="focus-slider-preloader-image" src="' + fs_pages[i].image + '">');
    }

    // Ersten Artikel laden
    console.log("1.3 Erster Frame wird befüllt.");
    fs_fill_frame(fs_current_slide, fs_current_frame);
    fs_fill_textarea(fs_current_slide, fs_current_frame);

    // mobile indicators aufbauen
    console.log("1.4 Mobile Indicators befüllen.");
    var fs_mobile_items = "";
    for (var i=0; i<fs_pages.length; i++) {
        fs_mobile_items += '<li></li>';
    }
    jQuery('.fs-mobile-indicators').append(fs_mobile_items);
    
    // mobile indicators
    fs_set_mob_indicators(fs_current_slide);

    // On Preloader Image load
    jQuery('[data-fs-image-preload]').on("load", function () {

        // Console
        console.log("1.5 Preloader wurde geladen");

        // Einblenden des Focus Sliders
        console.log("1.6 Content wird eingeblendet");
        $('[data-fs-mainframe]').fadeIn({ duration: fs_fade_in_time, easing: fs_fade_in_easing });

        // Den Content Container zentrieren
        centerContent(jQuery("[data-fs-autocenter]"));

        // Progress Slider aktivieren
        fs_progress_bar();

        // Mobile Buttons clickbar machen
        jQuery('.fs-mobile-indicators li').on('click', function () {
            fs_current_slide = jQuery('.fs-mobile-indicators li').index(this);
            fs_next();
        });

        var append_navi = "";

        // Fill Navi
        for (var index = 0; index < fs_pages.length; index++) {
            if (fs_pages[index].ratio > fs_container_ratio)
                item_ratio = fs_image_relation["y"];
            else
                item_ratio = fs_image_relation["x"];

            append_navi += '<div class="col-lg-2 fs-nav-cont"><div data-autoresize class="image-background colorfull-bg mb-4" style="background-size: ' + item_ratio + '; background-image: ' + fs_pages[index].image + '; cursor: pointer;"></div></div>';
        }
        jQuery('.fs-nav-insert').html(append_navi);

        // Nav item clickable
        jQuery('.fs-nav-cont').on('click', function () {
            fs_current_slide = jQuery('.fs-nav-cont').index(this) - 1;
            fs_next();
        });

        // Navi show
        $(".handlebar-container").on('click', function () {
            $(this).parent().toggleClass("active-nav");
        });

        // Autoresize
        jQuery('[data-autoresize]').each(function () {
            autoresize(jQuery(this), fs_container_ratio);
        });

        // Navi Klickbar 
        jQuery('[data-navi-item]').on('click', function () {
            var item_id = jQuery('[data-navi-item]').index(this);
            fs_current_slide = item_id;
            fs_next();
        });

        console.log("Slider has started:");

    });
    
}

function fs_next (direction) {

    // Check ob gerade ein Übergang stattfindet
    if (!fs_in_use) {

        console.log("Next wird ausgeführt");

        // Besetzt
        fs_in_use = 1;

        // Freigeben
        setTimeout(function () {
            fs_in_use = 0;
        }, fs_time_transition*1.4);

        console.log

        // Next & last Article
        if (direction == "next") {
            if (fs_pages.length > fs_current_slide + 1)
                fs_current_slide++;
            else
                fs_current_slide = 0;
        }
        if (direction == "last") {
            if (fs_current_slide == 0)
                fs_current_slide = fs_pages.length - 1;
            else
                fs_current_slide = fs_current_slide - 1;
        }

        console.log("loading item: " + fs_current_slide);

        // Nächstes Frame befüllen & Übergang
        fs_start_animation (fs_current_slide, fs_next_frame, fs_current_frame);

        // Frames wechseln
        fs_switch_frames();

        // mobile indicators
        fs_set_mob_indicators(fs_current_slide);

        // Slider erneut starten
        fs_progress_bar();

    }
}

// Center for Animation
function fs_start_animation(slide, next_frame, current_frame){

    console.log("Animaton Function called");
    fs_fill_frame(slide, next_frame);
    fs_move_textarea(slide, next_frame);
    fs_color_grading(slide, next_frame, current_frame);
    fs_frame_animation(slide, next_frame, current_frame);
}

// Move Text Content
function fs_move_textarea (slide, next_frame){

    // Move Up
    jQuery('[data-fs-prime-animation]').each(function () {
        var extraSpace = 0;
        if (jQuery('p', this).hasClass('read-more'))
            extraSpace = 30;

        jQuery(this).stop().animate({
            bottom: jQuery('p', this).height() + 10 + extraSpace
        }, {
            duration: fs_time_transition * 0.5,
            easing: 'easeInQuart',
            complete: function () {
                jQuery(this).css("bottom", jQuery('p', this).height() + 10 + extraSpace);
                fs_fill_textarea(slide, next_frame);
                centerContent(jQuery("[data-fs-autocenter]"));
            }
        }).delay(fs_time_transition * 0.5).animate({
            bottom: 0
        }, {
            duration: fs_time_transition * 0.4,
            easing: 'easeOutQuad'
        });
    });
}

// Frame filler
function fs_fill_frame(slide, frame) {

    console.log("FILL: Slider-item " + slide + "(" + fs_pages[slide].image + ")" + "in Frame " + frame);

    // Ratio des Bilder mit der des Frames abgleichen
    if (fs_pages[slide].ratio < fs_container_ratio)
        fs_set_ratio_to = fs_image_relation["x"];
    else
        fs_set_ratio_to = fs_image_relation["y"];

    // Neues Bild und Ratio ins next Frame geben
    jQuery(frame).css({ backgroundImage: 'url(' + fs_pages[slide].image + ')', backgroundSize: fs_set_ratio_to });

}

// Text filler
function fs_fill_textarea (slide, frame) {
    jQuery('[data-fs-prime-text]').eq(0).html(fs_pages[slide].source.name);
    jQuery('[data-fs-prime-text]').eq(1).html(fs_pages[slide].title.trunc(fs_title_max_length));
    jQuery('[data-fs-prime-text]').eq(2).html(fs_pages[slide].description.trunc(fs_description_max_length));
    jQuery('#read-more-id').attr('href', 'news/' + fs_pages[slide].url + '.html');
}

function fs_switch_frames () {
    
    // FRAMES WECHSELN
    if (fs_current_frame == fs_frames[0]) {
        fs_current_frame = fs_frames[1];
        fs_next_frame = fs_frames[0];
    }
    else {
        fs_current_frame = fs_frames[0];
        fs_next_frame = fs_frames[1];
    }
}
function fs_frame_animation(slide, next_frame, current_frame){

    /*
    $(current_frame).fadeOut(fs_time_transition, "linear", function () {
        $(next_frame).css("z-index", "3");
        $(this).css("z-index", "2").fadeIn(0);
    });
    */
    
    // FRAME SWITCH
    if (fs_current_slide >= fs_showing_slide) {

        $(fs_next_frame).stop().animate({ top: "0" }, { duration: fs_time_transition, easing: fs_transition_easing, complete: function () {
            $(this).css({ zIndex: 2 });
            // SHOWING VARIABLE ANPASSEN
            fs_showing_slide = fs_current_slide;
        }
        });
        
        $(fs_current_frame).stop().animate({ top: "200" }, { duration: fs_time_transition, easing: fs_transition_easing, complete: function () {
            $(this).css({ top: "-100%", zIndex: 3 });
        }
        }); 

    }
    else {
        $(fs_current_frame).stop().animate({ top: "-200" }, { duration: fs_time_transition, easing: fs_transition_easing, complete: function () {
            $(this).css({ top: "-100%", zIndex: 3 });
        }
        });
        $(fs_next_frame).stop().css("top", "100%").animate({ top: "0" }, { duration: fs_time_transition, easing: fs_transition_easing, complete: function () {
            $(this).css({ zIndex: 2 });
            // SHOWING VARIABLE ANPASSEN
            fs_showing_slide = fs_current_slide;
        }
        });
    }

}
function fs_color_grading(slide, next_frame, current_frame){

    // BLACK FADE IN / OUT
    jQuery(current_frame + " .fs-black-overlay").stop().animate({
        backgroundColor: "rgba(0,0,0,0.0)"
    }, {
        duration: fs_time_transition,
        easing: "easeOutSine"
    });
    $(next_frame + " .fs-black-overlay").css("background-color", "rgba(0,0,0,0.0)").stop().delay(fs_time_transition*0.8).animate({
        backgroundColor: "rgba(0,0,0,0.55)"
    }, {
        duration: fs_time_transition * 0.6,
        easing: "easeInSine"
    });
}
function fs_set_mob_indicators (slide) {
    jQuery('.fs-mobile-indicators li').removeClass('active').eq(slide).addClass('active');
}
function fs_progress_bar () {

    jQuery('.fs_progress_slider').stop().css("width", "0%").animate({
        width: "100%"
    }, {
        duration: fs_time_show_article,
        easing: "linear",
        complete: function () {
            fs_next("next");
        }
    });
}
function centerContent (element) {
    
    jQuery(element).css("margin-top", "-" + (jQuery(element).height() / 2) + "px");

}
function autoresize(element, ratio) {
    jQuery(element).height(jQuery(element).width() / ratio);
}
function load_offline_content(){

    console.log("OFFLINE VERSION WIRD GELADEN");
    fs_pages[0] = {
        image: "url(https://www.btc-echo.de/wp-content/uploads/2018/01/shutterstock_164384462.jpg)",
        images: "https://www.btc-echo.de/wp-content/uploads/2018/01/shutterstock_164384462.jpg",
        ratio: "1.7",
        catid: 3,
        source: "Handelsblatt",
        source_image: "",
        tags: "Olympia, Bitcoin,USA",
        desc: "Japans groesste Bank wird zur Krypto-Boerse",
        cont: "Anfang Januar hat Vitalik Buterin ein neues Konzept für Initial Coin Offerings (ICOs) vorgeschlagen, welches die Vorteile von dezentralen autonomen Organisationen (DAOs) ausnutzt."
    };
    fs_pages[1] = {
        image: "url(http://tribetica.com/wp-content/uploads/2018/01/dmm-bitcoin-launch-banner1-768x768.png)",
        images: "http://tribetica.com/wp-content/uploads/2018/01/dmm-bitcoin-launch-banner1-768x768.png",
        ratio: "1.7",
        catid: 3,
        source: "Krautreporter",
        source_image: "",
        tags: "Olympia, Bitcoin,USA",
        desc: "Presse-Echo: Der Bitcoin am Ende?",
        cont: "Anfang Januar hat Vitalik Buterin ein neues Konzept für Initial Coin Offerings (ICOs) vorgeschlagen, welches die Vorteile von dezentralen autonomen Organisationen (DAOs) ausnutzt."
    };
    fs_pages[2] = {
        image: "url(https://www.btc-echo.de/wp-content/uploads/2018/01/shutterstock_146573666.jpg)",
        images: "https://www.btc-echo.de/wp-content/uploads/2018/01/shutterstock_146573666.jpg",
        ratio: "1.7",
        catid: 3,
        source: "Bild.de",
        source_image: "",
        tags: "Olympia, Bitcoin,USA",
        desc: "TRONs Technical Team Keeps Growing — Former Alibaba Technical Expert Olivier Zhang Joins TRON",
        cont: "Anfang Januar hat Vitalik Buterin ein neues Konzept für Initial Coin Offerings (ICOs) vorgeschlagen, welches die Vorteile von dezentralen autonomen Organisationen (DAOs) ausnutzt."
    };
    fs_pages[3] = {
        image: "url(https://images.futurezone.at/46-104906457.jpg/300.217.480)",
        images: "https://images.futurezone.at/46-104906457.jpg/300.217.480",
        ratio: "1.7",
        catid: 3,
        source: "Focus",
        tags: "Olympia, Bitcoin,USA",
        source_image: "",
        desc: "Bundesbank-Vorstand: Kryptowährungen derzeit keine Gefahr für das staatliche Geldmonopol",
        cont: "Anfang Januar hat Vitalik Buterin ein neues Konzept für Initial Coin Offerings (ICOs) vorgeschlagen, welches die Vorteile von dezentralen autonomen Organisationen (DAOs) ausnutzt."
    };
    fs_pages[4] = {
        image: "url(https://cointelegraph.com/images/725_Ly9jb2ludGVsZWdyYXBoLmNvbS9zdG9yYWdlL3VwbG9hZHMvdmlldy82Mjk4OTliMWNmZTdkZmZiODczMzc4ZmFkZDc1Y2RiZC5qcGc=.jpg)",
        images: "https://cointelegraph.com/images/725_Ly9jb2ludGVsZWdyYXBoLmNvbS9zdG9yYWdlL3VwbG9hZHMvdmlldy82Mjk4OTliMWNmZTdkZmZiODczMzc4ZmFkZDc1Y2RiZC5qcGc=.jpg",
        ratio: "1.7",
        catid: 3,
        source: "Btc Echo",
        tags: "Olympia, Bitcoin,USA",
        source_image: "",
        desc: "Crypto Valley Association: ICO Code of Conduct",
        cont: "Anfang Januar hat Vitalik Buterin ein neues Konzept für Initial Coin Offerings (ICOs) vorgeschlagen, welches die Vorteile von dezentralen autonomen Organisationen (DAOs) ausnutzt."
    };
    fs_pages[5] = {
        image: "url(https://cdn.static-economist.com/sites/default/files/20171111_FNP504.jpg)",
        images: "https://cdn.static-economist.com/sites/default/files/20171111_FNP504.jpg",
        ratio: "1.7",
        catid: 3,
        source: "Handelsblatt",
        tags: "Olympia, Bitcoin,USA",
        source_image: "",
        desc: "Japans groesste Bank wird zur Krypto-Boerse",
        cont: "Anfang Januar hat Vitalik Buterin ein neues Konzept für Initial Coin Offerings (ICOs) vorgeschlagen, welches die Vorteile von dezentralen autonomen Organisationen (DAOs) ausnutzt."
    };
    fs_pages[6] = {
        image: "url(http://cdn-img.instyle.com/sites/default/files/styles/684xflex/public/1463166875/051316-One%26Only-Hotel-LEAD.jpg?itok=0hUciye2)",
        images: "http://cdn-img.instyle.com/sites/default/files/styles/684xflex/public/1463166875/051316-One%26Only-Hotel-LEAD.jpg?itok=0hUciye2",
        ratio: "1.7",
        catid: 3,
        source: "Bild.de",
        source_image: "",
        tags: "Olympia, Bitcoin,USA",
        desc: "TRONs Technical Team Keeps Growing — Former Alibaba Technical Expert Olivier Zhang Joins TRON",
        cont: "Anfang Januar hat Vitalik Buterin ein neues Konzept für Initial Coin Offerings (ICOs) vorgeschlagen, welches die Vorteile von dezentralen autonomen Organisationen (DAOs) ausnutzt."
    };
    fs_pages[7] = {
        image: "url(http://clipground.com/images/beautiful-mountain-sunrise-clipart-17.jpg)",
        images: "http://clipground.com/images/beautiful-mountain-sunrise-clipart-17.jpg",
        ratio: "1.7",
        catid: 3,
        source: "Handelsblatt",
        source_image: "",
        tags: "Olympia, Bitcoin,USA",
        desc: "Japans groesste Bank wird zur Krypto-Boerse",
        cont: "Anfang Januar hat Vitalik Buterin ein neues Konzept für Initial Coin Offerings (ICOs) vorgeschlagen, welches die Vorteile von dezentralen autonomen Organisationen (DAOs) ausnutzt."
    };
    fs_pages[8] = {
        image: "url(https://www.visitberlin.de/system/files/styles/visitberlin_teaser_full_width_visitberlin_mobile_1x/private/image/iStock_000074120341_Double_DL_PPT_0.jpg?itok=tD4ERppn)",
        images: "https://www.visitberlin.de/system/files/styles/visitberlin_teaser_full_width_visitberlin_mobile_1x/private/image/iStock_000074120341_Double_DL_PPT_0.jpg?itok=tD4ERppn",
        ratio: "1.7",
        catid: 3,
        source: "Handelsblatt",
        source_image: "",
        tags: "Olympia, Bitcoin,USA",
        desc: "After Japan, One More Country Hails Bitcoins, Calls Cryptocurrency Legal",
        cont: "Anfang Januar hat Vitalik Buterin ein neues Konzept für Initial Coin Offerings (ICOs) vorgeschlagen, welches die Vorteile von dezentralen autonomen Organisationen (DAOs) ausnutzt."
    };
    fs_pages[9] = {
        image: "url(https://www.visitberlin.de/system/files/styles/visitberlin_teaser_full_width_visitberlin_mobile_1x/private/image/iStock_000074120341_Double_DL_PPT_0.jpg?itok=tD4ERppn)",
        images: "https://www.visitberlin.de/system/files/styles/visitberlin_teaser_full_width_visitberlin_mobile_1x/private/image/iStock_000074120341_Double_DL_PPT_0.jpg?itok=tD4ERppn",
        ratio: "1.7",
        catid: 3,
        source: "Handelsblatt",
        source_image: "",
        tags: "Olympia, Bitcoin,USA",
        desc: "After Japan, One More Country Hails Bitcoins, Calls Cryptocurrency Legal",
        cont: "Anfang Januar hat Vitalik Buterin ein neues Konzept für Initial Coin Offerings (ICOs) vorgeschlagen, welches die Vorteile von dezentralen autonomen Organisationen (DAOs) ausnutzt."
    };
    console.log(fs_pages);
}