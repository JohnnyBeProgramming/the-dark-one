angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('tabsController.myHomePage', {
    url: '/home',
    views: {
      'tab1': {
        templateUrl: 'templates/myHomePage.html',
        controller: 'myHomePageCtrl'
      }
    }
  })

  .state('tabsController.moreFeatures', {
    url: '/store',
    views: {
      'tab2': {
        templateUrl: 'templates/moreFeatures.html',
        controller: 'moreFeaturesCtrl'
      }
    }
  })

  .state('tabsController.cloudSync', {
    url: '/sync',
    views: {
      'tab3': {
        templateUrl: 'templates/cloudSync.html',
        controller: 'cloudSyncCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.captureData', {
    url: '/capture',
    views: {
      'tab4': {
        templateUrl: 'templates/captureData.html',
        controller: 'captureDataCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/home')


});