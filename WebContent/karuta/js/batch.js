/* =======================================================
	Copyright 2014 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://opensource.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */

var trace = false;
var g_xmlDoc = null;
var g_json = null;
var g_trees = {};
var g_noline = 0;
//-----------------------
var g_create_users = null;
var g_nb_createUser = new Array();
//-----------------------
var g_delete_users = null;
var g_nb_deleteUser = new Array();
//-----------------------
var g_create_elgg_users = null;
var g_nb_createElggUser = new Array();
//-----------------------
var g_join_elgg_goups = null;
var g_nb_joinElggGroup = new Array();
//-----------------------
var g_create_elgg_groups = null;
var g_nb_createElggGroup = new Array();
//-----------------------
var g_create_trees = null;
var g_nb_createTree = new Array();
//-----------------------
var g_select_trees = null;
var g_nb_selectTree = new Array();
//-----------------------
var g_copy_trees = null;
var g_nb_copyTree = new Array();
//-----------------------
var g_update_resources = null;
var g_nb_updateResource = new Array();
//-----------------------
var g_update_tree_roots = null;
var g_nb_updateTreeRoot = new Array();
//-----------------------
var g_share_trees = null;
var g_nb_shareTree = new Array();
//-----------------------
var g_unshare_trees = null;
var g_nb_unshareTree = new Array();
//-----------------------
var g_delete_trees = null;
var g_nb_deleteTree = new Array();
//-----------------------
var g_import_nodes = null;
var g_nb_importNode = new Array();
//-----------------------
var g_join_usergroups = null;
var g_nb_joinUserGroup = new Array();
//-----------------------
var g_leave_usergroups = null;
var g_nb_leaveUserGroup = new Array();
//-----------------------
var g_share_usergroup = null;
var g_nb_shareUserGroup = new Array();
//-----------------------
var g_unshare_usergroup = null;
var g_nb_unshareUserGroup = new Array();
//-----------------------

//==================================
function initBatchVars()
//==================================
{
	g_xmlDoc = null;
	g_json = null;
	g_trees = {};
	g_noline = 0;
	//-----------------------
	g_create_users = null;
	g_nb_createUser = new Array();
	//-----------------------
	g_delete_users = null;
	g_nb_deleteUser = new Array();
	//-----------------------
	g_create_elgg_users = null;
	g_nb_createElggUser = new Array();
	//-----------------------
	g_join_elgg_goups = null;
	g_nb_joinElggGroup = new Array();
	//-----------------------
	g_create_elgg_groups = null;
	g_nb_createElggGroup = new Array();
	//-----------------------
	g_create_trees = null;
	g_nb_createTree = new Array();
	//-----------------------
	g_select_trees = null;
	g_nb_selectTree = new Array();
	//-----------------------
	g_copy_trees = null;
	g_nb_copyTree = new Array();
	//-----------------------
	g_update_resources = null;
	g_nb_updateResource = new Array();
	//-----------------------
	g_update_tree_roots = null;
	g_nb_updateTreeRoot = new Array();
	//-----------------------
	g_share_trees = null;
	g_nb_shareTree = new Array();
	//-----------------------
	g_ushare_trees = null;
	g_nb_unshareTree = new Array();
	//-----------------------
	g_delete_trees = null;
	g_nb_deleteTree = new Array();
	//-----------------------
	g_import_nodes = null;
	g_nb_importNode = new Array();
	//-----------------------
	g_join_usergroups = null;
	g_nb_joinUserGroup = new Array();
	//-----------------------
	g_leave_usergroups = null;
	g_nb_leaveUserGroup = new Array();
	//-----------------------
	g_share_usergroup = null;
	g_nb_shareUsergroup = new Array();
	//-----------------------
	g_unshare_usergroup = null;
	g_nb_unshareUserGroup = new Array();
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//==================================
function getTxtvals(node)
//==================================
{
	var str = "";
	var txtvals = $("txtval",node);
	for (var i=0; i<txtvals.length; i++){
		var select = $(txtvals[i]).attr("select");
		var text = "";
		if (select!=undefined && select!="") {
			if (select.indexOf("//")>-1)
				text = eval("g_json."+select.substring(2));
			else
				text = eval("g_json.lines["+g_noline+"]."+select);
		} else {
			text = $(txtvals[i]).text();
		}
		str += text;
	}
	return str;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processAll()
//=================================================
{
	$.ajaxSetup({async: false});
	g_create_elgg_groups = $("create-elgg-group",g_xmlDoc);
	g_create_users = $("create-user",g_xmlDoc);
	g_delete_users = $("delete-user",g_xmlDoc);
	g_create_elgg_users = $("create-elgg-user",g_xmlDoc);
	g_join_elgg_goups = $("join-elgg-group",g_xmlDoc);
	g_create_trees = $("create-tree",g_xmlDoc);
	g_select_trees = $("select-tree",g_xmlDoc);
	g_copy_trees = $("copy-tree",g_xmlDoc);
	g_update_resources = $("update-resource",g_xmlDoc);
	g_share_trees = $("share-tree",g_xmlDoc);
	g_unshare_trees = $("unshare-tree",g_xmlDoc);
	g_delete_trees = $("delete-tree",g_xmlDoc);
	g_import_nodes = $("import-node",g_xmlDoc);
	g_update_tree_roots = $("update-tree-root",g_xmlDoc);
	g_join_usergroups = $("join-usergroup",g_xmlDoc);
	g_leave_usergroups = $("leave-usergroup",g_xmlDoc);
	g_share_usergroup = $("share-usergroup",g_xmlDoc);
	g_unshare_usergroup = $("unshare-usergroup",g_xmlDoc);
	processLine();
}

//=================================================
function processLine()
//=================================================
{
	g_nb_createElggGroup[g_noline] = 0;
	g_nb_createUser[g_noline] = 0;
	g_nb_deleteUser[g_noline] = 0;
	g_nb_createElggUser[g_noline] = 0;
	g_nb_joinElggGroup[g_noline] = 0;
	g_nb_createTree[g_noline] = 0;
	g_nb_selectTree[g_noline] = 0;
	g_nb_copyTree[g_noline] = 0;
	g_nb_updateResource[g_noline] = 0;
	g_nb_updateTreeRoot[g_noline] = 0;
	g_nb_shareTree[g_noline] = 0;
	g_nb_unshareTree[g_noline] = 0;
	g_nb_deleteTree[g_noline] = 0;
	g_nb_importNode[g_noline] = 0;
	g_nb_joinUserGroup[g_noline] = 0;
	g_nb_leaveUserGroup[g_noline] = 0;
	g_nb_shareUserGroup[g_noline] = 0;
	g_nb_unshareUserGroup[g_noline] = 0;
	$("#batch-log").append("<br>================ LINE "+(g_noline+1)+" =========================================");
	processElggGroups();
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------------------------- Elgg Group -------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processElggGroups()
//=================================================
{
	if (g_create_elgg_groups.length==0)
		processUsers();
	else {
		$("#batch-log").append("<br>---------------------create_elgg_groups-------------------------------");
		for  (var j=0; j<g_create_elgg_groups.length; j++) {
			createElggGroup(g_create_elgg_groups[j]);
		}
	}
}

//=================================================
function createElggGroup(node)
//=================================================
{
	var group = getTxtvals($("group",node));
	var callback = function (param1){	g_nb_joinElggGroup[g_noline]++;
		if (g_nb_createElggGroup[g_noline]==g_create_elgg_groups.length) {
			processUsers();
		}
	};
	createNetworkGroup(name,callback);
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------------ User -----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processUsers()
//=================================================
{
	if (g_create_users.length==0)
		processDeleteUsers();
	else {
		$("#batch-log").append("<br>---------------------create_users-------------------------------");
		for  (var j=0; j<g_create_users.length; j++) {
			createUser(g_create_users[j]);
		}
	}
}

//=================================================
function createUser(node)
//=================================================
{
	var identifier = getTxtvals($("identifier",node));
	var lastname = getTxtvals($("lastname",node));
	var firstname = getTxtvals($("firstname",node));
	var email = getTxtvals($("email",node));
	var designer = getTxtvals($("designer",node));
	var password = getTxtvals($("password",node));
	if (designer==undefined || designer=='')
		designer ='0';
	//---- get userid ----------
	var userid = "";
	var url = "../../../"+serverBCK+"/users/user/username/"+identifier;
	$.ajax({
		async:false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
			$("#batch-log").append("<br>- user already defined("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
			//===========================================================
			g_nb_createUser[g_noline]++;
			if (g_nb_createUser[g_noline]==g_create_users.length) {
				processDeleteUsers();
			}
			//===========================================================
		},
		error : function(data) {
			var xml = "";
			xml +="<?xml version='1.0' encoding='UTF-8'?>";
			xml +="<users>";
			xml +="<user>";
			xml +="	<username>"+identifier+"</username>";
			xml +="	<lastname>"+lastname+"</lastname>";
			xml +="	<firstname>"+firstname+"</firstname>";
			xml +="	<email>"+email+"</email>";
			xml +="	<password>"+password+"</password>";
			xml +="	<active>1</active>";
			xml +="	<admin>0</admin>";
			xml +="	<designer>"+designer+"</designer>";
			xml +="</user>";
			xml +="</users>";
			var url = "../../../"+serverBCK+"/users";
			if (!trace)
				$.ajax({
					async:false,
					type : "POST",
					contentType: "application/xml; charset=UTF-8",
					dataType : "xml",
					url : url,
					data : xml,
					success : function(data) {
						userid = data;
						$("#batch-log").append("<br>- user created("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
						//===========================================================
						g_nb_createUser[g_noline]++;
						if (g_nb_createUser[g_noline]>=g_create_users.length) {
							processDeleteUsers();
						}
						//===========================================================
					},
					error : function(data) {
						$("#batch-log").append("<br>- ERROR in create-user ("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);					
					}
				});
			else {
				$("#batch-log").append("<br>-TRACE user created() - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
				//===========================================================
				g_nb_createUser[g_noline]++;
				if (g_nb_createUser[g_noline]>=g_create_users.length) {
					processDeleteUsers();
				}
				//===========================================================
			}
		}
	});
}

//=================================================
function processDeleteUsers()
//=================================================
{
	if (g_delete_users.length==0)
		processJoinUserGroups();
	else {
		$("#batch-log").append("<br>---------------------delete_users-------------------------------");
		for  (var j=0; j<g_delete_users.length; j++) {
			deleteUser(g_delete_users[j]);
		}
	}
}

//=================================================
function deleteUser(node)
//=================================================
{
	var identifier = getTxtvals($("identifier",node));
	//---- get userid ----------
	var userid = "";
	var url = "../../../"+serverBCK+"/users/user/username/"+identifier;
	$.ajax({
		async:false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
			var url = "../../../"+serverBCK+"/users/user/" + userid;
			$.ajax({
				type : "DELETE",
				dataType : "text",
				url : url,
				data : "",
				success : function(data) {
					$("#batch-log").append("<br>- user deleted("+userid+") - identifier:"+identifier);
					//===========================================================
					g_nb_deleteUser[g_noline]++;
					if (g_nb_deleteUser[g_noline]==g_delete_users.length) {
						processJoinUserGroups();
					}
					//===========================================================
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- ERROR user does not exist - identifier:"+identifier);
			//===========================================================
			g_nb_deleteUser[g_noline]++;
			if (g_nb_deleteUser[g_noline]==g_delete_users.length) {
				processJoinUserGroups();
			}
			//===========================================================
		}
	});
}
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------------------------- Join User Group ---------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processJoinUserGroups()
//=================================================
{
	if (g_join_usergroups.length==0)
		processLeaveUserGroups();
	else {
		$("#batch-log").append("<br>---------------------Join User Groups-------------------------------");
		for  (var j=0; j<g_join_usergroups.length; j++) {
			JoinUserGroup(g_join_usergroups[j]);
		}
	}
}

//=================================================
function JoinUserGroup(node)
//=================================================
{
	var role = "";
	var user = "";
	var usergroup = getTxtvals($("usergroup",node));
	var select_user = $("user>txtval",node).attr("select");
	if(typeof(select_user)=='undefined')
		user = $("user>txtval",node).text();
	else
		user = eval("g_json.lines["+g_noline+"]."+select_user);
	//---- get userid ----------
	var url = "../../../"+serverBCK+"/users/user/username/"+user;
	if (!trace)
		$.ajax({
			async:false,
			type : "GET",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			success : function(data) {
				var user_id = data;
				var xml = "<users><user id='"+data+"'/></users>";
				//---- get usergroupid ----------
				var groupid = "";
				var url = "../../../"+serverBCK+"/usersgroups";
				$.ajax({
					async:false,
					type : "GET",
					contentType: "text/html",
					dataType : "text",
					url : url,
					success : function(data) {
						var groups = $("group",data);
						for (var k=0;k<groups.length;k++){
							if ($('label',groups[k]).text()==usergroup)
								groupid = $(groups[k]).attr("id");
						}
						if (groupid=="")
							$("#batch-log").append("<br>- ERROR in JoinUserGroup - usergroup:"+usergroup+" NOT FOUND - user:"+user);
						else {
							//---- join group --------------
							if (!trace)
								$.ajax({
									type : 'PUT',
									dataType : "text",
									url : "../../../"+serverBCK+"/usersgroups?group=" + groupid + "&user=" + user_id,
									data : "",
									success : function(data) {
										$("#batch-log").append("<br>- JoinUserGroup - usergroup:"+usergroup+" - user:"+user);
										//===========================================================
										g_nb_joinUserGroup[g_noline]++;
										if (g_nb_joinUserGroup[g_noline]==g_join_usergroups.length) {
												processLeaveUserGroups();
										}
										//===========================================================
									},
									error : function(data) {
										$("#batch-log").append("<br>- ERROR in JoinUserGroup - usergroup:"+usergroup+" - user:"+user);
									}
								});
							else
								$("#batch-log").append("<br>TRACE - JoinUserGroup - usergroup:"+usergroup+" - user:"+user);
						}
					},
					error : function(data) {
						$("#batch-log").append("<br>- ERROR in JoinUserGroup - usergroup:"+usergroup+" - user:"+user);
					}
				});
			},
			error : function(data) {
				$("#batch-log").append("<br>- ERROR in JoinUserGroup - usergroup:"+usergroup+" - user:"+user+" NOT FOUND");
			}
		});
	else {
		$("#batch-log").append("<br>TRACE JoinUserGroup - usergroup:"+usergroup+" - user:"+user);
		//===========================================================
		g_nb_joinUserGroup[g_noline]++;
		if (g_nb_joinUserGroup[g_noline]==g_join_usergroups.length) {
			processLeaveUserGroups();
		}
		//===========================================================
	}

}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------------------------- Leave User Group ---------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processLeaveUserGroups()
//=================================================
{
	if (g_leave_usergroups.length==0)
		processElggGroupMembers();
	else {
		$("#batch-log").append("<br>---------------------Leave User Groups-------------------------------");
		for  (var j=0; j<g_leave_usergroups.length; j++) {
			LeaveUserGroup(g_leave_usergroups[j]);
		}
	}
}

//=================================================
function LeaveUserGroup(node)
//=================================================
{
	var role = "";
	var user = "";
	var usergroup = getTxtvals($("usergroup",node));
	var select_user = $("user>txtval",node).attr("select");
	if(typeof(select_user)=='undefined')
		user = $("user>txtval",node).text();
	else
		user = eval("g_json.lines["+g_noline+"]."+select_user);
	//---- get userid ----------
	var url = "../../../"+serverBCK+"/users/user/username/"+user;
	if (!trace)
		$.ajax({
			async:false,
			type : "GET",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			success : function(data) {
				var user_id = data;
				var xml = "<users><user id='"+data+"'/></users>";
				//---- get usergroupid ----------
				var groupid = "";
				var url = "../../../"+serverBCK+"/usersgroups";
				$.ajax({
					async:false,
					type : "GET",
					contentType: "text/html",
					dataType : "text",
					url : url,
					success : function(data) {
						var groups = $("group",data);
						for (var k=0;k<groups.length;k++){
							if ($('label',groups[k]).text()==usergroup)
								groupid = $(groups[k]).attr("id");
						}
						if (groupid=="")
							$("#batch-log").append("<br>- ERROR in LeaveUserGroup - usergroup:"+usergroup+" NOT FOUND - user:"+user);
						else {
							//---- leave group --------------
							if (!trace)
								$.ajax({
									type : 'DELETE',
									dataType : "text",
									url : "../../../"+serverBCK+"/usersgroups?group=" + groupid + "&user=" + user_id,
									data : "",
									success : function(data) {
										$("#batch-log").append("<br>- LeaveUserGroup - usergroup:"+usergroup+" - user:"+user);
										//===========================================================
										g_nb_leaveUserGroup[g_noline]++;
										if (g_nb_leaveUserGroup[g_noline]==g_leave_usergroups.length) {
												processElggUsers();
										}
										//===========================================================
									},
									error : function(data) {
										$("#batch-log").append("<br>- ERROR in LeaveUserGroup - usergroup:"+usergroup+" - user:"+user);
									}
								});
							else
								$("#batch-log").append("<br>TRACE - LeaveUserGroup - usergroup:"+usergroup+" - user:"+user);
						}
					},
					error : function(data) {
						$("#batch-log").append("<br>- ERROR in LeaveUserGroup - usergroup:"+usergroup+" - user:"+user);
					}
				});
			},
			error : function(data) {
				$("#batch-log").append("<br>- ERROR in LeaveUserGroup - usergroup:"+usergroup+" - user:"+user+" NOT FOUND");
			}
		});
	else {
		$("#batch-log").append("<br>TRACE LeaveUserGroup - usergroup:"+usergroup+" - user:"+user);
		//===========================================================
		g_nb_leaveUserGroup[g_noline]++;
		if (g_nb_leaveUserGroup[g_noline]==g_leave_usergroups.length) {
			processElggUsers();
		}
		//===========================================================
	}

}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------------------------- Elgg User ---------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processElggUsers()
//=================================================
{
	if (g_create_elgg_users.length==0)
		processElggGroupMembers();
	else {
		$("#batch-log").append("<br>---------------------create_elgg_users-------------------------------");
		for  (var j=0; j<g_create_elgg_users.length; j++) {
			createElggUser(g_create_elgg_users[j]);
		}
	}
}

//=================================================
function createElggUser(node)
//=================================================
{
	var identifier = getTxtvals($("identifier",node));
	var lastname = getTxtvals($("lastname",node));
	var firstname = getTxtvals($("firstname",node));
	var email = getTxtvals($("email",node));
	var password = getTxtvals($("password",node));
	//---- get userid ----------
	var userid = "";
	var url = "../../../../"+elgg_url_base+"services/api/rest/xml";
	var data = "auth_token="+g_elgg_key+"&method=auth.getuser&username="+identifier;
	$.ajax({
		Accept: "json",
		dataType : "json",
		type : "GET",
		url : url,
		data: data,
		success : function(data) {
			elgg_userid = data.result.guid;
			if (elgg_userid>0) {
				$("#batch-log").append("<br>- Elgg user already defined("+elgg_userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
				//===========================================================
				g_nb_createElggUser[g_noline]++;
				if (g_nb_createElggUser[g_noline]==g_create_elgg_users.length) {
					processElggGroupMembers();
				}
				//===========================================================
			} else {
				var callback = function (param1){	g_nb_createElggUser[g_noline]++;
													if (g_nb_createElggUser[g_noline]==g_create_elgg_users.length) {
														processCreateTrees();
													}
				};
				user_register(identifier, email, username, password,callback,param1)
			}
		},
		error : function(jqxhr,textStatus) {
			alertHTML("createElggUser : Oups! "+jqxhr.responseText);
		}
	});
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------------------------- Elgg Member -------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processElggGroupMembers()
//=================================================
{
	if (g_join_elgg_goups.length==0)
		processDeleteTrees();
	else {
		$("#batch-log").append("<br>---------------------join_elgg_goups-------------------------------");
		for  (var j=0; j<g_join_elgg_goups.length; j++) {
			createElggGroupMember(g_join_elgg_goups[j]);
		}
	}
}

//=================================================
function createElggGroupMember(node)
//=================================================
{
	var identifier = getTxtvals($("identifier",node));
	var group = getTxtvals($("group",node));
	var callback = function (param1){
		g_nb_joinElggGroup[g_noline]++;
		if (g_nb_joinElggGroup[g_noline]==g_join_elgg_goups.length) {
			processDeleteTrees();
		}
	};
	addGroupMember(group,identifier,callback,null,true);
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ Delete Tree ----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processDeleteTrees()
//=================================================
{
	if (g_delete_trees.length==0)
		processCreateTrees();
	else {
		$("#batch-log").append("<br>---------------------delete_trees-------------------------------");
		for  (var j=0; j<g_delete_trees.length; j++) {
			deleteTree(g_delete_trees[j]);
		}
	}
}

//=================================================
function deleteTree(node)
//=================================================
{
	var code = getTxtvals($("code",node));
	//----- get tree id -----
	try {
		var portfolioid = UIFactory["Portfolio"].getid_bycode(code,false);
		if (portfolioid!=undefined) {
			var url = "../../../"+serverBCK+"/portfolios/portfolio/" + portfolioid;
			$.ajax({
				type : "DELETE",
				contentType: "application/xml",
				dataType : "xml",
				url : url,
				data : "",
				success : function(data) {
					$("#batch-log").append("<br>- tree deleted - code:|"+code+"| portfolioid:"+portfolioid);
					//===========================================================
					g_nb_deleteTree[g_noline]++;
					if (g_delete_trees.length==g_nb_deleteTree[g_noline]) {
						processCreateTrees();
					}
					//===========================================================
				},
				error : function(jqxhr,textStatus) {
					$("#batch-log").append("<br>- delete tree ERROR - code:|"+code+" ---- NOT FOUND ----");
					//===========================================================
					g_nb_deleteTree[g_noline]++;
					if (g_delete_trees.length==g_nb_deleteTree[g_noline]) {
						processCreateTrees();
					}
					//===========================================================
				}
			});
		} else {
			$("#batch-log").append("<br>- delete tree ERROR - code:|"+code+" ---- NOT FOUND ----");
			//===========================================================
			g_nb_deleteTree[g_noline]++;
			if (g_delete_trees.length==g_nb_deleteTree[g_noline]) {
				processCreateTrees();
			}
			//===========================================================
		}	}
	catch(err) {
		$("#batch-log").append("<br>- delete tree ERROR - code:|"+code+" ---- NOT FOUND ----");
		//===========================================================
		g_nb_deleteTree[g_noline]++;
		if (g_delete_trees.length==g_nb_deleteTree[g_noline]) {
			processCreateTrees();
		}
		//===========================================================
	}

}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-------------------------- Create Tree --------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processCreateTrees()
//=================================================
{
	if (g_create_trees.length==0)
		processSelectTrees();
	else {
		$("#batch-log").append("<br>---------------------create_trees-------------------------------");
		for  (var j=0; j<g_create_trees.length; j++) {
			var treeref = $(g_create_trees[j]).attr('id');
			createTree(g_create_trees[j],treeref);
		}
	}
}

//=================================================
function createTree(node,treeref)
//=================================================
{
	var code = getTxtvals($("code",node));
	if (code!="") {
		var url = "../../../"+serverBCK+"/portfolios/portfolio/code/" + code;
		$.ajax({
			async:false,
			type : "GET",
			dataType : "xml",
			url : url,
			code : code,
			success : function(data) {
				$("#batch-log").append("<br>- tree already created - code:"+code);
				var result = $("portfolio", data);
				portfolioid = $(result).attr('id');
				var portfolio = new Array();
				portfolio [0] = portfolioid;
				portfolio [1] = code;
				g_trees[treeref] = portfolio;
				//===========================================================
				g_nb_createTree[g_noline]++;
				if (g_create_trees.length==g_nb_createTree[g_noline]) {
					processSelectTrees();
				}
				//===========================================================
			},
			error : function(data) {
				var label = getTxtvals($("label",node));
				var template = getTxtvals($("template",node));
				//----- create tree from template -----
				var portfolioid = "";
				if (!trace)
					portfolioid = UIFactory["Portfolio"].instantiate_bycode(template,code);
				var portfolio = new Array();
				portfolio [0] = portfolioid;
				portfolio [1] = code;
				g_trees[treeref] = portfolio;
				//----- update tree label -----
				if (code!="" && label!="" && !trace) {
					$.ajax({
						async:false,
						type : "GET",
						dataType : "xml",
						url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code + "&semtag=root",
						success : function(data) {
							var nodeid = $("asmRoot",data).attr('id');
							var xml = "<asmResource xsi_type='nodeRes'>";
							xml += "<code>"+code+"</code>";
							for (var lan=0; lan<languages.length;lan++)
								xml += "<label lang='"+languages[lan]+"'>"+label+"</label>";
							xml += "</asmResource>";
							$.ajax({
								async:false,
								type : "PUT",
								contentType: "application/xml",
								dataType : "text",
								data : xml,
								url : "../../../"+serverBCK+"/nodes/node/" + nodeid + "/noderesource",
								success : function(data) {
									$("#batch-log").append("<br>- tree created ("+portfolioid+") - code:"+code);
									//===========================================================
									g_nb_createTree[g_noline]++;
									if (g_create_trees.length==g_nb_createTree[g_noline]) {
										processSelectTrees();
									}	
									//===========================================================
								},
								error : function(data) {
									$("#batch-log").append("<br>- ERROR in  create tree - code:"+code);
								}
							});
						}
					});
				} else {
					$("#batch-log").append("<br>-TRACE tree created - template:"+template+" - code:"+code+" - label:"+label);
					//===========================================================
					g_nb_createTree[g_noline]++;
					if (g_create_trees.length==g_nb_createTree[g_noline]) {
						processSelectTrees();
					}
					//===========================================================
				}
			}
		});
	} else {
		$("#batch-log").append("<br>-ERROR in  create tree - code is empty");
		//===========================================================
		g_nb_createTree[g_noline]++;
		if (g_create_trees.length==g_nb_createTree[g_noline]) {
			processSelectTrees();
		}
		//===========================================================
	}

}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//---------------------------Select Tree --------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processSelectTrees()
//=================================================
{
	if (g_select_trees.length==0)
		processCopyTrees();
	else {
		$("#batch-log").append("<br>---------------------select_trees-------------------------------");
		for  (var j=0; j<g_select_trees.length; j++) {
			var treeref = $(g_select_trees[j]).attr('id');
			g_trees[treeref] = selectTree(g_select_trees[j]);
		}
		processCopyTrees();
	}
}

//=================================================
function selectTree(node)
//=================================================
{
	var code = getTxtvals($("code",node));
	//----- get tree id -----
	var portfolioid = UIFactory["Portfolio"].getid_bycode(code,false); 
	var portfolio = new Array();
	portfolio [0] = portfolioid;
	portfolio [1] = code;
	$("#batch-log").append("<br>- tree selected -  - code:"+code+" - portfolioid:"+portfolioid);
	return portfolio;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Copy Tree -----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processCopyTrees()
//=================================================
{
	if (g_copy_trees.length==0)
		processUpdateTreeRoot();
	else {
		$("#batch-log").append("<br>---------------------copy_trees-------------------------------");
		for (var j=0; j<g_copy_trees.length; j++) {
			copyTree(g_copy_trees[j]);
		}
	}
}

//=================================================
function copyTree(node)
//=================================================
{
	var code = getTxtvals($("code",node));
	var label = getTxtvals($("label",node));
	var template = getTxtvals($("template",node));
	$("#batch-log").append("<br>copy-tree template:|"+template+"| code:|"+code+"| label:|"+label+"|");
	//----- create tree from template -----
	var portfolioid = "";
	if (!trace)
		portfolioid = UIFactory["Portfolio"].copy_bycode(template,code);
	//----- update tree label -----
	if (code!="" && label!="" && !trace)
		$.ajax({
			async:false,
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code + "&semtag=root",
			success : function(data) {
				var nodeid = $("asmRoot",data).attr('id');
				var xml = "<asmResource xsi_type='nodeRes'>";
				xml += "<code>"+code+"</code>";
				xml += "<label lang='"+LANG+"'>"+label+"</label>";
				xml += "</asmResource>";
				$.ajax({
					async:false,
					type : "PUT",
					contentType: "application/xml",
					dataType : "text",
					data : xml,
					url : "../../../"+serverBCK+"/nodes/node/" + nodeid + "/noderesource",
					success : function(data) {
						treeid = data;
						$("#batch-log").append("<br>- tree created ("+treeid+") - code:"+code);
						//===========================================================
						g_nb_copyTree[g_noline]++;
						if (g_copy_trees.length==g_nb_copyTree[g_noline]) {
							processUpdateTreeRoot();
						}
						//===========================================================
					},
					error : function(data) {
						$("#batch-log").append("<br>- ERROR in  create tree - code:"+code);
					}
				});
			}
		});
	else {
		$("#batch-log").append("<br>-TRACE tree created - code:"+code+" - label:"+label);
		//===========================================================
		g_nb_copyTree[g_noline]++;
		if (g_copy_trees.length==g_nb_copyTree[g_noline]) {
			processUpdateTreeRoot();
		}
		//===========================================================
	}
	var portfolio = new Array();
	portfolio [0] = portfolioid;
	portfolio [1] = code;
	return portfolio;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ Update Tree Code -----------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processUpdateTreeRoot()
//=================================================
{
	if (g_update_tree_roots.length==0)
		processUpdateResources();
	else {
		$("#batch-log").append("<br>---------------------update tree code-------------------------------");
		for  (var j=0; j<g_update_tree_roots.length; j++) {
			updateTreeRoot(g_update_tree_roots[j]);
		}
	}
}

//=================================================
function updateTreeRoot(node)
//=================================================
{
	var oldcode = getTxtvals($("oldcode",node));
	var newcode = getTxtvals($("newcode",node));
	var label = getTxtvals($("label",node));
	if (oldcode!="" && newcode!="") {
		$.ajax({
				async:false,
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + oldcode + "&semtag=root",
				success : function(data) {
					var nodeid = $("asmRoot",data).attr('id');
					var xml = "<asmResource xsi_type='nodeRes'>";
					xml += "<code>"+newcode+"</code>";
					for (var lan=0; lan<languages.length;lan++)
						if (lan==LANG && label!="")
							xml += "<label lang='"+languages[lan]+"'>"+label+"</label>";
						else
							xml += "<label lang='"+languages[lan]+"'>"+$("label[lang='"+languages[lan]+"']",$("asmResource[xsi_type='nodeRes']",data)).text()+"</label>";
					xml += "</asmResource>";
					$.ajax({
						async:false,
						type : "PUT",
						contentType: "application/xml",
						dataType : "text",
						data : xml,
						url : "../../../"+serverBCK+"/nodes/node/" + nodeid + "/noderesource",
						success : function(data) {
							$("#batch-log").append("<br>- tree root updated ("+oldcode+") - newcode:"+newcode);
							//===========================================================
							g_nb_updateTreeRoot[g_noline]++;
							if (g_update_tree_roots.length==g_nb_updateTreeRoot[g_noline]) {
								processUpdateResources();
							}	
							//===========================================================
						},
						error : function(data) {
							$("#batch-log").append("<br>- ERROR in  updateTreeRoot - code:"+oldcode+" not found");
							//===========================================================
							g_nb_updateTreeRoot[g_noline]++;
							if (g_update_tree_roots.length==g_nb_updateTreeRoot[g_noline]) {
								processUpdateResources();
							}	
							//===========================================================
						}
					});
				},
				error : function(data) {
					$("#batch-log").append("<br>- ERROR in  updateTreeRoot - code:"+oldcode);
					//===========================================================
					g_nb_updateTreeRoot[g_noline]++;
					if (g_update_tree_roots.length==g_nb_updateTreeRoot[g_noline]) {
						processUpdateResources();
					}	
					//===========================================================
				}
		});
	} else {
		$("#batch-log").append("<br>-ERROR in  update tree - oldcode or newcode is empty");
		//===========================================================
		g_nb_updateTreeRoot[g_noline]++;
		if (g_update_tree_roots.length==g_nb_updateTreeRoots[g_noline]) {
			processUpdateResources();
		}	
		//===========================================================
	}

}


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ Update Resource ------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processUpdateResources()
//=================================================
{
	if (g_update_resources.length==0)
		processShareTrees();
	else {
		$("#batch-log").append("<br>---------------------update_resources-------------------------------");
		for (var j=0; j<g_update_resources.length; j++) {
			updateResource(g_update_resources[j]);
		}
	}
}

//=================================================
function updateResource(node)
//=================================================
{
	var select = $(node).attr("select");
	var type = $(node).attr("type");
	var idx = select.indexOf(".");
	var treeref = select.substring(0,idx);
	var semtag = select.substring(idx+1);
	//----------------------------------------------------
	if (type=='Field') {
		var text = getTxtvals($("text",node));
		if ($("source",node).length>0){
			var source_select = $("source",node).attr("select");
			var source_idx = source_select.indexOf(".");
			var source_treeref = source_select.substring(0,source_idx);
			var source_semtag = source_select.substring(source_idx+1);
			if (source_semtag=="UUID")
				text = g_trees[source_treeref][0];
		}
		if (!trace)
			$.ajax({
				async:false,
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag,
				success : function(data) {
					var nodeid = $("asmContext:has(metadata[semantictag='"+semtag+"'])",data).attr('id');
					var xml = "<asmResource xsi_type='Field'>";
					xml += "<text lang='"+LANG+"'>"+text+"</text>";
					xml += "</asmResource>";
					$.ajax({
						type : "PUT",
						contentType: "application/xml",
						dataType : "text",
						data : xml,
						url : "../../../"+serverBCK+"/resources/resource/" + nodeid,
						success : function(data) {
							$("#batch-log").append("<br>- resource updated ("+nodeid+") - semtag="+semtag);
							//===========================================================
							g_nb_updateResource[g_noline]++;
							if (g_update_resources.length<=g_nb_updateResource[g_noline]) {
								processShareTrees();
							}
							//===========================================================
						},
						error : function(data) {
							$("#batch-log").append("<br>- ERROR in update resource("+nodeid+") - semtag="+semtag);
						}
					});
				}
			});
		else {
			$("#batch-log").append("<br>-TRACE resource FIELD updated - semtag="+semtag);
			//===========================================================
			g_nb_updateResource[g_noline]++;
			if (g_update_resources.length<=g_nb_updateResource[g_noline]) {
				processShareTrees();
			}
			//===========================================================
		}
	}
	//----------------------------------------------------
	if (type=='Proxy') {
		var source_select = $("source",node).attr("select");
		var source_idx = source_select.indexOf(".");
		var source_treeref = source_select.substring(0,source_idx);
		var source_semtag = source_select.substring(source_idx+1);
		//------ search sourceid -------------------
		var sourceid = "";
		if (!trace)
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + g_trees[source_treeref][1] + "&semtag="+source_semtag,
				success : function(data) {
					sourceid = $("node",data).attr('id');
					//------ search targetid -------------------
					var targetid = "";
					$.ajax({
						async:false,
						type : "GET",
						dataType : "xml",
						url : "../../../"+serverBCK+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag,
						success : function(data) {
							targetid = $("node",data).attr('id');
							var xml = "<asmResource xsi_type='Proxy'>";
							xml += "<code>"+sourceid+"</code>";
							xml += "<value>"+sourceid+"</value>";
							xml += "</asmResource>";
							//----- update target ----------------
							$.ajax({
								type : "PUT",
								contentType: "application/xml",
								dataType : "text",
								data : xml,
								targetid : targetid,
								sourceid : sourceid,
								semtag : semtag,
								url : "../../../"+serverBCK+"/resources/resource/" + targetid,
								success : function(data) {
									g_nb_updateResource[g_noline]++;
									$("#batch-log").append("<br>- resource updated ("+this.targetid+") - semtag="+this.semtag + " - srce:"+this.sourceid);
									if (g_update_resources.length<=g_nb_updateResource[g_noline]) {
										processShareTrees();
									}
									//===========================================================
								},
								error : function(data) {
									$("#batch-log").append("<br>- ERROR in update resource("+targetid+") - semtag="+semtag);
								}
							});
						}
					});
				}
			});
		else {
			$("#batch-log").append("<br>-TRACE resource PROXY updated - semtag="+semtag);
			//===========================================================
			g_nb_updateResource[g_noline]++;
			if (g_update_resources.length<=g_nb_updateResource[g_noline]) {
				processShareTrees();
			}
			//===========================================================
		}
	}

	//----------------------------------------------------
	if (type=='MetadatawadQuery' || type=='MetadatawadMenu') {
		var text = getTxtvals($("text",node));
		if ($("source",node).length>0){
			var source_select = $("source",node).attr("select");
			var source_idx = source_select.indexOf(".");
			var source_treeref = source_select.substring(0,source_idx);
			var source_semtag = source_select.substring(source_idx+1);
			if (source_semtag=="UUID")
				text = g_trees[source_treeref][0];
		}
		if (!trace)
			$.ajax({
				async:false,
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag,
				success : function(data) {
					var nodes = $("asmContext:has(metadata[semantictag='"+semtag+"'])",data);
					if (nodes.length==0)
						nodes = $("asmUnitStructure:has(metadata[semantictag='"+semtag+"'])",data);
					if (nodes.length==0)
						nodes = $("asmUnit:has(metadata[semantictag='"+semtag+"'])",data);
					if (nodes.length==0)
						nodes = $("asmStructure:has(metadata[semantictag='"+semtag+"'])",data);
					var nb = nodes.length;
					var nodeid ="";
					for (var i=0; i<nb; i++){
						nodeid = $(nodes[i]).attr('id');
						var metadatawad = $("metadata-wad",nodes[i]);
						if (type=='MetadatawadQuery')
							$(metadatawad).attr('query',text);
						if (type=='MetadatawadMenu')
							$(metadatawad).attr('menu',text);
						var xml = xml2string(metadatawad[0]);;
						$.ajax({
							async:false,
							type : "PUT",
							contentType: "application/xml",
							dataType : "text",
							data : xml,
							nodeid : nodeid,
							semtag : semtag,
							url : "../../../"+serverBCK+"/nodes/node/" + nodeid+"/metadatawad",
							idx : i,
							nb : nb-1,
							success : function(data) {
								$("#batch-log").append("<br>- resource metadatawad updated ("+this.nodeid+") - semtag="+this.semtag+" "+this.idx+" "+this.nb+" - "+(this.idx==this.nb));
								//===========================================================
								if (this.idx==this.nb) {
									g_nb_updateResource[g_noline]++;
								}
								if (g_update_resources.length<=g_nb_updateResource[g_noline]) {
									processShareTrees();
								}
								//===========================================================
							},
							error : function(data,nodeid,semtag) {
								$("#batch-log").append("<br>- ERROR in update metadatawad("+this.nodeid+") - semtag="+this.semtag);
							}
						});
						}
				}
			});
		else {
			$("#batch-log").append("<br>-TRACE resource metadatawad updated - semtag="+semtag);
			//===========================================================
			g_nb_updateResource[g_noline]++;
			if (g_update_resources.length<=g_nb_updateResource[g_noline]) {
				processShareTrees();
			}
			//===========================================================
		}
	}
	//----------------------------------------------------
	if (type=='Dashboard') {
		var text = getTxtvals($("text",node));
		if ($("source",node).length>0){
			var source_select = $("source",node).attr("select");
			var source_idx = source_select.indexOf(".");
			var source_treeref = source_select.substring(0,source_idx);
			var source_semtag = source_select.substring(source_idx+1);
			if (source_semtag=="UUID")
				text = g_trees[source_treeref][0];
		}
		if (!trace)
			$.ajax({
				async:false,
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag,
				success : function(data) {
					var nodeid = $("asmContext:has(metadata[semantictag='"+semtag+"'])",data).attr('id');
					var xml = "<asmResource xsi_type='Dashboard'>";
					for (var lan=0; lan<languages.length;lan++)
						xml += "<text lang='"+languages[lan]+"'>"+text+"</text>";
					xml += "</asmResource>";
					$.ajax({
						type : "PUT",
						contentType: "application/xml",
						dataType : "text",
						data : xml,
						nodeid : nodeid,
						semtag : semtag,
						url : "../../../"+serverBCK+"/resources/resource/" + nodeid,
						success : function(data) {
							$("#batch-log").append("<br>- resource Dashboard update("+this.nodeid+") - semtag="+this.semtag);
							//===========================================================
							g_nb_updateResource[g_noline]++;
							if (g_update_resources.length<=g_nb_updateResource[g_noline]) {
								processShareTrees();
							}
							//===========================================================
						},
						error : function(data) {
							$("#batch-log").append("<br>- ERROR in update Dashboard("+nodeid+") - semtag="+semtag);
						}
					});
				}
			});
		else {
			$("#batch-log").append("<br>-TRACE resource Dashboard updated - semtag="+semtag);
			//===========================================================
			g_nb_updateResource[g_noline]++;
			if (g_update_resources.length<=g_nb_updateResource[g_noline]) {
				processShareTrees();
			}
			//===========================================================
		}
	}
	//----------------------------------------------------
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Share Tree ----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processShareTrees()
//=================================================
{
	if (g_share_trees.length==0)
		processShareUserGroup();
	else {
		$("#batch-log").append("<br>---------------------share_trees-------------------------------");
		for (var j=0; j<g_share_trees.length; j++) {
			shareTree(g_share_trees[j]);
		}
	}
}

//=================================================
function shareTree(node)
//=================================================
{
	var role = "";
	var user = "";
	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
//	var select_node = $("role>txtval",node).attr("select");
//	if (typeof(select_node)== 'undefined')
//		role = $("role>txtval",node).text();
//	else
//		role = eval("g_json.lines["+g_noline+"]."+select_node);
	var user = getTxtvals($("user",node));
//	var select_user = $("user>txtval",node).attr("select");
//	if(typeof(select_user)=='undefined')
//		user = $("user>txtval",node).text();
//	else
//		user = eval("g_json.lines["+g_noline+"]."+select_user);
	//---- get userid ----------
	var url = "../../../"+serverBCK+"/users/user/username/"+user;
	if (!trace)
		$.ajax({
			async:false,
			type : "GET",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			success : function(data) {
				var user_id = data;
				var xml = "<users><user id='"+data+"'/></users>";
				//---- get role groupid ----------
				var groupid = "";
				var url = "../../../"+serverBCK+"/rolerightsgroups?portfolio="+g_trees[treeref][0]+"&role="+role;
				$.ajax({
					async:false,
					type : "GET",
					contentType: "text/html",
					dataType : "text",
					url : url,
					success : function(data) {
						groupid = data;
						//---- share tree --------------
						var url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
						if (!trace)
							$.ajax({
								type : "POST",
								contentType: "application/xml",
								dataType : "xml",
								url : url,
								data : xml,
								success : function(data) {
									$("#batch-log").append("<br>- tree shared ("+g_trees[treeref][0]+") - user:"+user_id+" - role:"+role);
									//===========================================================
									g_nb_shareTree[g_noline]++;
									if (g_nb_shareTree[g_noline]==g_share_trees.length) {
										processShareUserGroup();
									}
									//===========================================================
								},
								error : function(data) {
									$("#batch-log").append("<br>- ERROR in share tree ("+g_trees[treeref][0]+") - role:"+role);
								}
							});
						else
							$("#batch-log").append("<br>TRACE - tree shared ("+g_trees[treeref][0]+") - user:"+user+" - role:"+role);
					}
				});
			}
		});
	else {
		$("#batch-log").append("<br>TRACE tree shared ("+g_trees[treeref][0]+") - user:"+user+" - role:"+role);
		//===========================================================
		g_nb_shareTree[g_noline]++;
		if (g_nb_shareTree[g_noline]==g_share_trees.length) {
			processShareUserGroup();
		}
		//===========================================================
	}
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Share with UserGroup ------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processShareUserGroup()
//=================================================
{
	if (g_share_usergroup.length==0)
		processUnshareTrees();
	else {
		$("#batch-log").append("<br>---------------------share_usergroup-------------------------------");
		if (UsersGroups_list.length==0)
			get_list_usersgroups()
		for (var j=0; j<g_share_usergroup.length; j++) {
			shareUserGroup(g_share_usergroup[j]);
		}
	}
}

//=================================================
function shareUserGroup(node)
//=================================================
{
	var role = "";
	var user = "";
	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
	var usergroupname = getTxtvals($("groupname",node));
	if (!trace) {
		var usergroupid = get_usergroupid(usergroupname);
		var users = get_usersxml_from_group(usergroupid);
		if (users.length>20) {
			//---- get role groupid ----------
			var groupid = "";
			var url = "../../../"+serverBCK+"/rolerightsgroups?portfolio="+g_trees[treeref][0]+"&role="+role;
			$.ajax({
				async:false,
				type : "GET",
				contentType: "text/html",
				dataType : "text",
				url : url,
				success : function(data) {
					groupid = data;
					//---- share tree --------------
					var url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
					$.ajax({
						type : "POST",
						contentType: "application/xml",
						dataType : "xml",
						url : url,
						data : users,
						success : function(data) {
							$("#batch-log").append("<br>tree shared with usergroup  ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - role:"+role);
							//===========================================================
							g_nb_shareUserGroup[g_noline]++;
							if (g_nb_shareUserGroup[g_noline]==g_share_usergroup.length) {
								processUnshareTrees();
							}
							//===========================================================
						}
					});
				}
			});
		}
	} else {
		$("#batch-log").append("<br>TRACE tree with usergroup shared ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - role:"+role);
		//===========================================================
		g_nb_shareUserGroup[g_noline]++;
		if (g_nb_shareUserGroup[g_noline]==g_share_usergroup.length) {
			processUnshareTrees();
		}
		//===========================================================
	}
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Unshare Tree ----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processUnshareTrees()
//=================================================
{
	if (g_unshare_trees.length==0)
		processUnshareUserGroup();
	else {
		$("#batch-log").append("<br>---------------------unshare_trees-------------------------------");
		for (var j=0; j<g_unshare_trees.length; j++) {
			unshareTree(g_unshare_trees[j]);
		}
	}
}

//=================================================
function unshareTree(node)
//=================================================
{
	var role = "";
	var user = "";
	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
	var select_user = $("user>txtval",node).attr("select");
	if(typeof(select_user)=='undefined')
		user = $("user>txtval",node).text();
	else
		user = eval("g_json.lines["+g_noline+"]."+select_user);
	//---- get userid ----------
	var url = "../../../"+serverBCK+"/users/user/username/"+user;
	if (!trace)
		$.ajax({
			async:false,
			type : "GET",
			contentType: "application/xml",
			dataType : "text",
			url : url,
			success : function(data) {
				var user_id = data;
				//---- get role groupid ----------
				var groupid = "";
				var url = "../../../"+serverBCK+"/rolerightsgroups?portfolio="+g_trees[treeref][0]+"&role="+role;
				$.ajax({
					async:false,
					type : "GET",
					contentType: "text/html",
					dataType : "text",
					url : url,
					success : function(data) {
						groupid = data;
						//---- share tree --------------
						var url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+user_id;
						if (!trace)
							$.ajax({
								type : "DELETE",
								contentType: "application/xml",
								dataType : "xml",
								url : url,
								data : "",
								success : function(data) {
									$("#batch-log").append("<br>- tree unshared ("+g_trees[treeref][0]+") - user:"+user_id+" - role:"+role);
									//===========================================================
									g_nb_unshareTree[g_noline]++;
									if (g_nb_unshareTree[g_noline]==g_unshare_trees.length) {
										processUnshareUserGroup();
									}
									//===========================================================
								},
								error : function(data) {
									$("#batch-log").append("<br>- ERROR in unshare tree ("+g_trees[treeref][0]+") - role:"+role);
								}
							});
						else
							$("#batch-log").append("<br>TRACE - tree unshared ("+g_trees[treeref][0]+") - user:"+user+" - role:"+role);
					}
				});
			}
		});
	else {
		$("#batch-log").append("<br>TRACE tree unshared ("+g_trees[treeref][0]+") - user:"+user+" - role:"+role);
		//===========================================================
		g_nb_unshareTree[g_noline]++;
		if (g_nb_unshareTree[g_noline]==g_unshare_trees.length) {
			processUnshareUserGroup();
		}
		//===========================================================
	}
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Unshare with UserGroup ----------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processUnshareUserGroup()
//=================================================
{
	if (g_unshare_usergroup.length==0)
		processImportNodes();
	else {
		$("#batch-log").append("<br>---------------------unshare_usergroup-------------------------------");
		if (UsersGroups_list.length==0)
			get_list_usersgroups()
		for (var j=0; j<g_unshare_usergroup.length; j++) {
			unshareUserGroup(g_unshare_usergroup[j]);
		}
	}
}

//=================================================
function unshareUserGroup(node)
//=================================================
{

	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
	var usergroupname = getTxtvals($("groupname",node));
	if (!trace) {
		var usergroupid = get_usergroupid(usergroupname);
		var users = get_users_from_group(usergroupid);
		$.ajaxSetup({async: false});
		var groupid = "";
		var url = "../../../"+serverBCK+"/rolerightsgroups?portfolio="+g_trees[treeref][0]+"&role="+role;
		$.ajax({
			type : "GET",
			contentType: "text/html",
			dataType : "text",
			url : url,
			success : function(data) {
				groupid = data;
				for (var i=0; i<users.length; i++){
					var userid = $(users[i]).attr('id');
					var url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+userid;
					$.ajax({
						type : "DELETE",
						contentType: "application/xml",
						dataType : "xml",
						url : url,
						data : "",
						success : function(data) {
							$("#batch-log").append("<br>tree with usergroup unshared ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - userid:"+userid+" - role:"+role);
							//===========================================================
							g_nb_unshareUserGroup[g_noline]++;
							if (g_nb_unshareUserGroup[g_noline]==g_unshare_usergroup.length) {
								processImportNodes();
							}
							//===========================================================
						},
						error : function(jqxhr,textStatus) {
							alertHTML("Error in unshare : "+jqxhr.responseText);
						}
					});
				}
			}
		});
		$.ajaxSetup({async: true});
	} else {
		$("#batch-log").append("<br>TRACE tree with usergroup unshared ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - role:"+role);
		//===========================================================
		g_nb_unshareUserGroup[g_noline]++;
		if (g_nb_unshareUserGroup[g_noline]==g_unshare_usergroup.length) {
			processImportNodes();
		}
		//===========================================================
	}
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Export with File ----------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processExportWithFile()
//=================================================
{
	if (g_unshare_usergroup.length==0)
		processImportNodes();
	else {
		$("#batch-log").append("<br>---------------------unshare_usergroup-------------------------------");
		if (UsersGroups_list.length==0)
			get_list_usersgroups()
		for (var j=0; j<g_unshare_usergroup.length; j++) {
			unshareUserGroup(g_unshare_usergroup[j]);
		}
	}
}

//=================================================
function exportWithFile(node)
//=================================================
{
	var treeref = $(node).attr("select");
	var usergroupname = getTxtvals($("groupname",node));
	if (!trace) {
		var usergroupid = get_usergroupid(usergroupname);
		var users = get_users_from_group(usergroupid);
		$.ajaxSetup({async: false});
		for (var i=0; i<users.length; i++){
			var userid = $(users[i]).attr('id');
			var url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + usergroupid + "/users/user/"+userid;
			$.ajax({
				type : "DELETE",
				contentType: "application/xml",
				dataType : "xml",
				url : url,
				data : "",
				success : function(data) {
					$("#batch-log").append("<br>tree with usergroup unshared ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - userid:"+userid+" - role:"+role);
					//===========================================================
					g_nb_unshareUserGroup[g_noline]++;
					if (g_nb_unshareUserGroup[g_noline]==g_unshare_usergroup.length) {
						processImportNodes();
					}
					//===========================================================
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Error in unshare : "+jqxhr.responseText);
				}
			});
		}
		$.ajaxSetup({async: true});
	} else {
		$("#batch-log").append("<br>TRACE tree with usergroup unshared ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - role:"+role);
		//===========================================================
		g_nb_unshareUserGroup[g_noline]++;
		if (g_nb_unshareUserGroup[g_noline]==g_unshare_usergroup.length) {
			processImportNodes();
		}
		//===========================================================
	}
}


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Import Node ----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processImportNodes()
//=================================================
{
	if (g_import_nodes.length==0)
		processEnd();
	else {
		$("#batch-log").append("<br>---------------------import_nodes-------------------------------");
		for  (var j=0; j<g_import_nodes.length; j++) {
			importNode(g_import_nodes[j]);
		}
	}
}

//=================================================
function importNode(node)
//=================================================
{
	var select = $(node).attr("select");
	var idx = select.lastIndexOf(".");
	var treeref = select.substring(0,idx);
	var semtag = select.substring(idx+1);
	var source = $(node).attr("source");
	var idx_source = source.lastIndexOf(".");
	var srcecode = source.substring(0,idx_source);
	var srcetag = source.substring(idx_source+1);
	if (!trace)
		$.ajax({
			async:false,
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag,
			success : function(data) {
				var destid = $("node",data).attr('id');				
				var urlS = "../../../"+serverBCK+"/nodes/node/import/"+destid+"?srcetag="+srcetag+"&srcecode="+srcecode;
				$.ajax({
					type : "POST",
					dataType : "text",
					url : urlS,
					data : "",
					success : function(data) {
						$("#batch-log").append("<br>- node added at ("+destid+") - semtag="+semtag+ " source="+source);
						//===========================================================
						g_nb_importNode[g_noline]++;
						if (g_import_nodes.length<=g_nb_importNode[g_noline]) {
							processEnd();
						}
						//===========================================================
					},
					error : function(data) {
						$("#batch-log").append("<br>- ERROR in update resource("+nodeid+") - semtag="+semtag);
					}
				});
			}
		});
	else {
		$("#batch-log").append("<br>-TRACE node added - semtag="+semtag+ "source="+source);
		//===========================================================
		g_nb_importNode[g_noline]++;
		if (g_import_nodes.length<=g_nb_importNode[g_noline]) {
			processEnd();
		}
		//===========================================================
	}
	//----------------------------------------------------
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ This is the End ------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function processEnd()
//=================================================
{
	g_noline++;
	if (g_json==null || g_noline>=g_json.lines.length) {
		$("#batch-log").append("<br>================ END ========================================================");
		fill_list_page();
		fill_list_users()
		if (demo)
			window.location.reload();
	}
	else
		processLine();
}

//==========================================================================
//==========================================================================
//==========================================================================
//==========================================================================
//==========================================================================
//==========================================================================
//==========================================================================

//=================================================
function processCode()
//=================================================
{
	var model_code = $("#batch-model_code").val();
	getModelAndProcess(model_code);
}

//=================================================
function getModelAndProcess(model_code)
//=================================================
{
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfolios/portfolio/code/"+model_code,
		success : function(data) {
			var nodeid = $("asmRoot",data).attr("id");
			// ---- transform karuta portfolio to batch model
			var urlS = "../../../"+serverBCK+"/nodes/"+nodeid+"?xsl-file="+karutaname+"/karuta/xsl/karuta2batch.xsl&lang="+LANG;
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : urlS,
				success : function(data) {
					g_xmlDoc = data;
					processAll();
				}
			 });
		}
	});
}

//==============================
function get_list_portfoliosgroups()
//==============================
{
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/portfoliogroups",
		data: "",
		success : function(data) {
			UIFactory["PortfoliosGroup"].parse(data);
		}
	});
	$.ajaxSetup({async: true});
}

//==============================
function get_portfoliogroupid(groupname)
//==============================
{
	var groupid = null;
	for (var i=0;i<PortfoliosGroups_list.length;i++){
		if (PortfoliosGroups_list[i]==groupname){
			groupid = PortfoliosGroups_list[i].id;
			break;
		}
	}
	return groupid;
}

//==============================
function get_list_usersgroups()
//==============================
{
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/usersgroups",
		data: "",
		success : function(data) {
			UIFactory["UsersGroup"].parse(data);
		}
	});
	$.ajaxSetup({async: true});
}

//==============================
function get_usergroupid(groupname)
//==============================
{
	var groupid = null;
	for (var i=0;i<UsersGroups_list.length;i++){
		if (UsersGroups_list[i].label==groupname){
			groupid = UsersGroups_list[i].id;
			break;
		}
	}
	return groupid;
}

//==============================
function get_usersxml_from_group(groupid)
//==============================
{
	var xml = "<users>";
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/usersgroups?group="+groupid,
		success : function(data) {
			xml += $($("users",data)[0]).html();
		}
	});
	$.ajaxSetup({async: true});
	xml += "</users>";
	return xml;
}

//==============================
function get_users_from_group(groupid)
//==============================
{
	var users = null;
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : "../../../"+serverBCK+"/usersgroups?group="+groupid,
		success : function(data) {
			users = $("user",data);
		}
	});
	$.ajaxSetup({async: true});
	return users;
}

//==================================================
//==================================================
//=================== BatchForm ====================
//==================================================
//==================================================

//==================================================
function execBatchForm()
//==================================================
{
	var line0 = $("asmUnitStructure:has(metadata[semantictag*='BatchFormLine0'])",g_portfolio_current);
	var lines = $("asmUnitStructure:has(metadata[semantictag*='BatchFormLines'])",g_portfolio_current);
	var model_code_node = $("asmContext:has(metadata[semantictag='model_code'])",g_portfolio_current);
	var model_code_nodeid = $(model_code_node).attr("id");
	var model_code = UICom.structure["ui"][model_code_nodeid].resource.getView();
	initBatchVars();
	g_json = getInputsLine(line0);
	g_json['model_code'] = model_code;
	g_json['lines'] = [];
	g_json.lines[0] = getInputsLine(lines);
	//------------------------------
	display_execBatch()
	//------------------------------
	getModelAndProcess(g_json.model_code);
};

//==================================================
function getInputsLine(node)
//==================================================
{
	line_inputs = $("asmContext:has(metadata[semantictag*='BatchFormInput'])",node);
	var g_json_line = {};
	for ( var j = 0; j < line_inputs.length; j++) {
		var inputid = $(line_inputs[j]).attr('id');
		code = UICom.structure["ui"][inputid].getCode();
		g_json_line[code] = UICom.structure["ui"][inputid].resource.getView();
	}
	return g_json_line;
};

//==================================
function display_execBatch()
//==================================
{
	$("#main-exec-batch").html('');
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide');$('#edit-window-body').html('')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html($(footer));
	$("#edit-window-title").html("KARUTA - "+karutaStr[LANG]['batch']);
	$("#edit-window-type").html("");
	var html = "";
	html += "<div id='batch-log' style='margin-left:20px;margin-top:20px'></div>";
	$("#edit-window-body").html(html);
	//---------------------
	$('#edit-window').modal('show');
};
