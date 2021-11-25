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
 * @return {Array} 입력 되지 않은 label 값
 */
function requireValidate(){
    var returnValArr = []; // 필수 입력 라벨들의 문자를 담을 배열
    
    /* id명 */ var ipb1 = app.lookup("ipbFuncCode"); // 기능 코드 
    /* id명 */ var ipb2 = app.lookup("ipbFuncDesc"); // 기능명
    /* id명 */ var ipb4 = app.lookup("ipbFuncType"); // 기능 유형
    
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
 * 이벤트 처리 영역
 */

/*
 * 아웃풋에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onOutputClick(/* cpr.events.CMouseEvent */ e){
	app.close();
}

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
    var grd1 = app.lookup("grd1");
    gridAddRow(grd1);
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
    var grd1 = app.lookup("grd1");
    gridDeleteRow(grd1);
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
    var grd2 = app.lookup("grd2");
    gridAddRow(grd2);
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
    var grd2 = app.lookup("grd2");
    gridDeleteRow(grd2);
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
        grd1.insertRowData(grd1.rowCount, true, grd4.getRow(index).getRowData())
    });    
}


