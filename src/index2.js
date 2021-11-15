/************************************************
 * index2.js
 * Created at 2021. 9. 16. 오후 6:07:12.
 *
 * @author lagnaroc
 ************************************************/

var LogUtils = cpr.core.Module.require("utils/LogUtils").LogUtils;
var ServiceUrls = cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;

/***********************************************
 * 
 * @desc
 * 	기존 MESV6 메뉴의 페이지에 매치되는 현재 페이지를 설정 합니다.
 */
var pageMapper = {
	"adm/pages/functions/FunctionPage": "modules/ADM/pages/AdmSetupFunctionMain",
	"adm/pages/accessHistories/AccessHistoryMainPage": "modules/ADM/pages/AccessHistoryMain",
}

/***********************************************
 * 
 * @desc
 * 	기존 MESV6 메뉴의 Label에 매치되는 아이콘을 설정합니다.
 */
var mainMenuIconMapper = {
	"Master Data": {
		icon: "../src/modules/COMMON/assets/images/ic-1depth-g-01.png",
		activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-01.png",
	},
	"Store Management": {
		icon: "../src/modules/COMMON/assets/images/ic-1depth-g-02.png",
		activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-02.png",
	},
	"Prod Management": {
		icon: "../src/modules/COMMON/assets/images/ic-1depth-g-03.png",
		activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-03.png",
	},
	"Equipment Management": {
		icon: "../src/modules/COMMON/assets/images/ic-1depth-g-04.png",
		activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-04.png",
	},
	"QC Management": {
		icon: "../src/modules/COMMON/assets/images/ic-1depth-g-05.png",
		activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-05.png",
	},
	"Recipe Management":  {
		icon: "../src/modules/COMMON/assets/images/ic-1depth-g-06.png",
		activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-06.png",
	},
	"MMS": {
		icon: "../src/modules/COMMON/assets/images/ic-1depth-g-07.png",
		activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-07.png",
	},
	"Facility Management": {
		icon: "../src/modules/COMMON/assets/images/ic-1depth-g-08.png",
		activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-08.png",
	},
	"System Management": {
		icon: "../src/modules/COMMON/assets/images/ic-1depth-g-09.png",
		activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-09.png",
	},
	"NUXP": {
		icon: "../src/modules/COMMON/assets/images/ic-1depth-g-10.png",
		activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-10.png",
	}
}

var mainMenuList = [];

/*
 * 루트 컨테이너에서 init 이벤트 발생 시 호출.
 * 앱이 최초 구성될 때 발생하는 이벤트 입니다.
 */
function onBodyInit( /* cpr.events.CEvent */ e) {
	setHomeTab();
	initLNB();
}

function setHomeTab() {
	var tab = app.lookup("main-tab-com");
	addTabItemWithApp("", {
		closable: false,
		text: "HOME"
	});
	LogUtils.debug("set Home Tab complete");
}


/*****************************************
 * 
 * @date 211007
 * @author lagnaroc
 * 
 * @param {any} appPage
 * @param {any} options
 * 
 * @desc
 * 	Tab을 추가하고 Page(임베디드 앱)을 로드합니다.
 *  같은 이름의 Tab일 경우 해당 Tab으로 이동 합니다.
 */
function addTabItemWithApp(appPage, options) {
	if (options === undefined) options = {};
	var tabControl = app.lookup("main-tab-com");
	var tabs = tabControl.getTabItems();
	var tabLen = tabs.length;
	
	tabControl.showCloseOnlyActive = false;
	var i;
	for (i = 0; i < tabLen; i++) {
		var tab = tabs[i];
		
		if (tab && tab.text === options.text) {
			tabControl.setSelectedTabItem(tab);
			return;
		}
	}
	
	tabControl.addItemWithApp(appPage, true, function( /* cpr.controls.TabItem */ item) {
		
		/** @type cpr.controls.EmbeddedApp */
		var emb1 = item.content;
		item.text = (options.text) ? options.text : "";
		item.closable = (options.closable) ? options.closable : true;
	});
	
}

/***********************************************
 * @date 211008
 * @author lagnaroc
 * @desc
 * 	LNB를 동적으로 설정하기 위한 부분입니다.
   @TODO 2depth 까지 밖에 구현이 안되어 있다. 5depth까지 나중에 구현이 가능하도록 수정이 필요하다.
 */
function initLNB() {
	// set Tabs
	var tabControl = app.lookup("fld1");
	var tabs = tabControl.getTabItems();
	tabs[2].visible = false;
		
	// set Accordion
	var accordion = app.lookup("acd1");
	
	// send menu service
	var smsMenus = new cpr.protocols.Submission("smsMenus");
	smsMenus.action = ServiceUrls.ADM_SERVICE_URL + "menus/UI";
	smsMenus.method = cpr.protocols.Submission.METHOD_GET;
	smsMenus.addEventListener("receive-json", function(e) {
		var content = e.content;
		var menuTree = content.tree;
		var menuListLength = menuTree.list.length;
		mainMenuList = menuTree.list;
		var i;
		for (i = 0; i < menuListLength; i++) {
			var menu = menuTree.list[i];
			if (menu) {
				var item = new cpr.controls.SectionItem();
				item.title = menu.label;
				item.id = "mrc-menu-item-" + i;
				
				accordion.addSection(item);
				
				if (menu.leafFlag === true) {
					if (menu.name && menu.packageName && menu.name !== "") {
						// add Click Event.
					}
				} else {
					if (menu.list) {
						init2DepthMenu(item, menu.list, i);
					}
				}
			}
		}
		
		// @TODO 임시 코드 - rendering time을 찾아서 확인 필요
		setTimeout(function() {
			createSplitter();
			
			initFactoryList();
			initLNBStyle(menuTree.list);
		}, 50);
	});
	smsMenus.addEventListener("submit-error", function(e) {
		alert("load error");
	});
	smsMenus.send();
	
	var sectionCnt = accordion.getSectionCount();
	var i;
	for (i = sectionCnt - 1; i >= 0; i--) {
		accordion.deleteSection(i);
	}
	
}

function initFactoryList() {
	
	var smsFactories = new cpr.protocols.Submission("factoriesSubmission");
	smsFactories.action = ServiceUrls.WIP_SERVICE_URL + 'factories'
	smsFactories.method = cpr.protocols.Submission.METHOD_GET;
	smsFactories.addEventListener("receive-json", function(e) {
		console.log("e.content");
		//		[MRCKR] Miracom Korea 1Factory
		var cmb1 = app.lookup("cmb1");
		var factories = e.content.list;
		var i;
		for (i = 0; i < factories.length; i++) {
			if (factories[i].tenantType === "FACTORY") {
				var factoryCode = factories[i].factoryCode;
				var desc = factories[i].tenantDesc;
				
				cmb1.addItem(new cpr.controls.Item("[" + factoryCode + "]" + desc, factoryCode));
			}
		}
	});
	smsFactories.addEventListener("submit-success", function(e) {
		var control = e.control;
		
		// save global variable . . . . 	
	});
	smsFactories.addEventListener("submit-error", function(e) {
		alert("submit= faie");
	});
	smsFactories.send();
}

function initLNBStyle(menuList) {
	// 1 Level - Accordion Component에 icon을 넣어 주기 위한 코드
	var mainMenuHeaders = $(".cl-accordion-header");
	
	mainMenuHeaders.each(function(index, obj) {
		if (menuList[index] && menuList[index].label && mainMenuIconMapper[menuList[index].label]) {
			$(obj).css('background-image', "url(" + mainMenuIconMapper[menuList[index].label].icon + ")");	
		}
	});
	
	// 1 depth의 icon의 activation을 위한 코드 입니다.
	$(".mrc-1depth-menu .cl-accordion-header").click(function(event) {
		
		var $target = undefined;
		if (event.target.className.indexOf("cl-accordion-header") === 0) {
			$target = $(event.target);
		} else {
			$target = $(event.target.parentNode);
		}
		
		var icon = $target.css("background-image");
		var iconArr = icon.split("/");
		var iconFileStr = iconArr[iconArr.length - 1].replace("\")", "");
		var i;
		
		for (i = 0; i < menuList.length; i++) {
			if (menuList && menuList[i] && menuList[i].label && mainMenuIconMapper[menuList[i].label]) {
				var icon = mainMenuIconMapper[menuList[i].label].icon;
				var activeIcon = mainMenuIconMapper[menuList[i].label].activeIcon;
				
				var itemIconArr = icon.split("/");
				var itemIconFileStr = (itemIconArr && itemIconArr.length > 0) ? itemIconArr[itemIconArr.length - 1].replace("\")", "") : "";
				
				var acriveItemIconArr = activeIcon.split("/");
				var activeIconFileStr = (acriveItemIconArr && acriveItemIconArr.length > 0) ? acriveItemIconArr[acriveItemIconArr.length - 1].replace("\")", "") : "";
				
				if (iconFileStr === itemIconFileStr) {
					if (activeIcon) {
						$target.css('background-image', "url(" + activeIcon + ")");
					}
					
					break;
				} else if (iconFileStr === activeIconFileStr) {
					if (icon) {
						$target.css('background-image', "url(" + icon + ")");
					}
					break;
				}
			}
		}
		
	});
	
	// LNB Tab - .cl-tabfolder-header-viewport size resizing
	$(".mrc-lnb-tab .cl-tabfolder-header .cl-tabfolder-header-viewport").css("grid-template-columns", "1fr 1fr");
}


function init2DepthMenu(item, list, idx) {
	var accordion1 = app.lookup("acd1");
	
	var accordion;
	var group;
	var i;
	
	for (i = 0; i < list.length; i++) {
		var menu = list[i];
		
		if (menu.list) {
			// list의 element가 list가 있다면 Accordion으로 더 추가 합니다. 그러나 없다면 button으로 추가 되어야합니다.
			if (accordion === undefined) {
				accordion = new cpr.controls.Accordion("mrc-2depth-menu-" + idx);
				accordion.multiple = true;
				
				group = new cpr.controls.Container("mrc-2depth-menu-grp");
				var layout = new cpr.controls.layouts.FormLayout();
				
				accordion.style.addClass("mrc-touch-2depth-menu");
				
				layout.setRows(["1fr"]);
				layout.setColumns(["1fr"]);
				group.setLayout(layout);
			
			
				if (group) {
					item.content = group;
				}	
			}
			
			var item = new cpr.controls.SectionItem();
			item.title = menu.label;
			accordion.addSection(item);
			
			initLowDepthMenu(item, menu.list);
		} else {
			if (group === undefined) {
				group = new cpr.controls.Container();
				var layout = new cpr.controls.layouts.VerticalLayout();
			
				group.setLayout(layout);
				group.style.addClass("mrc-touch-1depth-content-grp");
			}
			
			// list가 없을 경우 Vertical Layout을 추가 하고 Button을 차례대로 추가 해야 합니다.
			var btn = new cpr.controls.Button();
			btn.style.addClass("mrc-touch-2depth-link");
			
			btn.param1 = menu.funcLink;
			btn.value = menu.label;
			btn.addEventListener("click", function(e) {
				// e.targetContro.text
				var page = pageMapper[e.targetControl.param1]; //e.targetControl.param1.replaceAll(".", "/");
				addTabItemWithApp(page, {
					text: e.targetControl.value
				});

			});
			group.addChild(btn);
		}
	}
	
	if (accordion === undefined) {
		if (group) {
			item.content = group;
		}
	}
	
	
	if (accordion) {
		group.addChild(accordion);
	}
	
	var size = list.length * 40;
	accordion1.style.content.css("height", size + "px");
}
//
//function init2DepthMenu2(item, list, idx) {
//	var accordion1 = app.lookup("acd1");
//	
//	var accordion = new cpr.controls.Accordion("mrc-2depth-menu-" + idx);
//	accordion.multiple = true;
//	accordion.style.addClass("mrc-2depth-menu");
//	
//	var group = new cpr.controls.Container("mrc-2depth-menu-grp");
//	var layout = new cpr.controls.layouts.FormLayout();
//	var i;
//	
//	layout.setRows(["1fr"]);
//	layout.setColumns(["1fr"]);
//	
//	group.setLayout(layout);
//
//	item.content = group;
//	
//	for (i = 0; i < list.length; i++) {
//		var menu = list[i];
//		
//		var item = new cpr.controls.SectionItem();
//		
//		item.title = menu.label;
//		accordion.addSection(item);
//		
//		if (menu.list) {
//			initLowDepthMenu(item, menu.list);
//		}
//	}
//
//	group.addChild(accordion);
//	var size = list.length * 40;
//	accordion1.style.content.css("height", size + "px");
//}

function initLowDepthMenu(item, list) {
	var hasChild = false;
	var childList = [];
	var linkList = [];
	
	var accordion = undefined;
	var group = new cpr.controls.Container();
	var layout = new cpr.controls.layouts.VerticalLayout();
	var i;
	
	group.setLayout(layout);
	group.style.addClass("mrc-2depth-content-grp");
	
	item.content = group;
	
	for (i = 0; i < list.length; i++) {
		var menu = list[i];
		
		if (menu.list) { // accordion 내용 추가
			if (accordion === undefined) {
				accordion = new cpr.controls.Accordion("mrc-3depth-menu");
			}
			var childItem = new cpr.controls.SectionItem();
			childItem.title = menu.label;
			accordion.addSection(childItem);
			initLowDepthMenu(childItem, menu.list);
		} else { // button 내용 추가
			var btn = new cpr.controls.Button();
			btn.style.addClass("mrc-3depth-link");
			btn.style.css("padding-left", "16px");
			btn.style.css("padding-right", "0px");
			btn.param1 = menu.funcLink;
			btn.value = menu.label;
			btn.addEventListener("click", function(e) {
				// e.targetContro.text
				var page = pageMapper[e.targetControl.param1]; //e.targetControl.param1.replaceAll(".", "/");
				addTabItemWithApp(page, {
					text: e.targetControl.value
				});
				
			});
			group.addChild(btn);
		}
	}
	
	if (accordion) {
		group.addChild(accordion);
	}
}

/********************************************************************
 * 
 * @date 211001
 * @auth lagnaroc
 * @desc 
 * Floating 형태의 Splitter를 생성하기 위한 Function
 * 한번 이상 호출되면 안된다.
 */
function createSplitter() {
	var layoutTag = $(".main-layout");
	
	$(layoutTag).append("<div class='mrc-lnb-splitter'><button class='mrc-lnb-splitter-btn'>....</button></div>");
	
	var splitter = $(".mrc-lnb-splitter");
	
	/*
	 * "." 버튼(menu-btn)에서 mousedown 이벤트 발생 시 호출.
	 * 사용자가 컨트롤 위에 포인터를 위치한 상태로 마우스 버튼을 누를 때 발생하는 이벤트.
	 */
	$(splitter).mousedown(function(event) {
		onMenu_btnMousedown();
	});
	
	/*
	 * "." 버튼(menu-btn)에서 mouseup 이벤트 발생 시 호출.
	 * 사용자가 컨트롤 위에 포인터를 위치한 상태로 마우스 버튼을 뗄 때 발생하는 이벤트.
	 */
	$(splitter).mouseup(function(event) {
		onMenu_btnMouseup();
	});
}

var LNB_width = 250;
var LNB_resizeFlag = false;

function onMenu_btnMousedown() {
	/** 
	 * @type cpr.controls.Button
	 */
	LNB_resizeFlag = true;
}

function onMenu_btnMouseup() {
	/** 
	 * @type cpr.controls.Button
	 */
	LNB_resizeFlag = false;
}

/*
 * 루트 컨테이너에서 mousemove 이벤트 발생 시 호출.
 * 사용자가 컨트롤 위에 포인터를 이동할 때 발생하는 이벤트.
 */
function onBodyMousemove( /* cpr.events.CMouseEvent */ e) {
	if (LNB_resizeFlag === false) return;
	
	var menu = app.lookup("grp2");
	var layout1 = menu.getLayout(); //new cpr.controls.layouts.FormLayout();
	var columns = layout1.getColumnDivisions();
	var lngGrp = app.lookup("lng-grp");
	var lngLayout1 = lngGrp.getLayout();
	var splitter = $(".mrc-lnb-splitter");
	
	LNB_width = e.pageX;
	if (LNB_width < 250) {
		closeLNB();
	} else {
		openLNB();
		// check visible
		layout1.setColumnVisible(1, true);
		layout1.setColumns([LNB_width + "px", "1fr"]);
		lngLayout1.setColumns([LNB_width + "px"]);
		$(splitter).css("left", LNB_width);
	}
	menu.redraw();
}

/*
 * 루트 컨테이너에서 mouseup 이벤트 발생 시 호출.
 * 사용자가 컨트롤 위에 포인터를 위치한 상태로 마우스 버튼을 뗄 때 발생하는 이벤트.
 */
function onBodyMouseup( /* cpr.events.CMouseEvent */ e) {
	LNB_resizeFlag = false;
}

/*
 * @date 211007
 * @author lagnaroc
 * 
 * @desc
 * 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 * 
 * 햄버거 버튼 내용. - 토글로 한번 누르면 사이드 메뉴가 펼쳐지고 다시 누르면 사이드 메뉴가 닫힌다.
 */
function onBtn2Click( /* cpr.events.CMouseEvent */ e) {
	/** 
	 * @type cpr.controls.Button
	 */
	var splitter = $(".mrc-lnb-splitter");
	
	if ($(splitter).css("left") === "0px") {
		openLNB();
	} else {
		closeLNB();
	}
}

function openLNB() {
	var menu = app.lookup("grp2");
	var layout1 = menu.getLayout();
	var splitter = $(".mrc-lnb-splitter");
	var menuBtn = app.lookup("gnbMenuBtn");
	var lngGrp = app.lookup("lng-grp");
	var lngLayout1 = lngGrp.getLayout();
	
	layout1.setColumnVisible(0, true);
	layout1.setColumns(["250px", "1fr"]);
	lngLayout1.setColumns([250 + "px"]);
	$(splitter).css("left", "250px");
	menuBtn.icon = 'modules/COMMON/assets/images/ic-gnb-menu.png';
}

function closeLNB() {
	var menu = app.lookup("grp2");
	var layout1 = menu.getLayout();
	var splitter = $(".mrc-lnb-splitter");
	var menuBtn = app.lookup("gnbMenuBtn");
	
	layout1.setColumnVisible(0, false);
	$(splitter).css("left", "0px");
	menuBtn.icon = 'modules/COMMON/assets/images/ic_menu_fold.png';
}

/*
 * 서치 인풋에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onSinp1Keyup(/* cpr.events.CKeyboardEvent */ e){
	/** 
	 * @type cpr.controls.SearchInput
	 */
	var sinp1 = e.control;
	var fld1 = app.lookup("fld1");
	
	var children = fld1.getChildren();
	var tabs = fld1.getTabItems();
	
	if (e.target.value !== "") {
		var len = children.length;
		var tabLen = tabs.length;
		
		children[0].visible = false;
		children[1].visible = false;
		children[2].visible = true;
		
		tabs[0].visible = false;
		tabs[1].visible = false;
		tabs[2].visible = true;
		
		var searchedMenus = searchMenu(e.target.value);
		tabs[2].text = "조회 결과  (" + searchedMenus.length + ")";

		var searchResultGrp = app.lookup("searchResultGrp");
		searchResultGrp.removeAllChildren();
	
		
		var menusLen = searchedMenus.length;
		var i;
		for (i = 0; i < menusLen; i++) {
			createSearchLinkGrp(searchedMenus[i].title, searchedMenus[i].path, searchedMenus[i].page, false);	
		}
		
		fld1.setSelectedTabItem(tabs[2]);
		
		$(".mrc-lnb-tab").find(".cl-tabfolder-item").last().css("border-top-width", "0px");
		$(".mrc-lnb-tab").find(".cl-tabfolder-item").last().css("color", "#707070");
		$(".mrc-lnb-tab").find(".cl-tabfolder-item").last().css("background-color", "#eaeaea");
		$(".mrc-lnb-tab .cl-tabfolder-header .cl-tabfolder-header-viewport").css("grid-template-columns", "1fr");
	} else {
		var len = children.length;
		var i;
		for (i = 0; i < len; i++) {
			var child = children[i];
			child.visible = true;
		}
		
		children[0].visible = true;
		children[1].visible = true;
		children[2].visible = false;
		
		tabs[0].visible = true;
		tabs[1].visible = true;
		tabs[2].visible = false;
		fld1.setSelectedTabItem(tabs[0]);
		
		setTimeout(function () {
			$(".mrc-lnb-tab .cl-tabfolder-header .cl-tabfolder-header-viewport").css("grid-template-columns", "1fr 1fr");	
		}, 50);		
	}
}

/*************************************************
 * 
 * @author lagnaroc
 * @date 211007
 * 
 * @param {any} title
 * @param {any} path
 * @param {any} page
 * @param {Boolean} isFavorites
 * 
 * 
 * @desc
 * 	LNB의 검색에서 검색 결과를 나타내는 Link 그룹 화면을 생성한다.
 */
function createSearchLinkGrp(title, path, page, isFavorites) {
	var searchResultGrp = app.lookup("searchResultGrp");
	var layout = searchResultGrp.getLayout();
		
	// make Link Style;
	var linkGrp = new cpr.controls.Container();
	linkGrp.style.css("height", "48px");
	linkGrp.style.css("padding-top", "4px");
	linkGrp.style.css("padding-bottom", "4px");
	
	var linkGrpLayout = new cpr.controls.layouts.FormLayout();
	linkGrpLayout.setColumns(["40px", "1fr"]);
	linkGrpLayout.setRows(["20px", "20px"]);
	linkGrpLayout.verticalSpacing = "0";
	linkGrp.setLayout(linkGrpLayout);
		
	var favoriteBtn = new cpr.controls.Button();
	if (isFavorites === true) {
		favoriteBtn.style.addClass("LNB-favorites-active-btn");
	} else {
		favoriteBtn.style.addClass("LNB-favorites-deactive-btn");	
	}
	
	linkGrp.addChild(favoriteBtn, {
		colIndex: 0,
		rowIndex: 0
	});
		
	var linkBtn = new cpr.controls.Button();
	linkBtn.style.addClass("LNB-search-result-link");
	linkBtn.text = title;
	linkBtn.param1 = page;
	linkBtn.addEventListener("click", function (e) {
		var page = pageMapper[e.control.param1]; //e.targetControl.param1.replaceAll(".", "/");
				addTabItemWithApp(page, {
					text: e.targetControl.value
		});
	});
	
	linkGrp.addChild(linkBtn, {
		colIndex: 1,
		rowIndex: 0
	});
		
	var output = new cpr.controls.Output();
	output.text = path;
	output.style.addClass("LNB-search-result-path");
	linkGrp.addChild(output,{
		colIndex: 1,
		rowIndex: 1	
	});
		
	searchResultGrp.addChild(linkGrp);
}

/*********************************************
 * 
 * 
 * 
 * @date 211007
 * @author lagnaroc
 * @param {any} menuName 찾고자 하는 메뉴 이름
 * @desc
 * 	String 값으로 일치하는 메뉴 정보를 가져옵니다.
 * @return
 * 	{
 * 	  title: 화면에 display될 이름,
 * 	  path: 메뉴의 full path (화면에 display될)
 * 	  page: 실제 메뉴의 페이지 경로 
 * 	}
 */

function searchMenu(menuName) {
	var results = [];
	
	var len = mainMenuList.length;
	var i;
	for (i = 0; i < len; i++) {
		var menu = mainMenuList[i];
		if (menu && menu.list) {
			results = results.concat(searchNestedMenu(menu.list, menuName));
		} else {
			var downcaseLabel = menu.label.toLowerCase();
			var downCaseMenuName = menuName.toLowerCase();
			
			if (downcaseLabel.indexOf(downCaseMenuName) >= 0) {
				results.push({
					title: "[" + menu.funcCode + "] " + menu.label,
					path: menu.fullPath,
					page: menu.funcLink
				});
			}
		}
	}
	
	return results;
}

function searchNestedMenu(list, menuName) {
	var results = [];
	var len = list.length;
	var i;
	
	for (i = 0; i < len; i++) {
		var menu = list[i];
		
		if (menu && menu.list) {
			results = results.concat(searchNestedMenu(menu.list, menuName));
		} else {
			var downcaseLabel = menu.label.toLowerCase();
			var downCaseMenuName = menuName.toLowerCase();
			
			if (downcaseLabel.indexOf(downCaseMenuName) >= 0) {
				results.push({
					title: "[" + menu.funcCode + "]" + menu.label,
					path: menu.fullPath,
					page: menu.funcLink
				});
			}
		}
	}
	
	return results;
}


/*
 * 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 * 
 * @date 211007
 * @author lagnaroc
 * @desc
 * 	토글 형식 - accordion을 전부 펼치고 한번 더 누르면 accordion을 전부 닫는다.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn1 = e.control;
	var ac1 = app.lookup("acd1");
	
	
	var ac2List = [];
	var ac2 = undefined;
	var idx = 0;
	do {
		ac2 = app.lookup("mrc-2depth-menu-" + idx++);
		if (ac2) {
			ac2List.push(ac2);	
		}
	} while(ac2);
	
	if (btn1.icon === 'modules/COMMON/assets/images/search-btn.png') {
		var mainMenuHeaders = $(".mes-1depth-menu > .cl-accordion-wrap > .cl-accordion-header");
		
		btn1.icon = "modules/COMMON/assets/images/ic-collapse.png";
		if (ac1) {
			ac1.setSelectedSections(ac1.getSectionItems());
		}	
		// get accordions . . .
		var i; 
		for (i = 0; i < ac2List.length; i++) {
			var ac2 = ac2List[i];
			if (ac2) {
				ac2.setSelectedSections(ac2.getSectionItems());
			}	
		}		

		mainMenuHeaders.each(function(index, obj) {
			if (mainMenuIconMapper && mainMenuList && mainMenuList[index] && mainMenuIconMapper[mainMenuList[index].label]) {
				$(obj).css('background-image', "url(" + mainMenuIconMapper[mainMenuList[index].label].activeIcon + ")");
			}
		});
	} else {
		
		var mainMenuHeaders = $(".mes-1depth-menu > .cl-accordion-wrap > .cl-accordion-header");
		btn1.icon = 'modules/COMMON/assets/images/search-btn.png';
		if (ac1) {
			ac1.setSelectedSections([]);
			mainMenuHeaders.each(function(index, obj) {
				if (mainMenuIconMapper && mainMenuList && mainMenuList[index] && mainMenuIconMapper[mainMenuList[index].label]) {
					$(obj).css('background-image', "url(" + mainMenuIconMapper[mainMenuList[index].label].icon + ")");
				}
			});
		}		
	}
}

/*
 * 아코디언에서 mouseup 이벤트 발생 시 호출.
 * 사용자가 컨트롤 위에 포인터를 위치한 상태로 마우스 버튼을 뗄 때 발생하는 이벤트.
 * @date 211008
 * @author lagnaroc
 * @desc
 * 	accordion 메뉴를 클릭 할 경우 펼치기 토글 버튼의 아이콘이 변경 되어 전체 접기가 가능해야 합니다.
 */
function onAcd1Mouseup(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Accordion
	 */
	var acd1 = e.control;
		
	setTimeout(function () {
		var activeMenus = $(".mrc-1depth-menu").find(".cl-activated");
		var btn1 = app.lookup("btn1");
	
		if (activeMenus.length > 0) {
			btn1.icon = "modules/COMMON/assets/images/ic-collapse.png";
		} else {
			btn1.icon = 'modules/COMMON/assets/images/search-btn.png';	
		}
	}, 100);
}


/*
 * 서치 인풋에서 clear 이벤트 발생 시 호출.
 * Searchinput에서 esc키 또는 클리어버튼을 클릭하여 인풋의 값이 Clear될때 발생하는 이벤트
 */
function onSinp1Clear(/* cpr.events.CUIEvent */ e){
	/** 
	 * @type cpr.controls.SearchInput
	 */
	var fld1 = app.lookup("fld1");
	var children = fld1.getChildren();
	var tabs = fld1.getTabItems();
	var sinp1 = e.control;
	var len = children.length;
	var i;
	for (i = 0; i < len; i++) {
		var child = children[i];
		child.visible = true;
	}
		
	children[0].visible = true;
	children[1].visible = true;
	children[2].visible = false;
		
	tabs[0].visible = true;
	tabs[1].visible = true;
	tabs[2].visible = false;
	fld1.setSelectedTabItem(tabs[0]);
		
	setTimeout(function () {
		$(".mrc-lnb-tab .cl-tabfolder-header .cl-tabfolder-header-viewport").css("grid-template-columns", "1fr 1fr");	
	}, 50);		
}
