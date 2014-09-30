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

/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["Proxy"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Proxy';
	this.code_node = $("code",$("asmResource[xsi_type='Proxy']",node));
	this.value_node = $("value",$("asmResource[xsi_type='Proxy']",node));
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Proxy']",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource[xsi_type='Proxy']",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource[xsi_type='Proxy']",node));
			} else {
				var newelement = document.createElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Proxy']",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='Proxy']",node));
			}
		}
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

/// Display
//==================================
UIFactory["Proxy"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest]=true;
	}
	return this.label_node[langcode].text();
};

//==================================
UIFactory["Proxy"].prototype.displayView = function(dest,type,lang)
//==================================
{
	if (dest!=null) {
		this.display[dest]=true;
	}
	if (lang==null)
		lang = LANG;
	$(dest).html(this.label_node[lang].text());
};


/// Editor
//==================================
UIFactory["Proxy"].update = function(select,itself,lang,type)
//==================================
{
	if (lang==null)
		lang = LANG;
	if (type==undefined || type==null)
		type = 'select';
	
	if (type=='select') {
		var option = $(select).find("option:selected");
		var value = $(option).attr('value');
		var code = $(option).attr('code');
		var label_fr = $(option).attr('label_fr');
		var label_en = $(option).attr('label_en');
		$(itself.value_node).text(value);
		$(itself.code_node).text(code);
		for (var i=0; i<languages.length;i++){
			var label = $(option).attr('label_'+languages[i]);
			$(itself.label_node[i]).text(label);
		}
	}
	if (type.indexOf('radio')>-1) {
		var name = 'radio_'+itself.id;
		var checked = $('input[name='+name+']').filter(':checked');
		var value = $(checked).attr('value');
		var code = $(checked).attr('code');
		var label_fr = $(checked).attr('label_fr');
		var label_en = $(checked).attr('label_en');
		$(itself.value_node).text(value);
		$(itself.code_node).text(code);
		for (var i=0; i<languages.length;i++){
			var label = $(checked).attr('label_'+languages[i]);
			$(itself.label_node[i]).text(label);
		}
	}
	itself.save();
	writeSaved(this.id);
};

//==================================
UIFactory["Proxy"].prototype.displayEditor = function(destid,type,lang)
//==================================
{
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (queryattr_value!=undefined && queryattr_value!='') {
		var p1 = queryattr_value.indexOf('.');
		var p2 = queryattr_value.indexOf('.',p1+1);
		var code = queryattr_value.substring(0,p1);
		if (code=='self')
			code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
		var semtag = queryattr_value.substring(p1+1,p2);
		var self = this;
		$.ajax({
			type : "GET",
			dataType : "xml",
			url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
			success : function(data) {
				UIFactory["Proxy"].parse(destid,type,lang,data,self);
			}
		});
	}
};

//==================================
UIFactory["Proxy"].parse = function(destid,type,langcode,data,self) {
//==================================
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!self.multilingual)
		langcode = NONMULTILANGCODE;
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
			var semtag = $("metadata",nodes[i]).attr('semantictag');
			if (semtag.indexOf("proxy-")<0){
				var option = null;
				var resource = null;
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
				var code = $(nodes[i]).attr('id');
					option = "<option code='"+$(nodes[i]).attr('id')+"' value='"+code+"' ";
					for (var j=0; j<languages.length;j++){
						option += "label_"+languages[j]+"=\""+$("label[lang='"+languages[j]+"']",resource).text()+"\" ";
					}
					if ($(self.code_node).text()==code && code!="")
						option += " selected ";
					option += ">"+$("label[lang='"+languages[langcode]+"']",resource).text()+"</option>";
				$(obj).append($(option));
			}
		}
		$(obj).change(function (){
			UIFactory["Proxy"].update(obj,self,langcode);
		});
		$("#"+destid).append(obj);
	}
	if (type.indexOf('radio')>-1) {
		var nodes = $("node",data);
		var first = true;
		for ( var i = 0; i < $(nodes).length; ++i) {
			var input = "";
			var resource = null;
			if ($("#asmResource",nodes[i]).length==3)
				resource = $("asmResource[xsi_type!='nodeRes'][xsi_type!='context']",nodes[i]); 
			else
				resource = $("asmResource[xsi_type='nodeRes']",nodes[i]);
			var code = $('code',resource).text();
			if (!first && type!='radio-inline')
				input += '<br>';
			first = false;
			input += "<input type='radio' name='radio_"+self.id+"' code='"+$(nodes[i]).attr('id')+"' value='"+code+"' " +
					"label_fr='"+$("label[lang='fr']",resource).text()+"' " +
					"label_en='"+$("label[lang='en']",resource).text()+"' ";
			if ($(self.code_node).text()==code)
				input += " checked ";
			input += "> "+$("label[lang='"+languages[langcode]+"']",resource).text()+" </input>";
			var obj = $(input);
			$(obj).click(function (){
				UIFactory["Proxy"].update(obj,self,langcode,type);
			});
			$("#"+destid).append(obj);
		}
	}
};

//==================================
UIFactory["Proxy"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Proxy"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView());
	};

};
