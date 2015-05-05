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
UIFactory["Video"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Video';
/*	this.fileid_node = $("fileid",$("asmResource[xsi_type='Video']",node));
	if (this.fileid_node.length==0) {	//old version
		var fileid = createXmlElement("fileid");
		$("asmResource[xsi_type='Video']",node)[0].appendChild(fileid);
		this.fileid_node = $("fileid",$("asmResource[xsi_type='Image']",node));
	}*/
	this.filename_node = [];
	this.type_node = [];
	this.size_node = [];
	this.fileid_node = [];
	for (var i=0; i<languages.length;i++){
		this.filename_node[i] = $("filename[lang='"+languages[i]+"']",$("asmResource[xsi_type='Video']",node));
		this.type_node[i] = $("type[lang='"+languages[i]+"']",$("asmResource[xsi_type='Video']",node));
		this.size_node[i] = $("size[lang='"+languages[i]+"']",$("asmResource[xsi_type='Video']",node));
		this.fileid_node[i] = $("fileid[lang='"+languages[i]+"']",$("asmResource[xsi_type='Video']",node));
		//----------------------------
		if (this.filename_node[i].length==0) {
			var newfilename = createXmlElement("filename");
			$(newfilename).attr('lang', languages[i]);
			$("asmResource[xsi_type='Video']",node)[0].appendChild(newfilename);
			this.filename_node[i] = $("filename[lang='"+languages[i]+"']",$("asmResource[xsi_type='Video']",node));
		}
		//----------------------------
		if (this.type_node[i].length==0) {
			var newtype = createXmlElement("type");
			$(newtype).attr('lang', languages[i]);
			$("asmResource[xsi_type='Video']",node)[0].appendChild(newtype);
			this.type_node[i] = $("type[lang='"+languages[i]+"']",$("asmResource[xsi_type='Video']",node));
		}
		//----------------------------
		if (this.size_node[i].length==0) {
			var newsize = createXmlElement("size");
			$(newsize).attr('lang', languages[i]);
			$("asmResource[xsi_type='Video']",node)[0].appendChild(newsize);
			this.size_node[i] = $("size[lang='"+languages[i]+"']",$("asmResource[xsi_type='Video']",node));
		}
		//----------------------------
		if (this.fileid_node[i].length==0) {
			var newfileid = createXmlElement("fileid");
			$(newfileid).attr('lang', languages[i]);
			$("asmResource[xsi_type='Video']",node)[0].appendChild(newfileid);
			this.fileid_node[i] = $("fileid[lang='"+languages[i]+"']",$("asmResource[xsi_type='Video']",node));
		}
		//----------------------------
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

/// Display
//==================================
UIFactory["Video"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = langcode;
	}
	if (type==null)
		type='default';
	var html ="";
	html += "<div id='jp_container_"+this.id+"' class='jp-video '>";
	html += "<div class='jp-type-single'>";
	html += "<div id='jquery_jplayer_"+this.id+"' class='jp-jplayer'></div>";
	html += "<div class='jp-gui'>";
	html += "<div class='jp-video-play'>";
	html += "<a href='javascript:;' class='jp-video-play-icon' tabindex='1'>play</a>";
	html += "</div>";
	html += "<div class='jp-interface'>";
	html += "<div class='jp-progress'>";
	html += "<div class='jp-seek-bar'>";
	html += "<div class='jp-play-bar'></div>";
	html += "</div>";
	html += "  </div>";
	html += "  <div class='jp-current-time'></div>";
	html += "  <div class='jp-duration'></div>";
	html += "  <div class='jp-controls-holder'>";
	html += "<ul class='jp-controls'>";
	html += "  <li><a href='javascript:;' class='jp-play' tabindex='1'>play</a></li>";
	html += "  <li><a href='javascript:;' class='jp-pause' tabindex='1'>pause</a></li>";
	html += "  <li><a href='javascript:;' class='jp-stop' tabindex='1'>stop</a></li>";
	html += "  <li><a href='javascript:;' class='jp-mute' tabindex='1' title='mute'>mute</a></li>";
	html += "  <li><a href='javascript:;' class='jp-unmute' tabindex='1' title='unmute'>unmute</a></li>";
	html += "  <li><a href='javascript:;' class='jp-volume-max' tabindex='1' title='max volume'>max volume</a></li>";
	html += "</ul>";
	html += "<div class='jp-volume-bar'>";
	html += "  <div class='jp-volume-bar-value'></div>";
	html += "</div>";
	html += "<ul class='jp-toggles'>";
	html += "  <li><a href='javascript:;' class='jp-full-screen' tabindex='1' title='full screen'>full screen</a></li>";
	html += "  <li><a href='javascript:;' class='jp-restore-screen' tabindex='1' title='restore screen'>restore screen</a></li>";
	html += "  <li><a href='javascript:;' class='jp-repeat' tabindex='1' title='repeat'>repeat</a></li>";
	html += "  <li><a href='javascript:;' class='jp-repeat-off' tabindex='1' title='repeat off'>repeat off</a></li>";
	html += "</ul>";
	html += "  </div>";
	html += "  <div class='jp-title'>";
	html += "<ul>";
	html += "  <li>"+this.filename_node[langcode].text()+"</li>";
	html += "</ul>";
	html += "  </div>";
	html += "</div>";
	html += "  </div>";
	html += "  <div class='jp-no-solution'>";
	html += "<span>Update Required</span>";
	html += "To play the media you will need to either update your browser to a recent version or update your <a href='http://get.adobe.com/flashplayer/' target='_blank'>Flash plugin</a>.";
	html += "  </div>";
	html += "</div>";
	html += "  </div>";
	/*
	html = "";
	html += "<video width='320' height='240' controls>";
	var srce = "../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode];
	html += "<source src='"+srce+"' type='video/mp4'/>";
	html += "</video>";
	*/
	return html;
};

//==================================
UIFactory["Video"].prototype.setParameter = function(langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var destid = "jquery_jplayer_"+this.id;
	var cssSelectorAncestor = "#jp_container_"+this.id;
	var srce = "../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode];
	$("#"+destid).jPlayer({
		cssSelectorAncestor:cssSelectorAncestor,
		ready: function () {
			$("#"+destid).jPlayer("setMedia", {
			m4v: srce
			});
		},
		swfPath: "../../other/jplayer",
		solution:"flash,html",
		supplied: "m4v"
	});
};

/// Editor
//==================================
UIFactory["Video"].update = function(data,uuid,langcode)
//==================================
{
	var itself = UICom.structure["ui"][uuid];  // context node
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	itself.resource.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (itself.resource.multilingual!=undefined && !itself.resource.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var filename = data.files[0].name;
	var size = data.files[0].size;
	var type = data.files[0].type;
	$("#fileVideo_"+uuid+"_"+langcode).html(filename);
	var fileid = data.files[0].fileid;
	itself.resource.fileid_node[langcode].text(fileid);
	itself.resource.filename_node[langcode].text(filename);
	itself.resource.size_node[langcode].text(size);
	itself.resource.type_node[langcode].text(type);
	itself.resource.save();
};

//==================================
UIFactory["Video"].remove = function(uuid,langcode)
//==================================
{
	var itself = UICom.structure["ui"][uuid];  // context node
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	itself.resource.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (itself.resource.multilingual!=undefined && !itself.resource.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var filename = "";
	var size = "";
	var type = "";
	$("#fileVideo_"+uuid+"_"+langcode).html(filename);
	var fileid = "";
	itself.resource.fileid_node[langcode].text(fileid);
	itself.resource.filename_node[langcode].text(filename);
	itself.resource.size_node[langcode].text(size);
	itself.resource.type_node[langcode].text(type);
	itself.resource.save();
};

//==================================
UIFactory["Video"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = 0;
	//---------------------
	var html ="";
	var url = "../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode];
	html +=" <div id='div_f_"+this.id+"_"+langcode+"'>";
	html +=" <input id='f_"+this.id+"_"+langcode+"' type='file' name='uploadfile' data-url='"+url+"'>";
	html += "</div>";
	html +=" <div id='progress_f_"+this.id+"_"+langcode+"'><div class='bar' style='width: 0%;'></div></div>";
	html += "<span id='fileVideo_"+this.id+"_"+langcode+"'>"+$(this.filename_node[langcode]).text()+"</span>";
	html +=  " <button type='button' class='btn btn-mini' onclick=\"UIFactory.Video.remove('"+this.id+"',"+langcode+")\">"+karutaStr[LANG]['button-delete']+"</button>";
	$("#"+destid).append($(html));
	$("#f_"+this.id+"_"+langcode).fileupload({
		progressall: function (e, data) {
			$("#div_"+this.id).html("<img src='../../karuta/img/ajax-loader.gif'>");
			$("#progress_"+this.id).css('border','1px solid lightgrey');
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress_'+this.id+' .bar').css('width',progress + '%');
		},
		done: function (e, data,uuid) {
			$("#progress_"+this.id).css('border','1px solid lightgrey');
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress_'+this.id+' .bar').css('width',progress + '%');
			$("#div_"+this.id).html("Loaded");
			var uuid = data.url.substring(data.url.lastIndexOf('/')+1,data.url.indexOf('?'));
			UIFactory["Video"].update(data.result,uuid,langcode);
		}
    });
};

//==================================
UIFactory["Video"].prototype.save = function()
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
	UICom.structure["ui"][this.id].resource.setParameter();
};

//==================================
UIFactory["Video"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
