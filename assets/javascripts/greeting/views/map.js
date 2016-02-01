var App = require('../app');
var PageView = require('../pageview');

var ProvinceCollection = Amour.Collection.extend({
    url: Amour.APIRoot + 'greetings/place/province/'
});

var UserGreeting = Backbone.Model.extend({
    urlRoot: Amour.APIRoot + 'greetings/usergreeting/'
});

App.Pages.Map = new (PageView.extend({

    markers: [],
    currentVoice: null,
    greetingId:   null,
    provinceId:   null, //current greeting's province

    events: {
        'click .btn-logout': 'logout'
    },

    //////////////////////////// Test Methods //////////////////////////////////

    testAllAvatar: function(){
        var url = 'http://img3.imgtn.bdimg.com/it/u=2301084881,3525366494&fm=206&gp=0.jpg';
        var self = this;
        _.each($('.marker'), function(province){
            var className = province.classList[1];
            var id = className.substring(className.indexOf('-') + 1);
            self.createAvatar(url, id);
        });
    },

    /////////////////////////// Init User Methods //////////////////////////////

    createMask: function(province_in_map){
        var ellipse = province_in_map.getElementsByTagName('ellipse')[1];
        var x = ellipse.getAttribute('cx');
        var y = ellipse.getAttribute('cy');
        var mask = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
        mask.setAttributeNS(null, 'opacity', '0.3');
        mask.setAttributeNS(null, 'cx', x);
        mask.setAttributeNS(null, 'cy', y);
        mask.setAttributeNS(null, 'rx', '6.6');
        mask.setAttributeNS(null, 'ry', '6.6');
        return mask;
    },

    createAvatarClipPath: function(cx, cy, rx, ry, dom){
        // <defs>
        //   <ellipse id="defs-800" cx="297.2" cy="167.4" rx="6.6" ry="6.6"/>
        // </defs>
        var defs  = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        var ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        ellipse.setAttributeNS(null, 'cx', cx);
        ellipse.setAttributeNS(null, 'cy', cy);
        ellipse.setAttributeNS(null, 'rx', '6.6');
        ellipse.setAttributeNS(null, 'ry', '6.6');
        ellipse.setAttributeNS(null, 'id', 'defs-' + this.province_id);
        defs.appendChild(ellipse);
        dom.appendChild(defs);

        // <clipPath id="ellipse">
        //   <use xlink:href="#defs-id" overflow="visible"/>
        // </clipPath>
        var clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttributeNS(null, 'id', 'ellipse-' + this.province_id);
        var useNode = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        useNode.setAttributeNS('http://www.w3.org/1999/xlink','href', "#defs-" + this.province_id);
        useNode.setAttributeNS(null, 'visibility', 'visible');
        clipPath.appendChild(useNode);
        dom.appendChild(clipPath);
    },

    createAvatarImage: function(cx, cy, rx, ry, url){
        var img = document.createElementNS('http://www.w3.org/2000/svg','image');
        img.setAttributeNS(null,'height', ry * 2);
        img.setAttributeNS(null,'width', rx * 2);
        img.setAttributeNS('http://www.w3.org/1999/xlink','href', url);
        img.setAttributeNS(null, 'visibility', 'visible');
        img.setAttributeNS(null, 'x', (cx - rx));
        img.setAttributeNS(null, 'y', (cy - ry));
        return img;
    },

    createAvatar: function(url){
        var province_in_map = $(".province-" + this.province_id)[0];
        var ellipse = province_in_map.getElementsByTagName('ellipse')[0];
        var cx = ellipse.getAttribute('cx');
        var cy = ellipse.getAttribute('cy');
        var rx = ellipse.getAttribute('rx');
        var ry = ellipse.getAttribute('ry');
        var avatar = province_in_map.getElementsByClassName('avatar')[0];
        // set clipPath
        this.createAvatarClipPath(cx, cy, rx, ry, avatar);

        // set Avatar
        avatar.setAttributeNS(null, 'clip-path', 'url(#ellipse-' + this.province_id +  ')');
        var img = this.createAvatarImage(cx, cy, rx, ry, url);
        var mask = this.createMask(province_in_map);
        var play = province_in_map.getElementsByClassName('play')[0];
        play.style.fill = 'white';
        avatar.appendChild(img);
        avatar.appendChild(mask);
    },

    initUserGreeting: function(){
        var self = this;
        this.userGreeting = new UserGreeting({id: this.greetingId});
        this.userGreeting.fetch(
            {
                global: false,
                url: self.userGreeting.url() + "/",
                success: function(greeting){
                    _.each(greeting.get('places'), function(place){
                        if(place['category'] == 'province'){ //just need province
                            self.province_id = place['id'];
                        }
                    });
                    self.currentVoice = greeting;
                    if (self.province_id == null){ return; }
                    var avatar_url = greeting.get('profile')['avatar'];
                    self.createAvatar(avatar_url);
                }
            });
    },

    //////////////////////////// Init Map Methods //////////////////////////////

    markerListener: function(){
        $(".marker").on('click', function(event){
            var className = event.currentTarget.classList[1]; //className like province-800
            if (className == undefined) return;
            var provinceID = className.substring(className.indexOf('-') + 1);
            location.href = "#search/place/" + provinceID;
        });
    },

    animationShow: function(){
        var maxRight = Math.max((620 - window.screen.width), 0);  // 620 is map size
        var self = App.Pages.Map;
        self.provinces.fetch({
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

    //////////////////////////// System CallBack ///////////////////////////////

    initPage: function() {
        this.provinces = new ProvinceCollection();
    },

    leave: function() {
        _.each(this.markers, function(marker){
            marker.style.animationName = null;
            marker.style.opacity = 1;
        });
        if(this.currentVoice != null){
            App.Pages.Search.setHighlight(this.currentVoice);
        }
    },

    renderMap: function(){
        var initAnimation = _.once(this.animationShow);
        if(this.provinces.length == 0){ // must be first time
            initAnimation();
            if(this.greetingId){ this.initUserGreeting(); }
        }
    },

    render: function() {

        this.greetingId = this.options.greetingId;
        if (Amour.LoadingScreenFinished){
            this.renderMap();
        }else{
            Amour.on('LoadingScreenFinished', function(){
                this.renderMap();
            }, this);
        }
        //this.testAllAvatar();
    }
}))({el: $('#view-map')});
