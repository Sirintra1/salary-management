(function() {
    'use strict';

    angular
        .module('masterlists')
        .run(menuConfig);

    menuConfig.$inject = ['Menus'];

    function menuConfig(menuService) {
        // Set top bar menu items
        menuService.addMenuItem('topbar', {
            title: 'Masterlists',
            state: 'masterlists',
            type: 'dropdown',
            roles: ['*']
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('topbar', 'masterlists', {
            title: 'List Masterlists',
            state: 'masterlists.list'
        });

        // Add the dropdown create item
        menuService.addSubMenuItem('topbar', 'masterlists', {
            title: 'Create Masterlist',
            state: 'masterlists.create',
            roles: ['user']
        });
    }
}());