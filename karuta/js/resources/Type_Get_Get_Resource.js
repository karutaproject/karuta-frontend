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

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["Get_Get_Resource"] = function( node )
//==================================
{
	this.type = "Get_Get_Resource";
	this.id = $(node).attr('id');
	this.type = 'Get_Get_Resource';
	this.parentid = $(node).parent().attr("id");
	this.node = node;
	this.code_node = $("code",$("asmResource[xsi_type='Get_Get_Resource']",node));
	this.value_node = $("value",$("asmResource[xsi_type='Get_Get_Resource']",node));
	this.portfoliocode_node = $("portfoliocode",$("asmResource[xsi_type='Get_Get_Resource']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Get_Resource']",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource[xsi_type='Get_Get_Resource']",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource[xsi_type='Get_Get_Resource']",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Get_Get_Resource']",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Get_Resource']",node));
			}
		}
	}
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
	this.displayValue = {};
};

//==================================
UIFactory["Get_Get_Resource"].prototype.getType = function()
//==================================
{
	return this.type;
};

//==================================
UIFactory["Get_Get_Resource"].prototype.getCode = function()
//==================================
{
	var code = $(this.code_node).text();
	if (this.encrypted)
		code = decrypt(code.substring(3),g_rc4key);
	return code;
};

//==================================
UIFactory["Get_Get_Resource"].prototype.getValue = function()
//==================================
{
	var value = $(this.value_node).text();
	if (this.encrypted)
		valuee = decrypt(value.substring(3),g_rc4key);
	return value;
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
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	var label = this.label_node[langcode].text();
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	return label;
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
	var label = this.label_node[langcode].text();
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	$(dest).html(label);
};


/// Editor
//==================================
UIFactory["Get_Get_Resource"].update = function(selected_item,itself,langcode,type)
//==================================
{
	var value = $(selected_item).attr('value');
	var code = $(selected_item).attr('code');
	//---------------------
	if (itself.encrypted)
		value = "rc4"+encrypt(value,g_rc4key);
	if (itself.encrypted)
		code = "rc4"+encrypt(code,g_rc4key);
	//---------------------
	$(itself.value_node).text(value);
	$(itself.code_node).text(code);
	for (var i=0; i<languages.length;i++){
		var label = $(selected_item).attr('label_'+languages[i]);
		//---------------------
		if (itself.encrypted)
			label = "rc4"+encrypt(label,g_rc4key);
		//---------------------
		$(itself.label_node[i]).text(label);
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
	if (queryattr_value!=undefined && queryattr_value!='') {
		try {
			//------------------------------
			var srce_indx = queryattr_value.lastIndexOf('.');
			var srce = queryattr_value.substring(srce_indx+1);
			var semtag_indx = queryattr_value.substring(0,srce_indx).lastIndexOf('.');
			var semtag = queryattr_value.substring(semtag_indx+1,srce_indx);
			var semtag_parent_indx = queryattr_value.substring(0,semtag_indx).lastIndexOf('.');
			var semtag_parent = queryattr_value.substring(semtag_parent_indx+1,semtag_indx);
			var portfoliocode_end_indx = queryattr_value.indexOf('sibling')+queryattr_value.indexOf('parent');
			var portfoliocode = queryattr_value.substring(0,portfoliocode_end_indx);
			if (portfoliocode=='self')
				portfoliocode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
			var query = queryattr_value.substring(portfoliocode_end_indx,semtag_parent_indx);
			var parent = null;
			var ref = null;
			// ------- search for parent ----
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
//			alert('query'+query+'--parentid'+$(parent).attr("id"));
			var code_parent = "";
			if (query.indexOf('#')==0)
				code_parent = semtag_parent;
			else
				code_parent = $("code",$("asmContext:has(metadata[semantictag='"+semtag_parent+"'])",parent)[0]).text();
			//----------------------
			if ($("asmContext:has(metadata[semantictag='"+semtag_parent+"'][encrypted='Y'])",parent).length>0)
				code_parent = decrypt(code_parent.substring(3),g_rc4key);
			//----------------------
			var portfoliocode_parent = $("portfoliocode",$("asmContext:has(metadata[semantictag='"+semtag_parent+"'])",parent)).text();
//			alert('portfoliocode:'+portfoliocode+'--semtag:'+semtag+'--semtag_parent:'+semtag_parent+'--code_parent:'+code_parent+'--portfoliocode_parent:'+portfoliocode_parent);
			var url ="";
			if (portfoliocode=='?'){
				$(this.portfoliocode_node).text(code_parent);
				url = "../../../"+serverBCK+"/nodes?portfoliocode="+code_parent+"&semtag="+semtag;
			}
			else if (portfoliocode=='parent?'){
				$(this.portfoliocode_node).text(portfoliocode_parent);
				url = "../../../"+serverBCK+"/nodes?portfoliocode="+portfoliocode_parent+"&semtag="+semtag+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;			
			} else {
				$(this.portfoliocode_node).text(portfoliocode);
				url = "../../../"+serverBCK+"/nodes?portfoliocode="+portfoliocode+"&semtag="+semtag+"&semtag_parent="+semtag_parent+ "&code_parent="+code_parent;
			}
	
			var self = this;
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : url,
				success : function(data) {
					UIFactory["Get_Get_Resource"].parse(destid,type,langcode,data,self,disabled,srce);
				},
				error : function(jqxhr,textStatus) {
					$("#"+dest).html("No result");
				}

			});
		} catch(e) { alert(e);
			// do nothing - error in the search attribute
		}
	}
};

//==================================
UIFactory["Get_Get_Resource"].parse = function(destid,type,langcode,data,self,disabled,srce) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var self_value = $(self.value_node).text();
	if (self.encrypted)
		self_value = decrypt(self_value.substring(3),g_rc4key);
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	//------------------------------------------------------------
	if (type=='select') {
		var selected_value = "";
		var html = "<div class='btn-group choice-group'>";
		html += "<button type='button' class='btn btn-default select select-label' id='button_"+self.id+"'>&nbsp;</button>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>Toggle Dropdown</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$("#"+destid).append($(btn_group));
		html = "<ul class='dropdown-menu' role='menu'></ul>";
		var select  = $(html);
		//----------------- null value to erase
		html = "<li></li>";
		var select_item = $(html);
		html = "<a href='#' value='' code='' ";
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
		$(select_item).append($(select_item_a))
		$(select).append($(select_item));
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
				html = "<li class='divider'></li><li></li>";
			} else {
				html = "<li></li>";
			}
			var select_item = $(html);
			if (code.indexOf('-#')>-1) {
				html = "<a href='#'>" + $(srce+"[lang='"+languages[langcode]+"']",resource).text() + "</a>";
				$(select_item).html(html);
			} else {
				html = "<a href='#' code='"+code+"' value='"+$(nodes[i]).attr('id')+"' ";
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
				if (code!="" && self_value==code) {
					selected_value = code;
					$("#button_"+self.id).html($(srce+"[lang='"+languages[langcode]+"']",resource).text());
				}
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
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
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

};
