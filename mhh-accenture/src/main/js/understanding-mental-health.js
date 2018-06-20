(function () {
    var logger = require('./modules/debug-log').getLogger('understanding-mental-health');
    var $ = require('jquery');

    function initialiseMenu() {
        $('.check-mood-popup-btn').hide();
        $('.tools-info-btn').hide();
        $('.get-support-now-btn').hide();
        $('#home-btn').show();
    }

    function configureHomeListener() {
        $('.home-btn').click(function () {
            location.href = "/mentalhealthhub/";
        });
    }

    function configureToggleListeners() {
        $('#gp-down-toggle').click(function () {
            $('#gp-down-toggle').hide();
            $('#gp-up-toggle').show();
            $('.gp-hidden').show();
        });
        $('#gp-up-toggle').click(function () {
            $('#gp-up-toggle').hide();
            $('#gp-down-toggle').show();
            $('.gp-hidden').hide();
        });
        $('#help-down-toggle').click(function () {
            $('#help-down-toggle').hide();
            $('#help-up-toggle').show();
            $('.help-hidden').show();
        });
        $('#help-up-toggle').click(function () {
            $('#help-up-toggle').hide();
            $('#help-down-toggle').show();
            $('.help-hidden').hide();
        });
        $('#support-groups-down-toggle').click(function () {
            $('#support-groups-down-toggle').hide();
            $('#support-groups-up-toggle').show();
            $('.support-groups-hidden').show();
        });
        $('#support-groups-up-toggle').click(function () {
            $('#support-groups-up-toggle').hide();
            $('#support-groups-down-toggle').show();
            $('.support-groups-hidden').hide();
        });
        $('#workshops-down-toggle').click(function () {
            $('#workshops-down-toggle').hide();
            $('#workshops-up-toggle').show();
            $('.workshops-hidden').show();
        });
        $('#workshops-up-toggle').click(function () {
            $('#workshops-up-toggle').hide();
            $('#workshops-down-toggle').show();
            $('.workshops-hidden').hide();
        });
        $('#youth-services-down-toggle').click(function () {
            $('#youth-services-down-toggle').hide();
            $('#youth-services-up-toggle').show();
            $('.youth-services-hidden').show();
        });
        $('#youth-services-up-toggle').click(function () {
            $('#youth-services-up-toggle').hide();
            $('#youth-services-down-toggle').show();
            $('.youth-services-hidden').hide();
        });
        $('#counselling-psychotherapy-services-down-toggle').click(function () {
            $('#counselling-psychotherapy-services-down-toggle').hide();
            $('#counselling-psychotherapy-services-up-toggle').show();
            $('.counselling-psychotherapy-services-hidden').show();
        });
        $('#counselling-psychotherapy-services-up-toggle').click(function () {
            $('#counselling-psychotherapy-services-up-toggle').hide();
            $('#counselling-psychotherapy-services-down-toggle').show();
            $('.counselling-psychotherapy-services-hidden').hide();
        });
    }

    function configureListeners() {
        configureHomeListener();
        configureToggleListeners();
    }

    function initializePage() {
        initialiseMenu();
        configureListeners();
    }

    initializePage();
})();