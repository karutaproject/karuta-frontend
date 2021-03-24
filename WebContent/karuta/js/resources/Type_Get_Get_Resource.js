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

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["Get_Get_Resource"] = function( node,condition)
//==================================
{
	this.clause = "xsi_type='Get_Get_Resource'";
	if (condition!=null)
		this.clause = condition;
	this.id = $(node).attr('id');
	this.type = 'Get_Get_Resource';
	//--------------------
	if ($("lastmodified",$("asmResource["+this.clause+"]",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource["+this.clause+"]",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Get_Get_Resource']",node));
	//------- style -------------
	if ($("asmResource[xsi_type='"+this.type+"']",node).length>0 && $("style",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("style");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.style_node = $("style",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.parentid = $(node).parent().attr("id");
	this.node = node;
	this.code_node = $("code",$("asmResource["+this.clause+"]",node));
	this.value_node = $("value",$("asmResource["+this.clause+"]",node));
	this.portfoliocode_node = $("portfoliocode",$("asmResource["+this.clause+"]",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource["+this.clause+"]",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource["+this.clause+"]",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource["+this.clause+"]",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource["+this.clause+"]",node));
			}
		}
	}
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	if (this.clause=="xsi_type='Get_Get_Resource'")
		this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	else // asmUnitStructure - Get_Get_Resource
		this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.inline = ($("metadata",node).attr('inline')=='Y') ? true : false;
	this.display = {};
	this.displayValue = {};
	this.displayCode = {};
	this.multiple = "";
};

//==================================
UIFactory["Get_Get_Resource"].prototype.getAttributes = function(type,langcode)
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

//==================================
UIFactory["Get_Get_Resource"].prototype.getType = function()
//==================================
{
	return this.type;
};

//==================================
UIFactory["Get_Get_Resource"].prototype.getCode = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayCode[dest]=true;
	}
	var code = $(this.code_node).text();
	if (this.encrypted)
		code = decrypt(code.substring(3),g_rc4key);
	return code;
};

//==================================
UIFactory["Get_Get_Resource"].prototype.getValue = function(dest)
//==================================
{
	if (dest!=null) {
		this.displayValue[dest]=true;
	}
	var value = $(this.value_node).text();
	if (this.encrypted)
		value = decrypt(value.substring(3),g_rc4key);
	return value;
};

/// Display
//==================================
UIFactory["Get_Get_Resource"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type==null)
		type = "default";
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var label = this.label_node[langcode].text();
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	var code = $(this.code_node).text();
	var style = $(this.style_node).text();
	var html = "";
	if (type=='default'){
		html += "<div class='"+cleanCode(code)+" view-div' style=\""+style+"\">";
		if (($(this.code_node).text()).indexOf("#")>-1)
			html += cleanCode(code) + " ";
		if (($(this.code_node).text()).indexOf("%")<0)
			html += label;
		if (($(this.code_node).text()).indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
		html += "</div>";
	}
	if (type=='none'){
		if (($(this.code_node).text()).indexOf("#")>-1)
			html += cleanCode(code) + " ";
		if (($(this.code_node).text()).indexOf("%")<0)
			html += label;
		if (($(this.code_node).text()).indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
	}

	return html;
};

//==================================
UIFactory["Get_Get_Resource"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (type==null)
		type = "default";
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var label = this.label_node[langcode].text();
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	var code = $(this.code_node).text();
	var style = $(this.style_node).text();
	var html = "";
	if (type=='default'){
		html += "<div class='"+cleanCode(code)+" view-div' style=\""+style+"\">";
		if (($(this.code_node).text()).indexOf("#")>-1)
			html += cleanCode(code) + " ";
		if (($(this.code_node).text()).indexOf("%")<0)
			html += label;
		if (($(this.code_node).text()).indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
		html += "</div>";
	}
	if (type=='none'){
		if (($(this.code_node).text()).indexOf("#")>-1)
			html += cleanCode(code) + " ";
		if (($(this.code_node).text()).indexOf("%")<0)
			html += label;
		if (($(this.code_node).text()).indexOf("&")>-1)
			html += " ["+$(this.value_node).text()+ "] ";
	}
	$("#"+dest).html(html);
};


/// Editor
//==================================
UIFactory["Get_Get_Resource"].update = function(selected_item,itself,langcode,type)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
	var style = $(selected_item).attr('style');
	//---------------------
	if (itself.encrypted)
		value = "rc4"+encrypt(value,g_rc4key);
	if (itself.encrypted)
		code = "rc4"+encrypt(code,g_rc4key);
	//---------------------
	$(itself.value_node[0]).text(value);
	$(itself.code_node[0]).text(code);
	$(itself.style_node[0]).text(style);
	for (var i=0; i<languages.length;i++){
		var label = $(selected_item).attr('label_'+languages[i]);
		//---------------------
		if (itself.encrypted)
			label = "rc4"+encrypt(label,g_rc4key);
		//---------------------
		$(itself.label_node[i][0]).text(label);
	}
	itself.save();
};

//==================================
UIFactory["Get_Get_Resource"].prototype.displayEditor = function(destid,type,langcode,disabled,cachable)
//==================================
{
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (this.multiple!=""){
		multiple_tags = this.multiple.substring(this.multiple.indexOf('/')+1);
		queryattr_value = this.multiple.substring(0,this.multiple.indexOf('/'));
		type = 'multiple';
	}
	if (queryattr_value!=undefined && queryattr_value!='') {
		queryattr_value = replaceVariable(queryattr_value);
//		if (type=='multiple')
//			queryattr_value = cleanCode(queryattr_value);  // portfoliocode may be from a get_ressource with spécial characters
		try {
			//------------------------------
			var srce_indx = queryattr_value.lastIndexOf('.');
			var srce = queryattr_value.substring(srce_indx+1);
			var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
			var semtag2 = "";
			var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
			if (semtag.indexOf('+')>-1) {
				semtag2 = semtag.substring(semtag.indexOf('+')+1);
				semtag = semtag.substring(0,semtag.indexOf('+'));
			}
			var semtag_parent_indx = queryattr_value.substring(0,semtag_indx).lastIndexOf('.');
			var semtag_parent = queryattr_value.substring(semtag_parent_indx+1,semtag_indx);
			if (semtag_parent.indexOf('#')==0)
				semtag_parent = semtag_parent.substring(1);
			var portfoliocode_end_indx = queryattr_value.indexOf('child')+queryattr_value.indexOf('sibling')+queryattr_value.indexOf('parent')+queryattr_value.indexOf('#')+queryattr_value.indexOf('itself')+3; //  if not present give -1
			var portfoliocode = replaceVariable(queryattr_value.substring(0,portfoliocode_end_indx));
			//------------
			var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
			if (portfoliocode.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode!='self')  // There is no project, we add the project of the current portfolio
				portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
			if (portfoliocode=='self')
				portfoliocode = selfcode;
			//------------
//			portfoliocode = cleanCode(portfoliocode); // portfoliocode may be from a get_ressource with spécial characters
			//------------
			var query = queryattr_value.substring(portfoliocode_end_indx,semtag_parent_indx);
			var parent = null;
			var ref = null;
			var code_parent = "";
			var value_parent = "";
			//-------------------------------
			var removestar = -1;
			if (semtag_parent.indexOf('*')>-1 ) {
				var elts = semtag_parent.split("*");
				for (var i=0;i<elts.length;i++) {
					if (elts[i]!="")
						removestar = i;
				}
				semtag_parent = elts[removestar];
			}
			// ------- search for parent ----
			if (query.indexOf('itselfcode')>-1) {
				code_parent = $($("code",$(this.node)[0])[0]).text();
				value_parent = $($("value",$(this.node)[0])[0]).text();
			} else if (query.indexOf('parentparentparentparentparentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent().parent().parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent().parent().parent().parent()[0])[0]).text();
			} else if (query.indexOf('parentparentparentparentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent().parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent().parent().parent()[0])[0]).text();
			} else if (query.indexOf('parentparentparentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent().parent()[0])[0]).text();
			} else if (query.indexOf('parentparentcode')>-1) {
				code_parent = $($("code",$(this.node).parent().parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent().parent()[0])[0]).text();
			} else if (query.indexOf('parentcode')>-1) {
				code_parent = $($("code",$(this.node).parent()[0])[0]).text();
				value_parent = $($("value",$(this.node).parent()[0])[0]).text();
			} else {
				if (query.indexOf('child')>-1) {
					parent = this.node;
				}
				if (query.indexOf('sibling')>-1) {
					parent = $(this.node).parent();
				}
				if (query.indexOf('parent.parent.parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent().parent().parent();
				} else if (query.indexOf('parent.parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent().parent();
				} else if (query.indexOf('parent.parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent().parent();
				} else	if (query.indexOf('parent.parent')>-1) {
					parent = $(this.node).parent().parent().parent();
				} else if (query.indexOf('parent')>-1) {
					parent = $(this.node).parent().parent();
				}
				if (queryattr_value.indexOf('#')>0)
					code_parent = semtag_parent;
				else {
					//-----------
					var child = $("metadata[semantictag*='"+semtag_parent+"']",parent).parent();
					var itself = $(parent).has("metadata[semantictag*='"+semtag_parent+"']");
					if (child.length==0 && itself.length>0){
						code_parent = $($("code",itself)[0]).text();
						value_parent = $($("value",itself)[0]).text();
					} else {
						var nodetype = $(child).prop("nodeName"); // name of the xml tag
						if (nodetype=='asmContext') {
							code_parent = $($("code",child)[1]).text();
							value_parent = $($("value",child)[1]).text();
						 } else {
							code_parent = $($("code",child)[0]).text();
							value_parent = $($("value",child)[0]).text();
						}
	
					}
				}
			}
			//----------------------
//			if ($("*:has(metadata[semantictag*='"+semtag_parent+"'][encrypted='Y'])",parent).length>0)
//				code_parent = decrypt(code_parent.substring(3),g_rc4key);
			//----------------------
			if (removestar>-1) {
				var elts = code_parent.split("*");
				code_parent = elts[removestar];
			}
			//----------------------
			var portfoliocode_parent = $("portfoliocode",$("*:has(metadata[semantictag*='"+semtag_parent+"'])",parent)).text();
			if (portfoliocode_parent.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode_parent!='self')  // There is no project, we add the project of the current portfolio
				portfoliocode_parent = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode_parent;
//			alertHTML('portfoliocode:'+portfoliocode+'--semtag:'+semtag+'--semtag_parent:'+semtag_parent+'--code_parent:'+code_parent+'--portfoliocode_parent:'+portfoliocode_parent);
				var url ="";
				if (portfoliocode.indexOf('value?')>-1) {
					code_parent = replaceVariable(code_parent);
					value_parent = replaceVariable(value_parent);
					portfoliocode_parent = value_parent;
					portfoliocode = portfoliocode_parent;
					url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode_parent+"&semtag="+semtag.replace("!","")+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;			
				} else if (portfoliocode.indexOf('parent?')>-1){
					if (portfoliocode_parent.indexOf("@")>-1) {
						display_portfoliocode_parent = false;
						portfoliocode_parent =portfoliocode_parent.substring(0,portfoliocode_parent.indexOf("@"))+portfoliocode_parent.substring(portfoliocode_parent.indexOf("@")+1);
					}
					if (portfoliocode_parent.indexOf("#")>-1) {
						portfoliocode_parent = portfoliocode_parent.substring(0,portfoliocode_parent.indexOf("#"))+portfoliocode_parent.substring(portfoliocode_parent.indexOf("#")+1);
					}
					$(this.portfoliocode_node).text(portfoliocode_parent);
					portfoliocode = portfoliocode_parent;
					url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode_parent+"&semtag="+semtag.replace("!","")+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;			
				} else if (portfoliocode.indexOf('?')>-1 || portfoliocode.indexOf('code?')>-1){
					code_parent = replaceVariable(code_parent);
					code_parent = cleanCode(code_parent);
					$(this.portfoliocode_node).text(code_parent);
					portfoliocode = code_parent;
					url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","");
				} else {
					$(this.portfoliocode_node).text(portfoliocode);
					url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","")+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;
				}
				var self = this;
				$.ajax({
					async:false,
					type : "GET",
					dataType : "xml",
					url : url,
					portfoliocode:portfoliocode,
					semtag2:semtag2,
					success : function(data) {
						UIFactory["Get_Get_Resource"].parse(destid,type,langcode,data,self,disabled,srce,this.portfoliocode,semtag,semtag2,cachable);
					},
					error : function(jqxhr,textStatus) {
						$("#"+destid).html("No result");
					}
	
				});

		} catch(e) { alertHTML(e);
			// do nothing - error in the search attribute
		}
	}
};


//==================================
UIFactory["Get_Get_Resource"].parse = function(destid,type,langcode,data,self,disabled,srce,portfoliocode,semtag,semtag2,cachable) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var self_code = $(self.code_node).text();
	if (self.encrypted)
		self_code = decrypt(self_code.substring(3),g_rc4key);
	//---------------------
	//---------------------
	var self_value = $(self.value_node).text();
	if (self.encrypted)
		self_value = decrypt(self_value.substring(3),g_rc4key);
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
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
	//------------------------------------------------------------
	if (type=='select') {
		//--------------------------------
		var html = "";
		html += "<div class='btn-group select-label'>";
		html += "	<button type='button' class='btn select selected-label' id='button_"+self.id+"'>&nbsp;</button>";
		html += "<button type='button' onclick=\"UIFactory.Get_Get_Resource.reloadIfInLine('"+self.id+"','"+destid+"','"+type+"','"+langcode+"')\" class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>Toggle Dropdown</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$("#"+destid).append($(btn_group));
		//--------------------------------
		html = "<div class='dropdown-menu dropdown-menu-right'></div>";
//		html = "<div id='dropdown-"+self.id+"' class='dropdown-menu dropdown-menu-right'></div>";
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
			$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
			$("#button_"+self.id).attr('class', 'btn btn-default select select-label');
			UIFactory["Get_Get_Resource"].update(this,self,langcode);
		});
		$(select).append($(select_item_a));
		//--------------------
		for ( var i = 0; i < newTableau1.length; i++) {
				var uuid = $(newTableau1[i][1]).attr('id');
				var style = "";
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3) {
				style = UIFactory.Node.getContentStyle(uuid);
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			} else {
				style = UIFactory.Node.getLabelStyle(uuid);
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
			}
			//------------------------------
			var code = $('code',resource).text();
			var display_code = false;
			var display_label = true;
			if (code.indexOf("$")>-1) 
				display_label = false;
			if (code.indexOf("@")<0) {
				display_code = true;
			}
			code = cleanCode(code);
			//------------------------------
			var select_item = null;
			if ($('code',resource).text().indexOf('----')>-1) {
				html = "<div class='dropdown-divider'></div>";
				select_item = $(html);
			} else {
				html = "<a class='dropdown-item sel"+code+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += " style=\""+style+"\">";
				if (display_code)
					html += "<span class='li-code'>"+code+"</span>";
				if (display_label)
					html += "<span class='li-label'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span>";
				html += "</a>";
				var select_item = $(html);
				$(select_item).click(function (ev){
					//--------------------------------
					var code = $(this).attr('code');
					var display_code = false;
					var display_label = true;
					if (code.indexOf("$")>-1) 
						display_label = false;
					if (code.indexOf("@")<0) {
						display_code = true;
					}
					code = cleanCode(code);
					//--------------------------------
					var html = "";
					if (display_code)
						html += code+" ";
					if (display_label)
						html += $(this).attr("label_"+languages[langcode]);
					$("#button_"+self.id).attr("style",style);
					$("#button_"+self.id).html(html);
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
					UIFactory["Get_Get_Resource"].update(this,self,langcode);
					//--------------------------------
				});
			}
			//-------------- update button -----
			if (code!="" && self_code==$('code',resource).text()) {
				var html = "";
				if (display_code)
					html += code+" ";
				if (display_label)
					html += $(srce+"[lang='"+languages[langcode]+"']",resource).text();
				$("#button_"+self.id).attr("style",style);
				$("#button_"+self.id).html(html);
				$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
			}
			$(select).append($(select_item));
		}
		$(btn_group).append($(select));
		
	}
	if (type.indexOf('radio')>-1) {
		//----------------- null value to erase
		var radio_obj = $("<div class='get-radio'></div>");
		var input = "";
		input += "<input type='radio' name='radio_"+self.id+"' value='' code='' ";
		if (disabled)
			input +="disabled='disabled' ";
		for (var j=0; j<languages.length;j++){
			input += "label_"+languages[j]+"='&nbsp;'";
		}
		if (self_code=='')
			input += " checked ";
		input += ">&nbsp;&nbsp;";
		input += "</input>";
		var obj = $(input);
		$(obj).click(function (){
			UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
		});
		$(radio_obj).append(obj);
		$("#"+destid).append(radio_obj);
		//-------------------
		for ( var i = 0; i < newTableau1.length; i++) {
			var uuid = $(newTableau1[i][1]).attr('id');
			var style = "";
			var radio_obj = $("<div class='get-radio'></div>");
			var input = "";
			//------------------------------
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3) {
				style = UIFactory.Node.getContentStyle(uuid);
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			} else {
				style = UIFactory.Node.getLabelStyle(uuid);
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
			}
			//------------------------------
			var code = $('code',resource).text();
			var display_code = false;
			var display_label = true;
			if (code.indexOf("$")>-1) 
				display_label = false;
			if (code.indexOf("@")<0) {
				display_code = true;
			}
			code = cleanCode(code);
			//------------------------------
			input += "<div class='radio-div' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			input += "><input type='radio' name='radio_"+self.id+"' ";
			if (disabled)
				input +="disabled='disabled' ";
			if (code!="" && self_code==$('code',resource).text())
				input += " checked ";
			input += " style=\""+style+"\"></div>";
			input += "<div  class='sel"+code+" radio-label' style=\""+style+"\">";
			if (display_code)
				input += code + " ";
			if (display_label)
				input += $(srce+"[lang='"+languages[langcode]+"']",resource).text();
			input += "</div></input>";
			var obj = $(input);
			$(obj).click(function (){
				UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
			});
			$(radio_obj).append(obj);
			$("#"+destid).append(radio_obj);
		}
	}
	//------------------------------------------------------------
	if (type.indexOf('click')>-1) {
		var inputs = "<div class='click'></div>";
		var inputs_obj = $(inputs);
		//----------------- null value to erase
		var input = "";
		input += "<div name='click_"+self.id+"' value='' code='' class='click-item' ";
		for (var j=0; j<languages.length;j++){
			input += "label_"+languages[j]+"='&nbsp;' ";
		}
		input += "> ";
		input +="<span  class='"+code+"'>&nbsp;</span></div>";
		var input_obj = $(input);
		$(input_obj).click(function (){
			$('.clicked',inputs_obj).removeClass('clicked');
			$(this).addClass('clicked');
			UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
		});
		$(inputs_obj).append(input_obj);
		//-----------------------
		var first = true;
		for ( var i = 0; i < newTableau1.length; ++i) {
			var uuid = $(newTableau1[i][1]).attr('id');
			var style = "";
			var input = "";
			//------------------------------
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3) {
				style = UIFactory.Node.getContentStyle(uuid);
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			} else {
				style = UIFactory.Node.getLabelStyle(uuid);
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
			}
			//------------------------------
			var code = $('code',resource).text();
			var display_code = false;
			var display_label = true;
			if (code.indexOf("$")>-1) 
				display_label = false;
			if (code.indexOf("@")<0) {
				display_code = true;
			}
			code = cleanCode(code);
			//------------------------------
			input += "<div name='click_"+self.id+"' code='"+$('code',resource).text()+"' value='"+$('value',resource).text()+"' class='sel"+code+" click-item";
			if (self_code==$('code',resource).text())
				input += " clicked";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			input += " style=\""+style+"\">";
			if (display_code)
				input += code + " ";
			if (display_label)
				input +=$("label[lang='"+languages[langcode]+"']",resource).text();
			input += " </div>"
			var input_obj = $(input);
			$(input_obj).click(function (){
				$('.clicked',inputs_obj).removeClass('clicked');
				$(this).addClass('clicked');
				UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
			});
			$(inputs_obj).append(input_obj);
			$("#"+destid).append(inputs_obj);
		}
	}
	//------------------------------------------------------------
	//------------------------------------------------------------
	if (type.indexOf('multiple')>-1) {
	//------------------------------------------------------------
	//------------------------------------------------------------
		var inputs = "<div id='get_get_multiple' class='multiple'></div>";
		var inputs_obj = $(inputs);
		//-----------------------
		var nodes = $("node",data);
		for ( var i = 0; i < newTableau1.length; ++i) {
			var uuid = $(newTableau1[i][1]).attr('id');
			var input = "";
			var style = "";
			//------------------------------
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3 && srce!='node') {
				style = UIFactory.Node.getContentStyle(uuid);
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]);
			} else {
				style = UIFactory.Node.getLabelStyle(uuid);
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
				srce = 'label';
			}
			//------------------------------
			var code = $('code',resource).text();
			var selectable = true;
			var disabled = false;
			var display_code = false;
			var display_label = true;
			//------------------------
			if (code.indexOf("$")>-1){ 
				display_label = false;
			}
			if (code.indexOf("@")<0) {
				display_code = true;
			}
			if (code.indexOf("?")>-1) {
				disabled = true;
			}
			if (code.indexOf("!")>-1 || semtag.indexOf("!")>-1) {
				selectable = false;
			}
			code = cleanCode(code);
			//------------------------------
			input += "<div id='"+code+"' style=\""+style+"\">";
			if (selectable) {
				input += "	<input type='checkbox' name='multiple_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' portfoliocode='"+portfoliocode+"' class='multiple-item";
				input += "' ";
				if (srce=="resource") {
					for (var j=0; j<languages.length;j++){
						var elts = $("label[lang='"+languages[langcode]+"']",resource).text().split("|");
						input += "label_"+languages[j]+"=\""+elts[2].substring(6)+"\" ";
					}
				}
				else {
					for (var j=0; j<languages.length;j++){
						input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
					}
				}
				if (disabled)
					input += "disabled";
				input += "> ";
			}
			if (display_code)
				input += code + " ";
				if (srce=="resource") {
					var elts = $("label[lang='"+languages[langcode]+"']",resource).text().split("|");
					input +="<span  class='"+code+"'>" + elts[2].substring(6) + "</span></div>";
				}
			else	
				input +="<span  class='"+code+"'>"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</span></div>";
			var input_obj = $(input);
			$(inputs_obj).append(input_obj);
			// ---------------------- children ---------
			if (semtag2!="") {
				var semtag_parent = semtag.replace("!","");
				UIFactory.Get_Get_Resource.getChildren(inputs_obj,langcode,self,srce,portfoliocode,semtag2,semtag_parent,code,cachable);
			}
			//------------------------------------------
		}
		//------------------------------
		$("#"+destid).append(inputs_obj);
	}
	//------------------------------------------------------------
};

//==================================
UIFactory["Get_Get_Resource"].getChildren = function(dest,langcode,self,srce,portfoliocode,semtag,semtag_parent,code,cachable)
//==================================
{
	var semtag2 = "";
	if (semtag.indexOf('+')>-1) {
		semtag2 = semtag.substring(semtag.indexOf('+')+1);
		semtag = semtag.substring(0,semtag.indexOf('+'));
	}
	//------------
	if (cachable && g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code]!=undefined && g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code]!="")
		UIFactory.Get_Get_Resource.parseChildren(dest,g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code],langcode,srce,portfoliocode,semtag,semtag_parent,code,semtag2,cachable)
	else {
		$.ajax({
			async:false,
			type : "GET",
			dataType : "xml",
			url : serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag.replace("!","")+"&semtag_parent="+semtag_parent+ "&code_parent="+code,
			success : function(data) {
				if (cachable)
					g_Get_Resource_caches[portfoliocode+semtag+semtag_parent+code] = data;
				UIFactory.Get_Get_Resource.parseChildren(dest,data,langcode,self,srce,portfoliocode,semtag,semtag_parent,code,semtag2,cachable)
			}
		});
	}
	//------------
}
//==================================
UIFactory["Get_Get_Resource"].parseChildren = function(dest,data,langcode,self,srce,portfoliocode,semtag,semtag_parent,code,semtag2,cachable)
//==================================
{
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
	//--------------------------------------------------------------------
	for ( var i = 0; i < newTableau1.length; ++i) {
		var uuid = $(newTableau1[i][1]).attr('id');
		//------------------------------
		var input = "";
		var style = "";
		//------------------------------
		var resource = null;
		if ($("asmResource",newTableau1[i][1]).length==3) {
			style = UIFactory.Node.getContentStyle(uuid);
			resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
		} else {
			style = UIFactory.Node.getLabelStyle(uuid);
			resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
		}
		//------------------------------
		var code = $('code',resource).text();
		var selectable = true;
		var disabled = false;
		var display_code = false;
		var display_label = true;
		//------------------------
		if (code.indexOf("$")>-1){ 
			display_label = false;
		}
		if (code.indexOf("@")<0) {
			display_code = true;
		}
		if (code.indexOf("?")>-1) {
			disabled = true;
		}
		if (code.indexOf("!")>-1 || semtag.indexOf("!")>-1 ) {
			selectable = false;
		}
		code = cleanCode(code);
		//------------------------------
		input += "<div id='"+code+"' style=\""+style+"\">";
		if (selectable) {
			input += "	<input type='checkbox' name='multiple_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='multiple-item";
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
		$(dest).append(input_obj);
		if (semtag2!="") {
			var semtag_parent = semtag.replace("!","");
			UIFactory.Get_Get_Resource.getChildren(dest,langcode,srce,portfoliocode,semtag2,semtag_parent,code,cachable);
		}
	}
}
//==================================
UIFactory["Get_Get_Resource"].reloadIfInLine = function(uuid,destid,type,langcode)
//==================================
{
	var node = UICom.structure["ui"][uuid];
	var inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
	if (inline_metadata=='Y')
		node.resource.redisplayEditor(destid,type,langcode); //(destid,type,langcode,disabled,cachable)
}

//==================================
UIFactory["Get_Get_Resource"].prototype.redisplayEditor = function(destid,type,langcode,disabled,cachable)
//==================================
{
	if (type==undefined || type==null)
		type = $("metadata-wad",this.node).attr('seltype');
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (queryattr_value!=undefined && queryattr_value!='') {
		try {
			//------------------------------
			var srce_indx = queryattr_value.lastIndexOf('.');
			var srce = queryattr_value.substring(srce_indx+1);
			var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
			var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
			var semtag_parent_indx = queryattr_value.substring(0,semtag_indx).lastIndexOf('.');
			var semtag_parent = queryattr_value.substring(semtag_parent_indx+1,semtag_indx);
			if (semtag_parent.indexOf('#')==0)
				semtag_parent = semtag_parent.substring(1);
			var portfoliocode_end_indx = queryattr_value.indexOf('sibling')+queryattr_value.indexOf('parent')+queryattr_value.indexOf('#')+1;
			var portfoliocode = queryattr_value.substring(0,portfoliocode_end_indx);
			//------------
			var portfoliocode = queryattr_value.substring(0,portfoliocode_end_indx);
			var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
			if (portfoliocode.indexOf('.')<0 && portfoliocode!='self')  // There is no project, we add the project of the current portfolio
				portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
			if (portfoliocode=='self')
				portfoliocode = selfcode;
			//------------
			var query = queryattr_value.substring(portfoliocode_end_indx,semtag_parent_indx);
			var parent = null;
			var ref = null;
			// ------- search for parent ----
			if (query.indexOf('sibling')>-1) {
				parent = $(this.node).parent();
			}
			if (query.indexOf('parent.parent.parent')>-1) {
				parent = $(this.node).parent().parent().parent();//.parent();
			} else	if (query.indexOf('parent.parent')>-1) {
				parent = $(this.node).parent().parent();//.parent();
			} else if (query.indexOf('parent')>-1) {
				parent = $(this.node).parent();//.parent();
			}
//			alertHTML('query'+query+'--parentid'+$(parent).attr("id"));
			var code_parent = "";
			if (queryattr_value.indexOf('#')>0)
				code_parent = semtag_parent;
			else {
				var child = $("*:has(metadata[semantictag*='"+semtag_parent+"'])",parent);
				var itself = $(parent).has("metadata[semantictag*='"+semtag_parent+"']");
				if (child.length==0 && itself.length>0){
					code_parent = $($("code",itself)[0]).text();
				} else {
					var nodetype = $(child).prop("nodeName"); // name of the xml tag
					if (nodetype=='asmContext')
						code_parent = $($("code",child)[1]).text();
					else
						code_parent = $($("code",child)[0]).text();

				}
			}
			//----------------------
			if ($("asmContext:has(metadata[semantictag='"+semtag_parent+"'][encrypted='Y'])",parent).length>0)
				code_parent = decrypt(code_parent.substring(3),g_rc4key);
			//----------------------
			var portfoliocode_parent = $("portfoliocode",$("asmContext:has(metadata[semantictag='"+semtag_parent+"'])",parent)).text();
//			alertHTML('portfoliocode:'+portfoliocode+'--semtag:'+semtag+'--semtag_parent:'+semtag_parent+'--code_parent:'+code_parent+'--portfoliocode_parent:'+portfoliocode_parent);
			var url ="";
			if (portfoliocode=='?'){
				$(this.portfoliocode_node).text(code_parent);
				url = serverBCK_API+"/nodes?portfoliocode="+code_parent+"&semtag="+semtag;
			}
			else if (portfoliocode=='parent?'){
				$(this.portfoliocode_node).text(portfoliocode_parent);
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode_parent+"&semtag="+semtag+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;			
			} else {
				$(this.portfoliocode_node).text(portfoliocode);
				url = serverBCK_API+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;
			}
			var self = this;
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : url,
				success : function(data) {
					UIFactory["Get_Get_Resource"].reparse(destid,type,langcode,data,self,disabled,srce);
				},
				error : function(jqxhr,textStatus) {
					$("#"+destid).html("No result");
				}

			});
		} catch(e) { alertHTML(e);
			// do nothing - error in the search attribute
		}
	}
};

//==================================
UIFactory["Get_Get_Resource"].reparse = function(destid,type,langcode,data,self,disabled,srce) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var self_code = $(self.code_node).text();
	if (self.encrypted)
		self_code = decrypt(self_code.substring(3),g_rc4key);
	//---------------------
	//---------------------
	var self_value = $(self.value_node).text();
	if (self.encrypted)
		self_value = decrypt(self_value.substring(3),g_rc4key);
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	//------------------------------------------------------------
	if (type=='select') {
		$("#dropdown-"+self.id).html("");
		var selected_value = "";
		//----------------- null value to erase
		var html = "<li></li>";
		var select_item = $(html);
		html = "<a  value='' code='' ";
		for (var j=0; j<languages.length;j++) {
			html += "label_"+languages[j]+"='&nbsp;' ";
		}
		html += ">";
		html += "&nbsp;</a>";
		//-----------------
		var select_item_a = $(html);
		$(select_item_a).click(function (ev){
			$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
			$("#button_"+self.id).attr('class', 'btn btn-default select select-label');
			UIFactory["Get_Get_Resource"].update(this,self,langcode);
		});
		$(select_item).append($(select_item_a))
		$("#dropdown-"+self.id).append($(select_item));
		//--------------------
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; i++) {
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			if (code.indexOf('-#')>-1) {
				html = "<div class='dropdown-divider'></div>";
			} else {
				html = "<li></li>";
			}
			var select_item = $(html);
			if (code.indexOf('-#')>-1) {
				html = "<a >" + $(srce+"[lang='"+languages[langcode]+"']",resource).text() + "</a>";
				$(select_item).html(html);
			} else {
				html = "<a  code='"+code+"' value='"+$(nodes[i]).attr('id')+"' ";
				for (var j=0; j<languages.length;j++){
					html += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				html += ">";
				
				if (code.indexOf("@")<0)
					html += code + " ";
				html += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</a>";
				var select_item_a = $(html);
				$(select_item_a).click(function (ev){
					$("#button_"+self.id).html($(this).attr("label_"+languages[langcode]));
					$(this).attr('class', '').addClass($(this).children(':selected').val());
					UIFactory["Get_Get_Resource"].update(this,self,langcode);
				});
				$(select_item).append($(select_item_a))
				//-------------- update button -----
				if (code!="" && self_code==$('code',resource).text()) {
					if (($('code',resource).text()).indexOf("#")>-1)
						$("#button_"+self.id).html(code+" "+$(srce+"[lang='"+languages[langcode]+"']",resource).text());
					else
						$("#button_"+self.id).html($(srce+"[lang='"+languages[langcode]+"']",resource).text());
					$("#button_"+self.id).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
				}
			}
			$("#dropdown-"+self.id).append($(select_item));
		}
	}
	if (type.indexOf('radio')>-1) {
		//----------------- null value to erase
		var radio_obj = $("<div class='get-radio'></div>");
		var input = "";
		input += "<input type='radio' name='radio_"+self.id+"' value='' code='' ";
		if (disabled)
			input +="disabled='disabled' ";
		for (var j=0; j<languages.length;j++){
			input += "label_"+languages[j]+"='&nbsp;'";
		}
		input += ">&nbsp;&nbsp;";
		input += "</input>";
		var obj = $(input);
		$(obj).click(function (){
			UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
		});
		$(radio_obj).append(obj);
		$("#"+destid).append(radio_obj);
		//-------------------
		var nodes = $("node",data);
		var first = true;
		for ( var i = 0; i < $(nodes).length; i++) {
			var radio_obj = $("<div class='get-radio'></div>");
			var input = "";
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			first = false;
			input += "<input type='radio' name='radio_"+self.id+"' code='"+$(nodes[i]).attr('id')+"' value='"+code+"' ";
			if (disabled)
				input +="disabled='disabled' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			if (code!="" && self_value==code)
				input += " checked ";
			input += ">";
			if (code.indexOf("@")<0)
				input += "&nbsp;&nbsp;"+ code;
			input += "&nbsp;&nbsp;"+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</input>";
			var obj = $(input);
			$(obj).click(function (){
				UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
			});
			$(radio_obj).append(obj);
			$("#"+destid).append(radio_obj);
		}
	}
	//------------------------------------------------------------
	if (type.indexOf('click')>-1) {
		var inputs = "<div class='click'></div>";
		var inputs_obj = $(inputs);
		//----------------- null value to erase
		var input = "";
		input += "<div name='click_"+self.id+"' value='' code='' class='click-item' ";
		for (var j=0; j<languages.length;j++){
			input += "label_"+languages[j]+"='&nbsp;' ";
		}
		input += "> ";
		input +="<span  class='"+code+"'>&nbsp;</span></div>";
		var input_obj = $(input);
		$(input_obj).click(function (){
			$('.clicked',inputs_obj).removeClass('clicked');
			$(this).addClass('clicked');
			UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
		});
		$(inputs_obj).append(input_obj);
		//-----------------------
		var nodes = $("node",data);
		var first = true;
		for ( var i = 0; i < $(nodes).length; ++i) {
			var input = "";
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			input += "<div name='click_"+self.id+"' code='"+$(nodes[i]).attr('id')+"' value='"+code+"' class='click-item";
			if (self_value==code)
				input += " clicked";
			input += "' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			if (self_value==code)
				input += " clicked";
			input += "> ";
			if (code.indexOf("@")<0)
				input += code + " ";
			input +=$("label[lang='"+languages[langcode]+"']",resource).text()+" </div>";
			var input_obj = $(input);
			$(input_obj).click(function (){
				$('.clicked',inputs_obj).removeClass('clicked');
				$(this).addClass('clicked');
				UIFactory["Get_Get_Resource"].update(this,self,langcode,type);
			});
			$(inputs_obj).append(input_obj);
			$("#"+destid).append(inputs_obj);
		}
		//------------------------------------------------------------
	}
};

//==================================
UIFactory["Get_Get_Resource"].prototype.save = function()
//==================================
{
	if (UICom.structure.ui[this.id].semantictag.indexOf("g-select-variable")>-1)
		updateVariable(this.node);
	if (this.clause=="xsi_type='Get_Get_Resource'") {
		UICom.UpdateResource(this.id,writeSaved);
		if (!this.inline)
			this.refresh();
	}
	else {// Node - Get_Get_Resource {
		UICom.UpdateNode(this.node);
		UICom.structure.ui[this.id].refresh()
	}	
};

//==================================
UIFactory["Get_Get_Resource"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};
	for (dest in this.displayValue) {
		$("#"+dest).html(this.getValue());
	};
	for (dest in this.displayCode) {
		$("#"+dest).html(this.getCode());
	};

};

//==================================
UIFactory["Get_Get_Resource"].addMultiple = function(parentid,targetid,multiple_tags,get_get_resource_semtag)
//==================================
{
	$.ajaxSetup({async: false});
	var elts = multiple_tags.split(",");
	var part_code = elts[0];
	var srce = part_code.substring(0,part_code.lastIndexOf('.'));
	var part_semtag = part_code.substring(part_code.lastIndexOf('.')+1);
	var get_resource_semtag = elts[1];
	var fct = elts[2];

//	var part_code = multiple_tags.substring(0,multiple_tags.indexOf(','));
//	var srce = part_code.substring(0,part_code.lastIndexOf('.'));
//	var part_semtag = part_code.substring(part_code.lastIndexOf('.')+1);
//	var get_resource_semtag = multiple_tags.substring(multiple_tags.indexOf(',')+1);

	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	//------------------------------
	if (UICom.structure.ui[targetid]==undefined && targetid!="")
		targetid = getNodeIdBySemtag(targetid);
	if (targetid!="" && targetid!=parentid)
		parentid = targetid;
	//------------------------------
	// for each one create a part
	var databack = true;
	var callback = UIFactory.Get_Get_Resource.updateaddedpart;
	var param2 = get_resource_semtag;
	var param4 = false;
	var param5 = parentid;
	var param6 = fct;
	for (var j=0; j<inputs.length;j++){
		var param3 = inputs[j];
		if (j==inputs.length-1)
			param4 = true;
		importBranch(parentid,srce,part_semtag,databack,callback,param2,param3,param4,param5,param6);
	}
};


//==================================
UIFactory["Get_Get_Resource"].updateaddedpart = function(data,get_resource_semtag,selected_item,last,parentid,fct)
//==================================
{
	var partid = data;
	var value = $(selected_item).attr('value');
	if (value=="")
		value = $(selected_item).attr('portfoliocode');
	var code = $(selected_item).attr('code');
	if (fct=="+parentcode") {
		code += "$"+UICom.structure.ui[parentid].getCode();
	}
	var xml = "<asmResource xsi_type='Get_Get_Resource'>";
	xml += "<code>"+code+"</code>";
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
			var nodeid = $("*:has(>metadata[semantictag='"+get_resource_semtag+"'])",data).attr('id');
			var url_resource = serverBCK_API+"/resources/resource/" + nodeid;
			var tagname = $( ":root",data )[ 0 ].nodeName;
			if( "asmRoot" == tagname || "asmStructure" == tagname || "asmUnit" == tagname || "asmUnitStructure" == tagname) {
				xml = xml.replace("Get_Get_Resource","nodeRes");
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

//==================================
UIFactory["Get_Get_Resource"].importMultiple = function(parentid,targetid,srce,fct)
//==================================
{
	$.ajaxSetup({async: false});
	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	//------------------------------
	if (UICom.structure.ui[targetid]==undefined)
		targetid = getNodeIdBySemtag(targetid);
	if (targetid!="" && targetid!=parentid)
		parentid = targetid;
	//------------------------------
	var callback = "";
	var databack = false;
	var param2 = "";
	var param3 = null;
	var parent = UICom.structure.ui[parentid].node;
	while ($(parent).prop("nodeName")!="asmUnit" && $(parent).prop("nodeName")!="asmStructure" && $(parent).prop("nodeName")!="asmRoot") {
		parent = $(parent).parent();
	}
	var topid = $(parent).attr("id");
	if ($(parent).prop("nodeName") == "asmUnit"){
		callback = UIFactory.Node.reloadUnit;
		param2 = topid;
		if ($("#page").attr('uuid')!=topid)
			param3 = false;
	}
	else {
		callback = UIFactory.Node.reloadStruct;
		param2 = g_portfolio_rootid;
		if ($("#page").attr('uuid')!=topid)
			param3 = false;
	}
	for (var j=0; j<inputs.length;j++){
		var code = $(inputs[j]).attr('code');
		if (srce=='?')
			srce = $(inputs[j]).attr('portfoliocode');
		importBranch(parentid,srce,code,databack,callback,param2,param3);
	}
	if (fct!=null) {
		fct(parentid);
		UIFactory.Node.reloadUnit();
	}
}

//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//----------------------------------Menu Functions--------------------------------------------------------
//--------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------

//==================================
function get_get_multiple(parentid,targetid,title,query,partcode,get_get_resource_semtag)
//==================================
{
	// targetid not used with get_get_multiple
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Get_Resource.addMultiple('"+parentid+"','"+targetid+"','"+partcode+","+get_get_resource_semtag+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
	var html = "<div id='get-get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getgetResource = new UIFactory["Get_Get_Resource"](UICom.structure["ui"][parentid].node,"xsi_type='nodeRes'");
	getgetResource.multiple = query+"/"+partcode+","+get_get_resource_semtag;
	getgetResource.displayEditor("get-get-resource-node");
	$('#edit-window').modal('show');

}

//==================================
function import_ggmultiple(parentid,targetid,title,query,partcode,fct)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Get_Resource.importMultiple('"+parentid+"','"+targetid+"','"+partcode+"',"+fct+")";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
	var html = "<div id='get-get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getgetResource = new UIFactory["Get_Get_Resource"](UICom.structure["ui"][parentid].node,"xsi_type='nodeRes'");
	getgetResource.multiple = query+"/"+partcode;
	getgetResource.displayEditor("get-get-resource-node");
	$('#edit-window').modal('show');
}

//==================================
function functions_ggmultiple(parentid,targetid,title,query,functions)
//==================================
{
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var elts = functions.split("&");
	var js2 = "";
	for (var i=0;i<elts.length;i++){
		var items = elts[i].split(":");
		if (items[0]=="import_ggmultiple") {
			js2 += "UIFactory.Get_Get_Resource.importMultiple('"+parentid+"'";
			if (items.length>2)
				js2 += ",'"+items[2]+"'";
			else
				js2 += ",'"+targetid+"'";
			js2 += ",'"+items[1]+"');";
		}
		if (items[0]=="get_get_multiple") {
			js2 += "UIFactory.Get_Get_Resource.addMultiple('"+parentid+"'";
			if (items.length>3)
				js2 += ",'"+items[3]+"'";
			else
				js2 += ",'"+targetid+"'";
			js2 += ",'"+items[1]+","+items[2]+"');";
		}
	}
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
	var html = "<div id='get-get-resource-node'></div>";
	$("#edit-window-body").html(html);
	$("#edit-window-body-node").html("");
	$("#edit-window-type").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var getgetResource = new UIFactory["Get_Get_Resource"](UICom.structure["ui"][parentid].node,"xsi_type='nodeRes'");
	getgetResource.multiple = query+"/";
	getgetResource.displayEditor("get-get-resource-node");
	$('#edit-window').modal('show');
}
