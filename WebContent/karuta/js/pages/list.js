//==============================
function getList()
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
		html += "<div id='searched-portfolios-header' style='display:none'>Portfolios";
		if (USER.creator && !USER.limited)  {
			html += "		<a id='archive-button' href='' class='btn' style='float:right'><i class='fas fa-download' ></i></a>";
			html += "		<button id='remove-button' type='button' onclick=\"UIFactory['Portfolio'].removeSearchedPortfolios()\" class='btn' style='float:right'><i class='fas fa-trash'></i></button>";
		}
		html += "</div>";
		html += "<div id='searched-portfolios-content' style='display:none'></div>";
		html += "<div id='searched-bin-portfolios-header' style='display:none'>Poubelle</div>";
		html += "<div id='searched-bin-portfolios-content' style='display:none'></div>";
	//-----------------------------------------------------------
	html += "</div><!--div id='list-rightside'-->";

	html += "<div id='list-leftside'>";
		//--------------------FOLDERS---------------------------------------
//		html += "<h3><span id='folders-label'>"+text0+"</span>&nbsp<span class='folders-nb badge' id='folders-nb'></span>";
//		html +="	<button class='btn list-btn' onclick='UIFactory.Folder.createfolder()'>"+karutaStr[LANG]['create_folder']+"</button>";
//		html += "</h3>";
//		html += "<div id='folders' class='tree portfolio'></div>";
	
	
		//--------------------PROJECTS---------------------------------------
		html += "<h3><span id='projects-label'>"+text1+"</span>&nbsp<span class='projects-nb badge' id='projects-nb'></span>";
		html +="	<button class='btn list-btn' onclick='UIFactory.Portfolio.createProject()'>"+karutaStr[LANG]['create_project']+"</button>";
		html += "</h3>";
		html += "<div id='projects'></div>";
	
		
		//--------------------PORTFOLIOS--------------------------------------
		html += "<h3 id='portfolios-not-in-project'>";
		html += "	<span id='portfolios-label'>"+text2+"</span>&nbsp<span class='portfolios-nb badge' id='portfolios-nb'></span>";
		html += "	<button class='btn list-btn' onclick=\"loadAnddisplayProjectContent('project-portfolios','false');$(window).scrollTop(0);$('.project').removeClass('active');\">"+ karutaStr[LANG]["see"] + "</button>";
		html += "</h3>";
	
		//---------------------BIN-------------------------------------
		if (USER.admin || (USER.creator && !USER.limited) ) {
			var text2 = karutaStr[LANG]['bin'];
			if (USER.admin)
				text2 = karutaStr[LANG]['bin-admin'];
			html += "<h3 id='bin-label'>"+text2+"&nbsp<span class='bin-nb badge' id='bin-nb'></span>";
			html += "<button class='btn list-btn' onclick=\"cleanList();UIFactory.Portfolio.displayBin('project-portfolios','bin');$(window).scrollTop(0);\">"+ karutaStr[LANG]["see-bin"] + "</button>";
			html += "</h3>";
		}
		//-----------------------------------------------------------
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

/*
//==============================
function fill_list_page()
//==============================
{
	setLanguageMenu("fill_list_page()");
	$("#wait-window").show();
	//--------------------------
	$("#search-portfolio-div").html(getSearch()); // we erase code if any
	$("#search-input").keypress(function(f) {
		var code= (f.keyCode ? f.keyCode : f.which);
		if (code == 13)
			searchPortfolio();
	});
	//--------------------------
	var html = "";
	html += "<div id='list-header' class='row'>";
	html += "	<div id='menu' class='col-1'></div>";
	html += "	<div id='search-portfolio-div' class='col-10'>" + getSearch() + "</div>";
	html += "	<div class='col-1'><i class='fas fa-sync-alt' onclick='fill_list_page()' id='refresh' class='fas fa-sync-alt' data-title='"+karutaStr[LANG]["button-refresh"]+"' data-toggle='tooltip' data-placement='bottom'></i></div>";
	html += "</div>";
	html += "<div id='list'>"+getList()+"</div>";
	$("#list-container").html(html);
	//---------------------------------------------
	if (USER.admin || USER.creator ){
		// --- list of users to display name of owner
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/users",
			success : function(data) {
				UIFactory["User"].parse(data);
			}
		});
		//-------- menu -------------------------------------
		html  = "<div class='dropdown'>";
		html += "	<button id='list-menu' class='btn dropdown-toggle' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded='false'>&nbsp;Menu</button>";
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
	
	//--------------------FOLDERS-------------------------
	loadFolder("folders","0");
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/folders?active=1",
		success : function(data) {
			var nb_folders = parseInt($('folders',data).attr('count'))-1;
			UIFactory["Folder"].parse(data);
			UIFactory["Folder"].displayAll('folders','list');
			if ($("#folder-portfolios").html()=="")
				$("#folder-portfolios").hide();
			$("#wait-window").hide();
		},
		error : function(jqxhr,textStatus) {
//			alertHTML("Server Error GET folders?active=1: "+textStatus);
			$("#wait-window").hide();
		}
	});

	var url1 =  serverBCK_API+"/portfolios?active=1&count=true";
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url1,
		success : function(data) {
			g_nb_trees = parseInt($('portfolios',data).attr('count'));
			//---------------------------------------------------
			if (g_nb_trees==null || g_nb_trees<100) {
				//--------we load all the portfolios-----------------------
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/portfolios?active=1",
					success : function(data) {
						UIFactory["Portfolio"].parse(data);
						UIFactory["Portfolio"].displayAll('portfolios','list');
						if ($("#content-portfolios-not-in-project").html()=="" && $("#portfolios-nb").html()=="")
							$("#portfolios-div").hide();
						if ($("#project-portfolios").html()=="")
							$("#project-portfolios").hide();
						$("#wait-window").hide();
					},
					error : function(jqxhr,textStatus) {
						alertHTML("Server Error GET active=1: "+textStatus);
					}
				});
				//---------------------------------------------------
			} else {
				//--------we load the projects-----------------------
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/portfolios?active=1&project=true",
					success : function(data) {
						var nb_projects = parseInt($('portfolios',data).attr('count'))-1;
						UIFactory["Portfolio"].parse(data);
						UIFactory["Portfolio"].displayAll('projects','list');
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
						var nb_portfolios = parseInt($('portfolios',data).attr('count'));
						if (nb_portfolios==0)
							$("#portfolios-div").hide();
						else
							$("#portfolios-nb").html(nb_portfolios);
					},
					error : function(jqxhr,textStatus) {
						alertHTML("Server Error GET active=1&project=false: "+textStatus);
						$("#wait-window").hide();
					}
				});
			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active-count: "+textStatus);
			$("#wait-window").hide();
		}
	});
	
	//------------------------ BIN --------------------------------
	if (USER.admin || (USER.creator && !USER.limited) ) {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/portfolios?active=false",
			success : function(data) {
				var nb_portfolios = parseInt($('portfolios',data).attr('count'));
				if (nb_portfolios==0)
					$("#bin-label").hide();
				else
					$("#bin-nb").html(nb_portfolios);
				var destid = $("div[id='bin']");
				UIFactory["Portfolio"].parseBin(data);
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Server Error GET active=false: "+textStatus);
			}
		});
	}

//	$.ajaxSetup({async: true});
}
*/
//==============================
function fill_list_page()
//==============================
{
	setLanguageMenu("fill_list_page()");
	$("#wait-window").show();
	//--------------------------
	$("#search-portfolio-div").html(getSearch()); // we erase code if any
	$("#search-input").keypress(function(f) {
		var code= (f.keyCode ? f.keyCode : f.which);
		if (code == 13)
			searchPortfolio();
	});
	//--------------------------
	var html = "";
	html += "<div id='list-header' class='row'>";
	html += "	<div id='menu' class='col-1'></div>";
	html += "	<div id='search-portfolio-div' class='col-10'>" + getSearch() + "</div>";
	html += "	<div class='col-1'><i class='fas fa-sync-alt' onclick='fill_list_page()' id='refresh' class='fas fa-sync-alt' data-title='"+karutaStr[LANG]["button-refresh"]+"' data-toggle='tooltip' data-placement='bottom'></i></div>";
	html += "</div>";
	html += "<div id='list'>"+getList()+"</div>";
	$("#list-container").html(html);
	//---------------------------------------------
	if (USER.admin || USER.creator ){
		// --- list of users to display name of owner
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/users",
			success : function(data) {
				UIFactory["User"].parse(data);
			}
		});
		//-------- menu -------------------------------------
		html  = "<div class='dropdown'>";
		html += "	<button id='list-menu' class='btn dropdown-toggle' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded='false'>&nbsp;Menu</button>";
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
	
	//--------we load the projects-----------------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project=true",
		success : function(data) {
			var nb_projects = parseInt($('portfolios',data).attr('count'))-1;
			UIFactory["Portfolio"].parse(data);
			UIFactory["Portfolio"].displayAll('projects','list');
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
			var nb_portfolios = parseInt($('portfolios',data).attr('count'));
			if (nb_portfolios==0)
				$("#portfolios-div").hide();
			else
				$("#portfolios-nb").html(nb_portfolios);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active=1&project=false: "+textStatus);
			$("#wait-window").hide();
		}
	});

	
	//------------------------ BIN --------------------------------
	if (USER.admin || (USER.creator && !USER.limited) ) {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/portfolios?active=false",
			success : function(data) {
				var nb_portfolios = parseInt($('portfolios',data).attr('count'));
				if (nb_portfolios==0)
					$("#bin-label").hide();
				else
					$("#bin-nb").html(nb_portfolios);
				var destid = $("div[id='bin']");
				UIFactory["Portfolio"].parseBin(data);
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Server Error GET active=false: "+textStatus);
			}
		});
	}

//	$.ajaxSetup({async: true});
}

//==============================
function fill_search_page(code)
//==============================
{
	searched_bin_portfolios_list = [];
	searched_portfolios_list = [];
	$("#searched-portfolios-header").hide();
	$("#searched-bin-portfolios-header").hide();
	$("#searched-portfolios-content").hide();
	$("#searched-bin-portfolios-content").hide();
	$("#searched-portfolios-content").html("");
	$("#searched-bin-portfolios-content").html("");
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
				if (!portfolio.notvisible || (USER.creator && !USER.limited) )
					$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("#portfolio_"+portfolio.id,'list'));
			}
			var archive_href = serverBCK_API+"/portfolios/zip?portfolios=";
			for (var i = 0; i < searched_portfolios_list.length; i++) {
				if (i>0)
					archive_href += ","
				archive_href += searched_portfolios_list[i].id;
			}
			$("#archive-button").attr("href",archive_href);
			//-------------------------------
			if (USER.admin || (USER.creator && !USER.limited) ) {
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/portfolios?active=false&search="+code,
					success : function(data) {
						var nb = parseInt($('portfolios',data).attr('count'));
						if (nb>0) {
							$("#searched-bin-portfolios-header").show();
							$("#searched-bin-portfolios-content").show();
						}
						UIFactory["Portfolio"].parse_search(data,'bin');
						//-------------------------------

						for (var i=0;i<searched_bin_portfolios_list.length;i++){
							var portfolio = searched_bin_portfolios_list[i];
							$("#searched-bin-portfolios-content").append($("<div class='row portfolio-row'   id='portfolio_"+portfolio.id+"'></div>"));
							if (!portfolio.notvisible || (USER.creator && !USER.limited) )
								$("#portfolio_"+portfolio.id).html(portfolio.getPortfolioView("#portfolio_"+portfolio.id,'bin'));
						}
						$("#wait-window").hide();
					},
					error : function(jqxhr,textStatus) {
						alertHTML("Server Error GET bin: "+textStatus);
						$("#wait-window").hide();
					}
				});
			} else
				$("#wait-window").hide();
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
function loadAndDisplayProjectPortfolios(code)
//==============================
{
	$("#wait-window").show();
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project="+code,
		success : function(data) {
			UIFactory["Portfolio"].parse_add(data);
			UIFactory["Portfolio"].displayAll('portfolios','list');
			$("#wait-window").hide();
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
}

//==============================
function loadProjectPortfolios(portfoliocode,nb,destid,type,langcode)
//==============================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project="+portfoliocode,
		success : function(data) {
			UIFactory["Portfolio"].parse_add(data);
			UIFactory["Portfolio"].displayTree(nb,destid,type,langcode,portfoliocode);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
}

//==============================
function loadProjectContent(dest,portfoliocode)
//==============================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project="+portfoliocode,
		success : function(data) {
			UIFactory["Portfolio"].parse_add(data);
			UIFactory["Portfolio"].displayProjectContent(dest,portfoliocode);
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
}

//==============================
function countProjectPortfolios(uuid)
//==============================
{
	var portfoliocode = $(portfolios_byid[uuid].code_node).text()+ ".";
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project="+portfoliocode+"&count=true",
		uuid: uuid,
		success : function(data) {
			var nb = parseInt($('portfolios',data).attr('count'));
			$("#number_of_projects_portfolios_"+this.uuid).html(nb);
		}
	});
}

//==============================
function getSearch()
//==============================
{
	var html = "";
	html += "<div id='search' class='input-group'>";
	html += "	<input id='search-input' class='form-control' value='' placeholder='"+karutaStr[LANG]['search-label']+"'>";
	html += "	<div class='input-group-append'>";
	html +="		<button id='search-button' type='button' onclick='searchPortfolio()' class='btn'><i class='fas fa-search'></i></button>";
	html += "	</div>";
	html += "</div>";
	return html;
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

//==================================
function toggleProject(uuid) {
//==================================
	if ($("#toggleContent_"+uuid).hasClass("fa-plus")) {
		$("#toggleContent_"+uuid).removeClass("fa-plus");
		$("#toggleContent_"+uuid).addClass("fa-minus");
		if (uuid=="portfolios-not-in-project") {
			if ($("#content-portfolios-not-in-project").html()=="") {
				loadAndDisplayProjectPortfolios("false");
				$("#content-"+uuid).show();
			} else {
				$("#content-"+uuid).show();
				displayProject[uuid] = 'open';
			}
		} else {
			if ($("#content-"+uuid).html()=="" || (portfolios_byid[uuid]!= undefined && $(portfolios_byid[uuid].code_node).text()=='karuta') )
				loadAndDisplayProjectPortfolios($("#content-"+uuid).attr("code"));
			else {
				$("#content-"+uuid).show();
				$("#export-"+uuid).show();
				$("#remove-"+uuid).show();
				displayProject[uuid] = 'open';
			}
			localStorage.setItem('dp'+uuid,'open');
		}
	} else {
		$("#toggleContent_"+uuid).removeClass("fa-minus")
		$("#toggleContent_"+uuid).addClass("fa-plus")
		$("#content-"+uuid).hide();
		$("#export-"+uuid).hide();
		$("#remove-"+uuid).hide();
		displayProject[uuid] = 'closed';
		if (uuid!="portfolios-not-in-project")
			localStorage.setItem('dp'+uuid,'closed');
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
	$("#project-portfolios").hide();
	$("#searched-portfolios-header").hide();
	$("#searched-portfolios-content").hide();
	$("#searched-bin-portfolios-header").hide();
	$("#searched-bin-portfolios-content").hide();
	$(".row-label").removeClass('active');
}






