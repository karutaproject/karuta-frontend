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
UIFactory["Oembed"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Oembed';
	this.url_node = [];
	for (var i=0; i<languages.length;i++){
		this.url_node[i] = $("url[lang='"+languages[i]+"']",$("asmResource[xsi_type='Oembed']",node));
		if (this.url_node[i].length==0) {
			if (i==0 && $("url",$("asmResource[xsi_type='Oembed']",node)).length==1) { // for WAD6 imported portfolio
				this.url_node[i] = $("text",$("asmResource[xsi_type='Oembed']",node));
			} else {
				var newelement = document.createElement("url");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='Oembed']",node)[0].appendChild(newelement);
				this.url_node[i] = $("url[lang='"+languages[i]+"']",$("asmResource[xsi_type='Oembed']",node));
			}
		}
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

/// Display
//==================================
UIFactory["Oembed"].prototype.getView = function(dest,type,langcode)
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
		html = "<a href='"+$(this.url_node[langcode]).text()+"' class='embed'></a>";
	}

	return html;
};

/// Editor
//==================================
UIFactory["Oembed"].update = function(obj,itself,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!itself.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var url = $("input[name='url']",obj).val();
	$(itself.url_node[langcode]).text(url);
	itself.save();
};

//==================================
UIFactory["Oembed"].prototype.getEditor = function(type,langcode)
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
	//------------------------
	if(type=='default') {
		$(obj).append($("<label> URL (http://)</label>"));
		var input_url = $("<input type='text' name='url' value=\""+$(this.url_node[langcode]).text()+"\">");
		$(input_url).change(function (){
			UIFactory["Oembed"].update(obj,self,type);
		});
		$(obj).append(input_url);
	}
	//------------------------
	return obj;
};

//==================================
UIFactory["Oembed"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
	$("a.embed").oembed();
};

//==================================
UIFactory["Oembed"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView());
	};

};
