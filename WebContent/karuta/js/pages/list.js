//==============================
function xxxgetList()
//==============================
{
	var html = "";
	var text0 = karutaStr[LANG]['folders'];
	var text1 = karutaStr[LANG]['projects'];
	var text2 = karutaStr[LANG]['portfolios-not-in-project'];
	if (USER.admin) {
		text0 = karutaStr[LANG]['folders-admin'];
		text1 = karutaStr[LANG]['projects-admin'];
		text2 = karutaStr[LANG]['portfolios-admin'];
	}
	html += "<div id='gutter'></div>";
	html += "<div id='list-rightside'>";
	//-----------------------------------------------------------
//		html += "<div id='folder-portfolios'></div>";
		html += "<div id='project-portfolios'></div>";
		html += "<div id='card-deck-portfolios'></div>";
		html += "<div id='searched-portfolios-header' style='display:none'>Portfolios";
		if (USER.creator && !USER.limited)  {
			html += "		<a id='archive-button' href='' class='btn' style='float:right'><i class='fas fa-download' ></i></a>";
			html += "		<button id='remove-button' type='button' onclick=\"UIFactory['Portfolio'].removeSearchedPortfolios()\" class='btn' style='float:right'><i class='fas fa-trash'></i></button>";
		}
		html += "</div>";
		html += "<div id='searched-portfolios-content' style='display:none'></div>";
	//-----------------------------------------------------------
	html += "</div><!--div id='list-rightside'-->";

	html += "<div id='list-leftside'>";
		//--------------------FOLDERS---------------------------------------
//		html += "<h3><span id='folders-label'>"+text0+"</span>&nbsp<span class='folders-nb badge' id='folders-nb'></span>";
//		html +="	<button class='btn list-btn' onclick='UIFactory.Folder.createfolder()'>"+karutaStr[LANG]['create_folder']+"</button>";
//		html += "</h3>";
//		html += "<div id='folders' class='tree portfolio'></div>";
	
	
		//--------------------PROJECTS---------------------------------------
		html += "<h3 id='projects-label'><span >"+text1+"</span>&nbsp<span class='projects-nb badge' id='projects-nb'></span>";
		html +="	<button class='btn list-btn' onclick='UIFactory.Portfolio.createProject()'>"+karutaStr[LANG]['create_project']+"</button>";
		html += "</h3>";
		html += "<div id='projects'></div>";
	
		
		//--------------------PORTFOLIOS--------------------------------------
		html += "<h3 id='portfolios-not-in-project'>";
		html += "	<span id='portfolios-label'>"+text2+"</span>&nbsp<span class='portfolios-nb badge' id='portfolios-nb'></span>";
		html += "	<button id='see-portfolios' class='btn list-btn' onclick=\"loadAndDisplayProjectContent('project-portfolios','false');$(window).scrollTop(0);$('.active').removeClass('active');\">"+ karutaStr[LANG]["see"] + "</button>";
		html += "</h3>";
	
	html += "</div><!--div id='list-leftside'-->";

	return html;
}

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
	$("#refresh").attr("onclick","fill_list_page()");
	$("#refresh").show();
	$("#search-portfolio-div").show();
	$("#list-container").show();
	$('[data-tooltip="true"]').tooltip({html: true, trigger: 'hover'});
}

//==============================
function fill_list_page()
//==============================
{
	setLanguageMenu("fill_list_page()");
	$("#wait-window").show();
	//--------------------------
	var html = "";
	//-----------------------------------------------------------
	html += "<div id='portfolio-body'>";
	//------------------------------------------
//	html += "	<div class='gutter'></div>";
	//------------------------------------------
	html += "	<div id='portfolio-rightside'>";
	html += "		<div id='search-portfolio' class='search'></div>";
	html += "		<div id='portfolio-title-rightside' class='title'></div>";
	html += "		<div id='portfolio-header-rightside' class='header'></div>";
	html += "		<div id='portfolio-content1-rightside' class='content1-rightside'></div>";
	html += "		<div id='portfolio-navbar-pages-top-rightside' class='navbar-pages' style='display:none'></div>";
	html += "		<div id='portfolio-content2-rightside' class='content2-rightside'></div>";
	html += "		<div id='portfolio-navbar-pages-bottom-rightside' class='navbar-pages' style='display:none'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "	<div id='portfolio-leftside'>";
	html += "		<div id='menu'></div>";
	html += "		<h3 id='portfolio-title-leftside'>"+karutaStr[LANG]['folders'];+"</h3>";
	html += "		<h4 id='portfolio-header-leftside'>";
	html += "			<span id='usersfolders-label' class='folder-label'>"+karutaStr[LANG]['users-folders']+"</span>&nbsp<span class='badge number_of_folders' id='nb_folders_active'></span>";
	html += "			<span class='folder-label btn' title='"+karutaStr[LANG]['create_folder']+"'><i class='fas fa-folder-plus' id='folder-create' onclick=\"UIFactory.UsersFolder.callCreateFolder('active');\"></i></span>";
	html += "		</h4>";
	html += "		<div id='portfolio-content1-leftside' class='content1-leftside tree'></div>";
	html += "		<div id='portfolio-content2-leftside' class='content2-leftside'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "</div>";
	//-----------------------------------------------------------
	$("#list-container").html(html);

	displaySearch("search-portfolio");
	
	//---------------------------------------------
	if (USER.admin || USER.creator ){
		//-------- menu -------------------------------------
		html  = "<div class='dropdown'>";
		html += "	<button id='list-menu' class='btn dropdown-toggle' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded='false'>&nbsp;"+karutaStr[LANG]['import']+"</button>";
		html += "	<div class='dropdown-menu' aria-labelledby='list-menu'>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.importFile()\" >"+karutaStr[LANG]['import_portfolio']+"</a>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.importZip()\" >"+karutaStr[LANG]['import_zip']+"</a>";
		html += "		<div class='dropdown-divider'></div>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.importFile(true)\" >"+karutaStr[LANG]['import_instance']+"</a>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.importZip(true)\" >"+karutaStr[LANG]['import_zip_instance']+"</a>";
		html += "	</div>";
		html += "</div>";
		$("#menu").html(html);
	}
//	UIFactory.PortfolioFolder.loadAndDisplayFolders('portfolio-content1-leftside','list');
	loadAndDisplayPortfolioFolders('portfolio-content1-leftside','portfolio');
	$("#wait-window").hide();

/*
	//--------we load the projects-----------------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project=true",
		success : function(data) {
			nb_projects = parseInt($('portfolios',data).attr('count'))-1;
			UIFactory["Portfolio"].parse(data);
			UIFactory["Portfolio"].displayProjects('portfolio-content1-leftside','list');
			//--------------------------------------
			if (number_of_projects==0 && !USER.admin && !USER.creator) {
				$("#projects-label").hide();
			} else {
				$("#projects-nb").html(number_of_projects);
			}
			//--------------------------------------
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 
			if ($("#project-portfolios").html()=="")
				$("#project-portfolios").hide();
			$("#wait-window").hide();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active=1&project=true: "+textStatus);
			$("#wait-window").hide();
		}
	});

	//--------we count how many portfolios are outside projects-----------------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project=false&count=true",
		success : function(data) {
			nb_portfolios = parseInt($('portfolios',data).attr('count'));
			if (nb_portfolios==0)
				$("#portfolios-div").hide();
			else {
				$("#portfolios-nb").html(nb_portfolios);
				if (number_of_projects == 0) {
					$("#see-portfolios").hide();
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/portfolios?active=1&project=false",
						success : function(data) {
							UIFactory["Portfolio"].parse_add(data);
							var nb_visibleportfolios = 0;
							var visibleid = "";
							for (var i=0;i<portfolios_list.length;i++){
								if (portfolios_list[i].visible) {
									nb_visibleportfolios++;
									visibleid = portfolios_list[i].id;
								}
							}
							if (nb_visibleportfolios>0)
								if (USER.admin || USER.creator)
									loadAndDisplayProjectContent('project-portfolios','false','card-admin');
								else
									if (nb_visibleportfolios>9)
										loadAndDisplayProjectContent('project-portfolios','false','list');
									else if (nb_visibleportfolios>1)
										loadAndDisplayProjectContent('card-deck-portfolios','false','card');
									else
										display_main_page(portfolios_byid[visibleid].rootid);
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Server Error GET active: "+textStatus);
						}
					});
				}
			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active=1&project=false: "+textStatus);
			$("#wait-window").hide();
		}
	});
*/
}

//==============================
function fill_search_page(code)
//==============================
{
	searched_portfolios_list = [];
	$("#searched-portfolios-header").hide();
	$("#searched-portfolios-content").hide();
	$("#searched-portfolios-content").html("");
	g_sum_trees = 0;
	$("#wait-window").show();
	$("#menu").html("");
// --- list of users to display name of owner
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/users",
		success : function(data) {
			UIFactory["User"].parse(data);
		}
	});
	//-------------------------------
	$("#project-portfolios").html("");
	$(".row-label").removeClass('active');
	localStorage.setItem('currentDisplayedProjecCode','none');
	//----------------
	var url1 = serverBCK_API+"/portfolios?active=1&search="+code;
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url1,
		code : code,
		success : function(data) {
			var nb = parseInt($('portfolios',data).attr('count'));
			if (nb>0) {
				$("#searched-portfolios-header").show();
				$("#searched-portfolios-content").show();
			}
			UIFactory["Portfolio"].parse_search(data);
			//-------------------------------
			for (var i=0;i<searched_portfolios_list.length;i++){
				var portfolio = searched_portfolios_list[i];
				$("#searched-portfolios-content").append($("<div class='row portfolio-row'   id='portfolio_"+portfolio.id+"'></div>"));
				if (portfolio.visible || (USER.creator && !USER.limited) )
					$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("#portfolio_"+portfolio.id,'list'));
			}
			var archive_href = serverBCK_API+"/portfolios/zip?portfolios=";
			for (var i = 0; i < searched_portfolios_list.length; i++) {
				if (i>0)
					archive_href += ","
				archive_href += searched_portfolios_list[i].id;
			}
			$("#archive-button").attr("href",archive_href);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	//---------------------------------------------------
}

//==============================
function display_list_page()
//==============================
{
	if ($("#list-menu").length) {
		show_list_page();
	} else {
		show_list_page();
		fill_list_page();
	}
}

//==============================
function displaySearch(dest)
//==============================
{
	var html = "";
	html += "<div id='search' class='input-group'>";
	html += "	<input id='search-portfolio-input' class='form-control' value='' placeholder='"+karutaStr[LANG]['search-label']+"'>";
	html += "	<div class='input-group-append'>";
	html +="		<button id='search-button' type='button' onclick='searchPortfolio()' class='btn'><i class='fas fa-search'></i></button>";
	html += "	</div>";
	html += "</div>";
	$("#"+dest).html(html);
	$("#search-portfolio-input").keypress(function(f) {
		var code= (f.keyCode ? f.keyCode : f.which);
		if (code == 13)
			searchPortfolio();
	});
}

//==================================
function searchPortfolio()
//==================================
{
	cleanList();
	var code = $("#search-input").val();
	if (code!="")
		fill_search_page(code);
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
	$("#project-portfolios").hide();
	$("#searched-portfolios-header").hide();
	$("#searched-portfolios-content").hide();
	$(".active").removeClass('active');
}






