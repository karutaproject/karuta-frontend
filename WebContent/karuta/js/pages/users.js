
//==============================
function show_list_users()
//==============================
{
	hideAllPages();

	$("body").removeClass();
	$("body").addClass("list-users")
	$("#sub-bar").html("");
	setLanguageMenu("fill_list_users()");
	$("#refresh").attr("onclick","fill_list_users()");
	$("#search-user-div").show();
	$("#refresh").show();
	$("#main-user").show();
}

//==============================
function fill_list_users()
//==============================
{
	setLanguageMenu("fill_list_users()");
	$("#search-user-div").html(getSearchUser()); // we erase code if any
	$("#search-user-input").keypress(function(f) {
		var code= (f.keyCode ? f.keyCode : f.which);
		if (code == 13)
			searchUser();
	});
	var html = "";
	html += "<span id='user-create' onclick=\"UIFactory['User'].callCreate()\" >"+karutaStr[LANG]['create_user']+"</span>";
	html += "<h3 id='active-users'><span id='active-users-button' onclick=\"javascript:toggleUsersList('active')\" class='button glyphicon glyphicon-minus'></span>"+karutaStr[LANG]['active_users']+"</h3>";
	html += "<div  id='active'></div>";
	
	html += "<h3 id='inactive-users' style='display:none'><span id='inactive-users-button' onclick=\"javascript:toggleUsersList('inactive')\" class='button glyphicon glyphicon-minus'></span>"+karutaStr[LANG]['inactive_users']+"</h3>";
	html += "<div  id='inactive' style='display:none'></div>";
	
	html += "<h3 id='temporary-users' style='display:none'>"+karutaStr[LANG]['temporary_users'];
	html += "&nbsp<button class='btn btn-xs' onclick=\"confirmDelTemporaryUsers()\">";
	html += karutaStr[LANG]["delete-temporary-users"];
	html += "</button>";
	html += "</h3>";
	html += "<div  id='temporary'></div>";
	
	html += "<h3 id='empty-users'><span id='empty-users-button' onclick=\"javascript:toggleUsersList('empty')\" class='button glyphicon glyphicon-plus'></span>"+karutaStr[LANG]['empty_users']+"</h3>";
	html += "<div  id='empty' style='display:none'></div>";

	$("#main-user").html(html);
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/credential",
		data: "",
		success : function(data) {
			USER = new UIFactory["User"]($("user",data));
//			loadLanguages(function(data) {$("#navigation_bar").html(getNavBar('users',null));$("#menu").html(getMenu());$("#list").html(getListUsers());});
			//----------------
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/users",
				success : function(data) {
					UIFactory["User"].parse(data);
					UIFactory["User"].displayActive('active','list');
					UIFactory["User"].displayInactive('inactive','list');
				}
			});
			//----------------
		},
		error : function(jqxhr,textStatus) {
			loadLanguages(function(data) {alertHTML(karutaStr[LANG]['not-logged']);});
			window.location="login.htm?lang="+LANG;
		}
	});
	$.ajaxSetup({async: true});
}

//==============================
function fill_search_users(value,type)
//==============================
{
	var html = "";
	html += "<span id='user-create' onclick=\"UIFactory['User'].callCreate()\" >"+karutaStr[LANG]['create_user']+"</span>";
	html += "<h3 id='active-users'>"+karutaStr[LANG]['active_users']+"</h3>";
	html += "<div  id='active'>";
	html += "</div>";
	html += "<h3 id='inactive-users'>"+karutaStr[LANG]['inactive_users']+"</h3>";
	html += "<div  id='inactive'>";
	html += "</div>";
	$("#main-user").html(html);
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/users?"+type+"="+value,
		success : function(data) {
			UIFactory["User"].parse(data);
			UIFactory["User"].displayActive('active','list');
			UIFactory["User"].displayInactive('inactive','list');
		}
	});
}

//==============================
function display_list_users()
//==============================
{
	if ($("#user-create").length) {
		show_list_users();
	} else {
		fill_list_users();
		show_list_users();
	}
}

//==================================
function searchUser()
//==================================
{
	var value = $("#search-user-input").val();
	var type = $('#search-choice').attr('value');
	fill_search_users(value,type);
}

//==============================
function getSearchUser()
//==============================
{
	var html = "";
	html += "<div id='search-user' class='input-group'>";
	html += "<div class='input-group-btn'>";
	html += "<button id='search-choice' value='username' type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><span id='search-input-label'>"+karutaStr[LANG]['username-label']+"</span> <span class='caret'></span></button>";
	html += "<ul class='dropdown-menu'>";
	html += "<li><a href='#' onclick=\"$('#search-choice').attr('value','username');$('#search-input-label').html('"+karutaStr[LANG]['username-label']+"');$('#search-user-input').attr('placeholder','"+karutaStr[LANG]['search-username-label']+"')\">"+karutaStr[LANG]['username-label']+"</a></li>";
	html += "<li><a href='#' onclick=\"$('#search-choice').attr('value','firstname');$('#search-input-label').html('"+karutaStr[LANG]['firstname-label']+"');$('#search-user-input').attr('placeholder','"+karutaStr[LANG]['search-firstname-label']+"')\">"+karutaStr[LANG]['firstname-label']+"</a></li>";
	html += "<li><a href='#' onclick=\"$('#search-choice').attr('value','lastname');$('#search-input-label').html('"+karutaStr[LANG]['lastname-label']+"');$('#search-user-input').attr('placeholder','"+karutaStr[LANG]['search-lastname-label']+"')\">"+karutaStr[LANG]['lastname-label']+"</a></li>";
	html += "</ul>";
	html += "</div><!-- /btn-group -->";
	html += "<input type='text' id='search-user-input' class='form-control' value='' placeholder='"+karutaStr[LANG]['search-username-label']+"'>";
	html += "	<span class='input-group-btn'><button id='search-button-lastname' type='button' onclick='searchUser()' class='btn'><span class='glyphicon glyphicon-search'></span></button></span>";
	html += "</div><!-- /input-group -->";
	return html;
}
