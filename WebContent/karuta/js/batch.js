/* =======================================================
	Copyright 2018 - ePortfolium - Licensed under the
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

var g_xmlDoc = null;
var g_json = {};
var g_trees = {};
var g_noline = 0;
var g_actions = [];
var g_actions_list = [];
var g_current_node_uuid = null;
var g_users = {};
//-----------------------



//==================================
function initBatchVars()
//==================================
{
	g_xmlDoc = null;
	g_json = {};
	g_trees = {};
	g_noline = 0;
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
			var fct = null;
			if (select.indexOf('function(')>-1) {
				fct = select.substring(9,select.indexOf(','))
				select = select.substring(select.indexOf(',')+1,select.indexOf(')'))
			}
			if (select.indexOf("//")>-1)
				text = eval("g_json."+select.substring(2));
			else
				text = eval("g_json.lines["+g_noline+"]."+select);
			if (fct!=null)
				text = eval(fct+"('"+text+"')");
		} else {
			text = $(txtvals[i]).text();
			if (text.indexOf('numline()')>-1) {
				text = text.replace(/numline()/g,g_noline);
				text = eval(text);
			}
		}
		str += text;
	}
	return str.trim();
}

//==================================
function getTargetUrl(node)
//==================================
{
	var url = "";
	var select = $(node).attr("select");
	var idx = select.lastIndexOf(".");
	var treeref = select.substring(0,idx);
	var semtag = select.substring(idx+1);
	if (semtag=='#current_node')
		url = serverBCK_API+"/nodes/node/"+g_current_node_uuid;
	else if (semtag=='#uuid')
		url = serverBCK_API+"/nodes/node/"+treeref;
	else if (treeref.indexOf("#")>-1)
		url = serverBCK_API+"/nodes?portfoliocode=" + treeref.substring(1) + "&semtag="+semtag;	
	else
		url = serverBCK_API+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag;
	return url;
}

//==================================
function getSourceUrl(node)
//==================================
{
	var url = "";
	var select = $("source",node).attr("select");
	var idx = select.lastIndexOf(".");
	var treeref = select.substring(0,idx);
	var semtag = select.substring(idx+1);
	if (semtag=='#current_node')
		url = serverBCK_API+"/nodes/node/"+g_current_node_uuid;
	else if (semtag=='#uuid')
		url = serverBCK_API+"/nodes/node/"+treeref;
	else if (treeref.indexOf("#")>-1)
		url = serverBCK_API+"/nodes?portfoliocode=" + treeref.substring(1) + "&semtag="+semtag;	
	else
		url = serverBCK_API+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag;
	return url;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//================================================
function processAll(model_code,portfoliologcode)
//=================================================
{
	$.ajaxSetup({async: false});
	get_list_portfoliosgroups();
	get_list_usersgroups();
	var actions_list = $("model",g_xmlDoc).children();
	processListActions(actions_list);
	$("#batch-log").append("<br>=============== THIS IS THE END ===============================");
	$.ajaxSetup({async: true});
	//--------------------
	if (portfoliologcode!="")
		saveLog(model_code,portfoliologcode,$("#batch-log").html());
	//--------------------
	if (g_execbatch) { // after creation of portfolio
		window.location.reload();
	}
}

//=================================================
function processListActions(list)
//=================================================
{
	for (var i=0; i<list.length; i++){
		var actiontype = $(list[i]).prop("nodeName");
		var actionnode = list[i];
		if (actiontype!='for-each-line' && actiontype!='if-then-else') {
			$("#batch-log").append("<br>------------- "+actiontype+" -----------------");
			g_actions[actiontype](actionnode);
			previous_action = actiontype;
		}
		if (actiontype=='for-each-line') {
			for (j=0; j<g_json.lines.length; j++){
				g_noline = j;
				$("#batch-log").append("<br>================ LINE "+(g_noline+1)+" =============================");
				processListActions($(actionnode).children());
			}
		}
		if (actiontype=='if-then-else') {
			var if_action = $('if-part',actionnode).children()[0]; // only one action in test
			var then_actions = $($('then-part',actionnode)[0]).children();
			var else_actions = $($('else-part',actionnode)[0]).children();
			var actiontype = $(if_action).prop("nodeName");
			var actionnode = if_action;
			$("#batch-log").append("<br>================ IF ===============================");			
			if (g_actions[actiontype](actionnode)){
				$("#batch-log").append("<br>================ THEN =============================");			
				processListActions(then_actions);
			}
			else {
				$("#batch-log").append("<br>================ ELSE =============================");			
				processListActions(else_actions);
			}
			$("#batch-log").append("<br>================ END IF ============================");			
		}
	}
};


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//---------------------------FOR EACH TREE ------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['for-each-tree'] = function forEachTree(node)
//=================================================
{
	var code = getTxtvals($("code",node));
	var url1 = serverBCK_API+"/portfolios?active=1&search="+code;
	$.ajax({
		async: false,
		type : "GET",
		dataType : "xml",
		url : url1,
		code : code,
		success : function(data) {
			var nb = parseInt($('portfolios',data).attr('count'));
			$("#batch-log").append("<br> Number of trees :"+nb);
			var trees = $("portfolio",data);
			for (var i=0; i<trees.length; i++){
				var portfolio = new Array();
				portfolio [0] = $(trees[i]).attr("id");
				portfolio [1] = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",trees[i])).text();
				var treeref = $(node).attr('id');
				g_trees[treeref] = portfolio;
				$("#batch-log").append("<br>- tree selected - code:"+portfolio [1]+" - portfolioid:"+portfolio [0]);
				processListActions($("actions",node).children());
			}
		}
	});
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//---------------------------FOR EACH USER ------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------


//==================================
g_actions['for-each-user'] = function (node)
//==================================
{
	var username = getTxtvals($("username",node));
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/users?username="+username,
		success : function(data) {
			UIFactory["User"].parse(data);
			for ( var j = 0; j < UsersActive_list.length; j++) {
				var username = UsersActive_list[j].username_node.text();
				var userref = $(node).attr('id');
				g_users[userref] = username;
				$("#batch-log").append("<br>- user selected - username:"+username);
				processListActions($("actions",node).children());
					//------------------------------------
			}
		}
	});
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------------ User -----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------


//=================================================
g_actions['create-user'] = function createUser(node)
//=================================================
{
	var ok = false;
	var identifier = getTxtvals($("identifier",node));
	var lastname = getTxtvals($("lastname",node));
	var firstname = getTxtvals($("firstname",node));
	var email = getTxtvals($("email",node));
	var designer = getTxtvals($("designer",node));
	var password = getTxtvals($("password",node));
	var other = getTxtvals($("other",node));
	if (designer==undefined || designer=='')
		designer ='0';
	//---- get userid ----------
	var userid = "";
	var url = serverBCK_API+"/users/user/username/"+identifier;
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
			ok = true;
			$("#batch-log").append("<br>- user already defined("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
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
			xml +="	<other>"+other+"</other>";
			xml +="	<admin>0</admin>";
			xml +="	<designer>"+designer+"</designer>";
			xml +="</user>";
			xml +="</users>";
			var url = serverBCK_API+"/users/user/"+userid;
			$.ajax({
				async : false,
				type : "PUT",
				contentType: "application/xml; charset=UTF-8",
				dataType : "xml",
				url : url,
				data : xml,
				success : function(data) {
					userid = data;
					ok = true;
					$("#batch-log").append("<br>- user updated("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
				},
				error : function(data) {
					$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in create/update-user ("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);					
				}
			});
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
			xml +="	<other>"+other+"</other>";
			xml +="	<admin>0</admin>";
			xml +="	<designer>"+designer+"</designer>";
			xml +="</user>";
			xml +="</users>";
			var url = serverBCK_API+"/users";
			$.ajax({
				async : false,
				type : "POST",
				contentType: "application/xml; charset=UTF-8",
				dataType : "xml",
				url : url,
				data : xml,
				success : function(data) {
					userid = data;
					ok = true;
					$("#batch-log").append("<br>- user created("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
				},
				error : function(data) {
					$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in create-user ("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);					
				}
			});
		}
	});
	return ok;
};


//=================================================
g_actions['delete-user'] = function deleteUser(node)
//=================================================
{
	var ok = false;
	var identifier = getTxtvals($("identifier",node));
	var userref = $(node).attr("select");
	if (userref!=="")
		identifier = g_users[userref];
	//---- get userid ----------
	var userid = "";
	var url = serverBCK_API+"/users/user/username/"+identifier;
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
			var url = serverBCK_API+"/users/user/" + userid;
			$.ajax({
				async : false,
				type : "DELETE",
				dataType : "text",
				url : url,
				data : "",
				success : function(data) {
					ok = true;
					$("#batch-log").append("<br>- user deleted("+userid+") - identifier:"+identifier);
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- <span class='danger'>ERROR</span> user does not exist - identifier:"+identifier);
		}
	});
	return ok;
}

//=================================================
g_actions['inactivate-user'] = function inactivateUser(node)
//=================================================
{
	var ok = false;
	var identifier = getTxtvals($("identifier",node));
	var userref = $(node).attr("select");
	if (userref!=="")
		identifier = g_users[userref];
	//---- get userid ----------
	var userid = "";
	var url = serverBCK_API+"/users/user/username/"+identifier;
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
			var url = serverBCK_API+"/users/user/" + userid;
			$.ajax({
				async : false,
				type : "GET",
				contentType: "application/xml",
				dataType : "xml",
				url : url,
				success : function(data) {
					$("active",data).text('0');
					data = xml2string(data);
					$.ajax({
						type : "PUT",
						dataType : "text",
						url : url,
						data : data,
						success : function(data) {
							ok = true;
							$("#batch-log").append("<br>- user inactived ("+userid+") - identifier:"+identifier);
						},
						error : function(data) {
							$("#batch-log").append("<br>- <span class='danger'>ERROR</span> cannot inactivate user - identifier:"+identifier);
						}
					});
				},
				error : function(data) {
					$("#batch-log").append("<br>- <span class='danger'>ERROR</span> cannot get user info - identifier:"+identifier);
				}

			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- NOT FOUND <span class='danger'>ERROR</span> user does not exist - identifier:"+identifier);
		}
	});
	return ok;
}

///=================================================
g_actions['activate-user'] = function activateUser(node)
//=================================================
{
	var ok = false;
	var identifier = getTxtvals($("identifier",node));
	var userref = $(node).attr("select");
	if (userref!=="")
		identifier = g_users[userref];
	//---- get userid ----------
	var userid = "";
	var url = serverBCK_API+"/users/user/username/"+identifier;
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
			var url = serverBCK_API+"/users/user/" + userid;
			$.ajax({
				async : false,
				type : "GET",
				contentType: "application/xml",
				dataType : "xml",
				url : url,
				success : function(data) {
					$("active",data).text('1');
					data = xml2string(data);
					$.ajax({
						type : "PUT",
						dataType : "text",
						url : url,
						data : data,
						success : function(data) {
							ok = true;
							$("#batch-log").append("<br>- user actived ("+userid+") - identifier:"+identifier);
						},
						error : function(data) {
							$("#batch-log").append("<br>- <span class='danger'>ERROR</span> cannot activate user - identifier:"+identifier);
						}
					});
				},
				error : function(data) {
					$("#batch-log").append("<br>- <span class='danger'>ERROR</span> cannot get user info - identifier:"+identifier);
				}

			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- NOT FOUND <span class='danger'>ERROR</span> user does not exist - identifier:"+identifier);
		}
	});
	return ok;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-------------------------------- User Group ---------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['create-usergroup'] = function CreateUserGroup(node)
//=================================================
{
	var ok = false;
	var usergroup = getTxtvals($("usergroup",node));
	var url = serverBCK_API+"/usersgroups?label="+usergroup;
	$.ajax({
		async : false,
		type : "POST",
		contentType: "application/xml; charset=UTF-8",
		dataType : "text",
		url : url,
		success : function(data) {
			ok = true;
			var usergroupid = data;
			get_list_usersgroups();
			$("#batch-log").append("<br>- usergroup created ("+usergroupid+") - label:"+usergroup);
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***<span>ATTENTION</span>already defined - label:"+usergroup);					
		}
	});
	return ok;
}

//=================================================
g_actions['join-usergroup'] = function JoinUserGroup(node)
//=================================================
{
	var ok = false;
	var role = "";
	var user = "";
	var usergroup = getTxtvals($("usergroup",node));
	var select_user = $("user>txtval",node).attr("select");
	if(typeof(select_user)=='undefined')
		user = $("user>txtval",node).text();
	else
		user = eval("g_json.lines["+g_noline+"]."+select_user);
	//---- get userid ----------
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			var user_id = data;
			var xml = "<users><user id='"+data+"'/></users>";
			//---- get usergroupid ----------
			var groupid = "";
			var url = serverBCK_API+"/usersgroups";
			$.ajax({
				async : false,
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
						$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in JoinUserGroup - usergroup:"+usergroup+" NOT FOUND - user:"+user);
					else {
						//---- join group --------------
						$.ajax({
							async : false,
							type : 'PUT',
							dataType : "text",
							url : serverBCK_API+"/usersgroups?group=" + groupid + "&user=" + user_id,
							data : "",
							success : function(data) {
								ok = true;
								$("#batch-log").append("<br>- JoinUserGroup - usergroup:"+usergroup+" - user:"+user);
							},
							error : function(data) {
								$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in JoinUserGroup - usergroup:"+usergroup+" - user:"+user);
							}
						});
					}
				},
				error : function(data) {
					$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in JoinUserGroup - usergroup:"+usergroup+" - user:"+user);
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in JoinUserGroup - usergroup:"+usergroup+" - user:"+user+" NOT FOUND");
		}
	});
	return ok;
}

//=================================================
g_actions['leave-usergroup'] = function LeaveUserGroup(node)
//=================================================
{
	var ok = false;
	var role = "";
	var user = "";
	var usergroup = getTxtvals($("usergroup",node));
	var select_user = $("user>txtval",node).attr("select");
	if(typeof(select_user)=='undefined')
		user = $("user>txtval",node).text();
	else
		user = eval("g_json.lines["+g_noline+"]."+select_user);
	//---- get userid ----------
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			var user_id = data;
			var xml = "<users><user id='"+data+"'/></users>";
			//---- get usergroupid ----------
			var groupid = "";
			var url = serverBCK_API+"/usersgroups";
			$.ajax({
				async : false,
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
						$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in LeaveUserGroup - usergroup:"+usergroup+" NOT FOUND - user:"+user);
					else {
						//---- leave group --------------
						$.ajax({
							type : 'DELETE',
							dataType : "text",
							url : serverBCK_API+"/usersgroups?group=" + groupid + "&user=" + user_id,
							data : "",
							success : function(data) {
								ok = true;
								$("#batch-log").append("<br>- LeaveUserGroup - usergroup:"+usergroup+" - user:"+user);
							},
							error : function(data) {
								$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in LeaveUserGroup - usergroup:"+usergroup+" - user:"+user);
							}
						});
					}
				},
				error : function(data) {
					$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in LeaveUserGroup - usergroup:"+usergroup+" - user:"+user);
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in LeaveUserGroup - usergroup:"+usergroup+" - user:"+user+" NOT FOUND");
		}
	});
	return ok;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ Delete Tree ----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['delete-tree'] = function deleteTree(node)
//=================================================
{
	var ok = false;
	var code = getTxtvals($("code",node));
	//----- get tree id -----
	try {
		var portfolioid = UIFactory["Portfolio"].getid_bycode(code,false);
		if (portfolioid!=undefined) {
			var url = serverBCK_API+"/portfolios/portfolio/" + portfolioid;
			$.ajax({
				async : false,
				type : "DELETE",
				contentType: "application/xml",
				dataType : "xml",
				url : url,
				data : "",
				success : function(data) {
					ok = true;
					$("#batch-log").append("<br>- tree deleted - code:|"+code+"| portfolioid:"+portfolioid);
				},
				error : function(jqxhr,textStatus) {
					$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> delete tree - code:|"+code+" ---- NOT FOUND ----");
				}
			});
		} else {
			$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> delete tree - code:|"+code+" ---- NOT FOUND ----");
		}	
	}
	catch(err) {
		$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> delete tree - code:|"+code+" ---- NOT FOUND ----");
	}
	return ok;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-------------------------- Create Tree --------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['create-tree'] = function createTree(node)
//=================================================
{
	var ok = false;
	var code = getTxtvals($("code",node));
	var treeref = $(node).attr('id');
	if (code!="") {
		var url = serverBCK_API+"/portfolios/portfolio/code/" + code;
		$.ajax({
			async : false,
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
			},
			error : function(data) {
				var label = getTxtvals($("label",node));
				var template = getTxtvals($("template",node));
				//----- create tree from template -----
				var portfolioid = "";
				var url = serverBCK_API+"/portfolios/instanciate/null?sourcecode="+template+"&targetcode="+code+"&owner=true";
				$.ajax({
					async : false,
					type : "POST",
					contentType: "application/xml",
					dataType : "text",
					url : url,
					data : "",
					success : function(data) {
						portfolioid = data;
						var portfolio = new Array();
						portfolio [0] = portfolioid;
						portfolio [1] = code;
						g_trees[treeref] = portfolio;
						//----- update tree label -----
						if (code!="" && label!="") {
							$.ajax({
								async : false,
								type : "GET",
								dataType : "xml",
								url : serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag=root",
								success : function(data) {
									var nodeid = $("asmRoot",data).attr('id');
									var xml = "<asmResource xsi_type='nodeRes'>";
									xml += "<code>"+code+"</code>";
									for (var lan=0; lan<languages.length;lan++)
										xml += "<label lang='"+languages[lan]+"'>"+label+"</label>";
									xml += "</asmResource>";
									$.ajax({
										async : false,
										type : "PUT",
										contentType: "application/xml",
										dataType : "text",
										data : xml,
										url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
										success : function(data) {
											ok = true;
											$("#batch-log").append("<br>- tree created ("+portfolioid+") - code:"+code);
											ok = true;
										},
										error : function(data) {
											$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in  create tree - code:"+code);
										}
									});
								},
								error : function(data) {
									$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in  create tree - code:"+code);
								}
							});
						} else {
							$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in  create tree update root label - code:"+code);
						}
					},
					error : function(data) {
						$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in  create tree - code:"+code);
					}
				});
			}
		});
	} else {
		$("#batch-log").append("<br>-***<span class='danger'>ERROR</span> in  create tree - code is empty");
	}
	return ok;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//---------------------------Select Tree --------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['select-tree'] = function selectTree(node)
//=================================================
{
	var ok = false;
	var code = getTxtvals($("code",node));
	//----- get tree id -----
	var portfolioid = UIFactory["Portfolio"].getid_bycode(code,false); 
	if (portfolioid!=""){
		ok = true;
		var portfolio = new Array();
		portfolio [0] = portfolioid;
		portfolio [1] = code;
		var treeref = $(node).attr('id');
		g_trees[treeref] = portfolio;
		$("#batch-log").append("<br>- tree selected -  - code:"+code+" - portfolioid:"+portfolioid);
	}
	else {
		$("#batch-log").append("<br> **** tree does not exist  - code:"+code);
	}
	return ok;
}


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Copy Tree -----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['copy-tree'] = function copyTree(node)
//=================================================
{
	var ok = false;
	var code = getTxtvals($("code",node));
	var label = getTxtvals($("label",node));
	var template = getTxtvals($("template",node));
	$("#batch-log").append("<br>copy-tree template:|"+template+"| code:|"+code+"| label:|"+label+"|");
	//----- create tree from template -----
	var portfolioid = "";
	portfolioid = UIFactory["Portfolio"].copy_bycode(template,code);
	//----- update tree label -----
	if (code!="" && label!="")
		$.ajax({
			async : false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag=root",
			success : function(data) {
				var nodeid = $("asmRoot",data).attr('id');
				var xml = "<asmResource xsi_type='nodeRes'>";
				xml += "<code>"+code+"</code>";
				xml += "<label lang='"+LANG+"'>"+label+"</label>";
				xml += "</asmResource>";
				$.ajax({
					async : false,
					type : "PUT",
					contentType: "application/xml",
					dataType : "text",
					data : xml,
					url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
					success : function(data) {
						ok = true;
						treeid = data;
						$("#batch-log").append("<br>- copy-tree created ("+treeid+") - code:"+code);
					},
					error : function(data) {
						$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in  copy-tree - code:"+code);
					}
				});
			},
			error : function(data) {
				$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in  copy-tree - code:"+code);
			}
		});
	return ok;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ Update Tree Root -----------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['update-tree-root'] = function updateTreeRoot(node)
//=================================================
{
	var ok = false;
	var oldcode = getTxtvals($("oldcode",node));
	var newcode = getTxtvals($("newcode",node));
	var label = getTxtvals($("label",node));
	if (oldcode!="" && newcode!="") {
		$.ajax({
			async : false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode=" + oldcode + "&semtag=root",
			success : function(data) {
				var nodeid = $("asmRoot",data).attr('id');
				var xml = "<asmResource xsi_type='nodeRes'>";
				xml += "<code>"+newcode+"</code>";
				for (var lan=0; lan<languages.length;lan++)
					if (lan==LANGCODE && label!="")
						xml += "<label lang='"+languages[lan]+"'>"+label+"</label>";
					else
						xml += "<label lang='"+languages[lan]+"'>"+$("label[lang='"+languages[lan]+"']",$("asmResource[xsi_type='nodeRes']",data)).text()+"</label>";
				xml += "</asmResource>";
				$.ajax({
					type : "PUT",
					contentType: "application/xml",
					dataType : "text",
					data : xml,
					url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
					success : function(data) {
						ok = true;
						$("#batch-log").append("<br>- tree root updated ("+oldcode+") - newcode:"+newcode);
					},
					error : function(data) {
						$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in  updateTreeRoot - code:"+oldcode+" not found");
					}
				});
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in  updateTreeRoot - code:"+oldcode);
			}
		});
	} else {
		$("#batch-log").append("<br>-***<span class='danger'>ERROR</span> in updateTreeRoot - oldcode or newcode is empty");
	}
	return ok;
}


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Share Tree ----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['share-tree'] = function shareTree(node)
//=================================================
{
	var ok = false;
	var role = "";
	var user = "";
	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
	var user = getTxtvals($("user",node));
	//---- get userid ----------
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			var user_id = data;
			var xml = "<users><user id='"+data+"'/></users>";
			//---- get role groupid ----------
			var groupid = "";
			var url = serverBCK_API+"/rolerightsgroups?portfolio="+g_trees[treeref][0]+"&role="+role;
			$.ajax({
				async : false,
				type : "GET",
				contentType: "text/html",
				dataType : "text",
				url : url,
				success : function(data) {
					groupid = data;
					//---- share tree --------------
					var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
					$.ajax({
						type : "POST",
						contentType: "application/xml",
						dataType : "xml",
						url : url,
						data : xml,
						success : function(data) {
							ok = true;
							$("#batch-log").append("<br>- tree shared ("+g_trees[treeref][1]+") - user:"+user_id+" - role:"+role);
						},
						error : function(data) {
							$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in share tree ("+g_trees[treeref][1]+") - role:"+role);
						}
					});
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in share tree ("+g_trees[treeref][1]+") - role:"+role);
		}
	});
	return ok;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Set Owner Tree ----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['set-owner'] = function setOwner(node)
//=================================================
{
	var ok = false;
	var user = "";
	var treeref = $(node).attr("select");
	var user = getTxtvals($("user",node));
	//---- get userid ----------
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			var userid = data;
			//---- set owner --------------
			var url = serverBCK_API+"/portfolios/portfolio/" + g_trees[treeref][0] + "/setOwner/" + userid;
			$.ajax({
				async : false,
				type : "PUT",
				dataType : "text",
				url : url,
				success : function(data) {
					ok = true;
					$("#batch-log").append("<br>- tree owner changed ("+g_trees[treeref][1]+") - user:"+user);
				},
				error : function(data) {
					$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> tree owner changed ("+g_trees[treeref][1]+") - user:"+user);
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> tree owner changed ("+g_trees[treeref][1]+") - user:"+user);
		}
	});
	return ok;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Re-Instantiate ------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['re-instantiate-tree'] = function reInstantiateTree(node)
//=================================================
{
	var ok = false;
	var treeref = $(node).attr("select");
	var url = serverBCK_API+"/portfolios/portfolio/" + g_trees[treeref][0] + "/parserights";
	$.ajax({
		async : false,
		type : "POST",
		dataType : "text",
		url : url,
		success : function(data) {
			ok = true;
			$("#batch-log").append("<br>- tree re-instantiated ("+g_trees[treeref][1]+")");
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in tree re-instantiated ("+g_trees[treeref][1]+")");
		}
	});
	return ok;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Unshare Tree ----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['unshare-tree'] = function unshareTree(node)
//=================================================
{
	var ok = false;
	var role = "";
	var user = "";
	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
	var user = getTxtvals($("user",node));
	//---- get userid ----------
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			var user_id = data;
			//---- get role groupid ----------
			var groupid = "";
			var url = serverBCK_API+"/rolerightsgroups?portfolio="+g_trees[treeref][0]+"&role="+role;
			$.ajax({
				async : false,
				type : "GET",
				contentType: "text/html",
				dataType : "text",
				url : url,
				success : function(data) {
					groupid = data;
					//---- unshare tree --------------
					var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+user_id;
					$.ajax({
						async : false,
						type : "DELETE",
						contentType: "application/xml",
						dataType : "xml",
						url : url,
						data : "",
						success : function(data) {
							ok = true;
							$("#batch-log").append("<br>- tree unshared ("+g_trees[treeref][1]+") - user:"+user_id+" - role:"+role);
						},
						error : function(data) {
							$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in unshare tree ("+g_trees[treeref][1]+") - role:"+role);
						}
					});
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in unshare tree ("+g_trees[treeref][1]+") - role:"+role);
		}
	});
	return ok;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ Update Resource ------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['update-resource'] = function updateResource(node)
//=================================================
{
	var ok = 0;
	var type = $(node).attr("type");
	var attributes = $("attribute",node)
	//------------ Target --------------------
	var url = getTargetUrl(node);
	//--------------------------------
	var nodes = new Array();
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			if (this.url.indexOf('/node/')>-1) {  // get by uuid
				var results = $('*',data);
				nodes[0] = results[0];
			} else {							// get by code and semtag
				nodes = $("node",data);
			}
			if (nodes.length>0){
				for (var i=0; i<nodes.length; i++){
					//-------------------
					var nodeid = $(nodes[i]).attr('id');
					var resource = $("asmResource[xsi_type='"+type+"']",nodes[i]);
					for (var j=0; j<attributes.length; j++){
						var attribute_name = $(attributes[j]).attr("name");
						var language_dependent = $(attributes[j]).attr("language-dependent");
						var attribute_value =  getTxtvals($("attribute[name='"+attribute_name+"']",node));
						if (language_dependent=='Y')
							$(attribute_name+"[lang='"+LANG+"']",resource).text(attribute_value);
						else
							$(attribute_name,resource).text(attribute_value);
					}
					var data = "<asmResource xsi_type='"+type+"'>" + $(resource).html() + "</asmResource>";
					var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
					//-------------------
					$.ajax({
						async : false,
						type : "PUT",
						contentType: "application/xml",
						dataType : "text",
						data : strippeddata,
						url : serverBCK_API+"/resources/resource/" + nodeid,
						success : function(data) {
							ok++;
							$("#batch-log").append("<br>- resource updated ("+nodeid+")");
						},
						error : function(data) {
							$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update resource("+nodeid+")");
						}
					});
					//-------------------
				}
			} else {
				$("#batch-log").append("<br>- ***NOT FOUND <span class='danger'>ERROR</span>");
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***NOT FOUND <span class='danger'>ERROR</span>");
		}
	});
	return (ok!=0 && ok == nodes.length);
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ Update Node Resource -------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['update-node-resource'] = function updateResource(node)
//=================================================
{
	var ok = 0;
	var type = $(node).attr("type");
	//------------ Target --------------------
	var url = getTargetUrl(node);
	//--------------------------------
	var nodes = new Array();
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			if (this.url.indexOf('/node/')>-1) {  // get by uuid
				var results = $('*',data);
				nodes[0] = results[0];
			} else {							// get by code and semtag
				nodes = $("node",data);
			}
			if (nodes.length>0){
				for (var i=0; i<nodes.length; i++){
					//-------------------
					var nodeid = $(nodes[i]).attr('id');
					var resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
					var code = getTxtvals($("newcode",node));
					var label = getTxtvals($("label",node));
					$("code",resource).text(code);
					$("label[lang='"+LANG+"']",resource).text(label);
					var data = "<asmResource xsi_type='nodeRes'>" + $(resource).html() + "</asmResource>";
					var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
					//-------------------
					$.ajax({
						async : false,
						type : "PUT",
						contentType: "application/xml",
						dataType : "text",
						data : strippeddata,
						url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
						success : function(data) {
							ok++;
							$("#batch-log").append("<br>- resource updated ("+nodeid+")");
						},
						error : function(data) {
							$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update resource("+nodeid+")");
						}
					});
					//-------------------
				}
			} else {
				$("#batch-log").append("<br>- ***NOT FOUND <span class='danger'>ERROR</span>");
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***NOT FOUND <span class='danger'>ERROR</span>");
		}
	});
	return (ok!=0 && ok == nodes.length);
}


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ Update Rights ------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['update-rights'] = function updateRights(node)
//=================================================
{
	var ok = 0;
	var role = $(node).attr("role");
	var rd = $(node).attr("rd");
	var wr = $(node).attr("wr");
	var dl = $(node).attr("dl");
	var sb = $(node).attr("sb");
	var select = $(node).attr("select");
	var idx = select.lastIndexOf(".");
	var treeref = select.substring(0,idx);
	var semtag = select.substring(idx+1);
	//------------ Target --------------------
	var url = getTargetUrl(node);
	//--------------------------------
	var nodes = new Array();
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			if (this.url.indexOf('/node/')>-1) {  // get by uuid
				var results = $('*',data);
				nodes[0] = results[0];
			} else {							// get by code and semtag
				nodes = $("node",data);
			}
			if (nodes.length>0){
				for (var i=0; i<nodes.length; i++){
					//-------------------
					var nodeid = $(nodes[i]).attr('id');
					var xml = "<node><role name='"+role+"'><right RD='"+rd+"' WR='"+wr+"' DL='"+dl+"' SB='"+sb+"'></right></role></node>"
					nodes = nodes.slice(1,nodes.length);
					$.ajax({
						async : false,
						type : "POST",
						contentType: "application/xml",
						dataType : "text",
						data : xml,
						nodeid : nodeid,
						semtag : semtag,
						url : serverBCK_API+"/nodes/node/" + nodeid +"/rights",
						success : function(data) {
							ok++;
							$("#batch-log").append("<br>- resource rights updated ("+this.nodeid+") - RD="+rd+" WR="+wr+" DL="+dl+" SB="+sb);
						},
						error : function(data,nodeid,semtag) {
							$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> resource rights updated ("+this.nodeid+") - RD="+rd+" WR="+wr+" DL="+dl+" SB="+sb);
						}
					});
				}
			} else {
				$("#batch-log").append("<br>- ***NOT FOUND <span class='danger'>ERROR</span>");
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update rights("+nodeid+") - semtag="+semtag);
		}
	});
	return (ok!=0 && ok == nodes.length);
}


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------------------------- -byid -------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['update-field-byid'] = function updateFieldById(node)
//=================================================
{
	var ok = false;
	var text = getTxtvals($("text",node));
	var nodeid = getTxtvals($("uuid",node));
	var xml = "<asmResource xsi_type='Field'>";
	xml += "<text lang='"+LANG+"'>"+text+"</text>";
	xml += "</asmResource>";
	$.ajax({
		async : false,
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		url : serverBCK_API+"/resources/resource/" + nodeid,
		success : function(data) {
			ok = true;
			$("#batch-log").append("<br>- resource updated ("+nodeid+")");
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update resource("+nodeid+")");
		}
	});
	return ok;
}

//=================================================
g_actions['reset-document-byid'] = function resetDocumentById(node)
//=================================================
{
	var ok = false;
	var nodeid = getTxtvals($("uuid",node));
	var xml = "<asmResource xsi_type='Document'>";
	xml += "<filename lang='fr'>Aucun document</text>";
	xml += "<filename lang='en'>No Document</text>";
	xml += "<size lang='fr'></text>";
	xml += "<size lang='en'></text>";
	xml += "<type lang='fr'></text>";
	xml += "<type lang='en'></text>";
	xml += "<fileid lang='fr'></text>";
	xml += "<fileid lang='en'></text>";
	xml += "</asmResource>";
	$.ajax({
		async : false,
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		url : serverBCK_API+"/resources/resource/" + nodeid +"?delfile=true",
		success : function(data) {
			ok = true;
			$("#batch-log").append("<br>- document reset ("+nodeid+")");
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in reset document("+nodeid+")");
		}
	});
	return ok;
}

//=================================================
g_actions['delete-node-byid'] = function deleteNodeById(node)
//=================================================
{
	var ok = false;
	var nodeid = getTxtvals($("uuid",node));
	$.ajax({
		async : false,
		type : "DELETE",
		dataType : "text",
		url : serverBCK_API+"/nodes/node/=" + nodeid,
		data : "",
		success : function(data) {
			ok = true;
			$("#batch-log").append("<br>- node deleted ("+nodeid+")");
		},
		error : function(data) {
			$("#batch-log").append("<br>- *** <span class='danger'>ERROR</span> in deleting node : "+nodeid);
		}
	});
	return ok;
}



//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------------------------- Portfolio Group ---------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['create-portfoliogroup'] = function CreatePortfolioGroup(node)
//=================================================
{
	var ok = false;
	var portfoliogroup = getTxtvals($("portfoliogroup",node));
	var url = serverBCK_API+"/portfoliogroups?type=portfolio&label="+portfoliogroup;
	$.ajax({
		async : false,
		type : "POST",
		contentType: "application/xml; charset=UTF-8",
		dataType : "text",
		url : url,
		success : function(data) {
			ok = true;
			var portfoliogroupid = data;
			get_list_portfoliosgroups();
			$("#batch-log").append("<br>- portfoliogroup created ("+portfoliogroupid+") - label:"+portfoliogroup);
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in create-portfoliogroup - label:"+portfoliogroup);					
		}
	});
	return ok;
}

//=================================================
g_actions['join-portfoliogroup'] = function JoinPortfolioGroup(node)
//=================================================
{
	var ok = false;
	var portfoliogroup = getTxtvals($("portfoliogroup",node));
	var select = $(node).attr("select");  // select = #portfoliocode. or refif
	//---- get portfoliogroupid ----------
	var groupid = "";
	var url = serverBCK_API+"/portfoliogroups";
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			var groups = $("group",data);
			for (var k=0;k<groups.length;k++){
				if ($('label',groups[k]).text()==portfoliogroup)
					groupid = $(groups[k]).attr("id");
			}
			if (groupid=="")
				$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in JoinPortfolioGroup - portfoliogroup:"+portfoliogroup+" NOT FOUND");
			else {
				var portfolios = new Array();
				if (select.indexOf("#")<0) {
					var treeref = select;
					//---- join group --------------
					$.ajax({
						type : 'PUT',
						dataType : "text",
						url : serverBCK_API+"/portfoliogroups?group="+groupid+"&uuid=" + g_trees[treeref][0],
						data : "",
						success : function(data) {
							ok = true;
							$("#batch-log").append("<br>- JoinPortfolioGroup - portfoliogroup:"+portfoliogroup+" - portfolio:"+g_trees[treeref][1]);
						},
						error : function(data) {
							$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in JoinPortfolioGroup - portfoliogroup:"+portfoliogroup+" - portfolio:"+g_trees[treeref][1]);
						}
					});
				}else if (select.length>2) {
					var url = serverBCK_API+"/portfolios?active=1&search="+select.substring(1);
					$.ajax({
						async: false,
						type : "GET",
						dataType : "xml",
						url : url,
						success : function(data) {
							var trees = $("portfolio",data);
							for (var i=0; i<trees.length; i++){
								var portfolioid = $(trees[i]).attr("id");
								//---- join group --------------
								$.ajax({
									type : 'PUT',
									dataType : "text",
									url : serverBCK_API+"/portfoliogroups?group="+groupid+"&uuid=" + portfolioid,
									data : "",
									success : function(data) {
										ok = true;
										$("#batch-log").append("<br>- JoinPortfolioGroup - portfoliogroup:"+portfoliogroup+" - portfolio:"+portfolioid);
									},
									error : function(data) {
										$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in JoinPortfolioGroup - portfoliogroup:"+portfoliogroup+" - portfolio:"+portfolioid);
									}
								});
							}
						}
					});

				}
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in JoinPortfolioGroup - portfoliogroup:"+portfoliogroup);
		}
	});
	return ok;
}

//=================================================
g_actions['leave-portfoliogroup'] = function LeavePortfolioGroup(node)
//=================================================
{
	var ok = false;
	var portfoliogroup = getTxtvals($("portfoliogroup",node));
	var treeref = $(node).attr("select");
	//---- get portfoliogroupid ----------
	var groupid = "";
	var url = serverBCK_API+"/portfoliogroups";
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			var groups = $("group",data);
			for (var k=0;k<groups.length;k++){
				if ($('label',groups[k]).text()==portfoliogroup)
					groupid = $(groups[k]).attr("id");
			}
			if (groupid=="")
				$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in LeavePortfolioGroup - portfoliogroup : "+portfoliogroup+" NOT FOUND");
			else {
				//---- leave group --------------
				$.ajax({
					async : false,
					type : 'DELETE',
					dataType : "text",
					url : serverBCK_API+"/portfoliogroups?group="+groupid+"&uuid=" + g_trees[treeref][0],
					data : "",
					success : function(data) {
						ok = true;
						$("#batch-log").append("<br>- LeavePortfolioGroup - portfoliogroup : "+portfoliogroup+" - portfolio : "+g_trees[treeref][1]);
					},
					error : function(data) {
						$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in JoinPortfolioGroup - portfoliogroup : "+portfoliogroup+" - portfolio:"+g_trees[treeref][1]);
					}
				});
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in JoinPortfolioGroup - portfoliogroup:"+portfoliogroup+" - portfolio:"+g_trees[treeref][1]);
		}
	});
	return ok;
}

//=================================================
g_actions['share-portfoliogroup'] = function sharePortfolioGroup(node)
//=================================================
{
	var ok = false;
	var user = getTxtvals($("identifier",node));;
	var role = getTxtvals($("role",node));
	var portfoliogroup = getTxtvals($("portfoliogroup",node));
	var portfoliogroupid = get_portfoliogroupid(portfoliogroup);
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			var user_id = data;
			var users = "<users><user id='"+user_id+"'/></users>";
			$.ajax({
				async : false,
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/portfoliogroups?group="+portfoliogroupid,
				success : function(data) {
					var portfolios = $("portfolio",data);
					if (portfolios.length>0) {
						for (var i=0; i<portfolios.length;i++) {
							var portfolioid = $(portfolios[i]).attr("id");
							//---- get role groupid ----------
							var groupid = "";
							var url = serverBCK_API+"/rolerightsgroups?portfolio="+portfolioid+"&role="+role;
							$.ajax({
								async : false,
								type : "GET",
								contentType: "text/html",
								dataType : "text",
								url : url,
								success : function(data) {
									groupid = data;
									//---- share tree --------------
									var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
									$.ajax({
										async : false,
										type : "POST",
										contentType: "application/xml",
										dataType : "xml",
										url : url,
										data : users,
										success : function(data) {
											ok = true;
											$("#batch-log").append("<br>* tree shared - portfoliogroup : "+portfoliogroup+" - user : "+user+" - role : "+role+" - portfolioid:"+portfolioid);
										},
										error : function(data) {
											$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in sharing tree - portfoliogroup : "+portfoliogroup+" - user : "+user+" - role : "+role+" - portfolioid : "+portfolioid);
										}
									});
								},
								error : function(data) {
									$("#batch-log").append("<br>- <span class='danger'>ERROR</span> role:"+role+" NOT FOUND - portfolioid : "+portfolioid);
								}
							});
						}
					} else {
						$("#batch-log").append("<br>- <span class='danger'>ERROR</span> - portfoliogroup : "+portfoliogroup+" is EMPTY");				
					}
				},		
				error : function(data) {
					$("#batch-log").append("<br>- <span class='danger'>ERROR</span> Portfoliogroup does not exist - portfoliogroup:"+portfoliogroup);
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- <span class='danger'>ERROR</span> user : "+user+" NOT FOUND");
		}
	});
	return ok;
}

//=================================================
g_actions['unshare-portfoliogroup'] = function unsharePortfolioGroup(node)
//=================================================
{
	var ok = false;
	var user = getTxtvals($("identifier",node));;
	var role = getTxtvals($("role",node));
	var portfoliogroup = getTxtvals($("portfoliogroup",node));
	var portfoliogroupid = get_portfoliogroupid(portfoliogroup);
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
		async : false,
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			var user_id = data;
			async : false,
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/portfoliogroups?group="+portfoliogroupid,
				success : function(data) {
					var portfolios = $("portfolio",data);
					if (portfolios.length>0) {
						for (var i=0; i<portfolios.length;i++) {
							var portfolioid = $(portfolios[i]).attr("id");
							//---- get role groupid ----------
							var groupid = "";
							var url = serverBCK_API+"/rolerightsgroups?portfolio="+portfolioid+"&role="+role;
							$.ajax({
								async : false,
								type : "GET",
								contentType: "text/html",
								dataType : "text",
								url : url,
								success : function(data) {
									groupid = data;
									//---- unshare tree --------------
									var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+user_id;
									$.ajax({
										async : false,
										type : "DELETE",
										contentType: "application/xml",
										dataType : "xml",
										url : url,
										success : function(data) {
											ok = true;
											$("#batch-log").append("<br>* tree unshared - portfoliogroup : "+portfoliogroup+" - user : "+user+" - role : "+role+" - portfolioid:"+portfolioid);
										},
										error : function(data) {
											$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in unsharing tree - portfoliogroup : "+portfoliogroup+" - user : "+user+" - role : "+role+" - portfolioid : "+portfolioid);
										}
									});
								},
								error : function(data) {
									$("#batch-log").append("<br>- <span class='danger'>ERROR</span> role:"+role+" NOT FOUND - portfolioid : "+portfolioid);
								}
							});
						}
					} else {
						$("#batch-log").append("<br>- <span class='danger'>ERROR</span> - portfoliogroup : "+portfoliogroup+" is EMPTY");				
					}
				},		
				error : function(data) {
					$("#batch-log").append("<br>- <span class='danger'>ERROR</span> Portfoliogroup does not exist - portfoliogroup:"+portfoliogroup);
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- <span class='danger'>ERROR</span> user : "+user+" NOT FOUND");
		}
	});
	return ok;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Share with UserGroup ------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['share-usergroup'] = function shareUserGroup(node)
//=================================================
{
	var ok = false;
	var role = "";
	var user = "";
	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
	var usergroupname = getTxtvals($("groupname",node));
	var usergroupid = get_usergroupid(usergroupname);
	
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups?group="+usergroupid,
		success : function(data) {
			var users = "<users>" + $($("users",data)[0]).html() + "</users>";
			if (users.length>20) {
				//---- get role groupid ----------
				var groupid = "";
				var url = serverBCK_API+"/rolerightsgroups?portfolio="+g_trees[treeref][0]+"&role="+role;
				$.ajax({
					async : false,
					type : "GET",
					contentType: "text/html",
					dataType : "text",
					url : url,
					success : function(data) {
						groupid = data;
						//---- share tree --------------
						var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
						$.ajax({
							async : false,
							type : "POST",
							contentType: "application/xml",
							dataType : "xml",
							url : url,
							data : users,
							success : function(data) {
								ok = true;
								$("#batch-log").append("<br>tree shared with usergroup  ("+g_trees[treeref][1]+") - usergroup:"+usergroupname+" - role:"+role);
							},
							error : function(data) {
								$("#batch-log").append("<br>- <span class='danger'>ERROR</span> tree shared with usergroup  ("+g_trees[treeref][1]+") - usergroup:"+usergroupname+" - role:"+role);
							}
						});
					},
					error : function(data) {
						$("#batch-log").append("<br>- <span class='danger'>ERROR</span> tree shared with usergroup  ("+g_trees[treeref][1]+") - usergroup:"+usergroupname+" - role:"+role);
					}
				});
			} else {
				$("#batch-log").append("<br><span class='danger'>ERROR</span> Empty group - tree shared with usergroup  ("+g_trees[treeref][1]+") - usergroup:"+usergroupname+" - role:"+role);
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- <span class='danger'>ERROR</span> tree shared with usergroup  ("+g_trees[treeref][1]+") - usergroup:"+usergroupname+" - role:"+role);
		}
	});
	return ok;
}



//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Unshare with UserGroup ----------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['unshare-usergroup'] = function unshareUserGroup(node)
//=================================================
{
	var ok = false;
	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
	var usergroupname = getTxtvals($("groupname",node));
	var usergroupid = get_usergroupid(usergroupname);
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups?group="+usergroupid,
		success : function(data) {
			var users = $("user",data);
			var groupid = "";
			var url = serverBCK_API+"/rolerightsgroups?portfolio="+g_trees[treeref][0]+"&role="+role;
			$.ajax({
				async : false,
				type : "GET",
				contentType: "text/html",
				dataType : "text",
				url : url,
				success : function(data) {
					groupid = data;
					for (var i=0; i<users.length; i++){
						var userid = $(users[i]).attr('id');
						var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+userid;
						$.ajax({
							async : false,
							type : "DELETE",
							contentType: "application/xml",
							dataType : "xml",
							url : url,
							data : "",
							success : function(data) {
								ok = true;
								$("#batch-log").append("<br>tree with usergroup unshared ("+g_trees[treeref][1]+") - usergroup:"+usergroupname+" - userid:"+userid+" - role:"+role);
							},
							error : function(jqxhr,textStatus) {
								$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in usergroup unshared ("+g_trees[treeref][1]+") - usergroup:"+usergroupname+" - userid:"+userid+" - role:"+role);
							}
						});
					}
				},
				error : function(data) {
					$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in usergroup unshared ("+g_trees[treeref][1]+") - usergroup:"+usergroupname+" - userid:"+userid+" - role:"+role);
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in usergroup unshared ("+g_trees[treeref][1]+") - usergroup:"+usergroupname+" - userid:"+userid+" - role:"+role);
		}
	});
	return ok;
}


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Share Groups --------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['share-groups'] = function shareGroups(node)
//=================================================
{
	var ok = false;
	var role = getTxtvals($("role",node));
	var usergroup = getTxtvals($("usergroup",node));
	var usergroupid = get_usergroupid(usergroup);
	var portfoliogroup = getTxtvals($("portfoliogroup",node));
	var portfoliogroupid = get_portfoliogroupid(portfoliogroup);
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliogroups?group="+portfoliogroupid,
		success : function(data) {
			var portfolios = $("portfolio",data);
			if (portfolios.length>0) {
				$.ajax({
					async : false,
					type : "GET",
					dataType : "xml",
					url : serverBCK_API+"/usersgroups?group="+usergroupid,
					success : function(data) {
						var users = "<users>" + $($("users",data)[0]).html() + "</users>";
						if (users.length>20) {
							for (var i=0; i<portfolios.length;i++) {
								var portfolioid = $(portfolios[i]).attr("id");
								//---- get role groupid ----------
								var groupid = "";
								var url = serverBCK_API+"/rolerightsgroups?portfolio="+portfolioid+"&role="+role;
								$.ajax({
									async : false,
									type : "GET",
									contentType: "text/html",
									dataType : "text",
									url : url,
									success : function(data) {
										groupid = data;
										//---- share tree --------------
										var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
										$.ajax({
											async : false,
											type : "POST",
											contentType: "application/xml",
											dataType : "xml",
											url : url,
											data : users,
											success : function(data) {
												ok = true;
												$("#batch-log").append("<br>* tree shared - portfoliogroup:"+portfoliogroup+" - usergroup:"+usergroup+" - role:"+role+" - portfolioid:"+portfolioid);
											},
											error : function(data) {
												$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in tree sharing with usergroup  - portfolioid:"+portfolioid+") - usergroup:"+usergroup+" - role:"+role);
											}
										});
									},
									error : function(data) {
										$("#batch-log").append("<br>- <span class='danger'>ERROR</span> role does not exist  - portfolioid:"+portfolioid+" - role:"+role);
									}
								});
							}
						} else {
							$("#batch-log").append("<br><span class='danger'>ERROR</span> - Usergroup is empty - usergroup:"+usergroup);
						}
					},
					error : function(data) {
						$("#batch-log").append("<br>- <span class='danger'>ERROR</span> - Usergroup does not exist -  - usergroup:"+usergroup);
					}
				});
			} else {
				$("#batch-log").append("<br>- <span class='danger'>ERROR</span>  - Portfoliogroup is empty - portfoliogroup:"+portfoliogroup);				
			}
		},		
		error : function(data) {
			$("#batch-log").append("<br>- <span class='danger'>ERROR</span> Portfoliogroup does not exist - portfoliogroup:"+portfoliogroup);
		}
	});
	return ok;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Import Node ----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['import-node'] = function importNode(node)
//=================================================
{
	var ok = false
	//------------------------------------
	var source = $("source",node).text();
	if (source=='') // for backward compatibility
		source = $(node).attr("source");
	var idx_source = source.lastIndexOf(".");
	var srcecode = source.substring(0,idx_source);
	if (srcecode.indexOf('#')>-1)
		srcecode = srcecode.substring(1);
	else
		srcecode = g_trees[srcecode][1];
	
	var srcetag = source.substring(idx_source+1);
	//------------------------------------
	var select = $(node).attr("select");
	var idx = select.lastIndexOf(".");
	var treeref = select.substring(0,idx);
	var semtag = select.substring(idx+1);
	//------------------------------------
	if (select.indexOf('#current_node')+select.indexOf('#uuid')>-2){
		if (select.indexOf('#current_node')>-1)
			destid = g_current_node_uuid;
		else
			destid = treeref; // select = porfolio_uuid.#uuid
		var urlS = serverBCK_API+"/nodes/node/import/"+destid+"?srcetag="+srcetag+"&srcecode="+srcecode;
		$.ajax({
			async:false,
			type : "POST",
			dataType : "text",
			url : urlS,
			data : "",
			destid:destid,
			success : function(data) {
				g_current_node_uuid = data;
				$("#batch-log").append("<br>- node added at ("+this.destid+") - semtag="+semtag+ " source="+source);
				ok = true;
			},
			error : function(data) {
				$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in import node("+this.destid+") - semtag="+semtag+ " source="+source);
			}
		});
	} else {
		//------------ Target --------------------
		var url = "";
		if (treeref.indexOf("#")>-1)
			url = serverBCK_API+"/nodes?portfoliocode=" + treeref.substring(1) + "&semtag="+semtag;	
		else
			url = serverBCK_API+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag;
		//--------------------------------
		$.ajax({
			async: false,
			type : "GET",
			dataType : "xml",
			url : url,
			success : function(data) {
				var nodes = $("node",data);
				if (nodes.length>0){
					for (var i=0; i<nodes.length; i++){
						destid = $(nodes[i]).attr('id');
						var urlS = serverBCK_API+"/nodes/node/import/"+destid+"?srcetag="+srcetag+"&srcecode="+srcecode;
						$.ajax({
							async:false,
							type : "POST",
							dataType : "text",
							url : urlS,
							data : "",
							destid:destid,
							success : function(data) {
								ok = true;
								g_current_node_uuid = data;
								$("#batch-log").append("<br>- node added at ("+this.destid+") - semtag="+semtag+ " source="+source);
								ok = true;
							},
							error : function(data) {
								$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in import node("+this.destid+") - semtag="+semtag+ " source="+source);
							}
						});
					}
				} else {
					$("#batch-log").append("<br>- <span class='danger'>ERROR</span> NOT FOUND - semtag="+semtag+ " source="+source);
				}
			},
			error : function(data) {
				$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in import NOT FOUND - semtag="+semtag+ " source="+source);
			}
		});
	}
	return ok;
}



//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ Delete Node ----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['delete-node'] = function deleteNode(node)
//=================================================
{
	var ok = 0;
	//------------ Target --------------------
	var url = getTargetUrl(node);
	//--------------------------------
	var nodes = new Array();
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			if (this.url.indexOf('/node/')>-1) {  // get by uuid
				var results = $('*',data);
				nodes[0] = results[0];
			} else {							// get by code and semtag
				nodes = $("node",data);
			}
			for (i=0; i<nodes.length; i++){
				var nodeid = $(nodes[i]).attr('id');
				$.ajax({
					type : "DELETE",
					dataType : "text",
					url : serverBCK_API+"/nodes/node/" + nodeid,
					nodeid : nodeid,
					success : function(data) {
						ok = true;
						$("#batch-log").append("<br>- node deleted ("+this.nodeid+")");
					},
					error : function(data) {
						$("#batch-log").append("<br>- *** <span class='danger'>ERROR</span> in deleting node : "+this.nodeid);
					}
				});
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***NOT FOUND <span class='danger'>ERROR</span>");
		}
	});
	return (ok!=0 && ok == nodes.length);
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Moveup Node ---------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['moveup-node'] = function moveupNode(node)
//=================================================
{
	var ok = 0;
	//------------ Target --------------------
	var url = getTargetUrl(node);
	//--------------------------------
	var nodes = new Array();
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : url,
		success : function(data) {
			if (this.url.indexOf('/node/')>-1) {  // get by uuid
				var results = $('*',data);
				nodes[0] = results[0];
			} else {							// get by code and semtag
				nodes = $("node",data);
			}
			for (i=0; i<nodes.length; i++){
				var nodeid = $(nodes[i]).attr('id');
				$.ajax({
					type : "POST",
					dataType : "text",
					current:nodeid,
					url : serverBCK_API+"/nodes/node/" + nodeid + "/moveup",
					success : function(data) {
						ok++;
						$("#batch-log").append("<br>- node moved up - nodeid("+this.current+")");
					},
					error : function(jqxhr,textStatus) {
						$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in moveup node - nodeid("+this.current+")");
					}
				});
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***NOT FOUND <span class='danger'>ERROR</span> in update-moveup ");
		}
	});
	return (ok!=0 && ok == nodes.length);
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- UPDATE-PROXY --------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['update-proxy'] = function update_proxy(node)
//=================================================
{
	var ok = 0;
	//------------ Source --------------------
	var srce_url = getSourceUrl(node);
	var sources = new Array();
	var sourceid = "";
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : srce_url,
		success : function(data) {
			if (this.url.indexOf('/node/')>-1) {  // get by uuid
				var results = $('*',data);
				sources[0] = results[0];
			} else {							// get by code and semtag
				sources = $("node",data);
			}
			sourceid = $(sources[0]).attr('id');
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***SOURCE NOT FOUND <span class='danger'>ERROR</span>");
		}
	});
	//------------ Target --------------------
	var target_url = getTargetUrl(node);
	var nodes = new Array();
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : target_url,
		success : function(data) {
			if (this.url.indexOf('/node/')>-1) {  // get by uuid
				var results = $('*',data);
				nodes[0] = results[0];
			} else {							// get by code and semtag
				nodes = $("node",data);
			}
			for (i=0; i<nodes.length; i++){
				ok++;
				var targetid = $(nodes[i]).attr('id');
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
					url : serverBCK_API+"/resources/resource/" + targetid,
					success : function(data) {
						ok++;
						$("#batch-log").append("<br>- resource updated target : "+this.targetid+" - srce: "+this.sourceid);
						//===========================================================
					},
					error : function(data) {
						$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update resource");
					}
				});
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***TARGET NOT FOUND <span class='danger'>ERROR</span> ");
		}
	});
	return (ok!=0 && ok == nodes.length);
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- UPDATE-URL2UNIT -----------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['update-url2unit'] = function update_url2unit(node)
//=================================================
{
	var ok = 0;
	//------------ Source --------------------
	var srce_url = getSourceUrl(node);
	var sources = new Array();
	var sourceid = "";
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : srce_url,
		success : function(data) {
			if (this.url.indexOf('/node/')>-1) {  // get by uuid
				var results = $('*',data);
				sources[0] = results[0];
			} else {							// get by code and semtag
				sources = $("node",data);
			}
			sourceid = $(sources[0]).attr('id');
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***SOURCE NOT FOUND <span class='danger'>ERROR</span>");
		}
	});
	//------------ Target --------------------
	var target_url = getTargetUrl(node);
	var nodes = new Array();
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : target_url,
		success : function(data) {
			if (this.url.indexOf('/node/')>-1) {  // get by uuid
				var results = $('*',data);
				nodes[0] = results[0];
			} else {							// get by code and semtag
				nodes = $("node",data);
			}
			for (i=0; i<nodes.length; i++){
				ok++;
				var targetid = $(nodes[i]).attr('id');
				//----- get target ----------------
				var resource = $("asmResource[xsi_type='URL2Unit']",nodes[i]);
				$("uuid",resource).text(sourceid);
				var xml = "<asmResource xsi_type='URL2Unit'>" + $(resource).html() + "</asmResource>";
				var strippeddata = xml.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
				//----- update target ----------------
				$.ajax({
					type : "PUT",
					contentType: "application/xml",
					dataType : "text",
					data : xml,
					targetid : targetid,
					sourceid : sourceid,
					url : serverBCK_API+"/resources/resource/" + targetid,
					success : function(data) {
						ok++;
						$("#batch-log").append("<br>- URL2Unit updated target : "+this.targetid+" - srce: "+this.sourceid);
						//===========================================================
					},
					error : function(data) {
						$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update url2unit");
					}
				});
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***TARGET NOT FOUND <span class='danger'>ERROR</span> ");
		}
	});
	return (ok!=0 && ok == nodes.length);
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
	
	g_json = {};
	g_json['lines'] = [];
	g_json['lines'][0] = 'no_json';// there is no json
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
		url : serverBCK_API+"/portfolios/portfolio/code/"+model_code + "?resources=true",
		success : function(data) {
			var portfoliologcode = "";
			if ($("asmContext:has(metadata[semantictag='portfoliologcode'])",data).length>0)
				portfoliologcode = $("text[lang='"+LANG+"']",$("asmResource[xsi_type='Field']",$("asmContext:has(metadata[semantictag='portfoliologcode'])",data))).text();
			var nodeid = $("asmRoot",data).attr("id");
			// ---- transform karuta portfolio to batch model
			var urlS = serverBCK_API+"/nodes/"+nodeid+"?xsl-file="+karutaname+"/karuta/xsl/karuta2batch.xsl&lang="+LANG;
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : urlS,
				success : function(data) {
					g_xmlDoc = data;
					processAll(model_code,portfoliologcode);
				}
			 });
		}
	});
}

//==============================
function get_list_portfoliosgroups()
//==============================
{
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfoliogroups",
		data: "",
		success : function(data) {
			UIFactory["PortfoliosGroup"].parse(data);
		}
	});
}

//==============================
function get_portfoliogroupid(groupname)
//==============================
{
	var groupid = null;
	for (var i=0;i<PortfoliosGroups_list.length;i++){
		if (PortfoliosGroups_list[i].label==groupname){
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
	$.ajax({
		async : false,
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups",
		data: "",
		success : function(data) {
			UIFactory["UsersGroup"].parse(data);
		}
	});
}

//==============================
function get_usergroupid(groupname)
//==============================
{
	var groupid = null;
	if (usersgroups_list.length==0)
		get_list_usersgroups();
	for (var i=0;i<usersgroups_list.length;i++){
		if (usersgroups_list[i].label==groupname){
			groupid = usersgroups_list[i].id;
			break;
		}
	}
	return groupid;
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
		code = UICom.structure["ui"][inputid].getCode().trim();
		g_json_line[code] = UICom.structure["ui"][inputid].resource.getView().trim();
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

//==================================================
function execReport_BatchCSV(parentid,title,codeReport)
//==================================================
{
	csvreport = [];
	$.ajaxSetup({async: false});
	var root_node = g_portfolio_current;
	if (codeReport.indexOf("@local")>-1){
		root_node = UICom.structure["ui"][parentid].node;
		codeReport = codeReport.substring(0,codeReport.indexOf("@local"))+codeReport.substring(codeReport.indexOf("@local")+6);
	}

	report_getModelAndPortfolio(codeReport,root_node,null,g_dashboard_models);
	$.ajaxSetup({async: true});
	initBatchVars();
	if (csvreport.length>3) {
		var codesLine = csvreport[0].substring(0,csvreport[0].length-1).split(csvseparator);
		g_json = convertCSVLine2json(codesLine,csvreport[1]);
//		g_json['model_code'] = codeBatch;
		g_json['lines'] = [];
		codesLine = csvreport[2].substring(0,csvreport[2].length-1).split(csvseparator);
		for (var i=3; i<csvreport.length;i++){
			g_json.lines[g_json.lines.length] = convertCSVLine2json(codesLine,csvreport[i]);
		}
		//------------------------------
		display_execBatch()
		//------------------------------
		getModelAndProcess(g_json.model_code);		
		UIFactory.Node.reloadUnit();
		} else  {
		alertHTML("No report data for batch execution!");
	}
};

//==================================================
function convertCSVLine2json(codes,csvline)
//==================================================
{
	var items = csvline.split(csvseparator);
	var g_json_line = {};
	for ( var i = 0; i < codes.length; i++) {
		g_json_line[codes[i]] = items[i];
	}
	return g_json_line;
};



//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ Update Node ----------------------------------
//-----------------------------------------------------------------------
//---------------------- for backward compatibility ---------------------

//=================================================
g_actions['update-node'] = function updateNode(node)
//=================================================
{
	var select = $(node).attr("select");
	var type = $(node).attr("type");
	var idx = select.indexOf(".");
	//----------------------------------------------------
	if (select=='#current_node') {
		$.ajax({
			async : false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes/node/"+g_current_node_uuid,
			success : function(data) {
				var results = $('*',data);
				var nodes = new Array();
				nodes[0] = results[0];
				var text = getTxtvals($("text",node));
				if ($("source",node).length>0){
					var source_select = $("source",node).attr("select");
					var source_idx = source_select.indexOf(".");
					var source_treeref = source_select.substring(0,source_idx);
					var source_semtag = source_select.substring(source_idx+1);
					if (source_semtag=="UUID")
						text = g_trees[source_treeref][0];
				}
				//---------------------------
				if (type=='Field') {//---------------------- for backward compatibility ---------------------
					updateField(nodes,node,type,semtag,text);
				}
				if (type=='Proxy') {//---------------------- for backward compatibility ---------------------
					updateProxy(nodes,node,type,semtag);
				}
				if (type=='Dashboard') {//---------------------- for backward compatibility ---------------------
					updateDashboard(nodes,node,type,semtag,text);
				}
				if (type=='Metadata'){
					var attribute = $(node).attr("attribute");
					updateMetada(nodes,node,type,semtag,text,attribute)
				}
				if (type=='MetadataInline'){//---------------------- for backward compatibility ---------------------
					var attribute = 'inline';
					updateMetada(nodes,node,type,semtag,text,attribute)
				}
				if (type=='Metadatawad'){
					var attribute = $(node).attr("attribute");
					updateMetadawad(nodes,node,type,semtag,text,attribute)
				}
				if (type=='MetadatawadQuery') {//---------------------- for backward compatibility ---------------------
					var attribute = 'query';
					updateMetadawad(nodes,node,type,semtag,text,attribute);
				}
				if (type=='MetadatawadMenu') {//---------------------- for backward compatibility ---------------------
					var attribute = 'menuroles';
					updateMetadawad(nodes,node,type,semtag,text,attribute);
				}
				if (type=='NodeResource') {//---------------------- for backward compatibility ---------------------
					updateNodeResource(nodes,node);
				}
				if (type=='Calendar') {//---------------------- for backward compatibility ---------------------
					updateCalendar(nodes,node,text,semtag);
				}
				if (type=='Document') {//---------------------- for backward compatibility ---------------------
					updateDocument(nodes,node,text,semtag);
				}
				if (type=='Rights'){//---------------------- for backward compatibility ---------------------
					var rd = $(node).attr("rd");
					var wr = $(node).attr("wr");
					var dl = $(node).attr("dl");
					var sb = $(node).attr("sb");
					updateRights(nodes,node,role,rd,wr,dl,sb);
				}
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***NOT FOUND <span class='danger'>ERROR</span> in update-resource - uuid="+g_current_node_uuid+" semtag="+semtag);
			}
		});
	} else {
		var treeref = select.substring(0,idx);
		var semtag = select.substring(idx+1);
		$.ajax({
			async : false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag,
			success : function(data) {
				var nodes = $("node",data);
				var text = getTxtvals($("text",node));
				if ($("source",node).length>0){
					var source_select = $("source",node).attr("select");
					var source_idx = source_select.indexOf(".");
					var source_treeref = source_select.substring(0,source_idx);
					var source_semtag = source_select.substring(source_idx+1);
					if (source_semtag=="UUID")
						text = g_trees[source_treeref][0];
				}
				//---------------------------
				if (type=='Field') {
					updateField(nodes,node,type,semtag,text);
				}
				if (type=='Proxy') {
					updateProxy(nodes,node,type,semtag);
				}
				if (type=='Dashboard') {
					updateDashboard(nodes,node,type,semtag,text);
				}
				if (type=='Metadata'){
					var attribute = $(node).attr("attribute");
					updateMetada(nodes,node,type,semtag,text,attribute)
				}
				if (type=='MetadataInline'){
					var attribute = 'inline';
					updateMetada(nodes,node,type,semtag,text,attribute)
				}
				if (type=='Metadatawad'){
					var attribute = $(node).attr("attribute");
					updateMetadawad(nodes,node,type,semtag,text,attribute)
				}
				if (type=='MetadatawadQuery') {
					var attribute = 'query';
					updateMetadawad(nodes,node,type,semtag,text,attribute);
				}
				if (type=='MetadatawadMenu') {
					var attribute = 'menuroles';
					updateMetadawad(nodes,node,type,semtag,text,attribute);
				}
				if (type=='NodeResource') {
					updateNodeResource(nodes,node);
				}
				if (type=='Calendar') {
					updateCalendar(nodes,node,text,semtag);
				}
				if (type=='Document') {
					updateDocument(nodes,node,semtag);
				}
				if (type=='Rights'){
					var rd = $(node).attr("rd");
					var wr = $(node).attr("wr");
					var dl = $(node).attr("dl");
					var sb = $(node).attr("sb");
					updateRights(nodes,node,role,rd,wr,dl,sb);
				}
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***NOT FOUND <span class='danger'>ERROR</span> in update-resource - tree="+g_trees[treeref][1]+" semtag="+semtag);
			}
		});
	}
}

//=================================================
function updateDocument(nodes,node,semtag)
//=================================================
{
	if (nodes.length>0) {
		//-------------------
		var filename = $("filename",node).text();
		var size = $("size",node).text();
		var type = $("type",node).text();
		var fileid = $("fileid",node).text();
		//-------------------
		var nodeid = $(nodes[0]).attr('id');
		var resource = $("asmResource[xsi_type='Document']",nodes[0]);
		$("filename[lang='"+LANG+"']",resource).text(filename);
		$("size[lang='"+LANG+"']",resource).text(size);
		$("type[lang='"+LANG+"']",resource).text(type);
		$("fileid[lang='"+LANG+"']",resource).text(fileid);
		var data = "<asmResource xsi_type='Document'>" + $(resource).html() + "</asmResource>";
		var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		//-------------------
		nodes = nodes.slice(1,nodes.length);
		$.ajax({
			async : false,
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : strippeddata,
			url : serverBCK_API+"/resources/resource/" + nodeid,
			success : function(data) {
				$("#batch-log").append("<br>- Document resource updated ("+nodeid+") - semtag="+semtag);
				updateDocument(nodes,node,semtag);
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update Document resource("+nodeid+") - semtag="+semtag);
				updateDocument(nodes,node,semtag);
			}
		});
	}
}

//=================================================
function updateField(nodes,node,type,semtag,text)
//=================================================
{
	var ok = 0;
	for (var i=0; i<nodes.length; i++){
		//-------------------
		var nodeid = $(nodes[i]).attr('id');
		var resource = $("asmResource[xsi_type='Field']",nodes[i]);
		$("text[lang='"+LANG+"']",resource).text(text);
		var data = "<asmResource xsi_type='Field'>" + $(resource).html() + "</asmResource>";
		var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		//-------------------
		$.ajax({
			async : false,
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : strippeddata,
			url : serverBCK_API+"/resources/resource/" + nodeid,
			success : function(data) {
				ok++;
				$("#batch-log").append("<br>- resource updated ("+nodeid+") - semtag="+semtag);
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update resource("+nodeid+") - semtag="+semtag);
			}
		});
		//-------------------
	}
	return (ok!=0 && ok == nodes.length);
}

//=================================================
function updateCalendar(nodes,node,text,semtag)
//=================================================
{
	if (nodes.length>0) {
		var minViewMode = $(node).attr("minViewMode");
		var format = $(node).attr("format");
		//-------------------
		var nodeid = $(nodes[0]).attr('id');
		var resource = $("asmResource[xsi_type='Calendar']",nodes[0]);
		if (minViewMode!='')
			$("minViewMode",resource).text(minViewMode);
		if (format!='')
			$("format[lang='"+LANG+"']",resource).text(format);
		$("text[lang='"+LANG+"']",resource).text(text);
		var data = "<asmResource xsi_type='Calendar'>" + $(resource).html() + "</asmResource>";
		var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		//-------------------
		nodes = nodes.slice(1,nodes.length);
		//-------------------
		$.ajax({
			async : false,
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : strippeddata,
			url : serverBCK_API+"/resources/resource/" + nodeid,
			success : function(data) {
				$("#batch-log").append("<br>- calendar resource updated ("+nodeid+") - semtag="+semtag);
				updateCalendar(nodes,node,text);
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update calendar resource("+nodeid+") - semtag="+semtag);
				updateCalendar(nodes,node,text);
			}
		});
	}
}

//=================================================
function updateProxy(nodes,node,type,semtag)
//=================================================
{
	if (nodes.length>0) {
		var source_select = $("source",node).attr("select");
		var source_idx = source_select.indexOf(".");
		var source_treeref = source_select.substring(0,source_idx);
		var source_semtag = source_select.substring(source_idx+1);
		//------ search sourceid -------------------
		var sourceid = $("node",data).attr('id');
		//------ search targetid -------------------
		var targetid = $(nodes[0]).attr('id');
		nodes = nodes.slice(1,nodes.length);
		$.ajax({
			async : false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag,
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
					url : serverBCK_API+"/resources/resource/" + targetid,
					success : function(data) {
						$("#batch-log").append("<br>- resource updated ("+this.targetid+") - semtag="+this.semtag + " - srce:"+this.sourceid);
						updateProxyResource(nodes,node,type,semtag);
						//===========================================================
					},
					error : function(data) {
						$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update resource("+targetid+") - semtag="+semtag);
						updateProxy(nodes,node,type,semtag);
					}
				});
			}
		});
	}
}


//=================================================
function updateDashboard(nodes,node,type,semtag,text)
//=================================================
{
	if (nodes.length>0) {
		var nodeid = $(nodes[0]).attr('id');
		nodes = nodes.slice(1,nodes.length);
		var xml = "<asmResource xsi_type='Dashboard'>";
		for (var lan=0; lan<languages.length;lan++)
			xml += "<text lang='"+languages[lan]+"'>"+text+"</text>";
		xml += "</asmResource>";
		$.ajax({
			async : false,
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : xml,
			nodeid : nodeid,
			semtag : semtag,
			url : serverBCK_API+"/resources/resource/" + nodeid,
			success : function(data) {
				$("#batch-log").append("<br>- resource Dashboard update("+this.nodeid+") - semtag="+this.semtag);
				updateDashboard(nodes,node,type,this.semtag,text);
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update Dashboard("+nodeid+") - semtag="+semtag);
				updateDashboard(nodes,node,type,this.semtag,text);
			}
		});
	}
}

//=================================================
function updateNodeResource(nodes,node)
//=================================================
{
	if (nodes.length>0) {
		var nodeid = $(nodes[0]).attr('id');
		nodes = nodes.slice(1,nodes.length);
		var newcode = getTxtvals($("newcode",node));
		var label = getTxtvals($("label",node));
		$.ajax({
			async : false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes/node/" + nodeid + "?resources=true",
			nodeid : nodeid,
			success : function(data) {
				var xml = "<asmResource xsi_type='nodeRes'>";
				xml += "<code>"+newcode+"</code>";
				for (var lan=0; lan<languages.length;lan++)
					if (lan==LANGCODE && label!="")
						xml += "<label lang='"+languages[lan]+"'>"+label+"</label>";
					else
						xml += "<label lang='"+languages[lan]+"'>"+$("label[lang='"+languages[lan]+"']",$("asmResource[xsi_type='nodeRes']",data)).text()+"</label>";
				xml += "</asmResource>";
				$.ajax({
					async : false,
					type : "PUT",
					contentType: "application/xml",
					dataType : "text",
					data : xml,
					url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
					success : function(data) {
						$("#batch-log").append("<br>- node resource updated - newcode:"+newcode+" - Label:"+label );
						updateNodeResource(nodes,node);
					},
					error : function(data) {
						$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in  updateNodeResource - nodeid:"+nodeid+" not updated");
						updateNodeResource(nodes,node);
					}
				});
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in  updateNodeResource - nodeid:"+nodeid+" not found");
				updateNodeResource(nodes,node);
			}
		});
	}
}

//=================================================
function updateMetada(nodes,node,type,semtag,text,attribute)
//=================================================
{
	if (nodes.length>0) {
		var nodeid = $(nodes[0]).attr('id');
		var metadata = $("metadata",nodes[0]);
		$(metadata).attr(attribute,text);
		var xml = xml2string(metadata[0]);
		nodes = nodes.slice(1,nodes.length);
		$.ajax({
			async : false,
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : xml,
			nodeid : nodeid,
			semtag : semtag,
			url : serverBCK_API+"/nodes/node/" + nodeid+"/metadata",
			success : function(data) {
				$("#batch-log").append("<br>- resource metadata updated ("+this.nodeid+") - semtag="+this.semtag);
				updateMetada(nodes,node,type,semtag,text,attribute)
			},
			error : function(data,nodeid,semtag) {
				$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update metadata("+this.nodeid+") - semtag="+this.semtag);
				updateMetada(nodes,node,type,semtag,text,attribute);
			}
		});
	}
}

//=================================================
function updateMetadawad(nodes,node,type,semtag,text,attribute)
//=================================================
{
	if (nodes.length>0) {
		var nodeid = $(nodes[0]).attr('id');
		var metadatawad = $("metadata-wad",nodes[0]);
		$(metadatawad).attr(attribute,text);
		var xml = xml2string(metadatawad[0]);
		nodes = nodes.slice(1,nodes.length);
		$.ajax({
			async : false,
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : xml,
			nodeid : nodeid,
			semtag : semtag,
			url : serverBCK_API+"/nodes/node/" + nodeid+"/metadatawad",
			success : function(data) {
				$("#batch-log").append("<br>- resource metadatawad updated ("+this.nodeid+") - semtag="+this.semtag);
				updateMetadawad(nodes,node,type,semtag,text,attribute)
			},
			error : function(data,nodeid,semtag) {
				$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in update metadatawad("+this.nodeid+") - semtag="+this.semtag);
				updateMetadawad(nodes,node,type,semtag,text,attribute);
			}
		});
	}
}

//=================================================
function saveLog(model_code,portfoliologcode,logtext)
//=================================================
{
	var text ="<h3>"+model_code+"</h3>"+"<h4>"+new Date().toLocaleString()+"</h4>"+logtext;
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/portfolios/portfolio/code/"+portfoliologcode,
		success : function(data) {
			var nodeid = $("asmRoot",data).attr("id");
			// ---- import textfield ---------
			var urlS = serverBCK_API+"/nodes/node/import/"+nodeid+"?srcetag=TextField&srcecode=karuta.karuta-resources";
			$.ajax({
				async:false,
				type : "POST",
				dataType : "text",
				url : urlS,
				data : "",
				success : function(data) {
					// ---- update textfield ---------
					var uuid = data;
					$.ajax({
						type : "GET",
						dataType : "xml",
						url : serverBCK_API+"/nodes/node/" + uuid,
						success : function(data) {
						var resource = $("asmResource[xsi_type='TextField']",data);
						$("text[lang='"+LANG+"']",resource).text(text);
						var data = "<asmResource xsi_type='TextField'>" + $(resource).html() + "</asmResource>";
						var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
						//-------------------
						$.ajax({
							async : false,
							type : "PUT",
							contentType: "application/xml",
							dataType : "text",
							data : strippeddata,
							url : serverBCK_API+"/resources/resource/" + uuid,
							success : function(data) {
								$("#batch-log").append("<br>--- log saved in "+portfoliologcode+" ---");
							},
							error : function(data) {
								$("#batch-log").append("<br>- ***<span class='danger'>ERROR</span> in saveLog");
							}
						});
						},
						error : function(data) {
							$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in saveLog");
						}
					});
				},
				error : function(data) {
					$("#batch-log").append("<br>- <span class='danger'>ERROR</span> in saveLog");
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- <span class='danger'>ERROR</span> Portfolio log does not exist");
		}
	});

}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------ EXEC BATCH AT USER CREATION ------------------
//-----------------------------------------------------------------------

//=================================================
function displayExecBatchButton()
//=================================================
{
	var html = "<div id='create-portfolio'>"+g_execbatchbuttonlabel1[LANG]+"</div>";
	$("#main-list").html(html);
	initBatchVars();
	prepareBatch();
	getModelAndProcess(g_json.model_code);
}

