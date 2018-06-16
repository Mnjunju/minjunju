;(function (window, document){
    function myQuery(selector){
        return new init(selector);
    }

    /*当做构造函数来用*/
    function init(selector){
        this.ele = document.querySelector(selector);
    }

    init.prototype = {
        tap: function (callBack){
            if (typeof callBack != "function") return this;
            var ele = this.ele;
            ele.addEventListener("touchstart", handler);

            function handler(event){
                var touch = event.changedTouches[0];
                callBack.call(ele, {type: "tap", clientX: touch.clientX, clientY: touch.clientY});
            }

            return this;  // 为了链式调用做准备
        },
        pan: function (callBack){
            if (typeof callBack != "function") return this;

            var ele = this.ele;
            ele.addEventListener("touchstart", handler);
            ele.addEventListener("touchmove", handler);
            ele.addEventListener("touchend", handler);
            var startX, startY, deltaX, deltaY;
            var lastTime, lastDeltaX = 0, lastDeltaY = 0, speedX, speedY;

            function handler(event){
                var touch = event.changedTouches[0];
                var type = event.type;
                if (type == "touchstart"){
                    startX = touch.clientX;
                    startY = touch.clientY;
                    lastTime = new Date();
                    callBack.call(ele, {start: true});
                }else if (type == "touchmove"){
                    deltaX = touch.clientX - startX;
                    deltaY = touch.clientY - startY;
                    /*计算手指允许速度*/
                    var currentTime = new Date();
                    var deltaTime = currentTime - lastTime;
                    /*两次move之间的时间差*/
                    speedX = (deltaX - lastDeltaX) / deltaTime * 1000;
                    /*deltaX - lastDeltaX 两次move之间的距离差*/
                    speedY = (deltaY - lastDeltaY) / deltaTime * 1000;
                    callBack.call(ele, {
                        type: "pan",
                        deltaX: deltaX,
                        deltaY: deltaY,
                        speedX: speedX,
                        speedY: speedY
                    });
                    lastDeltaX = deltaX;
                    /*保存当前的距离, 为下一次计算速度做准备*/
                    lastDeltaY = deltaY;
                    lastTime = currentTime;
                }else{  // end告诉库的使用者, pan事件结束了
                    callBack.call(ele, {
                        type: "pan",
                        deltaX: deltaX,
                        deltaY: deltaY,
                        speedX: speedX,
                        speedY: speedY,
                        end: true
                    })
                }
            }

            return this;
        },
        scrollBar: function (red, width){
            var ele = this.ele;
            var parent = this.ele.parentElement;
            if (ele.offsetHeight <= parent.offsetHeight) return;
            /*如果父容器没有定位, 给父容器添加合适的定位.*/
            if (getCssValue(parent, "position") == "static"){
                parent.style.position = "relative";
            }
            /*创建一个span, 给他响应的样式, 然后成为wrap的下一个兄弟*/
            var span = document.createElement("span");
            var style = span.style;
            style.position = "absolute";
            style.backgroundColor = red;
            style.width = width + "px";
            style.height = parent.offsetHeight * parent.offsetHeight / ele.offsetHeight + "px";
            style.right = "2px";
            style.top = "0px";
            style.borderRadius = width / 2 + "px";
            style.opacity = "0";
            style.transition = "opacity 1s";
            ele.parentElement.insertBefore(span, ele.nextElementSibling);
            return this;
        },
        scroll: function (d1, scrolling){
            var ele = this.ele;
            var bar = ele.nextElementSibling;
            bar.style.opacity = scrolling ? "1" : "0";
            var parent = ele.parentElement;
            var max1 = ele.offsetHeight - parent.offsetHeight;
            var max2 = parent.offsetHeight - bar.offsetHeight;
            var d2 = -d1 * max2 / max1;
            d2 = d2 <= 0 ? 0 : d2;
            d2 = d2 >= max2 ? max2 : d2;
            bar.style.transform = "translateY(" + d2 + "px)";
        },
        /**
         *  设置3d变换, 传递的参数, 3个都必须传
         */
        transform: function (name, v1 = 0, v2 = 0, v3 = 0){
            var ele = this.ele;
            if (name == "translate3d"){
                ele.style.transform = "translate3d(" + v1 + "px," + v2 + "px," + v3 + "px)";
            }else if (name == "rotate3d"){
                ele.style.transform = "rotate3d(" + v1 + "deg," + v2 + "deg," + v3 + "deg)";
            }else if (name == "scale3d"){
                ele.style.transform = "scale3d(" + v1 + "," + v2 + "," + v3 + ")";
            }
            return this;
        },
        toggle : function (){
            var display = window.getComputedStyle(this.ele, null)["display"];
            if(display == "block"){
                this.hide();
            }else if(display == "none"){
                this.show();
            }
            return this;
        },
        show : function (){
            this.ele.style.display = "block";
            return this;
        },
        hide : function (){
            this.ele.style.display = "none";
            return this;
        }
    }
    // 给window注册两个变量
    window.$ = window.myQuery = myQuery;

    /*获取指定的css的值*/
    function getCssValue(ele, name){
        return window.getComputedStyle(ele, null)[name];
    }
})(window, document);