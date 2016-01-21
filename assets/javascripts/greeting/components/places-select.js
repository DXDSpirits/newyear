var App = require('../app');

var places = App.places = new (Amour.Collection.extend({
    url: Amour.APIRoot + 'greetings/place/'
}))();

function initPlaceList() {
    var data = places.toJSON();
    var fillProvinces = function($select, provinces) {
        var $provinces = _.map(provinces, function(item) {
            var cities = _.where(data, { category: 'city', parent: item.id });
            return $('<option></option>').text(item.name).attr('value', item.id).data('cities', cities);
        });
        $select.html($provinces).prepend('<option value="">省</option>');
    }
    var fillCities = function($select, cities) {
        var $cities = _.map(cities, function(item) {
            var districts = _.where(data, { category: 'district', parent: item.id });
            return $('<option></option>').text(item.name).attr('value', item.id).data('districts', districts);
        });
        $select.html($cities).prepend('<option value="">市</option>');
    }
    var fillDistricts = function($select, districts) {
        var $districts = _.map(districts, function(item) {
            return $('<option></option>').text(item.name).attr('value', item.id);
        });
        $select.html($districts).prepend('<option value="">区</option>');
    }
    var $view = $('.places-select');
    $view.find('select[name="province"]').on('change', function() {

        var cities = $(this).find('option:selected').data('cities') || [];
        var $select = $(this).siblings('select[name="city"]');
        fillCities($select, cities);
        $select.trigger('change');
    });
    $view.find('select[name="city"]').on('change', function() {
        var districts = $(this).find('option:selected').data('districts') || [];
        var $select = $(this).siblings('select[name="district"]');
        fillDistricts($select, districts);
    });
    fillProvinces($view.find('select[name="province"]'), _.where(data, {category: 'province'}));
}

places.fetch({
    reset: true,
    success: initPlaceList
});
