function ServiceUtils() {}

/**
 * key, value 형태의 Object를 하나의 querystring형태로 변경해 준다.
 * @param {object} params 매개변수 key, value 
 * @returns querystring
 */
ServiceUtils.prototype.parameterSerializer = function(params) {
	var valueUtils = cpr.core.Module.require("modules/COMMON/utils/ValueUtils");
	var vUtils = new valueUtils.ValueUtils();
	var parameter = params ? '?' : '';
	
	for (var key in params) {
		if (typeof params[key] === 'object' && params[key] != null && params[key].length) {
			
			for (var key in params) {
				var param = params[key];
				parameter += key + "=" + encodeURIComponent(param) + "&";
			}
		} else {
			parameter += key + "=" + encodeURIComponent(params[key]) + "&";
		}
	}
	
	return vUtils.isEmpty(parameter) ? parameter : parameter.slice(0, -1);
}

/**********************************************************************
 *  
 * submission에 MES에서 활용하는 Header 정보를 입력해 줍니다.
 * 
 * @param {cpr.protocols.Submission} submission
 */
ServiceUtils.prototype.setMESInfoHeader = function(submission) {
	var authInfo = sessionStorage.getItem('_miracom_auth_info');
	if (authInfo) {
		var accessToken = authInfo.access_token;
		
		if (accessToken) {
			submission.setHeader('Authorization', "Bearer " + accessToken);
		}
		
		// @auth lagnaroc  / @date 210811
		// @TODO factoryCode를 가져 오는 부분은 나중에 추가 합니다.
		//		var factoryCode = mes_info.authInfo.factory_code;
		//		if (factoryCode) {
		//			submission.setHeader('factoryCode', factoryCode);
		//		}
	}
}

/************************************************************************
 * 
 * @auth lagnaroc
 * @date 210810
 * @description
 *  현재의 통합 MES IAM 서버에서 Authorization의 값을 얻기 위해 서버로 부터해당 내용을 가져 옵니다.
 * 
 */
ServiceUtils.prototype.checkAuthorization = function () {
	var authCode = this._getAuthCode();
	
	if (authCode) {
		var storageType = window.mrcGlobalProps.storageType;
		var authInfo = window[storageType].getItem('_miracom_auth_info');
		if (authInfo === null) {
			this._requestAccessToken(authCode, function(e) {
					
					// 			sample menssage
					//			{
					//				access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJhY2NvdW50SWQiOiJhZG1pbkBtcmMiLCJ1c2VySWQiOiJhZG1pbiIsImZhY3RvcnlDb2RlIjoiTVJDS1IwMSIsImxhbmdDb2RlIjoia28iLCJjb21wYW55VGVuYW50Q29kZSI6Ik1SQyIsImNlbnRlclRlbmFudENvZGUiOiJNUkNLUiIsInB3ZEV4cGlyZUZsYWciOmZhbHNlfSwiYXVkIjpbIm9hdXRoMi1yZXNvdXJjZSJdLCJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbInJlYWQiXSwiZXhwIjoxNjI4Njg3MTUxLCJhdXRob3JpdGllcyI6WyJVU0VSIl0sImp0aSI6IjVhOTFiMDk4LWU5NjgtNGQ3Mi1hMjBhLTJjMzgzODYwNTdiNSIsImNsaWVudF9pZCI6Im9hdXRoMl9jbGllbnQifQ.ewFl24hR26WuqEtffWVLKMFH6KyY89JNEKReVOYED6zkDxDIBcu67zXwrELgFLlaJJ_zcdxlI1bA8avjW0ZApROZ90fYcWu4vxEGhLRUlvK6ZWEePON65p95Pg2czOEsIejB8HdTghKwvMNYfG-P27M1aYGFmPX2hQCAHOLxoQW_VQig75FIyYZwQeSgsL2d_CsNzv0YSudZPw8A0i5JzO3HVAxY49w1VGBjtChpNrQZaUgEgBjAuLagjCA5oLAaGcvIo0xx56Sup_xnr5t35-3NPIr6aGl_-MI__w4o5XeE4tm5Q8LLPlzjAXTd3yB_rMaFoXqTfISNjmp8tgsyDg"
					//				expires_in: 43199
					//				refresh_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJhY2NvdW50SWQiOiJhZG1pbkBtcmMiLCJ1c2VySWQiOiJhZG1pbiIsImZhY3RvcnlDb2RlIjoiTVJDS1IwMSIsImxhbmdDb2RlIjoia28iLCJjb21wYW55VGVuYW50Q29kZSI6Ik1SQyIsImNlbnRlclRlbmFudENvZGUiOiJNUkNLUiIsInB3ZEV4cGlyZUZsYWciOmZhbHNlfSwiYXVkIjpbIm9hdXRoMi1yZXNvdXJjZSJdLCJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbInJlYWQiXSwiYXRpIjoiNWE5MWIwOTgtZTk2OC00ZDcyLWEyMGEtMmMzODM4NjA1N2I1IiwiZXhwIjoxNjI4NzMwMzUxLCJhdXRob3JpdGllcyI6WyJVU0VSIl0sImp0aSI6IjY0NTMzNzY5LTE1ZDgtNGFmMy04ZmRmLTNmZTcyZjc0YjJkOCIsImNsaWVudF9pZCI6Im9hdXRoMl9jbGllbnQifQ.f47qKAB2yAODUS3oJazRx5HnpaUI3yAYTcL8tYNLLqbFWvmb22O0fmObSHjo3aiNajeK1oDoxIrjENX4wsqKv-LjaYRf5TVKOoXC8DeOXv47Qo-H9scQbOusTv_wrUAj6upB7jiwnzq0CcwiwQ_rrSFqYwMF-wRG1X-UEvvDEvlCZajrX5vdsMH8kJ7LK2n2LjEOk8AiW2tqzMcynIUc6CnNyiyZMVYzRU-d32xL1QNIZhIRqoozvIGcIHwMhTfeUzjS0VVTx-6cMPZqU2FUWTJT-jMQR-eAPMdotNq17FmCQzh3o5_bjNb5SeJlEH_pbizRy4-HTUuvj2dnM99Oew"
					//				scope: "read"
					//				token_type: "bearer"
					//			}
					// @auth lagnaroc / @date 210811
					window[storageType].setItem('_miracom_auth_info', JSON.stringify(e.content));
				},
				function(e) {
					// authorization 실패 시 localStorage의 auth info를 지우고 리로딩을 통해 로그인을 유도합니다.
					// 나중 인증 로직은 변경을 통해 수정될 여지가 있습니다.
					window[storageType].removeItem("_miracom_auth_info");
					window.location.reload();
				});
		}
	} else {
		this._requestAuthToken();
	}
}

ServiceUtils.prototype._requestAccessToken = function (authCode, completed, failed) {
	
	var mesConfig = cpr.core.Module.require("config/MES_REST_API_CONFIG");
	var restAPI = mesConfig.MES_REST_API_CONFIG.getInstance();
	
	var authorization = btoa(restAPI.CLIENT_CONST.CLIENT_ID + ":" + restAPI.CLIENT_CONST.CLIENT_PW);
	var submission = new cpr.protocols.Submission();
	var params = "code=" + authCode + "&grant_type=authorization_code&client_id=" + restAPI.CLIENT_CONST.CLIENT_ID +
		"&redirect_uri=" + restAPI.REDIRECT_SERVICE_URL;
	submission.action = restAPI.SERVICE_URL + "iam/oauth/token?" + params;
	submission.setHeader("Authorization", "Basic " + authorization);
	submission.async = true;
	submission.method = cpr.protocols.Submission.METHOD_POST;
	
	submission.addEventListener("submit-error", function(e) {
		if (failed) {
			failed(e);
		}
	});
	
	submission.addEventListener("receive-json", function(e) {
		
		// accessToken을 sessionStorage에 저장 하여 제공합니다 . . . 일단 . . . 
		if (completed) {
			completed(e);
		}
	});
	submission.send();
}

/**
 * @auth lagnaroc
 * @date 210810
 * @description
 * authorize code를 받아 올수 있는 주소로 이동 시킨다.
 */
ServiceUtils.prototype._requestAuthToken = function () {
		
//	    window[DefaultProps.StorageType].removeItem("isLogin");
//	    window[DefaultProps.StorageType].removeItem("jwt");
//	    window[DefaultProps.StorageType].removeItem("factoryCode");
//	    window[DefaultProps.StorageType].removeItem("authInfo");
	
	
	var mesConfig = cpr.core.Module.require("config/MES_REST_API_CONFIG");
	var clientId = mesConfig.MES_REST_API_CONFIG.getInstance().CLIENT_CONST.CLIENT_ID;
	var redirectServiceURL = mesConfig.MES_REST_API_CONFIG.getInstance().REDIRECT_SERVICE_URL;
	
	var paramObj = {
		response_type: "code",
		state: "asYQGe",
		client_id: clientId,
		scope: "read",
		redirect_uri: redirectServiceURL,
	}
	var params = this.parameterSerializer(paramObj);
	
	location.href = mesConfig.MES_REST_API_CONFIG.getInstance().SERVICE_URL + "iam" + "/oauth/authorize" + params;
}

/************************************************************************
 * 
 * @auth lagnaroc
 * @date 210810
 * @description
 * 	통합 MES의 authorization 키를 얻기 위한 authCode를 가져 옵니다.
 *  iAM의 로그인 화면 이후 가져올 수 있습니다.
 */
ServiceUtils.prototype._getAuthCode = function () {
	var search = window.location.href.match(/\?code=\w+/g);
	
	if (search) {
		return search[0].match(/\w+$/g)[0];
	}
	
	return undefined;
}

var send = cpr.protocols.Submission.prototype.send;
cpr.protocols.Submission.prototype.send = function () {
	
	var LogUtils = cpr.core.Module.require("utils/LogUtils").LogUtils;
	var application;
	
	this._send = send;
	
	LogUtils.debug("Start REST CALL- [" + this.method + "] action - " + this.action + " mediaType = " + this.mediaType);
	
	application = this.getAppInstance();
	// create ShellComponent...
	if (application) {
		var shellComponent = application.lookup('$rest-progress-spin');
		if (shellComponent === undefined) {
			shellComponent = new cpr.controls.UIControlShell("$rest-progress-spin");
	
			shellComponent.addEventListener("load", function(e){
			
				var opts = {
				  lines: 12, // The number of lines to draw
				  length: 29, // The length of each line
				  width: 12, // The line thickness
				  radius: 42, // The radius of the inner circle
				  scale: 0.45, // Scales overall size of the spinner
				  corners: 1, // Corner roundness (0..1)
				  speed: 1.1, // Rounds per second
				  rotate: 25, // The rotation offset
				  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
				  direction: 1, // 1: clockwise, -1: counterclockwise
				  color: '#6e6e6e', //'#4f94ab', // CSS color or array of colors
				  fadeColor: 'transparent', // CSS color or array of colors
				  top: '51%', // Top position relative to parent
				  left: '51%', // Left position relative to parent
				  shadow: '0 0 1px transparent', // Box-shadow for the lines
				  zIndex: 2000000000, // The z-index (defaults to 2e9)
				  className: 'spinner', // The CSS class to assign to the spinner
				  position: 'absolute', // Element positioning
				};
				
				var spinner = new Spin.Spinner(opts).spin(e.content);
			});
			var actualRect = application.getActualRect();
			application.floatControl(shellComponent, cpr.controls.layouts.XYLayout.createConstraintWithRect(new cpr.geometry.Rectangle((actualRect.width / 2) - 25, (actualRect.height / 2) - 25)));
		}
		
		shellComponent.visible = true;
	}
	return this._send();	
}

cpr.events.EventBus.INSTANCE.addFilter("submit-success", function (e) {
	var LogUtils = cpr.core.Module.require("utils/LogUtils").LogUtils;
	
	LogUtils.debug("SUCCESS REST CALL- [" + this.method + "] action - " + this.action + " mediaType = " + this.mediaType);
});
	
cpr.events.EventBus.INSTANCE.addFilter("submit-error", function (e) {
	var LogUtils = cpr.core.Module.require("utils/LogUtils").LogUtils;
	
	LogUtils.debug("ERROR REST CALL- [" + this.method + "] action - " + this.action + " mediaType = " + this.mediaType);
	LogUtils.debug("ERROR Message - " + e.message);
});
	
cpr.events.EventBus.INSTANCE.addFilter("submit-done", function(e) {
	
	var LogUtils = cpr.core.Module.require("utils/LogUtils").LogUtils;
	var application = this.getAppInstance();
	
	if (application) {
		var progressSpin = application.lookup("$rest-progress-spin")
		if (progressSpin) {
			progressSpin.visible = false;
		}
	}
	LogUtils.debug("End REST CALL- [" + this.method + "] action - " + this.action + " mediaType = " + this.mediaType);	
});

/*
 * 서브미션 에러에 대해 공통 처리하기 위한 로직 
 */
var addEventListener = cpr.protocols.Submission.prototype.addEventListener; 
cpr.protocols.Submission.prototype.addEventListener = function(type, listener) {
	this._addEventListener = addEventListener;
	if (!this.listeners) {
		this.listeners = [];
	}	
	this.listeners.push(type);
	
	this._addEventListener(type, listener);
}

cpr.events.EventBus.INSTANCE.addFilter("error-status", function(e) {
	if (!(e.control instanceof cpr.protocols.Submission)) {
		return;
	}
	
	/** @type cpr.protocols.Submission */
	var submission = e.control;

	if (!submission.listeners || submission.listeners.indexOf("error-status") < 0) {
		e.preventDefault();
	}
});

cpr.events.EventBus.INSTANCE.addFilter("submit-error", function(e) {
	var CommonUtils = cpr.core.Module.require("utils/CommonUtils").CommonUtils;
	
	if (!(e.control instanceof cpr.protocols.Submission)) {
		return;
	}
	
	/** @type cpr.protocols.Submission */
	var submission = e.control;
	var httpRequest = submission.xhr;
	
	if (httpRequest.status === 401) {
		// TODO 인증 오류일 경우 공통에서 처리, 인증 오류에 대한 처리 로직 추가 필요
		e.preventDefault();
		e.stopPropagation();
	} else if (httpRequest.status === 400) {
		// TODO 에러 표시 방식에 대한 결정 필요
		if (!submission.listeners || submission.listeners.indexOf("submit-error") < 0) {
			var response = JSON.parse(httpRequest.responseText);
			CommonUtils.alert(submission.getAppInstance(), "에러", response.code + " : " + response.description);
		}
	} else{
		// TODO 그 외 오류는 공통에서 처리
		CommonUtils.alert(submission.getAppInstance(), "에러", "네트워크 에러가 발생했습니다.");
	}
});


exports.ServiceUtils = ServiceUtils;