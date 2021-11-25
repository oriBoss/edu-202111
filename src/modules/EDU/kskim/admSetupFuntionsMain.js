/************************************************
 * Untitled.js
 * Created at 2021. 11. 22. 오전 11:42:32.
 *
 * @author kimks
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	
//var ServiceUrls = cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;
var clickRowId;
var initValues = {};
/**
 * 함수 선언 영역 
 */
function search(){
	var smsGetFunctions = app.lookup("smsGetFunctions");
	smsGetFunctions.send();

}

/**
 * 
 * @param {cpr.protocols.Submission} submission 인코딩 처리할 서브미션
 * @param {String} dataControlName 데이터 셋 id 명
 */
function subSetRequestEncoder(submission, dataControlName){
	submission.setRequestEncoder(function(api, data){
		return {content : data["data"][dataControlName]}
	});
}

/**
 * 이벤트 처리 영역
 */


/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
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
function onSearchWordKeydown(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var searchWord = e.control;
	if (e.keyCode === cpr.events.KeyCode.ENTER) {
		search();
	}
}


/*
 * 인풋 박스에서 keydown 이벤트 발생 시 호출.
 * 사용자가 키를 누를 때 발생하는 이벤트.
 */
function onFuncTypeKeydown(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var funcType = e.control;
	if (e.keyCode === cpr.events.KeyCode.ENTER) {
		search();
	}
}


/*
 * 인풋 박스에서 keydown 이벤트 발생 시 호출.
 * 사용자가 키를 누를 때 발생하는 이벤트.
 */
function onModuleCodeKeydown(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var moduleCode = e.control;
	if (e.keyCode === cpr.events.KeyCode.ENTER) {
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
	grpSearch.redraw();

	search();
	
}


/*
 * 그리드에서 cell-click 이벤트 발생 시 호출.
 * Grid의 Cell 클릭시 발생하는 이벤트.
 */
function onGrdListCellClick(/* cpr.events.CGridMouseEvent */ e){
	/** 
	 * @type cpr.controls.Grid
	 */
	var grdList = e.control;
	clickRowId = e.row.getRowData().id;
}


/*
 * 버튼(btnDetail)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnDetailClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnDetail = e.control;

	app.openDialog("modules/EDU/kskim/admSetupFuntionsPopup", {width : 940, height : 700}, function(dialog){
		dialog.ready(function(dialogApp){
			dialog.headerTitle = "메뉴기능 상세내역";
			if(clickRowId){
				initValues = {
					clickRowID : clickRowId,
					state : "update"
				}
				dialogApp.initValue = initValues;
				clickRowId = ""; //초기화
			}
		});
	}).then(function(returnValue){
		if(returnValue == true) {
			search();
		}
		;
	});
}


/*
 * "삭제" 버튼(btnDelete)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnDeleteClick(/* cpr.events.CMouseEvent */ e){
	var grdList = app.lookup("grdList");
	var checkedRow = grdList.getCheckRowIndices();
	var smsDeleteFunction = app.lookup("smsDeleteFunction");
	var dsFunctionList = app.lookup("dsFunctionList");
	var dsDeleteFunctionList = app.lookup("dsDeleteFunctionList");
	
	if (checkedRow.length > 0) {
		if(confirm("삭제 하시겠습니까?")) {
			checkedRow.forEach(function(index){
				grdList.deleteRow(index);
				dsDeleteFunctionList.pushRowData(dsFunctionList.getRowData(index));
			});
			subSetRequestEncoder(smsDeleteFunction, "dsDeleteFunctionList");
			smsDeleteFunction.send();
		} 
	}else {
		alert("선택된 행이 없습니다.");
	}
}

/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsDeleteFunctionSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	search();
}


/*
 * "신규" 버튼(btnAddFunction)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnAddFunctionClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnAddFunction = e.control;
	
		app.openDialog("modules/EDU/kskim/admSetupFuntionsPopup", {width : 940, height : 700}, function(dialog){
		dialog.ready(function(dialogApp){
			dialog.headerTitle = "메뉴기능 상세내역";
			initValues = {
				clickRowID : "",
				state : "save"
			}
			dialogApp.initValue = initValues;
		});
	}).then(function(returnValue){
		if(returnValue == true) {
			search();
		}
		;
	});
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsGetFunctionsSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var smsGetFunctions = e.control;
	var dmSearch = app.lookup("dmSearch");
	var ipbModuleCode = app.lookup("ipbModuleCode");
	var moduleDesc = dmSearch.getString("moduleCode");
		
	switch(moduleDesc) {
		case "ADM" :
			moduleDesc = "Common";
			break;
		case "RAS" :
			moduleDesc = "Resource";
			break;
			case "WIP" :
			moduleDesc = "Production";
			break;
			case "QCM" :
			moduleDesc = "Quality";
			break;
			case "INV" :
			moduleDesc = "Materials";
			break;
			case "MMS" :
			moduleDesc = "측정기관리";
			break;
			case "CWIP" :
			moduleDesc = "Custom";
			break;
	}
	dmSearch.setValue("moduleCode", moduleDesc);
	ipbModuleCode.redraw();
}


/*
 * 서브미션에서 before-submit 이벤트 발생 시 호출.
 * 통신을 시작하기전에 발생합니다.
 */
function onSmsGetFunctionsBeforeSubmit(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var smsGetFunctions = e.control;
	var dmSearch = app.lookup("dmSearch");
	var moduleDesc = dmSearch.getString("moduleCode");
	
	switch(moduleDesc) {
		case "Common" :
			moduleDesc = "ADM";
			break;
		case "Resource" :
			moduleDesc = "RAS";
			break;
			case "Production" :
			moduleDesc = "WIP";
			break;
			case "Quality" :
			moduleDesc = "QCM";
			break;
			case "Materials" :
			moduleDesc = "INV";
			break;
			case "측정기관리" :
			moduleDesc = "MMS";
			break;
			case "Custom" :
			moduleDesc = "CWIP";
			break;
	}
	dmSearch.setValue("moduleCode", moduleDesc);
}



