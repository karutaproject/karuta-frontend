

//==============================
function show_main_page(portfolioid,role)
//==============================
{
	$("body").removeClass();
	$("body").addClass("main-page")
	$("#main-page").html("");
	$("#main-page").show();
	$("#main-list").hide();
	$("#main-portfoliosgroup").hide();
	$("#main-user").hide();
	$("#main-usersgroup").hide();
	$("#main-exec-batch").hide();
	$("#main-exec-report").hide();
//	changeCss("a.navbar-icon .glyphicon", "color:"+navbar_icon_color+";");
	$("#refresh").attr("onclick","fill_main_page()");
	$("#refresh").show();
}

//==============================
function fill_main_page(portfolioid,role)
//==============================
{
	var html = "";
	$("#main-page").html(html);
	g_welcome_add = false;
	if (portfolioid!=null)
		g_portfolioid = portfolioid;
	//-------------------------------------------
	userrole = role;
	if (userrole=='undefined')
		userrole = "";
	if (!USER.admin) {
		$.ajax({ // get group-role for the user
			Accept: "application/xml",
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/credential/group/" + g_portfolioid,
			success : function(data) {
				var usergroups = $("group",data);
				for (var i=0;i<usergroups.length;i++) {
					g_userroles[i+1] = $("role",usergroups[i]).text();
				}
				g_userroles[0] = g_userroles[1]; // g_userroles[0] played role by designer
				if (g_userroles[1]=='designer')
					g_designerrole = true;
				if (g_designerrole) {
					g_visible = Cookies.get('metadata');
					toggleMetadata(g_visible);
				}
			}
		});
	} else {
		g_userroles[0] = g_userroles[1] ='designer';
		g_designerrole = true;
		g_visible = Cookies.get('metadata');
		toggleMetadata(g_visible);
	}
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfolios/portfolio/" + g_portfolioid + "?resources=true",
		success : function(data) {
			UICom.roles = {};
			g_portfolio_current = data;
			g_portfolio_rootid = $("asmRoot",data).attr("id");
			// --------Display Type------------------
			g_display_type = $("metadata[display-type]",data).attr('display-type');
			if (g_display_type=="" || g_display_type==null || g_display_type==undefined)
				g_display_type = 'standard';
			// --------CSS File------------------
			var cssfile = $("metadata[cssfile]",data).attr('cssfile');
			if (cssfile!=undefined && cssfile!=''){
				if (cssfile.indexOf(".css")<0)
					cssfile += ".css";
				$('<link/>', { rel: 'stylesheet', type: 'text/css', href: '../../application/css/'+cssfile}).appendTo('head');
			}
			// --------------------------
			UICom.parseStructure(data);
			UIFactory["Portfolio"].parse(data);
			if ($("asmUnit:has(metadata[semantictag*='welcome-unit'])",data).length==0 && $("asmRoot:has(metadata[semantictag*='karuta-model'])",data).length>0) {
				g_welcome_add = true;
			}
			// ================================= CSS Portfolio ========================
			if ($("asmContext:has(metadata[semantictag='portfolio-navbar'])",data).length>0) {
				var portfolio_navbar_id = $("asmContext:has(metadata[semantictag='portfolio-navbar'])",data).attr("id");
				var portfolio_navbar_color = UICom.structure["ui"][portfolio_navbar_id].resource.getValue();
				changeCss("#sub-bar .navbar-default", "background-color:"+portfolio_navbar_color+";border-color:"+portfolio_navbar_color+";");
				changeCss("#sub-bar .dropdown-menu", "background-color:"+portfolio_navbar_color+";border-color:"+portfolio_navbar_color+";");
				changeCss("#sub-bar .open > a", "background-color:"+portfolio_navbar_color+";border-color:"+portfolio_navbar_color+";");
			}
			//--------------
			var portfolio_navbar_link_color = "#ffffff"; // --- default value
			if ($("asmContext:has(metadata[semantictag='portfolio-navbar-link'])",data).length>0) {
				var portfolio_navbar_link_id = $("asmContext:has(metadata[semantictag='portfolio-navbar-link'])",data).attr("id");
				portfolio_navbar_link_color = UICom.structure["ui"][portfolio_navbar_link_id].resource.getValue();
			}
			changeCss("#sub-bar a", "color:"+portfolio_navbar_link_color+";");
			//--------------------------------
			var portfolio_sidebar_color = "#000000"; // --- default value
			if ($("asmContext:has(metadata[semantictag='portfolio-sidebar'])",data).length>0) {
				var portfolio_sidebar_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar'])",data).attr("id");
				portfolio_sidebar_color = UICom.structure["ui"][portfolio_sidebar_id].resource.getValue();
			}
			changeCss("#sidebar", "background-color:"+portfolio_sidebar_color+";height:100%;");
			//--------------------------------
			var portfolio_sidebar_link_color = "#ffffff"; // --- default value
			if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-link'])",data).length>0) {
				var portfolio_sidebar_link_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-link'])",data).attr("id");
				portfolio_sidebar_link_color = UICom.structure["ui"][portfolio_sidebar_link_id].resource.getValue();
			}
			changeCss(".sidebar-link", "color:"+portfolio_sidebar_link_color+";padding-right:9px;");
			changeCss(".sidebar-link a", "color:"+portfolio_sidebar_link_color+";");
			//--------------------------------
			var portfolio_sidebar_link_selected_color = "#09bbd9"; // --- default value
			if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-link-selected'])",data).length>0) {
				var portfolio_sidebar_link_selected_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-link-selected'])",data).attr("id");
				portfolio_sidebar_link_selected_color = UICom.structure["ui"][portfolio_sidebar_link_selected_id].resource.getValue();								
			}
			changeCss(".selected a", "color:"+portfolio_sidebar_link_selected_color+";font-weight:bold;");
			changeCss(".sidebar-link a:hover", "color:"+portfolio_sidebar_link_selected_color+";");
			changeCss("a.sidebar-link:hover", "color:"+portfolio_sidebar_link_selected_color+";");
			//--------------------------------
			if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-selected-border'])",data).length>0) {
				var portfolio_sidebar_selected_border_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-selected-border'])",data).attr("id");
				portfolio_sidebar_selected_border_color = UICom.structure["ui"][portfolio_sidebar_selected_border_id].resource.getValue();
				changeCss("#sidebar .selected", "border-right:4px solid "+portfolio_sidebar_selected_border_color+";padding-right:5px;");
			}
			//--------------------------------
			var portfolio_sidebar_separator_color = "#08a4bf"; // --- default value
			if ($("asmContext:has(metadata[semantictag='portfolio-sidebar-separator'])",data).length>0) {
				var portfolio_sidebar_separator_id = $("asmContext:has(metadata[semantictag='portfolio-sidebar-separator'])",data).attr("id");
				portfolio_sidebar_separator_color = UICom.structure["ui"][portfolio_sidebar_separator_id].resource.getValue();								
			}
			changeCss(".sidebar-item", "border-bottom:1px solid "+portfolio_sidebar_separator_color+";padding-left:15px;padding-top:8px;padding-bottom:8px;");
			changeCss(".sidebar-item .sidebar-item", "border-bottom:0px solid "+portfolio_sidebar_separator_color+";padding-top:5px;padding-bottom:5px;");
			//--------------------------------
			var welcome_title_color = "#ffffff"; // --- default value
			if ($("asmContext:has(metadata[semantictag='welcome-title-color'])",data).length>0) {
				var welcome_title_color_id = $("asmContext:has(metadata[semantictag='welcome-title-color'])",data).attr("id");
				welcome_title_color = UICom.structure["ui"][welcome_title_color_id].resource.getValue();
			}
			changeCss(".page-welcome .welcome-title", "color:"+welcome_title_color+";text-align:center;width:100%;font-size:30px;");
			//--------------------------------
			var welcome_line_color = "#b9da00"; // --- default value
			if ($("asmContext:has(metadata[semantictag='welcome-line-color'])",data).length>0) {
				var welcome_line_color_id = $("asmContext:has(metadata[semantictag='welcome-line-color'])",data).attr("id");
				welcome_line_color = UICom.structure["ui"][welcome_line_color_id].resource.getValue();
			}
			changeCss(".welcome-line", "border-bottom:1px solid "+welcome_line_color+";width:25%;margin-left:auto;margin-right:auto;");
			//--------------------------------
			var page_title_background_color = "#e8e8e8"; // --- default value
			if ($("asmContext:has(metadata[semantictag='page-title-background-color'])",data).length>0) {
				var page_title_background_color_id = $("asmContext:has(metadata[semantictag='page-title-background-color'])",data).attr("id");
				page_title_background_color = UICom.structure["ui"][page_title_background_color_id].resource.getValue();
			}
			changeCss(".welcome-line,.row-node-asmRoot,.row-node-asmStructure,.row-node-asmUnit", "background-color:"+page_title_background_color+";");
			changeCss(".row-node", "border-top:1px solid "+page_title_background_color+";");
			//--------------------------------
			var page_title_subline_color = "#09bbd9"; // --- default value
			if ($("asmContext:has(metadata[semantictag='page-title-subline-color'])",data).length>0) {
				var page_title_subline_color_id = $("asmContext:has(metadata[semantictag='page-title-subline-color'])",data).attr("id");
				page_title_subline_color = UICom.structure["ui"][page_title_subline_color_id].resource.getValue();
			}
			changeCss(".row-node-asmRoot .title-subline,.row-node-asmStructure .title-subline,.row-node-asmUnit .title-subline", "border-bottom:1px solid "+page_title_subline_color+";");
			//--------------------------------
			var portfolio_buttons_color = "#09bbd9"; // --- default value
			if ($("asmContext:has(metadata[semantictag='portfolio-buttons-color'])",data).length>0) {
				var portfolio_buttons_color_id = $("asmContext:has(metadata[semantictag='portfolio-buttons-color'])",data).attr("id");
				portfolio_buttons_color = UICom.structure["ui"][portfolio_buttons_color_id].resource.getValue();
			}
			changeCss(".asmnode .dropdown-button, .button-border", "border:1px solid "+portfolio_buttons_color+";");
			changeCss(".collapsible .glyphicon,.btn-group .button", "color:"+portfolio_buttons_color+";");
			//--------------------------------
			var portfolio_buttons_background_color = "#d8d8d8"; // --- default value
			if ($("asmContext:has(metadata[semantictag='portfolio-buttons-background-color'])",data).length>0) {
				var portfolio_buttons_background_color_id = $("asmContext:has(metadata[semantictag='portfolio-buttons-background-color'])",data).attr("id");
				portfolio_buttons_background_color = UICom.structure["ui"][portfolio_buttons_background_color_id].resource.getValue();
			}
			changeCss(".row-resource td.buttons,.csv-button,.pdf-button", "border:1px solid "+portfolio_buttons_background_color+";");
			changeCss(".row-resource td.buttons,.csv-button,.pdf-button", "background:"+portfolio_buttons_background_color+";");
			//--------------------------------
			var portfolio_link_color = "#337ab7"; // --- default value
			if ($("asmContext:has(metadata[semantictag='portfolio-link-color'])",data).length>0) {
				var portfolio_link_color_id = $("asmContext:has(metadata[semantictag='portfolio-link-color'])",data).attr("id");
				portfolio_link_color = UICom.structure["ui"][portfolio_link_color_id].resource.getValue();
			}
			changeCss("a", "color:"+portfolio_link_color+";");
			//--------------------------------
			var portfolio_section_title_background_color = "#f2f2f2"; // --- default value
			if ($("asmContext:has(metadata[semantictag='portfolio-section-title-background-color'])",data).length>0) {
				var portfolio_section_title_background_color_id = $("asmContext:has(metadata[semantictag='portfolio-section-title-background-color'])",data).attr("id");
				portfolio_section_title_background_color = UICom.structure["ui"][portfolio_section_title_background_color_id].resource.getValue();
			}
			changeCss(".row-node-asmUnitStructure", "background:"+portfolio_section_title_background_color+";");
			// ========================================================================
			if (g_display_type=="header")
				loadLanguages(function(data) {UIFactory["Portfolio"].displayPortfolio('main-page','header',LANGCODE,g_edit);});
			else
				UIFactory["Portfolio"].displayPortfolio('main-page',g_display_type,LANGCODE,g_edit);
			// --------------------------
			$('a[data-toggle=tooltip]').tooltip({html:true});
			// --------------------------
			if (g_display_type=="standard" || g_display_type=="model" || g_display_type=="translate") {
				$("#navigation-bar").html(getNavBar('main',g_portfolioid,g_edit));
				$("#sub-bar").html(UIFactory["Portfolio"].getNavBar(g_display_type,LANGCODE,g_edit,g_portfolioid));
			}
			if (g_display_type=="header")
				$("#navigation_bar").html(getNavBar('main',g_portfolioid,g_edit));
			//---------------------------
			if (g_encrypted)
				loadLanguages(function() {g_rc4key = window.prompt(karutaStr[LANG]['get_rc4key']);});
				
			//---------------------------
			$("#wait-window").modal('hide');
			//---------------------------
			var welcomes = $("asmUnit:has(metadata[semantictag*='welcome-unit'])",data);
			if (welcomes.length>0){
				var welcomeid = $(welcomes[0]).attr('id');
				$("#sidebar_"+welcomeid).click();
			} else {
				var root = $("asmRoot",data);
				var rootid = $(root[0]).attr('id');
				$("#sidebar_"+rootid).click();
			}
			//---------------------------
			fillEditBoxBody();

//								UIFactory.Node.reloadUnit(UICom.rootid); // for IE9
		}
	});
	//=====================================================
	$(document).click(function(e) {
	    if (!$(e.target).is('.icon-info-sign, .popover-title, .popover-content')) {
	        $('.popover').hide();
	    }
	});
	$(".free-toolbar").css('visibility')=='hidden';
}

//==============================
function display_main_page(portfolioid,role)
//==============================
{
	fill_main_page(portfolioid,role);
	show_main_page(portfolioid,role);		
}

