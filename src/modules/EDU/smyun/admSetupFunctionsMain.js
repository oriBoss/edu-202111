/************************************************
 * admSetupFunctionsMain.js
 * Created at 2021. 11. 22. 오전 11:36:41.
 *
 * @author ysm13
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	
var ServiceUrls=cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;


/**
 * 함수 선언 영역 
 */
function search() {
	var smsGetFunctions = app.lookup("smsGetFunctions");
	var control = app.lookup("dmSearch");
	
	console.log();
	smsGetFunctions.send();
	
}


/**
 * 이벤트 처리 영역
 */


/*
 * "조회" 버튼(btnSearch)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnSearchClick(/* cpr.events.CMouseEvent */ e){
	search();
	
}


/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	search();
}



/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb1Keyup(/* cpr.events.CKeyboardEvent */ e){
	
	if (e.keyCode === cpr.events.KeyCode.ENTER) {
		search();
	}
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb2Keyup(/* cpr.events.CKeyboardEvent */ e){
		
	if (e.keyCode === cpr.events.KeyCode.ENTER) {
		search();
	}
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb3Keyup(/* cpr.events.CKeyboardEvent */ e){
	
	if (e.keyCode === cpr.events.KeyCode.ENTER) {
		search();
	}
}


/*
 * "초기화" 버튼(btnReset)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnResetClick(/* cpr.events.CMouseEvent */ e){
	
	var control = app.lookup("smsGetFunctions");
	
}


/*
 * 그리드에서 cell-click 이벤트 발생 시 호출.
 * Grid의 Cell 클릭시 발생하는 이벤트.
 */
function onGrd1CellClick(/* cpr.events.CGridMouseEvent */ e){
	if(e.cellIndex === 2) {
		app.openDialog("modules/EDU/smyun/admSetupFunctionsPopup", {width : 940, height : 600}, function(dialog){
			dialog.ready(function(dialogApp){
				dialogApp.initValue = e.row.getRowData().funcCode;
				// 클릭한 행의 데이터를 받아 올 수 있다.
				// 필요한 경우, 다이얼로그의 앱이 초기화 된 후, 앱 속성을 전달하십시오.
			});
		}).then(function(returnValue){
			;
		});
	}
}
