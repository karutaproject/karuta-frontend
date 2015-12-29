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
var g_share_trees = null;
var g_nb_shareTree = new Array();
//-----------------------
var g_delete_trees = null;
var g_nb_deleteTree = new Array();
//-----------------------

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

//=================================================
function processAll()
//=================================================
{
	$.ajaxSetup({async: false});
	g_create_elgg_groups = $("create-elgg-group",g_xmlDoc);
	g_create_users = $("create-user",g_xmlDoc);
	g_create_elgg_users = $("create-elgg-user",g_xmlDoc);
	g_join_elgg_goups = $("join-elgg-group",g_xmlDoc);
	g_create_trees = $("create-tree",g_xmlDoc);
	g_select_trees = $("select-tree",g_xmlDoc);
	g_copy_trees = $("copy-tree",g_xmlDoc);
	g_update_resources = $("update-resource",g_xmlDoc);
	g_share_trees = $("share-tree",g_xmlDoc);
	g_delete_trees = $("delete-tree",g_xmlDoc);
	processLine();
}

//=================================================
function processLine()
//=================================================
{
	g_nb_createElggGroup[g_noline] = 0;
	g_nb_createUser[g_noline] = 0;
	g_nb_createElggUser[g_noline] = 0;
	g_nb_joinElggGroup[g_noline] = 0;
	g_nb_createTree[g_noline] = 0;
	g_nb_selectTree[g_noline] = 0;
	g_nb_copyTree[g_noline] = 0;
	g_nb_updateResource[g_noline] = 0;
	g_nb_shareTree[g_noline] = 0;
	g_nb_deleteTree[g_noline] = 0;
	$("#log").append("<br>================ LINE "+(g_noline+1)+" =========================================");
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
		$("#log").append("<br>---------------------create_elgg_groups-------------------------------");
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
		processElggUsers();
	else {
		$("#log").append("<br>---------------------create_users-------------------------------");
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
			$("#log").append("<br>- user already defined("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
			//===========================================================
			g_nb_createUser[g_noline]++;
			if (g_nb_createUser[g_noline]==g_create_users.length) {
				processElggUsers();
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
						$("#log").append("<br>- user created("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
						//===========================================================
						g_nb_createUser[g_noline]++;
						if (g_nb_createUser[g_noline]>=g_create_users.length) {
							processElggUsers();
						}
						//===========================================================
					},
					error : function(data) {
						$("#log").append("<br>- ERROR in create-user ("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);					
					}
				});
			else {
				$("#log").append("<br>-TRACE user created() - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
				//===========================================================
				g_nb_createUser[g_noline]++;
				if (g_nb_createUser[g_noline]>=g_create_users.length) {
					processElggUsers();
				}
				//===========================================================
			}
		}
	});
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
		$("#log").append("<br>---------------------create_elgg_users-------------------------------");
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
				$("#log").append("<br>- Elgg user already defined("+elgg_userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
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
			alert("createElggUser : Oups! "+jqxhr.responseText);
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
		processCreateTrees();
	else {
		$("#log").append("<br>---------------------join_elgg_goups-------------------------------");
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
			processCreateTrees();
		}
	};
	addGroupMember(group,identifier,callback,null,true);
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
		$("#log").append("<br>---------------------create_trees-------------------------------");
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
						$("#log").append("<br>- tree created ("+portfolioid+") - code:"+code);
						//===========================================================
						g_nb_createTree[g_noline]++;
						if (g_create_trees.length==g_nb_createTree[g_noline]) {
							processSelectTrees();
						}
						//===========================================================
					},
					error : function(data) {
						$("#log").append("<br>- ERROR in  create tree - code:"+code);
					}
				});
			}
		});
	else {
		$("#log").append("<br>-TRACE tree created - template:"+template+" - code:"+code+" - label:"+label);
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
		$("#log").append("<br>---------------------select_trees-------------------------------");
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
	$("#log").append("<br>- tree selected -  - code:"+code+"portfolioid:"+portfolioid);
	return portfolio;
}

//=================================================
function processCopyTrees()
//=================================================
{
	if (g_copy_trees.length==0)
		processUpdateResources();
	else {
		$("#log").append("<br>---------------------copy_trees-------------------------------");
		for (var j=0; j<g_copy_trees.length; j++) {
			copyTree(g_copy_trees[j]);
		}
	}
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Copy Tree -----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function copyTree(node)
//=================================================
{
	var code = getTxtvals($("code",node));
	var label = getTxtvals($("label",node));
	var template = getTxtvals($("template",node));
	$("#log").append("<br>copy-tree template:|"+template+"| code:|"+code+"| label:|"+label+"|");
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
						$("#log").append("<br>- tree created ("+treeid+") - code:"+code);
						//===========================================================
						g_nb_copyTree[g_noline]++;
						if (g_copy_trees.length==g_nb_copyTree[g_noline]) {
							processUpdateResources();
						}
						//===========================================================
					},
					error : function(data) {
						$("#log").append("<br>- ERROR in  create tree - code:"+code);
					}
				});
			}
		});
	else {
		$("#log").append("<br>-TRACE tree created - code:"+code+" - label:"+label);
		//===========================================================
		g_nb_copyTree[g_noline]++;
		if (g_copy_trees.length==g_nb_copyTree[g_noline]) {
			processUpdateResources();
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
		$("#log").append("<br>---------------------update_resources-------------------------------");
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
							$("#log").append("<br>- resource updated ("+nodeid+") - semtag="+semtag);
							//===========================================================
							g_nb_updateResource[g_noline]++;
							if (g_update_resources.length<=g_nb_updateResource[g_noline]) {
								processShareTrees();
							}
							//===========================================================
						},
						error : function(data) {
							$("#log").append("<br>- ERROR in update resource("+nodeid+") - semtag="+semtag);
						}
					});
				}
			});
		else {
			$("#log").append("<br>-TRACE resource FIELD updated - semtag="+semtag);
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
//									alert(g_nb_updateResource[g_noline]);
									$("#log").append("<br>- resource updated ("+this.targetid+") - semtag="+this.semtag + " - srce:"+this.sourceid);
									if (g_update_resources.length<=g_nb_updateResource[g_noline]) {
										processShareTrees();
									}
									//===========================================================
								},
								error : function(data) {
									$("#log").append("<br>- ERROR in update resource("+targetid+") - semtag="+semtag);
								}
							});
						}
					});
				}
			});
		else {
			$("#log").append("<br>-TRACE resource PROXY updated - semtag="+semtag);
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
								$("#log").append("<br>- resource metadatawad updated ("+this.nodeid+") - semtag="+this.semtag+" "+this.idx+" "+this.nb+" - "+(this.idx==this.nb));
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
								$("#log").append("<br>- ERROR in update metadatawad("+this.nodeid+") - semtag="+this.semtag);
							}
						});
						}
				}
			});
		else {
			$("#log").append("<br>-TRACE resource metadatawad updated - semtag="+semtag);
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
							$("#log").append("<br>- resource Dashboard update("+this.nodeid+") - semtag="+this.semtag);
							//===========================================================
							g_nb_updateResource[g_noline]++;
//							alert(g_nb_updateResource[g_noline]);
							if (g_update_resources.length<=g_nb_updateResource[g_noline]) {
								processShareTrees();
							}
							//===========================================================
						},
						error : function(data) {
							$("#log").append("<br>- ERROR in update Dashboard("+nodeid+") - semtag="+semtag);
						}
					});
				}
			});
		else {
			$("#log").append("<br>-TRACE resource Dashboard updated - semtag="+semtag);
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
		processDeleteTrees();
	else {
		$("#log").append("<br>---------------------share_trees-------------------------------");
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
	var select_node = $("role>txtval",node).attr("select");
	if (typeof(select_node)== 'undefined')
		role = $("role>txtval",node).text();
	else
		role = eval("g_json.lines["+g_noline+"]."+select_node);
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
									$("#log").append("<br>- tree shared ("+g_trees[treeref][0]+") - user:"+user_id+" - role:"+role);
									//===========================================================
									g_nb_shareTree[g_noline]++;
									if (g_nb_shareTree[g_noline]==g_share_trees.length) {
										g_noline++;
										if (g_noline>=g_json.lines.length)
											processDeleteTrees();
										else
											processLine();
									}
									//===========================================================
								},
								error : function(data) {
									$("#log").append("<br>- ERROR in share tree ("+g_trees[treeref][0]+") - role:"+role);
								}
							});
						else
							$("#log").append("<br>TRACE - tree shared ("+g_trees[treeref][0]+") - user:"+user+" - role:"+role);
					}
				});
			}
		});
	else {
		$("#log").append("<br>TRACE tree shared ("+g_trees[treeref][0]+") - user:"+user+" - role:"+role);
		//===========================================================
		g_nb_shareTree[g_noline]++;
		if (g_nb_shareTree[g_noline]==g_share_trees.length) {
			g_noline++;
			if (g_noline>=g_json.lines.length)
				processDeleteTrees();
			else
				processLine();
		}
		//===========================================================
	}
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
		processEnd();
	else {
		$("#log").append("<br>---------------------delete_trees-------------------------------");
		for  (var j=0; j<g_delete_trees.length; j++) {
			deleteTree(g_delete_trees[j]);
		}
		g_noline++;
		if (g_noline==g_json.lines.length)
			processEnd();
		else
			processLine();
	}
}

//=================================================
function deleteTree(node)
//=================================================
{
	var code = getTxtvals($("code",node));
	//----- get tree id -----
	var portfolioid = UIFactory["Portfolio"].getid_bycode(code,false);
	if (portfolioid!=undefined) {
		UIFactory["Portfolio"].del(portfolioid);
		$("#log").append("<br>- tree deleted - code:|"+code+"| portfolioid:"+portfolioid);
	} else {
		$("#log").append("<br>- tree deleted - code:|"+code+" ---- NOT FOUND ----");
	}
}

//=================================================
function processImportNodes()
//=================================================
{
	if (g_import_nodes.length==0)
		processEnd();
	else {
		$("#log").append("<br>---------------------import_nodes-------------------------------");
		for  (var j=0; j<g_import_nodes.length; j++) {
			importNode(g_import_nodes[j]);
		}
		g_noline++;
		if (g_noline==g_json.lines.length)
			processEnd();
		else
			processLine();
	}
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//------------------------- Impot Node ----------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//=================================================
function importNode(node)
//=================================================
{
	var urlS = "../../../"+serverBCK+"/nodes/node/import/"+destid+"?srcetag="+srcetag+"&srcecode="+srcecode;
	$.ajax({
		type : "POST",
		dataType : "text",
		url : urlS,
		data : "",
		success : function(data) {
		}
	});
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
	if (g_noline>=g_json.lines.length) {
		$("#log").append("<br>================ END ========================================================");
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
	var model_code = $("#model_code").val();
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
			var urlS = "../../../"+serverBCK+"/nodes/"+nodeid+"?xsl-file="+appliname+"/karuta/xsl/karuta2batch.xsl&lang="+LANG;
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
