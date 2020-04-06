
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
function fill_list_users(type)
//==============================
{
	setLanguageMenu("fill_list_users()");
	if (type==null)
		type="list";
	var html = "";
	//-----------------------------------------------------------
	html += "<div id='user-body'>";
	//------------------------------------------
//	html += "	<div class='gutter'></div>";
	//------------------------------------------
	html += "	<div id='user-rightside'>";
	html += "		<div id='search-user' class='search'></div>";
	html += "		<div id='user-title-rightside' class='title'></div>";
	html += "		<div id='user-header-rightside' class='header'></div>";
	html += "		<div id='user-content1-rightside' class='content1-rightside'></div>";
	html += "		<div id='user-navbar-pages-top-rightside' class='navbar-pages' style='display:none'></div>";
	html += "		<div id='user-content2-rightside' class='content2-rightside'></div>";
	html += "		<div id='user-navbar-pages-bottom-rightside' class='navbar-pages' style='display:none'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "	<div id='user-leftside'>";
	html += "		<h3 id='user-title-leftside'>"+karutaStr[LANG]['active_users']+"</h3>";
	html += "		<h4 id='user-header-leftside'>";
	html += "			<span id='usersfolders-label' class='folder-label'>"+karutaStr[LANG]['users-folders']+"</span>&nbsp<span class='badge number_of_folders' id='nb_folders_active'></span>";
	html += "			<span class='folder-label btn' title='"+karutaStr[LANG]['create_folder']+"'><i class='fas fa-folder-plus' id='folder-create' onclick=\"UIFactory.UsersFolder.callCreateFolder('active');\"></i></span>";
	html += "		</h4>";
	html += "		<div id='user-content1-leftside' class='content1-leftside tree'></div>";
	html += "		<h3 id='temporary-users' style='display:none'>"+karutaStr[LANG]['temporary_users'];
	html += "			&nbsp<button class='btn list-btn' onclick=\"confirmDelTemporaryUsers()\">";
	html += 			karutaStr[LANG]["delete-temporary-users"];
	html += "			</button>";
	html += "		</h3>";
	html += "		<div id='user-content2-leftside' class='content2-leftside'></div>";
	html += "	</div><!--div id='userslist-leftside'-->";
	//------------------------------------------
	html += "</div><!--div id='user-body'-->";
	//-----------------------------------------------------------

	$("#main-user").html(html);
	displaySearchUser("search-user");
//	UIFactory.UsersFolder.loadAndDisplayFolders('user-content1-leftside','list-user');
	fill_list_usersOLD('user-content1-rightside','active','list')
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
		}
	});
}

//==============================
function display_list_users(type)
//==============================
{
	if (type==null)
		type='list1';
	if ($("#user-create").length) {
		show_list_users();
	} else {
		fill_list_users(type);
		show_list_users(type);
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
function displaySearchUser(dest)
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
	$("#"+dest).html(html);
	$("#search-user-input").keypress(function(f) {
		var code= (f.keyCode ? f.keyCode : f.which);
		if (code == 13)
			searchUser();
	});
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
function fill_list_usersOLD(dest,type,viewtype)
//==============================
{
	if (viewtype==null)
		viewtype = "list";
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/credential",
		data: "",
		success : function(data) {
			USER = new UIFactory["User"]($("user",data));
			//----------------
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/users",
				viewtype : viewtype,
				success : function(data) {
					UIFactory["User"].parse(data);
					if (type=='active')
						UIFactory["User"].displayActive(dest,this.viewtype);
					else
						UIFactory["User"].displayInactive(dest,this.viewtype);
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
