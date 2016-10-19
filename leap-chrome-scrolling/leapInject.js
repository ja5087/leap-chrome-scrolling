chrome.runtime.onMessage.addListener(
function(message, sender, sendResponse) {
    if(message.request == "getDocumentDimensions")
    {
        sendResponse( {
            width: document.body.scrollWidth, 
            height: document.body.scrollHeight,
            viewportWidth: document.documentElement.clientWidth,
            viewportHeight: document.documentElement.clientHeight,
            screenWidth: screen.width,
            screenHeight: screen.height
        });
        //console.log("document data sent!" + width + height);
    } else if (message.request == "highlightElement")
    {
        console.log('highlightelement received');
        styleSelector.highlightElement(message);
    }
}
);
console.log(document.body.scrollWidth);
console.log(document.body.scrollHeight);
console.log("injected!");

var styleSelector = (function() {
    var pub = {};
    var m = {
        element: 0,
        prevStyle: ' ',
    };
    pub.highlightElement = (function(position) {
        console.log(this);
        if(m.element!=document.elementFromPoint(position.x, position.y)) //when a new element is selected, unhighlight old and highlight new
        {   
            console.log("current object selected:");
            console.dir(m.element);
            unHighlightElement(m);    
            m.element = document.elementFromPoint(position.x, position.y);
            m.prevStyle = m.element.style;
            m.element.style = '1px solid black';
        } 
    });
    pub.unHighlightElement = (function(a)
    {
        if(a.prevStyle!=null)
        {
        a.element.style = a.prevStyle;
        } else {
        a.element.style = ' ';
        }
    })


    return pub;
})();