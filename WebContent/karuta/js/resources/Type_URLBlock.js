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
 
//==================================
UIFactory["URLBlock"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'URLBlock';
	//--------------------
	this.url_nodeid = $("asmContext:has(metadata[semantictag='URL'])",node).attr('id');
	//--------------------
	this.image_nodeid = $("asmContext:has(metadata[semantictag='image'])",node).attr('id');
	//--------------------
	this.cover_nodeid = $("asmContext:has(metadata[semantictag='cover'])",node).attr('id');
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.display = {};
};


/// Display
//==================================
UIFactory["URLBlock"].prototype.getView = function(dest,type,langcode)
//==================================
{
	var url_element = UICom.structure["ui"][this.url_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	var cover = UICom.structure["ui"][this.cover_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = {langcode: langcode, type : type};
	}
	//---------------------
	if (type==null)
		type = "standard";
	//---------------------
	var html = "";
	if (type=='standard'){
		//---------------------
		var img_langcode = langcode;
		if (!image.multilingual)
			img_langcode = NONMULTILANGCODE;
		//---------------------
		var url_langcode = langcode;
		if (!url_element.multilingual)
			url_langcode = NONMULTILANGCODE;
		//---------------------
		var url = $(url_element.resource.url_node[url_langcode]).text();
		if (url!="" && url.indexOf("http")<0)
			url = "http://"+url;
		var label = $(url_element.resource.label_node[url_langcode]).text();
		if (label=="")
			label = url;

		if (url!="") {
			html =  "<a style='text-decoration:none;color:inherit' id='url_"+url_element.id+"' href='"+url+"' target='_blank'>";
			var style = "background-image:url('../../../"+serverBCK+"/resources/resource/file/"+image.id+"?lang="+languages[img_langcode]+"&timestamp=" + new Date().getTime()+"');";
			if (cover!=undefined && cover.resource.getValue()=='1')
				style += "background-size:cover;";
			html += "<div class='URLBlock' style=\""+style+"\">";

			if (UICom.structure["ui"][this.id].getLabel(null,'none')!='URLBlock' && UICom.structure["ui"][this.id].getLabel(null,'none')!='')
				html += "<div id='label_"+this.id+"' class='docblock-title'>"+UICom.structure["ui"][this.id].getLabel('label_'+this.id,'none')+"</div>";
			else
				html += "<div class='docblock-title'>"+label+"</div>";
			html += "</div>";
			html += "</a>";
		} else {
			html =  "<div class='URLBlock no-document'>";
			html += "<div class='docblock-title'>"+karutaStr[LANG]['no-URL']+"</div>";
			html += "</div>";
		}
	}
	return html;
};


//==================================
UIFactory["URLBlock"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	var url_element = UICom.structure["ui"][this.url_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	var cover = UICom.structure["ui"][this.cover_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	$("#"+destid).append($("<h4>URL</h4>"));
	$("#"+destid).append($(url_element.resource.getEditor(null,null,null,this)));
	//---------------------
	$("#"+destid).append($("<h4>Image</h4>"));
	$("#"+destid).append($("<div>"+karutaStr[LANG]['block-image-size']+"</div>"));
	image.resource.displayEditor(destid,type,langcode,this);
	//---------------------
	if (cover!=undefined) {
		$("#"+destid).append($("<h4>Coverage</h4>"));
		cover.resource.displayEditor(destid,type,langcode,this);
	}
}




//==================================
UIFactory["URLBlock"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,this.display[dest].type,this.display[dest].langcode));
	};

};
