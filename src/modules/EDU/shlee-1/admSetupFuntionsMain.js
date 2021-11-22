/************************************************
 * fucntion.js
 * Created at 2021. 11. 22. 오전 11:19:29.
 *
 * @author 82107
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
 * "리셋" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click2(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn1 = e.control;
	var control = app.lookup("sms1");
	app.lookup("dm1").reset();
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var sms = e.control;
	var responseText = sms1.xhr.responseText;
	var jsonData = JSON.parse(responseText);
	app.lookup("dm1").build(jsonData);
	
	
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


/*
 * 그리드에서 cell-click 이벤트 발생 시 호출.
 * Grid의 Cell 클릭시 발생하는 이벤트.
 */
function onGrd1CellClick(/* cpr.events.CGridMouseEvent */ e){
	/** 
	 * @type cpr.controls.Grid
	 */
	var grd1 = e.control;
	if (e.cellIndex === 2) {
		app.openDialog("modules/EDU/shlee-1/admSetupFuntionsPopup", {width : 900, height : 700}, function(dialog){
			dialog.ready(function(dialogApp){
				// 필요한 경우, 다이얼로그의 앱이 초기화 된 후, 앱 속성을 전달하십시오.
				dialogApp.initValue = e.row.getRowData().funcCode;
				
			});
		}).then(function(returnValue){
			;
		});
	}
}
