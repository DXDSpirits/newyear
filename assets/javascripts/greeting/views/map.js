var App = require('../app');
var PageView = require('../pageview');

App.Pages.Map = new (PageView.extend({

    map: null,
    provinces: null,

    events: {
        'click .btn-logout': 'logout'
    },

    initPage: function() {
        /////////////////////////////// Models /////////////////////////////////

        var Province = Backbone.Model.extend({
            "url": "http://greeting.wedfairy.com/api/greetings/place/province/"
        });
        new Province().fetch({
            success: function(model, provinces){
                this.provinces = provinces;
                this.provinces.forEach(function(p){
                    console.log(p);
                    //Map.get_boundary(p["name"]);
                });
            }
        });
    },

    leave: function() {
    },

    logout: function() {
        Amour.TokenAuth.clear();
        location.href = '/';
    },

    get_boundary: function(province){
        var bdary = new BMap.Boundary();
        var map = this.map;
        bdary.get(province, function(rs){       //获取行政区域
            map.clearOverlays();        //清除地图覆盖物
            var count = rs.boundaries.length; //行政区域的点有多少个
            for(var i = 0; i < count; i++){
                var ply = new BMap.Polygon(
                    rs.boundaries[i],
                    {strokeWeight: 2, strokeColor: "#ff0000"}
                ); //建立多边形覆盖物

                ply.addEventListener("click", function(){
                    map.setViewport(ply.getPath());    //调整视野
                });
                map.addOverlay(ply);  //添加覆盖物
            };
        });
    },

    init_map_once: function(){
        this.map = new BMap.Map("map-container");
        this.map.addControl(new BMap.NavigationControl(
            {type: BMAP_NAVIGATION_CONTROL_SMALL}
        ));
        this.map.enableScrollWheelZoom();
    },

    render: function() {
        _.once(this.init_map_once());
        this.map.centerAndZoom(new BMap.Point(116.403765, 39.914850), 5);
    }
}))({el: $('#view-map')});
