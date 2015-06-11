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
				var newelement = createXmlElement("url");
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
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	//---------------------
	if (type==null)
		type = "standard";
	var html = "";
	//---------------------
	if(type=='standard') {
		if ($(this.url_node[langcode]).text()!='')
			html = "<a id='embed"+this.id+langcode+"' href='"+$(this.url_node[langcode]).text()+"' class='embed'></a>";
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
	//---------------------
	itself.multilingual = ($("metadata",itself.node).attr('multilingual-resource')=='Y') ? true : false;
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
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (type==null)
		type = 'default';
	var self = this;
	var obj = $("<span class='url_editor'></span>");
	var htmlFormObj = $("<form class='form-horizontal'></form>");
	$(obj).append($(htmlFormObj));
	//------------------------
	if(type=='default') {
		//------------------------
		var htmlUrlGroupObj = $("<div class='form-group'></div>")
		var htmlUrlLabelObj = $("<label for='url_"+this.id+"' class='col-sm-3 control-label'>URL</label>");
		var htmlUrlDivObj = $("<div class='col-sm-9'></div>");
		var htmlUrlInputObj = $("<input id='url_"+this.id+"' type='text' class='form-control' name='url' value=\""+$(this.url_node[langcode]).text()+"\">");
		$(htmlUrlInputObj).change(function (){
			UIFactory["Oembed"].update(obj,self,type,langcode);
		});
		$(htmlUrlDivObj).append($(htmlUrlInputObj));
		$(htmlUrlGroupObj).append($(htmlUrlLabelObj));
		$(htmlUrlGroupObj).append($(htmlUrlDivObj));
		$(htmlFormObj).append($(htmlUrlGroupObj));
	}
	//------------------------
	if (g_userrole=='designer' || USER.admin || editnoderoles.indexOf(g_userrole)>-1 || editnoderoles.indexOf(this.userrole)>-1)
		$(obj).append($("<hr/>"));
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
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
