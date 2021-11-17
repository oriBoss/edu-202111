/************************************************
 * EduSetupFunction.js
 * Created at 2021. 11. 16. 오후 3:17:02.
 *
 * @author student
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	
var ServiceUrls = cpr.core.module.requre("utils/ServiceUrls").ServiceUrls;


/**
 * 함수 선언 영역 
 */



/**
 * 이벤트 처리 영역
 */

function onBtn5Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn5 = e.control;
	var sms = app.lookup("sms");
	sms.action = ServiceUrls.ADM_SERVICE_URL + "functions";
	
}
