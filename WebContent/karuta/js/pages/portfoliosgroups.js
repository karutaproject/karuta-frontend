
//==============================
function show_list_portfoliosgroups()
//==============================
{
	hideAllPages();

	$("body").removeClass();
	$("body").addClass("list-portfoliosgroups")
	$("#sub-bar").html("");
	setLanguageMenu("fill_list_portfoliosgroups()");
	$("#main-portfoliosgroup").show();
	
}

//==============================
function fill_list_portfoliosgroups()
//==============================
{
	setLanguageMenu("fill_list_portfoliosgroups()");
	$("#wait-window").show();
	//--------------------------
	var html = "";
	//-----------------------------------------------------------
	html += "<div id='portfoliogroup-body'>";
	//------------------------------------------
	html += "	<div id='portfoliogroup-portfolio-leftside'  class='leftside'>";
	html += "		<div id='portfoliogroup-portfolio-refresh' class='refresh fas fa-sync-alt' onclick='fill_list_portfoliosgroups()' data-title='"+karutaStr[LANG]["button-reload"]+"' data-toggle='tooltip' data-placement='bottom'></div>";
	html += "		<div id='portfoliogroup-portfolio-search' class='search'></div>";
	html += "		<h3 class='title'>";
	html += "			<span id='folders-label' class='folder-label'>"+karutaStr[LANG]['folders']+"</span>";
	html += "		</h3>";
	html += "		<div id='portfoliogroup-portfolio-leftside-content1' class='content1 tree'></div>";
	html += "		<div id='portfoliogroup-portfolio-leftside-content2' class='content2'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "	<div class='gutter'>&nbsp;</div>";
	//------------------------------------------
	html += "	<div id='portfoliogroup-portfolio-rightside' class='rightside'>";
	html += "		<div id='portfoliogroup-portfolio-search' class='search'></div>";
	html += "		<div id='portfoliogroup-portfolio-rightside-title' class='title'></div>";
	html += "		<div id='portfoliogroup-portfolio-rightside-header' class='header'></div>";
	html += "		<div id='portfoliogroup-portfolio-rightside-content1' class='content1'></div>";
	html += "		<div id='portfoliogroup-portfolio-rightside-navbar-pages-top' class='navbar-pages' style='display:none'></div>";
	html += "		<div id='portfoliogroup-portfolio-rightside-content2' class='content2'></div>";
	html += "		<div id='portfoliogroup-portfolio-rightside-navbar-pages-bottom' class='navbar-pages' style='display:none'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "	<div class='gutter'>&nbsp;</div>";
	//------------------------------------------
	html += "	<div id='portfoliogroup-rightside' class='rightside'>";
	html += "		<div id='portfoliogroup-search' class='search'></div>";
	html += "		<div id='portfoliogroup-rightside-title' class='title'></div>";
	html += "		<div id='portfoliogroup-rightside-header' class='header'></div>";
	html += "		<div id='portfoliogroup-rightside-content1' class='content1'></div>";
	html += "		<div id='portfoliogroup-rightside-navbar-pages-top' class='navbar-pages' style='display:none'></div>";
	html += "		<div id='portfoliogroup-rightside-content2' class='content2'></div>";
	html += "		<div id='portfoliogroup-rightside-navbar-pages-bottom' class='navbar-pages' style='display:none'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "	<div class='gutter'>&nbsp;</div>";
	//------------------------------------------
	html += "	<div id='portfoliogroup-leftside'  class='leftside'>";
	html += "		<div id='menu'></div>";
	html += "		<h3 class='title'>";
	html += "			<span id='folders-label' class='folder-label'>"+karutaStr[LANG]['list_portfoliosgroups']+"</span>&nbsp<span class='badge number_of_folders' id='nb_folders_active'></span>";
	html += "			<span class='folder-label btn'><i class='fas fa-folder-plus' id='folder-create' onclick=\"UIFactory.PortfoliosGroup.callCreateGroup();\"></i></span>";
	html += "		</h3>";
	html += "		<div id='portfoliogroup-leftside-content1' class='content1 tree'></div>";
	html += "		<div id='portfoliogroup-leftside-content2' class='content2'></div>";
	html += "	</div>";
	//------------------------------------------
	html += "</div>";
	//-----------------------------------------------------------
	$("#main-portfoliosgroup").html(html);
	UIFactory.PortfolioFolder.displayPortfolioSearch("portfoliogroup-portfolio",true);	
	UIFactory.PortfoliosGroup.loadAndDisplayAll('portfoliogroup');
	UIFactory.PortfolioFolder.displayAll('portfoliogroup-portfolio'); // already loaded
}

//==============================
function display_list_portfoliosgroups()
//==============================
{
	if ($("#portfoliogroup-body").length) {
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

