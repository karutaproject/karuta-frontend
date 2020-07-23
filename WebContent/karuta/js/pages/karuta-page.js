karutaStr['fr'] = new Array();
karutaStr['en'] = new Array();
var plugin_resources = new Array();
var g_configDefaultVar = {};
//==============================
function initKarutaPage()
//==============================
{
	//--------------------------
	var html = "";
	html += "<div id='main-body'>";
	html += "	<div id='navigation-bar'></div>";
	html += "	<div id='welcome-bar'></div>";
	html += "	<div id='main-container'></div>";
	html += "</div>";
	html += "<div id='wait-window' class='modal' style='height:100px;'>";
	html += "	<div id='wait-window-body' class='modal-body'></div>";
	html += "	<div id='wait-spin'></div>";
	html += "</div>";
	html += "<div id='post-form' style='display:none'></div>";
	html += "<div id='print-window' style='display:none'></div>";
	html += "<div id='export-html' style='display:none'></div>";
	html += "<div id='export-window' style='height:100px;display:none'>";
	html += "	<div id='export-window-body'></div>";
	html += "	<div id='export-spin'></div>";
	html += "</div>";
	$('body').html(html)
	//--------------------------
	$('body').append(EditBox());
	$('body').append(DeleteBox());
	$('body').append(savedBox());
	$('body').append(alertBox());
	$('body').append(messageBox());
	$('body').append(imageBox());
	$('body').append(LangueBox());
	$('body').append(previewBox());
	
	//--------------------------
	var spinner1 = new Spinner().spin(document.getElementById('wait-spin'));
	var spinner2 = new Spinner().spin(document.getElementById('export-spin'));
}

//==============================
function displayKarutaPage()
//==============================
{
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/credential",
		data: "",
		success : function(data) {
			getLanguage();
			loadLanguages(function() {
//				getLanguage();
			});
			setConfigurationTechVariables(LANGCODE);
			setConfigurationUIVariables(LANGCODE);
			applyKarutaConfiguration();
			USER = new UIFactory["User"]($("user",data));
			//-------------------------------
			if (g_configVar['maintenance-display']=="1" && !USER.admin && !USER.creator)
				window.location="login.htm";
			//-------------------------------
			var html = "";
			html += "<div id='main-list' class='container-fluid'></div>";
			html += "<div id='main-portfolio' class='container-fluid' style='display:none'>";
			html += "	<div id='sub-bar'></div>";
			html += "	<div id='portfolio-container' role='all'></div>";
			html += "</div>";
			html += "<div id='main-portfoliosgroup' class='col-md-12' style='display:none'></div>";
			html += "<div id='main-user' class='container-fluid' style='display:none'></div>";
			html += "<div id='main-usersgroup' class='container-fluid' style='display:none'></div>";
			html += "<div id='main-exec-batch' class='container-fluid' style='display:none'></div>";
			html += "<div id='main-exec-report' class='container-fluid' style='display:none'></div>";
			$("#main-container").html(html);
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK+"/version",
				data: "",
				success : function(data) {		
					karuta_backend_version = $("number",$("#backend",data)).text();
					karuta_backend_date = $("date",$("#backend",data)).text();
					karuta_fileserver_version = $("number",$("#fileserver",data)).text();
					karuta_fileserver_date = $("date",$("#fileserver",data)).text();
					var navbar_html = getNavBar('list',null);
					$("#navigation-bar").html(navbar_html);
					$("a[data-toggle='tooltip']").tooltip({html: true, trigger: 'hover'});

					applyNavbarConfiguration();
				},
				error : function(jqxhr,textStatus) {
					var navbar_html = getNavBar('list',null);
					$("#navigation-bar").html(navbar_html);
					$("a[data-toggle='tooltip']").tooltip({html: true, trigger: 'hover'});
				}
			});
			//-------------------------------
			display_list_page();
			//-------------------------------
		},
		error : function(jqxhr,textStatus) {
			loadLanguages(function() {
				getLanguage();
				alertHTML(karutaStr[LANG]['not-logged']);
				window.location="login.htm?lang="+LANG;
			});
		}
	});
	$.ajaxSetup({async: true});
	$('[data-tooltip="true"]').tooltip({html: true, trigger: 'hover'});
}

//==============================
function showArchiveSearch()
//==============================
{
	var archive_href = serverBCK_API+"/portfolios/zip?portfolios=";
	for (var i = 0; i < portfolios_list.length; i++) {
		if (i>0)
			archive_href += ","
		archive_href += portfolios_list[i].id;
	}
	$("#archive-button").attr("href",archive_href);
	$("#archive-button").attr('disabled',false);
	$("#remove-button").prop('disabled', false);
}

//==============================
function hideArchiveSearch()
//==============================
{
	$("#archive-button").attr("href","");
	$("#archive-button").attr('disabled', true);
	$("#remove-button").prop('disabled', true);
}


//==============================
function increaseFontSize()
//==============================
{
	var root = document.documentElement;
	var coeffsize = root.style.getPropertyValue('--font-size-coeff') * 1.1;	
	root.style.setProperty('--font-size-coeff',coeffsize);
}

//==============================
function decreaseFontSize()
//==============================
{
	var root = document.documentElement;
	var coeffsize = root.style.getPropertyValue('--font-size-coeff') * 0.9;	
	root.style.setProperty('--font-size-coeff',coeffsize);
}

//==============================
function setConfigurationUIVariables(langcode)
//==============================
{
	var url = serverBCK_API+"/portfolios/portfolio/code/karuta.configuration-ui?resources=true";
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			//---------Navigation Bar--------------
			g_configVar['navbar-text-color'] = getText('config-navbar-text-color','Color','text',data,langcode);
			g_configVar['navbar-background-color'] = getText('config-navbar-background-color','Color','text',data,langcode);
			g_configVar['navbar-display-mailto'] = getText('navbar-display-mailto','Get_Resource','value',data);
			g_configVar['navbar-display-language'] = getText('navbar-display-language','Get_Resource','value',data);
			//----------------------
			g_configVar['font-standard'] = getText('config-font-standard','Field','text',data,langcode);
			g_configVar['font-google'] = getText('config-font-google','Field','text',data,langcode);
			g_configVar['font-size-coeff'] = getText('config-font-size-coeff','Field','text',data,langcode);
			//----------------------
			g_configVar['list-welcome-image'] = getBackgroundURL('config-list-welcome-image',data,langcode);
			g_configVar['list-welcome-title-color'] = getText('config-list-welcome-title-color','Color','text',data,langcode);
			g_configVar['list-welcome-title-css'] = getText('config-list-welcome-title-css','Field','text',data,langcode);
			g_configVar['list-welcome-subline-color'] = getText('config-list-welcome-subline-color','Color','text',data,langcode);
			g_configVar['list-welcome-subtitle-color'] = getText('config-list-welcome-subtitle-color','Color','text',data,langcode);
			g_configVar['list-welcome-subtitle-css'] = getText('config-list-welcome-subtitle-css','Field','text',data,langcode);
			g_configVar['list-welcome-box-border-color'] = getText('config-list-welcome-box-border-color','Color','text',data,langcode);
			g_configVar['list-welcome-box-background-color'] = getText('config-list-welcome-box-background-color','Color','text',data,langcode);
			//----------------------
			g_configVar['list-background-color'] = getText('config-list-background-color','Color','text',data,langcode);
			g_configVar['list-element-background-color'] = getText('config-list-element-background-color','Color','text',data,langcode);
			g_configVar['list-element-text-color'] = getText('config-list-element-text-color','Color','text',data,langcode);
			g_configVar['list-element-background-color-complement'] = getText('config-list-element-background-color-complement','Color','text',data,langcode);
			g_configVar['list-title-color'] = getText('config-list-title-color','Color','text',data,langcode);
			g_configVar['list-button-background-color'] = getText('config-list-button-background-color','Color','text',data,langcode);
			g_configVar['list-button-text-color'] = getText('config-list-button-text-color','Color','text',data,langcode);
			g_configVar['list-menu-background-color'] = getText('config-list-menu-background-color','Color','text',data,langcode);
			g_configVar['list-menu-text-color'] = getText('config-list-menu-text-color','Color','text',data,langcode);
			//--------- Portfolios which have not configuration page -------------
			setDefaultConfigurationPortfolioVariable(data);
		}
	});
}

//==============================
function setDefaultConfigurationPortfolioVariable(data,local,langcode)
//==============================
{
	if (langcode==null)
		langcode = LANGCODE;
	var prefix = "";
	if (local==null || !local)
		prefix = "config-";
	//--------- Portfolios -------------
	g_configDefaultVar['portfolio-navbar-background-color'] = getText('config-portfolio-navbar-background-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-navbar-text-color'] = getText('config-portfolio-navbar-text-color','Color','text',data,langcode);
	//----------
	g_configDefaultVar['portfolio-hmenu-logo'] = getImg('config-portfolio-hmenu-logo',data,langcode, false);
	g_configDefaultVar['portfolio-hmenu-logo-style'] = getContentStyle('config-portfolio-hmenu-logo',data);
	g_configDefaultVar['portfolio-sidebar-background-color'] = getText('config-portfolio-sidebar-background-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-sidebar-text-color'] = getText('config-portfolio-sidebar-text-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-sidebar-selected-text-color'] = getText('config-portfolio-sidebar-selected-text-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-sidebar-separator-color'] = getText('config-portfolio-sidebar-separator-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-sidebar-selected-border-color'] = getText('config-portfolio-sidebar-selected-border-color','Color','text',data,langcode);
	//----------
	g_configDefaultVar['page-title-background-color'] = getText('config-page-title-background-color','Color','text',data,langcode);
	g_configDefaultVar['page-title-subline-color'] = getText('config-page-title-subline-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-background-color'] = getText('config-portfolio-background-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-text-color'] = getText('config-portfolio-text-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-buttons-color'] = getText('config-portfolio-buttons-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-buttons-background-color'] = getText('config-portfolio-buttons-background-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-link-color'] = getText('config-portfolio-link-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-resource-border-color'] = getText('config-portfolio-resource-border-color','Color','text',data,langcode);
	//----------
	g_configDefaultVar['portfolio-menu-background-color'] = getText('config-portfolio-menu-background-color','Color','text',data,langcode);
	g_configDefaultVar['portfolio-menu-text-color'] = getText('config-portfolio-menu-text-color','Color','text',data,langcode);
	//-----SVG----
	g_configDefaultVar['svg-web0-color'] = getText('config-svg-web0-color','Color','text',data,langcode);
	g_configDefaultVar['svg-web1-color'] = getText('config-svg-web1-color','Color','text',data,langcode);
	g_configDefaultVar['svg-web2-color'] = getText('config-svg-web2-color','Color','text',data,langcode);
	g_configDefaultVar['svg-web3-color'] = getText('config-svg-web3-color','Color','text',data,langcode);
	g_configDefaultVar['svg-web4-color'] = getText('config-svg-web4-color','Color','text',data,langcode);
	g_configDefaultVar['svg-web5-color'] = getText('config-svg-web5-color','Color','text',data,langcode);
	g_configDefaultVar['svg-web6-color'] = getText('config-svg-web6-color','Color','text',data,langcode);
	g_configDefaultVar['svg-web7-color'] = getText('config-svg-web7-color','Color','text',data,langcode);
	g_configDefaultVar['svg-web8-color'] = getText('config-svg-web8-color','Color','text',data,langcode);
	g_configDefaultVar['svg-web9-color'] = getText('config-svg-web9-color','Color','text',data,langcode);
}

//==============================
function setConfigurationPortfolioVariable(data,local,langcode)
//==============================
{
	if (langcode==null)
		langcode = LANGCODE;
	var prefix = "";
	//--------- Portfolios -------------
	g_configVar['portfolio-navbar-background-color'] = getText('portfolio-navbar-background-color','Color','text',data,langcode);
	g_configVar['portfolio-navbar-text-color'] = getText('portfolio-navbar-text-color','Color','text',data,langcode);
	//----------
	g_configVar['portfolio-hmenu-logo'] = getImg('portfolio-hmenu-logo',data,langcode, false);
	g_configVar['portfolio-hmenu-logo-style'] = getContentStyle('portfolio-hmenu-logo',data);
	g_configVar['portfolio-sidebar-background-color'] = getText('portfolio-sidebar-background-color','Color','text',data,langcode);
	g_configVar['portfolio-sidebar-text-color'] = getText('portfolio-sidebar-text-color','Color','text',data,langcode);
	g_configVar['portfolio-sidebar-selected-text-color'] = getText('portfolio-sidebar-selected-text-color','Color','text',data,langcode);
	g_configVar['portfolio-sidebar-separator-color'] = getText('portfolio-sidebar-separator-color','Color','text',data,langcode);
	g_configVar['portfolio-sidebar-selected-border-color'] = getText('portfolio-sidebar-selected-border-color','Color','text',data,langcode);
	//----------
	g_configVar['page-title-background-color'] = getText('page-title-background-color','Color','text',data,langcode);
	g_configVar['page-title-subline-color'] = getText('page-title-subline-color','Color','text',data,langcode);
	g_configVar['portfolio-background-color'] = getText('portfolio-background-color','Color','text',data,langcode);
	g_configVar['portfolio-text-color'] = getText('portfolio-text-color','Color','text',data,langcode);
	g_configVar['portfolio-buttons-color'] = getText('portfolio-buttons-color','Color','text',data,langcode);
	g_configVar['portfolio-buttons-background-color'] = getText('portfolio-buttons-background-color','Color','text',data,langcode);
	g_configVar['portfolio-link-color'] = getText('portfolio-link-color','Color','text',data,langcode);
	g_configVar['portfolio-resource-border-color'] = getText('portfolio-resource-border-color','Color','text',data,langcode);
	//----------
	g_configVar['portfolio-menu-background-color'] = getText('portfolio-menu-background-color','Color','text',data,langcode);
	g_configVar['portfolio-menu-text-color'] = getText('portfolio-menu-text-color','Color','text',data,langcode);
	//-----SVG----
	g_configVar['svg-web0-color'] = getText('svg-web0-color','Color','text',data,langcode);
	g_configVar['svg-web1-color'] = getText('svg-web1-color','Color','text',data,langcode);
	g_configVar['svg-web2-color'] = getText('svg-web2-color','Color','text',data,langcode);
	g_configVar['svg-web3-color'] = getText('svg-web3-color','Color','text',data,langcode);
	g_configVar['svg-web4-color'] = getText('svg-web4-color','Color','text',data,langcode);
	g_configVar['svg-web5-color'] = getText('svg-web5-color','Color','text',data,langcode);
	g_configVar['svg-web6-color'] = getText('svg-web6-color','Color','text',data,langcode);
	g_configVar['svg-web7-color'] = getText('svg-web7-color','Color','text',data,langcode);
	g_configVar['svg-web8-color'] = getText('svg-web8-color','Color','text',data,langcode);
	g_configVar['svg-web9-color'] = getText('svg-web9-color','Color','text',data,langcode);
}

//==============================
function resetConfigurationPortfolioVariable()
//==============================
{
	for (item in g_configDefaultVar) {
		if (item.indexOf('portfolio-')>-1 ||item.indexOf('svg-')>-1)
			g_configVar[item] = g_configDefaultVar[item];
	}
	/*
	//--------- Portfolios -------------
	g_configVar['portfolio-navbar-background-color'] = g_configVar['portfolio-navbar-background-color']
	g_configVar['portfolio-navbar-text-color'] = g_configVar['portfolio-navbar-text-color']
	//----------
	g_configVar['portfolio-hmenu-logo'] = g_configVar['portfolio-hmenu-logo'];
	g_configVar['portfolio-hmenu-logo-style'] = g_configVar['portfolio-hmenu-logo-style'];
	g_configVar['portfolio-sidebar-background-color'] = g_configVar['portfolio-sidebar-background-color'];
	g_configVar['portfolio-sidebar-text-color'] = g_configVar['portfolio-sidebar-text-color'];
	g_configVar['portfolio-sidebar-selected-text-color'] = g_configVar['portfolio-sidebar-selected-text-color'];
	g_configVar['portfolio-sidebar-separator-color'] = g_configVar['portfolio-sidebar-separator-color'];
	g_configVar['portfolio-sidebar-selected-border-color'] = g_configVar['portfolio-sidebar-selected-border-color'];
	//----------
	g_configVar['page-title-background-color'] = getText('page-title-background-color','Color','text',data,langcode);
	g_configVar['page-title-subline-color'] = getText('page-title-subline-color','Color','text',data,langcode);
	g_configVar['portfolio-background-color'] = getText('portfolio-background-color','Color','text',data,langcode);
	g_configVar['portfolio-text-color'] = getText('portfolio-text-color','Color','text',data,langcode);
	g_configVar['portfolio-buttons-color'] = getText('portfolio-buttons-color','Color','text',data,langcode);
	g_configVar['portfolio-buttons-background-color'] = getText('portfolio-buttons-background-color','Color','text',data,langcode);
	g_configVar['portfolio-link-color'] = getText('portfolio-link-color','Color','text',data,langcode);
	g_configVar['portfolio-resource-border-color'] = getText('portfolio-resource-border-color','Color','text',data,langcode);
	//----------
	g_configVar['portfolio-menu-background-color'] = getText('portfolio-menu-background-color','Color','text',data,langcode);
	g_configVar['portfolio-menu-text-color'] = getText('portfolio-menu-text-color','Color','text',data,langcode);
	//-----SVG----
	g_configVar['svg-web0-color'] = getText('svg-web0-color','Color','text',data,langcode);
	g_configVar['svg-web1-color'] = getText('svg-web1-color','Color','text',data,langcode);
	g_configVar['svg-web2-color'] = getText('svg-web2-color','Color','text',data,langcode);
	g_configVar['svg-web3-color'] = getText('svg-web3-color','Color','text',data,langcode);
	g_configVar['svg-web4-color'] = getText('svg-web4-color','Color','text',data,langcode);
	g_configVar['svg-web5-color'] = getText('svg-web5-color','Color','text',data,langcode);
	g_configVar['svg-web6-color'] = getText('svg-web6-color','Color','text',data,langcode);
	g_configVar['svg-web7-color'] = getText('svg-web7-color','Color','text',data,langcode);
	g_configVar['svg-web8-color'] = getText('svg-web8-color','Color','text',data,langcode);
	g_configVar['svg-web9-color'] = getText('svg-web9-color','Color','text',data,langcode);
	*/
}

//==============================
function setConfigurationTechVariables(langcode)
//==============================
{
	var url = serverBCK_API+"/portfolios/portfolio/code/karuta.configuration-tech?resources=true";
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			//-----------------------
			var language_nodes = $("metadata[semantictag='portfolio-language']",data);
			for (i=0;i<language_nodes.length;i++){
				languages[i] = $("code",$("asmResource[xsi_type='Get_Resource']",$(language_nodes[i]).parent())).text();
			}
			//----------------------
			g_configVar['maxfilesizeupload'] = getText('config-maxfilesizeupload','Field','text',data,langcode);
			g_configVar['maxuserlist'] = getText('config-maxuserlist','Field','text',data,langcode);
			g_configVar['navbar-brand-logo'] = getImg('config-navbar-brand-logo',data,langcode);
			g_configVar['navbar-brand-logo-style'] = getContentStyle('config-navbar-brand-logo',data);
			g_configVar['list-welcome-title'] = getText('config-list-welcome-title','Field','text',data,langcode);
			g_configVar['list-welcome-subtitle'] = getText('config-list-welcome-subtitle','Field','text',data,langcode);
			// --------Global variables------------------
			var variable_nodes = $("asmContext:has(metadata[semantictag*='g-variable'])",data);
			for (var i=0;i<variable_nodes.length;i++) {
				var name = $("name",$("asmResource[xsi_type='Variable']",variable_nodes[i])).text();
				var value = $("value",$("asmResource[xsi_type='Variable']",variable_nodes[i])).text();
				g_variables[name] = value;
			}
			//----------------------
			g_configVar['send-email-logo'] = getImg('config-send-email-logo',data,langcode);
			g_configVar['send-email-image'] = getImg('config-send-email-image',data,langcode);
			g_configVar['send-email-message'] = getText('config-send-email-message','TextField','text',data,langcode);
			// --------CSS Text------------------
			var csstext = $("text[lang='"+LANG+"']",$("asmResource[xsi_type='TextField']",$("asmContext:has(metadata[semantictag='config-css'])",data))).text();
			csstext = csstext.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/g,"");
			if (csstext!=undefined && csstext!=''){
				console.log("Configuration CSS added")
				$("<style id='configcsstext'>"+csstext+"</style>").appendTo('head');
			}
			//------------Maintenance ---------
			g_configVar['maintenance-display'] = getText('config-maintenance-display','Get_Resource','value',data);
			g_configVar['maintenance-text'] = getText('config-maintenance-text','TextField','text',data,LANGCODE);
			g_configVar['maintenance-text-style'] = getContentStyle('config-maintenance-text',data);
			//----- Load Plugins + Javascript Files
			var jsfile_nodes = [];
			jsfile_nodes = $("asmContext:has(metadata[semantictag='config-file-js'])",data);
			for (var i=0; i<jsfile_nodes.length; i++){
				var fileid = $(jsfile_nodes[i]).attr("id");
				var url = "../../../"+serverBCK+"/resources/resource/file/"+fileid;
				$.ajax({
					url: url,
					dataType: "script",
				});
			}
			//----- Load CSS Files
			var jsfile_nodes = [];
			jsfile_nodes = $("asmContext:has(metadata[semantictag='config-file-css'])",data);
			for (var i=0; i<jsfile_nodes.length; i++){
				var fileid = $(jsfile_nodes[i]).attr("id");
				var url = "../../../"+serverBCK+"/resources/resource/file/"+fileid;
				$.ajax({
					url: url,
					dataType: "text",
					success:function(data){
						console.log("CSS file loaded")
						$("head").append("<style>" + data + "</style>");
					}
				});
			}
		}
	});
}