/* =======================================================
	Copyright 2020 - ePortfolium - Licensed under the
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

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["Proxy"] = function( node,condition)
//==================================
{
	this.clause = "xsi_type='Proxy'";
	if (condition!=null)
		this.clause = condition;
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Proxy';
	//--------------------
	this.code_node = $("code",$("asmResource["+this.clause+"]",node));
	this.value_node = $("value",$("asmResource["+this.clause+"]",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node))[0];
		if (this.label_node[i].length==0) {
			var newelement = createXmlElement("label");
			$(newelement).attr('lang', languages[i]);
			$("asmResource["+this.clause+"]",node)[0].appendChild(newelement);
			this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
		}
	}
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
		if (this.text_node[i].length==0) {
			var newelement = createXmlElement("text");
			$(newelement).attr('lang', languages[i]);
			$("asmResource["+this.clause+"]",node)[0].appendChild(newelement);
			this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
		}
	}
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	if (this.clause=="xsi_type='Proxy'")
		this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	else // asmUnitStructure - Proxy
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.display = {};
	this.displayCode = {};
	this.displayValue = {};
	this.multiple = "";
	this.queryattr_value = $("metadata-wad",node).attr('query');
};

//==================================
UIFactory["Proxy"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = 0;
	//---------------------
	if (dest!=null) {
		this.display[dest]=langcode;
	}
	//---------------------
	if (type==null)
		type = 'default';
	//---------------------
	if (type=='default') {
		result['restype'] = this.type;
		result['value'] = this.value_node.text();
		result['code'] = this.code_node.text();
		result['portfoliocode'] = this.portfoliocode_node.text();
		result['label'] = this.label_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["Proxy"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	return $(this.label_node[langcode]).text();
};

//==================================
UIFactory["Proxy"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	$("#"+dest).html($(this.label_node[langcode]).text());
};


/// Editor
//==================================
UIFactory["Proxy"].update = function(itself,lang,type,portfolio_label)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	itself.save();
};

//==================================
UIFactory["Proxy"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	var multiple_tags = "";
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	this.queryattr_value = queryattr_value; // update if changed
	if (this.multiple!=""){
		multiple_tags = this.multiple.substring(this.multiple.indexOf('/')+1);
		queryattr_value = this.multiple.substring(0,this.multiple.indexOf('/'));
		type = 'multiple';
	}
	if (queryattr_value!=undefined && queryattr_value!='') {
		//------------
		queryattr_value = replaceVariable(queryattr_value);
		//------------
		var srce_indx = queryattr_value.lastIndexOf('.');
		var srce = queryattr_value.substring(srce_indx+1);
		var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
		var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
		//------------
		var portfoliocode = queryattr_value.substring(0,semtag_indx);
		var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
		if (portfoliocode.indexOf('.')<0 && portfoliocode!='self' && portfoliocode!='all')  // There is no project, we add the project of the current portfolio
			portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
		if (portfoliocode=='self')
			portfoliocode = selfcode;
		//------------
		var self = this;
		if (portfoliocode!='all') {
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/nodes?portfoliocode=" + portfoliocode + "&semtag="+semtag,
				success : function(data) {
					UIFactory["Proxy"].parse(destid,type,langcode,data,self,portfoliocode,srce);
				}
			});
		} else {  // code==all
			// retrieve active portfolios
			$("#wait-window").modal('show');
			$.ajaxSetup({async: false});
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : serverBCK_API+"/portfolios?active=1",
				success : function(data) {
					UIFactory["Portfolio"].parse(data);
					for ( var i = 0; i < portfolios_list.length; i++) {
						code = portfolios_list[i].code_node.text();
						label = portfolios_list[i].label_node[langcode].text();
						$.ajax({
							type : "GET",
							dataType : "xml",
							url : serverBCK_API+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
							success : function(data) {
								var nodes = $("node",data);
								var display = false;
								for ( var i = 0; i < $(nodes).length; ++i) {
									var semtag = $("metadata",nodes[i]).attr('semantictag');
									if (semtag.indexOf("proxy-")<0)
										display = true;
								}
								if (nodes.length>0 && display) {
									var html = "";
									html += "<div class='portfolio-proxy' style='margin-top:20px'>"+label+"</div>";
									var placeid = code.replace(/\./g, '_'); 
									html += "<div id='"+placeid+"'></div>";
									$("#"+destid).append($(html));
									UIFactory["Proxy"].parse(placeid,type,langcode,data,self,label,srce);
								}
							}
						});
					}
				},
				error : function(jqxhr,textStatus) {
					alertHTML("Server Error UIFactory.Proxy.prototype.displayEditor: "+textStatus);
					$("#wait-window").modal('hide');
				}
			});
			$.ajaxSetup({async: true});
			$("#wait-window").modal('hide');
		}
	}
};

//==================================
UIFactory["Proxy"].parse = function(destid,type,langcode,data,self,portfolio_label,srce) 
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	var self_value = $(self.value_node).text();
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	var formobj = $("<div class='form-horizontal'></div>");
	$("#"+destid).append($(formobj));
	//-----Node ordering-------------------------------------------------------
	var nodes = $("node",data);
	var tableau1 = new Array();
	for ( var i = 0; i < $(nodes).length; i++) {
		var resource = null;
		if ($("asmResource",nodes[i]).length==3)
			resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
		else
			resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
		var code = $('code',resource).text();
		tableau1[i] = [code,nodes[i]];
	}
	var newTableau1 = tableau1.sort(sortOn1);
	//--------------------------------------------------------------
	if (type=='select') {
		//-----------------------------------
		var html = "<div class='btn-group'>";
		html += "	<button type='button' class='btn select selected-label' id='button_"+self.id+"'>&nbsp;</button>";
		html += "	<button type='button' class='btn dropdown-toggle dropdown-toggle-split ' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></button>";
		html += "</div>";
		var btn_group = $(html);
		$(formobj).append($(btn_group));
		html = "<div class='dropdown-menu dropdown-menu-right'></div>";
		var select  = $(html);
		//----------------- null value to erase
		html = "<a class='dropdown-item' value='' code='' ";
		for (var j=0; j<languages.length;j++) {
			html += "label_"+languages[j]+"='&nbsp;' ";
		}
		html += ">";
		html += "&nbsp;</a>";
		var select_item_a = $(html);
		$(select_item_a).click(function (ev){
			$("#button_"+self.id).html(portfolio_label+"."+$(this).attr("label_"+languages[langcode]));
			for (var i=0; i<languages.length;i++){
				$(self.label_node[i]).text($(this).attr("label_"+languages[i]));
			}
			$(self.code_node).text($(this).attr("code"));
			$(self.value_node).text($(this).attr("value"));
			UIFactory["Proxy"].update(self,langcode);
		});
		$(select).append($(select_item_a));
		//--------------------
		for ( var i = 0; i < newTableau1.length; ++i) {
			var semtag = $("metadata",newTableau1[i]).attr('semantictag');
			if (semtag.indexOf("proxy-")<0){
//				if ($("asmResource",newTableau1[i]).length==3)
//					resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i]); 
//				else
					resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i]);
				var value = $(newTableau1[i][1]).attr('id');
				html = "<a class='dropdown-item' value='"+value+"' code='"+value+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += ">";
				html += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+self.id).html(portfolio_label+"."+$(this).attr("label_"+languages[langcode]));
					for (var i=0; i<languages.length;i++){
						$(self.label_node[i]).text($(this).attr("label_"+languages[i]));
					}
					$(self.code_node).text($(this).attr("code"));
					$(self.value_node).text($(this).attr("value"));
					UIFactory["Proxy"].update(self,langcode);
				});
				$(select).append($(select_item_a));
				//-------------- update button -----
				if (value!="" && self_value==value) {
					$("#button_"+self.id).html(portfolio_label+"."+$(srce+"[lang='"+languages[langcode]+"']",resource).text());
				}
			}
		$(btn_group).append($(select));
		}
	}
	//------------------------------------------------------------
	if (type.indexOf('multiple')>-1) {
		//------------------------
		var inputs = "<div id='get_multiple' class='multiple'></div>";
		var inputs_obj = $(inputs);
		//-----------------------
		for ( var i = 0; i < newTableau1.length; ++i) {
			var uuid = $(newTableau1[i][1]).attr('id');
			var disabled = false;
			var selectable = true;
			var input = "";
			var resource = null;
//			if ($("asmResource",newTableau1[i][1]).length==3)
//				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
//			else
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
			//------------------------------
			var code = $('code',resource).text();
			var value = $(newTableau1[i][1]).attr('id');
			var display_code = false;
			var display_label = true;
			if (code.indexOf("$")>-1) 
				display_label = false;
			if (code.indexOf("@")<0) {
				display_code = true;
			}
			if (code.indexOf("?")>-1) {
				disabled = true;
			}
			if (code.indexOf("!")>-1) {
				selectable = false;
			}
			code = cleanCode(code);
			//------------------------------
			input += "<div>";
			if (selectable) {
				input += "	<input type='checkbox' name='multiple_"+self.id+"' value='"+value+"' code='"+$('code',resource).text()+"' class='multiple-item";
				input += "' ";
				for (var j=0; j<languages.length;j++){
					input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				if (disabled)
					input += "disabled";
				input += "> ";
			}
			if (display_code)
				input += code + " ";
			input +="<span  class='"+code+"'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span></div>";
			var input_obj = $(input);
			$(inputs_obj).append(input_obj);
		}
		$("#"+destid).append(inputs_obj);
	}
};

//==================================
UIFactory["Proxy"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,UIFactory.Node.reloadUnit);
	this.refresh();
};

//==================================
UIFactory["Proxy"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};

//==================================
function proxy_multiple(parentid,title,query,partcode,get_resource_semtag)
//==================================
{
	var langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Proxy.addMultiple('"+parentid+"','"+partcode+","+get_resource_semtag+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
	var html = "<div id='get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getResource = new UIFactory["Proxy"](UICom.structure["ui"][parentid].node,"xsi_type='nodeRes'");
	getResource.multiple = query+"/"+partcode+","+get_resource_semtag;
	getResource.displayEditor("get-resource-node");
	$('#edit-window').modal('show');

}

//==================================
UIFactory["Proxy"].addMultiple = function(parentid,multiple_tags)
//==================================
{
	$.ajaxSetup({async: false});
	multiple_tags = replaceVariable(multiple_tags);
	var part_code = multiple_tags.substring(0,multiple_tags.indexOf(','));
	var srce = part_code.substring(0,part_code.lastIndexOf('.'));
	var part_semtag = part_code.substring(part_code.lastIndexOf('.')+1);
	var get_resource_semtag = multiple_tags.substring(multiple_tags.indexOf(',')+1);
	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	// for each one create a part
	var databack = true;
	var callback = UIFactory.Proxy.updateaddedpart;
	var param2 = get_resource_semtag;
	var param4 = false;
	for (var j=0; j<inputs.length;j++){
		var param3 = inputs[j];
		if (j==inputs.length-1)
			param4 = true;
		importBranch(parentid,srce,part_semtag,databack,callback,param2,param3,param4);
	}
};

//==================================
UIFactory["Proxy"].updateaddedpart = function(data,get_resource_semtag,selected_item,last)
//==================================
{
	var partid = data;
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
	var xml = "<asmResource xsi_type='Proxy'>";
	xml += "<code>"+value+"</code>";
	xml += "<value>"+value+"</value>";
	for (var i=0; i<languages.length;i++){
		var label = $(selected_item).attr('label_'+languages[i]);
		xml += "<label lang='"+languages[i]+"'>"+label+"</label>";
	}
	xml += "</asmResource>";
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/"+partid,
		last : last,
		success : function(data) {
			var node = $("*:has(metadata[semantictag='"+get_resource_semtag+"'])",data);
			if (node.length==0)
				node = $( ":root",data ); //node itself
			if (node.length>1) // we take the deepest
				node = node[node.length-1];
			var nodeid = $(node).attr('id');
			var url_resource = serverBCK_API+"/resources/resource/" + nodeid;
			var tagname = $(node).nodeName;
			if( "asmRoot" == tagname || "asmStructure" == tagname || "asmUnit" == tagname || "asmUnitStructure" == tagname) {
				xml = xml.replace("Proxy","nodeRes");
				url_resource = serverBCK_API+"/nodes/node/" + nodeid + "/noderesource";
			}
			$.ajax({
				type : "PUT",
				contentType: "application/xml",
				dataType : "text",
				data : xml,
				last : this.last,
				url : url_resource,
				success : function(data) {
					if (this.last) {
						$('#edit-window').modal('hide');
						UIFactory.Node.reloadUnit();
					}
				}
			});
		}
	});
}
