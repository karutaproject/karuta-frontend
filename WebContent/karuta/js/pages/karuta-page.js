//==============================
function initKarutaPage()
//==============================
{
	//--------------------------
	var html = "";
	html += "<div id='main-body'>";
	html += "<div id='navigation-bar'></div>";
	html += "<div id='sub-bar'></div>";
	html += "<div id='main-container' class='container-fluid'></div>";
	html += "<div id='var-list' class='container-fluid'></div>";
	html += "</div>";
	html += "<div id='social-button' onclick='toggleSocialNetwork()'></div>";
	html += "<div id='wait-window' class='modal' style='height:100px;'>";
	html += "<div id='wait-window-body' class='modal-body' style='text-align:center;'></div>";
	html += "<div id='wait-spin'></div>";
	html += "</div>";
	html += "<div id='post-form' style='display:none'>";
	html += "</div>";
	$('body').html(html)
	//--------------------------
	$('body').append(EditBox());
	$('body').append(DeleteBox());
	$('body').append(LangueBox());
	$('body').append(savedBox());
	$('body').append(alertBox());
	$('body').append(messageBox());
	$('body').append(imageBox());
	//--------------------------
	var target = document.getElementById('wait-spin');
	var spinner = new Spinner().spin(target);
	g_elgg_key = Cookies.get('elgg_token');
	g_socialnetwork = Cookies.get('socialnetwork');
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
		url : "../../../"+serverBCK+"/credential",
		data: "",
		success : function(data) {
			USER = new UIFactory["User"]($("user",data));
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverVER+"/version",
				data: "",
				success : function(data) {		
					karuta_backend_version = $("number",$("#backend",data)).text();
					karuta_backend_date = $("date",$("#backend",data)).text();
					karuta_fileserver_version = $("number",$("#fileserver",data)).text();
					karuta_fileserver_date = $("date",$("#fileserver",data)).text();
				}
			});
			//-------------------------------
			if (elgg_installed!=undefined && elgg_installed) {
				var html = "";
				html += "<div id='global-row' class='row'>";
				if (g_socialnetwork==undefined || g_socialnetwork=='shown'){
					html += "	<div id='main-content' class='col-md-8 col-md-push-4'>";
					html += "	 <i onclick='' id='refresh' class='fa fa-refresh fa-2x'></i>";
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
					html += "		<i onclick='' id='refresh' class='fa fa-refresh fa-2x'></i>";
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
				html += "	<i onclick='' id='refresh' class='fa fa-refresh fa-2x'></i>";
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
			var navbar_html = getNavBar('list',null);
			$("#navigation-bar").html(navbar_html);
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
	html += "	<input id='search-input' class='form-control' value='' placeholder='"+karutaStr[LANG]['search-label']+"'>";
	html += "	<span class='input-group-btn'><button id='search-button' type='button' onclick='searchPortfolio()' class='btn'><span class='glyphicon glyphicon-search'></span></button></span>";
	html += "</div>";
	return html;
}
