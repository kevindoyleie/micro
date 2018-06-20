(function () {
    require('../../../node_modules/slick-carousel/slick/slick');
    var logger = require('./modules/debug-log').getLogger('index');
    var $ = require('jquery');
    var moment = require('moment');
    var ouibounce = require('ouibounce');

    var callbackType = "mentalhealthCallback";
    var emailServiceUrl = "/api/v1/emailQuery";
    var callbackDate = $('#callback-date');
    var webChatDate = $('#webchat-date');
    var videoChatDate = $('#videochat-date');
    var appointmentDate = $('#appointment-date');
    var moodCallbackDate = $('#mood-callback-date');
    var moodWebChatDate = $('#mood-webchat-date');
    var moodVideoChatDate = $('#mood-videochat-date');
    var moodAppointmentDate = $('#mood-appointment-date');

    function getTimeOfDay(morning, afternoon ,evening) {
        var time;
        if (morning)
            time = morning;
        else if (afternoon)
            time = afternoon;
        else if (evening)
            time = evening;
        else
            time = "Not Set";
        return time;
    }

    function formatDate(inDate) {
        return moment(inDate).format('DD/MM/YYYY');
    }

    function formatVoicemail(isChecked) {
        if (isChecked)
            return "Yes";
        else
            return "No";
    }

    function allFieldsHaveInput(name, phoneNumber, date, morning, afternoon, evening) {
        var result = false;
        if (name && phoneNumber && date && (morning || afternoon || evening))
            result = true;
        return result;
    }

    function hidePopups() {
        $('#call-now-popup').hide();
        $('#callback-popup').hide();
        $('#webchat-popup').hide();
        $('#videochat-popup').hide();
        $('#appointment-popup').hide();
        $('#show-less-btn').hide();
        $('#show-more-btn').show();
    }

    function initialiseDateInputFields() {
        var tomorrow = moment().add(1, "day").format('YYYY-MM-DD');
        var today = moment().format('YYYY-MM-DD');
        callbackDate.val(tomorrow);
        callbackDate.attr('min', today);
        webChatDate.val(tomorrow);
        webChatDate.attr('min', today);
        videoChatDate.val(tomorrow);
        videoChatDate.attr('min', today);
        appointmentDate.val(tomorrow);
        appointmentDate.attr('min', today);
        moodCallbackDate.val(tomorrow);
        moodCallbackDate.attr('min', today);
        moodWebChatDate.val(tomorrow);
        moodWebChatDate.attr('min', today);
        moodVideoChatDate.val(tomorrow);
        moodVideoChatDate.attr('min', today);
        moodAppointmentDate.val(tomorrow);
        moodAppointmentDate.attr('min', today);
    }

    function nhsIframe() {
        $(window).on('message', function (e) {
            var tmp = (eval('(' + e.originalEvent.data + ')'));
            window.hasOwnProperty = window.hasOwnProperty || Object.prototype.hasOwnProperty;
            if (tmp.hasOwnProperty('nhs_redirect')) {
                window.location.href = tmp.nhs_redirect;
            }
        });
    }

    function toolsAndInfoClicks() {
        $(".tools-info-btn").click(function () {
            $('html, body').animate({
                scrollTop: $("#tools-info-panel").offset().top - 140
            }, 500);
        });
    }

    function callNowClicks() {
        $('#call-now-btn').click(function () {
            $('#call-now-popup').show();
            $('#popup-fade').show();
            $(".popup-fade-overlay").css("display", "block");
        });

        $('#close-call-now-popup-btn').click(function () {
            $('#call-now-popup').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#mood-call-now-btn').click(function () {
            $('#mood-call-now-popup').show();
            $('#popup-fade').show();
            $(".popup-fade-overlay").css("display", "block");
        });

        $('#close-mood-call-now-popup-btn').click(function () {
            $('#mood-call-now-popup').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });
    }

    function requestCallbackClicks() {
        $('#callback-btn').click(function () {
            $('#callback-popup').show();
            $('#popup-fade').show();
            $(".popup-fade-overlay").css("display", "block");
        });

        $('#close-callback-popup-btn').click(function () {
            $('#callback-popup').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#callback-submit-btn').click(function () {
            var name = $('#callback-name').val();
            var phoneNumber = $('#callback-phonenumber').val();
            var date = $('#callback-date').val();
            var morning = $('#callback-morning:checked').val();
            var afternoon = $('#callback-afternoon:checked').val();
            var evening = $('#callback-evening:checked').val();

            if (allFieldsHaveInput(name, phoneNumber, date, morning, afternoon, evening)) {
                $('.callback-error').hide();
                var jsonData = JSON.stringify({
                    type: callbackType,
                    name: name + " - DAA",
                    phoneNumber: phoneNumber,
                    date: formatDate(date),
                    time: getTimeOfDay(morning, afternoon, evening),
                    voicemailOk: formatVoicemail($('#callback-voicemail-ok').is(":checked")),
                    query: "Request a callback."
                });
                console.log(jsonData);
                $.ajax({
                    type: "POST",
                    url: emailServiceUrl,
                    data: jsonData,
                    dataType: "text",
                    contentType: "application/json",
                    headers: {
                        environment: "suite-33"
                    }
                }).done(function () {
                    logger.debug("*** Successfully called emailService ***");
                    $('.callback-popup-content').hide();
                    $('.callback-popup-success').show();
                }).fail(function (jqXHR, textStatus) {
                    logger.debug("Error received calling emailService: " + textStatus);
                    // TODO: handle server errors.
                }).always(function () {
                    logger.debug("Completed call to AJAX to emailService.");
                });
            }
            else {
                $('.callback-error').show();
            }
        });

        $('#callback-ok-btn').click(function () {
            $('#callback-popup').hide();
            $('.callback-popup-content').show();
            $('.callback-popup-success').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#mood-callback-btn').click(function () {
            $('#mood-callback-popup').show();
            $('#popup-fade').show();
            $(".popup-fade-overlay").css("display", "block");
        });

        $('#close-mood-callback-popup-btn').click(function () {
            $('#mood-callback-popup').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#mood-callback-submit-btn').click(function () {
            var name = $('#mood-callback-name').val();
            var phoneNumber = $('#mood-callback-phonenumber').val();
            var date = $('#mood-callback-date').val();
            var morning = $('#mood-callback-morning:checked').val();
            var afternoon = $('#mood-callback-afternoon:checked').val();
            var evening = $('#mood-callback-evening:checked').val();

            if (allFieldsHaveInput(name, phoneNumber, date, morning, afternoon, evening)) {
                $('.mood-callback-error').hide();
                var jsonData = JSON.stringify({
                    type: callbackType,
                    name: name + " - DAA",
                    phoneNumber: phoneNumber,
                    date: formatDate(date),
                    time: getTimeOfDay(morning, afternoon, evening),
                    voicemailOk: formatVoicemail($('#mood-callback-voicemail-ok').is(":checked")),
                    query: "Request a callback."
                });
                console.log(jsonData);
                $.ajax({
                    type: "POST",
                    url: emailServiceUrl,
                    data: jsonData,
                    dataType: "text",
                    contentType: "application/json",
                    headers: {
                        "environment": "suite-33"
                    }
                }).done(function () {
                    logger.debug("*** Successfully called emailService ***");
                    $('.mood-callback-popup-content').hide();
                    $('.mood-callback-popup-success').show();
                }).fail(function (jqXHR, textStatus) {
                    logger.debug("Error received calling emailService: " + textStatus);
                    // TODO: handle server errors.
                }).always(function () {
                    logger.debug("Completed call to AJAX to emailService.");
                });
            }
            else {
                $('.mood-callback-error').show();
            }
        });

        $('#mood-callback-ok-btn').click(function () {
            $('#mood-callback-popup').hide();
            $('.mood-callback-popup-content').show();
            $('.mood-callback-popup-success').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });
    }

    function webChatClicks() {
        $('#web-chat-btn').click(function () {
            $('#webchat-popup').show();
            $('#popup-fade').show();
            $(".popup-fade-overlay").css("display", "block");
        });

        $('#close-webchat-popup-btn').click(function () {
            $('#webchat-popup').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#webchat-submit-btn').click(function () {
            var name = $('#webchat-name').val();
            var phoneNumber = $('#webchat-phonenumber').val();
            var date = $('#webchat-date').val();
            var morning = $('#webchat-morning:checked').val();
            var afternoon = $('#webchat-afternoon:checked').val();
            var evening = $('#webchat-evening:checked').val();

            if (allFieldsHaveInput(name, phoneNumber, date, morning, afternoon, evening)) {
                var jsonData = JSON.stringify({
                    type: callbackType,
                    name: name + " - DAA",
                    phoneNumber: phoneNumber,
                    date: formatDate(date),
                    time: getTimeOfDay(morning, afternoon, evening),
                    voicemailOk: formatVoicemail($('#webchat-voicemail-ok').is(":checked")),
                    query: "Webchat Callback."
                });
                console.log(jsonData);
                $.ajax({
                    type: "POST",
                    url: emailServiceUrl,
                    data: jsonData,
                    dataType: "text",
                    contentType: "application/json",
                    headers: {
                        "environment": "suite-33"
                    }
                }).done(function () {
                    logger.debug("*** Successfully called emailService ***");
                    $('.webchat-popup-content').hide();
                    $('.webchat-popup-success').show();
                }).fail(function (jqXHR, textStatus) {
                    logger.debug("Error received calling emailService: " + textStatus);
                    // TODO: handle server errors.
                }).always(function () {
                    logger.debug("Completed call to AJAX to emailService.");
                });
            }
            else {
                $('.webchat-error').show();
            }
        });

        $('#webchat-ok-btn').click(function () {
            $('#webchat-popup').hide();
            $('.webchat-popup-content').show();
            $('.webchat-popup-success').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#mood-web-chat-btn').click(function () {
            $('#mood-webchat-popup').show();
            $('#popup-fade').show();
            $(".popup-fade-overlay").css("display", "block");
        });

        $('#close-mood-webchat-popup-btn').click(function () {
            $('#mood-webchat-popup').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#mood-webchat-submit-btn').click(function () {
            var name = $('#mood-webchat-name').val();
            var phoneNumber = $('#mood-webchat-phonenumber').val();
            var date = $('#mood-webchat-date').val();
            var morning = $('#mood-webchat-morning:checked').val();
            var afternoon = $('#mood-webchat-afternoon:checked').val();
            var evening = $('#mood-webchat-evening:checked').val();

            if (allFieldsHaveInput(name, phoneNumber, date, morning, afternoon, evening)) {
                var jsonData = JSON.stringify({
                    type: callbackType,
                    name: name + " - DAA",
                    phoneNumber: phoneNumber,
                    date: formatDate(date),
                    time: getTimeOfDay(morning, afternoon, evening),
                    voicemailOk: formatVoicemail($('#mood-webchat-voicemail-ok').is(":checked")),
                    query: "Mood Webchat Callback."
                });
                console.log(jsonData);
                $.ajax({
                    type: "POST",
                    url: emailServiceUrl,
                    data: jsonData,
                    dataType: "text",
                    contentType: "application/json",
                    headers: {
                        "environment": "suite-33"
                    }
                }).done(function () {
                    logger.debug("*** Successfully called emailService ***");
                    $('.mood-webchat-popup-content').hide();
                    $('.mood-webchat-popup-success').show();
                }).fail(function (jqXHR, textStatus) {
                    logger.debug("Error received calling emailService: " + textStatus);
                    // TODO: handle server errors.
                }).always(function () {
                    logger.debug("Completed call to AJAX to emailService.");
                });
            }
            else {
                $('.mood-webchat-error').show();
            }
        });

        $('#mood-webchat-ok-btn').click(function () {
            $('#mood-webchat-popup').hide();
            $('.mood-webchat-popup-content').show();
            $('.mood-webchat-popup-success').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });
    }

    function videoChatClicks() {
        $('#video-chat-btn').click(function () {
            $('#videochat-popup').show();
            $('#popup-fade').show();
            $(".popup-fade-overlay").css("display", "block");
        });

        $('#close-videochat-popup-btn').click(function () {
            $('#videochat-popup').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#videochat-submit-btn').click(function () {
            var name = $('#videochat-name').val();
            var phoneNumber = $('#videochat-phonenumber').val();
            var date = $('#videochat-date').val();
            var morning = $('#videochat-morning:checked').val();
            var afternoon = $('#videochat-afternoon:checked').val();
            var evening = $('#videochat-evening:checked').val();

            if (allFieldsHaveInput(name, phoneNumber, date, morning, afternoon, evening)) {
                var jsonData = JSON.stringify({
                    type: callbackType,
                    name: name + " - DAA",
                    phoneNumber: phoneNumber,
                    date: formatDate(date),
                    time: getTimeOfDay(morning, afternoon, evening),
                    voicemailOk: formatVoicemail($('#videochat-voicemail-ok').is(":checked")),
                    query: "Video Chat Callback."
                });
                console.log(jsonData);
                $.ajax({
                    type: "POST",
                    url: emailServiceUrl,
                    data: jsonData,
                    dataType: "text",
                    contentType: "application/json",
                    headers: {
                        "environment": "suite-33"
                    }
                }).done(function () {
                    logger.debug("*** Successfully called emailService ***");
                    $('.videochat-popup-content').hide();
                    $('.videochat-popup-success').show();
                }).fail(function (jqXHR, textStatus) {
                    logger.debug("Error received calling emailService: " + textStatus);
                    // TODO: handle server errors.
                }).always(function () {
                    logger.debug("Completed call to AJAX to emailService.");
                });
            }
            else {
                $('.videochat-error').show();
            }
        });

        $('#videochat-ok-btn').click(function () {
            $('#videochat-popup').hide();
            $('.videochat-popup-content').show();
            $('.videochat-popup-success').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#mood-video-chat-btn').click(function () {
            $('#mood-videochat-popup').show();
            $('#popup-fade').show();
            $(".popup-fade-overlay").css("display", "block");
        });

        $('#close-mood-videochat-popup-btn').click(function () {
            $('#mood-videochat-popup').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#mood-videochat-submit-btn').click(function () {
            var name = $('#mood-videochat-name').val();
            var phoneNumber = $('#mood-videochat-phonenumber').val();
            var date = $('#mood-videochat-date').val();
            var morning = $('#mood-videochat-morning:checked').val();
            var afternoon = $('#mood-videochat-afternoon:checked').val();
            var evening = $('#mood-videochat-evening:checked').val();

            if (allFieldsHaveInput(name, phoneNumber, date, morning, afternoon, evening)) {
                var jsonData = JSON.stringify({
                    type: callbackType,
                    name: name + " - DAA",
                    phoneNumber: phoneNumber,
                    date: formatDate(date),
                    time: getTimeOfDay(morning, afternoon, evening),
                    voicemailOk: formatVoicemail($('#mood-videochat-voicemail-ok').is(":checked")),
                    query: "Video Chat Callback."
                });
                console.log(jsonData);
                $.ajax({
                    type: "POST",
                    url: emailServiceUrl,
                    data: jsonData,
                    dataType: "text",
                    contentType: "application/json",
                    headers: {
                        "environment": "suite-33"
                    }
                }).done(function () {
                    logger.debug("*** Successfully called emailService ***");
                    $('.mood-videochat-popup-content').hide();
                    $('.mood-videochat-popup-success').show();
                }).fail(function (jqXHR, textStatus) {
                    logger.debug("Error received calling emailService: " + textStatus);
                    // TODO: handle server errors.
                }).always(function () {
                    logger.debug("Completed call to AJAX to emailService.");
                });
            }
            else {
                $('.mood-videochat-error').show();
            }
        });

        $('#mood-videochat-ok-btn').click(function () {
            $('#mood-videochat-popup').hide();
            $('.mood-videochat-popup-content').show();
            $('.mood-videochat-popup-success').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });
    }

    function bookAppointmentClicks() {
        $('#book-appointment-btn').click(function () {
            $('#appointment-popup').show();
            $('#popup-fade').show();
            $(".popup-fade-overlay").css("display", "block");
        });

        $('#close-appointment-popup-btn').click(function () {
            $('#appointment-popup').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#appointment-submit-btn').click(function () {
            var name = $('#appointment-name').val();
            var phoneNumber = $('#appointment-phonenumber').val();
            var date = $('#appointment-date').val();
            var morning = $('#appointment-morning:checked').val();
            var afternoon = $('#appointment-afternoon:checked').val();
            var evening = $('#appointment-evening:checked').val();

            if (allFieldsHaveInput(name, phoneNumber, date, morning, afternoon, evening)) {
                var jsonData = JSON.stringify({
                    type: callbackType,
                    name: name + " - DAA",
                    phoneNumber: phoneNumber,
                    date: formatDate(date),
                    time: getTimeOfDay(morning, afternoon, evening),
                    voicemailOk: formatVoicemail($('#appointment-voicemail-ok').is(":checked")),
                    query: "Book an Appointment Callback."
                });
                console.log(jsonData);
                $.ajax({
                    type: "POST",
                    url: emailServiceUrl,
                    data: jsonData,
                    dataType: "text",
                    contentType: "application/json",
                    headers: {
                        "environment": "suite-33"
                    }
                }).done(function () {
                    logger.debug("*** Successfully called emailService ***");
                    $('.appointment-popup-content').hide();
                    $('.appointment-popup-success').show();
                }).fail(function (jqXHR, textStatus) {
                    logger.debug("Error received calling emailService: " + textStatus);
                    // TODO: handle server errors.
                }).always(function () {
                    logger.debug("Completed call to AJAX to emailService.");
                });
            }
            else {
                $('.appointment-error').show();
            }
        });

        $('#appointment-ok-btn').click(function () {
            $('#appointment-popup').hide();
            $('.appointment-popup-content').show();
            $('.appointment-popup-success').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#mood-book-appointment-btn').click(function () {
            $('#mood-appointment-popup').show();
            $('#popup-fade').show();
            $(".popup-fade-overlay").css("display", "block");
        });

        $('#close-mood-appointment-popup-btn').click(function () {
            $('#mood-appointment-popup').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });

        $('#mood-appointment-submit-btn').click(function () {
            var name = $('#mood-appointment-name').val();
            var phoneNumber = $('#mood-appointment-phonenumber').val();
            var date = $('#mood-appointment-date').val();
            var morning = $('#mood-appointment-morning:checked').val();
            var afternoon = $('#mood-appointment-afternoon:checked').val();
            var evening = $('#mood-appointment-evening:checked').val();

            if (allFieldsHaveInput(name, phoneNumber, date, morning, afternoon, evening)) {
                var jsonData = JSON.stringify({
                    type: callbackType,
                    name: name + " - DAA",
                    phoneNumber: phoneNumber,
                    date: formatDate(date),
                    time: getTimeOfDay(morning, afternoon, evening),
                    voicemailOk: formatVoicemail($('#mood-appointment-voicemail-ok').is(":checked")),
                    query: "Book an Appointment Callback."
                });
                console.log(jsonData);
                $.ajax({
                    type: "POST",
                    url: emailServiceUrl,
                    data: jsonData,
                    dataType: "text",
                    contentType: "application/json",
                    headers: {
                        "environment": "suite-33"
                    }
                }).done(function () {
                    logger.debug("*** Successfully called emailService ***");
                    $('.mood-appointment-popup-content').hide();
                    $('.mood-appointment-popup-success').show();
                }).fail(function (jqXHR, textStatus) {
                    logger.debug("Error received calling emailService: " + textStatus);
                    // TODO: handle server errors.
                }).always(function () {
                    logger.debug("Completed call to AJAX to emailService.");
                });
            }
            else {
                $('.mood-appointment-error').show();
            }
        });

        $('#mood-appointment-ok-btn').click(function () {
            $('#mood-appointment-popup').hide();
            $('.mood-appointment-popup-content').show();
            $('.mood-appointment-popup-success').hide();
            $('#popup-fade').hide();
            $(".popup-fade-overlay").css("display", "none");
        });
    }

    function getSupportNowClicks() {
        $('.get-support-now-btn').click(function () {
            $('#get-support-now-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-get-support-now-btn').click(function () {
            $('#get-support-now-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
        });

        callNowClicks();
        requestCallbackClicks();
        webChatClicks();
        videoChatClicks();
        bookAppointmentClicks();
    }

    function checkMoodClicks() {
        $('.check-mood-popup-btn').click(function () {
            $('#check-mood-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-check-mood-btn').click(function () {
            $('#check-mood-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
        });

        $('#start-mood-test-btn').click(function () {
            $('#mood-test-panel-1').hide();
            $('#mood-test-panel-2').show();
            $('#mood-test-done-btn').show();
        });
    }

    function crisisSupportClicks() {
        $('.crisis-support-click').click(function () {
            $('#crisis-support-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('#see-more').click(function () {
            $('#crisis-support-popup').show();
            var $showMoreButton = $('#more-details');
            $showMoreButton.show();
            $('#show-more-btn').hide();
            $('#show-less-btn').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, $showMoreButton.offset().top - 140);
        });

        $('.close-crisis-support-btn').click(function () {
            $('#more-details').hide();
            $('#crisis-support-popup').hide();
            $('#show-more-btn').show();
            $('#show-less-btn').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
        });

        $('#show-more-btn').click(function () {
            $('#more-details').show();
            $('#show-more-btn').hide();
            $('#show-less-btn').show();
        });

        $('#show-less-btn').click(function () {
            $('#more-details').hide();
            $('#show-less-btn').hide();
            $('#show-more-btn').show();
        });

        $('#iconBarX').click(function () {
            $('#crisis-support-info-bar').hide();
            $('#crisis-support-info-triangle').show();
        });
    }

    function understandingLanguageMentalHealth() {
        $('#understanding-language-mental-health-btn').click(function () {
            $('#understanding-language-mental-health-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-understanding-language-mental-health-btn').click(function () {
            $('#understanding-language-mental-health-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
            window.scrollTo(0, $("#tools-info-panel").offset().top - 140);
        });

        $('.blogs').on('click', '.understanding-language-mental-health-btn', function () {
            $('#understanding-language-mental-health-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });
    }

    function manageChildTantrums() {
        $('#manage-child-tantrums-btn').click(function () {
            $('#manage-child-tantrums-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-manage-child-tantrums-btn').click(function () {
            $('#manage-child-tantrums-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
            window.scrollTo(0, $("#tools-info-panel").offset().top - 140);
        });

        $('.blogs').on('click', '.manage-child-tantrums-btn', function () {
            $('#manage-child-tantrums-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });
    }

    function babyBluesAndPostnatalDepression() {
        $('#baby-blues-and-postnatal-depression-lets-talk-btn').click(function () {
            $('#baby-blues-and-postnatal-depression-lets-talk-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-baby-blues-and-postnatal-depression-lets-talk-btn').click(function () {
            $('#baby-blues-and-postnatal-depression-lets-talk-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
            window.scrollTo(0, $("#tools-info-panel").offset().top - 140);
        });

        $('.blogs').on('click', '.baby-blues-and-postnatal-depression-lets-talk-btn', function () {
            $('#baby-blues-and-postnatal-depression-lets-talk-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });
    }

    function helpCopeLossLovedOne() {
        $('.help-cope-loss-loved-one-btn').click(function () {
            $('#help-cope-loss-loved-one-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-help-cope-loss-loved-one-btn').click(function () {
            $('#help-cope-loss-loved-one-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
            window.scrollTo(0, $("#tools-info-panel").offset().top - 140);
        });

        $('.blogs').on('click', '.help-cope-loss-loved-one-btn', function () {
            $('#help-cope-loss-loved-one-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });
    }

    function unplugFromTechnology() {
        $('.unplug-from-technology-btn').click(function () {
            $('#unplug-from-technology-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-unplug-from-technology-btn').click(function () {
            $('#unplug-from-technology-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
            window.scrollTo(0, $("#tools-info-panel").offset().top - 140);
        });

        $('.blogs').on('click', '.unplug-from-technology-btn', function () {
            $('#unplug-from-technology-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });
    }

    function dealingWithSocialAnxiety() {
        $('.dealing-with-social-anxiety-btn').click(function () {
            $('#dealing-with-social-anxiety-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-dealing-with-social-anxiety-btn').click(function () {
            $('#dealing-with-social-anxiety-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
            window.scrollTo(0, $("#tools-info-panel").offset().top - 140);
        });

        $('.blogs').on('click', '.dealing-with-social-anxiety-btn', function () {
            $('#dealing-with-social-anxiety-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });
    }

    function combatingWorkplaceBullying() {
        $('.combating-workplace-bullying-btn').click(function () {
            $('#combating-workplace-bullying-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-combating-workplace-bullying-btn').click(function () {
            $('#combating-workplace-bullying-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
            window.scrollTo(0, $("#tools-info-panel").offset().top - 140);
        });

        $('.blogs').on('click', '.combating-workplace-bullying-btn', function () {
            $('#combating-workplace-bullying-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });
    }

    function parentingExpertNiamhHannan() {
        $('.parenting-expert-niamh-hannan-btn').click(function () {
            $('#parenting-expert-niamh-hannan-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-parenting-expert-niamh-hannan-btn').click(function () {
            $('#parenting-expert-niamh-hannan-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
            window.scrollTo(0, $("#tools-info-panel").offset().top - 140);
        });

        $('.blogs').on('click', '.parenting-expert-niamh-hannan-btn', function () {
            $('#parenting-expert-niamh-hannan-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });
    }

    function benefitsToPayingItForward() {
        $('.benefits-to-paying-it-forward-btn').click(function () {
            $('#benefits-to-paying-it-forward-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-benefits-to-paying-it-forward-btn').click(function () {
            $('#benefits-to-paying-it-forward-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
            window.scrollTo(0, $("#tools-info-panel").offset().top - 140);
        });

        $('.blogs').on('click', '.benefits-to-paying-it-forward-btn', function () {
            $('#benefits-to-paying-it-forward-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });
    }

    function keepingOnTopOfStressAtWork() {
        $('.keeping-on-top-of-stress-at-work-btn').click(function () {
            $('#keeping-on-top-of-stress-at-work-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-keeping-on-top-of-stress-at-work-btn').click(function () {
            $('#keeping-on-top-of-stress-at-work-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
            window.scrollTo(0, $("#tools-info-panel").offset().top - 140);
        });

        $('.blogs').on('click', '.keeping-on-top-of-stress-at-work-btn', function () {
            $('#keeping-on-top-of-stress-at-work-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });
    }

    function depressionRecognisingSubtleSigns() {
        $('.depression-recognising-the-subtle-signs-btn').click(function () {
            $('#depression-recognising-the-subtle-signs-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });

        $('.close-depression-recognising-the-subtle-signs-btn').click(function () {
            $('#depression-recognising-the-subtle-signs-popup').hide();
            $('#fade').hide();
            $(".fade_overlay").css("display", "none");
            window.scrollTo(0, $("#tools-info-panel").offset().top - 140);
        });

        $('.blogs').on('click', '.depression-recognising-the-subtle-signs-btn', function () {
            $('#depression-recognising-the-subtle-signs-popup').show();
            $('#fade').show();
            $(".fade_overlay").css("display", "block");
            window.scrollTo(0, 0);
        });
    }

    function carouselArticleClicks() {
        understandingLanguageMentalHealth();
        manageChildTantrums();
        babyBluesAndPostnatalDepression();
        helpCopeLossLovedOne();
        unplugFromTechnology();
        dealingWithSocialAnxiety();
        combatingWorkplaceBullying();
        parentingExpertNiamhHannan();
        benefitsToPayingItForward();
        keepingOnTopOfStressAtWork();
        depressionRecognisingSubtleSigns();
    }

    function configureListeners() {
        toolsAndInfoClicks();
        getSupportNowClicks();
        checkMoodClicks();
        crisisSupportClicks();
        carouselArticleClicks();
    }

    function configureCarousel() {
        $(document).ready(function () {
            $('.blogs').slick({
                centerMode: true,
                slidesToShow: 3,
                focusOnSelect: true,
                responsive: [
                    {
                        breakpoint: 1524,
                        settings: {
                            centerMode: true,
                            slidesToShow: 3,
                            infinite: true
                        }
                    },
                    {
                        breakpoint: 1250,
                        settings: {
                            centerMode: true,
                            slidesToShow: 3,
                            infinite: true,
                            arrows: false,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 801,
                        settings: {
                            slidesToShow: 2,
                            infinite: true,
                            arrows: false,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 770,
                        settings: {
                            slidesToShow: 2,
                            infinite: true,
                            arrows: false,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 605,
                        settings: {
                            centerMode: true,
                            centerPadding: "140",
                            slidesToShow: 1,
                            infinite: true,
                            arrows: false,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 535,
                        settings: {
                            centerMode: true,
                            centerPadding: "120",
                            slidesToShow: 1,
                            infinite: true,
                            arrows: false,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 485,
                        settings: {
                            centerMode: true,
                            centerPadding: "80",
                            slidesToShow: 1,
                            infinite: true,
                            arrows: false,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 415,
                        settings: {
                            centerMode: true,
                            centerPadding: "55",
                            slidesToShow: 1,
                            infinite: true,
                            arrows: false,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 385,
                        settings: {
                            centerMode: true,
                            centerPadding: "40",
                            slidesToShow: 1,
                            infinite: true,
                            arrows: false,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 376,
                        settings: {
                            centerMode: true,
                            centerPadding: "30",
                            slidesToShow: 1,
                            infinite: true,
                            arrows: false,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 330,
                        settings: {
                            centerMode: true,
                            centerPadding: "10",
                            slidesToShow: 1,
                            arrows: false,
                            dots: true
                        }
                    }
                ]
            });

            if ($(window).width() < 770) {
                $('.offers').slick({
                    centerMode: true,
                    centerPadding: "100",
                    slidesToShow: 1,
                    arrows: false,
                    dots: true,
                    infinite: true,
                    responsive: [
                        {
                            breakpoint: 605,
                            settings: {
                                centerMode: true,
                                centerPadding: "140",
                                slidesToShow: 1,
                                arrows: false,
                                dots: true
                            }
                        },
                        {
                            breakpoint: 535,
                            settings: {
                                centerMode: true,
                                centerPadding: "100",
                                slidesToShow: 1,
                                arrows: false,
                                dots: true
                            }
                        },
                        {
                            breakpoint: 485,
                            settings: {
                                centerMode: true,
                                centerPadding: "80",
                                slidesToShow: 1,
                                arrows: false,
                                dots: true
                            }
                        },
                        {
                            breakpoint: 415,
                            settings: {
                                centerMode: true,
                                centerPadding: "55",
                                slidesToShow: 1,
                                arrows: false,
                                dots: true
                            }
                        },
                        {
                            breakpoint: 386,
                            settings: {
                                centerMode: true,
                                centerPadding: "40",
                                slidesToShow: 1,
                                arrows: false,
                                dots: true
                            }
                        },
                        {
                            breakpoint: 376,
                            settings: {
                                centerMode: true,
                                centerPadding: "30",
                                slidesToShow: 1,
                                arrows: false,
                                dots: true
                            }
                        },
                        {
                            breakpoint: 330,
                            settings: {
                                centerMode: true,
                                centerPadding: "10",
                                slidesToShow: 1,
                                arrows: false,
                                dots: true
                            }
                        }
                    ]
                });
            }
        });
    }

    // noinspection JSUnusedLocalSymbols
    function exitSurveyPopup() {
        ouibounce(document.getElementById('ouibounce-modal'), {
            aggressive: true,
            timer: 1000,
            delay: 100,
            callback: function () {
                console.log('ouibounce fired!');
            }
        });

        $('body').on('click', function () {
            $('#ouibounce-modal').hide();
        });

        $('#ouibounce-modal .ouibounce-modal-footer').on('click', function () {
            $('#ouibounce-modal').hide();
        });

        $('.survey-link').on('click', function () {
            $('#ouibounce-modal').hide();
        });

        $('#ouibounce-modal .ouibounce-modal').on('click', function (e) {
            e.stopPropagation();
        });
    }

    function initializePage() {
        hidePopups();
        initialiseDateInputFields();
        nhsIframe();
        configureListeners();
        configureCarousel();
        exitSurveyPopup();

        $(window).resize(function() {
            configureCarousel();
        });
    }

    initializePage();
})();
