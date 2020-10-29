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
	if ($("code",$("asmResource[xsi_type='Image']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("code");
		$("asmResource[xsi_type='Image']",node)[0].appendChild(newelement);
	}
	this.code_node = $("code",$("asmResource[xsi_type='Image']",node));
	//--------------------
	if ($("value",$("asmResource[xsi_type='Image']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("value");
		$("asmResource[xsi_type='Image']",node)[0].appendChild(newelement);
	}
	this.value_node = $("value",$("asmResource[xsi_type='Image']",node));
	//--------------------
	this.filename_node = [];
	this.type_node = [];
	this.size_node = [];
	this.fileid_node = [];
	this.width_node = [];
	this.height_node = [];
	this.alt_node = [];
	for (var i=0; i<languages.length;i++){
		//----------------------------
		this.filename_node[i] = $("filename[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		this.type_node[i] = $("type[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		this.size_node[i] = $("size[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		this.fileid_node[i] = $("fileid[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		this.width_node[i] = $("width[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		this.height_node[i] = $("height[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		this.alt_node[i] = $("alt[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
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
		if (this.width_node[i].length==0) {
			var newwidth = createXmlElement("width");
			$(newwidth).attr('lang', languages[i]);
			$("asmResource[xsi_type='Image']",node)[0].appendChild(newwidth);
			this.width_node[i] = $("width[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		}
		//----------------------------
		if (this.height_node[i].length==0) {
			var newheight = createXmlElement("height");
			$(newheight).attr('lang', languages[i]);
			$("asmResource[xsi_type='Image']",node)[0].appendChild(newheight);
			this.height_node[i] = $("height[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		}
		//----------------------------
		if (this.alt_node[i].length==0) {
			var newalt = createXmlElement("alt");
			$(newalt).attr('lang', languages[i]);
			$("asmResource[xsi_type='Image']",node)[0].appendChild(newalt);
			this.alt_node[i] = $("alt[lang='"+languages[i]+"']",$("asmResource[xsi_type='Image']",node));
		}
		//----------------------------
	}
	//--------------------
	if ($("version",$("asmResource[xsi_type='Image']",node)).length==0){  // for backward compatibility
		var newelement = createXmlElement("version");
		$("asmResource[xsi_type='Image']",node)[0].appendChild(newelement);
	}
	this.version_node = $("version",$("asmResource[xsi_type='Image']",node));
	//--------------------
	this.multilingual = ($("metadata",node).attr('multilingual-resource')=='Y') ? true : false;
	if (!this.multilingual && this.version_node.text()!="3.0") {  // for backward compatibility - we set all languages
		this.version_node.text("3.0");
		for (var langcode=0; langcode<languages.length; langcode++) {
			this.filename_node[langcode].text(this.filename_node[0].text());
			this.type_node[langcode].text(this.type_node[0].text());
			this.size_node[langcode].text(this.size_node[0].text());
			this.fileid_node[langcode].text(this.fileid_node[0].text());
			this.width_node[langcode].text(this.width_node[0].text());
			this.height_node[langcode].text(this.height_node[0].text());
			this.alt_node[langcode].text(this.alt_node[0].text());
		}
		this.save();
	}
	this.display = {};
	this.displayType = {};
};

//==================================
UIFactory["Image"].prototype.getAttributes = function(type,langcode)
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
		result['width'] = this.width_node[langcode].text();
		result['height'] = this.height_node[langcode].text();
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
	if (dest!=null) {
		this.display[dest]=langcode;
	}
	if (type==null)
		type='default';
	//------------------------
	var image_size = "";
	var img_width = ($(this.width_node[langcode]).text()!=undefined) ? $(this.width_node[langcode]).text() : "";
	var img_height = ($(this.height_node[langcode]).text()!=undefined) ? $(this.height_node[langcode]).text() : "";
	if (img_width!="" && img_width.indexOf('px')<0)
		img_width += "px";
	if (img_height!="" && img_height.indexOf('px')<0)
		img_height += "px";
	if (img_width=="" && img_height=="")
		image_size = " class='image img-fluid' ";
	else {
		if (img_width!="")
			image_size += " width='"+img_width + "' ";
		if (img_height!="")
			image_size += " height='" + img_height + "' ";
	}
	//------------------------
	var alt = "";
	if ($(this.alt_node[langcode]).text()!=undefined) // backward compatibility
		alt = "alt=\""+$(this.alt_node[langcode]).text()+"\" "; 
	//------------------------
	var nodefileid = this.id;
	if (nodefileid.indexOf("_")>-1) // proxy-image
		nodefileid = nodefileid.substring(0,nodefileid.indexOf("_"));
	//------------------------
	var html ="";
	if (type=='default' || type=='none') {
		html +="<div uuid='img_"+this.id+"'>";
		if ($(this.filename_node[langcode]).text()!="") {
			html += "<img style='display:inline;' id='image_"+this.id+"' src='../../../"+serverBCK+"/resources/resource/file/"+nodefileid+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"' "+image_size+" "+alt+" />";
		}
		else
			html += "<img src='../../karuta/img/image-icon.png' height='25px'/>"+karutaStr[LANG]['no-image'];
		html += "</div>";
	}
	if (type=='span') {
		html +="<span uuid='img_"+this.id+"'>";
		if ($(this.filename_node[langcode]).text()!="") {
			html += "<img style='display:inline;' id='image_"+this.id+"' src='../../../"+serverBCK+"/resources/resource/file/"+nodefileid+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"' "+image_size+""+alt+"  />";
		}
		else
			html += "<img src='../../karuta/img/image-icon.png' height='25px'/>"+karutaStr[LANG]['no-image'];
		html += "</span>";
	}
	if (type=='withoutlightbox' && $(this.filename_node[langcode]).text()!="") {
		html += "<img uuid='img_"+this.id+"' src='../../../"+serverBCK+"/resources/resource/file/"+nodefileid+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"' "+image_size+" "+alt+" />";
	}
	if (type=='withfilename'  && $(this.filename_node[langcode]).text()!=""){
		html += "<a href='../../../"+serverBCK+"/resources/resource/file/"+nodefileid+"?lang="+languages[langcode]+"&size=L&timestamp=" + new Date().getTime()+"' data-lightbox='image-"+nodefileid+"' title=''>";
		html += "<img uuid='img_"+this.id+"' src='../../../"+serverBCK+"/resources/resource/file/"+nodefileid+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"' "+image_size+" "+alt+" />";		
		html += "</a>";
		html += " <span>"+$(this.filename_node[langcode]).text()+"</span>";
	}
	if (type=='withfilename-withoutlightbox'  && $(this.filename_node[langcode]).text()!=""){
		html += "<img uuid='img_"+this.id+"' src='../../../"+serverBCK+"/resources/resource/file/"+nodefileid+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"' "+image_size+" "+alt+" />";		
		html += " <span>"+$(this.filename_node[langcode]).text()+"</span>";
	}
	if (type=='editor'  && $(this.filename_node[langcode]).text()!=""){
		html += "<img uuid='img_"+this.id+"' src='../../../"+serverBCK+"/resources/resource/file/"+nodefileid+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"' height='100' "+alt+" />";		
		html += " <span>"+$(this.filename_node[langcode]).text()+"</span>";
	}
	if (type=='block') {
		html +="<div uuid='img_"+this.id+"' style='height:100%'>";
		if ($(this.filename_node[langcode]).text()!="") {
			html += "<table width='100%' height='100%'><tr><td style='vertical-align:middle;text-align:center'>";
			html += "<a href='../../../"+serverBCK+"/resources/resource/file/"+nodefileid+"?lang="+languages[langcode]+"&size=L&timestamp=" + new Date().getTime()+"' data-lightbox='image-"+this.id+"' title=''>";
			html += "<img style='display:inline;max-height:218px;' id='image_"+nodefileid+"' src='../../../"+serverBCK+"/resources/resource/file/"+nodefileid+"?lang="+languages[langcode]+"&size=S&timestamp=" + new Date().getTime()+"' "+image_size+" "+alt+" />";
			html += "</a>";
			html += "</td></tr></table>";
		} else {
			html += "<table width='100%' height='100%'><tr><td style='vertical-align:middle;text-align:center'>";
			html += "<img src='../../karuta/img/image-icon.png' height='150px' "+alt+" />"+karutaStr[LANG]['no-image'];
			html += "</td></tr></table>";
		}
		html += "</div>";
	}

	return html;
};

//==================================
UIFactory["Image"].prototype.displayView = function(dest,type,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var alt = "";
	if ($(this.alt_node[langcode]).text()!=undefined) // backward compatibility
		alt = "alt=\""+$(this.alt_node[langcode]).text()+"\" "; 
	var html = this.getView(dest,type,langcode);
	$("#"+dest).html(html);
	var uuid = this.id;
	$("#image_"+this.id).click(function(){
		imageHTML("<img class='img-fluid' style='margin-left:auto;margin-right:auto' uuid='img_"+uuid+"' src='../../../"+serverBCK+"/resources/resource/file/"+uuid+"?lang="+languages[langcode]+"&timestamp=" + new Date().getTime()+"' "+alt+" >");
	});

};


//==================================
UIFactory["Image"].update = function(data,uuid,langcode,parent,filename)
//==================================
{
	var itself = UICom.structure["ui"][uuid];  // context node
	$(itself.lastmodified_node).text(new Date().toLocaleString());
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	$("#fileimage_"+uuid+"_"+langcode).html(filename);
	var size = data.files[0].size;
	var type = data.files[0].type;
	var fileid = data.files[0].fileid;
	if (!itself.resource.multilingual) {
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
UIFactory["Image"].remove = function(uuid,langcode)
//==================================
{
	var itself = UICom.structure["ui"][uuid];  // context node
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	$("#fileimage_"+uuid+"_"+langcode).html("");
	if (!itself.resource.multilingual) {
		for (var langcode=0; langcode<languages.length; langcode++) {
			itself.resource.fileid_node[langcode].text("");
			itself.resource.filename_node[langcode].text("");
			itself.resource.size_node[langcode].text("");
			itself.resource.type_node[langcode].text("");
		}
	} else {
		itself.resource.fileid_node[langcode].text("");
		itself.resource.filename_node[langcode].text("");
		itself.resource.size_node[langcode].text("");
		itself.resource.type_node[langcode].text("");
	}
	var delfile = true;
	itself.resource.save(null,delfile);
};

//==================================
UIFactory["Image"].prototype.displayEditor = function(destid,type,langcode,disabled,parent)
//==================================
{
	var filename = ""; // to avoid problem : filename with accents	
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var html ="";
	html += " <span id='editimage_"+this.id+"_"+langcode+"'>"+this.getView('editimage_'+this.id+"_"+langcode,'editor',langcode)+"</span> ";
	var url = serverBCK+"/resources/resource/file/"+this.id+"?lang="+languages[langcode];
	html +=" <div id='divfileupload_"+this.id+"_"+langcode+"' >";
	html +=" <input id='fileupload_"+this.id+"_"+langcode+"' type='file' name='uploadfile' data-url='"+url+"'>";
	html += "</div>";
	html +=" <div id='progress_"+this.id+"_"+langcode+"''><div class='bar' style='width: 0%;'></div></div>";
	html += "<span id='fileimage_"+this.id+"_"+langcode+"'>"+$(this.filename_node[langcode]).text()+"</span>";
	html += "<span id='loaded_"+this.id+langcode+"'></span>"
	html +=  " <button type='button' class='btn ' onclick=\"UIFactory.Image.remove('"+this.id+"',"+langcode+")\">"+karutaStr[LANG]['button-delete']+"</button>";
	if (USER.admin || g_userroles[0]=='designer') {
		var semtag =  ($("metadata",this.node)[0]==undefined || $($("metadata",this.node)[0]).attr('semantictag')==undefined)?'': $($("metadata",this.node)[0]).attr('semantictag');
		if (semtag=="config-img-css")
			html += "<div class='iamge-url'>url : ../../../"+serverBCK+"/resources/resource/file/"+this.id+"</div>";
	}
	$("#"+destid).append($(html));
	var loadedid = 'loaded_'+this.id+langcode;
	$('#fileupload_'+this.id+"_"+langcode).fileupload({
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
			$("#progress_"+this.id+"_"+langcode).css('border','1px solid lightgrey');
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#progress_'+this.id+"_"+langcode+' .bar').css('width',progress + '%');
		},
		done: function (e, data) {
			$("#wait-window").modal('hide');
			var uuid = data.url.substring(data.url.lastIndexOf('/')+1,data.url.indexOf('?'));
			UIFactory["Image"].update(data.result,uuid,langcode,parent,filename);
			$("#"+loadedid).html(" <i class='fa fa-check'></i>");
		}
	});
	var resizeroles = $("metadata-wad",this.node).attr('resizeroles');
	if (resizeroles==undefined)
		resizeroles="";
	if ((g_userroles[0]=='designer' || USER.admin || resizeroles.containsArrayElt(g_userroles) || resizeroles.indexOf(this.userrole)>-1) ) {
		//---------------------
		var htmlFormObj = $("<form class='form-horizontal' style='margin-top:10px'></form>");
		//---------------------
		var width = $(this.width_node[langcode]).text();
		if (this.encrypted)
			width = decrypt(width.substring(3),g_rc4key);
		var htmlWidthGroupObj = $("<div class='form-group'></div>")
		var htmlWidthLabelObj = $("<label for='width_"+this.id+"_"+langcode+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['width']+"</label>");
		var htmlWidthDivObj = $("<div class='col-sm-9'></div>");
		var htmlWidthInputObj = $("<input id='width_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+width+"\">");
		var self = this;
		$(htmlWidthInputObj).change(function (){
			$(self.width_node[langcode]).text($(this).val());
			self.save();
		});
		$(htmlWidthDivObj).append($(htmlWidthInputObj));
		$(htmlWidthGroupObj).append($(htmlWidthLabelObj));
		$(htmlWidthGroupObj).append($(htmlWidthDivObj));
		$(htmlFormObj).append($(htmlWidthGroupObj));
		//---------------------
		var height = $(this.height_node[langcode]).text();
		if (this.encrypted)
			height = decrypt(height.substring(3),g_rc4key);
		var htmlHeightGroupObj = $("<div class='form-group'></div>")
		var htmlHeightLabelObj = $("<label for='height_"+this.id+"_"+langcode+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['height']+"</label>");
		var htmlHeightDivObj = $("<div class='col-sm-9'></div>");
		var htmlHeightInputObj = $("<input id='height_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+height+"\">");
		var self = this;
		$(htmlHeightInputObj).change(function (){
			$(self.height_node[langcode]).text($(this).val());
			self.save();
		});
		$(htmlHeightDivObj).append($(htmlHeightInputObj));
		$(htmlHeightGroupObj).append($(htmlHeightLabelObj));
		$(htmlHeightGroupObj).append($(htmlHeightDivObj));
		$(htmlFormObj).append($(htmlHeightGroupObj));
		//---------------------
		var alt = $(this.alt_node[langcode]).text();
		if (this.encrypted)
			alt = decrypt(alt.substring(3),g_rc4key);
		var htmlaltGroupObj = $("<div class='form-group'></div>")
		var htmlaltLabelObj = $("<label for='alt_"+this.id+"_"+langcode+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['alt']+"</label>");
		var htmlaltDivObj = $("<div class='col-sm-9'></div>");
		var htmlaltInputObj = $("<input id='alt_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+alt+"\">");
		var self = this;
		$(htmlaltInputObj).change(function (){
			$(self.alt_node[langcode]).text($(this).val());
			self.save();
		});
		$(htmlaltDivObj).append($(htmlaltInputObj));
		$(htmlaltGroupObj).append($(htmlaltLabelObj));
		$(htmlaltGroupObj).append($(htmlaltDivObj));
		$(htmlFormObj).append($(htmlaltGroupObj));
		//---------------------
		if (g_userroles[0]=='designer' || USER.admin) {
			//---------------------
			var code = $(this.code_node).text();
			if (this.encrypted)
				code = decrypt(code.substring(3),g_rc4key);
			var htmlcodeGroupObj = $("<div class='form-group'></div>")
			var htmlcodeLabelObj = $("<label for='code_"+this.id+"_"+langcode+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['code']+"</label>");
			var htmlcodeDivObj = $("<div class='col-sm-9'></div>");
			var htmlcodeInputObj = $("<input id='code_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+code+"\">");
			var self = this;
			$(htmlcodeInputObj).change(function (){
				$(self.code_node).text($(this).val());
				self.save();
			});
			$(htmlcodeDivObj).append($(htmlcodeInputObj));
			$(htmlcodeGroupObj).append($(htmlcodeLabelObj));
			$(htmlcodeGroupObj).append($(htmlcodeDivObj));
			$(htmlFormObj).append($(htmlcodeGroupObj));
			//---------------------
			var value = $(this.value_node).text();
			if (this.encrypted)
				value = decrypt(value.substring(3),g_rc4key);
			var htmlvalueGroupObj = $("<div class='form-group'></div>")
			var htmlvalueLabelObj = $("<label for='value_"+this.id+"_"+langcode+"' class='col-sm-3 control-label'>"+karutaStr[LANG]['value']+"</label>");
			var htmlvalueDivObj = $("<div class='col-sm-9'></div>");
			var htmlvalueInputObj = $("<input id='value_"+this.id+"_"+langcode+"' type='text' class='form-control' value=\""+value+"\">");
			var self = this;
			$(htmlvalueInputObj).change(function (){
				$(self.value_node).text($(this).val());
				self.save();
			});
			$(htmlvalueDivObj).append($(htmlvalueInputObj));
			$(htmlvalueGroupObj).append($(htmlvalueLabelObj));
			$(htmlvalueGroupObj).append($(htmlvalueDivObj));
			$(htmlFormObj).append($(htmlvalueGroupObj));
			//---------------------
		}
		//---------------------
		$("#"+destid).append(htmlFormObj);
		//---------------------
//		UIFactory.Image.resizeImage(this.id);
	}
};

//==================================
UIFactory["Image"].prototype.save = function(parent,delfile)
//==================================
{
	if (delfile!=null && delfile)
		UICom.UpdateResource(this.id,writeSaved,null,delfile);
	else
		UICom.UpdateResource(this.id,writeSaved);
	window.setTimeout(this.refresh(),1000 );
	if (parent!=null) // --- structured resource
		window.setTimeout(parent.refresh(),2000 );
	if (this.blockparent!=null)
		this.blockparent.refresh();
};

//==================================
UIFactory["Image"].prototype.refresh = function()
//==================================
{
	for (dest in this.display) {
		this.displayView(dest,this.displayType[dest],this.display[dest]);
	};		
};

