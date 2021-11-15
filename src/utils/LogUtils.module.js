/************************************************
 * LogUtils.module.js
 * Created at 2021. 5. 26. 오후 12:13:46.
 *
 * @author lagnaroc
 * @date   210825
 ************************************************/

/************************************************
 * @class LogUtils
 * @author lagnaroc
 * @description logging을 위한 공통 API를 제공합니다.
 * @date 210825
 */
function LogUtils() {
}

LogUtils.POPUP_APPENDER = "popup";
LogUtils.CONSOLE_APPENDER = "console";
LogUtils.DOM_APPENDER = "dom";
LogUtils.ALERT_APPENDER = "alert";

LogUtils.AJAX_APPENDER = "ajax";


LogUtils.loggers = {};


/****************************************************
 * 
 * @param {string} groupName
 * @param {string} appenderType
 * @description
 * 	logger를 가져옵니다. 기본 값은 default Group, Browser Console 입니다.
 *  appenderType의 종류는 다음과 같습니다.
 * 	LogUtils.POPUP_APPENDER = "popup";
 *	LogUtils.CONSOLE_APPENDER = "console";
 *	LogUtils.DOM_APPENDER = "dom";
 *	LogUtils.ALERT_APPENDER = "alert";
 */
LogUtils.getLogger = function (groupName, appenderType) {
	var logger = undefined;
	var key = (groupName === undefined || groupName === null || groupName === "") ? "__default" : groupName;
	var at = (appenderType === undefined || appenderType === null || appenderType === "") ? appenderType = LogUtils.CONSOLE_APPENDER : appenderType;
	
	if (LogUtils.loggers[key] === undefined) {
		var logger = new LogUtils();
		logger._initialize(key, appenderType);
		LogUtils.loggers[key] = logger;
	}
	
	return LogUtils.loggers[key];
}

/*********************************************************
 * 
 * @param {any} level
 * @description
 *  로깅을 표시할 레벨을 설정 합니다. 종류는 다음과 같습니다.
 *  log4javascript.Level.ALL
 *	log4javascript.Level.TRACE
 *	log4javascript.Level.DEBUG
 *	log4javascript.Level.INFO
 *	log4javascript.Level.WARN
 *	log4javascript.Level.ERROR
 *	log4javascript.Level.FATAL
 *	log4javascript.Level.OFF
 * 
 *  레벨의 순서는 다음과 같습니다.
 * 
 *  ALL>TRACE>DEBUG > INFO > WARN > ERROR > FATAL>OFF
 */
LogUtils.setLevel = function (level) {
	for (var key in LogUtils.loggers) {
		var logger = LogUtils.loggers[key];
		if (logger) {
			logger.setLevel(level);
		}
	}
}

LogUtils.trace = function (message, group) {
	var g = (group === undefined || group === null || group === "") ? "__default" : group;
	if (LogUtils.loggers[g] === undefined) {
		LogUtils.loggers[g] = LogUtils.getLogger(g);
	}
	LogUtils.loggers[g].trace(message);
}

LogUtils.info = function (message, group) {
	var g = (group === undefined || group === null || group === "") ? "__default" : group;
	if (LogUtils.loggers[g] === undefined) {
		LogUtils.loggers[g] = LogUtils.getLogger(g);
	}
	LogUtils.loggers[g].info(message);
}

LogUtils.debug = function (message, group) {
	var g = (group === undefined || group === null || group === "") ? "__default" : group;
	if (LogUtils.loggers[g] === undefined) {
		LogUtils.loggers[g] = LogUtils.getLogger(g);
	}
	LogUtils.loggers[g].debug(message);
}

LogUtils.warn = function (message, group) {
	var g = (group === undefined || group === null || group === "") ? "__default" : group;
	if (LogUtils.loggers[g] === undefined) {
		LogUtils.loggers[g] = LogUtils.getLogger(g);
	}
	LogUtils.loggers[g].warn(message);
}

LogUtils.error = function (message, group) {
	var g = (group === undefined || group === null || group === "") ? "__default" : group;
	if (LogUtils.loggers[g] === undefined) {
		LogUtils.loggers[g] = LogUtils.getLogger(g);
	}
	LogUtils.loggers[g].error(message);
}

LogUtils.fatal = function (message, group) {
	var g = (group === undefined || group === null || group === "") ? "__default" : group;
	if (LogUtils.loggers[g] === undefined) {
		LogUtils.loggers[g] = LogUtils.getLogger(g);
	}
	LogUtils.loggers[g].fatal(message);
}

LogUtils.prototype._initialize = function (groupName, appenderType) {
	if (groupName === "__default") {		
		this.logger = log4javascript.getDefaultLogger();
		this._layout = new log4javascript.PatternLayout("%c %d{yyyy-MM-dd HH:mm:ss SSSS} %p - %m%n"); 
	} else {
		this.logger = log4javascript.getLogger(groupName);
		this._layout = new log4javascript.PatternLayout("[%c] %d{yyyy-MM-dd HH:mm:ss SSSS} %p - %m%n");
	}
	
	this.logger.removeAllAppenders();
	
	this._popupAppender = new log4javascript.PopUpAppender();	
	this._popupAppender.setLayout(this._layout);
	
	this._consoleAppender = new log4javascript.BrowserConsoleAppender();
	this._consoleAppender.setLayout(this._layout);
	
	this._inPageAppender = new log4javascript.InPageAppender();
	this._inPageAppender.setLayout(this._layout);	
	
	this._alertAppender = new log4javascript.AlertAppender();
	this._alertAppender.setLayout(this._layout);
	
	if (appenderType === LogUtils.POPUP_APPENDER) {
		this.logger.addAppender(this._popupAppender);	
	} else if (appenderType === LogUtils.CONSOLE_APPENDER) {
		this.logger.addAppender(this._consoleAppender);
	} else if (appenderType === LogUtils.DOM_APPENDER) {
		this.logger.addAppender(this._inPageAppender);
	} else if (appenderType === LogUtils.ALERT_APPENDER) {
		this.logger.addAppender(this._alertAppender);
	} else {
		this.logger.addAppender(this._consoleAppender);
	}
}


/********************************************************
 * 
 * 
 * 
 * @param {string} appenderType
 * @description
 * 	
 * 	로그를 출력할 타겟을 추가 합니다.
 *  종류는 다음과 같습니다.
 * 
 *  LogUtils.POPUP_APPENDER = "popup";
 *	LogUtils.CONSOLE_APPENDER = "console";
 *	LogUtils.DOM_APPENDER = "dom";
 *	LogUtils.ALERT_APPENDER = "alert";
 */
LogUtils.prototype.addAppender = function (appenderType) {
	if (appenderType === LogUtils.POPUP_APPENDER) {
		this.logger.addAppender(this._popupAppender);	
	} else if (appenderType === LogUtils.CONSOLE_APPENDER) {
		this.logger.addAppender(this._consoleAppender);
	} else if (appenderType === LogUtils.DOM_APPENDER) {
		this.logger.addAppender(this._inPageAppender);
	} else if (appenderType === LogUtils.ALERT_APPENDER) {
		this.logger.addAppender(this._alertAppender);
	}
}

/********************************************************
 * 
 * 
 * 
 * @param {string} appenderType
 * @description
 * 	
 * 	로그를 출력할 타겟을 삭제 합니다.
 *  종류는 다음과 같습니다.
 *  아무 값도 안넣을 경우 CONSOLE_APPENDER가 삭제 됩니다.
 * 
 *  LogUtils.POPUP_APPENDER = "popup";
 *	LogUtils.CONSOLE_APPENDER = "console";
 *	LogUtils.DOM_APPENDER = "dom";
 *	LogUtils.ALERT_APPENDER = "alert";
 */
LogUtils.prototype.removeAppender = function (appenderType) {
	if (appenderType === LogUtils.POPUP_APPENDER) {
		this.logger.removeAppender(this._popupAppender);	
	} else if (appenderType === LogUtils.CONSOLE_APPENDER) {
		this.logger.removeAppender(this._consoleAppender);
	} else if (appenderType === LogUtils.DOM_APPENDER) {
		this.logger.removeAppender(this._inPageAppender);
	} else if (appenderType === LogUtils.ALERT_APPENDER) {
		this.logger.removeAppender(this._alertAppender);
	} else {
		this.logger.removeAppender(this._consoleAppender);
	}
}

/***********************************************************
 * @description
 * 
 *  모든 Appender를 삭제 합니다.
 */
LogUtils.prototype.removeAllAppenders = function () {
	this.logger.removeAllAppenders();
}

/*********************************************
 * 
 * @param {string} url
 * @description
 *	로그를 서버로 날리기 원한다면 이 메서드를 사용합니다.
 *  로그를 받을 준비가 되어 있는 url을 넣어 줍니다. [POST] 형식으로 전송됩니다.
 */
LogUtils.prototype.setLogServer = function (url) {
	this._ajaxAppender = new log4javascript.AjaxAppender(url);
	this.logger.addAppender(this._ajaxAppender);
}

/*************************************************
 * 
 * @param {string} message
 * @description
 * 	 info level의 로그를 남깁니다.
 */
LogUtils.prototype.info = function (message) {
	this.logger.info(message);
}

/*************************************************
 * 
 * @param {string} message
 * @description
 * 	 trace level의 로그를 남깁니다.
 */
LogUtils.prototype.trace = function (message) {
	this.logger.trace(message);
}

/*************************************************
 * 
 * @param {string} message
 * @description
 * 	 debug level의 로그를 남깁니다.
 */
LogUtils.prototype.debug = function (message) {
	this.logger.debug(message);
}

/*************************************************
 * 
 * @param {string} message
 * @description
 * 	 warn level의 로그를 남깁니다.
 */
LogUtils.prototype.warn = function (message) {
	this.logger.warn(message);
}

/*************************************************
 * 
 * @param {string} message
 * @description
 * 	 error level의 로그를 남깁니다.
 */
LogUtils.prototype.error = function (message) {
	this.logger.error(message);
}

/*************************************************
 * 
 * @param {string} message
 * @description
 * 	 fatal level의 로그를 남깁니다.
 */
LogUtils.prototype.fatal = function (message) {
	this.logger.fatal(message);
}

exports.LogUtils = LogUtils;