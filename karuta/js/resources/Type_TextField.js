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
				var newelement = createXmlElement("text");
				$(newelement).attr('lang', languages[i]);
				$("asmResource[xsi_type='TextField']",node)[0].appendChild(newelement);
				this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='TextField']",node));
			}
		}
	}
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
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
	var html = $(this.text_node[langcode]).text();
	//---------------------
	if(type=='standard') {
		if (this.encrypted)
			html = decrypt(html.substring(3),g_rc4key);
	}
	return html;
};

/// Editor
//==================================
UIFactory["TextField"].prototype.update = function(langcode)
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
	var value = $.trim($("#"+this.id+"_edit_"+langcode).val());
	if (this.encrypted)
		value = "rc4"+encrypt(value,g_rc4key);
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
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	if (disabled==null)
		disabled = false;
	//---------------------
	if (type==null)
		type = 'default';
	//---------------------
	var text = "";
	if (this.encrypted){
		var cipher = $(this.text_node[langcode]).text().substring(3);
		text = decrypt(cipher,g_rc4key);
	}
	else
		text = xml2string($(this.text_node[langcode])[0]);
	//---------------------
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
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};


