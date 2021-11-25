/************************************************
 * admSetupFunctionsMain.js
 * Created at 2021. 11. 25. 오후 9:06:50.
 *
 * @author 쭈주니
 ************************************************/
 
/** 서비스 모듈 **/ 
var serviceModule = cpr.core.Module.require("module/service");

/** 멤버 변수 **/
var clickRowID;
var initValues = {};


/**
 * 함수 선언 영역 
 */
function smsSearchSend(){
    var smsSearch = app.lookup("smsSearch");
    smsSearch.send();
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
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb1Keyup(/* cpr.events.CKeyboardEvent */ e){
    /** 
     * @type cpr.controls.InputBox
     */
    var ipb1 = e.control;
    if (e.key == "Enter"){
        smsSearchSend();
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
        smsSearchSend();
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
    if (e.key == "Enter"){
        smsSearchSend();
    }
}


/*
 * "Reset" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn1 = e.control;
    var dmSearch = app.lookup("dmSearch");
    var grp1 = app.lookup("grp1");
    var dsFunctions = app.lookup("dsFunctions");
    
    // 데이터 맵 초기화    
    dmSearch.reset();
    
    // 초기화된 값이 갱신되도록 컨트롤을 포함한 그룹을 redraw()    
    grp1.redraw();
    
    // 데이터 셋 초기화    
    dsFunctions.clearData();
}


/*
 * "Search" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn2 = e.control;
    
    smsSearchSend();
}


/*
 * "Delete" 버튼(btn3)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn3Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn3 = e.control;
    var grd1 = app.lookup("grd1");
    var checkRowIndices= grd1.getCheckRowIndices();
    
    if (checkRowIndices.length > 0){
        var confirmResult = confirm("삭제 하시겠습니까?");
        if (confirmResult){
            var dsFunctions = app.lookup("dsFunctions"); 
            var dsFunctionsList = app.lookup("dsFunctionsList");
            
            checkRowIndices.forEach(function(index){
                grd1.deleteRow(index); 
                dsFunctionsList.pushRowData(dsFunctions.getRowData(index));
            });
            
            var smsDelete = app.lookup("smsDelete");
            subSetRequestEncoder(smsDelete, "dsFunctionsList");
            smsDelete.send();
        }
    }
    else {
        alert("선택된 행이 없습니다.");
    }

}


/*
 * "New" 버튼(btn5)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn5Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn5 = e.control;
    app.openDialog("modules/EDU/jhkim/admSetupFunctionsPopup", {width : 1000, height: 800}, function(dialog){
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
            smsSearchSend();
        }
        ;
    });    
}


/*
 * 버튼(detailBtn)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onDetailBtnClick(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var detailBtn = e.control;
    app.openDialog("modules/EDU/jhkim/admSetupFunctionsPopup", {width : 1000, height : 800}, function(dialog){
        dialog.ready(function(dialogApp){
            if (clickRowID){
                initValues = {
                    clickRowID : clickRowID,
                    state : "update"
                }
                dialogApp.initValue = initValues;
                clickRowID = "";
            }
        });
    }).then(function(returnValue){
        if (returnValue == true){
            smsSearchSend();
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
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsDeleteSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
    /** 
     * @type cpr.protocols.Submission
     */
    var smsDelete = e.control;
    smsSearchSend();
}
