
var App = require('../app');
var PLACE_DATA = require('./places-data');

var places = App.places = new (Amour.Collection.extend({
    url: Amour.APIRoot + 'greetings/place/'
}))();

function stylePlaceList() {
    var $view = $('.places-select');
    $view.each(function() {
        $(this).html($(this).find('select').map(function() {
            return $('<div class="select-wrapper"></div>').html(this)[0];
        }));
    });
    $view.find('.select-wrapper').addClass('dropdown')
         .find('select').addClass('needsclick')
         .after('<div data-toggle="dropdown"></div>')
         .after('<div class="dropdown-menu"></div>')
    $view.find('.select-wrapper').on('show.bs.dropdown', function() {
        var $select = $(this).find('select');
        var $options = $select.find('option').map(function() {
            var value = $(this).attr('value');
            var text = $(this).text();
            var $a = $('<a></a>').attr('data-value', value).text(text);
            return $('<li></li>').html($a)[0];
        });
        $(this).find('.dropdown-menu').html($options);
    }).on('click', '.dropdown-menu > li > a', function() {
        var $select = $(this).closest('.select-wrapper').find('select');
        var value = $(this).attr('data-value');
        $select.val(value).trigger('change');
    });
}

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
    $view.find('select[name="province"]').on('change update', function() {
        var cities = $(this).find('option:selected').data('children') || [];
        var $select = $(this).closest('.places-select').find('select[name="city"]');
        fillPlaces($select, cities, '全省', 'district');
        $select.trigger('update');
    });
    $view.find('select[name="city"]').on('change update', function() {
        var districts = $(this).find('option:selected').data('children') || [];
        var $select = $(this).closest('.places-select').find('select[name="district"]');
        fillPlaces($select, districts, '全市', null);
    });
    var provinces = _.where(data, {category: 'province'});
    var $select = $view.find('select[name="province"]');
    fillPlaces($select, provinces, '全国', 'city');
}

$.fn.selectPlace = function(id) {
    return this.each(function() {
        var $this = $(this);
        var ids = [];
        var i = +id;
        while (!!i) {
            ids.push(i);
            var place = App.places.get(i);
            i = place ? +place.get('parent') : null;
        }
        ids = ids.reverse();
        $(this).find('select[name="province"]').val(ids[0]).trigger('update');
        $(this).find('select[name="city"]').val(ids[1]).trigger('update');
        $(this).find('select[name="district"]').val(ids[2]).trigger('update');
    });
};

stylePlaceList();

places.reset(PLACE_DATA);
initPlaceList();

// places.fetch({
//     reset: true,
//     success: initPlaceList
// });
