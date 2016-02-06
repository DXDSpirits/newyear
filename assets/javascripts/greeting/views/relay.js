
var App = require('../app');
var PageView = require('../pageview');

var api_key = 'f4c47fdb0a42dd2e4807716efaff039a17ea6d38';
var apiRoot = 'http://testpayapi.wedfairy.com/api/v1/new_year/';

var RankView = Amour.CollectionView.extend({
    ModelView: Amour.ModelView.extend({
        tagName: 'tr',
        className: 'sans-serif',
        template: '<td>NO.{{rank}}</td><td>{{nick_name}}</td><td>{{children_count}}</td>',
        serializeData: function() {
            var data = Amour.ModelView.prototype.serializeData.call(this);
            data.rank = this.model.collection.indexOf(this.model) + 1;
            return data;
        }
    }),
    addAll: function(_collection, options) {
        Amour.CollectionView.prototype.addAll.call(this, _collection, options);
        this.$el.prepend('<tr><th>排名</th><th>用户</th><th>接力祝福人数</th></tr>');
    }
});

App.Pages.Relay = new (PageView.extend({
    events: {
        'click .btn-share': 'share'
    },
    initPage: function() {
        this.children = new Amour.Collection();
        this.listenTo(this.children, 'reset', this.renderMy);
        this.ranks = new Amour.Collection();
        this.rankView = new RankView({
            collection: this.ranks,
            el: this.$('.ranking table')
        })
    },
    renderRankingOnce: _.once(function() {
        $.ajax({
            url: apiRoot + 'relations/rank.json',
            data: { api_key: api_key },
            dataType: 'json',
            success: _.bind(function(data) {
                this.ranks.reset(data);
            }, this)
        });
    }),
    countChildren: function() {
        $.ajax({
            url: apiRoot + 'relations/' + App.user.id + '/children.json',
            data: { api_key: api_key },
            dataType: 'json',
            success: _.bind(function(data) {
                this.children.reset(data);
            }, this)
        });
    },
    renderMy: function() {
        this.$('.win').removeClass('hidden');
        this.$('.fail').addClass('hidden');
        this.$('.my .children-count').text(this.children.length);
    },
    renderGuide: function() {
        this.$('.fail').removeClass('hidden');
        this.$('.win').addClass('hidden');
    },
    share: function() {
        App.router.navigate('map/' + App.user.id);
        _.delay(function() {
            $('#global-guideview-share').removeClass('hidden');
        }, 350);
    },
    render: function() {
        // this.renderRankingOnce();
        App.userGreeting.verify(function(exists) {
            if (exists) {
                this.countChildren();
            } else {
                this.renderGuide();
            }
        }, this);
    }
}))({el: $('#view-relay')});
