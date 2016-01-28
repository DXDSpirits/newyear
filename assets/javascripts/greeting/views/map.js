var App = require('../app');
var PageView = require('../pageview');

var ProvinceCollection = Amour.Collection.extend({
    url: 'http://greeting.wedfairy.com/api/greetings/place/province/'
});

App.Pages.Map = new (PageView.extend({

    events: {
        'click .btn-logout': 'logout'
    },

    //////////////////////////// System CallBack ///////////////////////////////

    initPage: function() {
        //fetch city of greeting
        this.provinces = new ProvinceCollection();
        this.provinces.on("reset", function(provinces){
        });
    },

    leave: function() {

    },

    render: function() {
        maxRight = 620 - window.screen.width;  // 620 is map size
        var map = $('.map');
        //map.scrollLeft(maxRight); //init state

        this.provinces.fetch({
            reset: true,
            success: function(provinces){
                // do somthing animation with map
                _.each(provinces.models, function(province, index){
                    var id = province.get("id");
                    var node = $(".province-" + id)[0];
                    if (node == undefined) return;
                    node.style.animationDuration = "2s";
                    node.style.animationFillMode = "forwards";
                    node.style.animationName = "bounce";

                    var leftIndex = [3125, 2942, 3045, 2743, 2296, 2597].indexOf(id);
                    if ( leftIndex >= 0){ // left part
                        node.style.animationDelay = leftIndex * 150 + "ms";
                    }else{
                        node.style.animationDelay = 6 * 200 + index * 50 + "ms";
                    }
                });
                map.delay(1000).animate({scrollLeft: maxRight}, 3500, 'swing');
            }
        });
    }
}))({el: $('#view-map')});
