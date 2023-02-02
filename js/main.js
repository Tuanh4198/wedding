jQuery(document).ready(function ($) {
  // load top
  (function ($) {
    let up_btn = $("body .up");
    let body = $("body,html");
    up_btn.css({
      cursor: "pointer",
    });
    up_btn.click(function () {
      $("html,body").animate({ scrollTop: 0 }, 1000);
    });
    $(window).scroll(function (event) {
      let startpage = body.scrollTop();
      if (startpage > 200) {
        up_btn.addClass("up-active");
      } else if (startpage < 200) {
        up_btn.removeClass("up-active");
      }
    });
  })($);
  // end load top

  /* Timer */
  (function ($) {
    "use strict";
    $.fn.timer = function (options) {
      var defaults = {
        classes: ".countdown",
        layout:
          '<span class="day">%%D%%</span><span class class="colon">:</span><span class="hour">%%H%%</span><span class="colon">:</span><span class="min">%%M%%</span><span class="colon">:</span><span class="sec">%%S%%</span>',
        layoutcaption:
          '<div class="count-block days"><span class="day">%%D%%</span><span class="count-label">Days</span></div><div class="count-block hours"><span class="hour">%%H%%</span><span class="count-label">Hrs</span></div><div class="count-block minutes"><span class="min">%%M%%</span><span class="count-label">Mins</span></div><div class="count-block seconds"><span class="sec">%%S%%</span><span class="count-label">Secs</span></div>',
        leadingZero: true,
        countStepper: -1, // s: -1 // min: -60 // hour: -3600
        timeout: '<span class="timeout">Time out!</span>',
      };

      var settings = $.extend(defaults, options);
      var layout = settings.layout;
      var layoutcaption = settings.layoutcaption;
      var leadingZero = settings.leadingZero;
      var countStepper = settings.countStepper;
      var setTimeOutPeriod = (Math.abs(countStepper) - 1) * 1000 + 990;
      var timeout = settings.timeout;

      var methods = {
        init: function () {
          return this.each(function () {
            var $countdown = $(settings.classes, $(this));
            if ($countdown.length && !$countdown.hasClass("init")) {
              $countdown.addClass("init");
              methods.timerLoad($countdown);
            }
          });
        },

        timerLoad: function (el) {
          var gsecs = el.data("timer");
          if (isNaN(gsecs)) {
            var start = Date.parse(new Date());
            var end = Date.parse(gsecs);
            gsecs = (end - start) / 1000;
          }
          if (gsecs > 0) {
            methods.CountBack(el, gsecs);
          }
        },

        calcage: function (secs, num1, num2) {
          var s = (Math.floor(secs / num1) % num2).toString();
          if (leadingZero && s.length < 2) s = "0" + s;
          return "<b>" + s + "</b>";
        },

        CountBack: function (el, secs) {
          if (secs < 0) {
            el.html(timeout);
            return;
          }
          if (el.hasClass("caption")) {
            var timerStr = layoutcaption.replace(
              /%%D%%/g,
              methods.calcage(secs, 86400, 100000)
            );
          } else {
            var timerStr = layout.replace(
              /%%D%%/g,
              methods.calcage(secs, 86400, 100000)
            );
          }
          timerStr = timerStr.replace(
            /%%H%%/g,
            methods.calcage(secs, 3600, 24)
          );
          timerStr = timerStr.replace(/%%M%%/g, methods.calcage(secs, 60, 60));
          timerStr = timerStr.replace(/%%S%%/g, methods.calcage(secs, 1, 60));
          el.html(timerStr);
          setTimeout(function () {
            methods.CountBack(el, secs + countStepper);
          }, setTimeOutPeriod);
        },
      };

      if (methods[options]) {
        // $("#element").pluginName('methodName', 'arg1', 'arg2');
        return methods[options].apply(
          this,
          Array.prototype.slice.call(arguments, 1)
        );
      } else if (typeof options === "object" || !options) {
        // $("#element").pluginName({ option: 1, option:2 });
        return methods.init.apply(this);
      } else {
        $.error('Method "' + method + '" does not exist in timer plugin!');
      }
    };

    $(document).ready(function ($) {
      if (typeof alo_timer_layoutcaption != "undefined") {
        $(".alo-count-down").not(".exception").timer({
          classes: ".countdown",
          layout: alo_timer_layout,
          layoutcaption: alo_timer_layoutcaption,
          timeout: alo_timer_timeout,
        });
      } else {
        $(".alo-count-down").not(".exception").timer({ classes: ".countdown" });
      }
    });
  })($);
  /* End Timer */

  /* notifySlider */
  (function ($) {
    "use strict";
    $.fn.notifySlider = function (options) {
      var defaults = {
        autoplay: true,
        firsttime: 3000,
        timeout: 3000,
        interval: 10000,
      };

      var settings = $.extend(defaults, options);
      var firsttime = settings.firsttime;
      var timeout = settings.timeout;
      var interval = settings.interval;
      var autoplay = settings.autoplay;

      var methods = {
        init: function () {
          return this.each(function () {
            methods.suggestLoad($(this));
          });
        },

        suggestLoad: function (suggest) {
          var el = suggest.find(".notify-slider-wrapper");
          suggest.find(".x-close").click(function () {
            suggest.addClass("close");
          });
          var slideCount = suggest.find(".slider >.item").length;
          var slideWidth = suggest.find(".slider >.item").width();
          var slideHeight = suggest.find(".slider >.item").height();
          var sliderUlWidth = slideCount * slideWidth;
          // suggest.find('.notify-slider').css({ width: slideWidth, height: slideHeight });
          suggest
            .find(".notify-slider .slider")
            .css({ width: sliderUlWidth, marginLeft: -slideWidth });
          suggest
            .find(".notify-slider .slider >.item:last-child")
            .prependTo(".notify-slider .slider");
          setTimeout(function () {
            el.slideDown("slow");
          }, firsttime);
          if (!autoplay) return;
          setInterval(function () {
            el.slideUp({
              duration: "slow",
              easing: "swing",
              complete: function () {
                methods.moveRight(suggest, slideWidth);
                setTimeout(function () {
                  el.slideDown("slow");
                }, timeout);
              },
            });
          }, interval);
        },

        moveRight: function (suggest, slideWidth) {
          suggest.find(".notify-slider .slider").animate(
            {
              left: -slideWidth,
            },
            0,
            function () {
              var slider = suggest.find(".notify-slider .slider");
              suggest
                .find(".notify-slider .slider >.item:first-child")
                .appendTo(slider);
              slider.css("left", "");
            }
          );
        },
      };

      if (methods[options]) {
        // $("#element").pluginName('methodName', 'arg1', 'arg2');
        return methods[options].apply(
          this,
          Array.prototype.slice.call(arguments, 1)
        );
      } else if (typeof options === "object" || !options) {
        // $("#element").pluginName({ option: 1, option:2 });
        return methods.init.apply(this);
      } else {
        $.error('Method "' + method + '" does not exist in timer plugin!');
      }
    };

    $(document).ready(function ($) {
      $(".suggest-slider").each(function () {
        if ($(this).hasClass("autoplay")) {
          var config = $(this).data();
          $(this).notifySlider(config);
        }
      });
    });
  })($);
  /* End notifySlider */
});
