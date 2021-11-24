/************************************************
 * EduSearchTestMain.js
 * Created at 2021. 11. 17. 오후 4:05:19.
 *
 * @author oricaptain
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	



/**
 * 함수 선언 영역 
 */
function search(){	//리스트 출력
	var smsGetFunctions = app.lookup("smsGetFunctions");
	smsGetFunctions.send();
}



/**
 * 이벤트 처리 영역
 */



/*
 * "검색" 버튼(btnSearch)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnSearchClick(/* cpr.events.CMouseEvent */ e){
	search();
}

function onIpbKeyup(/* cpr.events.CKeyboardEvent */ e){
	if(e.keyCode === cpr.events.KeyCode.ENTER) {
		search();
	}
	
}



/*
 * "초기화" 버튼(btnReset)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnResetClick(/* cpr.events.CMouseEvent */ e){
	var dmSearch = app.lookup("dmSearch");
	var grpSearch = app.lookup("grpSearch");
	
	dmSearch.reset();
	grpSearch.redraw();	//그룹명으로 묶인 부분 redraw
	
	search();
}


/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	search();
}

