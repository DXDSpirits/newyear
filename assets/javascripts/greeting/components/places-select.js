
var App = require('../app');

var places = App.places = new (Amour.Collection.extend({
    url: Amour.APIRoot + 'greetings/place/'
}))();

function initPlaceList() {
    var data = places.toJSON();
    var fillPlaces = function($select, places, defaultValue, childCategory) {
        var $places = _.map(places, function(item) {
            var children = _.where(data, { category: childCategory, parent: item.id });
            return $('<option></option>').text(item.name).attr('value', item.id).data('children', children);
        });
        $select.html($places).prepend($('<option value=""></option>').text(defaultValue));
    };
    var $view = $('.places-select');
    $view.find('select').addClass('needsclick');
    $view.find('select[name="province"]').on('change', function() {
        var cities = $(this).find('option:selected').data('children') || [];
        var $select = $(this).siblings('select[name="city"]');
        fillPlaces($select, cities, '市', 'district');
        $select.trigger('change');
    });
    $view.find('select[name="city"]').on('change', function() {
        var districts = $(this).find('option:selected').data('children') || [];
        var $select = $(this).siblings('select[name="district"]');
        fillPlaces($select, districts, '区', null);
    });
    var provinces = _.where(data, {category: 'province'});
    var $select = $view.find('select[name="province"]');
    fillPlaces($select, provinces, '省', 'city');
}

places.fetch({
    reset: true,
    success: initPlaceList
});
