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
UIFactory["Comments"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Comments';
	this.author_node = $("author",$("asmResource[xsi_type='Comments']",node));
	this.date_node = $("date",$("asmResource[xsi_type='Comments']",node));
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Comments']",node));
		if (this.text_node[i].length==0) {
			if (i==0 && $("text",$("asmResource[xsi_type='Comments']",node)).length==1) { // for WAD6 imported portfolio
				this.text_node[i] = $("text",$("asmResource[xsi_type='Comments']",node));
			} else {
				var newelement = createXmlElement("text");
				$(newelement).attr('lang', languages[i]);
				$(newelement).removeAttr('xmlns');
				$("asmResource[xsi_type='Comments']",node)[0].appendChild(newelement);
				this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='Comments']",node));
			}
		}
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

function Comment(author,date,text) {
	  this.author = author;
	  this.date = date;
	  this.text = text;
	}

//==================================
UIFactory["Comments"].prototype.getValues = function(type,langcode)
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
	var text = $("<div class='text'>").append($(this.text_node[langcode]).clone()).html();

	var comment = new Comment($(this.author_node).text(),$(this.date_node).text(),text);
	return comment;
};

/// Display
//==================================
UIFactory["Comments"].prototype.getView = function(dest,type,langcode)
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
	var html = "";
	var text = $(this.text_node[langcode]).text();

	html += "<div class='text'>"+text+"</div>";
	html +="<div  class='author-date'>";
	html +="<span name='author' class='author' id='author'>"+$(this.author_node).text()+"</span>";
	if ($(this.author_node).text()!='' && $(this.date_node).text()!='')
		html += " - ";
	html +="<span name='date' class='date' id='date'>"+$(this.date_node).text()+"</span>";
	html +="</div>";

	return html;
};

/// Editor
//==================================
UIFactory["Comments"].prototype.update = function(langcode)
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
	var now = new Date().toLocaleDateString();
	var author = USER.getView(null,'firstname-lastname');
	this.date_node.text(now);
	this.author_node.text(author);
	var value = $.trim($("#"+this.id+"_edit_"+langcode).val());
	$(this.text_node[langcode]).text(value);//	$(this.text_node[langcode]).html($.parseHTML(value));
	this.save();
};


//==================================
UIFactory["Comments"].prototype.displayEditor = function(destid,type,langcode,disabled)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
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
	if (type=='default') {
		html += "<div id='div_"+this.id+"'><textarea id='"+this.id+"_edit_"+langcode+"' style='height:200px' placeholder='"+karutaStr[LANG]['enter-text']+"' ";
		if (disabled)
			html += "disabled='disabled' ";
		html += ">"+text+"</textarea></div>";
	}
	else if(type.indexOf('x')>-1) {
//		var width = type.substring(0,type.indexOf('x'));
		var height = type.substring(type.indexOf('x')+1);
		html += "<div id='div_"+this.id+"'><textarea id='"+this.id+"_edit_"+langcode+"' style='height:"+height+"px' ";
		if (disabled)
			html += "disabled='disabled' ";
		html += ">"+text+"</textarea></div>";
	}
	$("#"+destid).append($(html));
	$("#"+this.id+"_edit_"+langcode).wysihtml5({size:'mini','font-styles': false,'image': false,'uuid':uuid,'locale':LANG,'events': {'change': function(){UICom.structure['ui'][currentTexfieldUuid].resource.update(langcode);},'focus': function(){currentTexfieldUuid=uuid;} }});
	//------------------------------------------------
};

//==================================
UIFactory["Comments"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
};

//==================================
UIFactory["Comments"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};


