#!/usr/bin/env node
//
//  Sample code
//    Author: Maho Takara
//
var sc = require("./sessionCtrl.js");  // セッション管理
var wn = require("./watsonAPI.js");    // Watson API

var cookieParser = require('cookie-parser');
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.use(cookieParser());
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


// express-ws 
app.ws('/ws/chat', function(ws, req) {
    ws.on('message', function(msg) {
	agent = "web";
	userId = req.cookies.userid;
	message = JSON.parse(msg);
	sc.sessionCtrl( agent, userId, message, function(err, session) {
            if (err) {
		errorHandler(agent, userId, message, "内部エラー", err);
            } else {
		eventHandler(session, message, function(err,session) {
                    sc.sessionUpdate(session, function(err,session) {});
		});
            }
	});
    });
});


// イベント処理 共通
function eventHandler(session, message, callback) {
    if (session.agent == "LINE") {
	_eventHandlerLINE(session,message,function(err,session) {
	    callback(err,session);
	});
    } else if (session.agent == "facebook") {
        _eventHandlerFB(session,message,function(err,session) {
            callback(err,session);
	});
    } else if (session.agent == "web") {
        _eventHandlerWEB(session,message,function(err,session) {
            callback(err,session);
	});
    }

}

// Facebookイベント処理
function _eventHandlerFB( session, message, callback) {
    // DUMMY
    callback(null, session);
}

// LINEイベント処理
function _eventHandlerLINE( session,message, callback) {
    // DUMMY
    callback(null, session);
}

// Webイベント処理
function _eventHandlerWEB( session, message, callback) {
    session.inputMsg = message.payload;
    wn.messageReply(session, function (err,session) {
	var payload = {
	    payload: message.payload,
	    ts: (new Date()).getTime()
	};
	var msg = JSON.stringify(payload);
	var payload = {
	    payload: session.outputMsg,
	    ts: (new Date()).getTime()
	};
	var ans = JSON.stringify(payload);
	var aWss = expressWs.getWss();
	aWss.clients.forEach(function(client) {
	    client.send(msg); // echo back
	    client.send(ans); // watson reply
	});
        callback(err, session);
    });
}


// エラー処理 共通
function errorHandler(agent, userId, message, errorMessage, err) {
    if (agent == "LINE") {
	// DUMMY
    } else if (session.agent == "facebook") {
	// DUMMY
    } else if (session.agent == "web") {
	var payload = {
	    payload: session.inputtMsg,
	    ts: (new Date()).getTime()
	};
	var msg = JSON.stringify(payload);
	var payload = {
	    payload: errorMessage,
	    ts: (new Date()).getTime()
	};
	var ans = JSON.stringify(payload);
	var aWss = expressWs.getWss();
	aWss.clients.forEach(function(client) {
	    client.send(msg); // echo back
	    client.send(ans); // watson reply
	});
    }
}


// Bluemix で稼働する場合はポート番号を取得
var portno = process.env.PORT || 9080;
app.listen(portno);


