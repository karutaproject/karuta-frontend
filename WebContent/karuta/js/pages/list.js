
//==============================
function getListSubBar()
//==============================
{
	var html = "";
	html += "<div id='welcome-image'>";
	html += "	<div class='welcome-box'>";
	html += "		<div class='welcome-subbox'>";
	html += "			<div id='welcome-title' class='welcome-title'>KARUTA</div>";
	html += "			<div id='welcome-line' class='welcome-line'></div>";
	html += "			<div id='welcome-baseline' class='welcome-baseline'>";
	html += "				OPEN SOURCE PORTFOLIO";
	html += "			</div>";
	html += "		</div>";
	html += "	</div>";
	html += "</div>";
	return html;
}

//==============================
function setWelcomeTitles()
//==============================
{
	if (g_configVar['list-welcome-title-color']!=undefined) { //configuration portfolio has been read
		var root = document.documentElement;
		root.style.setProperty('--list-welcome-title-color',g_configVar['list-welcome-title-color']);
		root.style.setProperty('--list-welcome-subtitle-color',g_configVar['list-welcome-subtitle-color']);
		root.style.setProperty('--list-welcome-subline-color',g_configVar['list-welcome-subline-color']);
		root.style.setProperty('--list-welcome-box-border-color',g_configVar['list-welcome-box-border-color']);
		root.style.setProperty('--list-welcome-box-background-color',g_configVar['list-welcome-box-background-color']);
		$("#welcome-title").html(g_configVar['list-welcome-title']);
		$("#welcome-title").attr('style', g_configVar['list-welcome-title-css']);
		$("#welcome-baseline").html(g_configVar['list-welcome-subtitle']);
		$("#welcome-baseline").attr('style', g_configVar['list-welcome-subtitle-css']);
	}
}

//==============================
function show_list_page()
//==============================
{
	hideAllPages();
	$("body").removeClass();
	$("body").addClass("list-page")
	$("#welcome-bar").html(getListSubBar());
	$("#welcome-bar").show();
	$("#sub-bar").hide();
	setWelcomeTitles();
	applyListConfiguration();
	setLanguageMenu("fill_list_page()");
	$("#search-portfolio-div").show();
	$("#main-list").show();
	$('[data-tooltip="true"]').tooltip({html: true, trigger: 'hover'});
}

//==============================
function fill_list_page()
//==============================
{
	$("#wait-window").show();
	$("[data-toggle='tooltip']").tooltip("hide");
	setLanguageMenu("fill_list_page()");
	//--------------------------
	var html = "";
	//-----------------------------------------------------------
	html += "<div id='portfolio-body'>";
	//------------------------------------------
	html += "	<div id='portfolio-rightside' class='rightside'>";
	html += "		<div id='portfolio-refresh' class='refresh fas fa-sync-alt' onclick='fill_list_page()'></div>";
	html += "		<div id='portfolio-search' class='search'></div>";
	html += "		<div id='portfolio-rightside-title' class='title'></div>";
	html += "		<div id='portfolio-rightside-header' class='header'></div>";
	html += "		<div id='portfolio-rightside-content1' class='content1'></div>";
	html += "		<div id='portfolio-rightside-navbar-pages-top' class='navbar-pages' style='display:none'></div>";
	html += "		<div id='portfolio-rightside-content2' class='content2'></div>";
	html += "		<div id='portfolio-rightside-navbar-pages-bottom' class='navbar-pages' style='display:none'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "	<div id='portfolio-leftside'  class='leftside'>";
	html += "		<div id='menu'></div>";
	html += "		<h3 class='portfolio-title-leftside' ondrop='dropPortfolioFolder(event)' ondragover='ondragoverPortfolioFolder(event)' ondragleave='ondragleavePortfolioFolder(event)'>";
	html += "			<span id='folders-label' class='folder-label'>"+karutaStr[LANG]['folders']+"</span>&nbsp<span class='badge number_of_folders' id='nb_folders_active'></span>";
	if (USER.admin || (USER.creator && !USER.xlimited)){
		html += "			<span class='folder-label btn' title='"+karutaStr[LANG]['create_folder']+"'><i class='fas fa-folder-plus' id='folder-create' onclick=\"UIFactory.PortfolioFolder.createFolder();\"></i></span>";
	}
	html += "		</h3>";
	html += "		<div id='portfolio-leftside-content1' class='content1 tree'></div>";
	html += "		<h3 class='title'>";
	html += "			<span id='portfolios-label' class='folder-label'>"+karutaStr[LANG]['portfolios']+"</span>&nbsp<span class='badge number_of_portfolios' id='portfolios-nb'></span>";
	html += "			<button id='list-menu' class='btn' onclick=\"UIFactory.PortfolioFolder.loadAndDisplayPortfolios('portfolio-content2-rightside','list');\">&nbsp;"+karutaStr[LANG]['see']+"</button>";
	html += "		</h3>";
	html += "		<div id='portfolio-leftside-content2' class='content2'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "</div>";
	//-----------------------------------------------------------
	$("#main-list").html(html);
	UIFactory.PortfolioFolder.displayPortfolioSearch("portfolio",false);	
	//---------------------------------------------
	if (USER.admin || USER.creator ){
		//-------- menu -------------------------------------
		html  = "<div class='dropdown'>";
		html += "	<button id='list-menu' class='btn dropdown-toggle' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded='false'>&nbsp;"+karutaStr[LANG]['import']+"</button>";
		html += "	<div class='dropdown-menu' aria-labelledby='list-menu'>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.import(false)\" >"+karutaStr[LANG]['import_portfolio']+"</a>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.import(true)\" >"+karutaStr[LANG]['import_zip']+"</a>";
		html += "		<div class='dropdown-divider'></div>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.importFile(false,true)\" >"+karutaStr[LANG]['import_instance']+"</a>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.importZip(true,true)\" >"+karutaStr[LANG]['import_zip_instance']+"</a>";
		html += "	</div>";
		html += "</div>";
		$("#menu").html(html);
	}

	//--------we load the folders-----------------------
	UIFactory.PortfolioFolder.loadAndDisplayAll('portfolio');
	UIFactory.PortfolioFolder.checkPortfolios();
	if (nb_folders==0 && nb_portfolios==0 && g_execbatch!=undefined && g_execbatch){
		$("#search-portfolio-div").hide();
		$("#refresh").hide();
		displayExecBatchButton();
	}
}

//==============================
function display_list_page()
//==============================
{
	if ($("#list-menu").length) {
		show_list_page();
		UIFactory.PortfolioFolder.checkPortfolios();
	} else {
		show_list_page();
		fill_list_page();
	}
}


//==============================
function applyListConfiguration()
//==============================
{
	if (g_configVar['list-welcome-image']!=undefined) { // configuration has been read
		$('.list-page #main-body').css("background-image", g_configVar['list-welcome-image']);
		var root = document.documentElement;
		root.style.setProperty('--list-background-color',g_configVar['list-background-color']);
		root.style.setProperty('--list-menu-background-color',g_configVar['list-menu-background-color']);
		root.style.setProperty('--list-menu-text-color',g_configVar['list-menu-text-color']);
		root.style.setProperty('--list-element-text-color',g_configVar['list-element-text-color']);
		root.style.setProperty('--list-element-background-color',g_configVar['list-element-background-color']);
		root.style.setProperty('--list-element-background-color-complement',g_configVar['list-element-background-color-complement']);
		root.style.setProperty('--list-title-color',g_configVar['list-title-color']);
		root.style.setProperty('--list-button-background-color',g_configVar['list-button-background-color']);
	}
}

//==============================
function cleanList()
//==============================
{
	$("#searched-portfolios-header").hide();
	$("#searched-portfolios-content").hide();
	$(".portfolio-label.active").removeClass('active');
	$("#portfolio-rightside-title").html("");
	$("#portfolio-rightside-header").html("");
	$("#portfolio-rightside-content1").html("");
	$("#portfolio-rightside-navbar-pages-top").html("");
	$("#portfolio-rightside-content2").html("");
	$("portfolio-rightside-navbar-pages-bottom").html("");
}




