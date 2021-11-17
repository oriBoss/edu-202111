/************************************************
 * EduSetupFunctionMain.js
 * Created at 2021. 11. 16. 오후 3:12:46.
 *
 * @author student
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	
var ServiceUrls = cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;


/**
 * 함수 선언 영역 
 */



/**
 * 이벤트 처리 영역
 */






/*
 * "New" 버튼(btn5)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn5Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn5 = e.control;
	var sms = app.lookup("sms");
	sms.action = ServiceUrls.ADM_SERVICE_URL + "functions";
}


/*
 * "New" 버튼(btn5)에서 dblclick 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 더블 클릭할 때 발생하는 이벤트.
 */
function onBtn5Dblclick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn5 = e.control;
	
}
