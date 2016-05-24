/**
 * Ushahidi Angular Filter System User directive
 * Drop in directive for managing filters for users
 */

module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$rootScope',
        '$translate',
        '$timeout',
        'RoleEndpoint',
        'UserEndpoint',
        '_',
        function (
            $scope,
            $rootScope,
            $translate,
            $timeout,
            RoleEndpoint,
            UserEndpoint,
            _
        ) {
            $scope.selectedRoles = [];

            $scope.cancel = function () {
                // Reset filters
                $scope.selectedRoles.splice(0, $scope.selectedRoles.length);
                _.each(angular.copy($scope.filters.role), function (role) {
                    $scope.selectedRoles.push(role);
                });
                // and close dropdown
                $timeout(function() {
                    angular.element( document.querySelector( '#toggleUserSearchFilters' ) ).triggerHandler('click');
                }, 100);
            };

            $scope.applyFilters = function () {
                // ngFormController automatically commits changes to the model ($scope.filters)
                // Just close the dropdown
                $scope.filtersMenuOpen = false;
            };
        }];
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/settings/users/filter-users.html',
        scope: {
            filters: '='
        },
        controller: controller
    };
}];
