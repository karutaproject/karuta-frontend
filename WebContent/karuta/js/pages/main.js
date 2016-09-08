

//==============================
function show_main_page(portfolioid,role)
//==============================
{
	$("body").removeClass();
	$("body").addClass("main-page")
	$("#main-page").html("");
	$("#main-page").show();
	$("#main-list").hide();
	$("#search-div").hide();
	$("#main-portfoliosgroup").hide();
	$("#main-user").hide();
	$("#main-usersgroup").hide();
	$("#main-exec-batch").hide();
	$("#main-exec-report").hide();
//	changeCss("a.navbar-icon .glyphicon", "color:"+navbar_icon_color+";");
	$("#refresh").hide();
}

//==============================
function fill_main_page(portfolioid,role)
//==============================
{
	g_dashboard_models = {};
	g_Get_Resource_caches = {};
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
	$.ajaxSetup({async: true});
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
			UICom.parseStructure(data,true);
			if ($("asmUnit:has(metadata[semantictag*='welcome-unit'])",data).length==0 && $("asmRoot:has(metadata[semantictag*='karuta-model'])",data).length>0) {
				g_welcome_add = true;
			}
			setCSSportfolio(data);
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
	$.ajaxSetup({async: false});
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

