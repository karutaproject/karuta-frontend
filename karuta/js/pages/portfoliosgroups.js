

//==============================
function show_list_portfoliosgroups()
//==============================
{
	changeCss("body", "background-color:#e0006d;");
	changeCss("a.navbar-icon .glyphicon", "color:"+navbar_icon_color+";");
	var navbar_html = getNavBar('list',null);
	$("#navigation-bar").html(navbar_html);
	$("#refresh").attr("onclick","fill_list_portfoliosgroups()");
	$("#refresh").show();
	$("#main-list").hide();
	$("#main-portfoliosgroup").show();
	$("#main-page").hide();
	$("#main-user").hide();
	$("#main-usersgroup").hide();
	$("#main-exec-batch").hide();
	$("#main-exec-report").hide();
}

//==============================
function fill_list_portfoliosgroups()
//==============================
{
	var html = "";
	html += "<span id='portfoliosgroup-create' onclick=\"UIFactory['PortfoliosGroup'].callCreate()\" >"+karutaStr[LANG]['create_group']+"</span>";
	html += "<h3 id='portfoliosgroups-label'>"+karutaStr[LANG]['list_portfoliosgroups']+"</h3>";
	html += "<div  id='portfoliosgroups'>";
	html += "	<img src='../../karuta/img/ajax-loader.gif'><br>";
	html += "	<h4>"+karutaStr[LANG]['loading']+"</h4>";
	html += "</div>";
	$("#main-portfoliosgroup").html(html);
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfoliogroups",
		data: "",
		success : function(data) {
			UIFactory["PortfoliosGroup"].parse(data);
			UIFactory["PortfoliosGroup"].displayGroups('portfoliosgroups','list');
			//----------------
		},
		error : function(jqxhr,textStatus) {
//			alertHTML("Error : "+jqxhr.responseText);
			loadLanguages(function(data) {alertHTML(karutaStr[LANG]['not-logged']);});
			window.location="login.htm?lang="+LANG;
		}
	});
	$.ajaxSetup({async: true});
}

//==============================
function display_list_portfoliosgroups()
//==============================
{
	if ($("#portfoliosgroup-create").length) {
		show_list_portfoliosgroups();
	} else {
		fill_list_portfoliosgroups();
		show_list_portfoliosgroups();
	}
}

//==============================
function updateGroup_Portfolio(elt)
//==============================
{
	var type = 'DELETE';
	if(elt.checked) type='PUT';
	var uuid = $(elt).attr("uuid");
	var gid = elt.value;
	var url = "../../../"+serverBCK+"/portfoliogroups?group="+gid+"&uuid="+uuid;
	$.ajax({
		type : type,
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			$("#uuid_"+uuid+"-list_groups-form-update").prop('value', '1');
			PortfoliosGroups_byid[gid].members = [];
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error : "+jqxhr.responseText);
			if(type=='DELETE') 
				$(elt).prop('checked', true);
		}
	});
}

//==============================
function testGroup_Empty(destid,gid)
//==============================
{
	var items = $("div[class='row']",$("#"+destid+gid+'-list_items'));
	if (items.length==0)
		$("#"+destid+gid).html("<h5>"+karutaStr[LANG]['empty-group']+"</h5>");
}

//==============================
function updateRRGroup_UsersGroups(groupid,usersgroups,type)
//==============================
{
	if (groupid!=null) {
		var urlS = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
		var urlU = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/";
		for (var i=0; i<usersgroups.length; i++){
			var gid = $(usersgroups[i]).attr('value');
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/usersgroups?group="+gid,
				success : function(data) {
					if (type=='share'){
						var xml = $($("group",data)[0]).html();
						$.ajax({
							type : "POST",
							contentType: "application/xml",
							dataType : "xml",
							url : urlS,
							data : xml,
							success : function(data) {
							}
						});
					} else if (type=='unshare'){
						var users = $("user",data);
						for (var j=0; j<users.length; j++){
							var userid = $(users[j]).attr('id');
							$.ajax({
								type : "DELETE",
								contentType: "application/xml",
								dataType : "xml",
								url : urlU+userid,
								data : "",
								success : function(data) {
								}
							});
						}
					}

					//--------------------------
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error in updateRRGroup_UsersGroups : "+"group-"+gid+":"+jqxhr.responseText);
				}
			});
		}
	}
}

//==============================
function updateRRGroup_Users(groupid,users,type)
//==============================
{
	if (groupid!=null) {
		if (type=='share'){
			var url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
			var xml = "<users>";
			for (var i=0; i<users.length; i++){
				var userid = $(users[i]).attr('value');
				xml += "<user id='"+userid+"'/>";
			}
			xml += "</users>";
			if (xml.length>20) {
				$.ajax({
					type : "POST",
					contentType: "application/xml",
					dataType : "xml",
					url : url,
					data : xml,
					success : function(data) {
					}
				});
			}
		} else if (type=='unshare'){
			var url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/";
			for (var i=0; i<users.length; i++){
				var userid = $(users[i]).attr('value');
				$.ajax({
					type : "DELETE",
					contentType: "application/xml",
					dataType : "xml",
					url : url+userid,
					data : "",
					success : function(data) {
					}
				});
			}
		}
	}
}

