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
	permissions and limitations under the License. ======================================================= */

/// Check namespace existence
if( UIFactory === undefined )
{var UIFactory = {};
}
var level = ['granddomaine','domaine','metier','competence'];
var libelle_choisir =['Sélectionner un grand domaine','Sélectionnez un domaine','Sélectionner un métier'];
var url1 = ['granddomaine/','granddomaine/','domaineprofessionnel/','metier/'];
var url2 = ['','/domaineprofessionnel','/metier','/competence'];
var g_ROME_caches = {};


/// Define our type
//==================================
UIFactory["ROME"] = function(node,condition)
//==================================
{
	this.clause = "xsi_type='ROME'";
	if (condition!=null)
		this.clause = condition;
	this.id = $(node).attr('id');
	this.node = node;
	this.type = 'ROME';
};


/// Editor

//==================================
UIFactory["ROME"].prototype.displayEditor = function(destid,parentid)
//==================================
{
	var cachable = true;
	var html = "<div class='ROME'><div id='granddomaine'></div><div id='domaine'></div><div id='metier'></div><div id='competence'></div>";
	$("#"+destid).html(html);

	var l = 'granddomaine';
	if (cachable && g_ROME_caches[l]!=undefined && g_ROME_caches[l]!="")
		UIFactory["ROME"].display(0,'select',g_ROME_caches[l],parentid);
	else {
		$("#wait-window").modal('show');
		$.ajax({
			async : false,
			type : "GET",
			dataType : "json",
			url : serverBCK+"/rome/"+url1[0],
			success : function(data) {
				$("#wait-window").modal('hide');
				if (cachable)
					g_ROME_caches[l] = data;
				UIFactory["ROME"].display(0,'select',data,parentid);
			}
		});
	}
	UIFactory["ROME"].display(1,'select','',parentid);
	UIFactory["ROME"].display(2,'select','',parentid);
};


//==================================
UIFactory["ROME"].display = function(no,type,data,parentid) {
//==================================
	//---------------------
	var cachable = true;
	var langcode = LANGCODE;
	var semtag = 'rome';
	var display_code = false;
	var display_label = true;
	//-----Node ordering-------------------------------------------------------
	var newTableau1 = data;
	//------------------------------------------------------------
	if (type=='select') {
		var html = "<div class='btn-group choice-group select-"+semtag+"'>";		
		html += "<button type='button' class='btn btn-default select select-label' id='button_"+no+"'>"+libelle_choisir[no]+"</button>";
		html += "<button type='button' class='btn btn-default dropdown-toggle select' data-toggle='dropdown' aria-expanded='false'><span class='caret'></span><span class='sr-only'>&nbsp;</span></button>";
		html += "</div>";
		var btn_group = $(html);
		$("#"+level[no]).html($(btn_group));
		html = "<ul class='dropdown-menu' role='menu'></ul>";
		var select  = $(html);
		//---------------------
		for ( var i = 0; i < newTableau1.length; i++) {
			//------------------------------
			var code = newTableau1[i].code;
			var label = newTableau1[i].libelle;
			html = "<li></li>";
			var select_item = $(html);
			html = "<a  value='"+$('value',resource).text()+"' code='"+code+"' class='sel"+code+"' ";
			html += "label=\""+label+"\" ";
			html += ">";
			if (display_code)
				html += "<span class='li-code'>"+code+"</span>";
			if (display_label)
				html += "<span class='li-label'>"+label+"</span>";
			html += "</a>";			
			var select_item_a = $(html);
			$(select_item_a).click(function (ev){
				//---------erase -----------------
				if (no<1)
					UIFactory["ROME"].display(1,'select','',parentid);
				if (no<2)
					UIFactory["ROME"].display(2,'select','',parentid);
				$("#competence").html("");
				//--------------------------------
				var code = $(this).attr('code');
				var display_code = false;
				var display_label = true;
				//--------------------------------
				var html = "";
				if (display_code)
					html += code+" ";
				if (display_label)
					html += $(this).attr("label");
				$("#button_"+no).html(html);
				$("#button_"+no).attr('class', 'btn btn-default select select-label').addClass("sel"+code);
				//--------------------------------
				if (cachable && g_ROME_caches[code]!=undefined && g_ROME_caches[code]!="")
					if (no<2)
						UIFactory["ROME"].display(no+1,'select',g_ROME_caches[code],parentid);
					else
						UIFactory["ROME"].display(no+1,'multiple',g_ROME_caches[code],parentid);
				else {
					$("#wait-window").modal('show');
					$.ajax({
						type : "GET",
						dataType : "json",
						url : serverBCK+"/rome/"+url1[no+1]+code+url2[no+1],
						success : function(data) {
							$("#wait-window").modal('hide');
							if (cachable)
								g_ROME_caches[code] = data;
							if (no<2)
								UIFactory["ROME"].display(no+1,'select',g_ROME_caches[code],parentid);
							else
								UIFactory["ROME"].display(no+1,'multiple',g_ROME_caches[code],parentid);
						}
					});
				}
				//--------------------------------
			});
			$(select_item).append($(select_item_a))
			$(select).append($(select_item));
		}
		//---------------------
		$(btn_group).append($(select));
		

	}
	//------------------------------------------------------------
	if (type.indexOf('multiple')>-1) {
		var html = "<h4>Sélectionnez les compétences désirées et cliquer le bouton 'Ajouter' ci-dessous .</h4>";
		$("#"+level[no]).append($(html));
		//------------------------
		var inputs = "<div id='get_multiple' class='multiple'></div>";
		var inputs_obj = $(inputs);
		//-----------------------
		for ( var i = 0; i < newTableau1.length; ++i) {
			var input = "";
			var code = newTableau1[i].code;
			var label = newTableau1[i].libelle;
			//------------------------------
			input += "<div> <input type='checkbox' name='multiple_"+parentid+"'  code='"+code+"' class='multiple-item";
			input += "' ";
			input += "label_fr=\""+label+"\" ";
			input += "> ";
			if (display_code)
				input += code + " ";
			input +="<span  class='"+code+"'>"+label+"</span></div>";
			var input_obj = $(input);
			$(inputs_obj).append(input_obj);
		}
		$("#"+level[no]).append(inputs_obj);
	}
	//------------------------------------------------------------
};


//==================================
UIFactory["ROME"].addMultiple = function(parentid,multiple_tags)
//==================================
{
	$.ajaxSetup({async: false});
	var part_code = multiple_tags.substring(0,multiple_tags.indexOf(','));
	var srce = part_code.substring(0,part_code.lastIndexOf('.'));
	var part_semtag = part_code.substring(part_code.lastIndexOf('.')+1);
	var ROME_semtag = multiple_tags.substring(multiple_tags.indexOf(',')+1);
	var inputs = $("input[name='multiple_3']").filter(':checked');
	// for each one create a part
	var databack = true;
	var callback = UIFactory.ROME.updateaddedpart;
	var param2 = ROME_semtag;
	var param4 = false;
	for (var j=0; j<inputs.length;j++){
		var param3 = inputs[j];
		if (j==inputs.length-1)
			param4 = true;
		importBranch(parentid,srce,part_semtag,databack,callback,param2,param3,param4);
	}
};


//==================================
function import_rome(parentid,title,partcode,semtagToUpdate)
//==================================
{
	var langcode = LANGCODE;
//	var multiple_tags = "karuta.karuta-resources.Get_resource,Get_Reousrce";
	var multiple_tags = partcode+","+semtagToUpdate;
	//---------------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "UIFactory.Get_Resource.addMultiple('"+parentid+"','"+multiple_tags+"')";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['Add']+"</button> <button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(title);
	var html = "<div id='edit-window-body-resource'></div>";
	$("#edit-window-body").html(html);
	var getRome = new UIFactory["ROME"](UICom.structure["ui"][parentid].node,"xsi_type='nodeRes'");
	getRome.displayEditor("edit-window-body-resource",parentid);
	$('#edit-window').modal('show');

}