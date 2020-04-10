
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
	html += "<div id='usergroup-header' class='row'>";
	html += "</div>";
	html += "<div id='usergroup-body'>";
	//----------------------------V3-------------------------------
	html += "	<div id='usergroup-userslist-leftside' class='V3' style='display:none'>";
	html += "		<div id='usersfolders' class='tree user'>";
	html += "			<h3 id='usersfolder_root'>"+karutaStr[LANG]['active_users']+"</h3>";
	html += "			<h4 id='usersfolder_root'>";
	html += "				<span id='usersfolders-label' class='folder-label'>"+karutaStr[LANG]['users-folders']+"</span>&nbsp<span class='badge number_of_folders' id='nb_folders_active'></span>";
	html += "			</h4>";
	html += "			<div id='list-usersfolder_active' class=''></div>";
	html += "		</div><!--div id='usersfolders'-->";
	html += "	</div><!--div id='userslist-leftside'-->";
	//-----------------------------------------------------------
	html += "	<div id='gutter'>&nbsp;</div>";
	//-----------------------------------------------------------
	html += "	<div id='usergroup-userslist-rightside'  style='display:none'>";
	html += "		<div id='"+type+"-folder-users' class='folder-users'></div>";
	html += "	</div><!--div id='userslist-rightside'-->";
	//----------------------------V2-------------------------------
	html += "	<div id='usergroup-userslist-leftside' class='V2' style='display:none'>";
	html += "		<h3 id='usersfolder_root'>"+karutaStr[LANG]['active_users']+"</h3>";
	html += "		<div id='list-users-active' class=''></div>";
	html += "<div id='usegroup-users-navbar-pages' class='navbar-pages'></div>";
	html += "	</div><!--div id='userslist-leftside'-->";
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	html += "	<div id='gutter'>&nbsp;</div>";
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	//-----------------------------------------------------------
	html += "	<div id='usergroupslist-rightside'>";
	html += "		<div id='group-users'>";
	html += "		</div>";
	html += "	</div><!--div id='usergroupslist-rightside'-->";
	//-----------------------------------------------------------
	html += "	<div id='gutter'>&nbsp;</div>";
	//-----------------------------------------------------------
	html += "	<div id='usergroupslist-leftside'>";
	html += "		<div id='usersgroups' class='tree user'>";
	html += "			<h3 id='usersgroup_root'>"+karutaStr[LANG]['list_usersgroups']+"</h3>";
	html += "			<h4 id='usersgroup_root'>";
	html += "				<span id='usersgroups-label' class='group-label'>"+karutaStr[LANG]['users-groups']+"</span>&nbsp<span class='badge number_of_groups' id='nb_groups_active'></span>";
	html += "				<span id='create-group-button' class='col-1'>";
	html += "					<span class='group-label btn' title='"+karutaStr[LANG]['create_group']+"'><i class='fa fa-users' id='group-create' onclick=''></i></span>";
	html += "				</span>";
	html += "			</h4>";
	html += "			<div id='usersgroup_active' class=''></div>";
	html += "		</div><!--div id='usersgroups'-->";
	html += "	</div><!--div id='usergrouplist-leftside'-->";

	html += "</div><!--div id='usergroup-body'-->";
	$("#main-usersgroup").html(html);

	if (karuta_backend_version.startsWith("2.")) {
		$(".V2").show();
		$("#group-create").attr("onclick","UIFactory.UsersGroup.callCreate()");
		$.ajaxSetup({async: false});
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/usersgroups",
			data: "",
			success : function(data) {
				UIFactory["UsersGroup"].parse(data);
				UIFactory["UsersGroup"].displayGroups('usersgroup_active','list1');
				//----------------
			},
			error : function(jqxhr,textStatus) {
				loadLanguages(function(data) {alertHTML(karutaStr[LANG]['not-logged']);});
				window.location="login.htm?lang="+LANG;
			}
		});
		$.ajaxSetup({async: true});
		UIFactory.User.displayActiveForUserGroup('list-users-active','list-forusergroup');
	} else {
		$("#group-create").attr("onclick","UIFactory.Usersgroup.callCreategroup('active'");
		$("#userslist-leftside").css('visibility', 'visible');
		$("#userslist-rightside").css('visibility', 'visible');
		initusersgroups();
		UIFactory.UsersGroup.loadAndDisplayStruct('usersgroup_active','grouproot');
		initUsersFolders();
		UIFactory.UsersFolder.loadAndDisplayStruct('list-usersfolder_active','active',true,'list-forusergroup');  // active users
	}
}


//==============================
function display_list_usersgroups(type)
//==============================
{
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

