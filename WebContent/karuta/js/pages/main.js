

//==============================
function show_main_page()
//==============================
{
	hideAllPages();

	setLanguageMenu("fill_main_page()");
	$("#refresh").attr("onclick","fill_main_page()");
	$("body").removeClass();
	$("body").addClass("portfolio-container")
//	$("#portfolio-container").html("");
	$("#portfolio-container").attr('role',g_userroles[0]);
	$("#main-portfolio").show();
	$("#refresh").hide();
}

//==============================
function fill_main_page(portfolioid,userrole)
//==============================
{
	setLanguageMenu("fill_main_page()");
	g_importednodestack = [];
//	$("#wait-window").modal('show');
	g_dashboard_models = {};
	g_report_models = {};
	g_Get_Resource_caches = {};
	g_Get_Portfolio_caches = {};
	var html = "";
	$("#portfolio-container").html(html);
	g_welcome_add = false;
	//-------------------------------------------
	if (portfolioid!=null)
		g_portfolioid = portfolioid;
	//-------------------------------------------
	if (userrole==undefined)
		userrole = g_userrole;
	if (userrole==undefined)
		userrole = g_userroles[0];
	if (userrole==undefined)
		userrole = "";
	//-------------------------------------------
	USER.admin = USER.admin_original; // reset if role playing when reload
	//-------------------------------------------
	var url = serverBCK_API+"/portfolios/portfolio/" + g_portfolioid + "?resources=true&userrole="+userrole;
	$.ajax({
		async:true,
		type : "GET",
		dataType : "xml",
		url : url,
		userrole : userrole,
		success : function(data) {
			UICom.roles = {};
			g_userroles = [];
			g_portfolio_current = data;
			g_portfolio_rootid = $("asmRoot",data).attr("id");
			//-------------------------
			var portfoliocode = portfolios_byid[g_portfolioid].code_node.text();
			if (typeof(rewriteURL) == 'function')
				rewriteURL(portfoliocode);
			//-------------------------
			if (UICom.structure.ui[g_portfolio_rootid]!=undefined)
				UICom.structure.ui[g_portfolio_rootid].loaded = true;
			var root_semantictag = $("metadata",$("asmRoot",data)).attr('semantictag');
			var default_role = "";
			if ($("metadata-wad",$("asmRoot",data)).attr('defaultrole')!= undefined)
				default_role = $("metadata-wad",$("asmRoot",data)).attr('defaultrole').trim();
			$("body").addClass(root_semantictag);
			// -----------ROLE---------------
			var role = $("asmRoot",data).attr("role");
			if (role!="" || (userrole!=undefined && userrole!="" && userrole!="designer") ) {
				if (role!="")
					g_userroles[0] = g_userroles[1] = role;
				else
					g_userroles[0] = g_userroles[1] = userrole;
			} else {
				g_userroles[0] = g_userroles[1] ='designer';
				g_designerrole = true;
				g_visible = localStorage.getItem('metadata');
				toggleMetadata(g_visible);
			}
			// --------------------------
			UICom.parseStructure(data,true);
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
			//-------------------------------------------------
			for (role in UICom.roles)
				g_roles[g_roles.length] = {'code':'','libelle':role};
			//-------------------------------------------------
			var config_unit = $("asmUnit:has(metadata[semantictag*='configuration-unit'])",data);
			if (config_unit.length==0) { // for backward compatibility and portfolios without config
//				if (g_configDefaultVar.length>0)
					resetConfigurationPortfolioVariable();
//				setCSSportfolio("");
				setCSSportfolioOLD(data);
			} else {
				setConfigurationPortfolioVariable(data,true);
				setCSSportfolio(config_unit);
			}
			setVariables(data);
			// --------------------------
			if (g_display_type=="standard" || g_display_type=="raw") {
				if (USER.creator)
					g_edit = true;
				else {
					var editmode = $("metadata[editmode]",data).attr('editmode');
					if (editmode=="" || editmode==null || editmode==undefined)
						g_edit = false;
					else
						g_edit = (editmode=='Y');
					}
			} else if (g_display_type=="model" || g_display_type=="translate") {
				g_edit = true;
			}
			$("#sub-bar").html(UIFactory.Portfolio.getNavBar(g_display_type,LANGCODE,g_edit,g_portfolioid));
			// -----how to edit message---------------------
			if (!g_edit && !USER.creator && (localStorage.getItem('display-edition-'+g_portfolioid)==undefined || localStorage.getItem('display-edition-'+g_portfolioid)!='no') && USER.username.indexOf("karuser")<0) {
				var message = karutaStr[LANG]["button-edition"];
				alertHTML(message);
			}
			//-------------- DEFAULT_ROLE -------------
			$("#portfolio-container").attr('role',g_userroles[0]);
			if (default_role!="" && g_userroles[1]=="designer"){
				g_userroles[0] = default_role;
				USER.admin = false;
				$("#userrole").html(default_role);
				$("#portfolio-container").attr('role',default_role);
			}
			//-------------------------------------------------
			UIFactory.Portfolio.displayPortfolio('portfolio-container',g_display_type,LANGCODE,g_edit);
			// --------------------------
			try {
				specificEnterDisplayPortfolio();
			} catch(e) {
				// do nothing
			}
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
			var welcomes = $("*:has(>metadata[semantictag*='WELCOME'])",data);
			if (welcomes.length==0) // for backward compatibility
				welcomes = $("asmUnit:has(metadata[semantictag*='welcome-unit'])",data);
			if (welcomes.length>0){
				var welcomeid = $(welcomes[0]).attr('id');
				var node = UICom.structure.ui[welcomeid];
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
			//=====================================================
			$('[data-toggle=tooltip]').tooltip({html: true, trigger: 'hover'}); 
			$(document).click(function(e) {
				if (!$(e.target).is('.tooltip')) {
					$('.tooltip').hide();
				}
			});
			//=====================================================
//			$("#wait-window").modal('hide');
			//---------------------------
		},
		error : function(jqxhr,textStatus) {
			if (jqxhr.status=="403")
				alertHTML("Sorry. A problem occurs : no right to see this portfolio (" + g_portfolioid + ")");
			
			else {
				alertDisconnected();
				alertHTML("<h4>Error in fill_main_page</h4><h5>responseText</h5><p>"+jqxhr.responseText+"</p><h5>textStatus</h5><p>"+textStatus+"<h5>status</h5><p>"+jqxhr.status);
				}
			$("#wait-window").modal('hide');
		}
	});
}

//==============================
function chooseRole(portfolioid)
//==============================
{
	$('#edit-window').modal('hide')
	g_userrole = $("input:checked",$("#edit-window-body")).val();
	fill_main_page(portfolioid,g_userrole);
	show_main_page();
}

//==============================
function display_main_page(portfolioid,playedrole)
//==============================
{
	g_userroles = [];
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/rolerightsgroups/all/users?portfolio=" + portfolioid,
		success : function(data) {
			const rrgs = $("rrg",data);
			for (let i=0;i<rrgs.length;i++) {
				const label = $("label",rrgs[i]).text();
				const users = $("user",rrgs[i]);
				for (let j=0;j<users.length;j++) {
					if ($(users[j]).attr("id")==USER.id && label!=USER.username)
						g_userroles.push(label);
				}
			}
		}
	});
	$.ajax({
		async:false,
		type : "GET",
		dataType : "xml",
		url :  serverBCK_API+"/portfolios/portfolio/" + portfolioid,
		success : function(data) {
			if ($("metadata-wad",$("asmRoot",data)).attr('defaultrole')!= undefined)
				playedrole = $("metadata-wad",$("asmRoot",data)).attr('defaultrole').trim();
		}
	});
	if (g_userroles.length>1){
		if (playedrole==undefined) {
			let html = "";
			for (let i=0; i<g_userroles.length; i++){
				html += "<div class='"+g_userroles[i]+"'><input type='radio' name='radio_group' value='"+g_userroles[i]+"'> "+g_userroles[i]+"</div>";
			}
			const js1 = "javascript:$('#edit-window').modal('hide')";
			const js2 = "chooseRole('"+portfolioid+"')";
			const footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Enter']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
			$("#edit-window-footer").html(footer);
			$("#edit-window-footer").html(footer);
			$("#edit-window-title").html(karutaStr[LANG]['select_role']);
			$("#edit-window-body").html(html);
			$("#edit-window-body-node").html("");
			$("#edit-window-type").html("");
			$("#edit-window-body-metadata").html("");
			$("#edit-window-body-metadata-epm").html("");
			$('#edit-window').modal('show');
		} else {
			fill_main_page(portfolioid,playedrole);
			show_main_page();
		}
	} else {
		userrole = g_userroles[0];
		fill_main_page(portfolioid,userrole);
		show_main_page();
	}
	$("#sub-bar").show();
	$("#welcome-bar").hide();
}
