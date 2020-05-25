

//==============================
function show_main_page(rootid,role)
//==============================
{
	hideAllPages();

	setLanguageMenu("fill_main_page()");
	$("#refresh").attr("onclick","fill_main_page()");
	$("body").removeClass();
	$("body").addClass("portfolio-container")
	$("#portfolio-container").html("");
	$("#portfolio-container").attr('role',g_userroles[0]);
	$("#main-portfolio").show();
	$("#refresh").hide();
}

//==============================
function fill_main_page(rootid,role)
//==============================
{
	setLanguageMenu("fill_main_page()");
	$("#wait-window").modal('show');
	g_dashboard_models = {};
	g_report_models = {};
	g_Get_Resource_caches = {};
	var html = "";
	$("#portfolio-container").html(html);
	g_welcome_add = false;
	if (rootid!=null){
		var parentid = $($(UICom.structure.ui[rootid].node).parent()).attr('id');
		if ($($(UICom.structure.ui[rootid].node).parent())) {
			g_portfolioid = parentid;
		} else {
			rootid = g_portfolio_rootid;
		}
	} else {
		rootid = g_portfolio_rootid;
	}
	//-------------------------------------------
	userrole = role;
	if (userrole=='undefined')
		userrole = "";
	if (!USER.admin) {
		$.ajax({ // get group-role for the user
			Accept: "application/xml",
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/credential/group/" + g_portfolioid,
			success : function(data) {
				var usergroups = $("group",data);
				for (var i=0;i<usergroups.length;i++) {
					g_userroles[i+1] = $("role",usergroups[i]).text();
				}
				g_userroles[0] = g_userroles[1]; // g_userroles[0] played role by designer
				if (g_userroles[1]=='designer')
					g_designerrole = true;
				if (g_designerrole) {
					g_visible = localStorage.getItem('metadata');
					toggleMetadata(g_visible);
				}
			}
		});
	} else {
		g_userroles[0] = g_userroles[1] ='designer';
		g_designerrole = true;
		g_visible = localStorage.getItem('metadata');
		toggleMetadata(g_visible);
	}
	var url = serverBCK_API+"/portfolios/portfolio/" + g_portfolioid + "?resources=true";
	$.ajaxSetup({async: true});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			UICom.roles = {};
			g_portfolio_current = data;
			g_portfolio_rootid = $("asmRoot",data).attr("id");
			UICom.structure['ui'][g_portfolio_rootid].loaded = true;
			var root_semantictag = $("metadata",$("asmRoot",data)).attr('semantictag');
			$("body").addClass(root_semantictag);
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
			// --------CSS Text----------- for backward compatibility
			var csstext = $("metadata-wad[csstext]",data).attr('csstext');
			$("#csstext").remove();
			if (csstext!=undefined && csstext!=''){
				$("<style id='csstext'>"+csstext+"</style>").appendTo('head');
			}
			// --------------------------
			UICom.parseStructure(data,true);
			for (role in UICom.roles)
				g_roles[g_roles.length] = {'code':'','libelle':role};
			//-------------------------------------------------
			var config_unit = $("asmUnit:has(metadata[semantictag*='configuration-unit'])",data);
			if (config_unit.length==0) // for backward compatibility
				setCSSportfolioOLD(data);
			else
				setCSSportfolio(config_unit);
			setVariables(data);
			// --------------------------
			if (g_display_type=="standard" || g_display_type=="raw") {
				if (USER.creator)
					g_edit = true;
				else
					g_edit = false;
			} else if (g_display_type=="model" || g_display_type=="translate") {
				g_edit = true;
			}
			$("#sub-bar").html(UIFactory["Portfolio"].getNavBar(g_display_type,LANGCODE,g_edit,g_portfolioid));
			//-------------------------------------------------
			UIFactory.Portfolio.displayPortfolio('portfolio-container',g_display_type,LANGCODE,g_edit);
			// --------------------------
			if (g_bar_type.indexOf('horizontal')>-1) {
				$("#toggleSideBar").hide();
			}
			// --------------------------
			$("#standard-search-text-input").keypress(function(f) {
				var code= (f.keyCode ? f.keyCode : f.which);
				if (code == 13)
					UIFactory.Portfolio.search('standard');
			});
			// --------------------------
			g_display_sidebar = (localStorage.getItem('sidebar-'+g_portfolioid) == 'hidden') ? false:true;
			if (!g_display_sidebar) {
				$("#sidebar").hide();
				g_display_sidebar = false;
				$("#contenu").removeClass().addClass('col-md-12').addClass('col-sm-12');
			}
			//---------------------------
			if (g_encrypted)
				loadLanguages(function() {g_rc4key = window.prompt(karutaStr[LANG]['get_rc4key']);});
			//---------------------------
			$("#wait-window").modal('hide');
			//---------------------------
			if (root_semantictag.indexOf('karuta-batch')>-1){
				g_userroles[0] = 'batcher';
				USER.admin = false;
				$("#userrole").html('batcher');
			}
			if (root_semantictag.indexOf('karuta-report')>-1){
				g_userroles[0] = 'reporter';
				USER.admin = false;
				$("#userrole").html('reporter');
			}
			//---------------------------
			var welcomes = $("asmUnit:has(metadata[semantictag*='WELCOME'])",data);
			if (welcomes.length==0) // for backward compatibility
				welcomes = $("asmUnit:has(metadata[semantictag*='welcome-unit'])",data);
			if (welcomes.length>0){
				var welcomeid = $(welcomes[0]).attr('id');
				var node = UICom.structure['ui'][welcomeid];
				var display = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
				if (display=='Y')
					$("#sidebar_"+welcomeid).click();
				else {
					var root = $("asmRoot",data);
					var rootid = $(root[0]).attr('id');
					$("#sidebar_"+rootid).click();
				}
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
	$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 
	$(document).click(function(e) {
		if (!$(e.target).is('.tooltip')) {
			$('.tooltip').hide();
		}
	});
	//=====================================================
}

//==============================
function display_main_page(rootid,role)
//==============================
{
	$("#sub-bar").show();
	$("#welcome-bar").hide();
	fill_main_page(rootid,role);
	show_main_page(rootid,role);		
}

