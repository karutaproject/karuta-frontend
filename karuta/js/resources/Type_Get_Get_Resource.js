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
UIFactory["Get_Get_Resource"].update = function(select_radio,itself,langcode,type)
//==================================
{
	var option = "";
	var value = "";
	var code = "";
	var portfoliocode = "";
	
	if (type==null)
		type = 'select';
	if (type=='select') {
		option = $(select_radio).find("option:selected");
		value = $(option).attr('value');
		code = $(option).attr('code');
		portfoliocode = $(option).attr('portfoliocode');
	}
	if (type=='radio') {
		option = $(select_radio).find("input:checked");
		value = $(option).attr('value');
		code = $(option).attr('code');
	}
	//---------------------
	if (itself.encrypted)
		value = "rc4"+encrypt(value,g_rc4key);
	if (itself.encrypted)
		code = "rc4"+encrypt(code,g_rc4key);
	//---------------------
	$(itself.value_node).text(value);
	$(itself.code_node).text(code);
	$(itself.portfoliocode_node).text(portfoliocode);
	for (var i=0; i<languages.length;i++){
		var label = $(option).attr('label_'+languages[i]);
		//---------------------
		if (itself.encrypted)
			label = "rc4"+encrypt(label,g_rc4key);
		//---------------------
		$(itself.label_node[i]).text(label);
	}
	itself.save();
};

//==================================
UIFactory["Get_Get_Resource"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (queryattr_value!=undefined && queryattr_value!='') {
		try {
			var portfoliocode = queryattr_value.substring(0,queryattr_value.indexOf('.'));
			if (portfoliocode=='self')
				portfoliocode = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
			var query = queryattr_value.substring(queryattr_value.indexOf('.')+1);
			var parent = null;
			var ref = null;
			// ------- Test si query commence par sibling.
			if (query.indexOf('sibling.')>-1) {
				ref = query.substring(8);
				parent = $(this.node).parent();
			}
			// ------- Test si query commence par parent.
			if (query.indexOf('parent.parent.parent.')>-1) {
				ref = query.substring(21);
				parent = $(this.node).parent().parent().parent().parent();
			} else	if (query.indexOf('parent.parent.')>-1) {
				ref = query.substring(14);
				parent = $(this.node).parent().parent().parent();
			} else if (query.indexOf('parent.')>-1) {
				ref = query.substring(7);
				parent = $(this.node).parent().parent();
			}
			if (query.indexOf('#')==0)
				ref = query.substring(1);
			
		//	alert('parentid'+$(parent).attr("id"));
			var p1 = ref.indexOf('.');
			var p2 = ref.indexOf('.',p1+1);
			var semtag_parent = ref.substring(0,p1);
			var semtag = ref.substring(p1+1,p2);
			var code_parent = "";
			if (query.indexOf('#')==0)
				code_parent = semtag_parent;
			else
				code_parent = $("value",$("asmContext:has(metadata[semantictag='"+semtag_parent+"'])",parent)[0]).text();
			//----------------------
			if ($("asmContext:has(metadata[semantictag='"+semtag_parent+"'][encrypted='Y'])",parent).length>0)
				code_parent = decrypt(code_parent.substring(3),g_rc4key);
			//----------------------
			var portfoliocode_parent = $("portfoliocode",$("asmContext:has(metadata[semantictag='"+semtag_parent+"'])",parent)).text();
	//		alert('portfoliocode:'+portfoliocode+'--semtag:'+semtag+'--semtag_parent:'+semtag_parent+'--code_parent:'+code_parent+'--portfoliocode_parent:'+portfoliocode_parent);
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
					UIFactory["Get_Get_Resource"].parse(destid,type,langcode,data,self);
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
UIFactory["Get_Get_Resource"].parse = function(destid,type,langcode,data,self) {
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
	if (type=='select') {
		var select = "<select>";
		select += "<option code='' value='' ";
		for (var j=0; j<languages.length;j++){
			select += "label_"+languages[j]+"='' ";
		}
		select += "></option></select>";
		var obj = $(select);
		var nodes = $("node",data);
		for ( var i = 0; i < $(nodes).length; ++i) {
			var option = null;
			var resource = null;
			if ($("asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			if (code.indexOf('-#')>-1) {
				option = "<optgroup label=\"" + $("label[lang='"+languages[langcode]+"']",resource).text() + "\" >";
			} else {
				option = "<option code='"+$(nodes[i]).attr('id')+"' value='"+code+"' ";
				for (var j=0; j<languages.length;j++){
					option += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				if (self_value==code)
					option += " selected ";
				option += ">"+$("label[lang='"+languages[langcode]+"']",resource).text()+"</option>";
			}
			$(obj).append($(option));
		}
		$(obj).change(function (){
			UIFactory["Get_Get_Resource"].update(obj,self,langcode);
		});
		$("#"+destid).append(obj);
	}
	if (type.indexOf('radio')>-1) {
		var inputs = "<div></div>";
		var obj = $(inputs);
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
			if (!first && type!='radio-inline')
				input += '<br>';
			first = false;
			input += "<input type='radio' name='radio_"+self.id+"' code='"+$(nodes[i]).attr('id')+"' value='"+code+"' ";
			for (var j=0; j<languages.length;j++){
				input += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
			}
			if (self_value==code)
				input += " checked ";
			input += "> "+$("label[lang='"+languages[langcode]+"']",resource).text()+" </input>";
			var input_obj = $(input);
			$(input_obj).click(function (){
				UIFactory["Get_Get_Resource"].update(obj,self,langcode,type);
			});
			$(obj).append(input_obj);
			$("#"+destid).append(obj);
		}
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
