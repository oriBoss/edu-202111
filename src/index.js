/************************************************
 * index.js
 * Created at 2021. 8. 9. 오전 9:47:38.
 *
 * @author lagnaroc
 ************************************************/
var LogUtils = cpr.core.Module.require("utils/LogUtils").LogUtils;


/*
 * 루트 컨테이너에서 init 이벤트 발생 시 호출.
 * 앱이 최초 구성될 때 발생하는 이벤트 입니다.
 */
function onBodyInit(/* cpr.events.CEvent */ e){
	var serviceUtils = cpr.core.Module.require("modules/COMMON/utils/ServiceUtils");
	var sampleMenuInfo = cpr.core.Module.require("config/MES_MENU_SAMPLE");
	
	
	// menu를 없애 준다.
	app.lookup("main-menu").hide();
	
	// 앱이 로드 되면 Authorization 정보를 가져옵니다.
	var service = new serviceUtils.ServiceUtils();
	
	var ret = service.checkAuthorization();
	
	cpr.I18N.INSTANCE.currentLanguage = "ko";
	
	// 다국어 처리를 위한 내용 입니다.
	var I18n = cpr.core.Module.require("config/MES_I18N_SAMPLE").MES_I18N_SAMPLE;
	var i18n = new I18n();
	i18n.loadI18nData(function () {

	});
	
	var menuInfo = sampleMenuInfo.MES_MENU_SAMPLE;
	var info = menuInfo.info;
	
	// HomeTab을 설정 합니다. HomeTab은 다른 곳에서 받아서 정할 수 있도록 해야 합니다.
	setHomeTab();
	
	// Menu 컴포넌트에 데이터를 넣어서 동적으로 메뉴를 구성합니다.
	setMenuInfo(info);
}


function setHomeTab() {
	var tab = app.lookup("main-tab-com");  
    addTabItemWithApp("", { closable: false, text: "HOME"});
    
}

function addTabItemWithApp(appPage, options) {
	if (options === undefined) options = {};
	var tab = app.lookup("main-tab-com");
	tab.addItemWithApp(appPage, true, function (/* cpr.controls.TabItem */ item) {
               
        /** @type cpr.controls.EmbeddedApp */
        var emb1 = item.content; 
        item.text = (options.text) ? options.text : "";
        item.closable = (options.closable) ? options.closable : true;
        
        //임베디드앱이 준비가 되면 처리할 작업 등록
        emb1.ready(function(/* cpr.events.CEvent */ e){

        })             
    });
	tab.showCloseOnlyActive = true;
}


function getPageName(packageName) {
	return packageName.replaceAll(".", "/");
}

function setMenuInfo(menuInfo) {
	if (menuInfo === undefined) return;
	
	var menu = app.lookup("main-menu");

	// menu를 선택할 경우 실행 되는 이벤트 핸들러를 등록 합니다.
	menu.addEventListener("selection-change", function (event) {
		var oldSelection = event.oldSelection;
		var newSelection = event.newSelection;
		
		if (newSelection && newSelection.length > 0) {
			var selection = newSelection[0];
			var packageName = selection.value;
			if (packageName.indexOf("page:") == 0) {
				var page = getPageName(packageName.replace("page:", ""));
				addTabItemWithApp(page, { text: selection.label });
			}
		}
	});
	
	for (var i = 0; i < menuInfo.list.length; i++) {
		var firstInfo = menuInfo.list[i];
		
		if (firstInfo.list) {
			
			var firstMenu = new cpr.controls.TreeItem(firstInfo.displayName, "menu:_first_" + firstInfo.id, "root");
			menu.addItem(firstMenu);
			for (var j = 0; j < firstInfo.list.length; j++) {
				var secondInfo = firstInfo.list[j];
				if (secondInfo && secondInfo.list) {
					
					var secondMenu = new cpr.controls.TreeItem(secondInfo.displayName, "menu:_second_" + secondInfo.id, "menu:_first_" + firstInfo.id);
					menu.addItem(secondMenu);
					for (var z = 0; z < secondInfo.list.length; z++) {
						var thirdInfo = secondInfo.list[z];
						
						if (thirdInfo) {
							// page로 해석될 경우에는 value에 packageName을 넣습니다. - 3 depth는 무조건 page . . . 요구 사항 변경 시 수정 필요
							var pageName = thirdInfo.packageName + "." + thirdInfo.name;
							var thridMenu = new cpr.controls.MenuItem(thirdInfo.displayName, "page:" + pageName, "menu:_second_" + secondInfo.id);
							
							menu.addItem(thridMenu);
						}
					}
				} else {
					// page 로 설정 하는 부분 
					var pageNaem = secondInfo.packageName + "." + secondInfo.name;
					var secondMenu = new cpr.controls.MenuItem(secondInfo.displayName, "page:" + pageName, "menu:_first_" + firstInfo.id);
					menu.addItem(secondMenu);
				}
			}
		} else {
			// page 로 설정하는 부분
			var name = firstInfo.packageName + "." + firstInfo.name;
			var firstMenu = new cpr.controls.TreeItem(firstInfo.displayName, "page:" + name, "root");
			menu.addItem(firstMenu);
		}		
	}
}

/*
 * "MENU" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	var menu = app.lookup("main-menu");
	if (menu.visible == false) {
		menu.show();
	} else {
		menu.hide();
	}
}
