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
			html += "		<div onclick=\"javascript:toggleProject('portfolios-not-in-project')\"><span id='toggleContent_portfolios-not-in-project' class='button glyphicon glyphicon-minus'></span></div>";
		else
			html += "		<div onclick=\"javascript:toggleProject('portfolios-not-in-project')\"><span id='toggleContent_portfolios-not-in-project' class='button glyphicon glyphicon-plus'></span></div>";
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
		html += "&nbsp<button class='btn btn-xs' onclick=\"confirmDelPortfolios_EmptyBin()\">";
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
	html += "			<div class='welcome-line'></div>";
	html += "			<div id='welcome-baseline' class='welcome-baseline'>";
	html += "				OPEN SOURCE PORTFOLIO";
	html += "			</div><!-- id='welcome-baseline' -->";
	html += "		</div><!--  class='welcome-subbox' -->";
	html += "	</div><!--  class='welcome-box' -->";
	html += "</div>";
	return html;
}

//==============================
function setWelcomeTitles()
//==============================
{
	$("#welcome-title").html(welcome4[LANG]);
	$("#welcome-baseline").html(welcome5[LANG]);
}

//==============================
function show_list_page()
//==============================
{
	hideAllPages();
	$("body").removeClass();
	$("body").addClass("list-page")
	$("#sub-bar").html(getListSubBar());
	setWelcomeTitles();
	setLanguageMenu("fill_list_page()");
	$("#refresh").attr("onclick","fill_list_page()");
	$("#refresh").show();
//	if (USER.creator)
		$("#search-portfolio-div").show();
	$("#main-list").show();
	$('[data-tooltip="true"]').tooltip();
}

//==============================
function fill_list_page()
//==============================
{
	setLanguageMenu("fill_list_page()");
	$("#wait-window").show();
	$("#search-portfolio-div").html(getSearch()); // we erase code if any
	$("#search-input").keypress(function(f) {
		var code= (f.keyCode ? f.keyCode : f.which);
		if (code == 13)
			searchPortfolio();
	});
	var html = "";
	html += "<div class='projects'>";
	html += "	<div id='menu'></div>";
	html += "	<div id='list'></div>";
	html += "</div>";
	$("#main-list").html(html);
//	$.ajaxSetup({async: false});
	// --- list of users to display name of owner
	if (USER.admin || USER.creator){
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/users",
			success : function(data) {
				UIFactory["User"].parse(data);
			}
		});
	}
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
	var url1 =  serverBCK_API+"/portfolios?active=1&count=true";
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url1,
		success : function(data) {
			g_nb_trees = parseInt($('portfolios',data).attr('count'));
			//---------------------------------------------------
			if (g_nb_trees==0) {
				if (g_execbatch!=undefined && g_execbatch){
					$("#search-portfolio-div").hide();
					$("#refresh").hide();
					displayExecBatchButton();
				} else {
					var html = "<h3 id='portfolios-label'>"+karutaStr[LANG]['no-portfolio']+"</h3>";
					var text2 = karutaStr[LANG]['bin'];
					if (USER.admin)
						text2 = karutaStr[LANG]['bin-admin'];
					html += "<h3 id='bin-label'>"+text2;
					html += "&nbsp<button class='btn btn-xs' onclick=\"confirmDelPortfolios_EmptyBin()\">";
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
				}
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
							if (!USER.admin && !USER.creator && portfolios_list.length==1) {
								var uuid = portfolios_list[0].rootid;
								display_main_page(uuid);
							}
//							if ($("#portfolios").html()=="" && $("#portfolios-nb").html()=="")
//								$("#portfolios-div").hide();
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
	$("#main-list").html(html);
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
		async:false,
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
		async:false,
		nb : nb,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios?active=1&project="+portfoliocode,
		success : function(data) {
			UIFactory["Portfolio"].parse_add(data);
			UIFactory["Portfolio"].displayTree(this.nb,destid,type,langcode,portfoliocode);
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
	if ($("#toggleContent_"+uuid).hasClass("glyphicon-plus")) {
		$("#toggleContent_"+uuid).removeClass("glyphicon-plus");
		$("#toggleContent_"+uuid).addClass("glyphicon-minus");
		if (uuid=="portfolios-not-in-project") {
			if ($("#portfolios").html()=="") {
				loadAndDisplayProjectPortfolios("false");
				$("#content-"+uuid).show();
			} else {
				$("#content-"+uuid).show();
				displayProject[uuid] = 'open';
			}
		} else {
			if ($("#content-"+uuid).html()=="" || (portfolios_byid[uuid]!= undefined && $(portfolios_byid[uuid].code_node).text()=='karuta') ){
				$("#content-"+uuid).show();
				$("#export-"+uuid).show();
				$("#remove-"+uuid).show();
				displayProject[uuid] = 'open';
				localStorage.setItem('dp'+uuid,'open');
				loadAndDisplayProjectPortfolios($("#content-"+uuid).attr("code"));
			} else {
				$("#content-"+uuid).show();
				$("#export-"+uuid).show();
				$("#remove-"+uuid).show();
				displayProject[uuid] = 'open';
				localStorage.setItem('dp'+uuid,'open');
			}
		}
	} else {
		$("#toggleContent_"+uuid).removeClass("glyphicon-minus")
		$("#toggleContent_"+uuid).addClass("glyphicon-plus")
		$("#content-"+uuid).hide();
		$("#export-"+uuid).hide();
		$("#remove-"+uuid).hide();
		displayProject[uuid] = 'closed';
		if (uuid!="portfolios-not-in-project")
			localStorage.setItem('dp'+uuid,'closed');
//			Cookies.set('dp'+uuid,'closed',{ expires: 60 });
	}
}

