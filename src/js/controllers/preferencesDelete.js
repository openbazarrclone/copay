'use strict';

angular.module('copayApp.controllers').controller('preferencesDeleteWalletController',
  function($scope, $rootScope, $filter, $timeout, $modal, $log, $ionicModal, storageService, notification, profileService, platformInfo, go, gettext, gettextCatalog, applicationService) {
    var isCordova = platformInfo.isCordova;
    this.isCordova = isCordova;
    this.error = null;
    $scope.isDeletingWallet = false;

    var delete_msg = gettextCatalog.getString('Are you sure you want to delete this wallet?');
    var accept_msg = gettextCatalog.getString('Accept');
    var cancel_msg = gettextCatalog.getString('Cancel');
    var confirm_msg = gettextCatalog.getString('Confirm');

    var _modalDeleteWallet = function() {
      $scope.title = delete_msg;
      $scope.accept_msg = accept_msg;
      $scope.cancel_msg = cancel_msg;
      $scope.confirm_msg = confirm_msg;
      $scope.okAction = doDeleteWallet;
      $scope.loading = false;

      $ionicModal.fromTemplateUrl('views/modals/confirmation.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.confirmationModal = modal;
        $scope.confirmationModal.show();
      });
    };

    var doDeleteWallet = function() {
      $scope.isDeletingWallet = true;
      var fc = profileService.focusedClient;
      var name = fc.credentials.walletName;
      var walletName = (fc.alias || '') + ' [' + name + ']';
      var self = this;

      profileService.deleteWalletClient(fc, function(err) {
        $scope.isDeletingWallet = false;
        if (err) {
          self.error = err.message || err;
        } else {
          notification.success(gettextCatalog.getString('Success'), gettextCatalog.getString('The wallet "{{walletName}}" was deleted', {
            walletName: walletName
          }));
          applicationService.restart();
        }
      });
    };

    this.deleteWallet = function() {
      if ($scope.isDeletingWallet) return;
      if (isCordova) {
        navigator.notification.confirm(
          delete_msg,
          function(buttonIndex) {
            if (buttonIndex == 1) {
              doDeleteWallet();
            }
          },
          confirm_msg, [accept_msg, cancel_msg]
        );
      } else {
        _modalDeleteWallet();
      }
    };
  });
