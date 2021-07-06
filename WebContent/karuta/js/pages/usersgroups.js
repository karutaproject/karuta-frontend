
//==============================
function show_list_usersgroups()
//==============================
{
	hideAllPages();

	$("body").removeClass();
	$("body").addClass("list-usersgroups")
	$("#sub-bar").html("");
	setLanguageMenu("fill_list_usersgroups()");
	$("#refresh").attr("onclick","fill_list_usersgroups()");
	$("#refresh").show();
	$("#main-usersgroup").show();
}

//==============================
function fill_list_usersgroups(type)
//==============================
{
	setLanguageMenu("fill_list_usersgroups()");
	var html = "";
	html += "<div id='usergroup-body'>";
	//------------------------------------------
	html += "	<div id='usergroup-user-leftside'  class='leftside'>";
	html += "		<div id='usergroup-user-refresh' class='refresh fas fa-sync-alt' onclick='fill_list_usersgroups()' data-title='"+karutaStr[LANG]["button-reload"]+"' data-toggle='tooltip' data-placement='bottom'></div>";
	html += "		<div id='usergroup-user-search' class='search'></div>";
	html += "		<h3>"+karutaStr[LANG]['active_users'];
	html += "			<button id='list-menu' class='btn' onclick=\"UIFactory.User.displayActive('usergroup-user-rightside-users-content1','usergroup-user');\">&nbsp;"+karutaStr[LANG]['see']+"</button>";
	html += "		</h3>";
	html += "		<div id='usergroup-user-leftside-content1' class='content1 tree'></div>";
	html += "		<h3>"+karutaStr[LANG]['inactive_users'];
	html += "			<button id='list-menu' class='btn' onclick=\"UIFactory.User.displayInactive('usergroup-user-rightside-users-content2','usergroup-user');\">&nbsp;"+karutaStr[LANG]['see']+"</button>";
	html += "		</h3>";
	html += "		<div id='usergroup-user-leftside-content2' class='content2'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "	<div class='gutter'>&nbsp;</div>";
	//------------------------------------------
	html += "	<div id='usergroup-user-rightside' class='rightside'>";
	html += "		<div id='usergroup-user-search' class='search'></div>";
	html += "		<div id='usergroup-user-rightside-title' class='title'></div>";
	html += "		<div id='usergroup-user-rightside-header1' class='header' style='display:none'>"+karutaStr[LANG]['active_users']+"</div>";
	html += "		<div id='usergroup-user-rightside-content1' class='content1' style='display:none'>";
	html += "			<div id='usergroup-user-rightside-users-content1' class='users-content'></div>";
	html += "		</div>";
	html += "		<div id='usergroup-user-rightside-header2' class='header' style='display:none'>"+karutaStr[LANG]['inactive_users']+"</div>";
	html += "		<div id='usergroup-user-rightside-content2' class='content2' style='display:none'>";
	html += "			<div id='usergroup-user-rightside-users-content2' class='users-content'></div>";
	html += "		</div>";
	html += "		<div id='usergroup-user-rightside-navbar-pages-bottom' class='navbar-pages'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "	<div class='gutter'>&nbsp;</div>";
	//------------------------------------------
	html += "	<div id='usergroup-rightside' class='rightside'>";
	html += "		<div id='usergroup-search' class='search'></div>";
	html += "		<div id='usergroup-rightside-title' class='title'></div>";
	html += "		<div id='usergroup-rightside-header' class='header'></div>";
	html += "		<div id='usergroup-rightside-content1' class='content1'></div>";
	html += "		<div id='usergroup-rightside-navbar-pages-top' class='navbar-pages' style='display:none'></div>";
	html += "		<div id='usergroup-rightside-content2' class='content2'></div></div>";
	html += "		<div id='usergroup-rightside-navbar-pages-bottom' class='navbar-pages' style='display:none'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "	<div class='gutter'>&nbsp;</div>";
	//------------------------------------------
	html += "	<div id='usergroup-leftside'  class='leftside'>";
	html += "		<div id='menu'></div>";
	html += "		<h3 class='title'>";
	html += "			<span id='usersgroup-label' class='usergroup-label'>"+karutaStr[LANG]['list_usersgroups']+"</span>&nbsp";
	html += "			<span class='folder-label btn'><i class='fas fa-folder-plus' id='folder-create' onclick=\"UIFactory.UsersGroup.callCreateGroup();\"></i></span>";
	html += "		</h3>";
	html += "		<div id='usergroup-leftside-content1' class='content1 tree'></div>";
	html += "		<div id='usergroup-leftside-content2' class='content2'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "</div>";
	//-----------------------------------------------------------
	$("#main-usersgroup").html(html);
	//-----------------------------------------------------------
	UIFactory.User.displaySearch("usergroup-user-search",false,'usergroup-user');
	UIFactory.UsersGroup.loadAndDisplayAll('usergroup');

}


//==============================
function display_list_usersgroups(type)
//==============================
{
	USER.admin = USER.admin_original; // reset if role playing when reload
	if (type==null)
		type='list-forusergroup';
	if ($("#usersgroup-create").length) {
		show_list_usersgroups();
	} else {
		fill_list_usersgroups(type);
		show_list_usersgroups(type);
	}
}

//==============================
function updateGroup_User(elt)
//==============================
{
	var type = 'DELETE';
	if(elt.checked) type='PUT';
	var userid = $(elt).attr("user");
	var url = serverBCK_API+"/usersgroups?group=" + elt.value + "&user="+userid;
	$.ajax({
		type : type,
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			$("#user_"+userid+"-list_groups-form-update").prop('value', '1');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error : "+jqxhr.responseText);
			if(type=='DELETE') 
				$(elt).prop('checked', true);
		}
	});
}

//==============================
function get_usersxml_from_groups(usersgroups)
//==============================
{
	var xml = "<users>";
	$.ajaxSetup({async: false});
	for (var i=0; i<usersgroups.length; i++){
		var gid = $(usersgroups[i]).attr('value');
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/usersgroups?group="+gid,
			success : function(data) {
				xml += $($("users",data)[0]).html();
			},
			error : function(jqxhr,textStatus) {
				alertHTML("Error in get_usersxml_from_groups : "+"group-"+gid+":"+jqxhr.responseText);
			}
		});
	}
	$.ajaxSetup({async: true});
	xml += "</users>";
	return xml;
}

