var App = require('../app');
var PageView = require('../pageview');
var MapData = require('../components/map-data');

App.Pages.Map = new (PageView.extend({

    map:             null,
    provinces:       null,
    provinceBoundary: [],
    cities:          null,
    cityOverlay:     [],
    currentLevel:    'province',
    events: {
        'click .btn-logout': 'logout'
    },

    ////////////////////////////// Self Methods ////////////////////////////////

    getRandomColor: function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    getCenterPoint: function(boundary){
        var count = boundary.length;
        var lngSum = 0; var latSum = 0;
        for(var i = 0; i < count; i++){
            var b = boundary[i];
            lngSum += b['lng'];
            latSum += b['lat'];
        }
        return new BMap.Point(lngSum/count, latSum/count);
    },

    createLabel: function(name){
        var label = new BMap.Label(name);
        label.setStyle({
            fontSize: '12px',
            color: 'white',
            border: null,
            backgroundColor: null
        });
        label.setOffset(new BMap.Size(20,-10));
        return label;
    },

    showOrHideOverlay: function(isShow, overlay){
        overlay.forEach(function(overlay){
            if(isShow == true){
                overlay.show();
            }else{
                overlay.hide();
            }
        });
    },
    ////////////////////////// Post Boundary Methods ///////////////////////////

    postAllBoundary: function(){
        var Province = Amour.Collection.extend({
            "url": "http://greeting.wedfairy.com/api/greetings/place/province/"
        });
        var self = this;
        new Province().fetch({
            success: function(model, provinces){
                provinces.forEach(function(province){
                    var province_id = province['id'];
                    self.postBoundary(province_id, province['name']);
                    if(province_id == 1 || province_id == 21 || province_id == 800 || province_id == 2254){
                        return;
                    }
                    ////////// post city
                    var Cities = Amour.Collection.extend({
                        "url": "http://greeting.wedfairy.com/api/greetings/place/city/?province=" + province_id
                    });
                    new Cities().fetch({
                        success: function(model, cities){
                            cities.forEach(function(city){
                                self.postBoundary(city['id'], city['name']);
                            });
                        }
                    });
                });
            }
        });
    },

    // post boundary for one province/city
    postBoundary: function(locationId, name){
        var MapData = Backbone.Model.extend({
            urlRoot: 'http://greeting.wedfairy.com/api/greetings/place/'
        });
        var mapData = new MapData;

        var bdary = new BMap.Boundary();
        bdary.get(name, function(rs){       //获取行政区域
            mapData.set({
                id: locationId,
                boundary: rs.boundaries
            });
            mapData.save(null, {
                url: mapData.url() + '/boundary/'
            });
        });
    },


    ///////////////////////////// Set Boundary /////////////////////////////////

    //level is in ['province', 'city']
    drawBoundary: function(data, level){
        var boundaries = data.get('boundary');
        var firstPath; var marker;
        var color = this.getRandomColor();
        var count = boundaries.length; //行政区域的点有多少个
        this.currentLevel = level;
        for(var i = 0; i < count; i++){
            ////////// 添加覆盖物 //////////
            var polygon = new BMap.Polygon(
                boundaries[i],
                {strokeWeight: 2, fillColor: color}
            );
            this.map.addOverlay(polygon);

            //////// Add Marker //////////
            if (i == 0 && data.get('greetings') > 0){
                firstPath = polygon.getPath();
                marker = new BMap.Marker(this.getCenterPoint(firstPath));  // 创建标注
                var label = this.createLabel(data.get('name') +"(" + data.get("greetings") + ")"); //创建
                marker.setLabel(label);
                this.map.addOverlay(marker);
            }

            ///////// Add Listener /////////
            if( level == 'province' ){
                var self = this;
                [polygon, marker].forEach(function(item){
                    if (item == null) return;
                    item.addEventListener("click", function(){
                        self.map.clearOverlays();
                        self.map.setViewport(firstPath, {zoomFactor: 1 });    //调整视野
                        self.initMapData(data.get("id"));
                        self.cities.fetch({reset: true});
                    }, false);
                });
            }else{
                [polygon, marker].forEach(function(item){
                    if (item == null) return;
                    item.addEventListener("click", function(){
                        App.router.navigate("#search?place=" + data.get('id'));
                    });
                });
            }
        }
    },

    ////////////////////////////// Init Map/////////////////////////////////////

    initMapData: function(id){
        if(id == null){ //init province data
            var Province = Amour.Collection.extend({
                "url": "http://greeting.wedfairy.com/api/greetings/place/province/"
            });
            this.provinces = new Province();
            this.provinces.on("reset", function() {
                this.provinces.forEach(function(province){
                    this.provinceBoundary.push(province);
                    this.drawBoundary(province, 'province');
                }, this);
            }, this);
        }else{   // init city data
            var Cities = Amour.Collection.extend({
                "url": "http://greeting.wedfairy.com/api/greetings/place/city/?province=" + id
            });
            this.cities = new Cities();
            this.cities.on("reset", function() {
                this.cities.forEach(function(city){
                    this.drawBoundary(city, 'city');
                    this.map.getOverlays().forEach(function(overlay){
                        if(overlay.isVisible()){
                            this.cityOverlay.push(overlay);
                        }
                    }, this);
                }, this);
            }, this);
        }
    },

    init_map_once: function(){
        this.map = new BMap.Map("map-container");
        this.map.clearOverlays();
        this.map.addControl(new BMap.NavigationControl(
            {type: BMAP_NAVIGATION_CONTROL_SMALL}
        ));
        this.map.setMapStyle({
            styleJson:[
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": {
                        "color": "#ffffff",
                        "visibility": "off"
                    }
                },
            ]
        });
        this.map.enableScrollWheelZoom();
        this.map.centerAndZoom(new BMap.Point(116.403765, 39.914850), 5);
        var self = this;
        this.map.addEventListener("zoomend", function(e){
            if(this.getZoom() == 5 && self.currentLevel == 'city'){
                self.map.clearOverlays();
                self.provinceBoundary.forEach(function(province){
                    self.drawBoundary(province, 'province');
                });
                self.currentLevel = 'province';
            }
        });
    },

    ///////////////////////////// System Callback //////////////////////////////

    initPage: function() {
        this.initMapData(null);
    },

    leave: function() {
    },

    logout: function() {
        Amour.TokenAuth.clear();
        locaion.href = '/';
    },

    render: function() {
        if(this.map == null){
            _.once(this.init_map_once());
            this.provinces.fetch({reset: true});
        }
    }

}))({el: $('#view-map')});
