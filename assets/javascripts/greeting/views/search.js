var App = require('../app');
var PageView = require('../pageview');

var highlight;

var GreetingsCollection = Amour.Collection.extend({
    url: Amour.APIRoot + 'greetings/greeting/',
    parse: function(response) {
        var response = Amour.Collection.prototype.parse.call(this, response);
        if (highlight) {
            response = _.filter(response, function(item) {
                return item.id != highlight.id;
            });
            highlight.set('highlighted', true);
            response.unshift(highlight.toJSON());
            response = response.slice(0, 9);
            highlight = null;
        }
        return response;
    }
});

var GreetingsCollectionView = Amour.CollectionView.extend({
    ModelView: Amour.ModelView.extend({
        events: {
            'click .play': 'play'
        },
        className: 'wish-item',
        template: App.getTemplate('wish-search-item'),
        initialize: function() {},
        serializeData: function() {
            var data = this.model ? this.model.toJSON() : {};
            var placesList = [];
            _.each(data.places, function(place) {
                placesList.push(place.name);
            });
            data.formatted_place = _.last(placesList);
            return data;
        },
        play: function() {
            App.router.navigate('play/' + this.model.id);
        },
        render: function() {
            Amour.ModelView.prototype.render.call(this);
            if(this.model.get('highlighted')) {
                // this.className = 'wish-item highlighted';
                $(this.el).addClass('highlight-true');
            }
            return this;
        }
    })
});

App.Pages.Search = new(PageView.extend({
    events: {
        'click .place-item': 'showItemsSearch',
        'click span.search-cancel': 'hideFilters',
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
    setHighlight: function(h) {
        highlight = h;
    },
    showFilters: function() {
        this.$('.wrapper').addClass('searching');
    },
    hideFilters: function() {
        this.$('.wrapper').removeClass('searching');
    },
    showItemsSearch: function(e) {
        var itemID = $(e.currentTarget).find('.id').text();
        var itemName = $(e.currentTarget).find('.name').text();
        this.$('.places-select select').val('');
        this.$('input#search-input').val(itemName);
        this.hideFilters();
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
            success: function() {
                self.$('.text-tips').html('滑动卡片换一组');
            }
        });
    },
    render: function() {
        this.placeId = this.options.placeId;
        // this.fillSelector(App.places.toJSON(), this.placeId);
        this.$('.places-select').selectPlace(this.placeId);
        this.renderItems(this.placeId);
    },
    fetchNextPage: function() {
        var self = this;
        if (this.greetings.next) {
            var $swiper = this.$('#wishes-swiper').clone().removeAttr('id')
                .addClass('cardOutLeft')
                .insertAfter(this.$('#wishes-swiper'));
            this.$('#wishes-swiper .wish-item').animate({opacity: 0}, 350);
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
    fillSelector: function(someArray, id) {
        id = +id;
        var matchItem = _.findWhere(someArray, {'id': id});
        if(matchItem.category == "province") {
            this.$('select[name="province"]').val(matchItem.id);
        }else if(matchItem.category == "city") {
            var matchProvinceItem = _.findWhere(someArray, {"id": +matchItem.parent});
            this.$('select[name="province"]').val(matchProvinceItem.id);
            this.$('select[name="province"]').trigger('change');
            this.$('select[name="city"]').val(matchItem.id);
        }else {
            var matchDistrictID = id;
            var matchCityItem = _.findWhere(someArray, {"id": +matchItem.parent});
            var matchProvinceItem = _.findWhere(someArray, {"id": +matchCityItem.parent});
            this.$('select[name="province"]').val(matchProvinceItem.id);
            this.$('select[name="province"]').trigger('change');
            this.$('select[name="city"]').val(matchCityItem.id);
            this.$('select[name="city"]').trigger('change');
            this.$('select[name="district"]').val(matchItem.id);
        }
    }
}))({
    el: $('#view-search')
});

var options = {
    valueNames: ['name', 'id'],
    page: 20,
    item: '<li class="place-item"><div class="name"></div><div class="id hidden"></div></li>'
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

