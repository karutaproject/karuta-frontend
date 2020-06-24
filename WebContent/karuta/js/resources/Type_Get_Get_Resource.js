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
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var label = this.label_node[langcode].text();
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	var code = $(this.code_node).text();
	var html = "";
	if (type=='default'){
		html += "<div class='"+cleanCode(code)+" view-div'>";
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
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var label = this.label_node[langcode].text();
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	var code = $(this.code_node).text();
	var html = "";
	if (type=='default'){
		html += "<div class='"+cleanCode(code)+" view-div'>";
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

//==================================
UIFactory["Get_Get_Resource"].prototype.displayView = function(dest,type,langcode)
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
	//---------------------
	var label = this.label_node[langcode].text();
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	var code = $(this.code_node).text();
	var html = "";
	html += "<span class='"+code+"'>";
	if (($(this.code_node).text()).indexOf("#")>-1)
		html += cleanCode(code) + " ";
	if (($(this.code_node).text()).indexOf("%")<0)
		html += label;
	if (($(this.code_node).text()).indexOf("&")>-1)
		html += " ["+$(this.value_node).text()+ "] ";
	html += "</span>";
	$("#"+dest).html("");
	$("#"+dest).append($(html));
};


/// Editor
//==================================
UIFactory["Get_Get_Resource"].update = function(selected_item,itself,langcode,type)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
	//---------------------
	if (itself.encrypted)
		value = "rc4"+encrypt(value,g_rc4key);
	if (itself.encrypted)
		code = "rc4"+encrypt(code,g_rc4key);
	//---------------------
	$(itself.value_node[0]).text(value);
	$(itself.code_node[0]).text(code);
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
			var portfoliocode_end_indx = queryattr_value.indexOf('child')+queryattr_value.indexOf('sibling')+queryattr_value.indexOf('parent')+queryattr_value.indexOf('#')+queryattr_value.indexOf('itself')+3; //  if not present give -1
			var portfoliocode = r_replaceVariable(queryattr_value.substring(0,portfoliocode_end_indx));
			//------------
			var selfcode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
			if (portfoliocode.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode!='self')  // There is no project, we add the project of the current portfolio
				portfoliocode = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode;
			if (portfoliocode=='self')
				portfoliocode = selfcode;
			//------------
			var query = queryattr_value.substring(portfoliocode_end_indx,semtag_parent_indx);
			var parent = null;
			var ref = null;
			// ------- search for parent ----
			if (query.indexOf('child')>-1) {
				parent = this.node;
			}
			if (query.indexOf('sibling')>-1) {
				parent = $(this.node).parent();
			}
			if (query.indexOf('parent.parent.parent')>-1) {
				parent = $(this.node).parent().parent().parent().parent();
			} else	if (query.indexOf('parent.parent')>-1) {
				parent = $(this.node).parent().parent().parent();
			} else if (query.indexOf('parent')>-1) {
				parent = $(this.node).parent().parent();
			}
			var code_parent = "";
			if (queryattr_value.indexOf('#')>0)
				code_parent = semtag_parent;
			else {
//				var child = $("*:has(metadata[semantictag*='"+semtag_parent+"'])",parent);
				var child = $("metadata[semantictag*='"+semtag_parent+"']",parent).parent();
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
			if ($("*:has(metadata[semantictag*='"+semtag_parent+"'][encrypted='Y'])",parent).length>0)
				code_parent = decrypt(code_parent.substring(3),g_rc4key);
			//----------------------
			if (query.indexOf('itself')>-1) {
				code_parent = $($("code",$(this.node)[0])[0]).text();
			}
			//----------------------
			var portfoliocode_parent = $("portfoliocode",$("*:has(metadata[semantictag*='"+semtag_parent+"'])",parent)).text();
			if (portfoliocode_parent.indexOf('.')<0 && selfcode.indexOf('.')>0 && portfoliocode_parent!='self')  // There is no project, we add the project of the current portfolio
				portfoliocode_parent = selfcode.substring(0,selfcode.indexOf('.')) + "." + portfoliocode_parent;
//			alertHTML('portfoliocode:'+portfoliocode+'--semtag:'+semtag+'--semtag_parent:'+semtag_parent+'--code_parent:'+code_parent+'--portfoliocode_parent:'+portfoliocode_parent);
				var url ="";
				if (portfoliocode.indexOf('?')!= -1) {
					if (code_parent.indexOf("@")>-1) {
						display_code_parent = false;
						code_parent =code_parent.substring(0,code_parent.indexOf("@"))+code_parent.substring(code_parent.indexOf("@")+1);
					}
					if (code_parent.indexOf("#")>-1) {
						code_parent = code_parent.substring(0,code_parent.indexOf("#"))+code_parent.substring(code_parent.indexOf("#")+1);
					}
					$(this.portfoliocode_node).text(code_parent);
					portfoliocode = code_parent;
					url = serverBCK_API+"/nodes?portfoliocode="+code_parent+"&semtag="+semtag;
				}
				else if (portfoliocode=='parent?'){
					if (portfoliocode_parent.indexOf("@")>-1) {
						display_portfoliocode_parent = false;
						portfoliocode_parent =portfoliocode_parent.substring(0,portfoliocode_parent.indexOf("@"))+portfoliocode_parent.substring(portfoliocode_parent.indexOf("@")+1);
					}
					if (portfoliocode_parent.indexOf("#")>-1) {
						portfoliocode_parent = portfoliocode_parent.substring(0,portfoliocode_parent.indexOf("#"))+portfoliocode_parent.substring(portfoliocode_parent.indexOf("#")+1);
					}
					$(this.portfoliocode_node).text(portfoliocode_parent);
					portfoliocode = portfoliocode_parent;
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
					portfoliocode:portfoliocode,
					success : function(data) {
						UIFactory["Get_Get_Resource"].parse(destid,type,langcode,data,self,disabled,srce,this.portfoliocode);
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
UIFactory["Get_Get_Resource"].parse = function(destid,type,langcode,data,self,disabled,srce,portfoliocode) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
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
		var selected_value = "";
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
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
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
				html += ">";
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
		var first = true;
		for ( var i = 0; i < newTableau1.length; i++) {
			var radio_obj = $("<div class='get-radio'></div>");
			var input = "";
			//------------------------------
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
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
			input += "></div>";
			input += "<div  class='sel"+code+" radio-label'>"
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
			var input = "";
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
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
			input += "> ";
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
	if (type.indexOf('multiple')>-1) {
		//------------------------
		var inputs = "<div id='get_get_multiple' class='multiple'></div>";
		var inputs_obj = $(inputs);
		//-----------------------
		var nodes = $("node",data);
		for ( var i = 0; i < newTableau1.length; ++i) {
			var input = "";
			//------------------------------
			var resource = null;
			if ($("asmResource",newTableau1[i][1]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",newTableau1[i][1]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",newTableau1[i][1]);
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
			if (code.indexOf("!")>-1) {
				selectable = false;
			}
			code = cleanCode(code);
			//------------------------------
			input += "<div>";
			if (selectable) {
				input += "	<input type='checkbox' name='multiple_"+self.id+"' value='"+$('value',resource).text()+"' code='"+$('code',resource).text()+"' class='multiple-item";
				input += "' ";
				for (var j=0; j<languages.length;j++){
					if (target=='fileid' || target=='resource') {
						if (target=='fileid')
							input += "label_"+languages[j] + "=\"" + target + "-" + uuid + "\" ";
						else
							input += "label_"+languages[j] + "=\"" + target + ":" + uuid + "|semtag:"+semtag+"\" ";
					} else 
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
		//------------------------------
		$("#"+destid).append(inputs_obj);
	}
	//------------------------------------------------------------
};

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
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
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
UIFactory["Get_Get_Resource"].addMultiple = function(parentid,multiple_tags)
//==================================
{
	$.ajaxSetup({async: false});
	var part_code = multiple_tags.substring(0,multiple_tags.indexOf(','));
	var srce = part_code.substring(0,part_code.lastIndexOf('.'));
	var part_semtag = part_code.substring(part_code.lastIndexOf('.')+1);
	var get_resource_semtag = multiple_tags.substring(multiple_tags.indexOf(',')+1);
	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	// for each one create a part
	var databack = true;
	var callback = UIFactory.Get_Get_Resource.updateaddedpart;
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
UIFactory["Get_Get_Resource"].importMultiple = function(parentid,srce)
//==================================
{
	$.ajaxSetup({async: false});
	var inputs = $("input[name='multiple_"+parentid+"']").filter(':checked');
	var databack = true;
	var callback = UIFactory.Node.reloadUnit;
	for (var j=0; j<inputs.length;j++){
		var code = $(inputs[j]).attr('code');
		if (srce=='?')
			srce = $(inputs[j]).attr('portfoliocode');
		importBranch(parentid,srce,code,databack,callback);
	}
}

//==================================
UIFactory["Get_Get_Resource"].updateaddedpart = function(data,get_resource_semtag,selected_item,last)
//==================================
{
	var partid = data;
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
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
//			var nodeid = $("asmContext:has(metadata[semantictag='"+get_resource_semtag+"'])",data).attr('id');
			var nodeid = $("*:has(metadata[semantictag='"+get_resource_semtag+"'])",data).attr('id');
			var url_resource = serverBCK_API+"/resources/resource/" + nodeid;
			var tagname = $( ":root",data )[ 0 ].nodeName;
			if( "asmRoot" == tagname || "asmStructure" == tagname || "asmUnit" == tagname || "asmUnitStructure" == tagname) {
				xml = xml.replace("Get_Resource","nodeRes");
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
function get_get_multiple(parentid,title,query,partcode,get_get_resource_semtag)
//==================================
{
	var langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Get_Resource.addMultiple('"+parentid+"','"+partcode+","+get_get_resource_semtag+"')";
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
function import_ggmultiple(parentid,title,query,partcode,get_get_resource_semtag)
//==================================
{
	var langcode = LANGCODE;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Get_Resource.importMultiple('"+parentid+"','"+partcode+"')";
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
/*
//==================================
UIFactory["Get_Get_Resource"].parseROME = function(destid,type,langcode,data,self,disabled,srce,portfoliocode) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	//---------------------
	var cachable = true;
	var langcode = LANGCODE;
	var semtag = 'rome';
	var display_code = false;
	var display_label = true;
	var self_code = $(self.code_node).text();
	//-----Node ordering-------------------------------------------------------
	var newTableau1 = data;
	//------------------------------------------------------------
	if (type=='select') {
		var html ="";
		html += "<form autocomplete='off'>";
		html += "</form>";
		var form = $(html);
		html = "";
		html += "<div class='auto-complete btn-group roles-choice'>";
		html += "<input id='input_"+self.id+"' type='text' class='btn btn-default select select-rome' code= '' value=''>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$(form).append($(btn_group));
		$("#"+destid).append(form);
		//-------------------------------------------------
		html = "<ul class='dropdown-menu' role='menu'></ul>";
		var select  = $(html);
		//---------------------
		for ( var i = 0; i < newTableau1.length; i++) {
			//------------------------------
			var code = newTableau1[i].code;
			var label = newTableau1[i].libelle;
			html = "<li></li>";
			var select_item = $(html);
			html = "<a  value='' code='"+code+"' class='sel"+code+"' label_fr=\""+label+"\" >";
			if (display_code)
				html += "<span class='li-code'>"+code+"</span>";
			if (display_label)
				html += "<span class='li-label'>"+label+"</span>";
			html += "</a>";			
			var select_item_a = $(html);
			$(select_item_a).click(function (ev){
				//--------------------------------
				var code = $(this).attr('code');
				var display_code = false;
				var display_label = true;
				//--------------------------------
				var html = "";
				if (display_code)
					html += code+" ";
				if (display_label)
					html += $(this).attr("label_fr");
				$("#input_"+self.id).html(html);
				UIFactory["Get_Get_Resource"].update(this,self,langcode);
				//--------------------------------
			});
			$(select_item).append($(select_item_a))
			$(select).append($(select_item));
			//-------------- update button -----
			if (code!="" && self_code==code) {
				var html = "";
				if (display_code)
					html += code+" ";
				if (display_label)
					html += label;
				$("#input_"+self.id).html(html);
			}
		}
		//---------------------
		$(btn_group).append($(select));
	}
	if (type=='completion') {
		var html ="";
		html += "<form autocomplete='off'>";
		html += "</form>";
		var form = $(html);
		html = "";
		html += "<div class='auto-complete btn-group roles-choice'>";
		html += "<input id='input_"+self.id+"' type='text' class='btn btn-default select select-rome' code= '' value=''>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$(form).append($(btn_group));
		$("#"+destid).append(form);
		var onupdate = "UIFactory.Get_Get_Resource.update(inp,self)";
		autocomplete(document.getElementById("input_"+self.id), newTableau1,onupdate,self,langcode);
		//===============
		html = "<ul class='dropdown-menu' role='menu'></ul>";
		var select  = $(html);
		//---------------------
		for ( var i = 0; i < newTableau1.length; i++) {
			//------------------------------
			var code = newTableau1[i].code;
			var label = newTableau1[i].libelle;
			html = "<li></li>";
			var select_item = $(html);
			html = "<a  value='' code='"+code+"' class='sel"+code+"' label_fr=\""+label+"\" >";
			if (display_code)
				html += "<span class='li-code'>"+code+"</span>";
			if (display_label)
				html += "<span class='li-label'>"+label+"</span>";
			html += "</a>";			
			var select_item_a = $(html);
			$(select_item_a).click(function (ev){
				//--------------------------------
				var code = $(this).attr('code');
				var display_code = false;
				var display_label = true;
				//--------------------------------
				var html = "";
				if (display_code)
					html += code+" ";
				if (display_label)
					html += $(this).attr("label_fr");
				$("#input_"+self.id).attr("value",html);
				UIFactory["Get_Get_Resource"].update(this,self,langcode);
				//--------------------------------
			});
			$(select_item).append($(select_item_a))
			$(select).append($(select_item));
			//-------------- update button -----
			if (code!="" && self_code==code) {
				var html = "";
				if (display_code)
					html += code+" ";
				if (display_label)
					html += label;
				$("#input_"+self.id).attr("value",html);
			}
		}
		//---------------------
		$(btn_group).append($(select));
	}
}

*/