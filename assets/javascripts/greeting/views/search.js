
var App = require('../app');
var PageView = require('../pageview');

var GreetingsCollection = Amour.Model.extend({
    url: Amour.APIRoot + 'greetings/greeting/'
});
var $itemsWrapper = $(".newyear-wishes-wrapper");

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
    },
    leave: function() {},
    cancel: function(e) {
        // e.stopPropagation();
        var w = $("#view-search").width();
        $("span.search-cancel").addClass('hidden');
        $("input#search-input").val('').css('width', w).removeClass('no-border-right');
        $("#place-list-wrapper").addClass('hidden');
        // placesList.update();
    },
    showFilters: function() {
        $itemsWrapper.addClass('hidden');
        var w = $("#view-search").width();
        $("span.search-cancel").removeClass('hidden').css('width', 50);
        $("input#search-input").addClass('no-border-right').css('width', w - 50);
        $("#place-list-wrapper").removeClass('hidden');
        $("#places-select-wrapper").addClass('hidden');
    },
    hideFilters: function() {
        this.cancel();
        $("#places-select-wrapper").removeClass('hidden');
    },
    searchShowItems: function(e) {
        var itemID = $(e.currentTarget).find('.id').text();
        // var itemName = $(e.currentTarget).find('.name').text();
        // $("input#search-input").val(itemName);
        this.renderItems(itemID);
    },
    selectShowItems: function() {
        var selected = this.$('select[name="district"]').val() ||
                       this.$('select[name="city"]').val() ||
                       this.$('select[name="province"]').val();
        this.renderItems(selected);
    },
    renderItems: function(id) {
        $("#place-list-wrapper").addClass('hidden');
        $("#places-select-wrapper").removeClass('hidden');
        this.greetings.fetch({
            reset: true,
            data: {
                place: id,
            },
            success: function(collection) {
                var wishArray = collection.toJSON().results;
                renderFilterResult(wishArray);
            }
        });
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

function renderFilterResult(arrayResult) {
    $itemsWrapper.html('');
    _.each(arrayResult, function(wish) {
        var wishID = wish.id;
        var wishPlayUrl = '/#play/' + wishID;
        var wishOwerName = wish.profile.name;
        var wishPlace = piecePlaces(wish);
        var wishOwerAvatar = wish.profile.avatar;

        var avatarDiv = '<div class="inline-div inline-div-avatar"><div class="avatar" style="background: url(' +
                        wishOwerAvatar +
                        ');background-size: contain;background-repeat: no-repeat;background-position: center;"></div></div>';

        var nameDiv = '<div class="inline-div inline-div-name"><div class="name">' +
                        wishOwerName +
                        '</div></div>';

        var placeDiv = '<div class="inline-div inline-div-place"><div class="place">' +
                        wishPlace +
                        '</div></div>';
        var playBtnDiv = '<div class="inline-div inline-div-play"><div class="play"><a href="' +
                         wishPlayUrl +
                        '">收听</div></div>';

        var wishItem = '<div class="wish-item">' + avatarDiv + nameDiv + placeDiv + playBtnDiv + '</div>';
        $itemsWrapper.append(wishItem);
    });
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

function parseURL() {
    var hashValue = location.hash;
    var re = /place=(\d+)/;

    if(!re.test(hashValue)) {
        return;
    }else {
        var matchID = re.exec(hashValue)[1];
        App.Pages.Search.renderItems(matchID);
    }
}

parseURL();

window.onhashchange = function(){
    parseURL();
}