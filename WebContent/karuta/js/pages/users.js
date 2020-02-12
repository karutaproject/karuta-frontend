
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
	$("#refresh").show();
	$("#main-user").show();
}

//==============================
function fill_list_users()
//==============================
{
	setLanguageMenu("fill_list_users()");
	var html = "";
	html += "<div id='user-header' class='row'>";
	html += "	<div class='col-2'>";
	html += "		<div class='btn' id='user-create' onclick=\"UIFactory['User'].callCreate()\" >"+karutaStr[LANG]['create_user']+"</div>";
	html += "	</div>";
	html += "	<div class='col-9 search' id='search-user-div'></div>";
	html += "	<div class='col-1'><i class='fas fa-sync-alt' onclick='fill_list_users()' id='refresh' class='fas fa-sync-alt' data-title='"+karutaStr[LANG]["button-reload"]+"' data-tooltip='true' data-placement='bottom'></i></div>";
	html += "</div>";


	html += "<h3 id='active-users'><span id='active-users-button' onclick=\"javascript:toggleUsersList('active')\" class='button fa fa-minus'></span>"+karutaStr[LANG]['active_users']+"</h3>";
	html += "<div  id='active'></div>";
	
	html += "<h3 id='inactive-users' style='display:none'><span id='inactive-users-button' onclick=\"javascript:toggleUsersList('inactive')\" class='button fa fa-minus'></span>"+karutaStr[LANG]['inactive_users']+"</h3>";
	html += "<div  id='inactive' style='display:none'></div>";

	html += "<h3 id='temporary-users' style='display:none'>"+karutaStr[LANG]['temporary_users'];
	html += "&nbsp<button class='btn ' onclick=\"confirmDelTemporaryUsers()\">";
	html += karutaStr[LANG]["delete-temporary-users"];
	html += "</button>";
	html += "</h3>";

	html += "<div  id='temporary'>";
	html += "</div>";

	html += "<h3 id='empty-users'><span id='empty-users-button' onclick=\"javascript:toggleUsersList('empty')\" class='button fa fa-plus'></span>"+karutaStr[LANG]['empty_users']+"</h3>";
	html += "<div  id='empty' style='display:none'></div>";

	$("#main-user").html(html);
	$("#search-user-div").html(getSearchUser()); // we erase code if any
	$("#search-user-input").keypress(function(f) {
		var code= (f.keyCode ? f.keyCode : f.which);
		if (code == 13)
			searchUser();
	});
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
	html += "<div id='user-header' class='row'>";
	html += "	<div class='col-2'>";
	html += "		<div class='btn' id='user-create' onclick=\"UIFactory['User'].callCreate()\" >"+karutaStr[LANG]['create_user']+"</div>";
	html += "	</div>";
	html += "	<div class='col-9 search' id='search-user-div'></div>";
	html += "	<div class='col-1'><i class='fas fa-sync-alt' onclick='fill_list_users()' id='refresh' class='fas fa-sync-alt' data-title='"+karutaStr[LANG]["button-reload"]+"' data-tooltip='true' data-placement='bottom'></i></div>";
	html += "</div>";

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
	html += "<div class='input-group-prepend'>";
	html += "<button id='search-choice' value='username' type='button' class='btn dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><span id='search-input-label'>"+karutaStr[LANG]['username-label']+"</span> <span class='caret'></span></button>";
	html += "<div class='dropdown-menu'>";
	html += "<a href='#' class='dropdown-item' onclick=\"$('#search-choice').attr('value','username');$('#search-input-label').html('"+karutaStr[LANG]['username-label']+"');$('#search-user-input').attr('placeholder','"+karutaStr[LANG]['search-username-label']+"')\">"+karutaStr[LANG]['username-label']+"</a>";
	html += "<a href='#' class='dropdown-item' onclick=\"$('#search-choice').attr('value','firstname');$('#search-input-label').html('"+karutaStr[LANG]['firstname-label']+"');$('#search-user-input').attr('placeholder','"+karutaStr[LANG]['search-firstname-label']+"')\">"+karutaStr[LANG]['firstname-label']+"</a>";
	html += "<a href='#' class='dropdown-item' onclick=\"$('#search-choice').attr('value','lastname');$('#search-input-label').html('"+karutaStr[LANG]['lastname-label']+"');$('#search-user-input').attr('placeholder','"+karutaStr[LANG]['search-lastname-label']+"')\">"+karutaStr[LANG]['lastname-label']+"</a>";
	html += "</div>";
	html += "</div><!-- /input-group-prepend -->";
	html += "<input type='text' id='search-user-input' class='form-control' value='' placeholder='"+karutaStr[LANG]['search-username-label']+"'>";
	html += "<div class='input-group-append'>";
	html += "<button id='search-button-lastname' type='button' onclick='searchUser()' class='btn'><i class='fas fa-search'></i></button>";
	html += "</div><!-- /btn-group -->";
	html += "</div><!-- /input-group -->";
	return html;
}

//==================================
function toggleUsersList(list) {
//==================================
	if ($("#"+list+"-users-button").hasClass("fa-plus")) {
		if (list=='empty') {
			UIFactory.User.getListUserWithoutPortfolio();
			UIFactory.User.displayUserWithoutPortfolio('empty')
		}
		$("#"+list+"-users-button").removeClass("fa-plus");
		$("#"+list+"-users-button").addClass("fa-minus");
		$("#"+list).show();
	} else {
		$("#"+list+"-users-button").removeClass("fa-minus")
		$("#"+list+"-users-button").addClass("fa-plus")
		$("#"+list).hide();
	}
}
