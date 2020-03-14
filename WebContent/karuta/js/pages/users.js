
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
	html += "	<div class='col-1'>";
	html += "<div class='folder-label btn' title='"+karutaStr[LANG]['create_user']+"'><i class='fas fa-user-plus' id='user-create' onclick=\"javascript:UIFactory['User'].callCreate();\"></i></div>";
	html += "	</div>";
	html += "	<div class='col-1'>";
	html += "<div class='folder-label btn' title='"+karutaStr[LANG]['create_folder']+"'><i class='fas fa-folder-plus' id='folder-create' onclick=\"javascript:UIFactory['UsesFolder'].callCreate();\"></i></div>";
	html += "	</div>";
	html += "	<div class='col-9 search' id='search-user-div'></div>";
	html += "	<div class='col-1'><i class='fas fa-sync-alt' onclick='fill_list_users()' id='refresh' class='fas fa-sync-alt' data-title='"+karutaStr[LANG]["button-refresh"]+"' data-toggle='tooltip' data-placement='bottom'></i></div>";
	html += "</div>";
	html += "<div id='user-body'>"+getUsersList()+"</div>";

	$("#main-user").html(html);
	$("#search-user-div").html(getSearchUser()); // we erase code if any
	$("#search-user-input").keypress(function(f) {
		var code= (f.keyCode ? f.keyCode : f.which);
		if (code == 13)
			searchUser();
	});
	initRoots();
	
//	loadUsersFolderStruct('root');
	
}

//==============================
function getUsersList()
//==============================
{
	var html = "";
	var text0 = karutaStr[LANG]['folders'];
	html += "<div id='gutter'></div>";
	html += "<div id='userslist-rightside'>";
	//-----------------------------------------------------------
	html += "<div id='folder-users'></div>";
	//-----------------------------------------------------------
	html += "</div><!--div id='userslist-rightside'-->";

	html += "<div id='userslist-leftside'>";
	//--------------------FOLDERS---------------------------------------
	html += "<div id='usersfolders' class='tree user'>";
	html += "<h3 id='usersfolder_root' class='treeNode'>";
	html += "<span id='toggle_usersfolder_root' class='closeSign toggledNode' onclick=\"javascript:loadAndDisplayUsersFolderStruct('collapse_usersfolder_root','root');\"></span>";
	html += "<span id='usersfolders-label' class='folder-label'>"+text0+"</span>&nbsp<span class='badge number_of_folders' id='number_of_usersfoldersroot'></span>";
	html += "</h3>";
	html += "<div id='collapse_usersfolder_root' class='nested'></div>";
	html += "</div><!--div id='usersfolders'-->";

	//--------------------USERS--------------------------------------
	var text1 = karutaStr[LANG]['users-in-rootfolder'];
	html += "<h3 id='users-in-rootfolder'>";
	html += "	<span id='users-label'>"+text1+"</span>&nbsp<span class='users-nb badge' id='users-nb'></span>";
	html += "	<button class='btn list-btn' onclick=\"loadAndDisplayUsersFolderContent('folder-users','0');$(window).scrollTop(0);\">"+ karutaStr[LANG]["see"] + "</button>";
	html += "</h3>";
	html += "<div id='collapse_usersfolder_0' class='nested'></div>";

	if (USER.admin) {
		//---------------------BIN-------------------------------------
		var text2 = karutaStr[LANG]['bin']+" - "+karutaStr[LANG]['inactive_users'];
		html += "<h3 id='bin-usersfolders-label' class='treeNode'>"+text2+"&nbsp<span class='bin-nb badge' id='bin-usersfolders-nb'></span>";
		html += "<button class='btn list-btn' onclick=\"UIFactory.UsersFolder.displayBin('folder-users','bin');$(window).scrollTop(0);\">"+ karutaStr[LANG]["see-bin"] + "</button>";
		html += "</h3>";
	}
	//-----------------------------------------------------------
	var text3 = karutaStr[LANG]['temporary_users'];
	html += "	<h3 id='temporary-users' style='display:none'>"+text3;
	html += "		&nbsp<button class='btn list-btn' onclick=\"confirmDelTemporaryUsers()\">";
	html += 		karutaStr[LANG]["delete-temporary-users"];
	html += "		</button>";
	html += "	</h3>";
	
	//-----------------------------------------------------------
	html += "</div><!--div id='userslist-leftside'-->";

	return html;
}

//==============================
function fill_search_users(value,type)
//==============================
{
	var html = "";
	html += "<h3 id='active-users'>"+karutaStr[LANG]['active_users']+"</h3>";
	html += "<div  id='active'></div>";
	html += "<h3 id='inactive-users'>"+karutaStr[LANG]['inactive_users']+"</h3>";
	html += "<div  id='inactive'></div>";
	$("#user-body").html(html);
	$("#rembutton").removeAttr('disabled');
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
	html += "	<div class='input-group-prepend'>";
	html += "		<button id='search-choice' value='username' type='button' class='btn dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><span id='search-input-label'>"+karutaStr[LANG]['username-label']+"</span> <span class='caret'></span></button>";
	html += "		<div class='dropdown-menu'>";
	html += "			<a href='#' class='dropdown-item' onclick=\"$('#search-choice').attr('value','username');$('#search-input-label').html('"+karutaStr[LANG]['username-label']+"');$('#search-user-input').attr('placeholder','"+karutaStr[LANG]['search-username-label']+"')\">"+karutaStr[LANG]['username-label']+"</a>";
	html += "			<a href='#' class='dropdown-item' onclick=\"$('#search-choice').attr('value','firstname');$('#search-input-label').html('"+karutaStr[LANG]['firstname-label']+"');$('#search-user-input').attr('placeholder','"+karutaStr[LANG]['search-firstname-label']+"')\">"+karutaStr[LANG]['firstname-label']+"</a>";
	html += "			<a href='#' class='dropdown-item' onclick=\"$('#search-choice').attr('value','lastname');$('#search-input-label').html('"+karutaStr[LANG]['lastname-label']+"');$('#search-user-input').attr('placeholder','"+karutaStr[LANG]['search-lastname-label']+"')\">"+karutaStr[LANG]['lastname-label']+"</a>";
	html += "		</div>";
	html += "	</div><!-- /input-group-prepend -->";
	html += "	<input type='text' id='search-user-input' class='form-control' value='' placeholder='"+karutaStr[LANG]['search-username-label']+"'>";
	html += "	<div class='input-group-append'>";
	html += "		<button id='search-button-lastname' type='button' onclick='searchUser()' class='btn'><i class='fas fa-search'></i></button>";
	html += "		<button id='rembutton' type='button' disabled='true' onclick=\"UIFactory.User.confirmRemoveUsers()\" class='btn'><i class='fas fa-trash'></i></button>";
	html += "	</div><!-- /input-group-append -->";
	html += "</div><!-- /input-group -->";
	return html;
}

//==================================
function toggleUsersList(list) {
//==================================
	if ($("#"+list+"-users-button").hasClass("fa-plus")) {
		if (list=='empty') {
			$("#wait-window").show();
			UIFactory.User.getListUserWithoutPortfolio();
			UIFactory.User.displayUserWithoutPortfolio('empty')
			$("#wait-window").hide();
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

//==============================
function fill_list_usersOLD()
//==============================
{
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
	});	$.ajaxSetup({async: true});
}
