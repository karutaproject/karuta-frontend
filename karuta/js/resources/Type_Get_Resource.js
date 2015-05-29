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

var g_Get_Resource_caches = {};

/// Define our type
//==================================
UIFactory["Get_Resource"] = function(node,condition)
//==================================
{
	var clause = "xsi_type='Get_Resource'";
	if (condition!=null)
		clause = condition;
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Get_Resource';
	this.code_node = $("code",$("asmResource["+clause+"]",node));
	this.value_node = $("value",$("asmResource[xsi_type='Get_Resource']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Resource']",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource[xsi_type='Get_Resource']",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource[xsi_type='Get_Resource']",node));
			} else {
				var newelement = createXmlElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Get_Resource']",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Get_Resource']",node));
			}
		}
	}
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

/// Display

//==================================
UIFactory["Get_Resource"].prototype.getCode = function()
//==================================
{
	return this.code_node.text();
};

//==================================
UIFactory["Get_Resource"].prototype.getValue = function()
//==================================
{
	return this.value_node.text();
};

//==================================
UIFactory["Get_Resource"].prototype.getView = function(dest,type,langcode)
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
	return "<span class='"+$(this.value_node).text()+"'>"+label+"</span>";
};

//==================================
UIFactory["Get_Resource"].prototype.displayView = function(dest,type,langcode)
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
	label = "<span class='"+$(this.value_node).text()+"'>"+label+"</span>";
	$("#"+dest).html("");
	$("#"+dest).append($(label));
};


/// Editor
//==================================
UIFactory["Get_Resource"].update = function(select,itself,langcode,type)
//==================================
{
	if (type==undefined || type==null)
		type = 'select';
	
	if (type=='select') {
		var option = $(select).find("option:selected");
		var value = $(option).attr('value');
		var code = $(option).attr('code');
		//---------------------
		if (itself.encrypted)
			value = "rc4"+encrypt(value,g_rc4key);
		if (itself.encrypted)
			code = "rc4"+encrypt(code,g_rc4key);
		//---------------------
		$(itself.value_node).text(value);
		$(itself.code_node).text(code);
		for (var i=0; i<languages.length;i++){
			var label = $(option).attr('label_'+languages[i]);
			//---------------------
			if (itself.encrypted)
				label = "rc4"+encrypt(label,g_rc4key);
			//---------------------
			$(itself.label_node[i]).text(label);
		}
	}
	if (type.indexOf('radio')>-1) {
		var name = 'radio_'+itself.id;
		var checked = $('input[name='+name+']').filter(':checked');
		var value = $(checked).attr('value');
		var code = $(checked).attr('code');
		//---------------------
		if (itself.encrypted)
			value = "rc4"+encrypt(value,g_rc4key);
		if (itself.encrypted)
			code = "rc4"+encrypt(code,g_rc4key);
		//---------------------
		$(itself.value_node).text(value);
		$(itself.code_node).text(code);
		for (var i=0; i<languages.length;i++){
			var label = $(checked).attr('label_'+languages[i]);
			//---------------------
			if (itself.encrypted)
				label = "rc4"+encrypt(label,g_rc4key);
			//---------------------
			$(itself.label_node[i]).text(label);
		}
	}
	itself.save();
};

//==================================
UIFactory["Get_Resource"].prototype.displayEditor = function(destid,type,langcode,disabled,cachable)
//==================================
{
	if (cachable==undefined || cachable==null)
		cachable = true;
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (queryattr_value!=undefined && queryattr_value!='') {
		var p1 = queryattr_value.indexOf('.');
		var p2 = queryattr_value.indexOf('.',p1+1);
		var code = queryattr_value.substring(0,p1);
		if (code=='self')
			code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
		var semtag = queryattr_value.substring(p1+1,p2);
		var srce = queryattr_value.substring(p2+1);
		var self = this;
		if (cachable && g_Get_Resource_caches[queryattr_value]!=undefined && g_Get_Resource_caches[queryattr_value]!="")
			UIFactory["Get_Resource"].parse(destid,type,langcode,g_Get_Resource_caches[queryattr_value],self,disabled,srce);
		else
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
				success : function(data) {
					if (cachable)
						g_Get_Resource_caches[queryattr_value] = data;
					UIFactory["Get_Resource"].parse(destid,type,langcode,data,self,disabled,srce);
				}
			});
	}
};


//==================================
UIFactory["Get_Resource"].parse = function(destid,type,langcode,data,self,disabled,srce) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	//---------------------
	var self_value = $(self.value_node).text();
	if (self.encrypted)
		self_value = decrypt(self_value.substring(3),g_rc4key);
	//---------------------
	if (type==undefined || type==null)
		type = 'select';
	if (type=='select') {
		var selected_value = "";
		var select = "<select ";
		if (disabled)
			select += "disabled='disabled'";
		select += "><option code='' value='' ";
		for (var j=0; j<languages.length;j++){
			select += "label_"+languages[j]+"='' ";
		}
		select += "></option></select>";
		var obj = $(select);
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; i++) {
			var option = null;
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			if (code.indexOf('-#')>-1) {
				option = "<optgroup label=\"" + $(srce+"[lang='"+languages[langcode]+"']",resource).text() + "\" >";
			} else {
				option = "<option code='"+$(nodes[i]).attr('id')+"' value='"+code+"' ";
				for (var j=0; j<languages.length;j++){
					option += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				if (code!="" && self_value==code) {
					selected_value = code;
					option += " selected ";
				}
				option += ">";
//				if (code.indexOf("@")==-1)
//					option+= code + " ";
				option += $(srce+"[lang='"+languages[langcode]+"']",resource).text()+"</option>";
			}
			$(obj).append($(option));
		}
		$(obj).addClass(selected_value);
		$(obj).change(function (ev){
			$(this).attr('class', '').addClass($(this).children(':selected').val());
			UIFactory["Get_Resource"].update(obj,self,langcode);
		});
		$("#"+destid).append(obj);
	}
	if (type.indexOf('radio')>-1) {
		var nodes = $("node",data);
		var first = true;
		for ( var i = 0; i < $(nodes).length; i++) {
			var input = "";
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			if (!first && type!='radio-inline')
				input += '<br>';
			first = false;
			input += "<input type='radio' name='radio_"+self.id+"' code='"+$(nodes[i]).attr('id')+"' value='"+code+"' ";
			if (disabled)
				input +="disabled='disabled' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			if (code!="" && self_value==code)
				input += " checked ";
			input += "> "+$(srce+"[lang='"+languages[langcode]+"']",resource).text()+" </input>";
			var obj = $(input);
			$(obj).click(function (){
				UIFactory["Get_Resource"].update(obj,self,langcode,type);
			});
			$("#"+destid).append(obj);
		}
	}
};

//==================================
UIFactory["Get_Resource"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Get_Resource"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
