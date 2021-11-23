/************************************************
 * admSetupFuntionsMain.js
 * Created at 2021. 11. 22. 오전 11:21:22.
 *
 * @author 쭈주니
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	

var ServicUrls = cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;


/**
 * 함수 선언 영역 
 */



/**
 * 이벤트 처리 영역
 */



/*
 * "초기화" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn1 = e.control;
	
	var sms = app.lookup("sms1");
	sms.send();
	
	
}


/*
 * "조회" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn2 = e.control;
	app.lookup("sms1").send();
}
