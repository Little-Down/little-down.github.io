$('body').append('<div class="waifu" id="waifu" style="font-size: 40%;"><div class="waifu-tips" id="waifu-tips"></div><canvas class="live2d" id="live2d"></canvas><div class="waifu-tool" id="waifu-tool"><span class="fui-home"></span> <span class="fui-chat"></span> <span class="fui-eye"></span> <span class="fui-user"></span> <span class="fui-photo"></span> <span class="fui-info-circle"></span> <span class="fui-close"></span></div></div>');

$.ajax({ url: 'live2d/waifu-tips.js?v=1.4.2', dataType: "script", cache: true, async: false });
$.ajax({ url: 'live2d/live2d.min.js?v=1.0.5', dataType: "script", cache: true, async: false });

// live2d_settings 在 waifu-tips.js 中修改

initModel('live2d/waifu-tips.json');