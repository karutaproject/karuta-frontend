
/// Check namespace existence
if( UIFactory === undefined )
{
  var UIFactory = {};
}


/// Define our type
//==================================
UIFactory["Audio"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Audio';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Audio']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Audio']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Audio']",node));
	//--------------------
	this.filename_node = [];
	this.type_node = [];
	this.size_node = [];
	this.fileid_node = [];
	for (var i=0; i<languages.length;i++){
		this.filename_node[i] = $("filename[lang='"+languages[i]+"']",$("asmResource[xsi_type='Audio']",node));
		this.type_node[i] = $("type[lang='"+languages[i]+"']",$("asmResource[xsi_type='Audio']",node));
		this.size_node[i] = $("size[lang='"+languages[i]+"']",$("asmResource[xsi_type='Audio']",node));
		this.fileid_node[i] = $("fileid[lang='"+languages[i]+"']",$("asmResource[xsi_type='Audio']",node));
		//----------------------------
		if (this.filename_node[i].length==0) {
			var newfilename = createXmlElement("filename");
			$(newfilename).attr('lang', languages[i]);
			$("asmResource[xsi_type='Audio']",node)[0].appendChild(newfilename);
			this.filename_node[i] = $("filename[lang='"+languages[i]+"']",$("asmResource[xsi_type='Audio']",node));
		}
		//----------------------------
		if (this.type_node[i].length==0) {
			var newtype = createXmlElement("type");
			$(newtype).attr('lang', languages[i]);
			$("asmResource[xsi_type='Audio']",node)[0].appendChild(newtype);
			this.type_node[i] = $("type[lang='"+languages[i]+"']",$("asmResource[xsi_type='Audio']",node));
		}
		//----------------------------
		if (this.size_node[i].length==0) {
			var newsize = createXmlElement("size");
			$(newsize).attr('lang', languages[i]);
			$("asmResource[xsi_type='Audio']",node)[0].appendChild(newsize);
			this.size_node[i] = $("size[lang='"+languages[i]+"']",$("asmResource[xsi_type='Audio']",node));
		}
		//----------------------------
		if (this.fileid_node[i].length==0) {
			var newfileid = createXmlElement("fileid");
			$(newfileid).attr('lang', languages[i]);
			$("asmResource[xsi_type='Audio']",node)[0].appendChild(newfileid);
			this.fileid_node[i] = $("fileid[lang='"+languages[i]+"']",$("asmResource[xsi_type='Audio']",node));
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
UIFactory["Audio"].prototype.getAttributes = function(type,langcode)
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
UIFactory["Audio"].prototype.getView = function(dest,type,langcode)
//==================================
{
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
		type = "html5";
	//---------------------
	var html ="";
	if (type=='html5') {
		html += "<audio controls>";
		var srce = serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&type=.mp3";
		html += "<source src='"+srce+"' type='audio/mpeg'/>";
		html += "</audio>";		
	}

	return html;
};

//==================================
UIFactory["Audio"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = 0;
	//---------------------
	if (type==null)
		type = "html5";
	//---------------------
	this.display[dest] = {"type":type,"langcode":langcode};
	//---------------------
	var html ="";
	if (type=='html5') {
		html += "<audio controls>";
		var srce = serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&type=.mp3";
		html += "<source src='"+srce+"' type='audio/mpeg'/>";
		html += "</audio>";		
	}
	$("#"+dest).html(html);
};

/// Editor
//==================================
UIFactory["Audio"].update = function(data,uuid,langcode,filename)
//==================================
{
	var itself = UICom.structure["ui"][uuid];  // context node
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	var size = data.files[0].size;
	var type = data.files[0].type;
	$("#fileAudio_"+uuid+"_"+langcode).html(filename);
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
	itself.resource.save();
};

//==================================
UIFactory["Audio"].remove = function(uuid,langcode)
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
	$("#fileAudio_"+uuid+"_"+langcode).html(filename);
	var fileid = "";
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
	var delfile = true;
	itself.resource.save(null,delfile);
};

//==================================
UIFactory["Audio"].prototype.displayEditor = function(destid,type,langcode)
//==================================
{
	var filename = ""; // to avoid problem : filename with accents	
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var html ="";
	html += "<div class='audio-video-format'>Format: mp3</div>"
	var url = serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode];
	html +=" <div id='div_f_"+this.id+"_"+langcode+"'>";
	html +=" <input id='f_"+this.id+"_"+langcode+"' type='file' name='uploadfile' data-url='"+url+"'>";
	html += "</div>";
	html +=" <div id='progress_f_"+this.id+"_"+langcode+"'><div class='bar' style='width: 0%;'></div></div>";
	html += "<span id='fileAudio_"+this.id+"_"+langcode+"'>"+$(this.filename_node[langcode]).text()+"</span>";
	html += "<span id='loaded_"+this.id+langcode+"'></span>"
	html +=  " <button type='button' class='btn ' onclick=\"UIFactory.Audio.remove('"+this.id+"',"+langcode+")\">"+karutaStr[LANG]['button-delete']+"</button>";
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
			UIFactory["Audio"].update(data.result,uuid,langcode,filename);
		}
    });
};

//==================================
UIFactory["Audio"].prototype.save = function(delfile)
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
UIFactory["Audio"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		this.displayView(dest,this.display[dest].type,this.display[dest].langcode)
	};

};
