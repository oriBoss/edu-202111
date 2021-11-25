/************************************************
 * admSetupFunctionsPopup.js
 * Created at 2021. 11. 24. 오후 2:18:12.
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
    var checkRowIndices = grid.getCheckRowIndices(); // 현재 check 되어 있는 row index 배열을 반환합니다. 
    
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
 * 
 * @return {Array} 입력 되지 않은 label 값
 */
function requireValidate(){
    var returnValArr = []; // 필수 입력 라벨들의 문자를 담을 배열
    
    /* id명 */ var ipbFuncCode = app.lookup("ipbFuncCode"); // 기능 코드 
    /* id명 */ var ipbFuncDesc = app.lookup("ipbFuncDesc"); // 기능명
    /* id명 */ var ipbFuncTypeDesc = app.lookup("ipbFuncTypeDesc"); // 기능 유형
    /* id명 */ var colName = undefined; // 매개변수
    
    var grd1 = app.lookup("grd1");
    for(var idx = 0; idx < grd1.getRowCount(); idx++){
        /* 컬럼명 */ var colNameVal = grd1.getDataRow(idx).getValue("name");
        if (colNameVal == ""){ // 값이 입력되지 않은 행이 있는지 없는지 체크
            colName = false; // 값 작성 여부
        }
    }
    
    var ipbFuncCodeVal = ipbFuncCode.value;
    var ipbFuncDescVal = ipbFuncDesc.value;
    var ipbFuncTypeDescVal = ipbFuncTypeDesc.value;
    
    if (ipbFuncCodeVal == "" || ipbFuncCodeVal == null){
        returnValArr.push("기능 코드");
    }
    if (ipbFuncDescVal == "" || ipbFuncDescVal == null){
        returnValArr.push("기능명");
    }
    if (ipbFuncTypeDescVal == "" || ipbFuncTypeDescVal == null){
        returnValArr.push("기능 유형");
    }
    if (colName == false){
        returnValArr.push("매개 변수");
    }
    
    return returnValArr	
}
/** 멤버 변수 **/
var initValues = {}; // initVlaue
var flag = false; // 값 변경 여부



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
 * "Save" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn2 = e.control;
    var requireValidationArr = requireValidate();
    
    if (requireValidationArr.length == 0){
        var confirmResult = confirm("저장 하시겠습니까?");
        if (confirmResult){
             if(initValues.state == "save"){
                var subSave = app.lookup("subSave");
                
                subSave.setRequestEncoder(function(api, data){
                    return {content : data["data"]["dm1"]}
                });
                
                subSave.send();
            }
            else if (initValues.state == "update"){
                var subUpdate = app.lookup("subUpdate");
                
                subUpdate.setRequestEncoder(function(api, data){
                    return {content : data["data"]["dm1"]}
                });
                
                subUpdate.send();               
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
    var dm1 = app.lookup("dm1");
    dm1.setValue("funcCode", idData);
    app.lookup("ipbFuncCode").redraw();
    
    //2번
    var smsSetup = app.lookup("smsSetup");
    smsSetup.send();
}


/*
 * 버튼(btn9)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn9Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn9 = e.control;
    
// 단순 왼쪽에서 오른쪽으로 넘기기    
//  var grd3 = app.lookup("grd3");
//  var checkRowIndices = grd3.getCheckRowIndices();
//  
//  var grd4 = app.lookup("grd4");
//  
//  checkRowIndices.forEach(function(index){
//      grd4.insertRowData(grd4.rowCount, true, grd3.getRow(index).getRowData())
//  });

// 중복된 값을 검사하기 위해 추가했다
    var grd3 = app.lookup("grd3");
    var checkRowIndices = grd3.getCheckRowIndices();    
    var grd4 = app.lookup("grd4");
    var funcCodeDatas = [];
    var dsFuncCode = app.lookup("dsFuncCode");
    
    for(var idx = 0; idx < grd4.rowCount; idx++){
        funcCodeDatas.push(grd4.getRow(idx).getRowData().funcCode);
    }
    
    
    checkRowIndices.forEach(function(index){
        var indexof = funcCodeDatas.indexOf(grd3.getRow(index).getRowData().funcCode);
        console.log(indexof);
        if (indexof == -1){
            grd4.insertRowData(grd4.rowCount, true, grd3.getRow(index).getRowData());
            dsFuncCode.deleteRow(index);
        }
        else {
            alert("기능 코드값이 동일한 데이터는 추가되지 않습니다.");
        }
    });
    
        
}


/*
 * 버튼(btn10)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn10Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn10 = e.control;
    var grd4 = app.lookup("grd4");
    var checkRowIndices = grd4.getCheckRowIndices();    
    var grd3 = app.lookup("grd3");
    var funcCodeDatas = [];
    var dsFuncCode = app.lookup("dsFuncCode");
    
    for(var idx = 0; idx < grd3.rowCount; idx++){
        funcCodeDatas.push(grd3.getRow(idx).getRowData().funcCode);
    }
    
    
    checkRowIndices.forEach(function(index){
        var indexof = funcCodeDatas.indexOf(grd4.getRow(index).getRowData().funcCode);
        console.log(indexof);
        if (indexof == -1){
            grd3.insertRowData(grd3.rowCount, true, grd4.getRow(index).getRowData());
            dsFuncCode.deleteRow(index);
        }
        else {
            alert("기능 코드값이 동일한 데이터는 추가되지 않습니다.");
        }
    });
        
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
    app.lookup("subSearchRel").send();
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
    var ipb3 = app.lookup("ipb3");
    ipb3.value = "";
}
