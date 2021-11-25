/************************************************
 * admSetupFunctionsMain.js
 * Created at 2021. 11. 22. 오전 11:20:57.
 *
 * @author KBJ
 ************************************************/

var ServiceUrls = cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;
var clickRowID;
var initValues = {};

/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad( /* cpr.events.CEvent */ e) {
	
	//	app.lookup("sms1").send();
}

function search() {
	
	var sms1 = app.lookup("sms1");
	
	sms1.send();
}

/*
 * "조회" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click( /* cpr.events.CMouseEvent */ e) {
	
	search();
}

/*
 * 그리드에서 cell-click 이벤트 발생 시 호출.
 * Grid의 Cell 클릭시 발생하는 이벤트.
 */
function onGrd1CellClick( /* cpr.events.CGridMouseEvent */ e) {
	/** 
	 * @type cpr.controls.Grid
	 */
	var grd1 = e.control;
	
	clickRowID = e.row.getRowData().id;
}

/*
 * "초기화" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click( /* cpr.events.CMouseEvent */ e) {
	/** 
	 * @type cpr.controls.Button
	 */
	var btn1 = e.control;
	
	// 데이터 맵 초기화
	var dmSearch = app.lookup("dmSearch");
	dmSearch.reset();
	
	// 초기화된 값이 갱신되도록 컨트롤을 포함한 그룹을 redraw()
	var grp1 = app.lookup("grp1");
	grp1.redraw();
	
	// 그리드 초기화
	var ds1 = app.lookup("ds1");
	ds1.clear();
}

/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSms1SubmitSuccess( /* cpr.events.CSubmissionEvent */ e) {
	/** 
	 * @type cpr.protocols.Submission
	 */
	var sms1 = e.control;
	
	var responseText = sms1.xhr.responseText;
	var jsonData = JSON.parse(responseText);
	
	var ds1 = app.lookup("ds1");
	
	if (jsonData.list) {
		ds1.clearData();
		ds1.build(jsonData.list);
	} else {
		//		alert("검색결과가 없습니다.");
		ds1.clearData();
		ds1.pushRowData(jsonData);
	}
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


/*
 * "삭제" 버튼(btn3)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn3Click( /* cpr.events.CMouseEvent */ e) {
	/** 
	 * @type cpr.controls.Button
	 */
	var btn3 = e.control;
	
	var grd1 = app.lookup("grd1");
	
	var checkRowIndices = grd1.getCheckRowIndices(); // 현재 check 되어 있는 row index 배열을 반환.
	
	if (checkRowIndices.length > 0){
		var confirmResult = confirm("삭제 하시겠습니까?");
		
		if (confirmResult){
			var ds1 = app.lookup("ds1"); // 그리드에 바인딩된 데이터 셋
			var ds1Copy = app.lookup("ds1Copy"); // 그리드에서 check한 행만 따로 담아둘 데이터 셋, 미라콤 프로젝트의 규약에 맞게 데이터를 넘겨주기 위해 check한 행만 따로 담아둠
			
			checkRowIndices.forEach(function(index){
				
				grd1.deleteRow(index); // check한 행을 그리드에서 삭제
				ds1Copy.pushRowData(ds1.getRowData(index)); // check한 행을 ds1Copy 데이터 셋에 담기
			});
			
			var subDelete = app.lookup("subDelete");
			subSetRequestEncoder(subDelete, "ds1Copy");
			subDelete.send();
			search();
		}
	}
	else {
		alert("선택된 행이 없습니다.");
	}
}

/*
 * "신규" 버튼(btn5)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn5Click( /* cpr.events.CMouseEvent */ e) {
	/** 
	 * @type cpr.controls.Button
	 */
//	var btn5 = e.control;
//	app.lookup("grd1").insertRow(-1, true);

	var grd1 = e.control;
	app.openDialog("modules/EDU/bjkim/admSetupFuntionsPopup", {width: 940,	height: 700}, function(dialog) {
		dialog.ready(function(dialogApp) {
			
			initValues = {
				clickRowId : "",
				state : "save"
			}
			
			dialogApp.initValue = initValues;
			// 필요한 경우, 다이얼로그의 앱이 초기화 된 후, 앱 속성을 전달하십시오.
		});
	}).then(function(returnValue) {
		
	});
	
}

/*
 * "Detail" 버튼(btn4)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn4Click( /* cpr.events.CMouseEvent */ e) {
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	app.openDialog("modules/EDU/bjkim/admSetupFuntionsPopup", {width : 900, height : 650}, function(dialog){
		dialog.ready(function(dialogApp){
			if (clickRowID){
				initValues = {
					clickRowID : clickRowID,
					state : "update"
				}
				dialogApp.initValue = initValues;
				clickRowID = ""; // clickRowID 변수 초기화.
			}
			else {
				initValues = {
					state : "save"
				}
				dialogApp.initValue = initValues
			}
			
			dialog.addEventListener("close", function(e){
				if (e.returnValue){
					search();
				}
			});
		});
	}).then(function(returnValue){
		;
	});
}

/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onSearchWordKeyup( /* cpr.events.CKeyboardEvent */ e) {
	/** 
	 * @type cpr.controls.InputBox
	 */
	var searchWord = e.control;
	
//	if (e.key == "ENTER"){
//		search();
//	}
	
	if (e.keyCode === cpr.events.KeyCode.ENTER){
		search();
	}
}

/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onFuncTypeKeyup( /* cpr.events.CKeyboardEvent */ e) {
	/** 
	 * @type cpr.controls.InputBox
	 */
	var funcType = e.control;
	
	if (e.keyCode === cpr.events.KeyCode.ENTER){
		search();
	}
}

/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onModuleCodeKeyup( /* cpr.events.CKeyboardEvent */ e) {
	/** 
	 * @type cpr.controls.InputBox
	 */
	var moduleCode = e.control;
	
	if (e.keyCode === cpr.events.KeyCode.ENTER){
		search();
	}
}

/*
 * 체크 박스에서 value-change 이벤트 발생 시 호출.
 * CheckBox의 value를 변경하여 변경된 값이 저장된 후에 발생하는 이벤트.
 */
function onSuite1Flag_ValueChange(/* cpr.events.CValueChangeEvent */ e){
	/** 
	 * @type cpr.controls.CheckBox
	 */
	var suite1Flag_ = e.control;
	
	search();
}


/*
 * 체크 박스에서 value-change 이벤트 발생 시 호출.
 * CheckBox의 value를 변경하여 변경된 값이 저장된 후에 발생하는 이벤트.
 */
function onSuite2FlagValueChange(/* cpr.events.CValueChangeEvent */ e){
	/** 
	 * @type cpr.controls.CheckBox
	 */
	var suite2Flag = e.control;
	
	search();
}
