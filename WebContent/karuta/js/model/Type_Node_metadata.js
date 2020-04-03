



//==============================================================================
//==============================================================================
//==============================================================================
UIFactory["Node"].prototype.setMetadata = function(dest,depth,langcode,edit,inline,backgroundParent,parent,menu,inblock)
//==============================================================================
//==============================================================================
//==============================================================================
{
	this.depth = depth;
	if (edit==null || edit==undefined)
		this.edit = false;
	else
		this.edit = edit;
	if (inline==null || inline==undefined)
		this.inline = false;
	else
		this.inline = inline
	if (menu==null || menu==undefined)
		this.menu = true;
	else
		this.menu = menu;
	if (inblock==null || inblock==undefined)
		this.inblock = false;
	else
		this.inblock = inblock;
	this.parent = parent;
	//-----------------------------
	var data = this.node;
	var uuid = this.id;
	var node = UICom.structure["ui"][uuid];
	// ---- store info to redisplay after change ---
	//------------------metadata----------------------------
	this.nodetype = $(data).prop("nodeName"); // name of the xml tag
	this.writenode = ($(node.node).attr('write')=='Y')? true:false;
	this.semtag =  ($("metadata",data)[0]==undefined || $($("metadata",data)[0]).attr('semantictag')==undefined)?'': $($("metadata",data)[0]).attr('semantictag');
	this.collapsed = 'N';
	if (!g_designerrole)
		this.collapsed = (sessionStorage.getItem('collapsed'+uuid)==undefined)?'N':sessionStorage.getItem('collapsed'+uuid);
	else
		this.collapsed = ($(node.metadata).attr('collapsed')==undefined)?'N':$(node.metadata).attr('collapsed');
	this.displayed = ($(node.metadatawad).attr('display')==undefined)?'Y':$(node.metadatawad).attr('display');
	this.collapsible = ($(node.metadatawad).attr('collapsible')==undefined)?'N':$(node.metadatawad).attr('collapsible');
	this.resnopencil = ($(node.metadatawad).attr('resnopencil')==undefined)?'N':$(node.metadatawad).attr('resnopencil');
	this.nodenopencil = ($(node.metadatawad).attr('nodenopencil')==undefined)?'N':$(node.metadatawad).attr('nodenopencil');
	this.editcoderoles = ($(node.metadatawad).attr('editcoderoles')==undefined)?'':$(node.metadatawad).attr('editcoderoles');
	this.editnoderoles = ($(node.metadatawad).attr('editnoderoles')==undefined)?'':$(node.metadatawad).attr('editnoderoles');
	this.delnoderoles = ($(node.metadatawad).attr('delnoderoles')==undefined)?'':$(node.metadatawad).attr('delnoderoles');
	this.commentnoderoles = ($(node.metadatawad).attr('commentnoderoles')==undefined)?'':$(node.metadatawad).attr('commentnoderoles');
	this.showroles = ($(node.metadatawad).attr('showroles')==undefined)?'':$(node.metadatawad).attr('showroles');
	this.showtoroles = ($(node.metadatawad).attr('showtoroles')==undefined)?'':$(node.metadatawad).attr('showtoroles');
	this.editresroles = ($(node.metadatawad).attr('editresroles')==undefined)?'':$(node.metadatawad).attr('editresroles');
	this.inline_metadata = ($(node.metadata).attr('inline')==undefined)? '' : $(node.metadata).attr('inline');
	if (this.inline_metadata=='Y')
		this.inline = true;
	this.seenoderoles = ($(node.metadatawad).attr('seenoderoles')==undefined)? 'all' : $(node.metadatawad).attr('seenoderoles');
	this.shareroles = ($(node.metadatawad).attr('shareroles')==undefined)?'none':$(node.metadatawad).attr('shareroles');
	this.seeqrcoderoles = ($(node.metadatawad).attr('seeqrcoderoles')==undefined)?'':$(node.metadatawad).attr('seeqrcoderoles');
	this.moveroles = ($(node.metadatawad).attr('moveroles')==undefined)?'':$(node.metadatawad).attr('moveroles');
	this.moveinroles = ($(node.metadatawad).attr('moveinroles')==undefined)?'none':$(node.metadatawad).attr('moveinroles');
	this.printroles = ($(node.metadatawad).attr('printroles')==undefined)?'':$(node.metadatawad).attr('printroles');
	this.privatevalue = ($(node.metadatawad).attr('private')==undefined)?false:$(node.metadatawad).attr('private')=='Y';
	this.submitted = ($(node.metadatawad).attr('submitted')==undefined)?'none':$(node.metadatawad).attr('submitted');
	this.logcode = ($(node.metadatawad).attr('logcode')==undefined)?'':$(node.metadatawad).attr('logcode');
	if (this.submitted=='Y') {
		this.menu = false;
	}
	this.cssclass = ($(node.metadataepm).attr('cssclass')==undefined)?'':$(node.metadataepm).attr('cssclass');
	this.displayview = ($(node.metadataepm).attr('displayview')==undefined)?'':$(node.metadataepm).attr('displayview');
	//-------------------- test if visible
	this.visible =  ( this.displayed=='N' && (g_userroles[0]=='designer'  || USER.admin)
				|| ( this.displayed=='Y' && ( this.seenoderoles.indexOf(USER.username)>-1 
									|| this.seenoderoles.indexOf("all")>-1 
									|| this.seenoderoles.containsArrayElt(g_userroles) 
									|| (this.showtoroles.indexOf("all")>-1 && !this.privatevalue) 
									|| (this.showtoroles.containsArrayElt(g_userroles) && !this.privatevalue) 
									|| g_userroles[0]=='designer')
					)
				);
	this.submitroles = ($(node.metadatawad).attr('submitroles')==undefined)?'none':$(node.metadatawad).attr('submitroles');
	this.submitall = ($(node.metadatawad).attr('submitall')==undefined)?'none':$(node.metadatawad).attr('submitall');
	this.submitted = ($(node.metadatawad).attr('submitted')==undefined)?'N':$(node.metadatawad).attr('submitted');
	this.submitteddate = ($(node.metadatawad).attr('submitteddate')==undefined)?'none':$(node.metadatawad).attr('submitteddate');
	this.duplicateroles = ($(node.metadatawad).attr('duplicateroles')==undefined)?'none':$(node.metadatawad).attr('duplicateroles');
	this.incrementroles = ($(node.metadatawad).attr('incrementroles')==undefined)?'none':$(node.metadatawad).attr('incrementroles');
	this.menuroles = ($(node.metadatawad).attr('menuroles')==undefined)?'none':$(node.metadatawad).attr('menuroles');
	this.menulabels = ($(node.metadatawad).attr('menulabels')==undefined)?'none':$(node.metadatawad).attr('menulabels');
	if (this.resource!=undefined || this.resource!=null)
		this.editable_in_line = this.resource.type!='Proxy' && this.resource.type!='Audio' && this.resource.type!='Video' && this.resource.type!='Document' && this.resource.type!='Image' && this.resource.type!='URL';
}

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------- STYLES ---------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================================
UIFactory["Node"].prototype.getNodeStyle = function()
//==================================================
{
	metadataepm = this.metadataepm;
	var style = "";
	style += UIFactory.Node.getMetadataEpm(metadataepm,'nds-margin-top',true);
	style += UIFactory.Node.getOtherMetadataEpm(metadataepm,'nds-othercss');
	return style;
}


//==================================================
UIFactory["Node"].getLabelStyle = function(uuid)
//==================================================
{
	var node = UICom.structure["ui"][uuid];
	metadataepm = node.metadataepm;
	var style = "";
	style += UIFactory.Node.getMetadataEpm(metadataepm,'padding-top',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'font-size',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'font-weight',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'font-style',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'color',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'text-align',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'background-color',false);
	style += UIFactory.Node.getOtherMetadataEpm(metadataepm,'othercss');
	return style;
}

//==================================================
UIFactory["Node"].prototype.getLabelStyle = function()
//==================================================
{
	metadataepm = this.metadataepm;
	var style = "";
	style += UIFactory.Node.getMetadataEpm(metadataepm,'padding-top',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'font-size',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'font-weight',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'font-style',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'color',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'text-align',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'background-color',false);
	style += UIFactory.Node.getOtherMetadataEpm(metadataepm,'othercss');
	return style;
}

//==================================================
UIFactory["Node"].getContentStyle = function(uuid)
//==================================================
{
	var node = UICom.structure["ui"][uuid];
	metadataepm = node.metadataepm;
	var style = "";
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-padding-top',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-font-size',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-font-weight',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-font-style',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-color',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-text-align',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-background-color',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-width',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-height',true);
	style += UIFactory.Node.getOtherMetadataEpm(metadataepm,'node-othercss');
	return style;
}

//==================================================
UIFactory["Node"].getDataContentStyle = function(data)
//==================================================
{
	var style = "";
	style += UIFactory.Node.getMetadataEpm(data,'node-padding-top',true);
	style += UIFactory.Node.getMetadataEpm(data,'node-font-size',true);
	style += UIFactory.Node.getMetadataEpm(data,'node-font-weight',false);
	style += UIFactory.Node.getMetadataEpm(data,'node-font-style',false);
	style += UIFactory.Node.getMetadataEpm(data,'node-color',false);
	style += UIFactory.Node.getMetadataEpm(data,'node-text-align',false);
	style += UIFactory.Node.getMetadataEpm(data,'node-background-color',false);
	style += UIFactory.Node.getMetadataEpm(data,'node-width',true);
	style += UIFactory.Node.getMetadataEpm(data,'node-height',true);
	style += UIFactory.Node.getOtherMetadataEpm(data,'node-othercss');
	return style;
}


//==================================================
UIFactory["Node"].prototype.getContentStyle = function()
//==================================================
{
	metadataepm = this.metadataepm;
	var style = "";
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-padding-top',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-font-size',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-font-weight',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-font-style',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-color',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-text-align',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-background-color',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-width',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'node-height',true);
	style += UIFactory.Node.getOtherMetadataEpm(metadataepm,'node-othercss');
	return style;
}

//==================================================
UIFactory["Node"].getCommentStyle = function(uuid)
//==================================================
{
	var node = UICom.structure["ui"][uuid];
	metadataepm = node.metadataepm;
	var style = "";
	style += UIFactory.Node.getMetadataEpm(metadataepm,'comment-font-size',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'comment-font-weight',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'comment-font-style',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'comment-color',false);
	return style;
}

//==================================================
UIFactory["Node"].prototype.getCommentStyle = function()
//==================================================
{
	metadataepm = this.metadataepm;
	var style = "";
	style += UIFactory.Node.getMetadataEpm(metadataepm,'comment-font-size',true);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'comment-font-weight',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'comment-font-style',false);
	style += UIFactory.Node.getMetadataEpm(metadataepm,'comment-color',false);
	return style;
}

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//-------------------- RIGHTS ------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

var roles_by_role = {};

//==================================
var RoleRights = function(node,uuid)
//==================================
{
	this.node = node;
	this.uuid = uuid;
	this.name = $(node).attr('name');
	this.rights = {};
	this.rights['RD'] = $("right",node).attr("RD");
	this.rights['WR'] = $("right",node).attr("WR");
	this.rights['DL'] = $("right",node).attr("DL");
	this.rights['SB'] = $("right",node).attr("SB");
};

//==================================
RoleRights.update = function(rolename,attribute,value,checked)
//==================================
{
	var role = roles_by_role[rolename];
	if (checked!=undefined && !checked)
		value = "N";
	role.rights[attribute] = value;
	RoleRights.save(rolename);
};

//==================================
RoleRights.save = function(rolename)
//==================================
{
	var role = roles_by_role[rolename];
	var xml = "";
	xml += "<node>";
	xml += "<role name='"+role.name+"'>";
	xml += "<right RD='"+role.rights['RD']+"' WR='"+role.rights['WR']+"' DL='"+role.rights['DL']+"' SB='"+role.rights['SB']+"' />";
	xml += "</role>";
	xml += "</node>";
	$.ajax({
		type : "POST",
		dataType : "xml",
		contentType: "application/xml",
		data:xml,
		url : serverBCK_API+"/nodes/node/"+role.uuid+"/rights"
	});
};


//==================================
RoleRights.prototype.getEditor = function()
//==================================
{
	var html = "";
	html+= "<tr>";
	html+= "<td>"+this.name+"</td>";
	html+= "<td style='text-align:center'><input type='checkbox' onchange=\"javascript:RoleRights.update('"+this.name+"','RD',this.value,this.checked)\" value='Y'";
	if (this.rights['RD']=='Y')
		html += " checked=true' ";
	html+= "></td>";
	html+= "<td style='text-align:center'><input type='checkbox' onchange=\"javascript:RoleRights.update('"+this.name+"','WR',this.value,this.checked)\" value='Y'";
	if (this.rights['WR']=='Y')
		html += " checked=true' ";
	html+= "></td>";
	html+= "<td style='text-align:center'><input type='checkbox' onchange=\"javascript:RoleRights.update('"+this.name+"','DL',this.value,this.checked)\" value='Y'";
	if (this.rights['DL']=='Y')
		html += " checked=true' ";
	html+= "></td>";
	html+= "<td style='text-align:center'><input type='checkbox' onchange=\"javascript:RoleRights.update('"+this.name+"','SB',this.value,this.checked)\" value='Y'";
	if (this.rights['SB']=='Y')
		html += " checked=true' ";
	html+= "></td>";
	html+= "</tr>";
	return html;
};

//==================================
UIFactory["Node"].prototype.getRights = function()
//==================================
{
	var rights = null;
	$.ajaxSetup({async: false});
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/"+this.id+"/rights",
		success : function(data) {
			rights = data;
		}
	});
	$.ajaxSetup({async: true});
	return rights;
}


//==================================
UIFactory["Node"].prototype.displayRights = function(destid)
//==================================
{
	var html = "";
	roles_by_role = {};
	var rights = this.getRights(this.id);
	var roles = $("role",rights);
	html += "<table id='rights'>";
	html+= "<tr><td></td><td> Read </td><td> Write </td><td> Delete </td><td> Submit </td>";
	for (var i=0;i<roles.length;i++){
		var rolename = $(roles[i]).attr("name");
		roles_by_role[rolename] = new RoleRights(roles[i],this.id);
	}
	for (role in roles_by_role) {
		html += roles_by_role[role].getEditor();
	}
	html += "<table>";
	$("#"+destid).append($(html));
}

//==================================
UIFactory["Node"].displayIfModel = function(rootid)
//==================================
{
	var rights = null;
	$.ajax({
		type : "GET",
		dataType : "xml",
		url : serverBCK_API+"/nodes/node/"+rootid+"/rights",
		success : function(data) {
			rights = data;
			var roles = $("role",rights);
			var model = roles.length==0;
			if (!model)
				$("#instance_"+rooid).html('<span class="fas fa-file" aria-hidden="true"></span>');

		}
	});
}


//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//-------------------- METADATA ----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------


//==================================================
UIFactory["Node"].prototype.displayMetadataAttributesEditor = function(destid)
//==================================================
{
	var langcode = LANGCODE;
	var html = "";
	html += "<form id='metadata' class='metadata'>";
	html += "	<div id='metadata-root'></div>";
	html += "	<div id='metadata-part1'></div>"
	html += "	<h4>"+karutaStr[LANG]['metadata']+"</h4>";
	html += "	<div id='metadata-rights'></div>";
	html += "	<div id='metadata-part2'></div>";
	html += "	<div id='metadata_texts'></div>";
	html += "</form>";
	$("#"+destid).append($(html));
	//---------------------------------------------------
	var model = portfolios_byid[g_portfolioid].model;
	//---------------------------------------------------
	var name = this.asmtype;
	var semtag =  ($("metadata",this.node)[0]==undefined)?'': $($("metadata",this.node)[0]).attr('semantictag');
	if (semtag==undefined) // for backward compatibility - node without semantic tag
		semtag = '';
	var resource_type = "";
	if (this.resource!=null)
		resource_type = this.resource.type;
	if (name=='asmRoot') {
		this.displayMetadataAttributeEditor('metadata-root','list-novisible',true);
//		this.displayMetadataAttributeEditor('metadata-root','complex',true);
		this.displayMetadataAttributeEditor('metadata-root','export-pdf',true);
		this.displayMetadataAttributeEditor('metadata-root','export-rtf',true);
		this.displayMetadataAttributeEditor('metadata-root','export-htm',true);
		this.displayMetadataAttributeEditor('metadata-root','public',true);
	}
	if (name=='asmContext' && this.resource.type=='Proxy')
		this.displayMetadataAttributeEditor('metadata-part1','semantictag',false,true);
	else
		this.displayMetadataAttributeEditor('metadata-part1','semantictag');
	if (languages.length>1) { // multilingual application
		this.displayMetadataAttributeEditor('metadata-part1','multilingual-node',true);
		if (name=='asmContext') {
			this.displayMetadataAttributeEditor('metadata-part1','multilingual-resource',true);
		}
	}
	if (name=='asmContext') {
		if (this.resource.type=='Field' || this.resource.type=='TextField' || this.resource.type=='Get_Resource' || this.resource.type=='Get_Get_Resource' || this.resource.type=='Get_Double_Resource')
			this.displayMetadataAttributeEditor('metadata-part1','encrypted',true);
	}
	if (USER.admin && Object.keys(UICom.roles).length>2)
		this.displayRights('metadata-rights');
	if (model)
		this.displayMetadataWadAttributeEditor('metadata-part2','seenoderoles');
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','seenoderoles',false,true);
	this.displayMetadataDateAttributeEditor('see-calendar','seestart');
	this.displayMetadataDateAttributeEditor('see-calendar','seeend');
	if (name=='asmRoot' || !model)
		this.displayMetadataWadAttributeEditor('metadata-part2','delnoderoles',false,true);
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','delnoderoles');
	if ((!model || name=='asmRoot' || name=='asmStructure' || name=='asmUnit' || name=='asmUnitStructure') && semtag.indexOf('node_resource')<0 && this.structured_resource==null)	{
		this.displayMetadataWadAttributeEditor('metadata-part2','editresroles',false,true);
		this.displayMetadataWadAttributeEditor('metadata-part2','resnopencil',false,true);
	}
	else {
		this.displayMetadataWadAttributeEditor('metadata-part2','editresroles');
		this.displayMetadataWadAttributeEditor('metadata-part2','nodenopencil',true);
	}
	if (model)
		this.displayMetadataWadAttributeEditor('metadata-part2','commentnoderoles');
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','commentnoderoles',false,true);
	if (model)
		this.displayMetadataWadAttributeEditor('metadata-part2','submitroles');
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','submitroles',false,true);
	if ((name=='asmRoot' || name=='asmStructure' || name=='asmUnit' || name=='asmUnitStructure') && model)
		this.displayMetadataWadAttributeEditor('metadata-part2','submitall',true);
	//-----------------------------------------
	if (model)
		this.displayMetadataWadAttributeEditor('metadata-part2','editcoderoles');
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','editcoderoles',false,true);
	//-----------------------------------------
	if (model)
		this.displayMetadataWadAttributeEditor('metadata-part2','editnoderoles');
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','editnoderoles',false,true);
	//-----------------------------------------
	if (model)
		this.displayMetadataWadAttributeEditor('metadata-part2','nodenopencil',true);
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','nodenopencil',false,true);
	//-----------------------------------------
	if (name=='asmRoot' || !model)
		this.displayMetadataWadAttributeEditor('metadata-part2','duplicateroles',false,true);
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','duplicateroles');
	//-----------------------------------------
	if (name=='asmRoot' || !model)
		this.displayMetadataWadAttributeEditor('metadata-part2','incrementroles',false,true);
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','incrementroles',true);
	//-----------------------------------------
	if (semtag=='bubble_level1' && model)
		this.displayMetadataWadAttributeEditor('metadata-part2','seeqrcoderoles');
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','seeqrcoderoles',false,true);
	//-----------------------------------------
	if (this.resource_type=='Proxy' && model)
		this.displayMetadataWadAttributeEditor('metadata-part2','edittargetroles');
	//-----------------------------------------
	if (name=='asmContext' && this.resource.type=='Image' && model)
		this.displayMetadataWadAttributeEditor('metadata-part2','resizeroles');
//	this.displayMetadataWadAttributeEditor('metadata-part2','graphicerroles');
	//-----------------------------------------
	if (name=='asmRoot' || !model)
		this.displayMetadataWadAttributeEditor('metadata-part2','moveroles',false,true);
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','moveroles');
	//-----------------------------------------
	this.displayMetadataWadAttributeEditor('metadata-part2','moveinroles');
	this.displayMetadataWadAttributeEditor('metadata-part2','movein');
	//-----------------------------------------
	if (model)
		this.displayMetadataWadAttributeEditor('metadata-part2','showroles');
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','showroles',false,true);
//	if ($(this.metadatawad).attr('showroles')!='')
//		this.displayMetadataWadAttributeEditor(this.id,'private',$(this.metadatawad).attr('private'),true);
	if (model)
		this.displayMetadataWadAttributeEditor('metadata-part2','showtoroles');
	else
		this.displayMetadataWadAttributeEditor('metadata-part2','showtoroles',false,true);
	this.displayMetadataWadAttributeEditor('metadata-part2','printroles');
//	this.displayMetadataWadAttributeEditor('metadata-part2','editboxtitle');
	if (name=='asmContext' && this.resource.type=='TextField')
		this.displayMetadataWadAttributeEditor('metadata-part2','maxword');
	this.displayMetadataWadAttributeEditor('metadata-part2','logcode');
	//--------------------------------------
	if (name!='asmRoot')
		this.displayMetadataWadAttributeEditor('metadata-part2','display',true);
	if (name=='asmUnitStructure')
		this.displayMetadataWadAttributeEditor('metadata-part2','collapsible',true);
	if (name=='asmContext' && this.resource.type!='Proxy' && this.resource.type!='Audio' && this.resource.type!='Video' && this.resource.type!='Document' && this.resource.type!='Image' && this.resource.type!='URL' && this.resource.type!='Oembed')
		this.displayMetadataAttributeEditor('metadata-part2','inline',true);
//	this.displayMetadataWadAttributeEditor(this.id,'veriffunction',$(this.metadatawad).attr('veriffunction'));
	if (resource_type=='Get_Resource' || resource_type=='Get_Get_Resource') {
		this.displayMetadataWadAttributeEditor('metadata-part2','seltype');
	}
	//----------------------Edit Box Title----------------------------
		html  = "<label>"+karutaStr[languages[langcode]]['editboxtitle']+"</label>";
		$("#metadata_texts").append($(html));
		this.displayMetadatawWadTextAttributeEditor('metadata_texts','editboxtitle');
	//----------------------Search----------------------------
	if (resource_type=='Get_Resource' || resource_type=='Get_Double_Resource' || resource_type=='Get_Get_Resource' || resource_type=='Proxy' || resource_type=='Action' || resource_type=='URL2Unit' || name=='asmUnitStructure' || name=='asmUnit' || name=='asmStructure') {
		html  = "<label>"+karutaStr[languages[langcode]]['query'+resource_type]+"</label>";
		$("#metadata_texts").append($(html));
		this.displayMetadatawWadTextAttributeEditor('metadata_texts','query');
	}
	//----------------------Share----------------------------
	if (name=='asmRoot' || name=='asmStructure' || name=='asmUnit' || name=='asmUnitStructure') {
		html  = "<label>"+karutaStr[languages[langcode]]['shareroles'];
		if (languages.length>1){
			var first = true;
			for (var i=0; i<languages.length;i++){
				if (!first)
					html += "/";
				html += karutaStr[languages[i]]['shareroles2'];
				first = false;
			}
		} else {
			html += karutaStr[languages[langcode]]['shareroles2'];
		}
		html += karutaStr[languages[langcode]]['shareroles3']+"</label>";
		$('#metadata_texts').append($(html));
		this.displayMetadatawWadTextAttributeEditor('metadata_texts','shareroles');
	}
	//----------------------Menu----------------------------
	if (name=='asmRoot' || name=='asmStructure' || name=='asmUnit' || name=='asmUnitStructure') {
		//-----------------------
		html  = "<label>"+karutaStr[languages[langcode]]['menuroles'];
		if (languages.length>1){
			var first = true;
			for (var i=0; i<languages.length;i++){
				if (!first)
					html += "/";
				html += karutaStr[languages[i]]['menuroles2'];
				first = false;
			}
		} else {
			html += karutaStr[languages[langcode]]['menuroles2'];
		}
		html += karutaStr[languages[langcode]]['menuroles3']+"</label>";
		$('#metadata_texts').append($(html));
		this.displayMetadatawWadTextAttributeEditor('metadata_texts','menuroles');
		//-----------------------
		html  = "<label>"+karutaStr[languages[langcode]]['menulabels'];
		if (languages.length>1){
			var first = true;
			for (var i=0; i<languages.length;i++){
				if (!first)
					html += "/";
				html += karutaStr[languages[i]]['menulabels2'];
				first = false;
			}
		} else {
			html += karutaStr[languages[langcode]]['menulabels2'];
		}
		html += karutaStr[languages[langcode]]['menulabels3']+"</label>";
		$("#metadata_texts").append($(html));
		this.displayMetadatawWadTextAttributeEditor('metadata_texts','menulabels');
		//-----------------------
	}
	//------------------------Help-------------------------
	html = "<br><label>"+karutaStr[languages[langcode]]['help'];
	if (languages.length>1){
		var first = true;
		for (var i=0; i<languages.length;i++){
			if (!first)
				html += "/";
			html += karutaStr[languages[i]]['help2'];
			first = false;
		}
	}
	html += karutaStr[languages[langcode]]['help3']+"</label>";
	$('#metadata_texts').append($(html));
	this.displayMetadatawWadTextAttributeEditor('metadata_texts','help');
};

//---------------------------------------------------------
//--------- styles getters to display nodes ---------------
//---------------------------------------------------------

//==================================================
UIFactory["Node"].getMetadataEpm = function(data,attribute,number)
//==================================================
{
	var html = "";
	if (data.getAttribute(attribute)!=undefined && data.getAttribute(attribute)!="") {
		var value = data.getAttribute(attribute);
		if (attribute.indexOf("inparent-othercss")>-1)
			html += attribute.substring(17) + value;
		else if (attribute.indexOf("node-othercss")>-1)
			html += attribute.substring(13) + value;
		else if (attribute.indexOf("othercss")>-1)
			html += attribute.substring(8) + value;
		else if (attribute.indexOf("node-")>-1)
			html += attribute.substring(5) + ":" + value;
		else if (attribute.indexOf("nds-")>-1)
			html += attribute.substring(4) + ":" + value;
		else if (attribute.indexOf("inparent-")>-1)
			html += attribute.substring(9) + ":" + value;
		else if (attribute.indexOf("comment-")>-1)
			html += attribute.substring(8) + ":" + value;
		else
			html += attribute + ":" + value;
		if (attribute.indexOf("font-size")>-1 && number && value.indexOf('%')<0 && value.indexOf('px')<0 && value.indexOf('pt')<0)
			html += 'px';			
		else if (number && value.indexOf('%')<0 && value.indexOf('px')<0 && value.indexOf('pt')<0)
			html += 'px';
		html += ';';
	}	return html;
};

//==================================================
UIFactory["Node"].getOtherMetadataEpm = function(data,attribute)
//==================================================
{
	var html = "";
	if (data.getAttribute(attribute)!=undefined && data.getAttribute(attribute)!="") {
		var value = data.getAttribute(attribute);
		html += value;
	}	return html;
};

//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//--------------------------- displaySemanticTags ----------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

//==================================
UIFactory["Node"].prototype.displaySemanticTags = function(destid,langcode)
//==================================
{
	//---------------------
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	if (this.seenoderoles==null)
		this.setMetadata();
	//---------------------
	var semtag = this.semantictag; //		this.semantictag = $("metadata",node).attr('semantictag');
	var label = this.getLabel(null,'none',langcode);
	var type = (this.resource_type==null)? this.asmtype : this.resource_type;
	var html ="";
	html += "<div class='semtag-line'>";
	html += "	<div class='semtag-line-header'>";
	html += "		<span class='semtag-label'>"+label+"</span>";
	html += "		<span class='node-type'> "+type+" </span>";
	html += "		<span class='badge badge-pill semtag-value'>"+semtag+"</span>";
	html += "	</div>";
	html += "	<div class='roles-line' id='roles-line_"+this.id+"'></div>";
	html += "	<div id='content-"+this.id+"' class='semtag-line-content'></div>";
	html += "</div>";
	$('#'+destid).append($(html));
	this.displayMainRoles("roles-line_"+this.id);
	var children = $(this.node).children();
	for (var i=0;i<children.length;i++){
			var tagname = $(children[i])[0].tagName;
			if (tagname=="asmStructure" || tagname=="asmUnit" || tagname=="asmUnitStructure" || tagname=="asmContext") {
				var child = UICom.structure.ui[$(children[i]).attr('id')];
				if (child.semantictag!='welcome-unit' && child.semantictag!='configuration-unit' && child.semantictag!='WELCOME')
					child.displaySemanticTags("content-"+this.id,langcode);
			}
	}
};

//==================================================
UIFactory["Node"].prototype.displayMainRoles = function(destid)
//==================================================
{
	var html = "";
	html += "<table class='main-roles'>";
	html += "	<tr>";
	html += "		<td>"+karutaStr[LANG]['seenoderoles']+"</td>"
	html += "		<td>"+karutaStr[LANG]['editresroles']+"</td>"
	html += "		<td>"+karutaStr[LANG]['delnoderoles']+"</td>"
	html += "		<td>"+karutaStr[LANG]['editnoderoles']+"</td>"
	html += "	</tr>";
	html += "	<tr>";
	html += "		<td>"+this.seenoderoles+"</td>"
	html += "		<td>"+this.editresroles+"</td>"
	html += "		<td>"+this.delnoderoles+"</td>"
	html += "		<td>"+this.editnoderoles+"</td>"
	html += "</tr>";
	html += "</table>";
	$("#"+destid).html(html);

}

//---------------------------------------------------------
//--------------------- display metainfo ------------------
//---------------------------------------------------------


//==================================================
UIFactory["Node"].getMetadataInfo = function(data,attribute)
//==================================================
{
	var html = "";
	if (data.getAttribute(attribute)!=undefined && data.getAttribute(attribute)!="")
		html += "<span>"+attribute+":"+data.getAttribute(attribute)+"| </span>";
	return html;
};

//==================================================
UIFactory["Node"].getMetadataEpmInfo = function(data,attribute)
//==================================================
{
	var html = "";
	if ($("metadata-epm",data).attr(attribute)!=undefined && $("metadata-epm",data).attr(attribute)!="")
		html += "<span>"+attribute+":"+$("metadata-epm",data).attr(attribute)+"| </span>";
	return html;
};

//==================================================
UIFactory["Node"].prototype.displayMetainfo = function(destid)
//==================================================
{
	var data = this.node;
	var html = "";
	var type = $(data).prop("nodeName");
	if (type=='asmContext') {
		var asmResources = $("asmResource",data);
		type = $(asmResources[2]).attr('xsi_type');
	}
	html += "<span>"+karutaStr[languages[LANGCODE]][type]+" - </span>";
	var metadata = data.querySelector("metadata");
	var metadatawad = data.querySelector("metadata-wad");
	if (metadata.getAttribute('semantictag')!=undefined && metadata.getAttribute('semantictag')!="")
		html += "<span>semantictag:"+metadata.getAttribute('semantictag')+"| </span>";
	html += UIFactory.Node.getMetadataInfo(metadatawad,'seenoderoles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'seestart');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'seeend');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'editresroles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'delnoderoles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'commentnoderoles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'submitroles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'editcoderoles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'editnoderoles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'duplicateroles');
//	html += UIFactory.Node.getMetadataInfo(metadatawad,'incrementroles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'query');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'display');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'menuroles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'notifyroles');
//	html += UIFactory.Node.getMetadataInfo(metadatawad,'graphicerroles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'resizeroles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'edittargetroles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'showroles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'showtoroles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'moveroles');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'inline');
	html += UIFactory.Node.getMetadataInfo(metadatawad,'printroles');
	$("#"+destid).html(html);
};

//==================================================
UIFactory["Node"].displayMetainfo = function(destid,data)  // for backward compatibiliy
//==================================================
{
	var uuid = data.getAttribute("id");
	UICom.structure.ui[uuid].displayMetainfo(destid);
};

//==================================================
UIFactory["Node"].prototype.displayMetaEpmInfo = function(destid)
//==================================================
{
	var data = this.node;
	var html = "";
	html += UIFactory.Node.getMetadataEpmInfo(data,'cssclass');
	html += UIFactory.Node.getMetadataEpmInfo(data,'displayview');
	//------------------------------------
	html += UIFactory.Node.getMetadataEpmInfo(data,'nds-margin-top');
	html += UIFactory.Node.getMetadataEpmInfo(data,'nds-othercss');
	//------------------------------------
	html += UIFactory.Node.getMetadataEpmInfo(data,'node-font-weight');
	html += UIFactory.Node.getMetadataEpmInfo(data,'node-font-style');
	html += UIFactory.Node.getMetadataEpmInfo(data,'node-text-align');
	html += UIFactory.Node.getMetadataEpmInfo(data,'node-font-size');
	html += UIFactory.Node.getMetadataEpmInfo(data,'node-font-weight');
	html += UIFactory.Node.getMetadataEpmInfo(data,'node-color');
	html += UIFactory.Node.getMetadataEpmInfo(data,'node-padding-top');
	html += UIFactory.Node.getMetadataEpmInfo(data,'node-background-color');
	html += UIFactory.Node.getMetadataEpmInfo(data,'node-othercss');
	//------------------------------------
	html += UIFactory.Node.getMetadataEpmInfo(data,'font-weight');
	html += UIFactory.Node.getMetadataEpmInfo(data,'font-style');
	html += UIFactory.Node.getMetadataEpmInfo(data,'text-align');
	html += UIFactory.Node.getMetadataEpmInfo(data,'font-size');
	html += UIFactory.Node.getMetadataEpmInfo(data,'font-weight');
	html += UIFactory.Node.getMetadataEpmInfo(data,'color');
	html += UIFactory.Node.getMetadataEpmInfo(data,'padding-top');
	html += UIFactory.Node.getMetadataEpmInfo(data,'background-color');
	html += UIFactory.Node.getMetadataEpmInfo(data,'othercss');
	//------------------------------------
	html += UIFactory.Node.getMetadataEpmInfo(data,'inparent-font-weight');
	html += UIFactory.Node.getMetadataEpmInfo(data,'inparent-font-style');
	html += UIFactory.Node.getMetadataEpmInfo(data,'inparent-text-align');
	html += UIFactory.Node.getMetadataEpmInfo(data,'inparent-font-size');
	html += UIFactory.Node.getMetadataEpmInfo(data,'inparent-font-weight');
	html += UIFactory.Node.getMetadataEpmInfo(data,'inparent-color');
	html += UIFactory.Node.getMetadataEpmInfo(data,'inparent-padding-top');
	html += UIFactory.Node.getMetadataEpmInfo(data,'inparent-background-color');
	html += UIFactory.Node.getMetadataEpmInfo(data,'inparent-othercss');
	//------------------------------------
	if (html!="")
		html = "CSS - " + html;
	$("#"+destid).html(html);
};

//==================================================
UIFactory["Node"].displayMetaEpmInfos = function(destid,data)
//==================================================
{
	var uuid = data.getAttribute("id");
	UICom.structure.ui[uuid].displayMetaEpmInfo(destid);
};


//---------------------------------------------------------
//-------------metadata-wad editors -----------------------
//---------------------------------------------------------

//==================================================
UIFactory["Node"].prototype.displayMetadataDisplayTypeAttributeEditor = function(destid,attribute,yes_no,disabled)
//==================================================
{
	var display_types = ['standard','basic','model'];
	var value = $(this.metadata).attr('display-type');
	var langcode = LANGCODE;
	if (value==null || value==undefined || value=='undefined')
		value = "";
	var html = "";
	html += "<div class='form-group form-row'>";
	html += "  <label class='col-4 control-label'>"+karutaStr[languages[langcode]][attribute]+"</label>";
		html += "  <div class='col-8'><select class='form-control form-control-sm' onchange=\"javascript:UIFactory.Node.updateMetadataSelectAttribute('"+this.id+"','"+attribute+"',this)\"";
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		html+= ">";
		for (var i=0; i<display_types.length; i++) {
			html += "<option value='"+display_types[i]+"'";
			if (value==display_types[i])
				html += " selected ";
			html += ">"+display_types[i]+"</option>";
		}
		html+= "</select>";
		html+= "</div>";
	html += "</div>";
	$("#"+destid).append($(html));
};

//==================================================
UIFactory["Node"].prototype.displayMetadataMenuTypeAttributeEditor = function(destid,attribute,yes_no,disabled)
//==================================================
{
	var menu_types = ['vertical','horizontal'];
	var value = $(this.metadata).attr('menu-type');
	var langcode = LANGCODE;
	if (value==null || value==undefined || value=='undefined')
		value = "";
	var html = "";
	html += "<div class='form-group form-row'>";
	html += "  <label class='col-4 control-label'>"+karutaStr[languages[langcode]][attribute]+"</label>";
		html += "  <div class='col-8'><select class='form-control form-control-sm' onchange=\"javascript:UIFactory.Node.updateMetadataSelectAttribute('"+this.id+"','"+attribute+"',this)\"";
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		html+= ">";
		for (var i=0; i<menu_types.length; i++) {
			html += "<option value='"+menu_types[i]+"'";
			if (value==menu_types[i])
				html += " selected ";
			html += ">"+menu_types[i]+"</option>";
		}
		html+= "</select>";
		html+= "</div>";
	html += "</div>";
	$("#"+destid).append($(html));
};


//==================================================
UIFactory["Node"].prototype.displayMetadataAttributeEditor = function(destid,attribute,yes_no,disabled)
//==================================================
{
	var value = $(this.metadata).attr(attribute);
	var langcode = LANGCODE;
	if (value==null || value==undefined || value=='undefined')
		value = "";
	var html = "";
	if (yes_no!=null && yes_no) {
		html += "<div class='input-group '>";
		html += "	<div class='input-group-prepend'>";
		html += "		<div class='input-group-text' id='"+attribute+this.id+"'>"+karutaStr[languages[langcode]][attribute]+"</div>";
		html += "	</div>";
		html += "  <input type='checkbox' onchange=\"javascript:UIFactory['Node'].updateMetadataAttribute('"+this.id+"','"+attribute+"',this.value,this.checked)\" value='Y'";		
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		if (value=='Y')
			html+= " checked ";
		html+= "></div>";
	}
	else {
		html += "<div class='input-group '>";
		html += "	<div class='input-group-prepend'>";
		html += "		<span class='input-group-text' id='"+attribute+this.id+"'>"+karutaStr[languages[langcode]][attribute]+"</span>";
		html += "	</div>";
		html += "<input type='text' class='form-control' aria-label='"+karutaStr[languages[langcode]][attribute]+"' aria-describedby='"+attribute+this.id+"' onchange=\"javascript:UIFactory['Node'].updateMetadataAttribute('"+this.id+"','"+attribute+"',this.value)\" value=\""+value+"\"";
		if (disabled!=null && disabled)
			html+= " disabled='disabled'";
		html+= ">";
		html += "</div>";
	}
	$("#"+destid).append($(html));
};

//==================================================
UIFactory["Node"].prototype.displayMetadataWadAttributeEditor = function(destid,attribute,yes_no,disabled)
//==================================================
{
	var value = $(this.metadatawad).attr(attribute);
	var langcode = LANGCODE;
	if ((value==null || value==undefined || value=='undefined') && attribute=='display')
		value = "Y";
	if (value==null || value==undefined || value=='undefined')
		value = "";
	var html = "";
	if (yes_no!=null && yes_no) {
		html += "<div class='input-group '>";
		html += "	<div class='input-group-prepend'>";
		html += "		<div class='input-group-text' id='"+attribute+this.id+"'>"+karutaStr[languages[langcode]][attribute]+"</div>";
		html += "	</div>";
		html += "  <input type='checkbox' onchange=\"javascript:UIFactory['Node'].updateMetadataWadAttribute('"+this.id+"','"+attribute+"',this.value,this.checked)\" value='Y'";		
		if(disabled!=null && disabled)
			html+= " disabled='disabled' ";			
		if (value=='Y')
			html+= " checked ";
		html+= "></div>";
	}
	else if (attribute.indexOf('seltype')>-1){
		var choices = [{code:'select',label:'Select'},{code:'radio',label:'Radio'},{code:'click',label:'Click'},{code:'completion',label:'Auto-complete'}];
		html += "<div class='input-group '>";
		html += "	<div class='input-group-prepend' style='margin-right:5px'>";
		html += "		<span class='input-group-text' id='"+attribute+this.id+"'>"+karutaStr[languages[langcode]][attribute]+"</span>";
		html += "	</div>";
		for (var i=0; i<choices.length; i++){
			html +="	<div class='form-check form-check-inline'>";
			html += "		<input class='form-check-input' type='radio' name='"+attribute+this.id+"' onchange=\"javascript:UIFactory.Node.updateMetadataWadAttribute('"+this.id+"','"+attribute+"',this.value)\" value='"+choices[i].code+"' ";
			if (value==choices[i].code)
				html +=" checked";
			html +=">";
			html +="		<label class='form-check-label'>"+choices[i].label+"</label>";
			html += "	</div>";
		}
		html += "</div>";
	} else if (attribute.indexOf('roles')>-1){
		this.displaySelectRole(destid,attribute,yes_no,disabled);
	} else {
		html += "<div class='input-group '>";
		html += "	<div class='input-group-prepend'>";
		html += "		<span class='input-group-text' id='"+attribute+this.id+"'>"+karutaStr[languages[langcode]][attribute]+"</span>";
		html += "	</div>";
		html += "<input type='text' class='form-control' aria-label='"+karutaStr[languages[langcode]][attribute]+"' aria-describedby='"+attribute+this.id+"' onchange=\"javascript:UIFactory['Node'].updateMetadataWadAttribute('"+this.id+"','"+attribute+"',this.value)\" value=\""+value+"\"";
		if (disabled!=null && disabled)
			html+= " disabled='disabled'";
		html+= ">";
		html += "</div>";
	}
	if (html!="")
		$("#"+destid).append($(html));
};

//==================================================
UIFactory["Node"].prototype.displayMetadataDateAttributeEditor = function(destid,attribute,yes_no,disabled)
//==================================================
{
	var values = null;
	var value = $(this.metadatawad).attr(attribute);
	if (value==null || value==undefined || value=='undefined' || value=='')
		values = ["",""];
	else
		values = value.split(" ");
	//--------------------------
	var html = "";
	html += "<div class='input-group '>";
	html += "	<div class='input-group-prepend'>";
	html += "		<span class='input-group-text' id='"+attribute+this.id+"'>"+karutaStr[languages[LANGCODE]][attribute]+"</span>";
	html += "	</div>";
	html += "</div>";
	var editor = $(html);

	html = "<form class='form-horizontal' role='form'></form>";
	var form = $(html);
	//------
	html = "<input id='d"+attribute+this.id+"' type='text' name='datepicker' class='datepicker form-control' style='width:150px;' nodeid='"+this.id+"' ";
	if (disabled)
		html += "disabled='disabled' ";
	html += "value=\""+values[0]+"\" >";
	var input1 = $(html);
	var self = this;
	$(input1).change(function (){
		var dvalue = $(this).val();
		var hvalue = $('#h'+attribute+$(this).attr('nodeid')).val();
		if (dvalue==""){
			hvalue = "";
			$('#h'+attribute+$(this).attr('nodeid')).val(hvalue);
		}
		if (dvalue!="" && hvalue=="") {
			hvalue = "00:00";
			$('#h'+attribute+$(this).attr('nodeid')).val(hvalue);
		}
		UIFactory.Node.updateMetadataWadAttribute($(this).attr('nodeid'),attribute,dvalue+" "+hvalue);
	});
	var format = "yyyy-mm-dd";
	var minViewMode = "days";
	$(input1).datepicker({minViewMode:minViewMode,format:format,language:LANG});
	$(form).append(input1);
	$(editor).append(form);
	//---------------------
	var hours = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
	var hoursauto = [];
	for (var i=0;i<hours.length;i++) {
		hoursauto[hoursauto.length] = {'libelle':hours[i]}
	}
	html = "	<input id='h"+attribute+this.id+"' type='text' class='form-control'  onchange=\"$('#d"+attribute+this.id+"').change()\" value=\""+values[1]+"\"";
	if(disabled!=null && disabled)
		html+= " disabled='disabled' ";			
	html += ">";
/*	if(disabled==null || !disabled) {
		html += "<div class='input-group-append'>";
		html += "	<button class='btn btn-select-role dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></button>";
		html += "	<div class='dropdown-menu dropdown-menu-right button-role-caret'>";
//		html += "		<div class='dropdown-menu'>";
		html += "			<a class='dropdown-item' value='' onclick=\"$('#h"+attribute+this.id+"').val('');$('#d"+attribute+this.id+"').change();\")>&nbsp;</a>";
		//---------------------
		for (var i=0;i<hours.length;i++) {
			html += "		<a  class='dropdown-item' value='"+role+"' onclick=\"$('#h"+attribute+this.id+"').val('"+hours[i]+"');$('#d"+attribute+this.id+"').change();\")>"+hours[i]+"</a>";
			hoursauto[hoursauto.length] = {'libelle':hours[i]}
		}
//		html += "		</div>";
		html += "	</div>";
		html += "</div>";
	}
	*/
	var input2 = $(html);
	$(editor).append(input2);
	//---------------------
	$("#"+destid).append(editor);
	addautocomplete(document.getElementById('h'+attribute+this.id), hoursauto);

};

//==================================
UIFactory["Node"].prototype.displayMetadatawWadTextAttributeEditor = function(destid,attribute,type)
//==================================
{
	var nodeid = this.id;
	var text = $(this.metadatawad).attr(attribute)
	if (type==null)
		type = 'default';
	if (text==undefined || text=='undefined')
		text="";
	if (type=='default')
		html = "<div id='"+attribute+"_"+nodeid+"'><textarea id='"+nodeid+"_"+attribute+"' class='form-control' style='height:50px'>"+text+"</textarea></div>";
	else if(type.indexOf('x')>-1) {
		var height = type.substring(type.indexOf('x')+1);
		html = "<div id='"+attribute+"_"+nodeid+"'><textarea id='"+nodeid+"_"+attribute+"' class='form-control' style='height:"+height+"px'>"+text+"</textarea></div>";
	}
	$("#"+destid).append($(html));
	//---------------------------
	$("#"+nodeid+"_"+attribute).change(function(){UIFactory.Node.updateMetadatawWadTextAttribute(nodeid,attribute);});
	//---------------------------
};


//==================================
UIFactory["Node"].prototype.displaySelectRole= function(destid,attribute,yes_no,disabled) 
//==================================
{
	var rolesarray = [];
	var value = $(this.metadatawad).attr(attribute);
	if (value==null || value==undefined || value=='undefined')
		value = "";
	var nodeid = this.id;
	var langcode = LANGCODE;
	var html = "";
	html += "<div class='input-group '>";
	html += "	<div class='input-group-prepend'>";
	html += "		<div class='input-group-text'>";
	html += karutaStr[languages[langcode]][attribute];
	if (attribute=='seenoderoles')
		html += "<a data-toggle='collapse' data-target='#see-calendar' aria-expanded='false'>&nbsp;<span class='fa fa-calendar'></span></a>"
	html += "</div>";
	html += "	</div>";
	html += "	<input id='"+attribute+nodeid+"' type='text' class='form-control'  onchange=\"javascript:UIFactory['Node'].updateMetadataWadAttribute('"+nodeid+"','"+attribute+"',this.value)\" value=\""+value+"\"";
	if(disabled!=null && disabled)
		html+= " disabled='disabled' ";			
	html += ">";
	if(disabled==null || !disabled) {
		html += "<div class='input-group-append'>";
		html += "	<button class='btn btn-select-role dropdown-toggle' type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></button>";
		html += "	<div class='dropdown-menu dropdown-menu-right button-role-caret'>";
//		html += "		<div class='dropdown-menu'>";
		html += "			<a class='dropdown-item' value='' onclick=\"$('#"+attribute+nodeid+"').val('');$('#"+attribute+nodeid+"').change();\")>&nbsp;</a>";
		//---------------------
		for (role in UICom.roles) {
			html += "		<a  class='dropdown-item' value='"+role+"' onclick=\"var v=$('#"+attribute+nodeid+"').val();$('#"+attribute+nodeid+"').val(v+' "+role+"');$('#"+attribute+nodeid+"').change();\")>"+role+"</a>";
			rolesarray[rolesarray.length] = {'libelle':role};
		}
//		html += "		</div>";
		html += "	</div>";
		html += "</div>";
	}
	html += "</div>";
	$("#"+destid).append($(html));
	if (attribute=='seenoderoles'){
		html = "<div id='see-calendar' class='collapse'></div>"
		$("#"+destid).append($(html));
	}
	addautocomplete(document.getElementById(attribute+nodeid), rolesarray);

}

//==================================
function addautocomplete(input,arrayOfValues) {
//==================================
	var currentFocus;
	input.addEventListener("input", function(e) {
		var a, b, i, val = this.value.substring(this.value.lastIndexOf(" ")+1);
		closeAllLists();
		if (!val) { return false;}
	 	currentFocus = -1;
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		this.parentNode.appendChild(a);
		for (i = 0; i < arrayOfValues.length; i++) {
			var indexval = arrayOfValues[i].libelle.toUpperCase().indexOf(val.toUpperCase());
			if (indexval>-1) {
				b = document.createElement("DIV");
				b.innerHTML = arrayOfValues[i].libelle.substr(0, indexval);
				b.innerHTML += "<strong>" + arrayOfValues[i].libelle.substr(indexval,val.length) + "</strong>";
				b.innerHTML += arrayOfValues[i].libelle.substr(indexval+val.length);
				b.innerHTML += "<input type='hidden' label=\""+arrayOfValues[i].libelle+"\" >";
				b.addEventListener("click", function(e) {
					if (input.value.lastIndexOf(" "))
						input.value = input.value.substring(0,input.value.lastIndexOf(" ")+1) + $("input",this).attr('label');
					else
						input.value = $("input",this).attr('label');
					$(input).change();
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	input.addEventListener("keydown", function(e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			currentFocus++;
		addActive(x);
		} else if (e.keyCode == 38) { //up
			currentFocus--;
			addActive(x);
		} else if (e.keyCode == 13) {
			e.preventDefault();
			if (currentFocus > -1) {
				if (x) x[currentFocus].click();
			}
		}
	});
	function addActive(x) {
		if (!x) return false;
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != input) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}


//---------------------------------------------------------
//-------------CSS metadata-epm editors -------------------
//---------------------------------------------------------

//==================================================
UIFactory["Node"].prototype.displayMetadataEpmDisplayViewAttributeEditor = function(destid,attribute,value,yes_no,disabled)
//==================================================
{
	var nodeid = this.id;
	var langcode = LANGCODE;
	var asmtype = this.asmtype;
	var nodetype = (asmtype=='asmContext') ? "resource" : "node";
	var resourcetype = null;
	if (this.resource!=null)
		resourcetype = UICom.structure["ui"][nodeid].resource.type;
	if (value==null || value==undefined || value=='undefined')
		value = "";
	var html = "";
	html += "<div class='input-group '>";
	html += "	<div class='input-group-prepend'>";
	html += "		<div class='input-group-text' id='"+attribute+nodeid+"'>"+karutaStr[languages[langcode]][attribute]+"</div>";
	html += "	</div>";
	html += "	<select class='form-control' onchange=\"javascript:UIFactory.Node.updateMetadataEpmSelectAttribute('"+nodeid+"','"+attribute+"',this)\"";
	if(disabled!=null && disabled)
		html+= " disabled='disabled' ";			
	html+= ">";
	html+= "		<option value=''></option>";
	for (dest in displayView[g_display_type][nodetype]) {
		html += "	<option value='"+displayView[g_display_type][nodetype][dest]+"'";
		if (value==displayView[g_display_type][nodetype][dest])
			html += " selected ";
		html += ">"+displayView[g_display_type][nodetype][dest]+"</option>";
	}
	if (resourcetype!=undefined && resourcetype!=null)
		html+= "		<option disabled>────────────────────</option>";
	for (dest in displayView[g_display_type][nodetype][resourcetype]) {
		html += "<option value='"+displayView[g_display_type][nodetype][resourcetype][dest]+"'";
		if (value==displayView[g_display_type][nodetype][resourcetype][dest])
			html += " selected ";
		html += ">"+displayView[g_display_type][nodetype][resourcetype][dest]+"</option>";
	}
	html+= "	</select>";
	html+= "</div>";
	$("#"+destid).append($(html));
};


//==================================================
UIFactory["Node"].prototype.displayMetadataEpmAttributeEditor = function(destid,attribute,value)
//==================================================
{
	var nodeid = this.id;
	var langcode = LANGCODE;
	if (value==null || value==undefined || value=='undefined')
		value = "";
	var html = "";
	var attribute_label = attribute;
	if (attribute.indexOf('nds-')>-1)
		attribute_label = attribute.substring(4);
	if (attribute.indexOf('node-')>-1)
		attribute_label = attribute.substring(5);
	if (attribute.indexOf('inparent-')>-1)
		attribute_label = attribute.substring(9);
	if (attribute.indexOf('comment-')>-1)
		attribute_label = attribute.substring(8);
	if (attribute.indexOf('font-weight')>-1){
		var choices = [{code:'normal',label:'Normal'},{code:'bold',label:'Bold'}];
		html += "<div class='input-group '>";
		html += "	<div class='input-group-prepend' style='margin-right:5px'>";
		html += "		<span class='input-group-text' id='"+attribute+nodeid+"'>"+karutaStr[languages[langcode]][attribute_label]+"</span>";
		html += "	</div>";
		for (var i=0; i<choices.length; i++){
			html +="	<div class='form-check form-check-inline'>";
			html += "		<input class='form-check-input' type='radio' name='"+attribute+nodeid+"' onchange=\"javascript:UIFactory.Node.updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='"+choices[i].code+"' ";
			if (value==choices[i].code)
				html +=" checked";
			html +=">";
			html +="		<label class='form-check-label'>"+choices[i].label+"</label>";
			html += "	</div>";
		}
		html += "</div>";
	}
	else if (attribute.indexOf('font-style')>-1){
		var choices = [{code:'normal',label:'Normal'},{code:'italic',label:'Italic'}];
		html += "<div class='input-group '>";
		html += "	<div class='input-group-prepend' style='margin-right:5px'>";
		html += "		<span class='input-group-text' id='"+attribute+nodeid+"'>"+karutaStr[languages[langcode]][attribute_label]+"</span>";
		html += "	</div>";
		for (var i=0; i<choices.length; i++){
			html +="	<div class='form-check form-check-inline'>";
			html += "		<input class='form-check-input' type='radio' name='"+attribute+nodeid+"' onchange=\"javascript:UIFactory.Node.updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='"+choices[i].code+"' ";
			if (value==choices[i].code)
				html +=" checked";
			html +=">";
			html +="		<label class='form-check-label'>"+choices[i].label+"</label>";
			html += "	</div>";
		}
		html += "</div>";
	}
	else if (attribute.indexOf('color')>-1){
		html += "<div class='input-group '>";
		html += "	<div class='input-group-prepend'>";
		html += "		<span class='input-group-text' id='"+attribute+nodeid+"'>"+karutaStr[languages[langcode]][attribute_label]+"</span>";
		html += "	</div>";
		html += "	<input type='text' class=' pickcolor' aria-label='"+karutaStr[languages[langcode]][attribute]+"' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value=\""+value+"\">";
		html += "</div>";
	}
	else if (attribute.indexOf('text-align')>-1){
		var choices = [{code:'left',label:'Left'},{code:'right',label:'Right'},{code:'center',label:'Center'},{code:'justify',label:'Justify'}];
		html += "<div class='input-group '>";
		html += "	<div class='input-group-prepend' style='margin-right:5px'>";
		html += "		<span class='input-group-text' id='"+attribute+nodeid+"'>"+karutaStr[languages[langcode]][attribute_label]+"</span>";
		html += "	</div>";
		for (var i=0; i<choices.length; i++){
			html +="	<div class='form-check form-check-inline'>";
			html += "		<input class='form-check-input' type='radio' name='"+attribute+nodeid+"' onchange=\"javascript:UIFactory.Node.updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value='"+choices[i].code+"' ";
			if (value==choices[i].code)
				html +=" checked";
			html +=">";
			html +="		<label class='form-check-label'>"+choices[i].label+"</label>";
			html += "	</div>";
		}
		html += "</div>";
	}
	else {
		html += "<div class='input-group '>";
		html += "	<div class='input-group-prepend'>";
		html += "		<span class='input-group-text' id='"+attribute+nodeid+"'>"+karutaStr[languages[langcode]][attribute_label]+"</span>";
		html += "	</div>";
		html += "	<input type='text' class='form-control' aria-label='"+karutaStr[languages[langcode]][attribute]+"' aria-describedby='"+attribute+nodeid+"' onchange=\"javascript:UIFactory['Node'].updateMetadataEpmAttribute('"+nodeid+"','"+attribute+"',this.value)\" value=\""+value+"\">";
		html += "</div>";
	}
	$("#"+destid).append($(html));
};

//==================================================
UIFactory["Node"].prototype.displayMetadataEpmAttributesEditor = function(destid)
//==================================================
{
	var name = this.asmtype;
	var editnoderoles = ($(this.metadatawad).attr('editnoderoles')==undefined)?'none':$(this.metadatawad).attr('editnoderoles');
	var graphicerroles = ($(this.metadatawad).attr('graphicerroles')==undefined)?'none':$(this.metadatawad).attr('graphicerroles');
	if (USER.admin || g_userroles[0]=='designer' || graphicerroles.containsArrayElt(g_userroles) || graphicerroles.indexOf(this.userrole)>-1) {
		var langcode = LANGCODE;
		var html = "";
		html += "<form id='metadata-epm' class='metadata'>";
		html += "	<div id='metadata-epm-root'></div>";
		html += "	<div id='metadata-epm-part1'></div>"
		html += "<h5>"+karutaStr[languages[langcode]]['node']+"</h5>";
		html += "	<div id='metadata-epm-node'></div>";
		html += "<h5>"+karutaStr[languages[langcode]]['node-label']+"</h5>";
		html += "	<div id='metadata-epm-label'></div>";
		if (name=='asmContext') 
			html += "<hr><h5>"+karutaStr[languages[langcode]]['resource']+"</h5>";
		else
			html += "<h5>"+karutaStr[languages[langcode]]['node-content']+"</h5>";
		html += "	<div id='metadata-node-resource'></div>";
		if (name=='asmStructure' || name=='asmUnit') {
			html += "<hr><h5>"+karutaStr[languages[langcode]]['inparent']+"</h5>";
			html += "	<div id='metadata-inparent'></div>";
		}
		html += "<h5>"+karutaStr[languages[langcode]]['node-comment']+"</h5>";
		html += "	<div id='metadata-node-comment'></div>";
		html += "</form>";
		$("#"+destid).append($(html));
		//----------------------------------
		if (USER.admin || g_userroles[0]=='designer' || editnoderoles.containsArrayElt(g_userroles) || editnoderoles.indexOf(this.userrole)>-1) {
			if (name=='asmRoot') {
				this.displayMetadataDisplayTypeAttributeEditor('metadata-epm-root','display-type');
				this.displayMetadataMenuTypeAttributeEditor('metadata-epm-root','menu-type');
				this.displayMetadataEpmAttributeEditor('metadata-epm-root','cssfile',$(this.metadata).attr('cssfile'));
				html  = "<label>"+karutaStr[languages[langcode]]['csstext']+"</label>";
				$("#metadata-epm-root").append($(html));
				this.displayMetadatawWadTextAttributeEditor('metadata-epm-root','csstext');
			}
			this.displayMetadataEpmAttributeEditor('metadata-epm-part1','cssclass',$(this.metadataepm).attr('cssclass'));
			if (name!='asmRoot') {
				this.displayMetadataEpmDisplayViewAttributeEditor('metadata-epm-part1','displayview',$(this.metadataepm).attr('displayview'));
			}
			//------------------------------------
			this.displayMetadataEpmAttributeEditor('metadata-epm-node','nds-margin-top',$(this.metadataepm).attr('nds-margin-top'));
			this.displayMetadataEpmAttributeEditor('metadata-epm-node','nds-othercss',$(this.metadataepm).attr('nds-othercss'));
			//------------------------------------
			this.displayMetadataEpmAttributeEditor('metadata-epm-label','font-weight',$(this.metadataepm).attr('font-weight'));
			this.displayMetadataEpmAttributeEditor('metadata-epm-label','font-style',$(this.metadataepm).attr('font-style'));
			this.displayMetadataEpmAttributeEditor('metadata-epm-label','text-align',$(this.metadataepm).attr('text-align'));
			this.displayMetadataEpmAttributeEditor('metadata-epm-label','font-size',$(this.metadataepm).attr('font-size'));
			this.displayMetadataEpmAttributeEditor('metadata-epm-label','padding-top',$(this.metadataepm).attr('padding-top'));
			this.displayMetadataEpmAttributeEditor('metadata-epm-label','color',$(this.metadataepm).attr('color'));
			this.displayMetadataEpmAttributeEditor('metadata-epm-label','background-color',$(this.metadataepm).attr('background-color'));
			this.displayMetadataEpmAttributeEditor('metadata-epm-label','othercss',$(this.metadataepm).attr('othercss'));
		}
		//----------------------------------
		this.displayMetadataEpmAttributeEditor('metadata-node-resource','node-font-weight',$(this.metadataepm).attr('node-font-weight'));
		this.displayMetadataEpmAttributeEditor('metadata-node-resource','node-font-style',$(this.metadataepm).attr('node-font-style'));
		this.displayMetadataEpmAttributeEditor('metadata-node-resource','node-text-align',$(this.metadataepm).attr('node-text-align'));
		this.displayMetadataEpmAttributeEditor('metadata-node-resource','node-font-size',$(this.metadataepm).attr('node-font-size'));
		this.displayMetadataEpmAttributeEditor('metadata-node-resource','node-padding-top',$(this.metadataepm).attr('node-padding-top'));
		this.displayMetadataEpmAttributeEditor('metadata-node-resource','node-color',$(this.metadataepm).attr('node-color'));
		this.displayMetadataEpmAttributeEditor('metadata-node-resource','node-background-color',$(this.metadataepm).attr('node-background-color'));
		this.displayMetadataEpmAttributeEditor('metadata-node-resource','node-othercss',$(this.metadataepm).attr('node-othercss'));
		//----------------------------------
		this.displayMetadataEpmAttributeEditor('metadata-inparent','inparent-font-weight',$(this.metadataepm).attr('inparent-font-weight'));
		this.displayMetadataEpmAttributeEditor('metadata-inparent','inparent-font-style',$(this.metadataepm).attr('inparent-font-style'));
		this.displayMetadataEpmAttributeEditor('metadata-inparent','inparent-text-align',$(this.metadataepm).attr('inparent-text-align'));
		this.displayMetadataEpmAttributeEditor('metadata-inparent','inparent-font-size',$(this.metadataepm).attr('inparent-font-size'));
		this.displayMetadataEpmAttributeEditor('metadata-inparent','inparent-padding-top',$(this.metadataepm).attr('inparent-padding-top'));
		this.displayMetadataEpmAttributeEditor('metadata-inparent','inparent-color',$(this.metadataepm).attr('inparent-color'));
		this.displayMetadataEpmAttributeEditor('metadata-inparent','inparent-background-color',$(this.metadataepm).attr('inparent-background-color'));
		this.displayMetadataEpmAttributeEditor('metadata-inparent','inparent-othercss',$(this.metadataepm).attr('inparent-othercss'));
		//----------------------------------
		this.displayMetadataEpmAttributeEditor('metadata-node-comment','comment-font-weight',$(this.metadataepm).attr('comment-font-weight'));
		this.displayMetadataEpmAttributeEditor('metadata-node-comment','comment-font-style',$(this.metadataepm).attr('comment-font-style'));
		this.displayMetadataEpmAttributeEditor('metadata-node-comment','comment-color',$(this.metadataepm).attr('comment-color'));
		this.displayMetadataEpmAttributeEditor('metadata-node-comment','comment-font-size',$(this.metadataepm).attr('comment-font-size'));
	}
};

//--------------------------------------------------------
//--------------------- UPDATES --------------------------
//--------------------------------------------------------


//==================================================
UIFactory["Node"].updateMetadataAttribute = function(nodeid,attribute,value,checked)
//==================================================
{
	var node = UICom.structure["ui"][nodeid].node;
	if (checked!=undefined && !checked)
		value = "N";
	$($("metadata",node)[0]).attr(attribute,value);
	UICom.UpdateMetadata(nodeid);
	if (g_userroles[0]=='designer' || USER.admin) {  
		UICom.structure["ui"][nodeid].displayMetainfo("metainfo_"+nodeid);
	}
};

//==================================================
UIFactory["Node"].updateMetadataWadAttribute = function(nodeid,attribute,value,checked)
//==================================================
{
	var node = UICom.structure["ui"][nodeid].node;
	if (checked!=undefined && !checked)
		value = "N";
	$($("metadata-wad",node)[0]).attr(attribute,value);
	//-----------------------------------
	if (attribute=='showtoroles')
		if (value!='')
			$($("metadata-wad",node)[0]).attr('private','Y');
		else
			$($("metadata-wad",node)[0]).attr('private','N');
	//-----------------------------------
	if (attribute=='editcoderoles') {
		var editnoderoles = ($($("metadata-wad",node)[0]).attr('editnoderoles')==undefined)?'none':$($("metadata-wad",node)[0]).attr('editnoderoles');
		if (editnoderoles=='none' || editnoderoles=='') {
			$($("metadata-wad",node)[0]).attr('editnoderoles',value);
			$("#editnoderoles"+nodeid).attr('value',value);
		}
	}
	//-----------------------------------
	UICom.UpdateMetaWad(nodeid);
	if (g_userroles[0]=='designer' || USER.admin) {  
		UICom.structure["ui"][nodeid].displayMetainfo("metainfo_"+nodeid);
	}
};

//==================================================
UIFactory["Node"].updateMetadataEpmAttribute = function(nodeid,attribute,value,checked)
//==================================================
{
	var node = UICom.structure["ui"][nodeid].node;
	if (checked!=undefined && !checked)
		value = "N";
	$($("metadata-epm",node)[0]).attr(attribute,value);
	var refresh = true;
	if (attribute=="top" || attribute=="left")
		refresh = false;
	UICom.UpdateMetaEpm(nodeid,refresh);
	if (g_userroles[0]=='designer' || USER.admin) {  
		UICom.structure["ui"][nodeid].displayMetaEpmInfo("metaepm_"+nodeid);
	}

};

//==================================================
UIFactory["Node"].updateMetadataSelectAttribute = function(nodeid,attribute,select)
//==================================================
{
	var option = $(select).find("option:selected");
	var value = $(option).attr('value');
	var node = UICom.structure["ui"][nodeid].node;
	$($("metadata",node)[0]).attr(attribute,value);
	UICom.UpdateMetadata(nodeid);
	if (g_userroles[0]=='designer' || USER.admin) {  
		UICom.structure["ui"][nodeid].displayMetainfo("metainfo_"+nodeid);
	}
};

//==================================================
UIFactory["Node"].updateMetadataEpmSelectAttribute = function(nodeid,attribute,select)
//==================================================
{
	var option = $(select).find("option:selected");
	var value = $(option).attr('value');
	var node = UICom.structure["ui"][nodeid].node;
	$($("metadata-epm",node)[0]).attr(attribute,value);
	UICom.UpdateMetaEpm(nodeid,refresh);
	if (g_userroles[0]=='designer' || USER.admin) {  
		UICom.structure["ui"][nodeid].displayMetaEpmInfo("metaepm_"+nodeid);
	}
};

//==================================================
UIFactory["Node"].updateMetadatawWadTextAttribute = function(nodeid,attribute)
//==================================================
{
	var node = UICom.structure["ui"][nodeid].node;
	var value = $.trim($("#"+nodeid+"_"+attribute).val());
	if (attribute=='query' && UICom.structure["ui"][nodeid].resource!=undefined && UICom.structure["ui"][nodeid].resource.type=='Proxy' && value!=undefined && value!='') {
		var srce_indx = value.lastIndexOf('.');
		var srce = value.substring(srce_indx+1);
		var semtag_indx = value.substring(0,srce_indx).lastIndexOf('.');
		var semtag = value.substring(semtag_indx+1,srce_indx);
		$($("metadata",node)[0]).attr('semantictag','proxy-'+semtag);
		UICom.UpdateMetadata(nodeid);
	}
	$($("metadata-wad",node)[0]).attr(attribute,value);
	UICom.UpdateMetaWad(nodeid);
};

//--------------------------------------------------------
//--------------------------------------------------------
//--------------------------------------------------------


