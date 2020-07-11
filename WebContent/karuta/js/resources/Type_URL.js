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
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='URL']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='URL']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='URL']",node));
	//--------------------
	this.label_node = [];
	for (var i=0; i<languages.length;i++){
		this.label_node[i] = $("label[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL']",node));
		if (this.label_node[i].length==0) {
			if (i==0 && $("label",$("asmResource[xsi_type='URL']",node)).length==1) { // for WAD6 imported portfolio
				this.label_node[i] = $("text",$("asmResource[xsi_type='URL']",node));
			} else {
				var newelement = createXmlElement("label");
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
				var newelement = createXmlElement("url");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='URL']",node)[0].appendChild(newelement);
				this.url_node[i] = $("url[lang='"+languages[i]+"']",$("asmResource[xsi_type='URL']",node));
			}
		}
	}
	//--------------------
	if ($("version",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("version");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.version_node = $("version",$("asmResource[xsi_type='"+this.type+"']",node));
	//----------------------------
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual && this.version_node.text()!="3.0") {  // for backward compatibility - if multilingual we set all languages
		this.version_node.text("3.0");
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(this.label_node[langcode]).text($(this.label_node[0]).text());
			$(this.url_node[langcode]).text($(this.url_node[0]).text());
		}
		this.save();
	}
	//----------------------------
	this.display = {};
};

//==================================
UIFactory["URL"].prototype.getAttributes = function(type,langcode)
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
		result['label'] = this.label_node[langcode].text();
		result['url'] = this.url_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["URL"].prototype.getView = function(dest,type,langcode)
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
		this.display[dest] = {langcode: langcode, type : type};
	}
	//---------------------
	if (type==null)
		type = "standard";
	var html = "";
	//---------------------
	var url = $(this.url_node[langcode]).text();
	if (url!="" && url.indexOf("http")<0)
		url = "http://"+url;
	var label = $(this.label_node[langcode]).text();
	if (label=="")
		label = url;
	if(type=='url') {
		if (url!="")
			html = "<a href='"+url+"' target='_blank'> "+label+"</a>";
		else
			html =  " "+karutaStr[LANG]['no-URL'];
	}
if(type=='standard') {
		if (url!="")
			html = "<a href='"+url+"' target='_blank'><img src='../../karuta/img/link-icon.png' style='width:25px'> "+label+"</a>";
		else
			html =  "<img src='../../karuta/img/link-icon.png' style='width:25px'> "+karutaStr[LANG]['no-URL'];
	}
	if (type=='free-positioning'){
		if (url!="")
			html = "<a href='"+url+"'><div class='url-up'><p style='text-align:center;'>"+label+"</p></div><div class='url-bottom'><span>URL</span></div></a>";
		else
			html = "<div class='url-up'><p style='text-align:center;'>"+karutaStr[LANG]['no-URL']+"</p></div><div class='url-bottom'><span>URL</span></div>";
	}
	if (type=='icon-url-label'){
		if (url!="")
			html = "<a href='"+url+"' target='_blank'><img src='../../karuta/img/link-icon.png' style='width:25px'> "+label+urlIcon["web"]+"</a>";
		else
			html =  "<img src='../../karuta/img/link-icon.png' style='width:25px'><p style='text-align:center;'>"+karutaStr[LANG]['no-URL']+"</p>";
	}
	if (type=='icon-url'){
		if (url!="")
			html = "<a href='"+url+"' target='_blank'><img src='../../karuta/img/link-icon.png' style='width:25px'> "+urlIcon["web"]+"</a>";
		else
			html =  "<img src='../../karuta/img/link-icon.png' style='width:25px'>"+karutaStr[LANG]['no-URL'];
	}
	if (type=='icon'){
		html = urlIcon["web"];
	}
	return html;
};

//==================================
UIFactory["URL"].prototype.displayView = function(dest,type,langcode)
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
		this.display[dest] = {langcode: langcode, type : type};
	}
	//---------------------
	if (type==null)
		type = "standard";
	var html = "";
	//---------------------
	var url = $(this.url_node[langcode]).text();
	if (url!="" && url.indexOf("http")<0)
		url = "http://"+url;
	var label = $(this.label_node[langcode]).text();
	if (label=="")
		label = url;
	if(type=='url') {
		if (url!="")
			html = "<a href='"+url+"' target='_blank'> "+label+"</a>";
		else
			html =  " "+karutaStr[LANG]['no-URL'];
	}
	if(type=='standard') {
		if (url!="")
			html = "<a href='"+url+"' target='_blank'><img src='../../karuta/img/link-icon.png' style='width:25px'> "+label+"</a>";
		else
			html =  "<img src='../../karuta/img/link-icon.png' style='width:25px'> "+karutaStr[LANG]['no-URL'];
	}
	if (type=='icon-url-label'){
		if (url!="")
			html = "<a href='"+url+"' target='_blank'><img src='../../karuta/img/link-icon.png' style='width:25px'> "+label+urlIcon["web"]+"</a>";
		else
			html =  "<img src='../../karuta/img/link-icon.png' style='width:25px'><p style='text-align:center;'>"+karutaStr[LANG]['no-URL']+"</p>";
	}
	if (type=='icon-url'){
		if (url!="")
			html = "<a href='"+url+"' target='_blank'><img src='../../karuta/img/link-icon.png' style='width:25px'> "+urlIcon["web"]+"</a>";
		else
			html =  "<img src='../../karuta/img/link-icon.png' style='width:25px'>"+karutaStr[LANG]['no-URL'];
	}
	if (type=='icon'){
		html = urlIcon["web"];
	}
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["URL"].update = function(obj,itself,type,langcode,parent)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var label = $("input[name='label']",obj).val();
	var url = $("input[name='url']",obj).val();
	if (url!="" && url.indexOf("http")<0)
		url = "http://"+url;
	if(type!=null && type=='same')
		label = url;
	//---------------------
	itself.multilingual = ($("metadata",itself.node).attr('multilingual-resource')=='Y') ? true : false;
	if (itself.multilingual!=undefined && !itself.multilingual) {
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(itself.label_node[langcode]).text(label);
			$(itself.url_node[langcode]).text(url);
		}
	} else {
		$(itself.label_node[langcode]).text(label);
		$(itself.url_node[langcode]).text(url);
	}
	//---------------------
	itself.save(parent);
};

//==================================
UIFactory["URL"].prototype.getEditor = function(type,langcode,disabled,parent)
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
			UIFactory["URL"].update(obj,self,type,langcode,parent);
		});
		$(obj).append(input_url);
	}
	if(type=='same-control-group') {
		//------------------------
		obj = $("<div class='control-group'><label class='control-label'> URL (http://)</label></div>");
		var input_url = $("<div class='controls'><input type='text' name='url' value=\""+$(this.url_node[langcode]).text()+"\"></div>");
		$(input_url).change(function (){
			UIFactory["URL"].update(obj,self,type,langcode,parent);
		});
		$(obj).append(input_url);
	}
	if(type=='inline') {
		$(obj).append($("<span> "+karutaStr[LANG]['label']+" : </span>"));
		var input_label = $("<input class='form-control' type='text' name='label'  value='"+$(this.label_node[langcode]).text()+"'>");
		$(input_label).change(function (){
			UIFactory["URL"].update(obj,self,type,langcode,parent);
		});
		$(obj).append(input_label);
		//------------------------
		$(obj).append($("<span> URL (http://) : </span>"));
		var input_url = $("<input class='form-control' type='text' name='url' value='"+$(this.url_node[langcode]).text()+"'>");
		$(input_url).change(function (){
			UIFactory["URL"].update(obj,self,type,langcode,parent);
		});
		$(obj).append(input_url);
	}
	if(type=='inline-same') {
		$(obj).append($("<span> URL (http://) : </span>"));
		var input_url = $("<input type='text' name='url' value='"+$(this.url_node[langcode]).text()+"'>");
		$(input_url).change(function (){
			UIFactory["URL"].update(obj,self,type,langcode,parent);
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
			UIFactory["URL"].update(obj,self,type,langcode,parent);
		});
		$(obj).append(input_url);
	}
	if(type=='default') {
		var htmlFormObj = $("<form class='form-horizontal'></form>");
		$(obj).append($(htmlFormObj));
		//------------------------
		var htmlLabelGroupObj = $("<div class='form-group'></div>")
		var htmlLabelLabelObj = $("<label for='label_"+this.id+"' class='col-sm-3 control-label'> URL "+karutaStr[LANG]['label']+"</label>");
		var htmlLabelDivObj = $("<div class='col-sm-9'></div>");
		var htmlLabelInputObj = $("<input id='label_"+this.id+"' type='text' class='form-control' name='label' value=\""+$(this.label_node[langcode]).text()+"\">");
		$(htmlLabelInputObj).change(function (){
			UIFactory["URL"].update(obj,self,type,langcode,parent);
		});
		$(htmlLabelDivObj).append($(htmlLabelInputObj));
		$(htmlLabelGroupObj).append($(htmlLabelLabelObj));
		$(htmlLabelGroupObj).append($(htmlLabelDivObj));
		$(htmlFormObj).append($(htmlLabelGroupObj));
		//------------------------
		var htmlUrlGroupObj = $("<div class='form-group'></div>")
		var htmlUrlLabelObj = $("<label for='url_"+this.id+"' class='col-sm-3 control-label'>URL</label>");
		var htmlUrlDivObj = $("<div class='col-sm-9'></div>");
		var htmlUrlInputObj = $("<input id='url_"+this.id+"' type='text' class='form-control' name='url' value=\""+$(this.url_node[langcode]).text()+"\">");
		$(htmlUrlInputObj).change(function (){
			UIFactory["URL"].update(obj,self,type,langcode,parent);
		});
		$(htmlUrlDivObj).append($(htmlUrlInputObj));
		$(htmlUrlGroupObj).append($(htmlUrlLabelObj));
		$(htmlUrlGroupObj).append($(htmlUrlDivObj));
		$(htmlFormObj).append($(htmlUrlGroupObj));
	}
	return obj;
};

//==================================
UIFactory["URL"].prototype.save = function(parent)
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
	if (parent!=null) // --- structured resource
		parent.refresh();
};

//==================================
UIFactory["URL"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,this.display[dest].type,this.display[dest].langcode));
	};

};
