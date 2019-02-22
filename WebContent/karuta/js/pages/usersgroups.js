
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
function fill_list_usersgroups()
//==============================
{
	setLanguageMenu("fill_list_usersgroups()");
	var html = "";
	html += "<span id='usersgroup-create' onclick=\"UIFactory['UsersGroup'].callCreate()\" >"+karutaStr[LANG]['create_usersgroup']+"</span>";
	html += "<h3 id='usersgroups-label'>"+karutaStr[LANG]['list_usersgroups']+"</h3>";
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
}

//==============================
function display_list_usersgroups()
//==============================
{
	if ($("#usersgroup-create").length) {
		show_list_usersgroups();
	} else {
		fill_list_usersgroups();
		show_list_usersgroups();
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

