
//==============================
function show_list_portfoliosgroups()
//==============================
{
	hideAllPages();

	$("body").removeClass();
	$("body").addClass("list-portfoliosgroups")
	$("#sub-bar").html("");
	setLanguageMenu("fill_list_portfoliosgroups()");
	$("#refresh").attr("onclick","fill_list_portfoliosgroups()");
	$("#refresh").show();
	$("#main-portfoliosgroup").show();
	
}

//==============================
function fill_list_portfoliosgroups()
//==============================
{
	setLanguageMenu("fill_list_portfoliosgroups()");
	$("#wait-window").show();
	var html = "";
	html += "<span id='portfoliosgroup-create' onclick=\"UIFactory['PortfoliosGroup'].callCreate()\" >"+karutaStr[LANG]['create_portfoliosgroup']+"</span>";
	html += "<h3 id='portfoliosgroups-label'>"+karutaStr[LANG]['list_portfoliosgroups']+"</h3>";
	html += "<div class='warning-list'>"+karutaStr[LANG]['note-list_portfoliosgroups']+ "</div>";
	html += "<div  id='portfoliosgroups'>";
	html += "</div>";
	$("#main-portfoliosgroup").html(html);
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliogroups",
		data: "",
		success : function(data) {
			UIFactory["PortfoliosGroup"].parse(data);
			UIFactory["PortfoliosGroup"].displayGroups('portfoliosgroups','list');
			$("#wait-window").hide();
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
	var url = serverBCK_API+"/portfoliogroups?group="+gid+"&uuid="+uuid;
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
function updateRRGroup_Users(groupid,users,xml,type,attribute,portfolioid)
//==============================
{
	if (groupid!=null) {
		if (type=='share'){
			var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
			if (xml.length>20) {
				$.ajax({
					type : "POST",
					contentType: "application/xml",
					dataType : "xml",
					url : url,
					data : xml,
					success : function(data) {
						if (portfolioid!=null) {
							$.ajax({
								type : "GET",
								dataType : "xml",
								url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
								success : function(data) {
									UIFactory["Portfolio"].displayUnSharing('shared',data);
								},
								error : function(jqxhr,textStatus) {
									alertHTML("Error in updateRRGroup_Users : "+jqxhr.responseText);
								}
							});
						}
					}
				});
			}
		} else if (type=='unshare'){
			var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/";
			for (var i=0; i<users.length; i++){
				var userid = $(users[i]).attr(attribute);
				$.ajax({
					type : "DELETE",
					contentType: "application/xml",
					dataType : "xml",
					url : url+userid,
					data : "",
					success : function(data) {
						if (portfolioid!=null) {
							$.ajax({
								type : "GET",
								dataType : "xml",
								url : serverBCK_API+"/rolerightsgroups/all/users?portfolio="+portfolioid,
								success : function(data) {
									UIFactory["Portfolio"].displayUnSharing('shared',data);
								},
								error : function(jqxhr,textStatus) {
									alertHTML("Error in updateRRGroup_Users : "+jqxhr.responseText);
								}
							});
						}
					}
				});
			}
		}
	}
}

