var App = require('../app');
var PageView = require('../pageview');

var ProvinceCollection = Amour.Collection.extend({
    url: 'http://greeting.wedfairy.com/api/greetings/place/province/'
});

var UserGreeting = Backbone.Model.extend({
    urlRoot: "http://greeting.wedfairy.com/api/greetings/usergreeting/"
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

    markerListener: function(){
        $(".marker").on('click', function(event){
            var className = event.currentTarget.classList[1]; //className like province-800
            if (className == undefined) return;
            var provinceID = className.substring(className.indexOf('-') + 1);
            location.href = "#search/place/" + provinceID;
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

    initUserGreeting: function(greetingId){
        this.userGreeting = new UserGreeting({id: greetingId});
        this.userGreeting.fetch(
            {
                global: false,
                url: this.userGreeting.url() + "/",
                success: function(greeting){
                    var avatar = greeting.get('profile')['avatar'];
                    _.each(greeting.get('places'), function(place){
                        if(place['category'] == 'province'){
                            var province_id = place['id'];
                            var g = $(".province-" + province_id + " g");
                            var ellipse = g[0].getElementsByTagName('ellipse')[0];
                            var cx = ellipse.cx.baseVal.value;
                            var cy = ellipse.cy.baseVal.value;
                            var rx = ellipse.rx.baseVal.value;
                            var ry = ellipse.ry.baseVal.value;
                            g.append('<image xlink:href="http://wx.qlogo.cn/mmopen/LB0icf6Q5rSSvy4EIS0jITQJo4tkELg2VCCVWJtBLvtkyqWomia7AgfzyVAyU3CbJFibQkNicDJWm0ibtYbEpGuaNXYib3ypEVS4Sp/0" x="290.2" y="160.3" height="15.6" width="15.6"/>');
                            // g.append("svg:image")
                            //     .attr('x', cx - rx)
                            //     .attr('y', cx - ry)
                            //     .attr('width', rx * 2)
                            //     .attr('height', ry * 2)
                            //     .attr("xlink:href", function(d){ return avatar; });
                            // return;
                        }
                    });
                }
            });
    },

    render: function() {
        var initAnimation = _.once(this.animationShow);
        if(this.provinces.length == 0){
            initAnimation();
            greetingId = this.options.greetingId;
            if(greetingId){
                this.initUserGreeting(greetingId);
            }
        }

    }
}))({el: $('#view-map')});
