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

var g_URL2Unit_caches = {};

/// Define our type
//==================================
UIFactory["URL2Unit"] = function(node,condition)
//==================================
{
	if (condition!=null)
		clause = condition;
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'URL2Unit';
	this.uuid_node = $("uuid",$("asmResource[xsi_type='URL2Unit']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Unit']",node));
		if (this.label_node[i].length==0) {
			var newelement = createXmlElement("label");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='URL2Unit']",node)[0].appendChild(newelement);
			this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Unit']",node));
		}
	}
	this.local_label_node = [];
	for (var i=0; i<languages.length;i++){
		this.local_label_node[i] = $("local-label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Unit']",node));
		if (this.local_label_node[i].length==0) {
			var newelement = createXmlElement("local-label");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='URL2Unit']",node)[0].appendChild(newelement);
			this.local_label_node[i] = $("local-label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL2Unit']",node));
		}
	}
	this.query = ($("metadata-wad",node).attr('query')==undefined)?'':$("metadata-wad",node).attr('query');
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

/// Display
//==================================
UIFactory["URL2Unit"].prototype.getView = function(dest,type,langcode)
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
	var local_label = this.local_label_node[langcode].text();
	if (local_label!="")
		label = local_label;
	if (this.encrypted)
		label = decrypt(label.substring(3),g_rc4key);
	if (label=='')
		label = "---";
	var html ="";
	if (this.query.indexOf('self.')>-1)
		html = "<a href='#' class='URL2Unit-link' onclick=\"javascript:displayPage('"+this.uuid_node.text()+"',100,'standard','0',true)\">"+label+"</a>";
	else
		html = "<a href='page.htm?id="+this.uuid_node.text()+"&type=standard&lang="+LANG+"' class='URL2Unit-link' target='_blank'>"+label+"</a>";
	return html;
};


/// Editor
//==================================
UIFactory["URL2Unit"].update = function(select,itself,langcode,type)
//==================================
{
	if (type==undefined || type==null)
		type = 'select';
	
	if (type=='select') {
		var option = $(select).find("option:selected");
		var uuid = $(option).attr('code');
		if (itself.encrypted)
			uuid = "rc4"+encrypt(uuid,g_rc4key);
		$(itself.uuid_node).text(uuid);
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
		var uuid = $(checked).attr('uuid');
		if (itself.encrypted)
			uuid = "rc4"+encrypt(uuid,g_rc4key);
		$(itself.uuid_node).text(uuid);
		for (var i=0; i<languages.length;i++){
			var label = $(checked).attr('label_'+languages[i]);
			//---------------------
			if (itself.encrypted)
				label = "rc4"+encrypt(label,g_rc4key);
			//---------------------
			$(itself.label_node[i]).text(label);
		}
	}
	var local_label = $('input[name=local-label]').val();
	if ($(itself.label_node[langcode]).text()=='') {
		local_label ='';
		$('input[name=local-label]').val('');
	}
	$(itself.local_label_node[langcode]).text(local_label);

	itself.save();
};

//==================================
UIFactory["URL2Unit"].prototype.displayEditor = function(destid,type,langcode,disabled,cachable)
//==================================
{
	if (cachable==undefined || cachable==null)
		cachable = false;
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
		if (cachable && g_URL2Unit_caches[queryattr_value]!=undefined && g_URL2Unit_caches[queryattr_value]!="")
			UIFactory["URL2Unit"].parse(destid,type,langcode,g_URL2Unit_caches[queryattr_value],self,disabled,srce);
		else
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
				success : function(data) {
					if (cachable)
						g_URL2Unit_caches[queryattr_value] = data;
					UIFactory["URL2Unit"].parse(destid,type,langcode,data,self,disabled,srce);
				}
			});
	}
};


//==================================
UIFactory["URL2Unit"].parse = function(destid,type,langcode,data,self,disabled,srce) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	//---------------------
	var self_uuid = $(self.uuid_node).text();
	if (self.encrypted)
		self_uuid = decrypt(self_uuid.substring(3),g_rc4key);
	//---------------------
	var local_label = self.local_label_node[langcode].text();
	if (self.encrypted)
		local_label = decrypt(local_label.substring(3),g_rc4key);
	var input_local_label = $("<input type='text' name='local-label' value=\""+local_label+"\">");
	$(input_local_label).change(function (ev){
		UIFactory["URL2Unit"].update(input_local_label,self,langcode);
	});
	
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
			var code = $(nodes[i]).attr('id');
			if (code.indexOf('-#')>-1) {
				option = "<optgroup label=\"" + $(srce+"[lang='"+languages[langcode]+"']",resource).text() + "\" >";
			} else {
				option = "<option code='"+$(nodes[i]).attr('id')+"' value='"+code+"' ";
				for (var j=0; j<languages.length;j++){
					option += "label_"+languages[j]+"=\""+$(srce+"[lang='"+languages[j]+"']",resource).text()+"\" ";
				}
				if (code!="" && self_uuid==code) {
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
			UIFactory["URL2Unit"].update(obj,self,langcode);
		});
		//-------------------------
		$("#"+destid).append(obj);
		$("#"+destid).append($("<label>"+karutaStr[LANG]['alternative-label']+"</label>"));
		$("#"+destid).append(input_local_label);
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
				UIFactory["URL2Unit"].update(obj,self,langcode,type);
			});
			//-------------------------
			$(obj).append($(input_local_label));
			$(input_local_label).change(function (ev){
				UIFactory["URL2Unit"].update(obj,self,langcode);
			});
			//-------------------------
			$("#"+destid).append(obj);
		}
	}
};

//==================================
UIFactory["URL2Unit"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["URL2Unit"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
