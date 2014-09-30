/* =======================================================
	Copyright 2014 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */

var trace = true;
var json1 = null;
var json2 = null;
var xmlDoc = null;
var trees = {};

//==================================
function getTxtvals(node,noline,json_nb)
//==================================
{
	var str = "";
	var txtvals = $("txtval",node);
	for (var i=0; i<txtvals.length; i++){
		var select = $(txtvals[i]).attr("select");
		var text = "";
		if (select!=undefined) {
			if (select.indexOf("//")>-1)
				text = eval("json"+json_nb+"."+select.substring(2));
			else
				text = eval("json"+json_nb+".lines["+noline+"]."+select);
		} else {
			text = $(txtvals[i]).text();
		}
		str += text;
	}
	return str;
}

//=================================================
function processAll(xmlDoc,json,json2)
//=================================================
{
	for (var i=0; i<json.lines.length; i++){
		$("#log").append("<br>================ LINE "+(i+1)+" =========================================");
		process(xmlDoc,i,1);
	}
	$("#log").append("<br>================ END ========================================================");
}

//=================================================
function process(xmlDoc,noline,json_nb)
//=================================================
{
	$("#log").append("<br>---------------------create_users-------------------------------");
	var create_users = $("create-user",xmlDoc);
	for  (var j=0; j<create_users.length; j++) {
		createUser(create_users[j],noline,json_nb);
	}
	//===========================================================
	$("#log").append("<br>---------------------create_trees-------------------------------");
	var create_trees = $("create-tree",xmlDoc);
	for  (var j=0; j<create_trees.length; j++) {
		var treeref = $(create_trees[j]).attr('id');
		trees[treeref] = createTree(create_trees[j],noline,json_nb);
	}
	//===========================================================
	$("#log").append("<br>---------------------select_trees-------------------------------");
	var select_trees = $("select-tree",xmlDoc);
	for  (var j=0; j<select_trees.length; j++) {
		var treeref = $(select_trees[j]).attr('id');
		trees[treeref] = selectTree(select_trees[j],noline,json_nb);
	}
	//===========================================================
	$("#log").append("<br>--------------------copy_trees--------------------------------");
	var copy_trees = $("copy-tree",xmlDoc);
	for  (var j=0; j<copy_trees.length; j++) {
		var treeref = $(copy_trees[j]).attr('id');
		trees[treeref] = copyTree(copy_trees[j],noline,json_nb);
	}
	//===========================================================
	$("#log").append("<br>------------------update_resources----------------------------------");
	var update_resources = $("update-resource",xmlDoc);
	for (var j=0; j<update_resources.length; j++) {
		updateResource(update_resources[j],noline,json_nb);
	}
	//===========================================================
	$("#log").append("<br>------------------share_trees----------------------------------");
	var share_trees = $("share-tree",xmlDoc);
	for (var j=0; j<share_trees.length; j++) {
		shareTree(share_trees[j],noline,json_nb);
	}
	//===========================================================
	$("#log").append("<br>------------------each-line----------------------------------");
	var each_lines = $("for-each-line",xmlDoc);
	for (var j=0; j<each_lines.lines.length; j++){
		for (var k=0; k<json2.lines.length; k++){
			$("#log").append("<br>================ LINE "+(i+1)+"."+j+"."+k+" =========================================");
			process(xmlDoc,k,json_nb+1);
		}
	}
	//===========================================================
}


//=================================================
function createUser(node,noline,json_nb)
//=================================================
{
	var identifier = getTxtvals($("identifier",node),noline,json_nb);
	var lastname = getTxtvals($("lastname",node),noline,json_nb);
	var firstname = getTxtvals($("firstname",node),noline,json_nb);
	var email = getTxtvals($("email",node),noline,json_nb);
	var designer = getTxtvals($("designer",node),noline,json_nb);
	var password = getTxtvals($("password",node),noline,json_nb);
	if (designer==undefined)
		designer ='0';
	//---- get userid ----------
	var userid = "";
	var url = "../../../"+serverBCK+"/users/user/username/"+identifier;
	$.ajax({
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
			$("#log").append("<br>- user already defined("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
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
					type : "POST",
					contentType: "application/xml",
					dataType : "xml",
					url : url,
					data : xml,
					success : function(data) {
						userid = data;
						$("#log").append("<br>- user created("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
					},
					error : function(data) {
						$("#log").append("<br>- ERROR in create-user ("+userid+") - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);					
					}
				});
			else
				$("#log").append("<br>- user created() - identifier:"+identifier+" lastname:"+lastname+" firstname:"+firstname);
		}
	});
}

//=================================================
function selectTree(node,noline,json_nb)
//=================================================
{
	var code = getTxtvals($("code",node),noline,json_nb);
	//----- get tree id -----
	var portfolioid = UIFactory["Portfolio"].getid_bycode(code,false); 
	var portfolio = new Array();
	portfolio [0] = portfolioid;
	portfolio [1] = code;
	$("#log").append("<br>- tree selected -  - code:"+code+"portfolioid:"+portfolioid);
	return portfolio;
}

//=================================================
function createTree(node,noline,json_nb)
//=================================================
{
	var code = getTxtvals($("code",node),noline,json_nb);
	var label = getTxtvals($("label",node),noline,json_nb);
	var template = getTxtvals($("template",node),noline,json_nb);
	//----- create tree from template -----
	var portfolioid = "";
	if (!trace)
		portfolioid = UIFactory["Portfolio"].instantiate_bycode(template,code);
	else
		$("#log").append("<br>- tree created from - code:"+code);
	//----- update tree label -----
	if (code!="" && label!="" && !trace)
		$.ajax({
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
					type : "PUT",
					contentType: "application/xml",
					dataType : "text",
					data : xml,
					url : "../../../"+serverBCK+"/nodes/node/" + nodeid + "/noderesource",
					success : function(data) {
						$("#log").append("<br>- tree created - code:"+code);
					},
					error : function(data) {
						$("#log").append("<br>- ERROR in  create tree - code:"+code);
					}
				});
			}
		});
	var portfolio = new Array();
	portfolio [0] = portfolioid;
	portfolio [1] = code;
	return portfolio;
}

//=================================================
function copyTree(node,noline,json_nb)
//=================================================
{
	var code = getTxtvals($("code",node),noline,json_nb);
	var label = getTxtvals($("label",node),noline,json_nb);
	var template = getTxtvals($("template",node),noline,json_nb);
	$("#content").append("<br>copy-tree template:|"+template+"| code:|"+code+"| label:|"+label+"|");
	//----- create tree from template -----
	var portfolioid = "";
	if (!trace)
		portfolioid = UIFactory["Portfolio"].copy_bycode(template,code);
	//----- update tree label -----
	if (code!="" && label!="" && !trace)
		$.ajax({
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
					type : "PUT",
					contentType: "application/xml",
					dataType : "text",
					data : xml,
					url : "../../../"+serverBCK+"/nodes/node/" + nodeid + "/noderesource",
					success : function(data) {
						treeid = data;
						$("#log").append("<br>- tree created ("+treeid+") - code:"+code);
					},
					error : function(data) {
						$("#log").append("<br>- ERROR in  create tree - code:"+code);
					}
				});
			}
		});
	var portfolio = new Array();
	portfolio [0] = portfolioid;
	portfolio [1] = code;
	return portfolio;
}

//=================================================
function updateResource(node,noline,json_nb)
//=================================================
{
	var select = $(node).attr("select");
	var type = $(node).attr("type");
	var idx = select.indexOf(".");
	var treeref = select.substring(0,idx);
	var semtag = select.substring(idx+1);
	//----------------------------------------------------
	if (type=='Field') {
		var text = getTxtvals($("text",node),noline,json_nb);
		$("#content").append("<br>update-resource Field :|"+trees[treeref][1]+"|"+semtag+"|"+text);
		if (!trace)
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + trees[treeref][1] + "&semtag="+semtag,
				success : function(data) {
					var nodeid = $("asmContext:has(metadata[semantictag='"+semtag+"'])",data).attr('id');
	//				var nodeid = $("node",data).attr('id');
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
						},
						error : function(data) {
							$("#log").append("<br>- ERROR in update resource("+nodeid+") - semtag="+semtag);
						}
					});
				}
			});
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
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + trees[source_treeref][1] + "&semtag="+source_semtag,
				success : function(data) {
					sourceid = $("node",data).attr('id');
				}
			});
		//------ search targetid -------------------
		var targetid = "";
		if (!trace)
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + trees[treeref][1] + "&semtag="+semtag,
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
						url : "../../../"+serverBCK+"/resources/resource/" + targetid,
						success : function(data) {
							$("#log").append("<br>- resource updated ("+targetid+") - semtag="+semtag);
						},
						error : function(data) {
							$("#log").append("<br>- ERROR in update resource("+targetid+") - semtag="+semtag);
						}
					});
				}
			});
		else
			$("#log").append("<br>- resource updated ("+targetid+") - semtag="+semtag);
	}
	//----------------------------------------------------
}

//=================================================
function shareTree(node,noline,json_nb)
//=================================================
{
	var treeref = $(node).attr("select");
	var role = eval("json"+json_nb+".lines["+noline+"]."+$("role",node).attr("select"));
	var user = eval("json"+json_nb+".lines["+noline+"]."+$("user",node).attr("select"));
	$("#content").append("<br>share-tree :|"+trees[treeref]+"|"+role+"|"+user);
	//---- get userid ----------
	var userid = "";
	var url = "../../../"+serverBCK+"/users/user/username/"+user;
	$.ajax({
		type : "GET",
		contentType: "application/xml",
		dataType : "text",
		url : url,
		success : function(data) {
			userid = data;
		}
	});
	if (role!='designer') {
		//---- get role groupid ----------
		var groupid = "";
		var url = "../../../"+serverBCK+"/rolerightsgroups?portfolio="+trees[treeref][0]+"&role="+role;
		$.ajax({
			type : "GET",
			contentType: "text/html",
			dataType : "text",
			url : url,
			success : function(data) {
				groupid = data;
			}
		});
		//---- share tree --------------
		var xml = "<users><user id='"+userid+"'/></users>";
		var url = "../../../"+serverBCK+"/rolerightsgroups/rolerightsgroup/" + groupid + "/users";
		if (!trace)
			$.ajax({
				type : "POST",
				contentType: "application/xml",
				dataType : "xml",
				url : url,
				data : xml,
				success : function(data) {
					$("#log").append("<br>- tree shared ("+trees[treeref][0]+") - role:"+role);
				},
				error : function(data) {
					$("#log").append("<br>- ERROR in share tree ("+trees[treeref][0]+") - role:"+role);
				}
			});
		else
			$("#log").append("<br>- tree shared ("+trees[treeref][0]+") - role:"+role);
	} else {
		//---- share tree with designer --------------
		var url = "../../../"+serverBCK+"/share/"+trees[treeref][0]+"/"+userid+"?write=y";
		if (!trace)
			$.ajax({
				type : "POST",
				contentType: "application/xml",
				dataType : "xml",
				url : url,
				data : "",
			});
		else
			$("#log").append("<br>- tree shared ("+trees[treeref][0]+") - role:"+role);
	}
}

