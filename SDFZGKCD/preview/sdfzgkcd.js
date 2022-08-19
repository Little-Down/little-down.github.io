var week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
var weeken = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var weekjp = ["日 | Nichi", "月 | Getsu", "火 | Ka", "水 | Sui", "木 | Moku", "金 | Kin", "土 | Do"];
var schd = [[], [], [], [], [], [], []];
var szClsBgnTime = [[], []], szClsOvrTime = [[], []];
var timeDest = new Date("1970/01/01");

var nClsCur = 0;
var bOnClass = false, bOnShow = true;
var bShowLive2D = true, bClosed = false;
var tmrMove = 0;

var eleLine = document.getElementById("line");
var eleWaifu = document.getElementById("waifu");
var objWeek = $("#week"), objLeft = $(".left"), objWth = $("#weather"), objImg = $("#img"), objWL = $(".weeklang");

function UpdateTime() {
    // 计算当前时间
    var t = new Date();
    var y = t.getFullYear();
    var m = t.getMonth() + 1; if (m < 10) m = "0" + m;
    var d = t.getDate(); if (d < 10) d = "0" + d;
    var h = t.getHours(); if (h < 10) h = "0" + h;
    var min = t.getMinutes(); if (min < 10) min = "0" + min;
    var s = t.getSeconds(); if (s < 10) s = "0" + s;
    var ms = t.getMilliseconds();
    var szHrMin = h + ":" + min;

    document.getElementById("year").innerText = y;
    document.getElementById("month").innerText = m;
    document.getElementById("day").innerText = d;
    document.getElementById("hour").innerText = h;
    document.getElementById("minute").innerText = min;
    document.getElementById("second").innerText = s;

    // 计算剩余时间
    var bNeg = false;
    var tl = timeDest.getTime() - t.getTime();
    if (tl < 0) { // 时间已过
        bNeg = true;
        tl = -tl;
    }
    tl = Math.floor(tl / 1000);
    var dl = Math.floor(tl / 60 / 60 / 24);
    if (dl < 10 && dl >= 0) dl = "0" + dl;
    if (bNeg) dl = "-" + dl;
    var hl = Math.floor(tl / 60 / 60 % 24);
    if (hl < 10 && hl >= 0) hl = "0" + hl;
    var minl = Math.floor(tl / 60 % 60);
    if (minl < 10 && minl >= 0) minl = "0" + minl;
    var sl = tl % 60;
    if (sl < 10 && sl >= 0) sl = "0" + sl;

    document.getElementById("dayleft").innerText = dl;
    document.getElementById("hourleft").innerText = hl;
    document.getElementById("minuteleft").innerText = minl;
    document.getElementById("secondleft").innerText = sl;

    // 星期
    var day = t.getDay();
    document.getElementById("week").innerText = week[day];
    document.getElementById("weeken").innerText = weeken[day];
    document.getElementById("weekjp").innerText = weekjp[day];

    for (let i = 0; i < 9; ++i) { // 显示课程表文字
        document.getElementById("cls" + i).innerText = schd[day][i];
    }

    var bSchd = 0, iCls = -1, bOnCls = false;
    for (let i = 1; i <= 11; ++i) { // 判断当前课程
        bSchd = day == 0 || day == 6 ? 1 : 0;
        if (szHrMin >= szClsOvrTime[bSchd][i - 1] && szHrMin < szClsBgnTime[bSchd][i]) {
            iCls = i - 2; bOnCls = false;
            if (!bOnShow) ClassOver();
            break;
        }
        else if (szHrMin >= szClsBgnTime[bSchd][i] && szHrMin < szClsOvrTime[bSchd][i]) {
            iCls = i - 2; bOnCls = true;
            if (bOnShow) ClassBegin();
            break;
        }
    }

    for (let i = 0; i < iCls; ++i) { // 已结束课程变灰
        var ele = document.getElementById("cls" + i);
        ele.style.color = "lightslategray";
        ele.style.textShadow = "0 0 0 black";
    }

    // 右衬线
    if (iCls >= 0 && iCls < 9) {
        if (bOnCls) {
            eleLine.style.top = $("#cls" + iCls).offset().top / window.innerHeight * 100 + 0.8 + "%";
            eleLine.style.height = "4.2%";
        }
        else {
            eleLine.style.top = $("#cls" + iCls).offset().top / window.innerHeight * 100 - 2 + "%";
            eleLine.style.height = "2%";
        }
    }
    else eleLine.style.top = "-8%";

    // 将延迟控制在 10 ~ 50 ms 之间，30 ms 左右
    if (ms < 10 || ms > 50) setTimeout(UpdateTime, 1030 - ms);
    else setTimeout(UpdateTime, 1000);
}

function MoveWaifu(nPosDest) {
    var nPosCur = eleWaifu.offsetLeft; // 获取当前位置，数字类型
    // .style.left 只能获取到行内样式，不能获取到 <style> 标签内的样式
    var nStep = 2;
    if (nPosCur > nPosDest) nStep = -nStep;
    nPosCur += nStep;
    if (Math.abs(nPosDest - nPosCur) > Math.abs(nStep)) {
        eleWaifu.style.left = nPosCur + "px";
    }
    else {
        clearInterval(tmrMove);
        eleWaifu.style.left = nPosDest + "px";
    }
}

function HideWaifu() {
    if (tmrMove) clearInterval(tmrMove);
    var cw = window.innerWidth;
    tmrMove = setInterval("MoveWaifu(" + (2400 * cw / 1920 + (1280 - cw) / 16) + ")", 3);
    bOnShow = false;
}
function ShowWaifu() {
    if (tmrMove) clearInterval(tmrMove);
    var cw = window.innerWidth;
    tmrMove = setInterval("MoveWaifu(" + (1260 * cw / 1920 + (1280 - cw) / 16) + ")", 3);
    bOnShow = true;
}

function ClassBegin() {
    showMessage("该上课啦，认真听课哦~ 拜拜~", 5000);
    setTimeout(HideWaifu, 4500);
}
function ClassOver() {
    setTimeout("showMessage(\"下课啦，来陪我玩吧~\", 5000)", 1500);
    ShowWaifu();
}

$('.waifu-tool .fui-close').click(function () {
    bClosed = true;
});

function AdjustSize() {
    // 调整大小
    var cw = window.innerWidth, ch = window.innerHeight;
    document.body.style.fontSize = (ch * 0.037) + "px";

    document.getElementById("weather").style = "transform: translateY(" + (ch - 1080) / 8 + "px) scale(" + cw / 1920 + ");"

    var pWaifu = (bOnShow ? 1260 : 2400) * cw / 1920 + (1280 - cw) / 16;
    eleWaifu.style.left = pWaifu + "px";
    eleWaifu.style.top = "";
    document.getElementById("live2d").style.height = 300 * cw / 1920 + "px";

    var pLine = (objWeek.offset().left + objWeek.outerWidth(true)) / cw * 100 + 0.4;
    document.getElementById("weekline").style.left = pLine + "%";
    document.getElementsByClassName("weeklang")[0].style.left = pLine + 0.4 + "%";
    document.getElementById("line").style.left = pLine + "%";

    // 碰撞隐藏
    if (pWaifu + 25 < objLeft.offset().left + objLeft.outerWidth(true))
        $("#waifu").hide();
    else if (!bClosed) $("#waifu").show();

    if (objWth.offset().left < objImg.offset().left + objImg.outerWidth(true) ||
        objWth.offset().left + cw * 0.140625 > objWeek.offset().left)
        objWth.hide();
    else objWth.show();

    if (objWL.offset().left + objWL.outerWidth(true) + 3 > cw) {
        $("#weekline").hide();
        objWL.hide();
    }
    else {
        $("#weekline").show();
        objWL.show();
    }
}

function ReadJson(bAsync = true) {
    $.ajax({
        url: "Properties.json",
        type: "get",
        dataType: "json",
        async: bAsync,
        success: function (res) {
            timeDest = new Date(res.date_dest);
            document.getElementById("yeardest").innerText = timeDest.getFullYear();
            document.getElementById("describe").innerText = res.describe;
            schd = res.schedule;
            szClsBgnTime = res.class_begin_time;
            szClsOvrTime = res.class_over_time;
            document.getElementById("bg").src = res.background_image;
            if (res.background_image != "none")
                document.getElementById("bg").style.visibility = "visible";
            if (bShowLive2D != res.show_live2d) {
                bShowLive2D = res.show_live2d;
                if (!bShowLive2D) $("#waifu").hide();
                else $("#waifu").show();
            }
        }
    });
}

function Init() {
    document.getElementById("waifu").style.width = "17.5%"
    document.getElementById("live2d").style.width = "100%";
    document.getElementById("live2d").style.height = "100%";
    document.getElementById("waifu-tips").style.width = "66.67%";
    document.getElementById("waifu-tips").style.height = "28%";
    document.getElementById("waifu-tips").style.fontSize = "100%";
    document.getElementById("waifu-tool").style.fontSize = "150%";

    ReadJson(false);
    if (!bShowLive2D) $("#waifu").hide();

    setInterval(ReadJson, 8000); // 每 8 秒读取一次 schedule.json

    UpdateTime();

    AdjustSize();
    window.onresize = AdjustSize;
}

Init();