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

var documentIcon = [];
documentIcon = ['3gp','7z','ae','ai','apk','asf','avi','bak','bmp','cdr','css','csv','divx','dll','doc','docx','dw','dwg','eps','exe','flv','fw','gif','gz','htm','html','ico','iso','jar','jpg','js','mov','mp3','mp4','mpeg','pdf','php','png','ppt','ps','psd','rar','sh','sql','svg','swf','sys','tar','tiff','txt','war','wav','xls','xlsx','xml','zip'];

 
/// Define our type
//==================================
UIFactory["Document"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Document';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Document']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Document']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Document']",node));
	//--------------------
	this.filename_node = [];
	this.type_node = [];
	this.size_node = [];
	this.fileid_node = [];
	for (var i=0; i<languages.length;i++){
		this.filename_node[i] = $("filename[lang='"+languages[i]+"']",$("asmResource[xsi_type='Document']",node));
		this.type_node[i] = $("type[lang='"+languages[i]+"']",$("asmResource[xsi_type='Document']",node));
		this.size_node[i] = $("size[lang='"+languages[i]+"']",$("asmResource[xsi_type='Document']",node));
		this.fileid_node[i] = $("fileid[lang='"+languages[i]+"']",$("asmResource[xsi_type='Document']",node));
		//----------------------------
		if (this.filename_node[i].length==0) {
			var newfilename = createXmlElement("filename");
			$(newfilename).attr('lang', languages[i]);
			$("asmResource[xsi_type='Document']",node)[0].appendChild(newfilename);
			this.filename_node[i] = $("filename[lang='"+languages[i]+"']",$("asmResource[xsi_type='Document']",node));
		}
		//----------------------------
		if (this.type_node[i].length==0) {
			var newtype = createXmlElement("type");
			$(newtype).attr('lang', languages[i]);
			$("asmResource[xsi_type='Document']",node)[0].appendChild(newtype);
			this.type_node[i] = $("type[lang='"+languages[i]+"']",$("asmResource[xsi_type='Document']",node));
		}
		//----------------------------
		if (this.size_node[i].length==0) {
			var newsize = createXmlElement("size");
			$(newsize).attr('lang', languages[i]);
			$("asmResource[xsi_type='Document']",node)[0].appendChild(newsize);
			this.size_node[i] = $("size[lang='"+languages[i]+"']",$("asmResource[xsi_type='Document']",node));
		}
		//----------------------------
		if (this.fileid_node[i].length==0) {
			var newfileid = createXmlElement("fileid");
			$(newfileid).attr('lang', languages[i]);
			$("asmResource[xsi_type='Document']",node)[0].appendChild(newfileid);
			this.fileid_node[i] = $("fileid[lang='"+languages[i]+"']",$("asmResource[xsi_type='Document']",node));
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
UIFactory["Document"].prototype.getAttributes = function(type,langcode)
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
		result['type'] = this.type_node[langcode].text();
		result['size'] = this.size_node[langcode].text();
		result['filename'] = this.filename_node[langcode].text();
		result['fileid'] = this.fileid_node[langcode].text();
	}
	return result;
}

/// Display
//==================================
UIFactory["Document"].prototype.getView = function(dest,type,langcode)
//==================================
{

	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest] = {langcode: langcode, type : type};
	}
	//---------------------
	if (type==null)
		type = "standard";
	//---------------------
	var html = "";
	if ($(this.filename_node[langcode]).text()!="") {
		var filename = $(this.filename_node[langcode]).text();
		var extension = filename.substring(filename.lastIndexOf(".")+1).toLowerCase();
		if (!documentIcon.includes(extension))
			extension = "none";
		var iconfile = "../../karuta/img/files-png/" + extension + ".png";
		if (type=='standard' || type=='none'){
				html =  "<a id='file_"+this.id+"' href='../../../"+serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"'><img style='width:24px' src='"+iconfile+"'/> "+filename+"</a>";
		}
		if (type=='icon-url-label'){
				html =  "<a id='file_"+this.id+"' href='../../../"+serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"'>"+$(this.filename_node[langcode]).text()+" <img style='width:24px' src='"+iconfile+"'/></a>"; 
		}
		if (type=='icon-url'){
				html =  "<a id='file_"+this.id+"' href='../../../"+serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"'><img style='width:24px' src='"+iconfile+"'/></a>"; 
		}
		if (type=='icon'){
				html =  documentIcon[extension]; 
		}
	} else {
		html =  "<img src='../../karuta/img/document-icon.png' style='width:24px'>"+karutaStr[LANG]['no-document'];
	}
	return html;
};

//==================================
UIFactory["Document"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
};
/// Editor
//==================================
UIFactory["Document"].update = function(data,uuid,langcode,parent,filename)
//==================================
{
	var itself = UICom.structure["ui"][uuid];  // context node
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	var filename = filename; //data.files[0].name;
	var size = data.files[0].size;
	var type = data.files[0].type;
	$("#file_"+uuid+"_"+langcode).html(filename);
	$("#file__"+uuid+"_"+langcode).html(filename);
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
	itself.resource.save(parent);
};

//==================================
UIFactory["Document"].remove = function(uuid,langcode)
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
	$("#file_"+uuid+"_"+langcode).html(filename);
	$("#file__"+uuid+"_"+langcode).html(filename);
	$("#loaded_"+uuid+langcode).html("");
	var fileid = "";
	itself.resource.fileid_node[langcode].text(fileid);
	itself.resource.filename_node[langcode].text(filename);
	itself.resource.size_node[langcode].text(size);
	itself.resource.type_node[langcode].text(type);
	var delfile = true;
	itself.resource.save(null,delfile);
};

//==================================
UIFactory["Document"].prototype.displayEditor = function(destid,type,langcode,parent)
//==================================
{
	var filename = ""; // to avoid problem : filename with accents
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var html ="";
	var url = serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode];
	html +=" <form id='divfileupload_"+this.id+langcode+"' enctype='multipart/form-data'>";
	html +=" <input id='fileupload_"+this.id+langcode+"' type='file' name='uploadfile' data-url='"+url+"'>";
	html += "</form>";
	html +=" <div id='progress_"+this.id+langcode+"'><div class='bar' style='width: 0%;'></div></div>";
	html +=  "<a id='file__"+this.id+"_"+langcode+"' href='../../../"+serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"'>"+$(this.filename_node[langcode]).text()+"</a>"; 
	html += "<span id='loaded_"+this.id+langcode+"'></span>"
	html +=  " <button type='button' class='btn ' onclick=\"UIFactory.Document.remove('"+this.id+"',"+langcode+")\">"+karutaStr[LANG]['button-delete']+"</button>";
	$("#"+destid).append($(html));
	var loadedid = 'loaded_'+this.id+langcode;
	$("#fileupload_"+this.id+langcode).fileupload({
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
		dataType: 'json',
		progressall: function (e, data) {
			$("#wait-window").modal('show');
			$("#progress_"+this.id+langcode).css('border','1px solid lightgrey');
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress_'+this.id+langcode+' .bar').css('width',progress + '%');
		},
		done: function (e, data) {
			$("#wait-window").modal('hide');
			var uuid = data.url.substring(data.url.lastIndexOf('/')+1,data.url.indexOf('?'));
			UIFactory["Document"].update(data.result,uuid,langcode,parent,filename);
			$("#"+loadedid).html(" <i class='fa fa-check'></i>");
		}
    });
};

//==================================
UIFactory["Document"].prototype.save = function(parent,delfile)
//==================================
{
	if (delfile!=null && delfile)
		UICom.UpdateResource(this.id,writeSaved,null,delfile);
	else
		UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
	if (parent!=null) // --- structured resource
		parent.refresh();
	if (this.blockparent!=null)
		this.blockparent.refresh();
};


//==================================
UIFactory["Document"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,this.display[dest].type,this.display[dest].langcode));
	};

};
