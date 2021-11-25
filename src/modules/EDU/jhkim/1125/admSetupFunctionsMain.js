/************************************************
 * admSetupFunctionsMain.js
 * Created at 2021. 11. 24. 오전 10:57:08.
 *
 * @author 쭈주니
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	
var serviceModule = cpr.core.Module.require("module/service");


/**
 * 함수 선언 영역 
 */
var clickRowID;
var initValues = {};

/**
 * 이벤트 처리 영역
 */
function smsSetupSend(){   
    var smsSetup = app.lookup("smsSetup");        
    smsSetup.send();   
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
 * "Reset" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn1 = e.control;
    var dm1 = app.lookup("dm1");
    var grd1 = app.lookup("grd1");
    var dsSearch = app.lookup("dsSearch");
    
    // 데이터 맵 초기화
    dm1.reset();
     
    // 초기화된 값이 갱신되도록 컨트롤을 포함한 그룹을 redraw()
    grd1.redraw();
    
    // 데이터 행 초기화
    dsSearch.clearData();
    
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
    smsSetupSend();
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
    
    //e.key 가 True일 때 이벤트 발생
    if(e.key == cpr.events.KeyCode.ENTER){
        smsSetupSend();
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
    
    //e.key 가 True일 때 이벤트 발생
    if(e.key == cpr.events.KeyCode.ENTER){
        smsSetupSend();
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
    
    //e.key 가 True일 때 이벤트 발생
    if(e.key == cpr.events.KeyCode.ENTER){
        smsSetupSend();
    }
}


/*
 * "삭제" 버튼(btn3)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn3Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn3 = e.control;
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
            
            var smsDelete = app.lookup("smsDelete");
            subSetRequestEncoder(smsDelete, "ds1Copy");
            smsDelete.send();
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
function onBtn5Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn5 = e.control;
    app.openDialog("modules/EDU/jhkim/1125/admSetupFunctionsPopup", {width : 900, height : 600}, function(dialog){
        dialog.ready(function(dialogApp){
            initValues = {
                clickRowID : "",
                state : "save"
            }
            
            dialogApp.initValue = initValues;
            // 필요한 경우, 다이얼로그의 앱이 초기화 된 후, 앱 속성을 전달하십시오.
            
            dialog.addEventListener("close", function(e){
                e.returnValue
            });//onSubSaveSubmitSuccess의 app.close(flag);을 받는거 
        });
    }).then(function(returnValue){
        smsSetupSend();
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
    
    app.openDialog("modules/EDU/jhkim/1125/admSetupFunctionsPopup", {width : 900, height : 600}, function(dialog){
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
                    smsSetupSend();
                }
            });
        });
    }).then(function(returnValue){
       smsSetupSend();
    });
}


/*
 * 체크 박스에서 value-change 이벤트 발생 시 호출.
 * CheckBox의 value를 변경하여 변경된 값이 저장된 후에 발생하는 이벤트.
 */
function onCbx1ValueChange(/* cpr.events.CValueChangeEvent */ e){
    /** 
     * @type cpr.controls.CheckBox
     */
    var cbx1 = e.control;
    
    console.log(e);
}


/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onIpb1ValueChange(/* cpr.events.CValueChangeEvent */ e){
    /** 
     * @type cpr.controls.InputBox
     */
    var ipb1 = e.control;
    
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
    smsSetupSend();
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
    console.log(e.row.getRowData());
    
    clickRowID = e.row.getRowData().id;
}
