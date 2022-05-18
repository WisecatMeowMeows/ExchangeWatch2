//ver2

var index = 0; //I'm making this global, even though its 'bad practice' to do so
var msgSubscr = ["{'event':'addChannel','channel':'ok_btcusd_ticker'}", //OKCoin
                 '{"type":"subscribe","product_id":"BTC-USD"}',
                 "{'event':'addChannel','channel':'ok_btcusd_ticker'}"];     //GDAX
var wsUri = ["wss://real.okcoin.com:10440/websocket/okcoinapi",  //OKCOIN
		     "wss://ws-feed.gdax.com",
			 "wss://real.okcoin.com:10440/websocket/okcoinapi"];  //GDAX
var wsMsgNames = [ {"priceName":"last","priceTextBeginsExtra":7,"priceLength":6},
		           {"priceName":"price","priceTextBeginsExtra":8,"priceLength":6},
	               {"priceName":"data.last","priceTextBeginsExtra":7,"priceLength":6}  ];

// the object wsBin shall contain the websockets, as well as the info for opening & searching them
//var wsBin = {websocket object, ws uRI, ws subscribeMsg, ws searchText, ws priceTextBegins, ws priceLength}
var wsBin = [ {"wsObj":"blank",
               "wsUri":"wss://real.okcoin.com:10440/websocket/okcoinapi",                                  
               "msgSubscr":"{'event':'addChannel','channel':'ok_btcusd_ticker'}",
			   "priceName":"last",
			   "priceTextBeginsExtra":7,
			   "priceLength":6},
              {"wsObj":"blank",
			   "usUri":"wss://ws-feed.gdax.com",
			   "msgSubscr":'  {"type":"subscribe","product_id":"BTC-USD"}  '   ,
		       "priceName":"price",
			   "priceTextBeginsExtra":8,
			   "priceLength":6},
              {"wsObj":"blank",
               "wsUri":"wss://real.okcoin.com:10440/websocket/okcoinapi",                                  
               "msgSubscr":"{'event':'addChannel','channel':'ok_btcusd_ticker'}",
			   "priceName":"last",
			   "priceTextBeginsExtra":7,
			   "priceLength":6},
		       ] ;

//msgData = {"empty":0,"JSON":1,"object":2};  //empty object, to contain the JSON object when we parse it from the message
//var wsInfo = [{"wsUri":"wss://real.okcoin.com:10440/websocket/okcoinapi","msgSubscr":"{'event':'addChannel','channel':'ok_btcusd_ticker'}"},  //OKCoin
//              {"wsUri":"wss://ws-feed.gdax.com","msgSubscr":"{'type': 'subscribe','product_id': 'BTC-USD'}"},
//		      {"wsUri":"wss://real.okcoin.com:10440/websocket/okcoinapi","msgSubscr":"{'event':'addChannel','channel':'ok_btcusd_ticker'}"}];  //GDAX
//var watchTable = [{ExchangeName1, Object1}, {ExchangeName2, Object2}];
var watchTable = document.getElementById("WatchTable");
//watchTable.rows[1].item[1].innerHTML = "DOGEATDOG";
var price = [document.getElementById("Price0"),
             document.getElementById("Price1"),
             document.getElementById("Price2") ];

var output = document.getElementById("output");
//var openButton = document.getElementById("openButton");
//var refreshButton = document.getElementById("refreshButton");
//var closeButton = document.getElementById("closeButton");
var btnToggle = [document.getElementById("btnToggle0"),
                 document.getElementById("btnToggle1"),
                 document.getElementById("btnToggle2") ];
btnToggle[0].innerHTML = "Play";
btnToggle[1].innerHTML = "Play";
btnToggle[2].innerHTML = "Play";

//-----------

function startStream(){
	writeToScreen("index=" + index + "  starting stream: message:" + msgSubscr[0]);
	//websocket.send(wsInfo[index].wsUri);
	websocket.send(msgSubscr[index]);
}


function doToggle(passedIndex){
	//btnToggle[index].innerHTML = "toggling";
	index = passedIndex;  //sets the global variable 'index' to the passed value
	writeToScreen("index=" + index);
	//if streaming, stop streaming. if not streaming, start streaming.
		if ( btnToggle[index].innerHTML == 'Play' ) { 
	      //wsUri = "wss://real.okcoin.com:10440/websocket/okcoinapi";
		  doOpen(index);
	    //while (websocket.readyState != 1) {}; //wait for websocket to open
		  
		  btnToggle[index].innerHTML = "Stop";
	    } else {
		  doClose();
		  btnToggle[index].innerHTML = "Play";
		}
}


function doOpen(){
	//var staticIndex = index.valueOf();
	writeToScreen("value-of-index="+index.valueOf()+"  Attempting to open");
	websocket = new WebSocket(wsUri[index]);
	//wsBin[index].wsObj = new WebSocket(wsBin[index].wsUri); //gotta make this work somehow
	websocket.onopen = function(evt)    { onOpen(evt);    };
	websocket.onclose = function(evt)   { onClose(evt)   };
	websocket.onmessage = function(evt) { onMessage(evt); };
	websocket.onerror = function(evt)   { onError(evt)   };
	
}



function doClose(){
	websocket.close();
}


function onOpen(evt)
{
  writeToScreen("CONNECTED TO EXCHANGE WEBSOCKET, evt.data=" + evt.data + " and index=" + index);
  //if (btnToggle[index].innerHTML = "Stop" ) { startStream(index); } //if the toggle button is in 'stream' mode, then start streaming
  startStream();
}

function onClose(evt)
{
  writeToScreen("DISCONNECTED FROM EXCHANGE WEBSOCKET");
}

function onMessage(evt)
{
	writeToScreen('got message!');
  //now we have to read the incoming message, and determine which Exchange sent it
  //msgData = JSON.parse("["+evt.data+"]");
  //writeToScreen(wsMsgNames[index].priceName);
  //writeToScreen(JSON.stringify(msgData) );
  //writeToScreen(msgData);
  //writeToScreen('got message & parsed JSON object');
  writeToScreen('got message! index='+index+'<span style="color: blue">RESPONSE: ' + evt.data+'</span>');
  
  
  price[index].innerHTML = evt.data.substr( (evt.data.search(wsMsgNames[index].priceName)+wsMsgNames[index].priceTextBeginsExtra),wsMsgNames[index].priceLength);
  //price[index].innerHTML = msgData[ wsMsgNames[index].priceName ];
  //price[index].innerHTML = msgData[0].price;
}



function onError(evt)
{
  writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message)
{
  writeToScreen("SENT: " + message);
  websocket.send(message);
}

function writeToScreen(message)
{
  //var pre = document.createElement("p");
  //pre.style.wordWrap = "break-word";
  //pre.innerHTML = message;
  //output.appendChild(pre);
  output.innerHTML = message;
}

//window.addEventListener("load", init, false);



