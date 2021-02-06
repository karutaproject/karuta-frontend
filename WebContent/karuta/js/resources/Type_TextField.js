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
UIFactory["TextField"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'TextField';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='"+this.type+"']",node));
	//------- for log -------------
	if ($("user",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("user");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.user_node = $("user",$("asmResource[xsi_type='"+this.type+"']",node));
	//--------------------
	this.text_node = [];
	for (var i=0; i<languages.length;i++){
		this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='"+this.type+"']",node));
		if (this.text_node[i].length==0) {
			var newelement = createXmlElement("text");
			$(newelement).attr('lang', languages[i]);
			$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
			this.text_node[i] = $("text[lang='"+languages[i]+"']",$("asmResource[xsi_type='"+this.type+"']",node));
		}
	}
	this.encrypted = ($("metadata",node).attr('encrypted')=='Y') ? true : false;
	//--------------------
	this.maxword = $("metadata-wad",node).attr('maxword');
	if (this.maxword==undefined)
		this.maxword = 0;
	//--------------------
	this.display = {};
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
		UICom.UpdateResource(this.id,writeSaved);
	}
	//--------------------
	this.blockparent = null;
	//--------------------
};

UIFactory["TextField"].prototype.getAttributes = function(type,langcode)
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
		result['text'] = this.text_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["TextField"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	//---------------------
	if (type==null)
		type = "standard";
	var html = $(this.text_node[langcode]).text();
	//---------------------
	if(type=='standard' || type=='none') {
		if (this.encrypted)
			html = decrypt(html.substring(3),g_rc4key);
	}
	return html;
};

//==================================
UIFactory["TextField"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["TextField"].prototype.update = function(langcode)
//==================================
{
	$(this.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var value = $.trim($("#"+this.id+"_edit_"+langcode+(this.inline?'inline':'')).val());
	var newValue1 = value.replace(/(<br("[^"]*"|[^\/">])*)>/g, "$1/>");
	var newValue = newValue1.replace(/(<img("[^"]*"|[^\/">])*)>/g, "$1/>");
	var words = $.trim(newValue).split(' ');
	if (this.maxword>0 && countWords(newValue)>this.maxword) {
		alertHTML(karutaStr[languages[langcode]]['maxword-alert']+"<br>"+markFirstWords(newValue,this.maxword));
		newValue = markFirstWords(newValue,this.maxword);
		$("#"+this.id+"_edit_"+langcode+(this.inline?'inline':'')).val(newValue);
		$("#"+this.id+"_edit_"+langcode+(this.inline?'inline':'')).data("wysihtml5").editor.setValue(newValue);
	}
	if (this.encrypted)
		newValue = "rc4"+encrypt(newValue,g_rc4key);
	if (!this.multilingual) {
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(this.text_node[langcode]).text(newValue);
		}
	} else
		$(this.text_node[langcode]).text(newValue);
	this.updateCounterWords(langcode);
	this.save();
};

//==================================
UIFactory["TextField"].prototype.updateCounterWords = function(langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.maxword>0) {
		var value = $.trim($("#"+this.id+"_edit_"+langcode+(this.inline?'inline':'')).val());
		var nbWords = countWords(value);
		$("#counter_"+this.id).html(nbWords+"/"+this.maxword);
		if (nbWords>this.maxword){
			$("#counter_"+this.id).addClass('danger');
		}
		else
			$("#counter_"+this.id).removeClass('danger');
	}
}

var editor =  [];
var currentTexfieldUuid = "";
var currentTexfieldInterval = "";

//==================================
UIFactory["TextField"].prototype.displayEditor = function(destid,type,langcode,disabled,inline)
//==================================
{
	if (!USER.admin && g_userroles[0]!='designer')
		$("#edit-window").addClass("TextFieldEditor");
	//---------------------
	if (inline==null)
		inline = false;
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (disabled==null)
		disabled = false;
	//---------------------
	if (type==null)
		type = 'default';
	//---------------------
	this.inline = ($("metadata",this.node).attr('inline')=='Y') ? true : false;
	if (this.inline==undefined)
		this.inline = false;
	//---------------------
	var text = "";
	if (this.encrypted){
		var cipher = $(this.text_node[langcode]).text().substring(3);
		text = decrypt(cipher,g_rc4key);
	}
	else
		text = $(this.text_node[langcode]).text();
	//---------------------
	var uuid = this.id;
	var html = "";
	if (type=='default') {
//		html += "<button id='button_"+this.id+"' class='fas fa-expand-alt' style='height:24px;float:right;' onclick=\"UIFactory.TextField.toggleExpand('"+this.id+"','"+langcode+"')\"></button>";
		html += "<div id='div_"+this.id+"'><span id='counter_"+this.id+"' class='word-counter' style='float:right'></span><textarea id='"+this.id+"_edit_"+langcode+(inline?'inline':'')+"' class='form-control' expand='false' style='height:300px' placeholder='"+karutaStr[LANG]['enter-text']+"' ";
		if (disabled)
			html += "disabled='disabled' ";
		html += ">"+text+"</textarea></div>";
	}
	else if(type.indexOf('x')>-1) {
//		var width = type.substring(0,type.indexOf('x'));
		var height = type.substring(type.indexOf('x')+1);
		html += "<div id='div_"+this.id+"'><textarea id='"+this.id+"_edit_"+langcode+(inline?'inline':'')+"' style='height:"+height+"px' ";
		if (disabled)
			html += "disabled='disabled' ";
		html += ">"+text+"</textarea></div>";
	}
	$("#"+destid).append($(html));
	if (this.maxword>0) {
		$("#counter_"+uuid).html(countWords(text)+"/"+this.maxword);
	}
	$("#"+uuid+"_edit_"+langcode+(inline?'inline':'')).wysihtml5(
		{
			toolbar:{"size":"xs","font-styles": false,"html":true,"blockquote": true,"image": false,"link": false},
			"uuid":uuid,
			"locale":LANG,
			'events': {
				'load': function(){try{$('.wysihtml5-sandbox').contents().find('body').on("keyup", function(){UICom.structure['ui'][currentTexfieldUuid].resource.updateCounterWords(langcode);});}catch(e){}; },
				'change': function(){UICom.structure['ui'][currentTexfieldUuid].resource.update(langcode);},
				'focus': function(){currentTexfieldUuid=uuid;currentTexfieldInterval = setInterval(function(){UICom.structure['ui'][currentTexfieldUuid].resource.update(langcode);}, g_wysihtml5_autosave);},
				'blur': function(){clearInterval(currentTexfieldInterval);}
			},
			parserRules: {
				classes: {
					"style": 1,
					"class": 1
				}
			},
			tags: {
				span: {}
			}
		}
	);
	//------------------------------------------------
};

//==================================
UIFactory["TextField"].toggleExpand = function(uuid,langcode)
//==================================
{
	if ($("#"+uuid+"_edit_"+langcode).attr('expand')=='false') {
		$("#button_"+uuid).removeClass('fa-expand-alt').addClass('fas fa-compress-alt');
		$("#"+uuid+"_edit_"+langcode).attr('expand','true');
//		$(".wysihtml5-sandbox").css('height','600px');
//		$(".modal-dialog").css('width','90%');
		$(".modal-dialog").addClass('modal-lg');
	} else {
		$("#button_"+uuid).removeClass('fa-compress-alt').addClass('fas fa-expand-alt');
		$("#"+uuid+"_edit_"+langcode).attr('expand','false');
//		$(".wysihtml5-sandbox").css('height','300px');
//		$(".modal-dialog").css('width','50%');
		$(".modal-dialog").removeClass('modal-lg');
	}
};
//==================================
UIFactory["TextField"].prototype.save = function()
//==================================
{
	//------------------------------
	var log = (UICom.structure.ui[this.id]!=undefined && UICom.structure.ui[this.id].logcode!=undefined && UICom.structure.ui[this.id].logcode!="");
	if (log)
		$(this.user_node).text(USER.firstname+" "+USER.lastname);
	//------------------------------
	UICom.UpdateResource(this.id,writeSaved);
	//------------------------------
	if (log)
		UICom.structure.ui[this.id].log();
	//---------------------------
	if (this.blockparent!=null)
		this.blockparent.refresh();
	else
		this.refresh();
};

//==================================
UIFactory["TextField"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		this.displayView(dest,null,this.display[dest]);
	};

};

//==================================
function countWords(html) {
//==================================
	var text = html.replace(/(<([^>]+)>)/ig," ").replace(/(&lt;([^&gt;]+)&gt;)/ig," ").replace( /[^\w ]/g," " );
	return text.trim().split( /\s+/ ).length;
}

//==================================
function getFirstWords(html,nb) {
//==================================
	var text = html.replace(/(<([^>]+)>)/ig," ").replace(/(&lt;([^&gt;]+)&gt;)/ig," ").replace( /[^\w ]/g, "" );
	var tableOfWords = text.trim().split( /\s+/ ).slice(0,nb);
	var tableIndex = [];
	var end = 0;
	for (var i=0;i<tableOfWords.length;i++){
		end += html.substring(end).indexOf(tableOfWords[i])+tableOfWords[tableOfWords.length-1].length;
		tableIndex[tableIndex.length] = {'s':tableOfWords[i], 'end':end};
	}
	return html.substring(0,tableIndex[tableOfWords.length-1].end)+"======"+nb+"======"+ html.substring(tableIndex[tableOfWords.length-1].end);
}

//==================================
function markFirstWords(html,nb) {
//==================================
	var text = html.replace("<span class='toomuch'><i style='color:red'>","").replace("</i></span><!--toomuch-->","").replace(/(<([^>]+)>)/ig," ").replace(/(&lt;([^&gt;]+)&gt;)/ig," ").replace( /[^\w ]/g, "" );
	var tableOfWords = text.trim().split( /\s+/ ).slice(0,nb);
	var tableIndex = [];
	var end = 0;
	for (var i=0;i<tableOfWords.length;i++){
		end += html.substring(end).indexOf(tableOfWords[i])+tableOfWords[tableOfWords.length-1].length;
		tableIndex[tableIndex.length] = {'s':tableOfWords[i], 'end':end};
	}
	return html.substring(0,tableIndex[tableOfWords.length-1].end) + "<i style='color:red;text-decoration: line-through;'>" + html.substring(tableIndex[tableOfWords.length-1].end)+"</i>";
}
