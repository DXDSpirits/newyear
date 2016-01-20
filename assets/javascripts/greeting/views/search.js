
var App = require('../app');
var PageView = require('../pageview');

var GreetingsCollection = Amour.Model.extend({
    url: Amour.APIRoot + 'greetings/greeting/'
});

App.Pages.Search = new (PageView.extend({
    events: {
        'click li.place-item': 'showItems',
    },
    initPage: function() {
        this.greetings = new GreetingsCollection();
    },
    leave: function() {},
    showItems: function() {},
    render: function() {
        this.greetings.fetch({
            reset: true
        });
    }
}))({el: $('#view-search')});

var options = {
    valueNames: ['name','id'],
    item: '<li class="place-item"><h5 class="name"></h5><p class="id hidden"></p></li>'
};

var placesList = new List('places', options);

if (App.places.isEmpty()) {
    App.places.once('reset', function() {
        _.defer(filterPlaces, App.places);
    });
} else {
    _.defer(filterPlaces, App.places);
}

function filterPlaces(result) {
    placesList.clear();
    $("#place-list-wrapper").addClass('list-transparent');
    _.each(result.toJSON(), function(item) {
        // 填充所有省市（直辖市按省级）
        if (item.category == "province") {
            placesList.add({
                name: item.name,
                id: item.id
            });
        } else if (item.category == "city") {
            if(_.indexOf(['北京', '天津', '重庆', '上海'], item.name) < 0) {
                placesList.add({
                    name: item.name,
                    id: item.id
                });
            }
        }
    });
}

// function hideList() {
//     $("#place-list-wrapper").addClass('list-transparent');
// }

$("input#search-input").on('focus', function() {
    $("span.search-cancel").removeClass('hidden');
});

$("span.search-cancel").click(function(e) {
    e.stopPropagation();
    $("span.search-cancel").addClass('hidden');
    $("input#search-input").val('');
    // $("#place-list-wrapper").addClass('list-transparent');
    // hideList();
});

$("input#search-input").bind('input propertychange', function() {
    var val = $("input#search-input").val();
    if (val) {
        $("#place-list-wrapper").removeClass('list-transparent');
    } else {
        $("#place-list-wrapper").addClass('list-transparent');
    }
});
