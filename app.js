(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', foundItems );

function foundItems() {
  var ddo = {
        templateUrl: 'foundItems.html',
        scope: {
          items: '<',
          onRemove: '&'
        },
      controller: NarrowItDownController,
      controllerAs: 'list',
      bindToController: true
    };
    return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var list = this;
  list.logMenuItems = function (searchTerm) {
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
    promise.then(function (foundItems) {
      console.log(foundItems);
      list.items = foundItems;
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    })
  };

  list.removeItem = function (index) {
      list.items.splice(index, 1);
    }
}

MenuSearchService.$inject = ['$http']
function MenuSearchService($http) {
  var service = this;
  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
    }).then(function (result) {
      var foundItems = [];
      for (var i = 0; i < result.data.menu_items.length;i++) {
        if (result.data.menu_items[i].description.indexOf(searchTerm) != -1) {
          foundItems.push(result.data.menu_items[i]);
        }
      }
      return foundItems;
    });
  };
};
})();
