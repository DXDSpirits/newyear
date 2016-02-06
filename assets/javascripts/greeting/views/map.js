var App = require('../app');
var PageView = require('../pageview');

var ProvinceCollection = Amour.Collection.extend({
    url: Amour.APIRoot + 'greetings/place/province/'
});

var UserGreeting = Amour.Model.extend({
    urlRoot: Amour.APIRoot + 'greetings/usergreeting/'
});

App.Pages.Map = new (PageView.extend({

    markers: [],
    currentVoice: null,
    greetingId:   0,
    provinceId:   null, //current greeting's province

    delayProp:  'animation-delay', //default value

    events: {
        'click .btn-logout': 'logout'
    },

    //////////////////////////// Test Methods //////////////////////////////////

    testAllAvatar: function(){
        var url = 'http://img3.imgtn.bdimg.com/it/u=2301084881,3525366494&fm=206&gp=0.jpg';
        var self = this;
        _.each(this.$('.marker'), function(province){
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
        ellipse.setAttributeNS(null, 'id', 'defs-' + this.provinceId);
        defs.appendChild(ellipse);
        dom.appendChild(defs);

        // <clipPath id="ellipse">
        //   <use xlink:href="#defs-id" overflow="visible"/>
        // </clipPath>
        var clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttributeNS(null, 'id', 'ellipse-' + this.provinceId);
        var useNode = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        useNode.setAttributeNS('http://www.w3.org/1999/xlink','href', "#defs-" + this.provinceId);
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
        var province_in_map = this.$(".province-" + this.provinceId)[0];
        var ellipse = province_in_map.getElementsByTagName('ellipse')[0];
        var cx = ellipse.getAttribute('cx');
        var cy = ellipse.getAttribute('cy');
        var rx = ellipse.getAttribute('rx');
        var ry = ellipse.getAttribute('ry');
        var avatar = province_in_map.getElementsByClassName('avatar')[0];
        // set clipPath
        this.createAvatarClipPath(cx, cy, rx, ry, avatar);

        // set Avatar
        avatar.setAttributeNS(null, 'clip-path', 'url(#ellipse-' + this.provinceId +  ')');
        var img = this.createAvatarImage(cx, cy, rx, ry, url);
        //var mask = this.createMask(province_in_map);
        var play = province_in_map.getElementsByClassName('play')[0];
        play.style.visibility = 'hidden';
        avatar.appendChild(img);
        //avatar.appendChild(mask);
    },

    setWxShare: function() {
        var profile = this.userGreeting.get('profile') || {};
        var userName = profile.name || '老乡';
        var placeName = _.chain(this.userGreeting.get('places')).pluck('name').uniq().value().join('');
        var text = ['来自『', placeName, '·', userName, '』的乡音祝福'].join('');
        App.setWxShareText(text);
    },

    initUserGreeting: function(){
        var self = this;
        this.userGreeting.clear().set({id: this.greetingId});
        this.userGreeting.fetch(
            {
                global: false,
                success: function(greeting){
                    self.setWxShare();
                    _.each(greeting.get('places'), function(place){
                        if(place['category'] == 'province'){ //just need province
                            self.provinceId = place['id'];
                        }
                    });
                    self.currentVoice = greeting;
                    if (self.provinceId == null){ return; }
                    var profile = greeting.get('profile');
                    if (profile) {  // profile may be null
                        self.createAvatar(profile.avatar);
                    }
                }
            });
    },

    restoreUserGreeting: function(){
        $('.avatar').empty();
        _.each($('.play'), function(play){
            play.style.visibility = 'visible';
        });
    },

    //////////////////////////// Init Map Methods //////////////////////////////

    markerListener: function(){
        var self = this;
        this.$(".marker").on('click', function(event){
            var clickProvinceID = event.currentTarget.getAttribute('data-id');
            if(self.currentVoice != null && self.provinceId == parseInt(clickProvinceID)){
                App.Pages.Search.setHighlight(self.currentVoice);
            }
            App.router.navigate("search/place/" + clickProvinceID);
        });
    },

    animationShow: function(){
        var maxRight = Math.abs(620 - window.screen.width);  // 620 is map size
        var self = this;
        self.provinces.fetch({
            success: function(provinces){
                // do somthing animation with map
                provinces.forEach(function(province, index) {
                    var id = province.get("id");
                    var marker = self.$(".province-" + id)[0];
                    if (marker == null) return;
                    marker.className.baseVal += ' marker-animation';
                    marker.setAttributeNS(null, 'data-id', id);
                    var leftIndex = [3125, 2942, 3045, 2743, 2296, 2597].indexOf(id);
                    if ( leftIndex >= 0){ // left part
                        marker.style.setProperty(self.delayProp, leftIndex * 150 + 'ms');
                    }else{
                        marker.style.setProperty(self.delayProp, 1200 + index * 50 + 'ms');
                    }
                    self.markers.push(marker);
                });
                self.$('.map').delay(1000).animate({scrollLeft: maxRight}, 3800, 'swing', function() {
                    self.markerListener();
                });
            }
        });
    },

    initAnimation: _.once(function() {
        this.animationShow();
    }),

    //////////////////////////// System CallBack ///////////////////////////////

    initPage: function() {
        this.provinces = new ProvinceCollection();
        this.userGreeting = new UserGreeting();
    },

    leave: function() {
        _.each(this.markers, function(marker){
            var className = marker.className.baseVal;
            var index = className.indexOf('marker-animation');
            if (index > 0){
                marker.className.baseVal = className.substring(0, index);
            }
            marker.style.opacity = 1;
        });
    },

    renderUserGreeting: function(userId) {
        if (this.greetingId != userId) {
            this.restoreUserGreeting();
            this.greetingId = userId;
            this.initUserGreeting();
        } else {
            // on returning from the search view, reset weixin share
            this.setWxShare();
        }
    },

    render: function() {
        var style = window.getComputedStyle($('body')[0]);
        if (style.getPropertyValue('-webkit-animation-delay')) {
            this.delayProp = '-webkit-animation-delay';
        } else if (style.getPropertyValue('-moz-animation-delay')) {
            this.delayProp = '-moz-animation-delay';
        }

        // animation is triggered only once, initUserGreeting should be called every time
        if (this.options.greetingId){
            this.renderUserGreeting(this.options.greetingId);
        } else {
            App.userGreeting.verify(function(exists) {
                if (exists) {
                    this.renderUserGreeting(App.user.id);
                }
            }, this);
        }

        if (Amour.LoadingScreenFinished){
            this.initAnimation();
        }else{
            Amour.on('LoadingScreenFinished', function(){
                this.initAnimation();
            }, this);
        }
        //this.testAllAvatar();
    }
}))({el: $('#view-map')});
