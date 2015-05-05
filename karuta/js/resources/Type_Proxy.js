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
				var newelement = createXmlElement("label");
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
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	return this.label_node[langcode].text();
};

//==================================
UIFactory["Proxy"].prototype.displayView = function(dest,type,lang)
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
	$(dest).html(this.label_node[langcode].text());
};


/// Editor
//==================================
UIFactory["Proxy"].update = function(select,itself,lang,type,portfolio_label)
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
		$(itself.value_node).text(value);
		$(itself.code_node).text(code);
		var empty = true;
		for (var i=0; i<languages.length;i++){
			if($(option).attr('label_'+languages[i])!="")
				empty = false;
		}
		if (empty)
			portfolio_label = "";
		else
			portfolio_label += ".";
		for (var i=0; i<languages.length;i++){
			var label = portfolio_label+$(option).attr('label_'+languages[i]);
			$(itself.label_node[i]).text(label);
		}
	}
	if (type.indexOf('radio')>-1) {
		var name = 'radio_'+itself.id;
		var checked = $('input[name='+name+']').filter(':checked');
		var value = $(checked).attr('value');
		var code = $(checked).attr('code');
		$(itself.value_node).text(value);
		$(itself.code_node).text(code);
		for (var i=0; i<languages.length;i++){
			var label = portfolio_label+$(checked).attr('label_'+languages[i]);
			$(itself.label_node[i]).text(label);
		}
	}
	itself.save();
	writeSaved(this.id);
};

//==================================
UIFactory["Proxy"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	var queryattr_value = $("metadata-wad",this.node).attr('query');
	if (queryattr_value!=undefined && queryattr_value!='') {
		var p1 = queryattr_value.indexOf('.');
		var p2 = queryattr_value.indexOf('.',p1+1);
		var code = queryattr_value.substring(0,p1);
		var semtag = queryattr_value.substring(p1+1,p2);
		var self = this;
		if (code!='all') {
			if (code=='self')
				code = $("code",$("asmRoot>asmResource[xsi_type='nodeRes']",UICom.root.node)).text();
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
				success : function(data) {
					UIFactory["Proxy"].parse(destid,type,langcode,data,self,code);
				}
			});
		} else {  // code==all
			// retrieve active portfolios
			$.ajaxSetup({async: false});
			$.ajax({
				type : "GET",
				dataType : "xml",
				url : "../../../"+serverBCK+"/portfolios?active=1",
				success : function(data) {
					UIFactory["Portfolio"].parse(data);
					for ( var i = 0; i < portfolios_list.length; i++) {
						code = portfolios_list[i].code_node.text();
						label = portfolios_list[i].label_node[langcode].text();
						$.ajax({
							type : "GET",
							dataType : "xml",
							url : "../../../"+serverBCK+"/nodes?portfoliocode=" + code + "&semtag="+semtag,
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
									html += "<div class='portfolio-proxy'>"+label+"</div>";
									html += "<div id='"+code+"'></div>";
									$("#"+destid).append($(html));
									UIFactory["Proxy"].parse(code,type,langcode,data,self,label);
								}
							}
						});
					}
				},
				error : function(jqxhr,textStatus) {
					alert("Server Error UIFactory.Proxy.prototype.displayEditor: "+textStatus);
				}
			});
			$.ajaxSetup({async: true});
		}
	}
};

//==================================
UIFactory["Proxy"].parse = function(destid,type,langcode,data,self,portfolio_label) {
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
			UIFactory["Proxy"].update(obj,self,langcode,type,portfolio_label);
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
				UIFactory["Proxy"].update(obj,self,langcode,type,portfolio_label);
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
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
