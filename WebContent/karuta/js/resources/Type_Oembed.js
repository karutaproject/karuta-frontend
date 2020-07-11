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


/// Define our type
//==================================
UIFactory["Oembed"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Oembed';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Oembed']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Oembed']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Oembed']",node));
	//--------------------
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
	//--------------------
	if ($("version",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("version");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.version_node = $("version",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual && this.version_node.text()!="3.0") {  // for backward compatibility - if multilingual we set all languages
		this.version_node.text("3.0");
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(this.url_node[langcode]).text($(this.url_node[0]).text());
		}
		this.save();
	}
	//--------------------
	this.display = {};
};

//==================================
UIFactory["Oembed"].prototype.getAttributes = function(type,langcode)
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
		result['url'] = this.label_node[langcode].text();
	}
	return result;
}

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
	if(type=='standard' || type=='block') {
		var url = $(this.url_node[langcode]).text();
		if (url!='')
		{
			// Cleanup url
			// Youtube
			if( url.indexOf('youtube') != -1)
			{
				var vid = /v=([^&]*)&?/i;
				var v = url.match(vid);
				if (v!=null) {
					url = url.replace(vid, '');
					url = url.replace('/watch', '/embed/'+v[1]);
					url = url.replace('&feature=youtu.be','');
				}
			} else if (url.indexOf('youtu.be') != -1) {
				var youtube_code = url.substring(url.lastIndexOf('/')+1);
				url = "https://www.youtube.com/embed/" + youtube_code;
			}
			// Vimeo
			else if( url.indexOf('vimeo') != -1 )
			{
				if(url.indexOf('player') === -1 )
				{
					var urlsplit = url.split('/');
					url = 'https://player.vimeo.com/video/'+urlsplit[urlsplit.length-1];
				}
			}
			// Dailymotion
			else if(url.indexOf('dailymotion') != -1)
			{
				if( url.indexOf('http') !== -1 )
				{
					var split1 = url.split('/');
					var part = split1[split1.length-1];
					var split2 = part.split('_');
					url = '//www.dailymotion.com/embed/video/' + split2[0];
				}
			}
			// display div
			html = '<iframe style="width: 100%; height: 240px;" src='+url+'/>';
		}
	}
	return html;
};

//==================================
UIFactory["Oembed"].prototype.displayView = function(dest,type,langcode)
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
	if(type=='standard' || type=='block') {
		var url = $(this.url_node[langcode]).text();
		if (url!='')
		{
			// Cleanup url
			// Youtube
			if( url.indexOf('youtube') != -1)
			{
				var vid = /v=([^&]*)&?/i;
				var v = url.match(vid);
				if (v!=null) {
					url = url.replace(vid, '');
					url = url.replace('/watch', '/embed/'+v[1]);
					url = url.replace('&feature=youtu.be','');
				}
			} else if (url.indexOf('youtu.be') != -1) {
				var youtube_code = url.substring(url.lastIndexOf('/')+1);
				url = "https://www.youtube.com/embed/" + youtube_code;
			}
			// Vimeo
			else if( url.indexOf('vimeo') != -1 )
			{
				if(url.indexOf('player') === -1 )
				{
					var urlsplit = url.split('/');
					url = 'https://player.vimeo.com/video/'+urlsplit[urlsplit.length-1];
				}
			}
			// Dailymotion
			else if(url.indexOf('dailymotion') != -1)
			{
				if( url.indexOf('http') !== -1 )
				{
					var split1 = url.split('/');
					var part = split1[split1.length-1];
					var split2 = part.split('_');
					url = '//www.dailymotion.com/embed/video/' + split2[0];
				}
			}
			// display div
			html = '<iframe style="width: 100%; height: 240px;" src='+url+'/>';
		}
	}
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["Oembed"].update = function(obj,itself,type,langcode)
//==================================
{
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var url = $("input[name='url']",obj).val();
	//---------------------
	itself.multilingual = ($("metadata",itself.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!itself.multilingual)
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(itself.url_node[langcode]).text(url);
		}
	else
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
