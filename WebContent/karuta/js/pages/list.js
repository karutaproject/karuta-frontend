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
	html += "<div id='projects'></div>";
	html += "<div id='portfolios-div'>";
	html += "<h3 id='portfolios-not-in-project'><span id='portfolios-label'>"+text2+"</span>&nbsp<span class='portfolios-nb badge' id='portfolios-nb'></span></h3>";
	html += "	<div class='row portfolios-not-in-project'>";
	if (USER.creator && !USER.limited) {
		displayProject['portfolios-not-in-project'] = localStorage.getItem('dpportfolios-not-in-project');
		if (displayProject['portfolios-not-in-project']!=undefined && displayProject['portfolios-not-in-project']=='open')
			html += "		<div onclick=\"javascript:toggleProject('portfolios-not-in-project')\"><span id='toggleContent_portfolios-not-in-project' class='button fas fa-minus'></span></div>";
		else
			html += "		<div onclick=\"javascript:toggleProject('portfolios-not-in-project')\"><span id='toggleContent_portfolios-not-in-project' class='button fas fa-plus'></span></div>";
		if (displayProject['portfolios-not-in-project']!=undefined && displayProject['portfolios-not-in-project']=='open')
			html += "	<div class='project-content' id='content-portfolios-not-in-project' style='display:block'><div id='portfolios'></div></div>";
		else
			html += "	<div class='project-content' id='content-portfolios-not-in-project' style='display:none'><div id='portfolios'></div></div>";
	} else {
		html += "	<div class='project-content' id='content-portfolios-not-in-project' style='display:block'><div id='portfolios'></div></div>";		
	}
	html += "</div>";  // <div class='row portfolios-not-in-project'>
	html += "</div>"; // <div id='portfolios-div'>
	if (USER.admin || (USER.creator && !USER.limited) ) {
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
	$("#welcome-title").html(g_configVar['list-welcome-title']);
	$("#welcome-title").attr('style', g_configVar['list-welcome-title-css']);
	$("#welcome-title").css('color',g_configVar['list-welcome-title-color']);
	$("#welcome-baseline").html(g_configVar['list-welcome-subtitle']);
	$("#welcome-baseline").attr('style', g_configVar['list-welcome-subtitle-css']);
	$("#welcome-baseline").css('color',g_configVar['list-welcome-subtitle-color']);
	$("#welcome-line").css('border-bottom',"1px solid "+g_configVar['list-welcome-subline-color']);
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
	$('[data-tooltip="true"]').tooltip();
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
	html += "	<div class='col-1'><i class='fas fa-sync-alt' onclick='fill_list_page()' id='refresh' class='fas fa-sync-alt' data-title='"+karutaStr[LANG]["button-reload"]+"' data-tooltip='true' data-placement='bottom'></i></div>";
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
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory['Portfolio'].importFile()\" >"+karutaStr[LANG]['import_portfolio']+"</a>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory['Portfolio'].importZip()\" >"+karutaStr[LANG]['import_zip']+"</a>";
		html += "		<div class='dropdown-divider'></div>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory['Portfolio'].importFile(true)\" >"+karutaStr[LANG]['import_instance']+"</a>";
		html += "		<a class='dropdown-item' onclick=\"javascript:UIFactory['Portfolio'].importZip(true)\" >"+karutaStr[LANG]['import_zip_instance']+"</a>";
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
							UIFactory["Portfolio"].displayBin('bin','bin');
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
										UIFactory["Portfolio"].displayBin('bin','bin');
									},
									error : function(jqxhr,textStatus) {
										alertHTML("Server Error GET active=false: "+textStatus);
									}
								});
							}
							if ($("#portfolios").html()=="" && $("#portfolios-nb").html()=="")
								$("#portfolios-div").hide();
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
							$("#wait-window").hide();
							if (USER.admin || (USER.creator && !USER.limited) ) {
								$.ajax({
									type : "GET",
									dataType : "xml",
									url : serverBCK_API+"/portfolios?active=false",
									success : function(data) {
										var destid = $("div[id='bin']");
										UIFactory["Portfolio"].parseBin(data);
										UIFactory["Portfolio"].displayBin('bin','bin');
									},
									error : function(jqxhr,textStatus) {
										alertHTML("Server Error GET active=false: "+textStatus);
									}
								});
							}
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
	var html = "";
	html += "<div class='projects'>";
	html += "	<div id='menu'></div>";
	html += "	<div id='list'></div>";
	html += "</div>";
	$("#list-container").html(html);
	// --- list of users to display name of owner
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/users",
		success : function(data) {
			UIFactory["User"].parse(data);
		}
	});
	//---------------------------------------------
	html  = "<div class='dropdown dropdown-button'>";
	html += "<span id='list-menu' class='button' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded='false'><span class='glyphicon glyphicon-menu-hamburger'></span>&nbsp;Menu</span>";
	html += "<ul class='dropdown-menu' role='menu' aria-labelledby='list-menu'>";
	html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].createProject()\" >"+karutaStr[LANG]['create_project']+"</a></li>";
	html += "<hr>";
	html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].importFile()\" >"+karutaStr[LANG]['import_portfolio']+"</a></li>";
	html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].importZip()\" >"+karutaStr[LANG]['import_zip']+"</a></li>";
	html += "<hr>";
	html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].importFile(true)\" >"+karutaStr[LANG]['import_instance']+"</a></li>";
	html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].importZip(true)\" >"+karutaStr[LANG]['import_zip_instance']+"</a></li>";
	html += "</ul>";
	html += "</div>";
	if (USER.admin || (USER.creator && !USER.limited) ){
		$("#menu").html(html);
	}
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
				if ($("#portfolios").html()=="")
					$("#portfolios-div").hide();
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
					},
					error : function(jqxhr,textStatus) {
						alertHTML("Server Error GET bin: "+textStatus);
					}
				});
			}
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
			if ($("#portfolios").html()=="") {
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
//			Cookies.set('dp'+uuid,'open',{ expires: 60 });
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
//			Cookies.set('dp'+uuid,'closed',{ expires: 60 });
	}
}

//==============================
function applyListConfiguration()
//==============================
{
	$('body').css("background-image", g_configVar['list-welcome-image']);
	$('#list-container').css("background-color", g_configVar['list-background-color']);
	changeCss(".dropdown-menu,#active,.projects-nb,#usersgroups .usersgroup-users,.usersgroup,.project,#bin,.portfolios-not-in-project,.portfoliosgroup", "background-color:"+g_configVar['list-element-background-color']);
	changeCss(".dropdown-menu a.dropdown-item:hover", "color:"+g_configVar['list-element-background-color']);
	changeCss(".warning-list", "color:"+g_configVar['list-element-background-color']);
	changeCss(".portfolio-row:hover,#main-user .item:hover", "background-color:"+g_configVar['list-element-background-color-complement']);
	changeCss("#active,.portfolio-row, .row-label", "color:"+g_configVar['list-element-text-color']);
	changeCss(".dropdown-menu a.dropdown-item:hover", "background-color:"+g_configVar['list-element-text-color']);
	changeCss("h3,#list-container #refresh,.projects-nb,.number_of_projects_portfolios", "color:"+g_configVar['list-title-color']);
	changeCss("#list-container .btn,#main-portfoliosgroup .btn,#main-user .btn,#main-usersgroup .btn,#main-exec-batch .btn,#main-exec-report .btn", "background-color:"+g_configVar['list-button-background-color']);
	changeCss("#list-container .btn", "color:"+g_configVar['list-button-text-color']);
	changeCss(".number_of_projects_portfolios", "background-color:"+g_configVar['list-element-background-color-complement']);
	changeCss("", "color:"+g_configVar['list-title-color']);
}