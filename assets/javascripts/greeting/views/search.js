
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
        template: $("#wish-item-template").html(),
        initialize: function() {
        },
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
        // 'click .places-select option': 'showItemsSelect',
        'scroll .wishes-loading'  : 'throttleLoading',
        // 'swipeleft #wishes-swiper': 'swipeleft'
    },
    initPage: function() {
        this.greetings = new GreetingsCollection();
        this.greetingsView = new GreetingsCollectionView({
            collection: this.greetings,
            el: $(".newyear-wishes-wrapper")
        });
        // this.$('.wishes-loading').on('scroll', _.bind(this.throttleLoading, this));
        this.$('.places-select select').on('change', _.bind(this.showItemsSelect, this));

        this.swiper = new Hammer(document.getElementById("wishes-swiper"));
        this.swiper.on("swipeleft", _.bind(this.fetchNextPage, this));
    },
    swipeleft: function() {
        if(this.greetings.next) {
            this.$("#wishes-swiper").addClass('animated fadeOutLeft');
            _.delay(this.fetchNextPage, 1000);
        }
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
        if(!selected) {
            App.router.navigate('search');
        }else {
            App.router.navigate("search/place/" + selected, {trigger: true});
        }
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
    // throttleLoading: _.throttle(function() {
    //     if (this.fetching) return;
    //     var scrollTop = this.$('.wishes-loading').scrollTop();
    //     var height = this.$('.wishes-loading').height();
    //     if (scrollTop + height >= this.$('.newyear-wishes-wrapper').height()) {
    //         this.fetchMore();
    //     }
    // }, 200),
    fetchNextPage: function() {
        var self = this;
        if(this.greetings.next) {
            this.$("#wishes-swiper").addClass('animated fadeOutLeft');
            _.delay(function() {
                self.greetings.fetchNext({
                    reset: true,
                    remove: true,
                    // global: false,
                    success: function() {
                        self.$("#wishes-swiper").removeClass('animated fadeOutLeft').fadeIn();
                    }
                });
            }, 350);
        }else {
            this.$(".text-tips").addClass('animated shake').html("没有更多啦");
            _.delay(function() {
                self.$(".text-tips").removeClass('animated rubberBand');
            }, 250);
        }
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
