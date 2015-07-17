var config = {
    basepath : "../"
};
var mapModel = function($) {
    var pub = {};
    var geocoder = new google.maps.Geocoder();
    var sts_ok = google.maps.GeocoderStatus.OK;
    var infoW = new google.maps.InfoWindow({
        content:'<div id="info-window">'+ "Maker"+ "</div>"
    });
    pub.getInfos = function(bounds,callback) {
        var params = {};
        var sw,ne;
        if(bounds) {
            sw = bounds.getSouthWest();
            ne = bounds.getNorthEast();
            params.from = { x: sw.lat(), y:sw.lng() };
            params.to = { x: ne.lat(), y:ne.lng() };
        }
        //$.get("/infos",params,callback);
        callback.apply(this,[latLngs]);
    }
    pub.newLatLng = function(info) {
        return new google.maps.LatLng(info.x,info.y);
    };
    pub.find = function(address,okCallback,ngCallback) {
        geocoder.geocode({'address': address},function(res,sts){
            if (sts === sts_ok) {
                okCallback.apply(this,[res]);
            } else {
                ngCallback.apply(this,[sts]);
            }
        });
    };
    pub.drawInfos = function(res) {
        $.each(res,function(idx,latLng) {
            var target = new google.maps.LatLng(latLng.x,latLng.y);
            var mk02 = new google.maps.Marker({
                position:target,
                title:"N"
            });
            mk02.setMap(pub.map);
            google.maps.event.addListener(mk02,"click",function() {
                $.data(document.forms["info"],"target-info",latLng);
                pub.map.panTo(target);
                var content = '<div class="info-window">';
                content+='<div class="info-window-header"><h4>'+latLng.title
                +"<div class='btn-group pull-right'>"
                +"<button type='button' data-info-idx='"+idx+"' data-toggle='modal' data-target='#myModal' class='btn btn-xs btn-default btn-edit'><span class='glyphicon glyphicon-pencil'></span></button>"
                +"<button type='button' data-info-idx='"+idx+"' class='btn btn-xs btn-default btn-star'><span class='glyphicon glyphicon-star'></span></button>"
                +"</div>"
                +'</h4></div>'
                +'<div class="info-window-body">'
                +'<p>緯度：<span>'+latLng.x+'</span>　経度：<span>'+latLng.y+'</span>'
                +'</div>';
                if(latLng.imgs) {
                    content+="<div class='info-window-photos'>";
                    for(var i=0,max=latLng.imgs.length;i<max;i++) {
                        content+='<img height="60px" src="'+latLng.imgs[i]+'" class="img-thumbnail" style="height:100px;">'
                    }
                    content+="</div>";
                }
                infoW.setContent(content);
                infoW.open(pub.map,mk02);
            });
        });
    };
        //var startPos = { x: 35.65748803011274, y: 139.79381561279297 };
    var startPos = { x: 35.6594406935171, y: 139.792056083679 };
        var pos01 = new google.maps.LatLng(startPos.x,startPos.y);

        var mapOptions = {
            center: pos01,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        pub.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

        var myLatlng = {x:startPos.x+0.00001,y:startPos.y+0.0001}
        //var mk = new google.maps.Marker({
        //    position:new google.maps.LatLng(myLatlng.x,myLatlng.y),
        //    title:"Y"
        //});
        //mk.setMap(pub.map);
        //var mk01 = new google.maps.Marker({
        //    position:pos01,
        //    title:"X"
        //});
        //mk01.setMap(pub.map);
        google.maps.event.addListener(pub.map,'bounds_changed',function(e) {
            var nowBounds = pub.map.getBounds();
            pub.getInfos(nowBounds,function(res) {
                pub.drawInfos(res);
            });
        });
        google.maps.event.addListener(pub.map,'click',function(e) {
            console.log("{x:"+e.latLng.d +",y:"+e.latLng.e+"}");
        });
    return pub;
}(jQuery);
jQuery(function($){
    $("#search").on("submit",function(e){
        e.preventDefault();
        var address = this["q"].value;
        if(!address) {
            return false;
        }
        mapModel.find(address, function(results) {
            mapModel.map.setCenter(results[0].geometry.location);
            var bounds = mapModel.map.getBounds();
             var marker = new google.maps.Marker({
                     map: mapModel.map,
                     position: results[0].geometry.location
             });
        },function(sts) { // NG callback
             alert("[" + address + "]が見つかりませんでした。reason: " + status);
        });
    });
    $("body").on("click",".btn-edit",function(e) {
        e.preventDefault();
        var idx = $(this).attr("data-info-idx");
        var targetLatLng = $.data(document.forms["info"],"target-info");
        var $form = $(document.forms["info"]);
        $form.find("#info-name").val(targetLatLng.title);
        $form.find(".x").text(targetLatLng.x);
        $form.find(".y").text(targetLatLng.y);
        $form.find("#info-cmt").val(targetLatLng.cmt);
    }).on("submit","[name=info]",function(e) {
        //e.preventDefault();
    });
});
var latLngs = [
{x:"35.6594406935171",y:"139.792056083679",title:"西101-1",imgs:['../public/images/samples/1.png','../public/images/samples/2.png'],rank:"1"}
//,{x:"35.6587825466773",y:"139.792002439498",title:"東101-2",imgs:['../public/images/samples/2.png'],rank:"2"}
//,{x:"35.6582246431215",y:"139.792608618736",title:"北101-3",imgs:['../public/images/samples/3.png'],rank:"3"}
//,{x:"35.6579936350393",y:"139.792742729187",title:"南101-4",imgs:['../public/images/samples/1.png'],rank:"4"}
//,{x:"35.6578149302155",y:"139.792973399162",title:"西101-5",imgs:['../public/images/samples/1.png','../public/images/samples/2.png'],rank:"5"}
//,{x:"35.6578236475333",y:"139.793601036071",title:"東101-6",imgs:['../public/images/samples/2.png'],rank:"1"}
//, { x: "35.658311815809", y: "139.793139696121", title: "北101-7", imgs: ['../public/images/samples/3.png'], rank: "2" }
//,{x:"35.6584294987862",y:"139.79303240776",title:"南101-8",imgs:['../public/images/samples/1.png'],rank:"3"}
//,{x:"35.6592837848292",y:"139.794405698776",title:"西101-9",imgs:['../public/images/samples/1.png','../public/images/samples/2.png'],rank:"4"}
//,{x:"35.6588610015522",y:"139.793756604194",title:"東101-10",imgs:['../public/images/samples/2.png'],rank:"5"}
//,{x:"35.6595496577023",y:"139.792909026145",title:"北101-11",imgs:['../public/images/samples/3.png'],rank:"1"}
//,{x:"35.660120627602",y:"139.793579578399",title:"南101-12",imgs:['../public/images/samples/1.png'],rank:"2"}
//,{x:"35.6564942455829",y:"139.795795083045",title:"西101-13",imgs:['../public/images/samples/1.png','../public/images/samples/2.png'],rank:"3"}
//,{x:"35.6566991056864",y:"139.796127676963",title:"東101-14",imgs:['../public/images/samples/2.png'],rank:"4"}
//,{x:"35.656982421985",y:"139.796503186225",title:"北101-15",imgs:['../public/images/samples/3.png'],rank:"5"}
//,{x:"35.6561019588117",y:"139.794647097587",title:"南101-16",imgs:['../public/images/samples/1.png'],rank:"1"}
//,{x:"35.6558709445894",y:"139.794850945472",title:"西101-17",imgs:['../public/images/samples/1.png','../public/images/samples/2.png'],rank:"2"}
//,{x:"35.6556486472541",y:"139.794335961341",title:"東101-18",imgs:['../public/images/samples/2.png'],rank:"3"}
//,{x:"35.6554219905104",y:"139.794083833694",title:"北101-19",imgs:['../public/images/samples/3.png'],rank:"4"}
//,{x:"35.655260715128",y:"139.794191122055",title:"南101-20",imgs:['../public/images/samples/1.png'],rank:"5"}
//,{x:"35.655443784456",y:"139.794491529464",title:"南101-21",imgs:['../public/images/samples/1.png','../public/images/samples/2.png'],rank:"5"}
//,{x:"35.6556878762406",y:"139.794920682907",title:"南101-22",imgs:['../public/images/samples/2.png'],rank:"5"}
//,{x:"35.6554394256674",y:"139.795355200767",title:"南101-23",imgs:['../public/images/samples/3.png'],rank:"5"}
//,{x:"35.6551996919254",y:"139.79556441307",title:"南101-24",imgs:['../public/images/samples/1.png'],rank:"3"}
];

jQuery(function($){
    $("#move").popover({
        html:true,
        content:function(){
            return $(".move-content").html();
        }
    });
    $("#pop").popover({
        html:true,
        content:function(){
            return $(".pop-content").html();
        }
    });
})
