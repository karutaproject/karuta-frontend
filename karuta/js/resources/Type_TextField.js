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
UIFactory["TextField"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'TextField';
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='TextField']",node));
		if (this.text_node[i].length==0) {
			if (i==0 && $("text",$("asmResource[xsi_type='TextField']",node)).length==1) { // for WAD6 imported portfolio
				this.text_node[i] = $("text",$("asmResource[xsi_type='TextField']",node));
			} else {
				var newelement = document.createElement("text");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='TextField']",node)[0].appendChild(newelement);
				this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='TextField']",node));
			}
		}
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

/// Display
//==================================
UIFactory["TextField"].prototype.getView = function(dest,type,langcode)
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
	var text = $(this.text_node[langcode]).text(); 
	return text;
};

/// Editor
//==================================
UIFactory["TextField"].prototype.update = function(langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var value = $.trim($("#"+this.id+"_edit").val());
	$(this.text_node[langcode]).text(value);//	$(this.text_node[langcode]).html($.parseHTML(value));
	this.save();
};

var editor =  [];
var currentTexfieldUuid = "";

//==================================
UIFactory["TextField"].prototype.displayEditor = function(destid,type,langcode,disabled)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	//---------------------
	if (type==null)
		type = 'default';
	var text = xml2string($(this.text_node[langcode])[0]);
	var uuid = this.id;
	var html = "";
/*	//------------------------------------------------
	html += "<div id='wysihtml5-toolbar-"+uuid+"' style='display: none;'>";
	html += "<a class='btn btn-mini' data-wysihtml5-command='bold'><i class='icon-bold'></i></a>";
	html += "<a class='btn btn-mini'data-wysihtml5-command='italic'><i class='icon-italic'></i></a>";
	html += "<a data-wysihtml5-command='insertOrderedList'><i class='icon-list-ul'></i></a>";
	html += "<a data-wysihtml5-command='insertUnorderedList'>insert unordered list</a>";
	html += "</div>";
*/	//------------------------------------------------
	if (type=='default') {
		html += "<div id='div_"+this.id+"'><textarea id='"+this.id+"_edit' style='height:200px' placeholder='"+karutaStr[LANG]['enter-text']+"' ";
		if (disabled)
			html += "disabled='disabled' ";
		html += ">"+text+"</textarea></div>";
	}
	else if(type.indexOf('x')>-1) {
//		var width = type.substring(0,type.indexOf('x'));
		var height = type.substring(type.indexOf('x')+1);
		html += "<div id='div_"+this.id+"'><textarea id='"+this.id+"_edit' style='height:"+height+"px' ";
		if (disabled)
			html += "disabled='disabled' ";
		html += ">"+text+"</textarea></div>";
	}
	$("#"+destid).append($(html));
/*	//-------------------------------
	editor[uuid] = new wysihtml5.Editor(this.id+"_edit", {
		toolbar: 'wysihtml5-toolbar-'+uuid,
		stylesheets: ["../../other/wysihtml5/reset-min.css", "../../other/wysihtml5/editor.css"],
		parserRules: wysihtml5ParserRules
	});
	editor[uuid].on("focus",function(){currentTexfieldUuid=uuid;});
	editor[uuid].on("change:textarea",function(){UICom.structure['ui'][currentTexfieldUuid].resource.update();});
*/	//-------------------------------
	$("#"+this.id+"_edit").wysihtml5({size:'mini','font-styles': false,'image': false,'uuid':uuid,'locale':LANG,'events': {'change': function(){UICom.structure['ui'][currentTexfieldUuid].resource.update();},'focus': function(){currentTexfieldUuid=uuid;} }});
	//------------------------------------------------
};

//==================================
UIFactory["TextField"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["TextField"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView());
	};

};


