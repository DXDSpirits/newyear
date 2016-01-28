var App = require('../app');
var PageView = require('../pageview');

var ProvinceCollection = Amour.Collection.extend({
    url: 'http://greeting.wedfairy.com/api/greetings/place/province/'
});

App.Pages.Map = new (PageView.extend({

    markers: [],

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
        _.each(this.markers, function(marker){
            marker.style.animationName = null;
            marker.style.opacity = 1;
        });
    },

    animationShow: function(){
        var maxRight = 620 - window.screen.width;  // 620 is map size
        var self = App.Pages.Map;
        self.provinces.fetch({
            reset: true,
            success: function(provinces){
                // do somthing animation with map
                _.each(provinces.models, function(province, index){
                    var id = province.get("id");
                    var marker = $(".province-" + id)[0];
                    if (marker == undefined) return;
                    marker.style.animationDuration = "2s";
                    marker.style.animationFillMode = "forwards";
                    marker.style.animationName = "bounce";

                    var leftIndex = [3125, 2942, 3045, 2743, 2296, 2597].indexOf(id);
                    if ( leftIndex >= 0){ // left part
                        marker.style.animationDelay = leftIndex * 150 + "ms";
                    }else{
                        marker.style.animationDelay = 6 * 200 + index * 50 + "ms";
                    }
                    self.markers.push(marker);
                });
                $('.map').delay(1000).animate({scrollLeft: maxRight}, 3800, 'swing', self.markerListener);
            }
        });
    },

    markerListener: function(){
        $(".marker").on('click', function(event){
            var className = event.currentTarget.classList[1]; //className like province-800
            if (className == undefined) return;
            var provinceID = className.substring(className.indexOf('-') + 1);
            location.href = "#search/place/" + provinceID;
        });
    },

    render: function() {
        var initAnimation = _.once(this.animationShow);
        if(this.provinces.length == 0){
            initAnimation();
        }
    }
}))({el: $('#view-map')});
