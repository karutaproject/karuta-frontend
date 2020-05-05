
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
	html += "	<div id='user-rightside' class='rightside'>";
	html += "		<div id='user-refresh' class='refresh fas fa-sync-alt' onclick=\"fill_list_users('"+type+"')\"></div>";
	html += "		<div id='user-search' class='search'></div>";
	html += "		<div id='user-rightside-title' class='title'></div>";
	html += "		<div id='user-rightside-header1' class='header' style='display:none'>"+karutaStr[LANG]['active_users']+"</div>";
	html += "		<div id='user-rightside-content1' class='content1' style='display:none'>";
	html += "			<table class='users-content'>";
	html += "				<tr class='table-head'><th class='firstname'>"+karutaStr[LANG]['firstname']+"</th><th class='lastname'>"+karutaStr[LANG]['lastname']+"</th><th class='c-a-s'>"+karutaStr[LANG]['c-a-s']+"</th><th class='username'>"+karutaStr[LANG]['username']+"</th><th class='buttons'></th></tr>";
	html += "				<tbody id='user-rightside-users-content1' class='users-content'></tbody>";
	html += "			</table>";
	html += "		</div>";
	html += "		<div id='user-rightside-header2' class='header' style='display:none'>"+karutaStr[LANG]['inactive_users']+"</div>";
	html += "		<div id='user-rightside-content2' class='content2' style='display:none'>";
	html += "			<table class='users-content'>";
	html += "				<tr class='table-head'><th class='firstname'>"+karutaStr[LANG]['firstname']+"</th><th class='lastname'>"+karutaStr[LANG]['lastname']+"</th><th class='c-a-s'>"+karutaStr[LANG]['c-a-s']+"</th><th class='username'>"+karutaStr[LANG]['username']+"</th><th class='buttons'></th></tr>";
	html += "				<tbody id='user-rightside-users-content2' class='users-content'></tbody>";
	html += "			</table>";
	html += "		</div>";
	html += "		<div id='user-rightside-navbar-pages-bottom' class='navbar-pages'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "	<div id='user-leftside'  class='leftside'>";
	if (USER.admin || (USER.creator && !USER.xlimited)){
		html += "			<span class='folder-label btn' title='"+karutaStr[LANG]['create_user']+"'><i class='fas fa-user-plus' id='folder-create' onclick=\"UIFactory.User.callCreate()();\"></i></span>";
	}
	html += "		<h3>"+karutaStr[LANG]['active_users'];
	html += "			<button class='btn' onclick=\"UIFactory.User.displayActive('user-rightside-users-content1','user');\">&nbsp;"+karutaStr[LANG]['see']+"</button>";
	html += "		</h3>";
	html += "		<div id='user-content1-leftside' class='content1'></div>";
	html += "		<h3>"+karutaStr[LANG]['inactive_users'];
	html += "			<button class='btn' onclick=\"UIFactory.User.displayInactive('user-rightside-users-content2','user');\">&nbsp;"+karutaStr[LANG]['see']+"</button>";
	html += "		</h3>";

	html += "		<h3 id='temporary-users' style='display:none'>"+karutaStr[LANG]['temporary_users'];
	html += "			&nbsp<button class='btn list-btn' onclick=\"confirmDelTemporaryUsers()\">";
	html += 			karutaStr[LANG]["delete-temporary-users"];
	html += "			</button>";
	html += "		</h3>";
	html += "		<div id='user-content2-leftside' class='content2'></div>";
	html += "	</div><!--div id='userslist-leftside'-->";
	//------------------------------------------
	html += "</div><!--div id='user-body'-->";
	//-----------------------------------------------------------

	$("#main-user").html(html);
	UIFactory.User.displaySearch("user-search",true,'user');
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
