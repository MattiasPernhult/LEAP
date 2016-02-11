angular.module('sandboxApp', [])
    .controller('SubmissionCtrl', function($scope) {
        $scope.init = function(user, email) {
            $scope.user = user;
            $scope.email = email;
        }

        $scope.send = function() {
            console.log('skickar');
        }
    });
