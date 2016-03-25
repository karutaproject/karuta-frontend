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
UIFactory["Image"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'Image';
	//--------------------
	if ($("lastmodified",$("asmResource[xsi_type='Image']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("lastmodified");
		$("asmResource[xsi_type='Image']",node)[0].appendChild(newelement);
	}
	this.lastmodified_node = $("lastmodified",$("asmResource[xsi_type='Image']",node));
	//--------------------
	this.filename_node = [];
	this.type_node = [];
	this.size_node = [];
	this.fileid_node = [];
	for (var i=0; i<languages.length;i++){
		//----------------------------
		this.filename_node[i] = $("filename[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		this.type_node[i] = $("type[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		this.size_node[i] = $("size[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		this.fileid_node[i] = $("fileid[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		//----------------------------
		if (this.filename_node[i].length==0) {
			var newfilename = createXmlElement("filename");
			$(newfilename).attr('lang', languages[i]);
			$("asmResource[xsi_type='Image']",node)[0].appendChild(newfilename);
			this.filename_node[i] = $("filename[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		}
		//----------------------------
		if (this.type_node[i].length==0) {
			var newtype = createXmlElement("type");
			$(newtype).attr('lang', languages[i]);
			$("asmResource[xsi_type='Image']",node)[0].appendChild(newtype);
			this.type_node[i] = $("type[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		}
		//----------------------------
		if (this.size_node[i].length==0) {
			var newsize = createXmlElement("size");
			$(newsize).attr('lang', languages[i]);
			$("asmResource[xsi_type='Image']",node)[0].appendChild(newsize);
			this.size_node[i] = $("size[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		}
		//----------------------------
		if (this.fileid_node[i].length==0) {
			var newfileid = createXmlElement("fileid");
			$(newfileid).attr('lang', languages[i]);
			$("asmResource[xsi_type='Image']",node)[0].appendChild(newfileid);
			this.fileid_node[i] = $("fileid[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		}
		//----------------------------
	}
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	this.display = {};
};

//==================================
UIFactory["Image"].prototype.getAttributes = function(type,langcode)
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
UIFactory["Image"].prototype.getView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (this.multilingual!=undefined && !this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	if (dest!=null) {
		this.display[dest]=langcode;
	}
	if (type==null)
		type='default';
	//------------------------
	var image_size = "";
	if ($("metadata-epm",this.node).attr('width')!=undefined && $("metadata-epm",this.node).attr('width')!='') // backward compatibility
		image_size = "width='"+$("metadata-epm",this.node).attr('width')+"' "; 
	if ($("metadata-epm",this.node).attr('height')!=undefined && $("metadata-epm",this.node).attr('height')!='')
		image_size += "height='"+$("metadata-epm",this.node).attr('height')+"' "; 
	if (image_size=="")
		image_size = "class='image img-responsive'";
	//------------------------
	var html ="";
	if (type=='default') {
		html +="<div uuid='img_"+this.id+"'>";
		if ($(this.filename_node[langcode]).text()!="") {
			html += "<a href='../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&size=L&timestamp=" + new Date().getTime()+"' data-lightbox='image-"+this.id+"' title=''>";
			html += "<img style='display:inline;' id='image_"+this.id+"' src='../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"' "+image_size+" >";
			html += "</a>";
		}
		else
			html += "<img src='../img/image-icon.png' height='25px'>"+karutaStr[LANG]['no-image'];
		html += "</div>";
	}
	if (type=='withoutlightbox' && $(this.filename_node[langcode]).text()!="") {
		html += "<img uuid='img_"+this.id+"' src='../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"' "+image_size+" >";
	}
	if (type=='withfilename'  && $(this.filename_node[langcode]).text()!=""){
		html += "<a href='../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&size=L&timestamp=" + new Date().getTime()+"' data-lightbox='image-"+this.id+"' title=''>";
		html += "<img uuid='img_"+this.id+"' src='../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"' "+image_size+" >";		
		html += "</a>";
		html += " <span>"+$(this.filename_node[langcode]).text()+"</span>";
	}
	if (type=='withfilename-withoutlightbox'  && $(this.filename_node[langcode]).text()!=""){
		html += "<img uuid='img_"+this.id+"' src='../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"' "+image_size+" >";		
		html += " <span>"+$(this.filename_node[langcode]).text()+"</span>";
	}
	if (type=='editor'  && $(this.filename_node[langcode]).text()!=""){
		html += "<img uuid='img_"+this.id+"' src='../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"' height='100'>";		
		html += " <span>"+$(this.filename_node[langcode]).text()+"</span>";
	}
	if (type=='block') {
		html +="<div uuid='img_"+this.id+"'>";
		if ($(this.filename_node[langcode]).text()!="") {
			html += "<a href='../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&size=L&timestamp=" + new Date().getTime()+"' data-lightbox='image-"+this.id+"' title=''>";
			html += "<img inblock='true' style='display:inline;' id='image_"+this.id+"' src='../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"' "+image_size+" >";
			html += "</a>";
		}
		else
			html += "<img src='../img/image-icon.png' height='25px'>"+karutaStr[LANG]['no-image'];
		html += "</div>";
	}

	return html;
};

//==================================
UIFactory["Image"].update = function(data,uuid,langcode,parent)
//==================================
{
	var itself = UICom.structure["ui"][uuid];  // context node
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	itself.resource.multilingual = ($("metadata",itself.node).attr('multilingual-resource')=='Y') ? true : false;
	if (itself.resource.multilingual!=undefined && !itself.resource.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var filename = data.files[0].name;
	$("#fileimage_"+uuid+"_"+langcode).html(filename);
	var size = data.files[0].size;
	var type = data.files[0].type;
	var fileid = data.files[0].fileid;
	itself.resource.fileid_node[langcode].text(fileid);
	itself.resource.filename_node[langcode].text(filename);
	itself.resource.size_node[langcode].text(size);
	itself.resource.type_node[langcode].text(type);
	itself.resource.save(parent);
};

//==================================
UIFactory["Image"].remove = function(uuid,langcode)
//==================================
{
	var itself = UICom.structure["ui"][uuid];  // context node
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	itself.resource.multilingual = ($("metadata",itself.node).attr('multilingual-resource')=='Y') ? true : false;
	if (itself.resource.multilingual!=undefined && !itself.resource.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var filename = "";
	var size = "";
	var type = "";
	$("#fileimage_"+uuid+"_"+langcode).html(filename);
	var fileid = "";
	itself.resource.fileid_node[langcode].text(fileid);
	itself.resource.filename_node[langcode].text(filename);
	itself.resource.size_node[langcode].text(size);
	itself.resource.type_node[langcode].text(type);
	itself.resource.save();
};

//==================================
UIFactory["Image"].prototype.displayEditor = function(destid,type,langcode,parent)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
//	this.multilingual = ($("metadata",this.node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual)
		langcode = NONMULTILANGCODE;
	//---------------------
	var html ="";
	html += " <span id='editimage_"+this.id+"_"+langcode+"'>"+this.getView('editimage_'+this.id+"_"+langcode,'editor',langcode)+"</span> ";
	var url = "../../../"+serverFIL+"/resources/resource/file/"+this.id+"?lang="+languages[langcode];
	html +=" <div id='divfileupload_"+this.id+"_"+langcode+"' >";
	html +=" <input id='fileupload_"+this.id+"_"+langcode+"' type='file' name='uploadfile' data-url='"+url+"' en>";
	html += "</div>";
	html +=" <div id='progress_"+this.id+"_"+langcode+"''><div class='bar' style='width: 0%;'></div></div>";
	html += "<span id='fileimage_"+this.id+"_"+langcode+"'>"+$(this.filename_node[langcode]).text()+"</span>";
	html +=  " <button type='button' class='btn btn-xs' onclick=\"UIFactory.Image.remove('"+this.id+"',"+langcode+")\">"+karutaStr[LANG]['button-delete']+"</button>";
	$("#"+destid).append($(html));
	$('#fileupload_'+this.id+"_"+langcode).fileupload({
		dataType: 'json',
		progressall: function (e, data) {
			$("#progress_"+this.id+"_"+langcode).css('border','1px solid lightgrey');
			$("#divfileupload_"+this.id+"_"+langcode).html("<img src='../../karuta/img/ajax-loader.gif'> Transfert");
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress_'+this.id+"_"+langcode+' .bar').css('width',progress + '%');
		},
		done: function (e, data) {
			var uuid = data.url.substring(data.url.lastIndexOf('/')+1,data.url.indexOf('?'));
			UIFactory["Image"].update(data.result,uuid,langcode,parent);
			$("#divfileupload_"+this.id+"_"+langcode).html("Loaded");
		}
    });
};

//==================================
UIFactory["Image"].prototype.save = function(parent)
//==================================
{
	UICom.UpdateResource(this.id,writeSaved);
	this.refresh();
	if (parent!=null) // --- structured resource
		parent.refresh();
};

//==================================
UIFactory["Image"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		$("#"+dest).html(this.getView(null,null,this.display[dest]));
	};

};
