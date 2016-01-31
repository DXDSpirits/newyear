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
        className: 'wish-item',
        template: $('#wish-item-template').html(),
        initialize: function() {},
        serializeData: function() {
            var data = this.model ? this.model.toJSON() : {};
            var placesList = [];
            _.each(data.places, function(place) {
                placesList.push(place.name);
            });
            data.formatted_place = _.last(placesList)
            return data;
        },
        play: function() {
            App.router.navigate('play/' + this.model.id);
        },
    })
});

App.Pages.Search = new(PageView.extend({
    events: {
        'click li.place-item': 'showItemsSearch',
        'click span.search-cancel': 'cancel',
        'focus input#search-input': 'showFilters',
        'scroll .wishes-loading': 'throttleLoading',
        'change .places-select select': 'showItemsSelect'
    },
    initPage: function() {
        this.greetings = new GreetingsCollection();
        this.greetingsView = new GreetingsCollectionView({
            collection: this.greetings,
            el: $('.newyear-wishes-wrapper')
        });
        this.swiper = new Hammer(this.$('.wishes-container')[0]);
        this.swiper.on('swipeleft', _.bind(this.fetchNextPage, this));
    },
    leave: function() {},
    cancel: function() {
        this.$('.wrapper').removeClass('searching');
    },
    showFilters: function() {
        this.$('.wrapper').addClass('searching');
    },
    hideFilters: function() {
        this.cancel();
        this.$('#places-select-wrapper').removeClass('hidden');
        this.$('.newyear-wishes-wrapper').removeClass('hidden');
    },
    showItemsSearch: function(e) {
        var itemID = $(e.currentTarget).find('.id').text();
        var itemName = $(e.currentTarget).find('.name').text();
        this.$('.places-select select').val('');
        this.$('input#search-input').val(itemName);
        this.$('.wrapper').removeClass('searching');
        App.router.navigate('search/place/' + itemID, {
            trigger: true
        });
    },
    showItemsSelect: function() {
        this.$('input#search-input').val('');
        var selected = this.$('select[name="district"]').val() ||
            this.$('select[name="city"]').val() ||
            this.$('select[name="province"]').val();
        if (!selected) {
            App.router.navigate('search');
        } else {
            App.router.navigate('search/place/' + selected, {
                trigger: true
            });
        }
    },
    renderItems: function(id) {
        var self = this;
        this.greetings.fetch({
            reset: true,
            data: {
                place: id,
            },
            success: function(collection) {
                self.$('.text-tips').html('滑动卡片换一组');
            }
        });
    },
    render: function() {
        var placeId = this.options.placeId;
        this.renderItems(placeId);
    },
    fetchNextPage: function() {
        var self = this;
        if (this.greetings.next) {
            var $swiper = this.$('#wishes-swiper').clone().removeAttr('id')
                .addClass('cardOutLeft')
                .insertAfter(this.$('#wishes-swiper'));
            _.delay(function() {
                $swiper.remove();
            }, 1000);
            _.delay(function() {
                self.greetings.fetchNext({
                    reset: true
                });
            }, 350);
        } else {
            this.$('.text-tips').addClass('animated shake').html('没有更多啦');
            _.delay(function() {
                self.$('.text-tips').removeClass('animated shake');
            }, 250);
        }
    },
}))({
    el: $('#view-search')
});

var options = {
    valueNames: ['name', 'id'],
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
        if (item.category == 'province') {
            placesList.add({
                name: item.name,
                id: item.id
            });
        } else if (item.category == 'city') {
            if (_.indexOf(['北京', '天津', '重庆', '上海'], item.name) < 0) {
                placesList.add({
                    name: item.name,
                    id: item.id
                });
            }
        }
    });
}
