var g_elgg_key = "";


//==================================
function loginElgg(username,password,callback,param1,param2)
//==================================
{
	var url = "../../../"+elgg_url_base+"/services/api/rest/xml/?method=auth.gettoken&username="+username+"&password="+password;
	$.ajax({
		Accept: "text/html",
		dataType : "xml",
		type : "POST",
		url : url,
		success : function(data) {
			g_elgg_key = ("result",data).txt();
			if (callback!=null)
				callback(param1,param2);
		}
	});
}


	
	

//=================================================================================================
//=================================================================================================
//==========================================  RIVER  ==============================================
//=================================================================================================
//=================================================================================================

//==================================
function getRiverFeed()
//==================================
{
	$.ajax({
		Accept: "text/html",
		dataType : "json",
		type : "GET",
		url : "../../../"+elgg_url_base+"/services/api/rest/xml/?method=site.river_feed&limit=50",
		success : function(data) {
			displayWall("#reseausocial",data);
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
		try {
			eval(view+"('"+dest+"',data.result[i])");
		} catch(e) {
			eval("river_unknown('"+dest+"',data.result[i])");
		}
	}
}

//=================================================
function river_unknown(dest,node)
//=================================================
{
	var html ="";
	html+= "<div class='post river_unknown'>";
	html +="<img src='"+node.subject_metadata.avatar_url+"'> ";
	html +="<span>"+node.subject_metadata.name+" </span>";
	html +="<span> unknown action </span>";
	html+= "</div><!--post-->";
	$(dest).append($(html));

}


//=================================================
function river_user_default_profileiconupdate(dest,node)
//=================================================
{
	var date = moment.unix(node.posted);
	var html ="";
	html+= "<li class='elgg-item'>";
	html+= "<div class='elgg-image-block elgg-river-item clearfix'>";
	html+= "	<div class='elgg-image'>";
	html+= "		<div class='elgg-avatar elgg-avatar-small'>";
	html+= "			<img src='"+node.subject_metadata.avatar_url+"'>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "	<div class='elgg-body'>";
	html+= "		<div class='elgg-river-summary'>";
	html+= "			"+node.subject_metadata.name+" ";
	html+= snStr[LANG]['river_user_default_profileiconupdate'];
	html+= " 			<span class='elgg-river-timestamp'><acronym title='"+date.format('LLL')+"'>"+date.fromNow()+"</acronym></span>";
	html+= "		</div>";
	html+= "		<div class='elgg-river-attachments clearfix'>";
	html+= "			<div class='elgg-avatar elgg-avatar-tiny'>";
	html+= "				<img src='"+node.subject_metadata.avatar_url+"'>";
	html+= "			</div>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "</div>";
	html+= "</li>";
	$(dest).append($(html));
}

//=================================================
function river_relationship_friend_create(dest,node)
//=================================================
{
	var date = moment.unix(node.posted);
	var html ="";
	html+= "<div class='post river_relationship_friend_create'>";
	html +="<img src='"+node.subject_metadata.avatar_url+"'> ";
	html +="<span>"+node.subject_metadata.name+" </span>";
	html +="<span>"+snStr[LANG]['river_relationship_friend_create']+" </span>";
	html +="<span>"+node.object_metadata.name+" </span>";
	html+= "</div><!--post-->";
	$(dest).append($(html));

}

//=================================================
function river_object_blog_create(dest,node)
//=================================================
{
	var date = moment.unix(node.posted);
	var html ="";
	html +="<img src='"+node.subject_metadata.avatar_url+"'> ";
	html +="<span>"+node.subject_metadata.name+" </span>";
	html +="<span>"+snStr[LANG]['river_object_blog_create']+" </span>";
	html +="<span>"+node.object_metadata.name+" </span>";
	html+= "</li><!--elgg-item-->";
	$(dest).append($(html));

}

//=================================================
function river_object_thewire_create(dest,node)
//=================================================
{
	var date = moment.unix(node.posted);
	var html ="";
	html+= "<li class='elgg-item'>";
	html+= "<div class='elgg-image-block elgg-river-item clearfix'>";
	html+= "	<div class='elgg-image'>";
	html+= "		<div class='elgg-avatar elgg-avatar-small'>";
	html+= "			<img src='"+node.subject_metadata.avatar_url+"'>";
	html+= "		</div>";
	html+= "	</div>";
	html+= "	<div class='elgg-body'>";
	html+= "		<div class='elgg-river-summary'>";
	html+= "			"+node.subject_metadata.name+" ";
	html+= 				snStr[LANG]['river_object_thewire_create'];
	html+= " 			<span class='elgg-river-timestamp'><acronym title='"+date.format('LLL')+"'>"+date.fromNow()+"</acronym></span>";
	html+= "		</div>";
	html+= "		<div class='elgg-river-message'>"+node.object_metadata.description+"</div>";
	html+= "	</div>";
	html+= "</div>";
	html+= "</li>";
	$(dest).append($(html));
}

//=================================================
function river_relationship_member_create(dest,node)
//=================================================
{
	var date = moment.unix(node.posted);
	var html ="";
	html+= "<div class='post river_relationship_member_create'>";
	html +="<img src='"+node.subject_metadata.avatar_url+"'> ";
	html +="<span>"+node.subject_metadata.name+" </span>";
	html +="<span>"+snStr[LANG]['river_relationship_member_create']+" </span>";
	html +="<span>"+node.object_metadata.name+" </span>";
	html+= "</div><!--post-->";
	$(dest).append($(html));

}



//=================================================
function river_group_create(dest,node)
//=================================================
{
	var html ="";
	html+= "<div class='post river_group_create'>";
	html +="<img src='"+node.subject_metadata.avatar_url+"'> ";
	html +="<span>"+node.subject_metadata.name+" </span>";
	html +="<span>"+snStr[LANG]['river_group_create']+" </span>";
	html +="<span>"+node.object_metadata.name+" </span>";
	html+= "</div><!--post-->";
	$(dest).append($(html));

}

//=================================================================================================
//=================================================================================================
//==========================================  BLOG  ===============================================
//=================================================================================================
//=================================================================================================

//==================================
function postWire()
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
		url : "../../../"+elgg_url_base+"/services/api/rest/xml/?auth_token="+g_elgg_key+"&method=thewire.post&text="+message,
		data: message,
		success : function(data) {
			getBlog();
//			getRiverFeed();
			document.getElementById("wire-message").value = '';
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
		url : "../../../"+elgg_url_base+"/services/api/rest/xml/?method=thewire.get_posts&auth_token="+g_elgg_key+"&context=all",
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

