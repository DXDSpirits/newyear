
var places = new (Amour.Model.extend({
    url: Amour.APIRoot + 'greetings/place/'
}))();

function initPlaceList() {
    var data = places.toJSON();
    var fillProvinces = function($select, provinces) {
        var $provinces = _.map(provinces, function(item) {
            var cities = _.where(data, { category: 'city', parent: item.id });
            return $('<option></option>').text(item.name).attr('val', item.name).data('cities', cities);
        });
        $select.html($provinces).prepend('<option>省</option>');
    }
    var fillCities = function($select, cities) {
        var $cities = _.map(cities, function(item) {
            var districts = _.where(data, { category: 'district', parent: item.id });
            return $('<option></option>').text(item.name).attr('val', item.name).data('districts', districts);
        });
        $select.html($cities); //.prepend('<option>市</option>');
    }
    var fillDistricts = function($select, districts) {
        var $districts = _.map(districts, function(item) {
            return $('<option></option>').text(item.name).attr('val', item.name);
        });
        $select.html($districts); //.prepend('<option>区</option>');
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
