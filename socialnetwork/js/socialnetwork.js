var g_elgg_key = "";
var g_elgg_user_groups = [];

//==================================
function loginElgg(username,password,callback)
//==================================
{
	var url = "../../../../"+elgg_url_base+"/services/api/rest/xml/?method=auth.gettoken&username="+username+"&password="+password;
	$.ajax({
		Accept: "json",
		dataType : "json",
		type : "POST",
		url : url,
		success : function(data) {
			var g_elgg_key = data.result;
			if (callback!=null)
				callback(g_elgg_key);
		}
	});
}

//==================================
function displaySocialNetwork(destid)
//==================================
{
//	g_elgg_user_groups = getUserGroups();
	var html = "";
	html += "<div class='hello'>"+snStr[LANG]['hello'] + " " + USER.firstname_node.text()+" "+USER.lastname_node.text()+"</div>";
	$("#"+destid+"-head").append($(html));
	$("#"+destid+"-head").append($("<div class='welcome-line'></div>"));
	html  = "<div class='row publish'>";
	html += "	<div class='col-md-4'><i class='fa fa-users'></i></div>";
	html += "	<div class='col-md-8'>";
	html += "		<div class='form-group'>";
	html += "			<label class='control-label' for='wire-message'>"+snStr[LANG]["something_to_publish"]+"</label>";
	html += "			<textarea class='form-control' rows='3' id='wire-message'></textarea>";
	html += "			<span class='dropdown dropdown-button'>";
	html += "				<span class='button' data-toggle='dropdown' type='button' aria-haspopup='true' aria-expanded='false'><span id='publish-group' value='0'>Public</span>&nbsp;<span class='caret'></span></span>";
	html += "				<ul class='dropdown-menu' role='menu' aria-labelledby='list-menu'>";
	html += "					<li><a value='0' label='Public' onclick=\"$('#publish-group').html('Public');$('#publish-group').attr('value','0');\" href='#'>Public</a></li>";
	html += "					<li><a value='1' label='Group1' onclick=\"$('#publish-group').html('Group1');$('#publish-group').attr('value','13');\" href='#'>Groupe1</a></li>";
	for (var i=0; i<g_elgg_user_groups.length; i++) {
		html += "				<li><a value='1' label='"+groups[i].label+"' onclick=\"$('#publish-group').html('"+groups[i].label+"');$('#publish-group').attr('value','"+groups[i].value+"');\" href='#'>Groupe1</a></li>";
	}
	html += "				</ul>";
	html += "			</span>";
	html += "			<span class='text-group'>"+snStr[LANG]["publish_on"]+"</span> ";
	html += "			<span onclick=\"postWire(getRiverFeed,'"+destid+"-body',$('#publish-group').attr('value'));\" class='publish-button'>"+snStr[LANG]["publish"]+"</span>";
	html += "		</div>";
	html += "	</div>";
	html += "</div>";
	$("#"+destid+"-head").append($(html));

	html = "<div class='panels'>";

	html += "	<ul class='nav nav-tabs' role='tablist'>";
	html += "		<li role='presentation' class='active'><a href='#activities' aria-controls='activities' role='tab' data-toggle='tab'>"+snStr[LANG]["activities"]+"</a></li>";
	html += "		<li role='presentation'><a href='#public' aria-controls='public' role='tab' data-toggle='tab'>"+snStr[LANG]["public"]+"</a></li>";
	html += "		<li role='presentation'><a href='#groups' aria-controls='groups' role='tab' data-toggle='tab'>"+snStr[LANG]["groups"]+"</a></li>";
	html += "	</ul>";

	  <!-- Tab panes -->
	html += "	<div class='tab-content'>";
	html += "		<div role='tabpanel' class='tab-pane active' id='activities'></div>";
	html += "		<div role='tabpanel' class='tab-pane' id='public'>...</div>";
	html += "		<div role='tabpanel' class='tab-pane' id='groups'>...</div>";
	html += "	</div>";

	html += "</div>";
	$("#"+destid+"-body").append($(html));
	getRiverFeed('activities');
}

//==================================
function getUserGroups()
//==================================
{
	$.ajax({
		Accept: "text/html",
		dataType : "json",
		type : "GET",
		url : "../../../"+elgg_url_base+"services/api/rest/xml/?method=site.user_groups",
		success : function(data) {
			return data;
		}
	});
	
}

//=================================================================================================
//=================================================================================================
//==========================================  RIVER  ==============================================
//=================================================================================================
//=================================================================================================

//==================================
function getRiverFeed(destid)
//==================================
{
	$.ajax({
		Accept: "json",
		dataType : "json",
		type : "GET",
		url : "../../../"+elgg_url_base+"services/api/rest/xml/?method=site.river_feed&limit=50",
		success : function(data) {
			displayWall("#"+destid,data);
		}
	});
	
}

//=================================================
function displayWall(dest,data)
//=================================================
{
	$(dest).html("");
	for (var i=0;i<data.result.length;i++){
		var view = data.result[i].view.replace(/\//g,"_");
//		try {
			eval(view+"('"+dest+"',data.result[i])");
//		} catch(e) {
//			eval("river_unknown('"+dest+"',data.result[i])");
//		}
	}
}

//=================================================
function getComments(node)
//=================================================
{
	var date = moment(node.time_updated);
	var html ="";
	html+= "<li class='elgg-item elgg-item-object elgg-item-object-comment'>";
	html+= "<div class='media elgg-body'>";
	html+= "	<div class='media-left'>";
	html+= "		<div class='elgg-avatar elgg-avatar-tiny'>";
	html+= "			<img src='"+node.owner.avatar_url+"'>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "	<div class='media-body'>";
	html+= "		<h5 class='media-heading'>";
	html+= "			"+node.owner.name+" ";
	html+= " 			<span class='elgg-river-timestamp'><acronym title='"+date.format('LLL')+"'>"+date.fromNow()+"</acronym></span>";
	html+= "		</h5>";
	html+= "		<div class='elgg-output elgg-inner'>"+node.description+"</div>";
	html+= "	</div>";
	html+= "</div>";
	html+= "</li>";
	return html;
}


//=================================================
function river_unknown(dest,node)
//=================================================
{
	var html ="";
	html+= "<div class='post river_unknown'>";
	html +="<img src='"+node.subject.avatar_url+"'> ";
	html +="<span>"+node.subject.name+" </span>";
	html +="<span> unknown action </span>";
	html+= "</div><!--post-->";
	$(dest).append($(html));

}


//=================================================
function river_user_default_profileiconupdate(dest,node)
//=================================================
{
	var date = moment(node.object.time_updated);
	var html ="";
	html+= "<li class='elgg-item'>";
	html+= "<div class='elgg-image-block elgg-river-item clearfix'>";
	html+= "	<div class='elgg-image'>";
	html+= "		<div class='elgg-avatar elgg-avatar-small'>";
	html+= "			<img src='"+node.subject.avatar_url+"'>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "	<div class='elgg-body'>";
	html+= "		<div class='media'>";
	html+= "			<div class='media-left'>";
	html+= "			</div>";
	html+= "			<div class='media-body'>";
	html+= "				<h5 class='media-heading'>";
	html+= "					<span class='elgg-river-subject'>"+node.subject.name+"</span> ";
	html+= 						snStr[LANG]['river_user_default_profileiconupdate'];
	html+= " 					<span class='elgg-river-timestamp'><acronym title='"+date.format('LLL')+"'>"+date.fromNow()+"</acronym></span>";
	html+= "				</h5>";
	html+= "				<div class='elgg-river-attachments clearfix'>";
	html+= "					<div class='elgg-avatar elgg-avatar-tiny'>";
	html+= "						<img src='"+node.subject.avatar_url+"'>";
	html+= "					</div>";
	html+= "				</div>";
	if (node.object.comments!=undefined) {
		html+= "<div class='elgg-river-responses'>";
		html+= "<ul class='elgg-list elgg-river-comments'>";
		for (var i=0;i<node.object.comments.length;i++) {
			html += getComments(node.object.comments[i]);
		}
		html+= "</ul>";
		html+= "</div>";
	}
	html+= "			</div><!-- class='media-body' -->";
	html+= "		</div><!-- class='media' -->";
	html+= "	</div><!-- class='elgg-body' -->";
	html+= "</div><!-- class='elgg-image-block elgg-river-item clearfix' -->";
	html+= "</li>";
	$(dest).append($(html));
}

//=================================================
function river_relationship_friend_create(dest,node)
//=================================================
{
	var date = moment(node.object.time_updated);
	var html ="";
	html+= "<li class='elgg-item'>";
	html+= "<div class='elgg-image-block elgg-river-item clearfix'>";
	html+= "	<div class='elgg-image'>";
	html+= "		<div class='elgg-avatar elgg-avatar-small'>";
	html+= "			<img src='"+node.subject.avatar_url+"'>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "	<div class='elgg-body'>";
	html+= "		<div class='media'>";
	html+= "			<div class='media-left'>";
	html+= "			</div>";
	html+= "			<div class='media-body'>";
	html+= "				<h5 class='media-heading'>";
	html+= "					<span class='elgg-river-subject'>"+node.subject.name+"</span> ";
	html+= 						snStr[LANG]['river_relationship_friend_create'];
	html+="                  	&nbsp;"+node.object.name;
	html+= " 					<span class='elgg-river-timestamp'><acronym title='"+date.format('LLL')+"'>"+date.fromNow()+"</acronym></span>";
	html+= "				</h5>";
	if (node.object.comments!=undefined) {
		html+= "<div class='elgg-river-responses'>";
		html+= "<ul class='elgg-list elgg-river-comments'>";
		for (var i=0;i<node.object.comments.length;i++) {
			html += getComments(node.object.comments[i]);
		}
		html+= "</ul>";
		html+= "</div>";
	}
	html+= "			</div><!-- class='media-body' -->";
	html+= "		</div><!-- class='media' -->";
	html+= "	</div><!-- class='elgg-body' -->";
	html+= "</div><!-- class='elgg-image-block elgg-river-item clearfix' -->";
	html+= "</li>";
	$(dest).append($(html));
}

//=================================================
function river_object_blog_create(dest,node)
//=================================================
{
	var date = moment(node.object.time_updated);
	var html ="";
	html+= "<li class='elgg-item'>";
	html+= "<div class='elgg-image-block elgg-river-item clearfix'>";
	html+= "	<div class='elgg-image'>";
	html+= "		<div class='elgg-avatar elgg-avatar-small'>";
	html+= "			<img src='"+node.subject.avatar_url+"'>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "	<div class='elgg-body'>";
	html+= "		<div class='media'>";
	html+= "			<div class='media-left'>";
	html+= "			</div>";
	html+= "			<div class='media-body'>";
	html+= "				<h5 class='media-heading'>";
	html+= "					<span class='elgg-river-subject'>"+node.subject.name+"</span> ";
	html+= 						snStr[LANG]['river_object_blog_create'];
	html+="                  	&nbsp;"+node.object.name;
	html+= " 					<span class='elgg-river-timestamp'><acronym title='"+date.format('LLL')+"'>"+date.fromNow()+"</acronym></span>";
	html+= "				</h5>";
	if (node.object.comments!=undefined) {
		html+= "<div class='elgg-river-responses'>";
		html+= "<ul class='elgg-list elgg-river-comments'>";
		for (var i=0;i<node.object.comments.length;i++) {
			html += getComments(node.object.comments[i]);
		}
		html+= "</ul>";
		html+= "</div>";
	}
	html+= "			</div><!-- class='media-body' -->";
	html+= "		</div><!-- class='media' -->";
	html+= "	</div><!-- class='elgg-body' -->";
	html+= "</div><!-- class='elgg-image-block elgg-river-item clearfix' -->";
	html+= "</li>";
	$(dest).append($(html));
}

//=================================================
function river_object_thewire_create(dest,node)
//=================================================
{
	var date = moment(node.object.time_updated);
	var html ="";
	html+= "<li class='elgg-item'>";
	html+= "<div class='elgg-image-block elgg-river-item clearfix'>";
	html+= "	<div class='elgg-image'>";
	html+= "		<div class='elgg-avatar elgg-avatar-small'>";
	html+= "			<img src='"+node.subject.avatar_url+"'>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "	<div class='elgg-body'>";
	html+= "		<div class='media'>";
	html+= "			<div class='media-left'>";
	html+= "			</div>";
	html+= "			<div class='media-body'>";
	html+= "				<h5 class='media-heading'>";
	html+= "					<span class='elgg-river-subject'>"+node.subject.name+"</span> ";
	html+= 						snStr[LANG]['river_object_thewire_create'];
	html+= " 					<span class='elgg-river-timestamp'><acronym title='"+date.format('LLL')+"'>"+date.fromNow()+"</acronym></span>";
	html+= "				</h5>";
	html+= " 					<div>"+node.object.description+"</div>";
	if (node.object.comments!=undefined) {
		html+= "<div class='elgg-river-responses'>";
		html+= "<ul class='elgg-list elgg-river-comments'>";
		for (var i=0;i<node.object.comments.length;i++) {
			html += getComments(node.object.comments[i]);
		}
		html+= "</ul>";
		html+= "</div>";
	}
	html+= "			</div><!-- class='media-body' -->";
	html+= "		</div><!-- class='media' -->";
	html+= "	</div><!-- class='elgg-body' -->";
	html+= "</div><!-- class='elgg-image-block elgg-river-item clearfix' -->";
	html+= "</li>";
	$(dest).append($(html));
}

//=================================================
function river_relationship_member_create(dest,node)
//=================================================
{
	var date = moment(node.object.time_updated);
	var html ="";
	html+= "<li class='elgg-item'>";
	html+= "<div class='elgg-image-block elgg-river-item clearfix'>";
	html+= "	<div class='elgg-image'>";
	html+= "		<div class='elgg-avatar elgg-avatar-small'>";
	html+= "			<img src='"+node.subject.avatar_url+"'>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "	<div class='elgg-body'>";
	html+= "		<div class='media'>";
	html+= "			<div class='media-left'>";
	html+= "			</div>";
	html+= "			<div class='media-body'>";
	html+= "				<h5 class='media-heading'>";
	html+= "					<span class='elgg-river-subject'>"+node.subject.name+"</span> ";
	html+= 						snStr[LANG]['river_relationship_member_create'];
	html+="                  	&nbsp;"+node.object.name;
	html+= " 					<span class='elgg-river-timestamp'><acronym title='"+date.format('LLL')+"'>"+date.fromNow()+"</acronym></span>";
	html+= "				</h5>";
	if (node.object.comments!=undefined) {
		html+= "<div class='elgg-river-responses'>";
		html+= "<ul class='elgg-list elgg-river-comments'>";
		for (var i=0;i<node.object.comments.length;i++) {
			html += getComments(node.object.comments[i]);
		}
		html+= "</ul>";
		html+= "</div>";
	}
	html+= "			</div><!-- class='media-body' -->";
	html+= "		</div><!-- class='media' -->";
	html+= "	</div><!-- class='elgg-body' -->";
	html+= "</div><!-- class='elgg-image-block elgg-river-item clearfix' -->";
	html+= "</li>";
	$(dest).append($(html));
}

//=================================================
function river_group_create(dest,node)
//=================================================
{
	var date = moment(node.object.time_updated);
	var html ="";
	html+= "<li class='elgg-item'>";
	html+= "<div class='elgg-image-block elgg-river-item clearfix'>";
	html+= "	<div class='elgg-image'>";
	html+= "		<div class='elgg-avatar elgg-avatar-small'>";
	html+= "			<img src='"+node.subject.avatar_url+"'>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "	<div class='elgg-body'>";
	html+= "		<div class='media'>";
	html+= "			<div class='media-left'>";
	html+= "			</div>";
	html+= "			<div class='media-body'>";
	html+= "				<h5 class='media-heading'>";
	html+= "					<span class='elgg-river-subject'>"+node.subject.name+"</span> ";
	html+= 						snStr[LANG]['river_group_create'];
	html+="                  	&nbsp;"+node.object.name;
	html+= " 					<span class='elgg-river-timestamp'><acronym title='"+date.format('LLL')+"'>"+date.fromNow()+"</acronym></span>";
	html+= "				</h5>";
	if (node.object.comments!=undefined) {
		html+= "<div class='elgg-river-responses'>";
		html+= "<ul class='elgg-list elgg-river-comments'>";
		for (var i=0;i<node.object.comments.length;i++) {
			html += getComments(node.object.comments[i]);
		}
		html+= "</ul>";
		html+= "</div>";
	}
	html+= "			</div><!-- class='media-body' -->";
	html+= "		</div><!-- class='media' -->";
	html+= "	</div><!-- class='elgg-body' -->";
	html+= "</div><!-- class='elgg-image-block elgg-river-item clearfix' -->";
	html+= "</li>";
	$(dest).append($(html));
}

//=================================================
function river_object_status_create(dest,node)
//=================================================
{
	var date = moment(node.object.time_updated);
	var html ="";
	html+= "<li class='elgg-item'>";
	html+= "<div class='elgg-image-block elgg-river-item clearfix'>";
	html+= "	<div class='elgg-image'>";
	html+= "		<div class='elgg-avatar elgg-avatar-small'>";
	html+= "			<img src='"+node.subject.avatar_url+"'>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "	<div class='elgg-body'>";
	html+= "		<div class='media'>";
	html+= "			<div class='media-left'>";
	html+= "			</div>";
	html+= "			<div class='media-body'>";
	html+= "				<h5 class='media-heading'>";
	html+= "					<span class='elgg-river-subject'>"+node.subject.name+"</span> ";
	html+= 						snStr[LANG]['river_object_status_create'];
	html+= " 					<span class='elgg-river-timestamp'><acronym title='"+date.format('LLL')+"'>"+date.fromNow()+"</acronym></span>";
	html+= "				</h5>";
	html+= " 					<div>"+node.object.description+"</div>";
	if (node.object.comments!=undefined) {
		html+= "<div class='elgg-river-responses'>";
		html+= "<ul class='elgg-list elgg-river-comments'>";
		for (var i=0;i<node.object.comments.length;i++) {
			html += getComments(node.object.comments[i]);
		}
		html+= "</ul>";
		html+= "</div>";
	}
	html+= "			</div><!-- class='media-body' -->";
	html+= "		</div><!-- class='media' -->";
	html+= "	</div><!-- class='elgg-body' -->";
	html+= "</div><!-- class='elgg-image-block elgg-river-item clearfix' -->";
	html+= "</li>";
	$(dest).append($(html));
}


//=================================================================================================
//=================================================================================================
//==========================================  BLOG  ===============================================
//=================================================================================================
//=================================================================================================

//==================================
function postWire(callback,param1)
//==================================
{
	var message = document.getElementById("wire-message").value;
	$.ajaxSetup({
		Accept: "application/xml",
		contentType: "application/xml"
		});
	$.ajax({
		type : "POST",
		dataType : "json",
		url : "../../../"+elgg_url_base+"services/api/rest/xml/?auth_token="+g_elgg_key+"&method=thewire.post&text="+message,
		data: message,
		success : function(data) {
			document.getElementById("wire-message").value = '';
			if (callback!=null)
				callback(param1);
		}
	});
}

//==================================
function getBlog()
//==================================
{
	$.ajax({
		Accept: "text/html",
		dataType : "json",
		type : "GET",
		url : "../../../"+elgg_url_base+"services/api/rest/xml/?method=thewire.get_posts&auth_token="+g_elgg_key+"&context=all",
		success : function(data) {
			displayBlog("#reseausocial",data);
		}
	});
}

//=================================================
function displayBlog(dest,data)
//=================================================
{
	$(dest).html("");
	for (var i=0;i<data.result.length;i++){
		microblog_display(dest,data.result[i]);
	}
}

//=================================================
function microblog_display(dest,node)
//=================================================
{
	var date = moment.unix(node.time_created);
	var html ="";
	html+= "<li class='elgg-item'>";
	html+= "<div class='elgg-image-block elgg-river-item clearfix'>";
	html+= "	<div class='elgg-image'>";
	html+= "		<div class='elgg-avatar elgg-avatar-small'>";
	html+= "			<img src='"+node.owner.avatar_url+"'>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "	<div class='elgg-body'>";
	html+= "		<div class='elgg-river-summary'>";
	html+= "			"+node.owner.name+" ";
	html+= 				snStr[LANG]['river_object_thewire_create'];
	html+= " 			<span class='elgg-river-timestamp'><acronym title='"+date.format('LLL')+"'>"+date.fromNow()+"</acronym></span>";
	html+= "		</div>";
	html+= "		<div class='elgg-river-message'>"+node.description+"</div>";
	html+= "	</div>";
	html+= "</div>";
	html+= "</li>";
	$(dest).append($(html));
}

