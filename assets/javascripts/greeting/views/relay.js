
var App = require('../app');
var PageView = require('../pageview');

var ChildrenModel = Amour.Model.extend({
    urlRoot: Amour.APIRoot + 'greetings/ranking/'
});

var RankCollection = Amour.Collection.extend({
    url: Amour.APIRoot + 'greetings/ranking/'
});

var RankView = Amour.CollectionView.extend({
    ModelView: Amour.ModelView.extend({
        tagName: 'tr',
        className: 'sans-serif',
        template: '<td>NO.{{rank}}</td><td><span>{{name}}</span></td><td>{{count}}</td>',
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
        this.children = new ChildrenModel();
        this.listenTo(this.children, 'change', this.renderMy);
        this.ranks = new RankCollection();
        this.rankView = new RankView({
            collection: this.ranks,
            el: this.$('.ranking table')
        })
    },
    countChildren: function() {
        this.children.clear({
            silent: true
        }).set({
            id: App.user.id
        }, {
            silent: true
        });
        this.children.fetch();
    },
    renderMy: function() {
        this.$('.win').removeClass('hidden');
        this.$('.fail').addClass('hidden');
        this.$('.my .children-count').text(this.children.get('count'));
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
        this.ranks.fetch({ reset: true });
        App.userGreeting.verify(function(exists) {
            if (exists) {
                this.countChildren();
            } else {
                this.renderGuide();
            }
        }, this);
    }
}))({el: $('#view-relay')});
