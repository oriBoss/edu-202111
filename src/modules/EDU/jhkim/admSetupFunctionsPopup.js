/************************************************
 * admSetupFunctionsPopup.js
 * Created at 2021. 11. 25. 오후 9:07:16.
 *
 * @author 쭈주니
 ************************************************/
/**
 * 서비스 모듈 선언 영역
 */
var serviceModule = cpr.core.Module.require("module/service");


/**
 * 멤버 변수 영역
 */	
var initValues = {};
var flag = false;
	
/**
 * 함수 선언 영역 
 */

/**
 * 
 * @param {cpr.controls.Grid} grid
 */
function gridAddRow(grid){
    grid.insertRow(grid.rowCount, true);
}

/**
 * 
 * @param {cpr.controls.Grid} grid
 */
function gridDeleteRow(/* cpr.controls.Grid */grid){
    var checkRowIndices = grid.getCheckRowIndices(); 
    
    if (checkRowIndices.length > 0){
        var confirmResult = confirm("삭제 하시겠습니까?");
        if (confirmResult){
            
            checkRowIndices.forEach(function(index){
                
                grid.deleteRow(index);
            });
        }
    }
}



/**
 * @return {Array} 입력 되지 않은 label 값
 */
function requireValidate(){
    var returnValArr = [];
    
    var ipb1 = app.lookup("ipbFuncCode"); // 기능 코드 
    var ipb2 = app.lookup("ipbFuncDesc"); // 기능명
    var ipb4 = app.lookup("ipbFuncType"); // 기능 유형
    
    var ipbFuncCodeVal = ipb1.value;
    var ipbFuncDescVal = ipb2.value;
    var ipbFuncTypeVal = ipb4.value;
    
    if (ipbFuncCodeVal == "" || ipbFuncCodeVal == null){
        returnValArr.push("기능 코드");
    }
    if (ipbFuncDescVal == "" || ipbFuncDescVal == null){
        returnValArr.push("기능명");
    }
    if (ipbFuncTypeVal == "" || ipbFuncTypeVal == null){
        returnValArr.push("기능 유형");
    }
    
    return returnValArr;
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
 * 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn1 = e.control;
    var ipb1 = app.lookup("ipbFuncCode");
    ipb1.value = "";
    
}


/*
 * 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn2 = e.control;
    var smsSearchRel = app.lookup("smsSearchRel");
    smsSearchRel.send();
}


/*
 * "+" 버튼(btn9)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn9Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn9 = e.control;
    var grd3 = app.lookup("grd3");
    gridAddRow(grd3);
}


/*
 * "-" 버튼(btn10)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn10Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn10 = e.control;
    var grd3 = app.lookup("grd3");
    gridDeleteRow(grd3);
}


/*
 * "+" 버튼(btn12)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn12Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn12 = e.control;
    var grd4 = app.lookup("grd4");
    gridAddRow(grd4);
}


/*
 * "-" 버튼(btn11)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn11Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn11 = e.control;
    var grd4 = app.lookup("grd4");
    gridDeleteRow(grd4);
}


/*
 * "Save" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var button = e.control;
    var requireValidationArr = requireValidate();
    
    if (requireValidationArr.length == 0){
        var confirmResult = confirm("저장 하시겠습니까?");
        if (confirmResult){
             if(initValues.state == "save"){
                var smsSave = app.lookup("smsSave");
                
                smsSave.setRequestEncoder(function(api, data){
                    return {content : data["data"]["dmSearch"]}
                });
                
                smsSave.send();
            }
            else if (initValues.state == "update"){
                var smsUpdate = app.lookup("smsUpdate");
                
                smsUpdate.setRequestEncoder(function(api, data){
                    return {content : data["data"]["dmSearch"]}
                });
                
                smsUpdate.send();
            }
        }
    }
    else {
        var alertStr = "";
        requireValidationArr.forEach(function(requireLabel){
            alertStr += "[" + requireLabel + "] ";
        });
        alert(alertStr + "필수 입력입니다.");
    }    
}


/*
 * 버튼(btn7)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn7Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn7 = e.control;
    var grd1 = app.lookup("grd1");
    var checkRowIndices = grd1.getCheckRowIndices();
    
    var grd2 = app.lookup("grd2");
    
    var funcCodeDatas = [];
    for(var idx = 0; idx < grd2.rowCount; idx++){
        funcCodeDatas.push(grd2.getRow(idx).getRowData().funcCode);
    }
    
    checkRowIndices.forEach(function(index){
        var indexof = funcCodeDatas.indexOf(grd1.getRow(index).getRowData().funcCode);
        if (indexof == -1){
            grd2.insertRowData(grd2.rowCount, true, grd1.getRow(index).getRowData());
        }
        else {
            alert("기능 코드값이 동일한 데이터는 추가되지 않습니다.");
        }
    });    
}


/*
 * 버튼(btn8)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn8Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn8 = e.control;
    var grd2 = app.lookup("grd2");
    var checkRowIndices = grd2.getCheckRowIndices();
    
    var grd1 = app.lookup("grd1");
    
    checkRowIndices.forEach(function(index){
        grd1.insertRowData(grd1.rowCount, true, grd2.getRow(index).getRowData())
    });    
}




/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
    // initValue 반환
    initValues = app.getHost().initValue;
    
    var idData = initValues.clickRowID;
    var state = initValues.state;
    
    if (state == "save"){
        app.lookup("ipbFuncCode").enabled = true;
    }
    
    //1번
    var dmSearch = app.lookup("dmSearch");
    dmSearch.setValue("funcCode", idData);
    app.lookup("ipbFuncCode").redraw();
    
    //2번
    var smsSearch = app.lookup("smsSearch");
    smsSearch.send();    
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsSearchSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
    /** 
     * @type cpr.protocols.Submission
     */
    var smsSearch = e.control;
    
    var responseText = smsSearch.xhr.responseText;
    var jsonData = JSON.parse(responseText);
    
    var dm1 = app.lookup("dmSearch");
    dm1.build(jsonData);
    
    app.lookup("grp1").redraw();
    
    
    var dsFuncParams = app.lookup("dsFuncParams");
    var dsTags = app.lookup("dsTags");
    
    var funcParams = jsonData.funcParams;
    var tags = jsonData.tags;
    
    if (funcParams){
        var arrFuncParams = funcParams.split(",");
        arrFuncParams.forEach(function (data){
            dsFuncParams.pushRowData({"name" : data.split("=")[0], "value" : data.split("=")[1]});
        })
    }
    
    if(tags){
        var arrTags = tags.split(",");
        arrTags.forEach(function (data){
            dsTags.pushRowData({"value" : data});
        })
    }    
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsSaveSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
    /** 
     * @type cpr.protocols.Submission
     */
    var smsSave = e.control;
    flag = true;
    app.close(flag);
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsUpdateSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
    /** 
     * @type cpr.protocols.Submission
     */
    var smsUpdate = e.control;
    flag = true;
    app.close(flag);
}


/*
 * 버튼(btn3)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn3Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn3 = e.control;
    var grd2 = app.lookup("grd2");
    var checkRowIndices = grd2.getCheckRowIndices();
    for(var i=0; i<checkRowIndices.length; i++) {
        grd2.dataSet.moveRowIndex(checkRowIndices[i], i, false);
    }
    grd2.redraw();
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
    var grd2 = app.lookup("grd2");
    var checkRowIndices = grd2.getCheckRowIndices();
    for(var i=0; i<checkRowIndices.length; i++) {
        grd2.dataSet.moveRowIndex(checkRowIndices[i], checkRowIndices[i]-1, false);
    }
    grd2.redraw();    
}


/*
 * 버튼(btn5)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn5Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn5 = e.control;
    var grd2 = app.lookup("grd2");
    var checkRowIndices = grd2.getCheckRowIndices();
    for(var i=checkRowIndices.length-1; i>=0; i--) {
        grd2.dataSet.moveRowIndex(checkRowIndices[i], checkRowIndices[i]+1, true);
    }
    grd2.redraw();    
}


/*
 * 버튼(btn6)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn6Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn6 = e.control;
    var grd2 = app.lookup("grd2");
    var checkRowIndices = grd2.getCheckRowIndices();
    var vnRowCount = grd2.rowCount;
    for(var i=0; i<checkRowIndices.length; i++) {
        grd2.dataSet.moveRowIndex(checkRowIndices[i]-i, vnRowCount-1, true);
    }
    grd2.redraw();
}


///*
// * 인풋 박스에서 keyup 이벤트 발생 시 호출.
// * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
// */
//function onIpb16Keyup(/* cpr.events.CKeyboardEvent */ e){
//    /** 
//     * @type cpr.controls.InputBox
//     */
//    var ipb16 = e.control;
//    if(e.keyCode == cpr.events.KeyCode.ENTER){
//        var smsSearch = app.lookup("smsSearch");
//        smsSearch.send();
//    }
//}
