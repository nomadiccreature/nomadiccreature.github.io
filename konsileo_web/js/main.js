/**
 * @author Twitter @nomadiccreature
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('KonsileoWebApp', [
  'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/faq", {templateUrl: "partials/joinus.html", controller: "PageCtrl"})
    .when("/pricing", {templateUrl: "partials/howwework.html", controller: "PageCtrl"})
    .when("/services", {templateUrl: "partials/press.html", controller: "PageCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
  console.log("Page Controller reporting for duty.");
});