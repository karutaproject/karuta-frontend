

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
	var url = "../../../"+serverBCK+"/portfoliogroups?group=" + elt.value + "&uuid="+uuid;
	$.ajax({
		type : type,
		dataType : "text",
		url : url,
		data : "",
		success : function(data) {
			$("#uuid_"+uuid+"-list_groups-form-update").prop('value', '1');
		},
		error : function(jqxhr,textStatus) {
			alertHTML("Error : "+jqxhr.responseText);
			if(type=='DELETE') 
				$(elt).prop('checked', true);
		}
	});
}
