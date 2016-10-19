//time to load the leaploop
var docDimensions = {
        width: 500, // initialized to this for now.
        height: 500
};
var controllerOptions = {enableGestures: true};
chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab)
{
    if (changeInfo.status == 'complete' && tab.active) {
        console.log("active tab found!");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id,{ request: 'getDocumentDimensions' }, function (response) {
                scrollHelper.updateDimensions(response);
                //console.log("response updated!");
                //console.dir(response);
            //console.log("tabs gotten!");
        });
        });
        console.log('request sent!');

    }
}
);

var selectorHelper = (function(){
    var pub = {};
    var centerOffset = {
        x: 0,
        y: 0
    }
    pub.setOffset = (function(center)
    {
        this.centerOffset.x = center.x;
        this.centerOffset.y = center.y;
    });
    pub.highlightElementByPosition = (function (position) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var scaledPos = scaleLeapPosition(position,docDimensions);
            console.log("sending highlight element data")
            chrome.tabs.sendMessage(tabs[0].id, {request: 'highlightElement', x: scaledPos[0], y: scaledPos[1]});
        });
    });
    return pub;
})();



var scrollHelper = (function(){
    var pub = {};

    var currentScaledPos = [];
    var originPos = [docDimensions.width/2,docDimensions.height/2];
    pub.updateDimensions = (function(dimensions){
        docDimensions.width = dimensions.width;
        docDimensions.height = dimensions.height;
        docDimensions.viewportWidth = dimensions.viewportWidth;
        docDimensions.viewportHeight = dimensions.viewportHeight;
        docDimensions.screenWidth  = dimensions.screenWidth,
        docDimensions.screenHeight =  dimensions.screenHeight
        //console.dir(docDimensions);
        //console.log('docdimensions updated!: ');
        //console.dir(docDimensions);
    });
    pub.scroll = (function (leapPos){
        var scaledPos = scaleLeapPosition(leapPos, docDimensions);
        chrome.tabs.executeScript({
            code: 'window.scrollTo(' + scaledPos[0] + ',' + scaledPos[1] + ');'
        });
        //window.scrollTo(scaledPos[0],scaledPos[1]);
        console.log("scrolling to: " + scaledPos);
        currentScaledPos = scaledPos;
    });
    pub.getCurrentPos = (function(){
        return currentScaledPos;
    });
    return pub;
})(); //setting up that hand log

function scaleLeapPosition(position, appSize) 
{
    var scaledPosition = [];
    var __leapFructumDimensions = [400,700,400];
    scaledPosition[0] = (appSize.width/__leapFructumDimensions[1])*(position[0])+(appSize.width/2)-appSize.viewportWidth/2;
    scaledPosition[1] = (appSize.height/__leapFructumDimensions[2])*(__leapFructumDimensions[2]-(position[1]-100))+appSize.viewportHeight/2;
    if(scaledPosition[1]<0)
    {
        scaledPosition[1]=0;
    }
    //console.log('scaledposx: ' + scaledPosition[0]/appSize.width + ' scaledposy: ' + scaledPosition[1]/appSize.height);
    return scaledPosition;
}   

Leap.loop(controllerOptions,function(frame){
    //console.log("we did it guys");
    currentHands = frame.hands;
    //get hand position
    if(currentHands.length>0)
    {
        handPosition = currentHands[0].palmPosition;
        scrollHelper.scroll(handPosition);
        selectorHelper.highlightElementByPosition(handPosition);
    }
    //console.log("rawpos: " + handPosition);

});