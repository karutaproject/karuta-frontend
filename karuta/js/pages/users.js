

//==============================
function show_list_users()
//==============================
{
	
	changeCss("body", "background-color:#e0006d;");
	changeCss("a.navbar-icon .glyphicon", "color:"+navbar_icon_color+";");
	var navbar_html = getNavBar('list',null);
	$("#navigation-bar").html(navbar_html);
	$("#refresh").attr("onclick","display_list_users()");
	$("#refresh").show();
	$("#main-list").hide();
	$("#main-page").hide();
	$("#main-user").show();
}

//==============================
function display_list_users()
//==============================
{
	
	changeCss("body", "background-color:#e0006d;");
	changeCss("a.navbar-icon .glyphicon", "color:"+navbar_icon_color+";");
	var navbar_html = getNavBar('list',null);
	$("#navigation-bar").html(navbar_html);
	$("#refresh").attr("onclick","display_list_users()");
	$("#refresh").show();
	$("#main-list").hide();
	$("#main-page").hide();
	$("#main-user").show();

	var html = "";
	html += "<span id='user-create' onclick=\"UIFactory['User'].callCreate()\" >"+karutaStr[LANG]['create_user']+"</span>";
	html += "<h3>"+karutaStr[LANG]['active_users']+"</h3>";
	html += "<div  id='active'>";
	html += "	<img src='../../karuta/img/ajax-loader.gif'><br>";
	html += "	<h4>"+karutaStr[LANG]['loading']+"</h4>";
	html += "</div>";
	html += "<h3>"+karutaStr[LANG]['inactive_users']+"</h3>";
	html += "<div  id='inactive'>";
	html += "	<img src='../../karuta/img/ajax-loader.gif'><br>";
	html += "	<h4>"+karutaStr[LANG]['loading']+"</h4>";
	html += "</div>";
	$("#main-user").html(html);
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/credential",
		data: "",
		success : function(data) {
			USER = new UIFactory["User"]($("user",data));
//			loadLanguages(function(data) {$("#navigation_bar").html(getNavBar('users',null));$("#menu").html(getMenu());$("#list").html(getListUsers());});
			//----------------
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/users",
				success : function(data) {
					UIFactory["User"].parse(data);
					UIFactory["User"].displayActive('active','list');
					UIFactory["User"].displayInactive('inactive','list');
				}
			});
			//----------------
		},
		error : function(jqxhr,textStatus) {
			loadLanguages(function(data) {alertHTML(karutaStr[LANG]['not-logged']);});
			window.location="login.htm?lang="+LANG;
		}
	});
	$.ajaxSetup({async: true});

}
