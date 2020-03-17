//==============================
function initKarutaPage()
//==============================
{
	//--------------------------
	var html = "";
	html += "<div id='print-window' style='display:none'></div>";
	html += "<div id='main-body'>";
	html += "	<div id='navigation-bar'></div>";
	html += "	<div id='sub-bar'></div>";
	html += "	<div id='main-container' class='container-fluid'></div>";
	html += "	<div id='var-list' class='container-fluid'></div>";
	html += "</div>";
	html += "<div id='wait-window' class='modal fade' style='height:100px;'>";
	html += "	<div id='wait-window-body' class='modal-body'></div>";
	html += "	<div id='wait-spin'></div>";
	html += "</div>";
	html += "<div id='post-form' style='display:none'></div>";
	html += "<div id='export-window' style='height:100px;display:none'>";
	html += "	<div id='export-window-body'></div>";
	html += "	<div id='export-spin'></div>";
	html += "</div>";
	html += "<div id='export-html' style='display:none'></div>";
//	html += "<div id='print-window' style='display:none'></div>";
	$('body').append(html)
	//--------------------------
	$('body').append(EditBox());
	$('body').append(DeleteBox());
	$('body').append(savedBox());
	$('body').append(alertBox());
	$('body').append(messageBox());
	$('body').append(imageBox());
	if (typeof europass_installed!='undefined' && europass_installed)
		$('body').append(LangueBox());
	
	//--------------------------
	var spinner1 = new Spinner().spin(document.getElementById('wait-spin'));
	var spinner2 = new Spinner().spin(document.getElementById('export-spin'));
	//--------------------------
	if (elgg_installed) {
		g_elgg_key = Cookies.get('elgg_token');
		g_socialnetwork = localStorage.getItem('socialnetwork');
	}
	g_edit = true; // à vérifier
	//--------------------------
}



//==============================
function displayKarutaPage()
//==============================
{
	$.ajaxSetup({async: false});
	loadLanguages(function(data) {
		getLanguage();
	});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/credential",
		data: "",
		success : function(data) {
			USER = new UIFactory["User"]($("user",data));
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
					$("a[data-tooltip='true']").tooltip({html:true});
				},
				error : function(jqxhr,textStatus) {
					var navbar_html = getNavBar('list',null);
					$("#navigation-bar").html(navbar_html);
					$("a[data-tooltip='true']").tooltip({html:true});
				}
			});
			//-------------------------------
			if (elgg_installed) {
				var html = "";
				html += "<div id='global-row' class='row'>";
				if (g_socialnetwork==undefined || g_socialnetwork=='shown'){
					html += "	<div id='main-content' class='col-md-8 col-md-push-4'>";
					html += "	 <i onclick='' id='refresh' class='fa fa-refresh fa-2x' data-title='"+karutaStr[LANG]["button-refresh"]+"' data-tooltip='true' data-placement='bottom'></i>";
					html += "	<div id='search-portfolio-div' class='search' style='display:none'>";
					html += getSearch();
					html += "	</div>";
					html += "	<div id='search-user-div' class='search' style='display:none'>";
					html += getSearchUser();
					html += "	</div>";
					html += "		<div id='main-list'></div>";
					html += "		<div id='main-portfoliosgroup' style='display:none'></div>";
					html += "		<div id='main-page' style='display:none'></div>";
					html += "		<div id='main-user' style='display:none'></div>";
					html += "		<div id='main-usersgroup' style='display:none'></div>";
					html += "		<div id='main-exec-batch' style='display:none'></div>";
					html += "		<div id='main-exec-report' style='display:none'></div>";
					html += "	</div>";
					html += "	<div id='socialnetwork' class='col-md-4 col-md-pull-8'><div id='socialnetwork-head'></div><div id='socialnetwork-body'></div></div>";
				} else {
					html += "	<div id='main-content' class='col-md-12'>";
					html += "		<i onclick='' id='refresh' class='fa fa-refresh fa-2x' data-title='"+karutaStr[LANG]["button-refresh"]+"' data-tooltip='true' data-placement='bottom'></i>";
					html += "	<div id='search-portfolio-div' class='search' style='display:none'>";
					html += getSearch();
					html += "	</div>";
					html += "	<div id='search-user-div' class='search' style='display:none'>";
					html += getSearchUser();
					html += "	</div>";
					html += "		<div id='main-list' class='col-md-12'></div>";
					html += "		<div id='main-portfoliosgroup' class='col-md-12' style='display:none'></div>";
					html += "		<div id='main-page' class='col-md-12' style='display:none'></div>";
					html += "		<div id='main-user' class='col-md-12' style='display:none'></div>";
					html += "		<div id='main-usersgroup' class='col-md-12' style='display:none'></div>";
					html += "		<div id='main-exec-batch' class='col-md-12' style='display:none'></div>";
					html += "		<div id='main-exec-report' class='col-md-12' style='display:none'></div>";
					html += "	</div>";
					html += "	<div id='socialnetwork' class='col-md-4 col-md-pull-8' style='display:none'><div id='socialnetwork-head'></div><div id='socialnetwork-body'></div></div>";
				}
				html += "</div>";								
				$("#main-container").html(html);
				displaySocialNetwork();
				if (g_socialnetwork==undefined || g_socialnetwork=='shown')
					$("#social-button").html("<i id='toggleSocialNetwork' class='fa fa-arrow-left'></i>");
				else
					$("#social-button").html("<i id='toggleSocialNetwork' class='fa fa-arrow-right'></i>");
			} else {
				var html = "";
				html += "<div id='global-row' class='row'>";
				html += "	<i onclick='' id='refresh' class='fa fa-refresh fa-2x' style='display:inline' data-title='"+karutaStr[LANG]["button-refresh"]+"' data-tooltip='true' data-placement='bottom'></i>";
				html += "	<div id='search-portfolio-div' class='search' style='display:none'>";
				html += getSearch();
				html += "	</div>";
				html += "	<div id='search-user-div' class='search' style='display:none'>";
				html += getSearchUser();
				html += "	</div>";
				html += "	<div id='main-list' class='col-md-12'></div>";
				html += "	<div id='main-portfoliosgroup' class='col-md-12' style='display:none'></div>";
				html += "	<div id='main-page' class='col-md-12' style='display:none'></div>";
				html += "	<div id='main-user' class='col-md-12' style='display:none'></div>";
				html += "	<div id='main-usersgroup' class='col-md-12' style='display:none'></div>";
				html += "	<div id='main-exec-batch' class='col-md-12' style='display:none'></div>";
				html += "	<div id='main-exec-report' class='col-md-12' style='display:none'></div>";
				html += "</div>";
				$("#main-container").html(html);
				$("#social-button").hide();
			}
			//-------------------------------
			//-------------------------------
			display_list_page();
			//-------------------------------
		},
		error : function(jqxhr,textStatus) {
			alertHTML(karutaStr[LANG]['not-logged']);
			window.location="login.htm?lang="+LANG;
		}
	});
	$.ajaxSetup({async: true});
}

//==============================
function getSearch()
//==============================
{
	var html = "";
	html += "<div id='search' class='input-group'>";
	html += "	<input id='search-input' class='form-control' value='' placeholder='"+karutaStr[LANG]['search-label']+"' onchange='javascript:hideArchiveSearch()'>";
	html += "	<span class='input-group-btn'>";
	html +="		<button id='search-button' type='button' onclick='searchPortfolio()' class='btn'><span class='glyphicon glyphicon-search'></span></button>";
	if (USER.creator && !USER.limited)  {
		html += "		<a id='archive-button' href='' class='btn' disabled='true'><i style='margin-top:4px' class='fa fa-download'></i></a>";
		html += "		<button id='remove-button' type='button' disabled='true' onclick=\"UIFactory['Portfolio'].removePortfolios()\" class='btn'><i class='fa fa-trash-o'></i></button>";
	}
	html += "	</span>";
	html += "</div>";
	return html;
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
