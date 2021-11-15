/************************************************
 * AdmSetupFunctionPopup.js
 * Created at 2021. 9. 2. 오후 12:49:39.
 *
 * @author icbae
 ************************************************/

/**
 * 모듈 선언 영역
 */
var CommonUtils = cpr.core.Module.require("utils/CommonUtils").CommonUtils;
var GridUtils = cpr.core.Module.require("utils/GridUtils").GridUtils;
var ValidationUtils = cpr.core.Module.require("utils/ValidationUtils").ValidationUtils;

var isSaved = false;

/**
 * 함수 선언 영역 
 */
function init(ignoreRedraw) {
    var dmFunction = app.lookup("dmFunction");
    var dmAllFunctionParam = app.lookup("dmAllFunctionParam");
    var dsFunctionList = app.lookup("dsFunctionList");
    var dsRelFunctionList = app.lookup("dsRelFunctionList");
    var dsFuncParamList = app.lookup("dsFuncParamList");
    var dsTagList = app.lookup("dsTagList");
    var grpContents = app.lookup("grpContents");
    
    dmFunction.reset();
    dmAllFunctionParam.reset();
    dsFunctionList.clearData();
    dsRelFunctionList.clearData();
    dsFuncParamList.clearData();
    dsTagList.clearData();
    
    searchAllFunctionList();
    
    if (!ignoreRedraw) {
        grpContents.redraw();
    }
}

function search() {
    var smsGetFunction = app.lookup("smsGetFunction");
    smsGetFunction.send();
}

function searchRelFunctionList() {
    var smsGetRelFunctionList = app.lookup("smsGetRelFunctionList");
    smsGetRelFunctionList.send();
}

function searchAllFunctionList() {
    var smsGetAllFunctionList = app.lookup("smsGetAllFunctionList");
    smsGetAllFunctionList.send();
}

function validate() {
    return ValidationUtils.validate(app, "grpContents");
}

function requestEncoder(api, data) {
	/**
	 * @type cpr.protocols.Submission
	 */
	var submission = api;
    var params = data["data"]["dmFunction"];
    var dsFuncParamList = app.lookup("dsFuncParamList");
    var dsTagList = app.lookup("dsTagList");
    var rowdatas;
    
    if (dsFuncParamList.getRowCount() > 0) {
        rowdatas = dsFuncParamList.getRowDataRanged();
        params.funcParamList = rowdatas;
    }
    
    if (dsTagList.getRowCount() > 0) {
        rowdatas = dsTagList.getRowDataRanged().map(function(row) {
            return row.value;
        });
        params.tagList = rowdatas;
    }
    
    return {
        content: submission.method === "post" ? [params] : params
    }
}

function post() {
    var smsPostFunction = app.lookup("smsPostFunction");
    smsPostFunction.setRequestEncoder(requestEncoder);
    smsPostFunction.send();
}

function put() {
    var smsPutFunction = app.lookup("smsPutFunction");
    smsPutFunction.setRequestEncoder(requestEncoder);
    smsPutFunction.send();
}

function saveRelFunction(id) {
    var dsRelFunctionList = app.lookup("dsRelFunctionList");
    var smsSaveRelFunctionList = app.lookup("smsSaveRelFunctionList");
    
    if (dsRelFunctionList.getRowCount() > 0) {
        smsSaveRelFunctionList.setRequestEncoder(function(api, data) {
        	
            return {
                content: data["data"]["dsRelFunctionList"]
            }
        });
        smsSaveRelFunctionList.send();
    }
}

/**
 * 이벤트 처리 영역
 */

/*
 * 아웃풋(optClose)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onOptCloseClick( /* cpr.events.CMouseEvent */ e) {
    app.close(isSaved);
}

/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad( /* cpr.events.CEvent */ e) {
    var initValue = app.getHostProperty("initValue"); // 메인페이지에서 전달받은 파라미터 값
    
    init(true);
    if (initValue && initValue.id) { // id 존재 유무에 따라 분기
        // 조회 조건으로 사용할 ID 추가
        app.lookup('dmFunction').setValue('id', initValue.id);
        search();
    }
}

/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsGetFunctionSubmitSuccess( /* cpr.events.CSubmissionEvent */ e) {
    /** 
     * @type cpr.protocols.Submission
     */
    var smsGetFunction = e.control;
    var dmFunction = app.lookup("dmFunction");
    var dsFuncParamList = app.lookup("dsFuncParamList");
    var dsTagList = app.lookup("dsTagList");
    var tagList = [];
    var grpKeys = app.lookup("grpKeys");
    var grpGeneral = app.lookup("grpGeneral");
    var response;
    
    if (smsGetFunction.xhr.status === 200) {
        // Response Body 데이터 처리
        response = JSON.parse(smsGetFunction.xhr.responseText);
        
        // response 데이터를 데이터 맵에 맵핑
        dmFunction.build(response);
        
        // tagList 처리
        if (response.tagList) {
            response.tagList.forEach(function(tag) {
                tagList.push({
                    value: tag
                });
            })
            
            dsTagList.build(tagList);
        }
        
        // 화면 다시 그리기
        grpKeys.redraw();
        grpGeneral.redraw();
        
        // 연관 기능 목록 조회
        searchRelFunctionList(response.id);
    }
}

/*
 * 데이터셋에서 load 이벤트 발생 시 호출.
 * build 메소드에 의해 데이터 구조가 재구성될 때 발생하는 이벤트. 초기 생성시에도 발생합니다.
 */
function onDsRelFunctionListLoad( /* cpr.events.CDataEvent */ e) {
    var dsFunctionList = app.lookup("dsFunctionList");
    dsFunctionList.refresh();
}

/*
 * 버튼(btnAddRowLeftGrid)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnAddRowLeftGridClick( /* cpr.events.CMouseEvent */ e) {
    var grdLeft = app.lookup("grdLeft");
    var row = grdLeft.insertRow();
    grdLeft.focusCell(row.getIndex(), 0);
}

/*
 * 버튼(btnDelRowLeftGrid)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnDelRowLeftGridClick( /* cpr.events.CMouseEvent */ e) {
    var grdLeft = app.lookup('grdLeft');
    var indexes;
    
    if (grdLeft.rowCount < 1) return;
    
    indexes = grdLeft.getCheckRowIndices();
    
    if (!indexes || indexes.length < 1) {
        CommonUtils.alert(app, Intl.get("Warnning"), Intl.get("MIC-00393"));
        return;
    }
    
    grdLeft.deleteRow(indexes);
}

/*
 * 버튼(btnAddRowRightGrid)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnAddRowRightGridClick( /* cpr.events.CMouseEvent */ e) {
    var grdRight = app.lookup("grdRight");
    var row = grdRight.insertRow();
    grdRight.focusCell(row.getIndex(), 0);
}

/*
 * 버튼(btnDelRowRightGrid)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnDelRowRightGridClick( /* cpr.events.CMouseEvent */ e) {
    var grdRight = app.lookup('grdRight');
    var indexes;
    
    if (grdRight.rowCount < 1) return;
    
    indexes = grdRight.getCheckRowIndices();
    
    if (!indexes || indexes.length < 1) {
        CommonUtils.alert(app, Intl.get("Warnning"), Intl.get("MIC-00393"));
        return;
    }
    
    grdRight.deleteRow(indexes);
}

/*
 * 버튼(btnFilterClear)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnFilterClearClick( /* cpr.events.CMouseEvent */ e) {
    // 조회 조건 초기화
    var dmAllFunctionParam = app.lookup("dmAllFunctionParam");
    dmAllFunctionParam.reset();
    
    // 재조회
    searchAllFunctionList();
}

/*
 * 버튼(btnFilter)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnFilterClick( /* cpr.events.CMouseEvent */ e) {
    searchAllFunctionList();
}

/*
 * 버튼(btnToRight)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnToRightClick( /* cpr.events.CMouseEvent */ e) {
    GridUtils.moveRowsToGrid(app, "grdAllFunc", "grdRelFunc", "relFuncCode", false, true, {
        "funcCode": "relFuncCode",
        "funcLocaleDesc": "relFuncDesc"
    });
}

/*
 * 버튼(btnToLeft)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnToLeftClick( /* cpr.events.CMouseEvent */ e) {
    GridUtils.moveRowsToGrid(app, "grdRelFunc", "grdAllFunc", "funcCode", false, true, {
        "relFuncCode": "funcCode",
        "relFuncDesc": "funcLocaleDesc"
    });
}

/*
 * "Reset" 버튼(btnReset)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnResetClick( /* cpr.events.CMouseEvent */ e) {
    init();
}

/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsPostFunctionSubmitSuccess( /* cpr.events.CSubmissionEvent */ e) {
    /** 
     * @type cpr.protocols.Submission
     */
    var smsPostFunction = e.control;
    var dmFunction = app.lookup("dmFunction");
    var id;
    
    if (smsPostFunction.xhr.status === 200 || smsPostFunction.xhr.status === 201) {
        id = dmFunction.getValue('funcCode'); // 각 REST API의 ID 명명 규칙에 따라 ID 구성
        
        dmFunction.setValue('id', id);
        saveRelFunction();
        
        isSaved = true;
        CommonUtils.alert(app, Intl.get("Info"), Intl.get("MIC-00392"));
    }
}

/*
 * "Save" 버튼(btnSave)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnSaveClick( /* cpr.events.CMouseEvent */ e) {
    var dmFunction = app.lookup("dmFunction");
    
    if (!validate()) {
        return;
    }
    
    CommonUtils.confirm(app, Intl.get("Save"), Intl.get("MIC-00391"), function() {
        if (dmFunction.getValue("id")) {
            put();
        } else {
            post();
        }
    })
}

/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsPutFunctionSubmitSuccess( /* cpr.events.CSubmissionEvent */ e) {
    /** 
     * @type cpr.protocols.Submission
     */
    var smsPutFunction = e.control;
    if (smsPutFunction.xhr.status === 200) {
        saveRelFunction();
        isSaved = true;
        
        CommonUtils.alert(app, Intl.get("Info"), Intl.get("MIC-00392"));
    }
}
