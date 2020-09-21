//========================================================
//========================================================
//===================== Europass Languages ===============
//========================================================
//========================================================

var g_mother_tongueid = "";

var langues_byid = {};
var langues_list = [];


//==================================
UIFactory["EuropassL"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.mother_tongueid = $("asmContext:has(metadata[semantictag='MotherTongue'])", node).attr('id');
	this.foreignid = $("asmUnitStructure:has(metadata[semantictag='foreign-languages'])", node).attr('id');
	this.langues_byid = {};
	this.langues_list = [];
	var items = $("asmUnitStructure:has(metadata[semantictag='europass-language'])",$("asmUnitStructure:has(metadata[semantictag='foreign-languages'])",node));
	for ( var i = 0; i < items.length; i++) {
		this.langues_byid[$(items[i]).attr('id')] = new UIFactory["Langue"](items[i]);
		this.langues_list[i] = this.langues_byid[$(items[i]).attr('id')];
	}
};

//==================================
UIFactory["EuropassL"].prototype.displayView = function(destid,langcode,type,parentid,menu)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	$("#"+destid).html("");
	var html ="";
	if (type=='detail') {
		var writenode =  ($(UICom.structure["ui"][this.mother_tongueid].node).attr('write')=='Y')? true:false;
		var editresroles = ($(UICom.structure["ui"][this.mother_tongueid].metadatawad).attr('editresroles')==undefined)?'none':$(UICom.structure["ui"][this.mother_tongueid].metadatawad).attr('editresroles');
		if (g_designerrole) {
			writenode = (editresroles.containsArrayElt(g_userroles))? true : false;
			if (writenode)
				writenode = menu; //if submitted menu==false
		}
		var edit =  ($(UICom.structure["ui"][this.mother_tongueid].node).attr('write')=='Y')? true:false;
		//  if databack is true callback(data,param2,param3,param4) else callback(param2,param3,param4)
		var databack = false;
		var callback = "UIFactory['EuropassL'].reloadparse";
		var param2 = "'"+destid+"'";
		var param3 = "'"+parentid+"'";
		var param4 = writenode;
		//----------------------------
		html += "<div class='row'>";
		html += "<div class='offset-md-1 col-11'>";
		html += "<span class='mothertongue-label'>"+UICom.structure["ui"][this.mother_tongueid].getLabel('std_node_'+parentid,"none")+"</span>";
		html += "<span class='mothertongue-value' id='mother_tongue_"+parentid+"'>"+UICom.structure["ui"][this.mother_tongueid].resource.getView('mother_tongue_'+parentid,"span");
		html +="</span>";
		if (writenode || g_userroles[0]=='designer') {
			html +="<div id='mother_tongue_button' class='btn-group' style='margin-left:3px;'>";
			html += UICom.structure["ui"][this.mother_tongueid].getButtons(null,null,null,false,0,true,menu);
			html +="</div>";
		}
		html += "</div><!--col-->";
		html += "</div><!--row-->";
		//----------------------------
		html += "<div class='row'>";
		html += "<div class='offset-md-1 col-6'>";
		html += "<h5>"+UICom.structure["ui"][this.foreignid].getLabel('std_node_'+parentid,"none")+"</h5>";
		html += "</div><!--col-->";
		if (writenode || g_userroles[0]=='designer') {
			html += "<div class='col-5 btn-group'>";
			html += "<div class='edit-bar'><span id='buttons-"+this.foreignid+"' class='buttons'/><span id='menus-"+this.foreignid+"' class='menus'/></div>";
//			html += UICom.structure["ui"][this.foreignid].getButtons(null,null,null,false,0,true,menu);
//			html += UICom.structure["ui"][this.foreignid].getMenus(langcode,null,null,false,0,true,menu);
			html += "</div><!--col-->";
		}
		html += "</div><!--row-->";
		html += "<div class='row row-resource'>";
		html += "<div class='offset-md-1 col-10'>";
		html += "<table id='"+destid+"europass_table' class='europass_table'>";
		html += "<tr class='en-tete'><td class='language_edit'></td><td class='bordure' colspan='2'> "+karutaStr[LANG]['understanding']+" </td><td class='bordure' colspan='2'> "+karutaStr[LANG]['speaking']+" </td><td class='bordure'> "+karutaStr[LANG]['writing']+" </td></tr>";
		html += "<tr class='en-tete'><td></td><td class='bordure'> "+karutaStr[LANG]['listening']+" </td><td class='bordure'> "+karutaStr[LANG]['reading']+" </td><td class='bordure'> "+karutaStr[LANG]['spoken-interaction']+" </td><td class='bordure'> "+karutaStr[LANG]['spoken-production']+" </td><td class='bordure'> </td></tr>";
		html += "</table>";
		$("#"+destid).html(html);
		$("#buttons-"+this.foreignid).html(UICom.structure["ui"][this.foreignid].getButtons(null,null,null,false,0,true,menu));
		$("#menus-"+this.foreignid).html(UICom.structure["ui"][this.foreignid].getMenus(langcode,null,null,false,0,true,menu));
		for ( var i = 0; i < this.langues_list.length; i++) {
				$("#"+destid+"europass_table").append($("<tr id='"+destid+"_"+this.langues_list[i].id+"'></tr>"));			
				this.langues_list[i].displayView(destid+"_"+this.langues_list[i].id,type,langcode,writenode || g_userroles[0]=='designer');
		}
		html += "</div><!--col-->";
		html += "</div><!--row-->";
		//----------------------------
	}
	if (type=='report') {
		//----------------------------
		html += "<tr>";
		html += "<td style='border:0px solid white'>";
		html += "<span class='mothertongue-label'>"+UICom.structure["ui"][this.mother_tongueid].getLabel('std_node_'+parentid,"none")+"</span>";
		html += "<span class='mothertongue-value' id='mother_tongue_"+parentid+"'>"+UICom.structure["ui"][this.mother_tongueid].resource.getView('mother_tongue_'+parentid,"span");
		html +="</span>";
		html += "</td><!--col-->";
		html += "</tr><!--row-->";
		//----------------------------
		html += "<tr>";
		html += "<td style='border:0px solid white'>";
		html += "<h5>"+UICom.structure["ui"][this.foreignid].getLabel('std_node_'+parentid,"none")+"</h5>";
		html += "<table id='"+destid+"europass_table' class='europass_table'>";
		html += "<tr class='en-tete'><td class='language_edit'></td><td class='bordure' colspan='2'> "+karutaStr[LANG]['understanding']+" </td><td class='bordure' colspan='2'> "+karutaStr[LANG]['speaking']+" </td><td class='bordure'> "+karutaStr[LANG]['writing']+" </td></tr>";
		html += "<tr class='en-tete'><td></td><td class='bordure'> "+karutaStr[LANG]['listening']+" </td><td class='bordure'> "+karutaStr[LANG]['reading']+" </td><td class='bordure'> "+karutaStr[LANG]['spoken-interaction']+" </td><td class='bordure'> "+karutaStr[LANG]['spoken-production']+" </td><td class='bordure'> </td></tr>";
		html += "</table>";
		html += "</td>";
		html += "</tr>";
		$("#"+destid).html(html);
		for ( var i = 0; i < this.langues_list.length; i++) {
				$("#"+destid+"europass_table").append($("<tr class='other-tongue' id='"+destid+"_"+this.langues_list[i].id+"'></tr>"));			
				this.langues_list[i].displayView(destid+"_"+this.langues_list[i].id,type,langcode,writenode || g_userroles[0]=='designer');
		}
		//----------------------------
	}

}

//=====================================================
//=====================================================
//=====================================================


//==================================
UIFactory["Langue"] = function( node )
//==================================
{
	this.id = $(node).attr('id');
	this.node = node;
	this.parentid = $(node).parent().parent().attr("id");
	this.semantictag = $("metadata",node).attr('semantictag');
	this.language_nodeid = $("asmContext:has(metadata[semantictag='ForeignLanguage'])",node).attr('id');
	this.listening_nodeid = $("asmContext:has(metadata[semantictag='Listening'])",node).attr('id');
	this.reading_nodeid = $("asmContext:has(metadata[semantictag='Reading'])",node).attr('id');
	this.spokenInteraction_nodeid = $("asmContext:has(metadata[semantictag='SpokenInteraction'])",node).attr('id');
	this.spokenProduction_nodeid = $("asmContext:has(metadata[semantictag='SpokenProduction'])",node).attr('id');
	this.writing_nodeid = $("asmContext:has(metadata[semantictag='Writing'])",node).attr('id');
};

//==================================
UIFactory["Langue"].prototype.displayView = function(destid,type,langcode,edit)
//==================================
{
	if (langcode==null)
		langcode = LANGCODE;
	//---------------------
	var html = "";
	$("#"+destid).html(html);  // on vide html
	if (type==null || type=='short') {
		html += "<i class='fa fa-angle-right fa-lg'></i>&nbsp;";
		html += "<a  onclick=\"javascript:$('#tabs_histo li:eq(5) a').tab('show')\">";
		html += "<span id='"+destid+"_short_label'>"+UICom.structure["ui"][this.language_nodeid].resource.getView(destid+"_short_label","span")+"</span>";
		html += "</a>";
	}
	if (type=='comp-short') {
		html += "<i class='fa fa-angle-right fa-lg'></i>&nbsp;";
		html += "<a  onclick=\"javascript:$('#tabs_comp li:eq(4) a').tab('show')\">";
		html += "<span id='"+destid+"_short_label'>"+UICom.structure["ui"][this.language_nodeid].resource.getView(destid+"_short_label","span")+"</span>";
		html += "</a>";
	}
	if (type=='detail' || type=='report' || type=='comp') {
		//---------------------------------------------------------
		html +="<td class='langue language' id='"+type+"_language_"+this.id+"'>"+UICom.structure["ui"][this.language_nodeid].resource.getView(type+"_language_"+this.id,"span")+"</td>";
		html +="<td class='bordure listening' id='"+type+"_listening_"+this.id+"'>"+UICom.structure["ui"][this.listening_nodeid].resource.getCode(type+"_listening_"+this.id)+"</td>";
		html +="<td class='bordure reading' id='"+type+"_reading_"+this.id+"'>"+UICom.structure["ui"][this.reading_nodeid].resource.getCode(type+"_reading_"+this.id)+"</td>";
		html +="<td class='bordure spoken-interaction' id='"+type+"_spokenInteraction_"+this.id+"'>"+UICom.structure["ui"][this.spokenInteraction_nodeid].resource.getCode(type+"_spokenInteraction_"+this.id)+"</td>";
		html +="<td class='bordure spoken-production' id='"+type+"_spokenProduction_"+this.id+"'>"+UICom.structure["ui"][this.spokenProduction_nodeid].resource.getCode(type+"_spokenProduction_"+this.id)+"</td>";
		html +="<td class='bordure writing' id='"+type+"_writing_"+this.id+"'>"+UICom.structure["ui"][this.writing_nodeid].resource.getCode(type+"_writing_"+this.id)+"</td>";
		if (edit && type=='detail') {
			html +="<td class='buttons' style='text-align:left'>";
			html +="	<div class='btn-group' style='margin-left:3px;'>";
			html += "		<span onclick=\"UICom.structure.ui['"+this.parentid+"'].structured_resource.langues_byid['"+this.id+"'].displayEditor('"+destid+"');\" class='button fas fa-pencil-alt' aria-hidden='true'></span>";
			html += "		<span onclick=\"confirmDel('"+this.id+"','Langue')\" class='button fas fa-trash-alt' aria-hidden='true'></span>";
			html +="	</div>";
			html +="</td>";
		}
		//---------------------------------------------------------destid,parentid,type,edit
	}
	var obj = $(html);
	$("#"+destid).append(obj);
};

//==================================
UIFactory["Langue"].prototype.displayEditor = function(destid,type,lang)
//==================================
{
	var html = "";
	$("#"+destid).html(html);  // on vide html
		//---------------------------------------------------------
		html +="<td id='language_edit_"+this.id+"' class='language_edit' width='150px'></td>";
		html +="<td class='bordure'><span id='listening_"+this.id+"_edit'>"+UICom.structure["ui"][this.listening_nodeid].resource.getCode("listening_"+this.id+"_edit")+"</span>";
		html += " <a  class='btn ' onclick=\"javascript:UIFactory.Langue.editSkill('listening_edit','"+this.listening_nodeid+"','listening')\" >";
		html += karutaStr[LANG]['choose'];
		html += "</a>";
		html +="</td>";
		html +="<td class='bordure'><span id='reading_"+this.id+"_edit'>"+UICom.structure["ui"][this.reading_nodeid].resource.getCode("reading_"+this.id+"_edit")+"</span>";
		html += " <a  class='btn ' onclick=\"javascript:UIFactory.Langue.editSkill('reading_edit','"+this.reading_nodeid+"','reading')\" >";
		html += karutaStr[LANG]['choose'];
		html += "</a>";
		html +="</td>";
		html +="<td class='bordure'><span id='spokenInteraction_"+this.id+"_edit'>"+UICom.structure["ui"][this.spokenInteraction_nodeid].resource.getCode("spokenInteraction_"+this.id+"_edit")+"</span>";
		html += " <a  class='btn ' onclick=\"javascript:UIFactory.Langue.editSkill('spokenInteraction_edit','"+this.spokenInteraction_nodeid+"','spoken-interaction')\" >";
		html += karutaStr[LANG]['choose'];
		html += "</a>";
		html +="</td>";
		html +="<td class='bordure'><span id='spokenProduction_"+this.id+"_edit'>"+UICom.structure["ui"][this.spokenProduction_nodeid].resource.getCode("spokenProduction_"+this.id+"_edit")+"</span>";
		html += " <a  class='btn ' onclick=\"javascript:UIFactory.Langue.editSkill('spokenProduction_edit','"+this.spokenProduction_nodeid+"','spoken-production')\" >";
		html += karutaStr[LANG]['choose'];
		html += "</a>";
		html +="</td>";
		html +="<td class='bordure'><span id='writing_"+this.id+"_edit'>"+UICom.structure["ui"][this.writing_nodeid].resource.getCode("writing_"+this.id+"_edit")+"</span>";
		html += " <a  class='btn ' onclick=\"javascript:UIFactory.Langue.editSkill('writing_edit','"+this.writing_nodeid+"','writing')\" >";
		html += karutaStr[LANG]['choose'];
		html += "</a>";
		html +="</td>";
		html +="<td style='text-align:left'>";
		html += "&nbsp;<a  class='btn  editbutton' onclick=\"javascript:UICom.structure.ui['"+this.parentid+"'].structured_resource.langues_byid['"+this.id+"'].displayView('"+destid+"','detail',lang,true);$('#collapse"+this.id+"').collapse('show');toggleZoom('"+this.id+"')\" data-title='éditer' rel='tooltip'>";
		html += karutaStr[LANG]['quit'];
		html += "</a>";
		html +="</td>";
		//---------------------------------------------------------
	var obj = $(html);
	$("#"+destid).append(obj);
	UICom.structure["ui"][this.language_nodeid].resource.displayEditor("language_edit_"+this.id);
};


//==================================
UIFactory["Langue"].editSkill = function(destid,uuid,title)
//==================================
{
	$("#langue-window-header").html("<h4>"+karutaStr[LANG][title]+"</h4>");
	$("#langue-window-body").html("<div id='"+destid+"'></div>");
	UICom.structure["ui"][uuid].resource.displayEditor(destid,"radio");
	$("#langue-window").modal("show");
	var js1 = "javascript:$('#langue-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#langue-window-footer").html($(footer));
};

//==================================
UIFactory["Langue"].refresh = function(parentid,destid) 
//==================================
{
	if (parentid!=null)
		langues_byid[parentid].displayEditor(destid);
	Langues_Display('langues-short_histo','short');
	Langues_Display('langues-detail_histo','detail',parentid,g_mother_tongueid);
	Langues_Display('langues-short_comp','short');
	Langues_Display('langues-detail_comp','comp');
	Langues_Display('langues-detail_cv','cv');
};


//==================================
UIFactory["Langue"].remove = function(uuid)
//==================================
{
	UICom.DeleteNode(uuid);
	UIFactory.Node.reloadUnit();
	$("#wait-window").modal('hide');
};

//==================================
UIFactory["Langue"].displayMothertongue = function(uuid,destid,edit)
//==================================
{
	
	var html = UICom.structure["ui"][uuid].resource.getView("mother_tongue","span");
	$("#"+destid).html(html);
	html = "<span  onclick=\"UIFactory.Langue.editMothertongue('"+g_mother_tongueid+"','mother_tongue');\" class='button fas fa-pencil-alt' aria-hidden='true'></span>";
	$("#"+destid+"_button").html($(html));
};

//==================================
UIFactory["Langue"].editMothertongue = function(uuid,destid)
//==================================
{
	$("#"+destid).html("");
	UICom.structure["ui"][uuid].resource.displayEditor("mother_tongue");
	$("#"+destid).append($(html));
	var html = "<a  class='btn ' style='margin-left:5px' onclick=\"UIFactory.Langue.displayMothertongue('"+uuid+"','"+destid+"',true);\">";
	html += karutaStr[LANG]['quit'];
	html += "</a>";
	$("#"+destid+"_button").append($(html));
};

//==============================
function LangueBox()
//==============================
{
	var html = "";
	html += "\n<!-- ==================== Langue box ==================== -->";
	html += "\n<div id='langue-window' class='modal fade'>";
	html += "\n		<div class='modal-dialog'>";
	html += "\n		<div class='modal-content'>";
	html += "\n		<div id='langue-window-header' class='modal-header'>";
	html += "\n		</div>";
	html += "\n		<div id='langue-window-body' class='modal-body'></div>";
	html += "\n		<div class='modal-footer' id='langue-window-footer'></div>";
	html += "\n		</div>";
	html += "\n		</div>";
	html += "\n	</div>";
	html += "\n<!-- ============================================== -->";
	return html;
}



