
//==============================
function show_list_users()
//==============================
{
	$("body").removeClass();
	$("body").addClass("list-users")
	$("#sub-bar").html("");
	setLanguageMenu("fill_list_users()");
	$("#refresh").attr("onclick","fill_list_users()");
	$("#search-div").hide();
	$("#refresh").show();
	$("#main-list").hide();
	$("#main-portfoliosgroup").hide();
	$("#main-page").hide();
	$("#main-user").show();
	$("#main-usersgroup").hide();
	$("#main-exec-batch").hide();
	$("#main-exec-report").hide();
}

//==============================
function fill_list_users()
//==============================
{
	var html = "";
	html += "<span id='user-create' onclick=\"UIFactory['User'].callCreate()\" >"+karutaStr[LANG]['create_user']+"</span>";
	html += "<h3 id='active-users'>"+karutaStr[LANG]['active_users']+"</h3>";
	html += "<div  id='active'>";
	html += "</div>";
	html += "<h3 id='inactive-users'>"+karutaStr[LANG]['inactive_users']+"</h3>";
	html += "<div  id='inactive'>";
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

//==============================
function display_list_users()
//==============================
{
	if ($("#user-create").length) {
		show_list_users();
	} else {
		fill_list_users();
		show_list_users();
	}
}
