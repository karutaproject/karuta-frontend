//==============================
function getList()
//==============================
{
	var html = "";
	var text1 = karutaStr[LANG]['projects'];
	var text2 = karutaStr[LANG]['portfolios-not-in-project'];
	if (USER.admin) {
		text1 = karutaStr[LANG]['projects-admin'];
		text2 = karutaStr[LANG]['portfolios-admin'];
	}
	html += "<h3><span id='projects-label'>"+text1+"</span>&nbsp<span class='projects-nb badge' id='projects-nb'></span></h3>";
	html += "<div id='folder-portfolios'></div>";
	html += "<div id='gutter'></div>";
	html += "<div id='projects'></div>";
	html += "<div id='portfolios-div'>";
	html += "<h3 id='portfolios-not-in-project'>";
	html += "	<span id='portfolios-label'>"+text2+"</span>&nbsp<span class='portfolios-nb badge' id='portfolios-nb'></span>";
	html += "	<button class='btn ' onclick=\"loadAndDisplayFolderContent('folder-portfolios','false');\">"+ karutaStr[LANG]["see"] + "</button>";
	html += "</h3>";
	if (USER.admin || (USER.creator && !USER.limited) ) {
		var text2 = karutaStr[LANG]['bin'];
		if (USER.admin)
			text2 = karutaStr[LANG]['bin-admin'];
		html += "<h3 id='bin-label'>"+text2+"&nbsp";
//		html += "<button class='btn ' onclick=\"confirmDelPortfolios_EmptyBin()\">"+ karutaStr[LANG]["empty-bin"] + "</button>";
		html += "<button class='btn ' onclick=\"UIFactory.Portfolio.displayBin('folder-portfolios','bin');$(window).scrollTop(0);\">"+ karutaStr[LANG]["see-bin"] + "</button>";
		html += "</h3>";
//		html += "<div  id='bin'></div>";
	}
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
	html += "<div id='list'></div>";
	$("#list-container").html(html);
	//---------------------------------------------
//	$.ajaxSetup({async: false});
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
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory['Portfolio'].createProject()\" >"+karutaStr[LANG]['create_project']+"</a>";
		html += "		<div class='dropdown-divider'></div>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.importFile()\" >"+karutaStr[LANG]['import_portfolio']+"</a>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.importZip()\" >"+karutaStr[LANG]['import_zip']+"</a>";
		html += "		<div class='dropdown-divider'></div>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.importFile(true)\" >"+karutaStr[LANG]['import_instance']+"</a>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory.Portfolio.importZip(true)\" >"+karutaStr[LANG]['import_zip_instance']+"</a>";
		html += "	</div>";
		html += "</div>";
		$("#menu").html(html);
	}
	//---------------------------------------------
	var url1 =  serverBCK_API+"/portfolios?active=1&count=true";
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url1,
		success : function(data) {
			g_nb_trees = parseInt($('portfolios',data).attr('count'));
			//---------------------------------------------------
			if (g_nb_trees==0) {
				var html = "<h3 id='portfolios-label'>"+karutaStr[LANG]['no-portfolio']+"</h3>";
				var text2 = karutaStr[LANG]['bin'];
				if (USER.admin)
					text2 = karutaStr[LANG]['bin-admin'];
				html += "<h3 id='bin-label'>"+text2;
				html += "&nbsp<button class='btn ' onclick=\"confirmDelPortfolios_EmptyBin()\">";
				html += karutaStr[LANG]["empty-bin"];
				html += "</button>";
				html += "</h3>";
				html += "<div  id='bin'>";
				html += "</div>";
				$("#list").html(html);
				if (USER.admin || (USER.creator && !USER.limited) ) {
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/portfolios?active=false",
						success : function(data) {
							var destid = $("div[id='bin']");
							UIFactory["Portfolio"].parseBin(data);
//							UIFactory["Portfolio"].displayBin('bin','bin');
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Server Error GET active=false: "+textStatus);
						}
					});
				}
				$("#wait-window").hide();
			} else {
				//---------------------------------------------------
				if (g_nb_trees==null || g_nb_trees<100) {
					//--------we load all the portfolios-----------------------
					var url0 = serverBCK_API+"/portfolios?active=1";
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : url0,
						success : function(data) {
							UIFactory["Portfolio"].parse(data);
							$("#list").html(getList());
							UIFactory["Portfolio"].displayAll('portfolios','list');
							if (USER.admin || (USER.creator && !USER.limited) ) {
								$.ajax({
									type : "GET",
									dataType : "xml",
									url : serverBCK_API+"/portfolios?active=false",
									success : function(data) {
										var destid = $("div[id='bin']");
										UIFactory["Portfolio"].parseBin(data);
//										UIFactory["Portfolio"].displayBin('bin','bin');
									},
									error : function(jqxhr,textStatus) {
										alertHTML("Server Error GET active=false: "+textStatus);
									}
								});
							}
							if ($("#content-portfolios-not-in-project").html()=="" && $("#portfolios-nb").html()=="")
								$("#portfolios-div").hide();
							if ($("#folder-portfolios").html()=="")
								$("#folder-portfolios").hide();
							$("#wait-window").hide();
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Server Error GET active=1: "+textStatus);
						}
					});
					//---------------------------------------------------
				} else {
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/portfolios?active=1&project=true",
						success : function(data) {
							var nb_projects = parseInt($('portfolios',data).attr('count'))-1;
							UIFactory["Portfolio"].parse(data);
							$("#list").html(getList());
							UIFactory["Portfolio"].displayAll('portfolios','list');
							if (USER.admin || (USER.creator && !USER.limited) ) {
								$.ajax({
									type : "GET",
									dataType : "xml",
									url : serverBCK_API+"/portfolios?active=false",
									success : function(data) {
										var destid = $("div[id='bin']");
										UIFactory["Portfolio"].parseBin(data);
//										UIFactory["Portfolio"].displayBin('bin','bin');
									},
									error : function(jqxhr,textStatus) {
										alertHTML("Server Error GET active=false: "+textStatus);
									}
								});
							}
							if ($("#folder-portfolios").html()=="")
								$("#folder-portfolios").hide();
							$("#wait-window").hide();
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Server Error GET active=1&project=true: "+textStatus);
							$("#wait-window").hide();
						}
					});
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
			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active-count: "+textStatus);
			$("#wait-window").hide();
		}
	});
//	$.ajaxSetup({async: true});
}

//==============================
function fill_search_page(code)
//==============================
{
//	$.ajaxSetup({async: true});
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
	//----------------
	var url1 = serverBCK_API+"/portfolios?active=1&search="+code;
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url1,
		code : code,
		success : function(data) {
			var nb = parseInt($('portfolios',data).attr('count'));
			UIFactory["Portfolio"].parse(data);
			$("#list").html(getList());
			UIFactory["Portfolio"].displayAll('portfolios','list');
			if ($("#projects").html()=="") {
				$("#projects-label").hide();
				$("#portfolios-label").html(karutaStr[LANG]['portfolios-without-project']);
			}
			if (this.code!=""){
				showArchiveSearch();
				if ($("#content-portfolios-not-in-project").html()=="")
					$("#portfolios-div").hide();
				if ($("#folder-portfolios").html()=="")
					$("#folder-portfolios").hide();
			}
			else {
				hideArchiveSearch();
				$("#portfolios-div").hide();				
			}
			if (USER.admin || (USER.creator && !USER.limited) ) {
				$.ajax({
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/portfolios?active=false&search="+code,
					success : function(data) {
						var destid = $("div[id='bin']");
						UIFactory["Portfolio"].parseBin(data);
						UIFactory["Portfolio"].displayBin('bin','bin');
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
function loadFolderContent(dest,portfoliocode)
//==============================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project="+portfoliocode,
		success : function(data) {
			UIFactory["Portfolio"].parse_add(data);
			UIFactory["Portfolio"].displayFolderContent(dest,portfoliocode);
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
	html += "	<input id='search-input' class='form-control' value='' placeholder='"+karutaStr[LANG]['search-label']+"' onchange='javascript:hideArchiveSearch()'>";
	html += "	<div class='input-group-append'>";
	html +="		<button id='search-button' type='button' onclick='searchPortfolio()' class='btn'><i class='fas fa-search'></i></button>";
	if (USER.creator && !USER.limited)  {
		html += "		<a id='archive-button' href='' class='btn' disabled='true'><i style='margin-top:4px' class='fas fa-download'></i></a>";
		html += "		<button id='remove-button' type='button' disabled='true' onclick=\"UIFactory['Portfolio'].removePortfolios()\" class='btn'><i class='fas fa-trash'></i></button>";
	}
	html += "	</div>";
	html += "</div>";
	return html;
}

//==================================
function searchPortfolio()
//==================================
{
	var code = $("#search-input").val();
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