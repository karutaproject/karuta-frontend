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

var proxies_parent = {};
var proxies_edit = {};
var proxies_delete = {};
var proxies_nodeid = {};
var proxies_data = {};
if( UIFactory === undefined )
{
  var UIFactory = {};
}

var UICom =
{
	//=======================================================================
	query: function( type, url, callback, dataType, data )
	//=======================================================================
	{
		/*
		var set =
		{
			dataType: dataType,
			type: type,
			url: url,
			contentType: "application/xml",
			processData: false,
			data: data,
			success: function(data, textStatus)
			{
				if( callback != null )
					callback(data);
			},
			error : function(jqxhr,textStatus) {
				alertDisconnected();
				alertHTML(karutaStr[LANG]['disconnected']);
			}
		};
		jQuery.ajax(set);
		*/
		$.ajax({
			async:false,
			dataType: dataType,
			type: type,
			url: url,
			contentType: "application/xml",
			processData: false,
			data: data,
			success: function(data, textStatus)
			{
				if( callback != null )
					callback(data);
			},
			error : function(jqxhr,textStatus) {
				alertDisconnected();
				alertHTML(karutaStr[LANG]['disconnected']);
			}
		});

	},

	//=======================================================================
	parseStructure: function( data, treeroot, parentid, treerootname,report,addnode)
	//=======================================================================
	{
		if (report==null) {
			report = false;
		}
		if (treeroot==null || treeroot) {
			treeroot = true;
		}
		if( UICom.structure["tree"] == null )
			UICom.structure["tree"] = {};
		if( UICom.structure["ui"] == null )
			UICom.structure["ui"] = {};
		/// ------------------ Get root node
		var root = data.querySelector("asmRoot");
		var name = "asmRoot";
		if (root==null) {
			root = data.querySelector("asmStructure");
			if (root==null) {
				root = data.querySelector("node[type='asmStructure']");
			}
			name = "asmStructure";
		}
		if (root==null) {
			root = data.querySelector("asmUnit");
			if (root==null) {
				root = data.querySelector("node[type='asmUnit']");
			}
			name = "asmUnit";
		}
		if (root==null) {
			root = data.querySelector("asmUnitStructure");
			if (root==null) {
				root = data.querySelector("node[type='asmUnitStructure']");
			}
			name = "asmUnitStructure";
		}
		if (root==null) {
			root = data.querySelector("asmContext");
			if (root==null) {
				root = data.querySelector("node[type='asmContext']");
			}
		}
		//---------------------
		var id = root.getAttribute("id");
		var r = new UICom.Tree(root);
		//---------------------
		if (treeroot && !report) {
			UICom.root = r;
			UICom.rootid = id;
			if (treerootname!=null && treerootname!=undefined){
				UICom.treeroot[treerootname] = r;
				UICom.treerootid[treerootname] = id;
			}
		} else {
			if (UICom.structure["tree"][parentid]!=undefined) {
				var push = true;
				for( var i=0; i<UICom.structure["tree"][parentid].children.length; ++i ){
					if (UICom.structure["tree"][parentid].children[i]==id)
						push = false;
				}
				if (push){
					UICom.structure["tree"][parentid].children.push(id);
					if (addnode==null) {
						addnode = false;
					}
					if (addnode) {
						UICom.structure["tree"][parentid].node.appendChild(root);
					}
				}
			}
		}
		//---------------------
		UICom.structure["tree"][id] = r;
		UICom.structure["ui"][id] = new UIFactory["Node"](root);
		UICom.parseElement(r);
	},


	//=======================================================================
	parseElement: function(currentNode)
	//=======================================================================
	{
		if (g_userroles[0]=='designer')
			UICom.addRoles(currentNode.node);
		var current = currentNode.node;
		var children = $(current).children();
	
		for( var i=0; i<children.length; ++i ) {
			var child = children[i];
			var name = child.tagName;
			if (name=="node")
				name = $(child).attr("type");
			if( "asmRoot" == name || "asmStructure" == name || "asmUnit" == name || "asmUnitStructure" == name || "asmContext" == name ) {
				var id = $(child).attr("id");
				var childTree = new UICom.Tree(child);
				currentNode.children.push(id);
				UICom.structure["tree"][id] = childTree;
				UICom.structure["ui"][id] = new UIFactory["Node"](child);
				if (name=='asmContext') {
					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",child);
					resource_type = $(resource).attr("xsi_type");
					if (!g_encrypted) {
						g_encrypted = ($("metadata",child).attr('encrypted')=='Y') ? true : false;
					}
					if (resource_type=='Proxy') {
						var targetid = $("code",$("asmResource[xsi_type='Proxy']",child)).text();
						var edittargetroles = ($("metadata-wad",child).attr('edittargetroles')==undefined)?'none':$("metadata-wad",child).attr('edittargetroles');
						var delnoderoles = ($("metadata-wad",child).attr('delnoderoles')==undefined)?'none':$("metadata-wad",child).attr('delnoderoles');
						$.ajax({
							async : false,
							type : "GET",
							dataType : "xml",
							url : serverBCK_API+"/nodes/node/" + targetid + "?resources=true",
							success : function(data) {
								var newid = targetid+"_"+$(current).attr("id");
								$(":root",data).attr("id",newid);
								proxies_data[newid] = data;
								proxies_parent[newid] = $(current).attr("id");
								proxies_edit[newid] = edittargetroles;
								proxies_delete[newid] = delnoderoles;
								proxies_nodeid[newid] = id; // og: ???
								UICom.parseStructure(data,false,$(current).attr("id"),null,null,true);
							}
						});
					}
					if (resource_type=='Get_Proxy') {
						var targetid = $("value",$("asmResource[xsi_type='Get_Proxy']",child)).text();
						var edittargetroles = ($("metadata-wad",child).attr('edittargetroles')==undefined)?'none':$("metadata-wad",child).attr('edittargetroles');
						var delnoderoles = ($("metadata-wad",child).attr('delnoderoles')==undefined)?'none':$("metadata-wad",child).attr('delnoderoles');
						$.ajax({
							type : "GET",
							dataType : "xml",
							url : serverBCK_API+"/nodes/node/" + targetid + "?resources=true",
							success : function(data) {
								proxies_data[targetid] = data;
								proxies_parent[targetid] = $(current).attr("id");
								proxies_edit[targetid] = edittargetroles;
								proxies_delete[targetid] = delnoderoles;
								proxies_nodeid[targetid] = id;
								UICom.parseStructure(data,false,$(current).attr("id"),null,null,true);
							}
						});
					}
				} // end of asmContext
				var semtag = $("metadata",child).attr('semantictag');
				// recurse
				UICom.parseElement(childTree);
			}
		}
	},
	
	//=======================================================================
	addRoles: function(node)
	//=======================================================================
	{
		UICom.roles["designer"] = true;
		UICom.addRole(node,'seenoderoles');
		UICom.addRole(node,'editresroles');
		UICom.addRole(node,'delnoderoles');
		UICom.addRole(node,'commentnoderoles');
		UICom.addRole(node,'submitroles');
		UICom.addRole(node,'editnoderoles');
		UICom.addRole(node,'shownoderoles');
		UICom.addRole(node,'showroles');
		UICom.addRole(node,'showtoroles');
		UICom.addRole(node,'notifyroles');
		UICom.addRole(node,'menuroles');
		UICom.addRole(node,'moveroles');
		UICom.addRole(node,'resizeroles');
		UICom.addRole(node,'edittargetroles');
		UICom.addRole(node,'graphicerroles');
		UICom.addRole(node,'duplicateroles');
	},
	
	//=======================================================================
	addRole: function(node,attribute)
	//=======================================================================
	{
		if ($("metadata-wad",node).attr(attribute)!=undefined) {
			try {
				//----------------------------
				var roles = null;
				if (attribute == 'menuroles' && $("metadata-wad",node).attr(attribute) != undefined && $("metadata-wad",node).attr(attribute).length>10) {
					var items = $("metadata-wad",node).attr(attribute).split(";");
					for (var i=0; i<items.length; i++){
						var subitems = items[i].split(",");
						if (subitems[0]!="#line" && subitems[0].indexOf("##")<0) {
							roles = subitems[3].split(" ");
							//----------------------------
							for (var j=0;j<roles.length;j++){
								if (roles[j]!='' && roles[j]!='user')
									UICom.roles[roles[j]] = true;
							}
						}
						//----------------------------
					}
				}
				else {
					roles = $("metadata-wad",node).attr(attribute).split(" ");
					//----------------------------
					for (var i=0;i<roles.length;i++){
						if (roles[i]!='' && roles[j]!='user')
							UICom.roles[roles[i]] = true;
					}
					//----------------------------
				}
			} catch(e) {
				alertHTML('Error role in :'+attribute+"  --"+e); 
			}
		}
	},

	
	//========================================
	Tree: function(node)
	//========================================
	{
		this.node = node;
		this.children = [];
	},

	//=======================================================================
	 UpdateMetadata: function(uuid)
	//=======================================================================
	{
		var treenode = UICom.structure["tree"][uuid];
		var metawad = $(">metadata",treenode.node);
		var data = xml2string(metawad[0]);
		UICom.query("PUT",serverBCK_API+'/nodes/node/'+uuid+'/metadata',null,"text",data);
	},

	
	//=======================================================================
	 UpdateMeta: function( uuid, cb )
	//=======================================================================
	{
		$("#saved-window-body").html("<img src='../../karuta/img/red.png'/> recording...");
		var treenode = UICom.structure["tree"][uuid];
		var metawad = $(">metadata",treenode.node);
		var data = xml2string(metawad[0]);
		UICom.query("PUT",serverBCK_API+'/nodes/node/'+uuid+'/metadata',null,"text",data);
		var metawad_wad = $(">metadata-wad",treenode.node);
		data =  xml2string(metawad_wad[0]);
		var urlS = serverBCK_API+'/nodes/node/'+uuid+'/metadatawad';
		$.ajax({
			type : "PUT",
			dataType : "text",
			contentType: "application/xml",
			url : urlS,
			data : data,
			success : function (data){
				$("#saved-window-body").html("<img src='../../karuta/img/green.png'/> saved : "+new Date().toLocaleString());
				UICom.structure["ui"][uuid].refresh();
			},
			error : function(jqxhr,textStatus) {
				alertDisconnected();
				alertHTML("Error in UpdateMeta : "+jqxhr.responseText);
				alertHTML(karutaStr[LANG]['disconnected']);
//				window.location = "login.htm";
			}
		});
	},

	//=======================================================================
	 UpdateMetaWad: function(uuid)
	//=======================================================================
	{
		$("#saved-window-body").html("<img src='../../karuta/img/red.png'/> recording...");
		var node = UICom.structure["ui"][uuid].node;
		var metawad = $("metadata-wad",node);
		var data =  xml2string(metawad[0]);
		var urlS = serverBCK_API+'/nodes/node/'+uuid+'/metadatawad';
		$.ajax({
			type : "PUT",
			dataType : "text",
			contentType: "application/xml",
			url : urlS,
			data : data,
			success : function (data){
				$("#saved-window-body").html("<img src='../../karuta/img/green.png'/> saved : "+new Date().toLocaleString());
				UICom.structure["ui"][uuid].refresh();
			},
			error : function(jqxhr,textStatus) {
				alertDisconnected();
				alertHTML("Error in UpdateMetaWad : "+jqxhr.responseText);
				alertHTML(karutaStr[LANG]['disconnected']);
			}
		});
	},

	//=======================================================================
	 UpdateMetaEpm: function(uuid,refresh)
	//=======================================================================
	{
		$("#saved-window-body").html("<img src='../../karuta/img/red.png'/> recording...");
		var node = UICom.structure["ui"][uuid].node;
		var metawad_epm = $("metadata-epm",node);
		var data =  xml2string(metawad_epm[0]);
		var urlS = serverBCK_API+'/nodes/node/'+uuid+'/metadataepm';
		$.ajax({
			type : "PUT",
			dataType : "text",
			contentType: "application/xml",
			url : urlS,
			data : data,
			success : function (data){
				$("#saved-window-body").html("<img src='../../karuta/img/green.png'/> saved : "+new Date().toLocaleString());
				if (refresh)
					UICom.structure["ui"][uuid].refresh();
			},
			error : function(jqxhr,textStatus) {
				alertDisconnected();
				alertHTML(karutaStr[LANG]['disconnected']);
				alertHTML("Error in UpdateMetaEpm : "+jqxhr.responseText);
			}
		});
	},
	
	//=======================================================================
	  UpdateResource: function(uuid, cb1, cb2, delfile )
	//=======================================================================
	{	
		$("#saved-window-body").html("<img src='../../karuta/img/red.png'/> recording...");
		var treenode = UICom.structure["tree"][uuid];
		var resource = $(">asmResource[xsi_type!='nodeRes'][xsi_type!='context']",treenode.node)[0];
	
		/// Strip specific id (WAD stuff)
		$(resource).removeAttr("id");
		$(resource).removeAttr("contextid");
		$(resource).removeAttr("modified");
		var data = xml2string(resource);
		var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
		var urlS = serverBCK_API+'/resources/resource/'+uuid;
		if (delfile!=null && delfile)
			urlS += "?delfile=true";
		$.ajax({
			type : "PUT",
			dataType : "text",
			contentType: "application/xml",
			url : urlS,
			data : strippeddata,
			success : function (data){
				$("#saved-window-body").html("<img src='../../karuta/img/green.png'/> saved : "+new Date().toLocaleString());
				if (cb1!=undefined && jQuery.isFunction(cb1))
					cb1(uuid,data);
				if (cb2!=undefined && jQuery.isFunction(cb2))
					cb2(uuid,data);
			},
			error : function(jqxhr,textStatus) {
				alertDisconnected();
				alertHTML("Error in UpdateResource : "+jqxhr.responseText);
				alertHTML(karutaStr[LANG]['disconnected']);
//				window.location = "login.htm";
			}
		});
	},

	  
	//=======================================================================
	  UpdateNode: function(node)
	//=======================================================================
	{
		$("#saved-window-body").html("<img src='../../karuta/img/red.png'/> recording...");
//		var treenode = UICom.structure["ui"][uuid];
//		var resources = $(">asmResource",treenode.node);
		var uuid =  $(node).attr('id');
		var resources = $(">asmResource",node);
	
		for( var i=0; i<resources.length; ++i )
		{
			var res = resources[i];
			/// Strip specific id (WAD stuff)
			$(res).removeAttr("id");
			$(res).removeAttr("contextid");
			$(res).removeAttr("modified");
			var type = $(res).attr("xsi_type");
			var data = xml2string(res);
			var strippeddata = data.replace(/xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"/g,"");  // remove xmlns attribute
			/// nodeRes content
			if( "nodeRes" == type ) {
				UICom.query("PUT",serverBCK_API+'/nodes/node/'+uuid+'/noderesource',writeSaved,"text",strippeddata);
			}
			else if( "context" == type )
			{
				UICom.query("PUT",serverBCK_API+'/nodes/node/'+uuid+'/nodecontext',writeSaved,"text",strippeddata);
			}
			/// Other than nodeRes content
			else {
				var urlS = serverBCK_API+'/resources/resource/'+uuid;
				$.ajax({
					type : "PUT",
					dataType : "text",
					contentType: "application/xml",
					url : urlS,
					data : strippeddata,
					success : function (data){
						$("#saved-window-body").html("<img src='../../karuta/img/green.png'/> saved : "+new Date().toLocaleString());
//						if (cb!=undefined && jQuery.isFunction(cb))
//							cb(uuid,data);
					},
					error : function(jqxhr,textStatus) {
						alertDisconnected();
						alertHTML("Error in UpdateNode : "+jqxhr.responseText);
						alertHTML(karutaStr[LANG]['disconnected']);
//						window.location = "login.htm";
					}
				});
			}
		}
	},
	
	
	//=======================================================================
	  DeleteNode: function( uuid, callback,param1,param2 )
	//=======================================================================
	{
			$("#saved-window-body").html("<img src='../../karuta/img/red.png'/> recording...");
			$.ajax({
			type : "DELETE",
			dataType : "text",
			url : serverBCK_API+"/nodes/node/" + uuid,
			success : function(data) {
				$("#saved-window-body").html("<img src='../../karuta/img/green.png'/> deleted : "+new Date().toLocaleString());
				if (callback!=null && callback!='undefined')
					if (jQuery.isFunction(callback))
						callback(param1,param2);
					else
						eval(callback+"('"+param1+"','"+param2+"')");
			},
			error : function(jqxhr,textStatus) {
				alertDisconnected();
				alertHTML("Error in DeleteNode : "+jqxhr.responseText);
				alertHTML(karutaStr[LANG]['disconnected']);
//				window.location = "login.htm";
			}

		});
	}
	

};

UICom.treeroot = {};
UICom.treerootid = {};
UICom.structure = {};
UICom.roles = {};

//=======================================================================
function xml2string(node)
//=======================================================================
{
	if (typeof(XMLSerializer) !== 'undefined') {
		var serializer = new XMLSerializer();
		return serializer.serializeToString(node);
	}
	else {
		return node.xml;
	}
}

//=======================================================================
function createXmlElement(tag)
//=======================================================================
{
	var navigator_agent = navigator.userAgent.toLowerCase()
	var IE = (navigator_agent.indexOf("msie") != -1);
	if (IE && navigator_agent.indexOf("10")<-1) {
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); 
		return xmlDoc.createElement(tag);
	}
	else
		return document.createElement(tag);
}

//=======================================================================
function alertDisconnected()
//=======================================================================
{
	$("#saved-window-body").css('background-color','red');
	$("#saved-window-body").css('color','white');				
	$("#saved-window-body").css('font-weight','bold');				
	$("#saved-window-body").css('font-size','24px');				
	$("#saved-window").css('height','24px');				
	$("#saved-window-body").html(karutaStr[LANG]['disconnected']);
	$("body").append($("<div class='modal-backdrop fade in'></div>"));
}
