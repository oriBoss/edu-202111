/************************************************
 * AdmSetupFunctionMain.js
 * Created at 2021. 8. 31. 오전 11:29:56.
 *
 * @author Miracom
 ************************************************/

/**
 * 모듈 선언 영역
 */
var CommonUtils = cpr.core.Module.require("utils/CommonUtils").CommonUtils;
var GridUtils = cpr.core.Module.require("utils/GridUtils").GridUtils;

/**
 * 함수 선언 영역 
 */
function initPageNumber() {
    var dmSearchParam = app.lookup('dmSearchParam');
    dmSearchParam.setValue('pageNumber', 0);
}

function search(isInitPageNumber) {
    var smsGetFunctions = app.lookup("smsGetFunctions");
    
    if (isInitPageNumber) {
        initPageNumber();
    }
    
    smsGetFunctions.send();
}

function reset() {
    var dmSearchParam = app.lookup("dmSearchParam");
    var dsMatList = app.lookup("dsFunctionList");
    var grpSearch = app.lookup("grpSearch");
    var grpContents = app.lookup("grpContents");
    
    // 조회조건 초기화
    dmSearchParam.reset();
    
    // 그리드 데이터 초기화
    dsMatList.clearData();
    
    // 기타 컴포넌트 초기화
    app.lookup("pixIndexer").totalRowCount = 0;
    app.lookup("optTotalSize").value = null;
    
    // 각 컴포넌트 redraw
    grpSearch.redraw();
    grpContents.redraw();
    
    search(true);
}

//var send = cpr.protocols.Submission.prototype.send;
//var setRequestEncoder = cpr.protocols.Submission.prototype.setRequestEncoder;
//cpr.protocols.Submission.prototype.setRequestEncoder = function(/* cpr.protocols.RequestEncoder */ requestEncoder) {
//	this._requestEncoder = setRequestEncoder;
//	
//	this.hasEncoder = true;	
//	this._requestEncoder(requestEncoder);
//}
//
//cpr.protocols.Submission.prototype.send = function() {
//	this._send = send;
//	
//	if (!this.hasEncoder) {
//		if (this.method === "patch") {
//			this.setRequestEncoder(function(api, data) {
//				/**@type cpr.protocols.Submission */
//				var submission = api;
//				var requestData = submission.getRequestData(0);
//				return {
//	                content: data["data"][requestData.alias]
//	            }
//			});
//		}
//	}
//	
//	this._send();
//}

function deleteList() {
    var grdMain = app.lookup('grdMain');
    var indexes = grdMain.getCheckRowIndices();
    
    if (grdMain.rowCount < 1) return;
    
    if (!indexes || indexes.length < 1) {
        CommonUtils.alert(app, Intl.get("Warnning"), Intl.get("MIC-00393"));
        return;
    }
    
    CommonUtils.confirm(app, Intl.get("Confirm"), Intl.get("MIC-00394", {
        count: indexes.length
    }), function() {
        var smsDeleteFunctions = app.lookup("smsDeleteFunctions");
        
        GridUtils.copyCheckedRowData(app, "grdMain", "dsCheckedFunctionList");
//        smsDeleteFunctions.setRequestEncoder(function(api, data) {
//            return {
//                content: data["data"]["dsCheckedFunctionList"]
//            }
//        });
        
        smsDeleteFunctions.send();
    });
}

function popupDetail(initValue) {
    app.getRootAppInstance().openDialog("modules/ADM/pages/AdmSetupFunctionPopup", { // ID는 팝업창 clx 파일의 app ID로 변경
        width: 940, // 팝업창의 가로 크기
        height: 650, // 팝업창의 세로 크기
        headerVisible: false,
        modal: true
    }, function(dialog) {
        dialog.initValue = initValue; // 팝업창에 전달할 파라미터 설정
        
        dialog.addEventListenerOnce("close", function(e) { // 팝업창이 닫히고 처리할 이벤트 핸들러
            /**@type cpr.controls.Dialog*/
            var dialog = e.control;
            var returnValue = dialog.returnValue;
            
            if (returnValue) {
                search(true); // 재조회	
            }
        });
    });
}

/**
 * 이벤트 처리 영역
 */

/*
 * "Search" 버튼(btnSearch)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnSearchClick( /* cpr.events.CMouseEvent */ e) {
    search(true);
}

/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsGetFunctionsSubmitSuccess( /* cpr.events.CSubmissionEvent */ e) {
    /** 
     * @type cpr.protocols.Submission
     */
    var smsGetFunctions = e.control;
    var response = JSON.parse(smsGetFunctions.xhr.responseText);
    var pixIndexer = app.lookup("pixIndexer");
    var optTotalSize = app.lookup("optTotalSize");
    var totalSize;
    
    if (response) {
        totalSize = response.totalSize;
        
        pixIndexer.totalRowCount = totalSize;
        pixIndexer.redraw();
        
        optTotalSize.value = totalSize;
    }
}

/*
 * "Reset" 버튼(btnReset)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnResetClick( /* cpr.events.CMouseEvent */ e) {
    reset();
}

/*
 * 콤보 박스에서 selection-change 이벤트 발생 시 호출.
 * ComboBox Item을 선택하여 선택된 값이 저장된 후에 발생하는 이벤트.
 */
function onCmbPageSizeSelectionChange( /* cpr.events.CSelectionEvent */ e) {
    search(true);
}

/*
 * 사용자 정의 컨트롤에서 page-change 이벤트 발생 시 호출.
 */
function onPixIndexerPageChange( /* cpr.events.CSelectionEvent */ e) {
    search(false);
}

/*
 * "Delete" 버튼(btnDelete)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnDeleteClick( /* cpr.events.CMouseEvent */ e) {
    deleteList();
}

/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsDeleteFunctionsSubmitSuccess( /* cpr.events.CSubmissionEvent */ e) {
    /** 
     * @type cpr.protocols.Submission
     */
    var smsDeleteFunctions = e.control;
    if (smsDeleteFunctions.xhr.status === 200) {
        search(true); // 삭제 서비스가 성공하면 재 조회합니다.
    }
}

/*
 * "New" 버튼(btnNew)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnNewClick( /* cpr.events.CMouseEvent */ e) {
    popupDetail();
}

/*
 * 버튼(btnDetail)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnDetailClick( /* cpr.events.CMouseEvent */ e) {
    var grdMain = app.lookup("grdMain");
    var currentIndex = grdMain.getSelectedRowIndex();
    var dsFunctionList = app.lookup("dsFunctionList");
    var initValue = dsFunctionList.getRowData(currentIndex);
    
    popupDetail(initValue);
}

/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad( /* cpr.events.CEvent */ e) {
    search(true);
}

/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpbSearchWordKeyup(/* cpr.events.CKeyboardEvent */ e){
	if (e.keyCode === cpr.events.KeyCode.ENTER) {
		search(true);
	}
}
