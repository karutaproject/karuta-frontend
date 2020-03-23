
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
	if (karuta_backend_version.startsWith("x2.")) {
		var html = "";
		html += "<h3 id='usersgroups-label'>"+karutaStr[LANG]['list_usersgroups']+" ";
		html += "<span class='folder-label btn' title='"+karutaStr[LANG]['create_usersgroup']+"'><i class='fas fa-folder-plus' id='folder-create' onclick='UIFactory.UsersGroup.callCreate();'></i></span>";
		html += "</h3>";
		html += "<div class='warning-list'>"+karutaStr[LANG]['note-list_usergroups']+ "</div>";
		html += "<div id='usersgroups'>";
		html += "</div>";
		$("#main-usersgroup").html(html);
		$.ajaxSetup({async: false});
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/usersgroups",
			data: "",
			success : function(data) {
				UIFactory["UsersGroup"].parse(data);
				UIFactory["UsersGroup"].displayGroups('usersgroups','list');
				//----------------
			},
			error : function(jqxhr,textStatus) {
				loadLanguages(function(data) {alertHTML(karutaStr[LANG]['not-logged']);});
				window.location="login.htm?lang="+LANG;
			}
		});
		$.ajaxSetup({async: true});
	} else {
		var html = "";
		html += "<div id='usergroup-header' class='row'>";
//		html += "	<div id='create-user-button' class='col-1'>";
//		html += "<div class='group-label btn' title='"+karutaStr[LANG]['create_user']+"'><i class='fas fa-user-plus' id='user-create' onclick=\"javascript:UIFactory['User'].callCreate();\"></i></div>";
//		html += "	</div>";
//		html += "<div class='col-9 search' id='search-user-div'></div>";
//		html += "	<div class='col-1'><i class='fas fa-sync-alt' onclick='fill_list_users()' id='refresh' class='fas fa-sync-alt' data-title='"+karutaStr[LANG]["button-refresh"]+"' data-toggle='tooltip' data-placement='bottom'></i></div>";
		html += "</div>";
		html += "<div id='usergroup-body'>";
		//--------------------FOLDERS V3---------------------------------------
		html += "	<div id='userslist-leftside'>";
		html += "		<div id='usersfolders' class='tree user'>";
		html += "			<h3 id='usersfolder_root'>"+karutaStr[LANG]['active_users']+"</h3>";
		html += "			<h4 id='usersfolder_root'>";
		html += "				<span id='usersfolders-label' class='folder-label'>"+karutaStr[LANG]['users-folders']+"</span>&nbsp<span class='badge number_of_folders' id='nb_folders_active'></span>";
		html += "			</h4>";
		html += "			<div id='list-usersfolder_active' class=''></div>";
		html += "		</div><!--div id='usersfolders'-->";
		//--------------------USERS V2--------------------------------------
		html += "		<h3 id='users-in-rootgroup' style='display:none'>";
		html += "			<span id='users-label'>"+karutaStr[LANG]['active_users']+"</span>&nbsp<span class='users-nb badge' id='users-nb'></span>";
		html += "			<button class='btn list-btn' onclick=\"loadAndDisplayUsersgroupContent('group-users','0');$(window).scrollTop(0);\">"+ karutaStr[LANG]["see"] + "</button>";
		html += "		</h3>";
		html += "		<div id='usersgroup_0' class='xxxnested'></div>";
		html += "	</div><!--div id='userslist-leftside'-->";
		//-----------------------------------------------------------
		//-----------------------------------------------------------
		html += "	<div id='gutter'>&nbsp;</div>";
		//-----------------------------------------------------------
		html += "	<div id='userslist-rightside'>";
		html += "		<div id='"+type+"-folder-users' class='folder-users'></div>";
		html += "	</div><!--div id='userslist-rightside'-->";
		//-----------------------------------------------------------
		//-----------------------------------------------------------
		//-----------------------------------------------------------
		html += "	<div id='gutter'>&nbsp;</div>";
		//-----------------------------------------------------------
		html += "	<div id='usergroupslist-rightside'>";
		html += "		<div id='group-users'>";
		html += "		</div>";
		html += "	</div><!--div id='usergroupslist-rightside'-->";

		//-----------------------------------------------------------
		html += "	<div id='gutter'>&nbsp;</div>";

		//--------------------USERGROUPS V3---------------------------------------
		html += "	<div id='usergroupslist-leftside'>";
		html += "		<div id='usersgroups' class='tree user'>";
		html += "			<h3 id='usersgroup_root'>"+karutaStr[LANG]['list_usersgroups']+"</h3>";
		html += "			<h4 id='usersgroup_root'>";
		html += "				<span id='usersgroups-label' class='group-label'>"+karutaStr[LANG]['users-groups']+"</span>&nbsp<span class='badge number_of_groups' id='nb_groups_active'></span>";
		html += "				<span id='create-group-button' class='col-1'>";
		html += "					<span class='group-label btn' title='"+karutaStr[LANG]['create_group']+"'><i class='fas fa-group-plus' id='group-create' onclick=\"UIFactory.Usersgroup.callCreategroup('active');\"></i></span>";
		html += "				</span>";
		html += "			</h4>";
		html += "			<div id='usersgroup_active' class=''></div>";
		html += "		</div><!--div id='usersgroups'-->";
		html += "	</div><!--div id='usergrouplist-leftside'-->";

		html += "</div><!--div id='usergroup-body'-->";
		$("#main-usersgroup").html(html);

		initusersgroups();
//		UIFactory.UsersGroup.loadAndDisplayStruct('usersgroup_active','grouproot');
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

