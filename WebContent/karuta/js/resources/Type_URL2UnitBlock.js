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
UIFactory["URL2UnitBlock"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'URL2UnitBlock';
	//--------------------
	this.url2unit_node = $("asmContext:has(metadata[semantictag='url2block-url2unit'])",node);
	this.url2unit_nodeid = this.url2unit_node.attr('id');
	this.url2unit_editresroles = ($(this.url2unit_node[0].querySelector("metadata-wad")).attr('editresroles')==undefined)?'':$(this.url2unit_node[0].querySelector("metadata-wad")).attr('editresroles');
	this.query = ($("metadata-wad",node).attr('query')==undefined)?'':$("metadata-wad",node).attr('query');
	//--------------------
	this.image_node = $("asmContext:has(metadata[semantictag='url2block-image'])",node);
	this.image_nodeid = this.image_node.attr('id');
	this.image_editresroles = ($(this.image_node[0].querySelector("metadata-wad")).attr('editresroles')==undefined)?'':$(this.image_node[0].querySelector("metadata-wad")).attr('editresroles');
	//--------------------
	this.cover_node = $("asmContext:has(metadata[semantictag='url2block-cover'])",node);
	this.cover_nodeid = this.cover_node.attr('id');
	this.cover_editresroles = ($(this.cover_node[0].querySelector("metadata-wad")).attr('editresroles')==undefined)?'':$(this.cover_node[0].querySelector("metadata-wad")).attr('editresroles');
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.display = {};
};


/// Display
//==================================
UIFactory["URL2UnitBlock"].prototype.getView = function(dest,type,langcode)
//==================================
{
	var url2unit = UICom.structure["ui"][this.url2unit_nodeid];
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
		var doc_langcode = langcode;
		if (!document.multilingual)
			doc_langcode = NONMULTILANGCODE;
		//---------------------
		var label = url2unit.resource.label_node[langcode].text();
		var local_label = url2unit.resource.local_label_node[langcode].text();
		if (local_label!="")
			label = local_label;
		if (label=='')
			label = "---";
		var image_size = "";
		if ($(image.resource.width_node[langcode]).text()!=undefined && $(image.resource.width_node[langcode]).text()!='')
			image_size = "width:"+$(image.resource.width_node[langcode]).text()+"; "; 
		if ($(image.resource.height_node[langcode]).text()!=undefined && $(image.resource.height_node[langcode]).text()!='')
			image_size += "height:"+$(image.resource.height_node[langcode]).text()+"; "; 
		if (url2unit.resource.uuid_node.text()!="") {
			if (this.query.indexOf('self.')>-1)
			html = "<a  class='URL2Unit-link' onclick=\"javascript:$('#sidebar_"+url2unit.resource.uuid_node.text()+"').click()\">";
			else
				html = "<a href='page.htm?i="+url2unit.resource.uuid_node.text()+"&type=standard&lang="+LANG+"' class='URL2Unit-link' target='_blank'>";
			var style = "background-image:url('../../../"+serverBCK+"/resources/resource/file/"+image.id+"?lang="+languages[img_langcode]+"&timestamp=" + new Date().getTime()+"'); " +image_size;
			if (cover!=undefined && cover.resource.getValue()=='1')
				style += "background-size:cover;";
			html += "<div class='Url2Block' style=\""+style+"\">";
			style = UICom.structure["ui"][this.id].getLabelStyle(uuid);
			html += "<div class='block-title' style=\""+style+"\">"+label+"</div>";
			html += "</div>";
			html += "</a>";
		} else {
			html =  "<div class='Url2Block no-document' style=\""+image_size+"\">";
			var style = UICom.structure["ui"][this.id].getLabelStyle(uuid);
			html += "<div class='block-title' style=\""+style+"\">"+karutaStr[LANG]['no-URL2Unit']+"</div>";
			html += "</div>";
		}
	}
	return html;
};

//==================================
UIFactory["URL2UnitBlock"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
	$("#std_node_"+this.id).attr('style','visibilty:hidden');
	$("#menus-"+this.id).hide();
};

//==================================
UIFactory["URL2UnitBlock"].prototype.getButtons = function(dest,type,langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var html = "";
	if (this.url2unit_editresroles.containsArrayElt(g_userroles) || this.image_editresroles.containsArrayElt(g_userroles)){
		html += "<span data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+this.id+"')\"><span class='button fas fa-pencil-alt' data-toggle='tooltip' data-title='"+karutaStr[LANG]["button-edit"]+"' data-placement='bottom'></span></span>";
	}
	if (html!="")
		html = "<div class='buttons-menus' id='btn-spec-"+this.id+"'>" + html + "</div><!-- #btn-+node.id -->";
	return html;
};

//==================================
UIFactory["URL2UnitBlock"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	var url2unit = UICom.structure["ui"][this.url2unit_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	var cover = UICom.structure["ui"][this.cover_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (this.url2unit_editresroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer'){
		$("#"+destid).append($("<h4>URL2Unit</h4>"));
		url2unit.resource.query = this.query;
		url2unit.resource.displayEditor(destid,type,langcode,this);
	}
	//---------------------
	if (this.image_editresroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer'){
		$("#"+destid).append($("<h4>Image</h4>"));
		$("#"+destid).append($("<div>"+karutaStr[LANG]['block-image-size']+"</div>"));
		image.resource.displayEditor(destid,type,langcode,this);
	}
	//---------------------
	if (cover!=undefined && this.cover_editresroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer'){
		$("#"+destid).append($("<h4>Coverage</h4>"));
		cover.resource.displayEditor(destid,type,langcode,this);
	}
}

//==================================
UIFactory["URL2UnitBlock"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,this.display[dest].type,this.display[dest].langcode));
	};

};
