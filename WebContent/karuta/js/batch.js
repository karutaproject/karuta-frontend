/* =======================================================
	Copyright 2017 - ePortfolium - Licensed under the
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
var g_json = null;
var g_trees = {};
var g_noline = 0;
var g_actions = [];
var g_nodes = {};
var g_nodesLine = {};

var g_current_node_uuid = null;
//-----------------------



//==================================
function initBatchVars()
//==================================
{
	g_xmlDoc = null;
	g_json = null;
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
	return str;
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function selectAll()
//=================================================
{
	var nodes = $("model",g_xmlDoc).children();
	for  (var j=0; j<nodes.length; j++) {
		var actiontype = $(nodes[j]).prop("nodeName");
		if (actiontype=='for-each-line')
			$.merge(nodes,$(nodes[j]).children());
	}
	return nodes
}


//================================================
function processAll()
//=================================================
{
	$.ajaxSetup({async: false});
	get_list_portfoliosgroups();
	get_list_usersgroups();
	g_nodesLine = selectAll();
	g_noline = 0;
	g_nodes = g_nodesLine;
//	for (var i=0;i<g_nodes.length;i++){
//		$("#batch-log").append("<br>"+$(g_nodes[i]).prop("nodeName"));
//	}
	processNextLine();
}

//=================================================
function processNextLine()
//=================================================
{
	if (g_noline<g_json.lines.length) {
		g_nodes = g_nodesLine;
		$("#batch-log").append("<br>================ LINE "+(g_noline+1)+" =============================");
		processNextAction();
	} else {
		if ($("#batch-log").html().indexOf('THIS IS THE END')<0) {
			setTimeout(function(){
				if ($("#batch-log").html().indexOf('THIS IS THE END')<0)
					$("#batch-log").append("<br>=============== THIS IS THE END ===============================");
				}, 2000);
		}
		$.ajaxSetup({async: true});
	}
}

//=================================================
function processNextAction()
//=================================================
{
		if (g_nodes.length>0) {
		var actionnode = g_nodes[0];
		g_nodes = g_nodes.slice(1, g_nodes.length);
		var actiontype = $(actionnode).prop("nodeName");
		$("#batch-log").append("<br>------------- "+actiontype+" -----------------");
		if (typeof g_actions[actiontype] == "function" && actiontype!='for-each-line') {
				g_actions[actiontype](actionnode);
		} else {
			processNextAction();
		}
	} else {
		g_noline++;
		processNextLine();
	}
}


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------------------------- Elgg Group --------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------



//=================================================
g_actions['create-elgg-group'] = function createElggGroup(node)
//=================================================
{
	var group = getTxtvals($("group",node));
	var callback = function (param1){processNextAction();};
	createNetworkGroup(name,callback);
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
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
			$("#batch-log").append("<br>- user already defined("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
			processNextAction();
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
				type : "POST",
				contentType: "application/xml; charset=UTF-8",
				dataType : "xml",
				url : url,
				data : xml,
				success : function(data) {
					userid = data;
					$("#batch-log").append("<br>- user created("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
					processNextAction();
				},
				error : function(data) {
					$("#batch-log").append("<br>- ***ERROR in create-user ("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);					
					processNextAction();
				}
			});
		}
	});
}


//=================================================
g_actions['delete-user'] = function deleteUser(node)
//=================================================
{
	var identifier = getTxtvals($("identifier",node));
	//---- get userid ----------
	var userid = "";
	var url = serverBCK_API+"/users/user/username/"+identifier;
	$.ajax({
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
			var url = serverBCK_API+"/users/user/" + userid;
			$.ajax({
				type : "DELETE",
				dataType : "text",
				url : url,
				data : "",
				success : function(data) {
					$("#batch-log").append("<br>- user deleted("+userid+") - identifier:"+identifier);
					processNextAction();
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- ERROR user does not exist - identifier:"+identifier);
			processNextAction();
		}
	});
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-------------------------------- User Group ---------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------


//=================================================
g_actions['join-usergroup'] = function JoinUserGroup(node)
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
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
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
						$.ajax({
							type : 'PUT',
							dataType : "text",
							url : serverBCK_API+"/usersgroups?group=" + groupid + "&user=" + user_id,
							data : "",
							success : function(data) {
								$("#batch-log").append("<br>- JoinUserGroup - usergroup:"+usergroup+" - user:"+user);
							},
							error : function(data) {
								$("#batch-log").append("<br>- ERROR in JoinUserGroup - usergroup:"+usergroup+" - user:"+user);
							}
						});
					}
					processNextAction();
				},
				error : function(data) {
					$("#batch-log").append("<br>- ERROR in JoinUserGroup - usergroup:"+usergroup+" - user:"+user);
					processNextAction();
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- ERROR in JoinUserGroup - usergroup:"+usergroup+" - user:"+user+" NOT FOUND");
			processNextAction();
		}
	});

}

//=================================================
g_actions['leave-usergroup'] = function LeaveUserGroup(node)
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
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
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
						$("#batch-log").append("<br>- ***ERROR in LeaveUserGroup - usergroup:"+usergroup+" NOT FOUND - user:"+user);
					else {
						//---- leave group --------------
						$.ajax({
							type : 'DELETE',
							dataType : "text",
							url : serverBCK_API+"/usersgroups?group=" + groupid + "&user=" + user_id,
							data : "",
							success : function(data) {
								$("#batch-log").append("<br>- LeaveUserGroup - usergroup:"+usergroup+" - user:"+user);
							},
							error : function(data) {
								$("#batch-log").append("<br>- ***ERROR in LeaveUserGroup - usergroup:"+usergroup+" - user:"+user);
							}
						});
					}
					processNextAction();
				},
				error : function(data) {
					$("#batch-log").append("<br>- ***ERROR in LeaveUserGroup - usergroup:"+usergroup+" - user:"+user);
					processNextAction();
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***ERROR in LeaveUserGroup - usergroup:"+usergroup+" - user:"+user+" NOT FOUND");
			processNextAction();
		}
	});
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------------------------- Elgg User ---------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['create-elgg-user'] = function createElggUser(node)
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
			} else {
				user_register(identifier, email, username, password,callback,param1)
			}
			processNextAction();
		},
		error : function(jqxhr,textStatus) {
			$("#batch-log").append("<br>- ***ERROR in createElggUser - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
			processNextAction();
		}
	});
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------------------------- Elgg Member -------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------


//=================================================
g_actions['join-elgg-group'] = function createElggGroupMember(node)
//=================================================
{
	var identifier = getTxtvals($("identifier",node));
	var group = getTxtvals($("group",node));
	addGroupMember(group,identifier,null,null,null);
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
	var code = getTxtvals($("code",node));
	//----- get tree id -----
	try {
		var portfolioid = UIFactory["Portfolio"].getid_bycode(code,false);
		if (portfolioid!=undefined) {
			var url = serverBCK_API+"/portfolios/portfolio/" + portfolioid;
			$.ajax({
				type : "DELETE",
				contentType: "application/xml",
				dataType : "xml",
				url : url,
				data : "",
				success : function(data) {
					$("#batch-log").append("<br>- tree deleted - code:|"+code+"| portfolioid:"+portfolioid);
					processNextAction();
				},
				error : function(jqxhr,textStatus) {
					$("#batch-log").append("<br>- ***ERROR delete tree - code:|"+code+" ---- NOT FOUND ----");
					processNextAction();
				}
			});
		} else {
			$("#batch-log").append("<br>- ***ERROR delete tree - code:|"+code+" ---- NOT FOUND ----");
			processNextAction();
		}	}
	catch(err) {
		$("#batch-log").append("<br>- ***ERROR delete tree - code:|"+code+" ---- NOT FOUND ----");
		processNextAction();
	}

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
	var code = getTxtvals($("code",node));
	var treeref = $(node).attr('id');
	if (code!="") {
		var url = serverBCK_API+"/portfolios/portfolio/code/" + code;
		$.ajax({
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
				processNextAction();
			},
			error : function(data) {
				var label = getTxtvals($("label",node));
				var template = getTxtvals($("template",node));
				//----- create tree from template -----
				var portfolioid = "";
				var url = serverBCK_API+"/portfolios/instanciate/null?sourcecode="+template+"&targetcode="+code+"&owner=true";
				$.ajax({
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
											type : "PUT",
											contentType: "application/xml",
											dataType : "text",
											data : xml,
											url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
											success : function(data) {
												$("#batch-log").append("<br>- tree created ("+portfolioid+") - code:"+code);
												processNextAction();
											},
											error : function(data) {
												$("#batch-log").append("<br>- ***ERROR in  create tree - code:"+code);
												processNextAction();
											}
										});
									},
									error : function(data) {
										$("#batch-log").append("<br>- ***ERROR in  create tree - code:"+code);
										processNextAction();
									}
								});
							} else {
								$("#batch-log").append("<br>- ***ERROR in  create tree update root label - code:"+code);
								processNextAction();
							}
						},
						error : function(data) {
							$("#batch-log").append("<br>- ***ERROR in  create tree - code:"+code);
							processNextAction();
						}
				});
			}
		});
	} else {
		$("#batch-log").append("<br>-***ERROR in  create tree - code is empty");
		processNextAction();
	}

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
	var code = getTxtvals($("code",node));
	//----- get tree id -----
	var portfolioid = UIFactory["Portfolio"].getid_bycode(code,false); 
	var portfolio = new Array();
	portfolio [0] = portfolioid;
	portfolio [1] = code;
	var treeref = $(node).attr('id');
	g_trees[treeref] = portfolio;
	$("#batch-log").append("<br>- tree selected -  - code:"+code+" - portfolioid:"+portfolioid);
	processNextAction();
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
					type : "PUT",
					contentType: "application/xml",
					dataType : "text",
					data : xml,
					url : serverBCK_API+"/nodes/node/" + nodeid + "/noderesource",
					success : function(data) {
						treeid = data;
						$("#batch-log").append("<br>- copy-tree created ("+treeid+") - code:"+code);
						processNextAction();
					},
					error : function(data) {
						$("#batch-log").append("<br>- ERROR in  copy-tree - code:"+code);
						processNextAction();
					}
				});
			},
			error : function(data) {
				$("#batch-log").append("<br>- ERROR in  copy-tree - code:"+code);
				processNextAction();
			}
		});
	else
		processNextAction();

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
	var oldcode = getTxtvals($("oldcode",node));
	var newcode = getTxtvals($("newcode",node));
	var label = getTxtvals($("label",node));
	if (oldcode!="" && newcode!="") {
		$.ajax({
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
							$("#batch-log").append("<br>- tree root updated ("+oldcode+") - newcode:"+newcode);
							processNextAction();
						},
						error : function(data) {
							$("#batch-log").append("<br>- ***ERROR in  updateTreeRoot - code:"+oldcode+" not found");
							processNextAction();
						}
					});
				},
				error : function(data) {
					$("#batch-log").append("<br>- ***ERROR in  updateTreeRoot - code:"+oldcode);
					processNextAction();
				}
		});
	} else {
		$("#batch-log").append("<br>-***ERROR in updateTreeRoot - oldcode or newcode is empty");
		processNextAction();
	}
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
	var select = $(node).attr("select");
	var type = $(node).attr("type");
	var idx = select.indexOf(".");
	//----------------------------------------------------
	if (select=='#current_node') {
		$.ajax({
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
				if (type=='Rights'){
					var rd = $(node).attr("rd");
					var wr = $(node).attr("wr");
					var dl = $(node).attr("dl");
					var sb = $(node).attr("sb");
					updateRights(nodes,node,role,rd,wr,dl,sb);
				}
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***NOT FOUND ERROR in update-resource - uuid="+g_current_node_uuid+" semtag="+semtag);
				processNextAction();
			}
		});
	} else {
		var treeref = select.substring(0,idx);
		var semtag = select.substring(idx+1);
		$.ajax({
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
					updateDashboard(nodes,node,type,semtag);
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
				if (type=='Rights'){
					var rd = $(node).attr("rd");
					var wr = $(node).attr("wr");
					var dl = $(node).attr("dl");
					var sb = $(node).attr("sb");
					updateRights(nodes,node,role,rd,wr,dl,sb);
				}
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***NOT FOUND ERROR in update-resource - tree="+g_trees[treeref][1]+" semtag="+semtag);
				processNextAction();
			}
		});
	}
}

//=================================================
function updateField(nodes,node,type,semtag,text)
//=================================================
{
	if (nodes.length>0) {
		var nodeid = $(nodes[0]).attr('id');
		nodes = nodes.slice(1,nodes.length);
		var xml = "<asmResource xsi_type='Field'>";
		xml += "<text lang='"+LANG+"'>"+text+"</text>";
		xml += "</asmResource>";
		$.ajax({
			type : "PUT",
			contentType: "application/xml",
			dataType : "text",
			data : xml,
			url : serverBCK_API+"/resources/resource/" + nodeid,
			success : function(data) {
				$("#batch-log").append("<br>- resource updated ("+nodeid+") - semtag="+semtag);
				updateField(nodes,node,type,semtag,text);
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***ERROR in update resource("+nodeid+") - semtag="+semtag);
				updateField(nodes,node,type,semtag,text);
			}
		});
	} else{
		processNextAction();
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
		var sourceid = sourceid = $("node",data).attr('id');
		//------ search targetid -------------------
		var targetid = $(nodes[0]).attr('id');
		nodes = nodes.slice(1,nodes.length);
		$.ajax({
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
						updateupdateProxyResource(nodes,node,type,semtag);
						//===========================================================
					},
					error : function(data) {
						$("#batch-log").append("<br>- ***ERROR in update resource("+targetid+") - semtag="+semtag);
						updateProxy(nodes,node,type,semtag);
					}
				});
			}
		});
	} else{
		processNextAction();
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
				$("#batch-log").append("<br>- ***ERROR in update metadata("+this.nodeid+") - semtag="+this.semtag);
				updateMetada(nodes,node,type,semtag,text,attribute);
			}
		});
	} else{
		processNextAction();
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
				$("#batch-log").append("<br>- ***ERROR in update metadatawad("+this.nodeid+") - semtag="+this.semtag);
				updateMetadawad(nodes,node,type,semtag,text,attribute);
			}
		});
	} else{
		processNextAction();
	}
}

//=================================================
function updateRights(nodes,node,role,rd,wr,dl,sb)
//=================================================
{
	if (nodes.length>0) {
		var nodeid = $(nodes[0]).attr('id');
		var xml = "<node><role name='"+role+"'><right RD='"+rd+"' WR='"+wr+"' DL='"+dl+"' SB='"+sb+"'></right></role></node>"
		nodes = nodes.slice(1,nodes.length);
		$.ajax({
			type : "POST",
			contentType: "application/xml",
			dataType : "text",
			data : xml,
			nodeid : nodeid,
			semtag : semtag,
			url : serverBCK_API+"/nodes/node/rights/" + nodeid,
			success : function(data) {
				$("#batch-log").append("<br>- resource rights updated ("+this.nodeid+") - RD="+rd+" WR="+wr+" DL="+dl+" SB="+sb);
				updateRights(nodes,node,role,rd,wr,dl,sb);
			},
			error : function(data,nodeid,semtag) {
				$("#batch-log").append("<br>- ***ERROR resource rights updated ("+this.nodeid+") - RD="+rd+" WR="+wr+" DL="+dl+" SB="+sb);
				updateRights(nodes,node,role,rd,wr,dl,sb);
			}
		});
	} else{
		processNextAction();
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
				$("#batch-log").append("<br>- ***ERROR in update Dashboard("+nodeid+") - semtag="+semtag);
				updateDashboard(nodes,node,type,this.semtag,text);
			}
		});
	} else{
		processNextAction();
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
						$("#batch-log").append("<br>- ***ERROR in  updateNodeResource - nodeid:"+nodeid+" not updated");
						updateNodeResource(nodes,node);
					}
				});
			},
			error : function(data) {
				$("#batch-log").append("<br>- ***ERROR in  updateNodeResource - nodeid:"+nodeid+" not found");
				updateNodeResource(nodes,node);
			}
		});
	} else{
		processNextAction();
	}
}

//=================================================
g_actions['update-field-byid'] = function updateFieldById(node)
//=================================================
{
	var text = getTxtvals($("text",node));
	var nodeid = getTxtvals($("uuid",node));
	var xml = "<asmResource xsi_type='Field'>";
	xml += "<text lang='"+LANG+"'>"+text+"</text>";
	xml += "</asmResource>";
	$.ajax({
		type : "PUT",
		contentType: "application/xml",
		dataType : "text",
		data : xml,
		url : serverBCK_API+"/resources/resource/" + nodeid,
		success : function(data) {
			$("#batch-log").append("<br>- resource updated ("+nodeid+")");
			processNextAction();
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***ERROR in update resource("+nodeid+")");
			processNextAction();
		}
	});
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
	var role = "";
	var user = "";
	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
	var user = getTxtvals($("user",node));
	//---- get userid ----------
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
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
							$("#batch-log").append("<br>- tree shared ("+g_trees[treeref][0]+") - user:"+user_id+" - role:"+role);
							processNextAction();
						},
						error : function(data) {
							$("#batch-log").append("<br>- ***ERROR in share tree ("+g_trees[treeref][0]+") - role:"+role);
							processNextAction();
						}
					});
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***ERROR in share tree ("+g_trees[treeref][0]+") - role:"+role);
			processNextAction();
		}
	});
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
	var user = "";
	var treeref = $(node).attr("select");
	var user = getTxtvals($("user",node));
	//---- get userid ----------
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			var userid = data;
			//---- set owner --------------
			var url = serverBCK_API+"/portfolios/portfolio/" + g_trees[treeref][0] + "/setOwner/" + userid;
			$.ajax({
				type : "PUT",
				dataType : "text",
				url : url,
				success : function(data) {
					$("#batch-log").append("<br>- tree owner changed ("+g_trees[treeref][0]+") - user:"+user);
					processNextAction();
				},
				error : function(data) {
					$("#batch-log").append("<br>- ***ERROR tree owner changed ("+g_trees[treeref][0]+") - user:"+user);
					processNextAction();
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***ERROR tree owner changed ("+g_trees[treeref][0]+") - user:"+user);
			processNextAction();
		}
	});
}


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------------------------- Join Portfolio Group ----------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
g_actions['join-portfoliogroup'] = function JoinPortfolioGroup(node)
//=================================================
{
	var portfoliogroup = getTxtvals($("portfoliogroup",node));
	var treeref = $(node).attr("select");
	//---- get portfoliogroupid ----------
	var groupid = "";
	var url = serverBCK_API+"/portfoliogroups";
	$.ajax({
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
				$("#batch-log").append("<br>- ERROR in JoinPortfolioGroup - portfoliogroup:"+portfoliogroup+" NOT FOUND");
			else {
				//---- join group --------------
				$.ajax({
					type : 'PUT',
					dataType : "text",
					url : serverBCK_API+"/portfoliogroups?group="+groupid+"&uuid=" + g_trees[treeref][0],
					data : "",
					success : function(data) {
						$("#batch-log").append("<br>- JoinPortfolioGroup - usergroup:"+portfoliogroup+" - portfolio:"+g_trees[treeref][0]);
						processNextAction();
					},
					error : function(data) {
						$("#batch-log").append("<br>- ***ERROR in JoinPortfolioGroup - portfoliogroup:"+portfoliogroup+" - portfolio:"+g_trees[treeref][0]);
						processNextAction();
					}
				});
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- ***ERROR in JoinPortfolioGroup - portfoliogroup:"+portfoliogroup+" - portfolio:"+g_trees[treeref][0]);
			processNextAction();
		}
	});
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
	var role = "";
	var user = "";
	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
	var usergroupname = getTxtvals($("groupname",node));
	var usergroupid = get_usergroupid(usergroupname);
	$.ajax({
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
							data : users,
							success : function(data) {
								$("#batch-log").append("<br>tree shared with usergroup  ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - role:"+role);
								processNextAction();
							},
							error : function(data) {
								$("#batch-log").append("<br>- ERROR tree shared with usergroup  ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - role:"+role);
								processNextAction();
							}
						});
					},
					error : function(data) {
						$("#batch-log").append("<br>- ERROR tree shared with usergroup  ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - role:"+role);
						processNextAction();
					}
				});
			} else {
				$("#batch-log").append("<br>ERROR Empty group - tree shared with usergroup  ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - role:"+role);
				processNextAction();
			}
		},
		error : function(data) {
			$("#batch-log").append("<br>- ERROR tree shared with usergroup  ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - role:"+role);
			processNextAction();
		}
	});
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
	var role = "";
	var user = "";
	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
	var user = getTxtvals($("user",node));
	//---- get userid ----------
	var url = serverBCK_API+"/users/user/username/"+user;
	$.ajax({
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
				type : "GET",
				contentType: "text/html",
				dataType : "text",
				url : url,
				success : function(data) {
					groupid = data;
					//---- unshare tree --------------
					var url = serverBCK_API+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users/user/"+user_id;
					$.ajax({
						type : "DELETE",
						contentType: "application/xml",
						dataType : "xml",
						url : url,
						data : "",
						success : function(data) {
							$("#batch-log").append("<br>- tree unshared ("+g_trees[treeref][0]+") - user:"+user_id+" - role:"+role);
							processNextAction();
						},
						error : function(data) {
							$("#batch-log").append("<br>- ERROR in unshare tree ("+g_trees[treeref][0]+") - role:"+role);
							processNextAction();
						}
					});
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- ERROR in unshare tree ("+g_trees[treeref][0]+") - role:"+role);
			processNextAction();
		}
	});
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
	var treeref = $(node).attr("select");
	var role = getTxtvals($("role",node));
	var usergroupname = getTxtvals($("groupname",node));
	var usergroupid = get_usergroupid(usergroupname);
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/usersgroups?group="+usergroupid,
		success : function(data) {
			var users = $("user",data);
			var groupid = "";
			var url = serverBCK_API+"/rolerightsgroups?portfolio="+g_trees[treeref][0]+"&role="+role;
			$.ajax({
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
							type : "DELETE",
							contentType: "application/xml",
							dataType : "xml",
							url : url,
							data : "",
							success : function(data) {
								$("#batch-log").append("<br>tree with usergroup unshared ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - userid:"+userid+" - role:"+role);
								processNextAction();
							},
							error : function(jqxhr,textStatus) {
								$("#batch-log").append("<br>- ERROR in usergroup unshared ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - userid:"+userid+" - role:"+role);
								processNextAction();
							}
						});
					}
				},
				error : function(data) {
					$("#batch-log").append("<br>- ERROR in usergroup unshared ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - userid:"+userid+" - role:"+role);
					processNextAction();
				}
			});
		},
		error : function(data) {
			$("#batch-log").append("<br>- ERROR in usergroup unshared ("+g_trees[treeref][0]+") - usergroup:"+usergroupname+" - userid:"+userid+" - role:"+role);
			processNextAction();
		}
	});
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
	//------------------------------------
	var source = getTxtvals($("source",node));
	if (source=='') // for backward compatibility
		source = $(node).attr("source");
	var idx_source = source.lastIndexOf(".");
	var srcecode = source.substring(0,idx_source);
	var srcetag = source.substring(idx_source+1);
	//------------------------------------
	var select = $(node).attr("select");
	if (select=='#current_node'){
		var nodes = select;
		import_nodes(nodes,'',source,srcetag,srcecode);
	} else {
		var idx = select.lastIndexOf(".");
		var treeref = select.substring(0,idx);
		var semtag = select.substring(idx+1);
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag,
			success : function(data) {
				var nodes = $("node",data);
				import_nodes(nodes,semtag,source,srcetag,srcecode);
			},
			error : function(data) {
				$("#batch-log").append("<br>- ERROR in import NOT FOUND - semtag="+semtag+ " source="+source);
				processNextAction();
			}
		});
	}

}

//===========================
function import_nodes(nodes,semtag,source,srcetag,srcecode)
//===========================
{
	var destid = "";
	if (nodes.length>0) {
		if (nodes=='#current_node') {
			destid = g_current_node_uuid;
			nodes = "";
		}
		else {
			destid = $(nodes[0]).attr('id');
			nodes = nodes.slice(1,nodes.length);
		}
		var urlS = serverBCK_API+"/nodes/node/import/"+destid+"?srcetag="+srcetag+"&srcecode="+srcecode;
		$.ajax({
			type : "POST",
			dataType : "text",
			url : urlS,
			data : "",
			destid:destid,
			nodes:nodes,
			success : function(data) {
				g_current_node_uuid = data;
				$("#batch-log").append("<br>- node added at ("+this.destid+") - semtag="+semtag+ " source="+source);
				import_nodes(this.nodes,semtag,source,srcetag,srcecode);
			},
			error : function(data) {
				$("#batch-log").append("<br>- ERROR in import node("+this.destid+") - semtag="+semtag+ " source="+source);
				import_nodes(this.nodes,semtag,source,srcetag,srcecode);
			}
		});
	} else{
		processNextAction();
	}
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
	var select = $(node).attr("select");
	var idx = select.indexOf(".");
	var treeref = select.substring(0,idx);
	var semtag = select.substring(idx+1);
	//----------------------------------------------------
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes?portfoliocode=" + g_trees[treeref][1] + "&semtag="+semtag,
		success : function(data) {
			var nodes = $("node",data);
			moveup_nodes(nodes,semtag);
		},
		error : function(data) {
			$("#batch-log").append("<br>- NOT FOUND ERROR in moveup node - semtag="+semtag);
			processNextAction();
		}
	});
}

//===========================
function moveup_nodes(nodes,semtag)
//===========================
{
	if (nodes.length>0) {
		var currentid = $(nodes[0]).attr('id');
		nodes = nodes.slice(1,nodes.length);
		$.ajax({
			type : "POST",
			dataType : "text",
			current:currentid,
			nodes:nodes,
			semtag:semtag,
			url : serverBCK_API+"/nodes/node/" + currentid + "/moveup",
			success : function(data) {
				$("#batch-log").append("<br>- node moved up - nodeid("+this.current+") - semtag="+this.semtag);
				moveup_nodes(this.nodes,semtag);
			},
			error : function(jqxhr,textStatus) {
				$("#batch-log").append("<br>- ERROR in moveup node - nodeid("+this.current+") - semtag="+this.semtag);
				moveup_nodes(this.nodes);
			}
		});
	} else{
		processNextAction();
	}
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
		url : serverBCK_API+"/portfolios/portfolio/code/"+model_code,
		success : function(data) {
			var nodeid = $("asmRoot",data).attr("id");
			// ---- transform karuta portfolio to batch model
			var urlS = serverBCK_API+"/nodes/"+nodeid+"?xsl-file="+karutaname+"/karuta/xsl/karuta2batch.xsl&lang="+LANG;
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
	$.ajax({
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
	$.ajax({
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
	if (UsersGroups_list.length==0)
		get_list_usersgroups();
	for (var i=0;i<UsersGroups_list.length;i++){
		if (UsersGroups_list[i].label==groupname){
			groupid = UsersGroups_list[i].id;
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

//==================================================
function execReport_BatchCSV(parentid,title,codeReport)
//==================================================
{
	csvreport = [];
	$.ajaxSetup({async: false});
	report_getModelAndPortfolio(codeReport,g_portfolio_current,null,g_dashboard_models);
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
