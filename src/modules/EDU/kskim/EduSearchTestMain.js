/************************************************
 * EduSearchTestMain.js
 * Created at 2021. 11. 17. 오후 4:05:46.
 *
 * @author kimks
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	



/**
 * 함수 선언 영역 
 */
function search() {
		var smsGetFunctions = app.lookup("smsGetFunctions");
		
		smsGetFunctions.send();
}

/**
 * 이벤트 처리 영역
 */



/*
 * "Search" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click(/* cpr.events.CMouseEvent */ e){
	var smsGetFunctions = app.lookup("smsGetFunctions");
	smsGetFunctions.send();
}




/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpbSearchWordKeyup(/* cpr.events.CKeyboardEvent */ e){
	if(e.keyCode === cpr.events.KeyCode.ENTER) {
		search();
	}
}


/*
 * "Reset" 버튼(btnReset)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnResetClick(/* cpr.events.CMouseEvent */ e){
	var dmSearch = app.lookup("dmSearch");
	var grpSearch = app.lookup("grpSearch");
	dmSearch.reset();
	grpSearch.redraw();
	search();
}


/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	search();
}
