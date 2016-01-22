
var App = require('../app');
var PageView = require('../pageview');

var GreetingsCollection = Amour.Collection.extend({
    url: Amour.APIRoot + 'greetings/greeting/'
});
var GreetingsCollectionView = Amour.CollectionView.extend({
    ModelView: Amour.ModelView.extend({
        events: {
            'click .play': 'play'
        },
        className: 'animated fadeIn',
        template: $("#wish-item-template").html(),
        initialize: function() {
        },
        play: function() {
            location.href = '/#play/' + this.model.id;
        },
    })
});

App.Pages.Search = new (PageView.extend({
    events: {
        'click li.place-item'     : 'searchShowItems',
        'click span.search-cancel': 'cancel',
        'focus input#search-input': 'showFilters',
        'blur input#search-input' : 'hideFilters',
        'click .btn-select-search': 'selectShowItems'
    },
    initPage: function() {
        this.greetings = new GreetingsCollection();
        this.greetingsView = new GreetingsCollectionView({
            collection: this.greetings,
            el: $("#newyear-wishes-wrapper")
        });
    },
    leave: function() {},
    cancel: function(e) {
        // e.stopPropagation();
        var w = $("#view-search").width();
        this.$("span.search-cancel").addClass('hidden');
        this.$("input#search-input").val('').css('width', w).removeClass('no-border-right');
        this.$("#place-list-wrapper").addClass('hidden');
    },
    showFilters: function() {
        this.$("#newyear-wishes-wrapper").addClass('hidden');
        var w = $("#view-search").width();
        this.$("span.search-cancel").removeClass('hidden').css('width', 50);
        this.$("input#search-input").addClass('no-border-right').css('width', w - 50);
        this.$("#place-list-wrapper").removeClass('hidden');
        this.$("#places-select-wrapper").addClass('hidden');
    },
    hideFilters: function() {
        this.cancel();
        this.$("#places-select-wrapper").removeClass('hidden');
        this.$("#newyear-wishes-wrapper").removeClass('hidden');
    },
    searchShowItems: function(e) {
        var itemID = $(e.currentTarget).find('.id').text();
        var itemName = $(e.currentTarget).find('.name').text();
        this.$(".places-select select").val('');
        this.$("input#search-input").val(itemName);
        App.router.navigate("search/place/" + itemID, {trigger: true});
    },
    selectShowItems: function() {
        this.$("input#search-input").val('');
        var selected = this.$('select[name="district"]').val() ||
                       this.$('select[name="city"]').val() ||
                       this.$('select[name="province"]').val();
        // console.log(selected);
        App.router.navigate("search/place/" + selected, {trigger: true});
    },
    renderItems: function(id) {
        this.$("#newyear-wishes-wrapper").removeClass('hidden');
        $("#place-list-wrapper").addClass('hidden');
        $("#places-select-wrapper").removeClass('hidden');
        this.greetings.fetch({
            reset: true,
            data: {
                place: id,
            },
            success: function(collection) {
            }
        });
    },
    render: function() {
        var placeId = this.options.placeId;
        this.renderItems(placeId);
    }
}))({el: $('#view-search')});

var options = {
    valueNames: ['name','id'],
    item: '<li class="place-item"><p class="name"></p><p class="id hidden"></p></li>'
};

var placesList = new List('places-search', options);

if (App.places.isEmpty()) {
    App.places.once('reset', function() {
        _.defer(filterPlaces, App.places);
    });
} else {
    _.defer(filterPlaces, App.places);
}

function piecePlaces(someObject) {
    var nameList = _.pluck(_.pick(someObject, 'places').places, 'name');
    return nameList.join(',');
}

function filterPlaces(result) {
    placesList.clear();
    $("#place-list-wrapper").addClass('hidden');
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

// function parseURL() {
//     var hashValue = location.hash;
//     var re = /place=(\d+)/;

//     if(!re.test(hashValue)) {
//         return;
//     }else {
//         var matchID = re.exec(hashValue)[1];
//         App.Pages.Search.renderItems(matchID);
//     }
// }

// parseURL();

// window.onhashchange = function(){
//     parseURL();
// }