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
UIFactory["Video"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Video';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Video']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Video']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Video']",node));
	//--------------------
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
	//--------------------
	if ($("version",$("asmResource[xsi_type='"+this.type+"']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("version");
		$("asmResource[xsi_type='"+this.type+"']",node)[0].appendChild(newelement);
	}
	this.version_node = $("version",$("asmResource[xsi_type='"+this.type+"']",node));
	//----------------------------
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual && this.version_node.text()!="3.0") {  // for backward compatibility - if multilingual we set all languages
		this.version_node.text("3.0");
		for (var langcode=0; langcode<languages.length; langcode++) {
			$(this.filename_node[langcode]).text($(this.filename_node[0]).text());
			$(this.type_node[langcode]).text($(this.filename_node[0]).text());
			$(this.size_node[langcode]).text($(this.filename_node[0]).text());
			$(this.fileid_node[langcode]).text($(this.filename_node[0]).text());
		}
		this.save();
	}
	//----------------------------
	this.display = {};
};

//==================================
UIFactory["Video"].prototype.getAttributes = function(type,langcode)
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
		result['type'] = this.type_node[langcode].text();
		result['size'] = this.size_node[langcode].text();
		result['filename'] = this.filename_node[langcode].text();
		result['fileid'] = this.fileid_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["Video"].prototype.getView = function(dest,type,langcode)
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
		type = "html5";
	//---------------------
	var html ="";
	if (type=='html5' || type=='none') {
		html += "<video width='100%' controls>";
		var srce = serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&type=.mp4";
		html += "<source src='"+srce+"' type=\"video/mp4\"></source>";
		html += "</video>";
	}
	return html;
};

//==================================
UIFactory["Video"].prototype.displayView = function(dest,type,langcode)
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
		type = "html5";
	//---------------------
	var html ="";
	if (type=='html5') {
		html += "<video width='100%' controls>";
		var srce = serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&type=.mp4";
		html += "<source src='"+srce+"' type=\"video/mp4\"></source>";
		html += "</video>";
	}
	$("#"+dest).html(html);
};

//==================================
UIFactory["Video"].prototype.setParameter = function(langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var destid = "jquery_jplayer_"+this.id;
	var cssSelectorAncestor = "#jp_container_"+this.id;
	var srce = serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode];
	$("#"+destid).jPlayer({
		cssSelectorAncestor:cssSelectorAncestor,
		ready: function () {
			$("#"+destid).jPlayer("setMedia", {
			m4v: srce
			});
		},
		swfPath: "../../other/jplayer",
		solution:"flash,html",
		supplied: "m4v",
		size: {
			width:"100%",
			height:"240px"
		}
	});
};

/// Editor
//==================================
UIFactory["Video"].update = function(data,uuid,langcode)
//==================================
{
	var itself = UICom.structure["ui"][uuid];  // context node
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var filename = data.files[0].name;
	var size = data.files[0].size;
	var type = data.files[0].type;
	$("#fileVideo_"+uuid+"_"+langcode).html(filename);
	var fileid = data.files[0].fileid;
	//---------------------
	itself.resource.multilingual = ($("metadata",itself.node).attr('multilingual-resource')=='Y') ? true : false;
	if (itself.resource.multilingual!=undefined && !itself.resource.multilingual) {
		for (var langcode=0; langcode<languages.length; langcode++) {
			itself.resource.fileid_node[langcode].text(fileid);
			itself.resource.filename_node[langcode].text(filename);
			itself.resource.size_node[langcode].text(size);
			itself.resource.type_node[langcode].text(type);
		}
	} else {
		itself.resource.fileid_node[langcode].text(fileid);
		itself.resource.filename_node[langcode].text(filename);
		itself.resource.size_node[langcode].text(size);
		itself.resource.type_node[langcode].text(type);
	}
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
	var filename = "";
	var size = "";
	var type = "";
	$("#fileVideo_"+uuid+"_"+langcode).html(filename);
	var fileid = "";
	itself.resource.fileid_node[langcode].text(fileid);
	itself.resource.filename_node[langcode].text(filename);
	itself.resource.size_node[langcode].text(size);
	itself.resource.type_node[langcode].text(type);
	var delfile = true;
	itself.resource.save(null,delfile);
};

//==================================
UIFactory["Video"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	var filename = ""; // to avoid problem : filename with accents	
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = 0;
	//---------------------
	var html ="";
	var url = serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode];
	html += "<div class='audio-video-format'>Format: mp4</div>"
	html +=" <div id='div_f_"+this.id+"_"+langcode+"'>";
	html +=" <input id='f_"+this.id+"_"+langcode+"' type='file' name='uploadfile' data-url='"+url+"'>";
	html += "</div>";
	html +=" <div id='progress_f_"+this.id+"_"+langcode+"'><div class='bar' style='width: 0%;'></div></div>";
	html += "<span id='fileVideo_"+this.id+"_"+langcode+"'>"+$(this.filename_node[langcode]).text()+"</span>";
	html += "<span id='loaded_"+this.id+langcode+"'></span>"
	html +=  " <button type='button' class='btn ' onclick=\"UIFactory.Video.remove('"+this.id+"',"+langcode+")\">"+karutaStr[LANG]['button-delete']+"</button>";
	$("#"+destid).append($(html));
	var loadedid = 'loaded_'+this.id+langcode;
	$("#f_"+this.id+"_"+langcode).fileupload({
		add: function(e, data) {
			$("#wait-window").modal('show');
			filename = data.originalFiles[0]['name'];
			if(data.originalFiles[0]['size'] > g_configVar['maxfilesizeupload'] * 1024 * 1024) {
				$("#wait-window").modal('hide');
				alertHTML(karutaStr[languages[LANGCODE]]['size-upload']);
			} else {
				data.submit();
			}
		},
		progressall: function (e, data) {
			$("#progress_"+this.id).css('border','1px solid lightgrey');
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress_'+this.id+' .bar').css('width',progress + '%');
		},
		done: function (e, data,uuid) {
			$("#wait-window").modal('hide');
			$("#progress_"+this.id).css('border','1px solid lightgrey');
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress_'+this.id+' .bar').css('width',progress + '%');
			$("#"+loadedid).html(" <i class='fa fa-check'></i>");
			var uuid = data.url.substring(data.url.lastIndexOf('/')+1,data.url.indexOf('?'));
			data.result.files[0].name = filename;
			UIFactory["Video"].update(data.result,uuid,langcode,filename);
		}
    });
};

//==================================
UIFactory["Video"].prototype.save = function(delfile)
//==================================
{
	if (delfile!=null && delfile)
		UICom.UpdateResource(this.id,writeSaved,null,delfile);
	else
		UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
	if (!audiovideohtml5)
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
