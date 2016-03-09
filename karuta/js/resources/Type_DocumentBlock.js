/* =======================================================
	Copyright 2016 - ePortfolium - Licensed under the
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
UIFactory["DocumentBlock"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'DocumentBlock';
	//--------------------
	this.document_nodeid = $("asmContext:has(metadata[semantictag='document'])",node).attr('id');
	//--------------------
	this.image_nodeid = $("asmContext:has(metadata[semantictag='image'])",node).attr('id');
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};


/// Display
//==================================
UIFactory["DocumentBlock"].prototype.getView = function(dest,type,langcode)
//==================================
{
	var document = UICom.structure["ui"][this.document_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
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
		if ($(document.resource.filename_node[langcode]).text()!="") {
			html =  "<a style='text-decoration:none;color:inherit' id='file_"+document.id+"' href='../../../"+serverFIL+"/resources/resource/file/"+document.id+"?lang="+languages[langcode]+"'>";
			html += "<div class='DocumentBlock' style=\"background-image:url('../../../"+serverFIL+"/resources/resource/file/"+image.id+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"')\">";
			html += "<div class='docblock-title'>"+$(document.resource.filename_node[langcode]).text()+"</div>";
			html += "</div>";
			html += "</a>";
		} else {
			html =  "<div class='DocumentBlock no-document'>";
			html += "<div class='docblock-title'>"+karutaStr[LANG]['no-document']+"</div>";
			html += "</div>";
		}
	}
	return html;
};


//==================================
UIFactory["DocumentBlock"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	var document = UICom.structure["ui"][this.document_nodeid];
	var image = UICom.structure["ui"][this.image_nodeid];
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	$("#"+destid).append($("<h4>Document</h4>"));
	document.resource.displayEditor(destid,type,langcode);
	//---------------------
	$("#"+destid).append($("<h4>Image</h4>"));
	image.resource.displayEditor(destid,type,langcode);
}




//==================================
UIFactory["DocumentBlock"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,this.display[dest].type,this.display[dest].langcode));
	};

};
