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
UIFactory["Comments"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Comments';
	this.lastmodified_node = $("lastModified",$("asmResource[xsi_type='"+this.type+"']",node));
	this.author_node = $("author",$("asmResource[xsi_type='"+this.type+"']",node));
	this.date_node = $("date",$("asmResource[xsi_type='"+this.type+"']",node));
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='"+this.type+"']",node));
		if (this.text_node[i].length==0) {
			var newelement = createXmlElement("text");
			$(newelement).attr('lang', languages[i]);
			$(newelement).removeAttr('xmlns');
			$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
			this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='"+this.type+"']",node));
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
			$(this.text_node[langcode]).text($(this.text_node[0]).text());
		}
		this.save();
	}
	//--------------------
	this.display = {};
};

//==================================
function Comment(author,date,text)
//==================================
{
	this.author = author;
	this.date = date;
	this.text = text;
}

//==================================
UIFactory["Comments"].prototype.getAttributes = function(type,langcode)
//==================================
{
	var result = {};
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
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
		result['author'] = this.author_node[langcode].text();
		result['date'] = this.date_node[langcode].text();
		result['text'] = this.text_node[langcode].text();
	}
	return result;
}

//==================================
UIFactory["Comments"].prototype.getValues = function(type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
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

//==================================
UIFactory["Comments"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
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

	$("#"+dest).html(html);
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
	var now = new Date().toLocaleString();
	$(this.lastModified).text(now);
	var author = USER.getView(null,'firstname-lastname');
	this.date_node.text(now);
	this.author_node.text(author);
	var value = $.trim($("#"+this.id+"_edit_"+langcode).val());
	if (value==''){ // we erase date and author if comments are deleted
		this.date_node.text('');
		this.author_node.text('');
	}
	//---------------------
	if (!this.multilingual) {
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(this.text_node[langcode]).text(value);
		}
	} else
		$(this.text_node[langcode]).text(value);
	//---------------------

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
	if (disabled==null)
		disabled = false;
	//---------------------
	if (type==null)
		type = 'default';
	var text = xml2string($(this.text_node[langcode])[0]);
	var uuid = this.id;
	var html = "";
	if (type=='default') {
		html += "<div id='div_"+this.id+"'><textarea id='"+this.id+"_edit_"+langcode+"' class='form-control' style='height:200px' placeholder='"+karutaStr[LANG]['enter-text']+"' ";
		if (disabled)
			html += "disabled='disabled' ";
		html += ">"+text+"</textarea></div>";
	}
	else if(type.indexOf('x')>-1) {
//		var width = type.substring(0,type.indexOf('x'));
		var height = type.substring(type.indexOf('x')+1);
		html += "<div id='div_"+this.id+"'><textarea id='"+this.id+"_edit_"+langcode+"' class='form-control' style='height:"+height+"px' ";
		if (disabled)
			html += "disabled='disabled' ";
		html += ">"+text+"</textarea></div>";
	}
	$("#"+destid).append($(html));
	$("#"+uuid+"_edit_"+langcode).wysihtml5({toolbar:{"size":"xs","font-styles": false,"html":true,"blockquote": false,"image": false,"link": false},"uuid":uuid,"locale":LANG,'events': {'change': function(){UICom.structure['ui'][currentTexfieldUuid].resource.update(langcode);},'focus': function(){currentTexfieldUuid=uuid;currentTexfieldInterval = setInterval(function(){UICom.structure['ui'][currentTexfieldUuid].resource.update(langcode);}, g_wysihtml5_autosave);},'blur': function(){clearInterval(currentTexfieldInterval);}}});
	//------------------------------------------------
};

//==================================
UIFactory["Comments"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	if (!this.inline)
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


