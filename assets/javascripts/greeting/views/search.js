
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
        'click li.place-item'     : 'showItemsSearch',
        'click span.search-cancel': 'cancel',
        'focus input#search-input': 'showFilters',
        // 'blur input#search-input' : 'hideFilters',
        'click .btn-select-search': 'showItemsSelect',
        'scroll .wishes-loading': 'throttleLoading'
    },
    initPage: function() {
        this.greetings = new GreetingsCollection();
        this.greetingsView = new GreetingsCollectionView({
            collection: this.greetings,
            el: $(".newyear-wishes-wrapper")
        });
        this.$('.wishes-loading').on('scroll', _.bind(this.throttleLoading, this));
    },
    leave: function() {},
    cancel: function() {
        this.$(".search-wrapper").removeClass('searching');
    },
    showFilters: function() {
        this.$(".search-wrapper").addClass('searching');
    },
    hideFilters: function() {
        this.cancel();
        this.$("#places-select-wrapper").removeClass('hidden');
        this.$(".newyear-wishes-wrapper").removeClass('hidden');
    },
    showItemsSearch: function(e) {
        var itemID = $(e.currentTarget).find('.id').text();
        var itemName = $(e.currentTarget).find('.name').text();
        this.$(".places-select select").val('');
        this.$("input#search-input").val(itemName);
        this.$(".search-wrapper").removeClass('searching');
        App.router.navigate("search/place/" + itemID, {trigger: true});
    },
    showItemsSelect: function() {
        this.$("input#search-input").val('');
        var selected = this.$('select[name="district"]').val() ||
                       this.$('select[name="city"]').val() ||
                       this.$('select[name="province"]').val();
        App.router.navigate("search/place/" + selected, {trigger: true});
    },
    renderItems: function(id) {
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
    },
    throttleLoading: _.throttle(function() {
        console.log(this.fetching);
        if (this.fetching) return;
        var scrollTop = this.$('.wishes-loading').scrollTop();
        console.log(scrollTop);
        var height = this.$('.wishes-loading').height();
        if (scrollTop + height >= this.$('.newyear-wishes-wrapper').height()) {
            this.fetchMore();
        }
    }, 200),
    fetchMore: function() {
        console.log(22);
        this.fetching = true;
        this.$('.loading-more').button('loading');
        var self = this;
        var delayReset = function() {
            self.fetching = false;
            self.$('.loading-more').button('reset');
        };
        _.delay(function() {
            self.greetings.fetchNext({
                remove: false,
                success: delayReset
            });
        }, 200);
    },
}))({el: $('#view-search')});

var options = {
    valueNames: ['name','id'],
    page: 20,
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