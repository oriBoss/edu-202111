/************************************************
 * main.js
 * Created at 2021. 11. 23. 오전 1:33:21.
 *
 * @author LHS_0212
 ************************************************/

/** 서비스 모듈 **/ 
var serviceModule = cpr.core.Module.require("module/service");

/** 멤버 변수 **/
var clickRowID;
var initValues = {};


function subSearchSend(){
	var subSearch = app.lookup("subSearch");
	subSearch.send();
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
 * "조회" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	subSearchSend();
}


/*
 * "초기화" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick5(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	// 데이터 맵 초기화
	var dm1 = app.lookup("dmSearch");
	dm1.reset();
	
	// 초기화된 값이 갱신되도록 컨트롤을 포함한 그룹을 redraw()
	var grp1 = app.lookup("grp1");
	grp1.redraw();
	
	// 데이터 셋 초기화
	var ds1 = app.lookup("ds1");
	ds1.clearData();
}


/*
 * "삭제" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick2(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	var grd1 = app.lookup("grd1");
	
	var checkRowIndices = grd1.getCheckRowIndices(); // 현재 check 되어 있는 row index 배열을 반환합니다.
	
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
		}
	}
	else {
		alert("선택된 행이 없습니다.");
	}
}


/*
 * "신규" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick3(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	app.openDialog("modules/EDU/jhkim/allDone/dialogPopup", {width : 900, height : 600}, function(dialog){
		dialog.ready(function(dialogApp){
			initValues = {
				clickRowID : "",
				state : "save"
			}
			
			dialogApp.initValue = initValues;
			// 필요한 경우, 다이얼로그의 앱이 초기화 된 후, 앱 속성을 전달하십시오.
			
		});
	}).then(function(returnValue){
		if (returnValue == true){
			subSearchSend();
		}
		;
	});
}


/*
 * "Detail" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick4(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	app.openDialog("modules/EDU/jhkim/allDone/dialogPopup", {width : 900, height : 600}, function(dialog){
		dialog.ready(function(dialogApp){
			if (clickRowID){
				initValues = {
					clickRowID : clickRowID,
					state : "update"
				}
				dialogApp.initValue = initValues;
				clickRowID = ""; // clickRowID 변수 초기화.
			}
		});
	}).then(function(returnValue){
		if (returnValue == true){
			subSearchSend();
		}
		;
	});
	
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
	
	clickRowID = e.row.getRowData().id;
}



/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb1Keyup(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var ipb1 = e.control;
	
	if (e.key == "Enter"){
		subSearchSend();
	}
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb2Keyup(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var ipb2 = e.control;
	
	if (e.key == "Enter"){
		subSearchSend();
	}
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb3Keyup(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var ipb3 = e.control;
	
	if (e.keyCode == cpr.events.KeyCode.ENTER){
		subSearchSend();
	}
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSubDeleteSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var subDelete = e.control;
	
	subSearchSend();
}
