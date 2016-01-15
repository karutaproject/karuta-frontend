//==============================
function getList()
//==============================
{
	var html = "";
	var text1 = karutaStr[LANG]['projects'];
	var text2 = karutaStr[LANG]['portfolios'];
	if (USER.admin)
		text1 = karutaStr[LANG]['portfolios-admin'];
	html += "<h3 id='projects-label'>"+text1+"</h3>";
	html += "<div id='projects'></div>";
	html += "<h3 id='portfolios-label'>"+text2+"</h3>";
	html += "<div id='portfolios'></div>";
	if (USER.admin || USER.creator) {
		var text2 = karutaStr[LANG]['bin'];
		if (USER.admin)
			text2 = karutaStr[LANG]['bin-admin'];
		html += "<h3 id='bin-label'>"+text2+"</h3>";
		html += "<div  id='bin'>";
	}
	html += "</div>";
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
	html += "			<div style='color:#18b8d6;text-align:center;' id='welcome-baseline' class='welcome-baseline'>";
	html += "				OPEN SOURCE PORTFOLIO";
	html += "			</div><!-- id='welcome-baseline' -->";
	html += "		</div><!--  class='welcome-subbox' -->";
	html += "	</div><!--  class='welcome-box' -->";
	html += "</div>";
	return html;
}

//==============================
function getListMainContainerHtml()
//==============================
{
	var html = "";
	html += "<div id='contenu' class='container-fluid page-list'>";
	html += " <div id='welcome-image'>";
	html += "	<div class='welcome-box'>";
	html += "		<div class='welcome-subbox'>";
	html += "			<div id='welcome-title' class='welcome-title'></div>";
	html += "			<div class='welcome-line'></div>";
	html += "			<div style='color:#18b8d6;text-align:center;' id='welcome-baseline' class='welcome-baseline'></div><!-- id='welcome-baseline' -->";
	html += "		</div><!--  class='welcome-subbox' -->";
	html += "	</div><!--  class='welcome-box' -->";
	html += " </div>";
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
	
	changeCss("body", "background-color:#e0006d;");
	changeCss("#main-container .row .row", "background-color:initial;");
	changeCss("a.navbar-icon .glyphicon", "color:"+navbar_icon_color+";");
	$("#sub-bar").html(getListSubBar());
	setWelcomeTitles();
	var navbar_html = getNavBar('list',null);
	$("#navigation-bar").html(navbar_html);
	$("#refresh").attr("onclick","display_list_page()");
	$("#refresh").show();
	$("#main-page").hide();
	$("#main-user").hide();
	$("#main-list").show();
}

//==============================
function display_list_page()
//==============================
{
	
	changeCss("body", "background-color:#e0006d;");
	changeCss("#main-container .row .row", "background-color:initial;");
	changeCss("a.navbar-icon .glyphicon", "color:"+navbar_icon_color+";");
	$("#sub-bar").html(getListSubBar());
	var navbar_html = getNavBar('list',null);
	$("#navigation-bar").html(navbar_html);
	$("#refresh").attr("onclick","display_list_page()");
	$("#refresh").show();
	$("#main-page").hide();
	$("#main-user").hide();
	$("#main-list").show();
	//-------------------------------------------
	var html = "";
	html += "<div class='projects'>";
	html += "	<div id='menu'></div>";
	html += "	<div id='list'></div>";
	html += "</div>";
	$("#main-list").html(html);
	$("#list").html(getList());
	// --- list of users to display name of owner
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/users",
		success : function(data) {
			UIFactory["User"].parse(data);
		}
	});
	//---------------------------------------------
	html  = "<div class='dropdown dropdown-button'>";
	html += "<span id='list-menu' class='button' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded='false'><span class='glyphicon glyphicon-menu-hamburger'></span>&nbsp;Menu</span>";
	html += "<ul class='dropdown-menu' role='menu' aria-labelledby='list-menu'>";
	html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].createProject()\" href='#'>"+karutaStr[LANG]['create_project']+"</a></li>";
	html += "<hr>";
	html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].importFile(true)\" href='#'>"+karutaStr[LANG]['import_instance']+"</a></li>";
	html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].importFile()\" href='#'>"+karutaStr[LANG]['import_portfolio']+"</a></li>";
	html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].importZip(true)\" href='#'>"+karutaStr[LANG]['import_zip_instance']+"</a></li>";
	html += "<li><a onclick=\"javascript:UIFactory['Portfolio'].importZip()\" href='#'>"+karutaStr[LANG]['import_zip']+"</a></li>";
	html += "<hr>";
	html += "<li><a onclick=\"share_karuta_documentation()\" href='#'>"+karutaStr[LANG]['demo-documentation']+"</a></li>";
	if (demo) {
		html += "<hr>";
		html += "<li><a onclick=\"create_karuta_demo_aacu('"+USER.username_node.text()+"')\" href='#'>"+karutaStr[LANG]['demo-aacu']+"</a></li>";
		html += "<li><a onclick=\"create_karuta_demo_video('"+USER.username_node.text()+"')\" href='#'>"+karutaStr[LANG]['demo-video']+"</a></li>";
		html += "<li><a onclick=\"create_karuta_demo_ecommerce('"+USER.username_node.text()+"')\" href='#'>"+karutaStr[LANG]['demo-ecommerce']+"</a></li>";
	}
	html += "</ul>";
	html += "</div>";
	if (USER.admin || USER.creator){
		$("#menu").html(html);
		if (demo) {
			$("#start").html(listinfo[LANG]);
			$("#start").attr('style','visibility:visible');
		}
	}
	//----------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfolios?active=1",
		success : function(data) {
			var destid = $("div[id='portfolios']");
			UIFactory["Portfolio"].parse(data);
			UIFactory["Portfolio"].displayAll('portfolios','list');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Server Error GET active: "+textStatus);
		}
	});
	//----------------
	if (USER.admin || USER.creator) {
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/portfolios?active=false",
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
}