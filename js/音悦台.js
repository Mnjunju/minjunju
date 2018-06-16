//全局移动默认行为取消
;(function () {
    var wrap = document.querySelector(".wrap");
    document.addEventListener("touchstart",function (event) {
        event.preventDefault();
    })
})();
// rem适配
(function (designWith) {
    var size = document.documentElement.clientWidth / (designWith / 100);
    document.documentElement.style.fontSize = size + "px";
    document.body.style.fontSize = "14px";
}(1080));
/*菜单显示和隐藏*/
(function (){
    menuShowHide();
    function menuShowHide(){
        var activeMenu = document.querySelector(".active-menu");
        var menu = document.querySelector(".menu");
        $(".active-menu").tap(function (event){
            $(".menu").toggle();
        });
        document.addEventListener("touchstart", function (event){
            if (event.changedTouches[0].target.id != "active-menu"){
                $(".menu").hide();
            }
        })
    }
});

//滑动导航
/*处理导航*/
function navHandle(){
    var activeIndex = 0;
    var lis = document.querySelectorAll(".nav li");
    for (var i = 0; i < lis.length; i++){
        lis[i].i = i;
        $(lis[i]).tap(function (event){
            lis[activeIndex].classList.remove("active");
            this.classList.add("active");
            activeIndex = this.i;
        });
    }

    var initX = 0;
    $(".nav").pan(function (event){
        this.style.transition = "";
        var deltaX = event.deltaX;
        $(this).transform("translate3d", deltaX + initX, 0, 0);
        if (event.end){
            initX += deltaX;
            if (initX >= 0){
                initX = 0;
                this.style.transition = "transform 0.4s cubic-bezier(.28,.19,.95,1.75)";
                $(this).transform("translate3d", initX, 0, 0);
            }else if (initX < -this.offsetWidth + this.parentElement.offsetWidth){
                initX = -this.offsetWidth + this.parentElement.offsetWidth;
                this.style.transition = "transform 0.4s cubic-bezier(.28,.19,.95,1.75)";
                $(this).transform("translate3d", initX, 0, 0);
            }
        }

    });

}
