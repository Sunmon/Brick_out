$(document).ready(function ()
{
    init();
});

// TODO: canvas resolution 맞추기
function init()
{
    // 글씨 잘 보이게 해상도 조절
    var mainCanvas = $("#main-canvas")[0];
    var mainContext = mainCanvas.getContext("2d");
    var w = mainCanvas.clientWidth;
    var h = mainCanvas.clientHeight;
    mainContext.scale(mainCanvas.width/w, mainCanvas.height / h);
}