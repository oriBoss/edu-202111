/************************************************
 * admSetupFuntionsMain.js
 * Created at 2021. 11. 22. 오전 11:27:54.
 *
 * @author oricaptain
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	
var ServiceUrls = cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;


/**
 * 함수 선언 영역 
 */
function search(){	//리스트 출력
	var smGetFunction = app.lookup("smGetFunction");
	smGetFunction.send();
}


/**
 * 이벤트 처리 영역
 */

/*
 * "초기화" 버튼(btnReset)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnResetClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnReset = e.control;
	var dmSearch = app.lookup("dmSearch");
	var grpSearch = app.lookup("grpSearch");
	
	dmSearch.reset();
	grpSearch.redraw();
	
	search();
	
}


/*
 * "조회" 버튼(btnSearch)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnSearchClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnSearch = e.control;
	
	search();
}


/*
 * 인풋 박스에서 keydown 이벤트 발생 시 호출.
 * 사용자가 키를 누를 때 발생하는 이벤트.
 */
function onOptSearchWordKeydown(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var optSearchWord = e.control;
	if (e.keyCode === cpr.events.KeyCode.ENTER){
		search();
	}
}


/*
 * 인풋 박스에서 keydown 이벤트 발생 시 호출.
 * 사용자가 키를 누를 때 발생하는 이벤트.
 */
function onOptFuncTypeKeydown(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var optFuncType = e.control;
	if (e.keyCode === cpr.events.KeyCode.ENTER){
		search();
	}
}


/*
 * 인풋 박스에서 keydown 이벤트 발생 시 호출.
 * 사용자가 키를 누를 때 발생하는 이벤트.
 */
function onOptModuleCodeKeydown(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var optModuleCode = e.control;
	if (e.keyCode === cpr.events.KeyCode.ENTER){
		search();
	}
}


/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	search();
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmGetFunctionSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var smGetFunction = e.control;
	var responseText = smGetFunction.xhr.responseText;
	var jsonData = JSON.parse(responseText);
	app.lookup("dmSearch").build(jsonData);
	
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
	
	if(e.cellIndex === 2) {
		app.openDialog("modules/EDU/dhyun/admSetupFunctionPopup", {width : 400, height : 300}, function(dialog){
			dialog.ready(function(dialogApp){
				dialogApp.initValue = e.row.getRowData().funcCode;
			});
		}).then(function(returnValue){
			;
		});
	}
}
