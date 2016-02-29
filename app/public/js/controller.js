angular.module('sandboxApp', [])

.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
})

.service('fileUpload', ['$http', function($http) {
  this.uploadFileToUrl = function(file, body, uploadUrl) {
    var fd = new FormData();
    fd.append('file', file);
    // TODO: ta bort hårdkodningen
    fd.append('languageID', 0);
    fd.append('assignmentID', body.assignmentID);
    fd.append('courseCode', body.courseCode);

    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined,
      },
    })
    .success(function(data) {
      console.log(data);
    })
    .error(function(err) {
      console.log(err);
    });
  };
}, ])

.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);
        });
      });
    },
  };
},])

.controller('UploadController', ['$scope', 'fileUpload', function($scope, fileUpload) {
  $scope.uploadURL = 'http://localhost:3000/admins/upload';

  $scope.body = {};

  $scope.uploadFile = function() {
    var file = $scope.myFile;

    var uploadUrl = 'http://localhost:3000/admins/upload';
    fileUpload.uploadFileToUrl(file, $scope.body, uploadUrl);
  };

},]);
