angular.module('aliceApp')
    .controller('DepartmentCreateController', function($rootScope, $scope, $state, $cookies, $stateParams, Department, User) {
        $rootScope.checkAccess($cookies, $state, function() {
            $scope.department = new Department();
            $scope.department.teams = [];

            $scope.users = User.query();

            $scope.addDepartment = function() {
                $scope.department.$save(function() {
                    $state.go('departments');
                });
            }

            $scope.addLead = function(user) {
                $scope.department.lead = user;
            }

            $scope.addColor = function(index) {
                $scope.department.color = Object.keys($scope.colors)[index];
            }

            $scope.addTeamColor = function(index) {
                $scope.currentTeam.color = Object.keys($scope.colors)[index];
            }

            $scope.addTeamLead = function(user) {
                $scope.currentTeam.lead = user;
            }

            $scope.deleteTeam = function(index) {
                $scope.department.teams.splice(index, 1);
            }

            $scope.isNewTeam = true;
            $scope.currentTeam = {};

            $scope.newTeam = function() {
                $scope.isNewTeam = true;
                $scope.currentTeam = {};
            }

            $scope.addTeam = function() {
                $scope.department.teams.push($scope.currentTeam);
                $scope.currentTeam = {};
                $('.ui.dropdown.icon').dropdown("restore defaults");
                $('.ui.dropdown.icon').dropdown("set text", "Team color");
            }

            // $scope.colors = [{
            //     class: 'red',
            //     hex: 'B03060'
            // }, {
            //     class: 'blue',
            //     hex: '0E6EB8'
            // }, {
            //     class: 'black',
            //     hex: '000000'
            // }, {
            //     class: 'purple',
            //     hex: 'B413EC'
            // }, {
            //     class: 'orange',
            //     hex: 'FE9A76'
            // }, {
            //     class: 'yellow',
            //     hex: 'FFD700'
            // }, {
            //     class: 'pink',
            //     hex: 'FF1493'
            // }, {
            //     class: 'green',
            //     hex: '016936'
            // }, ]

            $scope.colors = {
                'B03060': 'red',
                '0E6EB8': 'blue',
                '000000': 'black',
                'B413EC': 'purple',
                'FE9A76': 'orange',
                'FFD700': 'yellow',
                'FF1493': 'pink',
                '016936': 'green'
            };

            $('.ui.dropdown.multiple')
                .dropdown({
                    direction: 'downward'
                });
            $('.ui.dropdown.fluid')
                .dropdown({
                    direction: 'downward'
                });
            $('.ui.dropdown.icon')
                .dropdown({
                    direction: 'upward'
                });


        });
    }).directive('teamsDirective', function() {
        return function(scope, element, attrs) {
            if (scope.$last) {
                $(element).transition({
                    animation: 'scale in',
                    duration: 300
                });
            }
        };
    });
