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
 * 멤버 변수
 */
	var clickRowID;
	var initValues = {};

/**
 * 함수 선언 영역 
 */
	
	function subSearchSend(){
		var smsFunction = app.lookup("smsFunction");
		smsFunction.send();
	}
	
	/**
	 * @param {cpr.protocols.Submission} submission 인코딩 처리할 서브미션
	 * @param {String} dataControlName 데이터 셋 id 명
	 */
	function subSetRequestEncoder(submission, dataControlName){
		submission.setRequestEncoder(function (api, data){
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
	subSearchSend();
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onOptSearchWordKeyup(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var optSearchWord = e.control;
	
	if (e.keyCode === cpr.events.KeyCode.ENTER){
		subSearchSend();
	}
	
}

/*
 * "조회" 버튼(btnSearch)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnSearchClick(/* cpr.events.CMouseEvent */ e){
	subSearchSend();
}


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
	
	// 데이터 맵 초기화
	dmSearch.reset();
	
	// 초기화된 값이 갱신되도록 컨트롤을 포함한 그룹을 redraw()
	grpSearch.redraw();
	
	// 그리드 초기화 -> 데이터 셋 초기화로 
	var dsFuctionList = app.lookup("dsFuctionList");
	dsFuctionList.clearData();
	
	subSearchSend();
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
	
	clickRowID = e.row.getRowData().id; // id 값만 clickRowID 안에 넣어서 확인
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onOptFuncTypeKeyup(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var optFuncType = e.control;
	
	if (e.keyCode === cpr.events.KeyCode.ENTER){
		subSearchSend();
	}
	
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onOptModuleCodeKeyup(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var optModuleCode = e.control;
	
	if (e.keyCode === cpr.events.KeyCode.ENTER){
		subSearchSend();
	}
}


/*
 * 버튼(btn4)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn4Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn4 = e.control;
	
		app.openDialog("modules/EDU/dhyun/admSetupFuntionsPopup", {width : 900, height : 750}, function(dialog){
		dialog.ready(function(dialogApp){
			if (clickRowID){
				initValues = {
					clickRowID : clickRowID,
					state : "update"
				}
				dialogApp.initValue = initValues;
				clickRowID = ""; // clickRowID 변수 초기화.
			} 
			
			dialog.addEventListener("close", function(e){
				if (e.returnValue){
					subSearchSend();
				}
			});
		});
	}).then(function(returnValue){
		if (returnValue == true){
			subSearchSend();
		}
		;
	});
	
	
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onOptModuleCodeKeyup2(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var optModuleCode = e.control;
	
	if (e.keyCode === cpr.events.KeyCode.ENTER){
		subSearchSend();
	}
}


/*
 * "삭제	" 버튼(btnDelete)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnDeleteClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnDelete = e.control;
	
	var grd1 = app.lookup("grd1");
	var checkRowIndices = grd1.getCheckRowIndices(); 	// 현재 Check 되어 있는 row index 배열을 반환
	
	if(checkRowIndices.length > 0) {
		var confirmResult = confirm("삭제 하시겠습니까?");
		if (confirmResult){
			var dsFuctionList = app.lookup("dsFuctionList");	// 그리드에 바인딩 된 데이터 셋
			var dsFuctionCopy = app.lookup("dsFuctionCopy");	// 그리드에 check한 행만 따로 담아둘 셋, 미라콤 프로젝트의 규약에 맞게 데이터를 넘겨주기 위해 check한 행만 따로 담아둠
			
			checkRowIndices.forEach(function(index){
				grd1.deleteRow(index); //check한 행을 그리드에서 삭제
				dsFuctionCopy.pushRowData(dsFuctionList.getRowData(index));	// Check한 행을 dsFuctionCopy 데이터 셋에 담기
			});
			
			var subDelete = app.lookup("subDelete");
			subSetRequestEncoder(subDelete, "dsFuctionCopy");
			subDelete.send();
		} else {
			alert("선택된 행이 없습니다.");
		}
	}
	
}


/*
 * "신규" 버튼(btnNew)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnNewClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnNew = e.control;
	
	app.openDialog("modules/EDU/dhyun/admSetupFuntionsPopup", {width : 900, height : 750}, function(dialog){
		dialog.ready(function(dialogApp){
			// 필요한 경우, 다이얼로그의 앱이 초기화 된 후, 앱 속성을 전달하십시오.
			initValues = {
				clickRowID : "",
				state : "save"
			}
			
			dialogApp.initValue = initValues;
		});
	}).then(function(returnValue){
		if (returnValue == true){
			subSearchSend();
		}
		;
	});
	
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
