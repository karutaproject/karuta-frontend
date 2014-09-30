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
var urlIcon = {};
urlIcon['web'] = "<img src='../../karuta/img/Web_HTML_Icon_16.png'/>";


/// Define our type
//==================================
UIFactory["URL"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'URL';
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL']",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource[xsi_type='URL']",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource[xsi_type='URL']",node));
			} else {
				var newelement = document.createElement("label");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='URL']",node)[0].appendChild(newelement);
				this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL']",node));
			}
		}
	}
	this.url_node = [];
	for (var i=0; i<languages.length;i++){
		this.url_node[i] = $("url[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL']",node));
		if (this.url_node[i].length==0) {
			if (i==0 && $("url",$("asmResource[xsi_type='URL']",node)).length==1) { // for WAD6 imported portfolio
				this.url_node[i] = $("text",$("asmResource[xsi_type='URL']",node));
			} else {
				var newelement = document.createElement("url");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='URL']",node)[0].appendChild(newelement);
				this.url_node[i] = $("url[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL']",node));
			}
		}
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

/// Display
//==================================
UIFactory["URL"].prototype.getView = function(dest,type,langcode)
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
	//---------------------
	if (type==null)
		type = "standard";
	var html = "";
	//---------------------
	if(type=='standard') {
		html = "<a href='"+$(this.url_node[langcode]).text()+"' target='_blank'>"+$(this.label_node[langcode]).text()+"</a>";
		if ($(this.label_node[langcode]).text()=='')
			type = 'same';
	}
	if(type=='same')
		html = "<a href='"+$(this.url_node[langcode]).text()+"' target='_blank'>"+$(this.url_node[langcode]).text()+"</a>";
	if (type=='icon-url-label'){
		html = "<a href='"+$(this.url_node[langcode]).text()+"' target='_blank'>"+$(this.url_node[langcode]).text()+urlIcon["web"]+"</a>";
	}
	if (type=='icon-url'){
		html = "<a href='"+$(this.url_node[langcode]).text()+"' target='_blank'>"+urlIcon["web"]+"</a>";
	}
	if (type=='icon'){
		html = urlIcon["web"];
	}

	return html;
};

/// Editor
//==================================
UIFactory["URL"].update = function(obj,itself,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!itself.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var label = $("input[name='label']",obj).val();
	var url = $("input[name='url']",obj).val();
	if(type!=null && type=='same')
		label = url;
	$(itself.label_node[langcode]).text(label);
	$(itself.url_node[langcode]).text(url);
	itself.save();
};

//==================================
UIFactory["URL"].prototype.getEditor = function(type,langcode,disabled)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (type==null)
		type = 'default';
	var self = this;
	var obj = $("<span class='url_editor'></span>");
	var html = "";
	//------------------------
	if(type=='same') {
		//------------------------
		$(obj).append($("<span> URL (http://)</span>"));
		var input_url = $("<input type='text' name='url' value=\""+$(this.url_node[langcode]).text()+"\">");
		$(input_url).change(function (){
			UIFactory["URL"].update(obj,self,type);
		});
		$(obj).append(input_url);
	}
	if(type=='same-control-group') {
		//------------------------
		obj = $("<div class='control-group'><label class='control-label'> URL (http://)</label></div>");
		var input_url = $("<div class='controls'><input type='text' name='url' value=\""+$(this.url_node[langcode]).text()+"\"></div>");
		$(input_url).change(function (){
			UIFactory["URL"].update(obj,self,type);
		});
		$(obj).append(input_url);
	}
	if(type=='inline') {
		$(obj).append($("<span> "+karutaStr[LANG]['label']+" : </span>"));
		var input_label = $("<input type='text' name='label'  value='"+$(this.label_node[langcode]).text()+"'>");
		$(input_label).change(function (){
			UIFactory["URL"].update(obj,self,type);
		});
		$(obj).append(input_label);
		//------------------------
		$(obj).append($("<span> URL (http://) : </span>"));
		var input_url = $("<input type='text' name='url' value='"+$(this.url_node[langcode]).text()+"'>");
		$(input_url).change(function (){
			UIFactory["URL"].update(obj,self,type);
		});
		$(obj).append(input_url);
	}
	if(type=='inline-same') {
		$(obj).append($("<span> URL (http://) : </span>"));
		var input_url = $("<input type='text' name='url' value='"+$(this.url_node[langcode]).text()+"'>");
		$(input_url).change(function (){
			UIFactory["URL"].update(obj,self,type);
		});
		$(obj).append(input_url);
	}
	if(type=='inline-same-nolabel') {
		html += "<input type='text' name='url' value='"+$(this.url_node[langcode]).text()+"'";
		if (disabled)
			html += " disabled='disabled' ";
		html += ">";
		var input_url = $(html);
		$(input_url).change(function (){
			UIFactory["URL"].update(obj,self,type);
		});
		$(obj).append(input_url);
	}
	if(type=='default') {
		$(obj).append($("<label> "+karutaStr[LANG]['label']+"</label>"));
		var input_label = $("<input type='text' name='label'  value=\""+$(this.label_node[langcode]).text()+"\">");
		$(input_label).change(function (){
			UIFactory["URL"].update(obj,self,type);
		});
		$(obj).append(input_label);
		//------------------------
		$(obj).append($("<label> URL (http://)</label>"));
		var input_url = $("<input type='text' name='url' value=\""+$(this.url_node[langcode]).text()+"\">");
		$(input_url).change(function (){
			UIFactory["URL"].update(obj,self,type);
		});
		$(obj).append(input_url);
	}
	//------------------------
	return obj;
};

//==================================
UIFactory["URL"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["URL"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView());
	};

};
