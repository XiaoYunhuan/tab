;(function($){
    var Tab = function(tab){
        var _this_ = this;

        this.tab = tab;

        this.config = {
            //鼠标触发类型
            "triggerType" : "mouseover",
            //定义切换效果
            "effect" : "default",
            //默认展示第几个tab
            "invoke" : 1 ,
            //自动切换 切换时间间隔
            "auto" : false
        };
        //如果配置参数存在，则扩展默认的配置参数
        if(this.getConfig()){
            $.extend(this.config, this.getConfig());
        }
        //保存tab标签列表，对于内容列表
        this.tabItems = this.tab.find('ul.tab-nav li');
        this.contentItems  = this.tab.find("div.content-wrap div.content-item");
        //保存配置参数
        var config = this.config;

        if(config.triggerType === 'click'){
            this.tabItems.bind(config.triggerType,function(){
                _this_.invoke($(this));
            });
        }else if(config.triggerType === 'mouseover' || config.triggerType !== 'click'){
            this.tabItems.mouseover(function(){
                var self = $(this);
                this.timer1 = window.setTimeout(function(){
                    _this_.invoke($(self));
                },300);
                console.log(this)
            }).mouseout(function(){
                window.clearTimeout(this.timer1);
            });
        }
        //自动切换功能
        if(config.auto){
            //全局定时器
            this.timer = null;
            this.loop = 0;
            this.autoPlay();
            this.tab.hover(function(){
                console.log("hover");
                window.clearInterval(_this_.timer)
            },function(){
                console.log("out")
                _this_.autoPlay();
            })
        }
        //设置默认tab页
        if(config.invoke > 1){
            this.invoke(this.tabItems.eq(config.invoke -1));
        }
    };
    Tab.prototype = {
        getConfig: function(){
            var config = this.tab.attr('data-config');
            if(config && config !== ''){
                return $.parseJSON(config);
            }else{
                return null;
            }
        },
        invoke: function(currentTab){
            var _this_ = this;
            var index = currentTab.index();
            currentTab.addClass('actived').siblings().removeClass('actived');

            var effect = this.config.effect;
            var conItems = this.contentItems;
            if(effect === 'default' || effect !== 'fade'){
                conItems.eq(index).addClass('current').siblings().removeClass('current');
            }else if(effect === 'fade'){
                conItems.eq(index).fadeIn().siblings().fadeOut();
            }

            //如果配置了自动切换，记得把当前的loop设置为index
            if(this.config.auto){
                this.loop = index;
            }
        },
        autoPlay: function(){
            var _this_ = this,
                tabItems = this.tabItems,
                tabLength = tabItems.length,
                config = this.config;
            this.timer = window.setInterval(function(){
                console.log("setInterval");
                _this_.loop++;
                if(_this_.loop >= tabLength){
                    _this_.loop = 0;
                }
                tabItems.eq(_this_.loop).trigger(config.triggerType);

            }, config.auto);
        }
    };

    //Tab.init方法
    Tab.init = function(tabs){
        var _this_ = this;
        tabs.each(function(){
            new _this_($(this));
        })
    };

    //注册为jQuery实例方法
    $.fn.extend({
        tab:function(){
            this.each(function(){
                new Tab($(this));
            });
            return this;
        }
    });

    window.Tab = Tab;
})(jQuery);

