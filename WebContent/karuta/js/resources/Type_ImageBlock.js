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
UIFactory["ImageBlock"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'ImageBlock';
	//--------------------
	this.image_node = $("asmContext:has(metadata[semantictag='imgblock-image'])",node);
	if (this.image_node.length==0)
		this.image_node = $("asmContext:has(metadata[semantictag='image'])",node);		
	this.image_nodeid = this.image_node.attr('id');
	this.image_editresroles = ($(this.image_node[0].querySelector("metadata-wad")).attr('editresroles')==undefined)?'':$(this.image_node[0].querySelector("metadata-wad")).attr('editresroles');
	//--------------------
	this.cover_node = $("asmContext:has(metadata[semantictag='imgblock-cover'])",node);
	if (this.cover_node.length==0)
		this.cover_node = $("asmContext:has(metadata[semantictag='cover'])",node);		
	this.cover_nodeid = this.cover_node.attr('id');
	this.cover_editresroles = ($(this.cover_node[0].querySelector("metadata-wad")).attr('editresroles')==undefined)?'':$(this.cover_node[0].querySelector("metadata-wad")).attr('editresroles');
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-node')=='Y') ? true : false;
	this.display = {};
};


/// Display
//==================================
UIFactory["ImageBlock"].prototype.getView = function(dest,type,langcode)
//==================================
{
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
		//----------------------------------------
		var img_width = ($(image.resource.width_node[langcode]).text()!=undefined && $(image.resource.width_node[langcode]).text()!='') ? $(image.resource.width_node[langcode]).text() : "";
		var img_height = ($(image.resource.height_node[langcode]).text()!=undefined && $(image.resource.height_node[langcode]).text()!='') ? $(image.resource.height_node[langcode]).text() : "";
		if (img_width!="" && img_width.indexOf('px')<0)
			img_width += "px";
		if (img_height!="" && img_height.indexOf('px')<0)
			img_height += "px";
		var image_size = "";
		if (img_width!="")
			image_size += " width:"+img_width + ";";
		if (img_height!="")
			image_size += " height:" + img_height + ";";
		//----------------------------------------
		var style = "background-image:url('../../../"+serverBCK+"/resources/resource/file/"+image.id+"?lang="+languages[img_langcode]+"&timestamp=" + new Date().getTime()+"'); " +image_size;
		if (cover!=undefined && cover.resource.getValue()=='1')
			style += "background-size:cover;";
		html += "<div id='image_"+this.id+"' class='ImgBlock' style=\""+style+"\">";
		style = UICom.structure["ui"][this.id].getLabelStyle(this.id);
		if (UICom.structure["ui"][this.id].getLabel(null,'none').indexOf('ImageBlock')<0 && UICom.structure["ui"][this.id].getLabel(null,'none')!='')
			html += "<div id='label_"+this.id+"' class='block-title' style=\""+style+"\">"+UICom.structure["ui"][this.id].getLabel('label_'+this.id,'none')+"</div>";
		html += "</div>";
	}
	return html;
};

//==================================
UIFactory["ImageBlock"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
	$("#std_node_"+this.id).attr('style','display:none');
	$("#menus-"+this.id).hide();
};

//==================================
UIFactory["ImageBlock"].prototype.getButtons = function(dest,type,langcode)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var html = "";
	if (this.image_editresroles.containsArrayElt(g_userroles) || this.image_editresroles.containsArrayElt(g_userroles)){
		html += "<span data-toggle='modal' data-target='#edit-window' onclick=\"javascript:getEditBox('"+this.id+"')\"><span class='button fas fa-pencil-alt' data-toggle='tooltip' data-title='"+karutaStr[LANG]["button-edit"]+"' data-placement='bottom'></span></span>";
	}
	if (html!="")
		html = "<div class='buttons-menus' id='btn-spec-"+this.id+"'>" + html + "</div><!-- #btn-+node.id -->";
	return html;
};

/// EDITOR
//==================================
UIFactory["ImageBlock"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	var image = UICom.structure["ui"][this.image_nodeid];
	var cover = UICom.structure["ui"][this.cover_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (this.image_editresroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer'){
		$("#"+destid).append($("<h4>"+karutaStr[LANG]['Image']+"</h4>"));
		$("#"+destid).append($("<div>"+karutaStr[LANG]['block-image-size']+"</div>"));
		image.resource.displayEditor(destid,type,langcode,this);
	}
	//---------------------
	if (cover!=undefined && this.cover_editresroles.containsArrayElt(g_userroles) || USER.admin || g_userroles[0]=='designer'){
		$("#"+destid).append($("<h4>"+karutaStr[LANG]['coverage']+"</h4>"));
		cover.resource.displayEditor(destid,type,langcode,this);
	}
}




//==================================
UIFactory["ImageBlock"].prototype.refresh = function()
//==================================
{
		for (dest in this.display) {
			$("#"+dest).html(this.getView(null,this.display[dest].type,this.display[dest].langcode));
			$("#std_node_"+this.id).attr('style','visibilty:hidden');
			$("#menus-"+this.id).hide();
		};		
};
