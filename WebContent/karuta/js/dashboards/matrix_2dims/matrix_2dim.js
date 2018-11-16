/* =======================================================
	Copyright 2018 - ePortfolium - Licensed under the
	Educational Community License, Version 2.0 (the "License"); you may
	not use this file except in compliance with the License. You may
	obtain a copy of the License at

	http://www.osedu.org/licenses/ECL-2.0

	Unless required by applicable law or agreed to in writing,
	software distributed under the License is distributed on an "AS IS"
	BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
	or implied. See the License for the specific language governing
	permissions and limitations under the License.
   ======================================================= */

//=============================================
function matrix_2dimsAB(root)
//=============================================
{
	var matrix = new Array();
	var dimAs = $("*:has(metadata[semantictag*='dimA'])",root);
	for ( var i = 0; i < dimAs.length; i++) {
		if (matrix[0]==undefined){
			matrix[0] = new Array();
			matrix[0][0] = "";
		}
		matrix[0][i+1] = $(dimAs[i]).attr('id');
		var dimBs = $("*:has(metadata[semantictag*='dimB'])",dimAs[i]);
		for ( var j = 0; j < dimBs.length; j++) {
			if (matrix[j+1]==undefined){
				matrix[j+1] = new Array();
			}
			matrix[j+1][0] = $(dimBs[j]).attr('id');
			var cells = $("*:has(metadata[semantictag*='cell'])",dimBs[j]);
			for ( var k = 0; k < cells.length; k++) {
				matrix[j+1][i+1] = $(cells[k]).attr('id');
			}
		}
	}
	//---------------------------------------------------------
	var html = "";
	html += "<table class='matrice_2dims'>";
	//---------- headers ------------
	html += "<tr><td></td>";
	for ( var i = 0; i < matrix[0].length-1; i++) {
		html += "<td class='dimA'>"+UICom.structure["ui"][matrix[0][i+1]].getView()+"</td>";
	}
	html += "</tr>";
	//-------------------------------
	for ( var j = 1; j < matrix.length; j++) {
		html += "<tr>";
		for ( var i = 0; i < matrix[0].length; i++) {
			if (i>0){
				html += "<td  class='cell' onclick=\"displayMatrixInside('"+matrix[j][i]+"')\"></td>";				
			} else {
				html += "<td class='dimB'>"+UICom.structure["ui"][matrix[j][i]].getView()+"</td>";
			}
		}
		html += "</tr>";
	}
	//-------------------------------
	html += "</table>";
	return html;
}

//=============================================
function matrix_2dimsBA(root)
//=============================================
{
	var matrix = new Array();
	var dimAs = $("*:has(metadata[semantictag*='dimA'])",root);
	for ( var i = 0; i < dimAs.length; i++) {
		if (matrix[0]==undefined){
			matrix[0] = new Array();
			matrix[0][0] = "";
		}
		if (matrix[i+1]==undefined){
			matrix[i+1] = new Array();
		}
		matrix[i+1][0] = $(dimAs[i]).attr('id');
		var dimBs = $("*:has(metadata[semantictag*='dimB'])",dimAs[i]);
		for ( var j = 0; j < dimBs.length; j++) {
			matrix[0][j+1] = $(dimBs[j]).attr('id');
			var cells = $("*:has(metadata[semantictag*='cell-content'])",dimBs[j]);
			for ( var k = 0; k < cells.length; k++) {
				matrix[i+1][j+1] = $(cells[k]).attr('id');
			}
		}
	}
	//---------------------------------------------------------
	var html = "";
	html += "<table class='matrice_2dims'>";
	//---------- headers ------------
	html += "<tr><td></td>";
	for ( var i = 0; i < matrix[0].length-1; i++) {
		html += "<td class='dimA'>"+UICom.structure["ui"][matrix[0][i+1]].getView()+"</td>";
	}
	html += "</tr>";
	//-------------------------------
	for ( var j = 1; j < matrix.length; j++) {
		html += "<tr>";
		for ( var i = 0; i < matrix[0].length; i++) {
			if (i>0){
				html += "<td  class='cell' onclick=\"displayMatrixInside('"+matrix[j][i]+"')\">"+getCelldisplay(matrix[j][i])+"</td>";				
			} else {
				html += "<td class='dimB'>"+UICom.structure["ui"][matrix[j][i]].getView()+"</td>";
			}
		}
		html += "</tr>";
	}
	//-------------------------------
	html += "</table>";
	return html;
}

//==================================
function getCelldisplay(uuid,lang)
//==================================
{
	var html = "";
	var cell_displays = $("asmContext:has(metadata[semantictag*='cell-display'])",UICom.structure['tree'][uuid].node);
	for ( var i = 0; i < cell_displays.length; i++) {
		var id = $(cell_displays[i]).attr('id');
		html += UICom.structure['ui'][id].resource.getView(null,'icon');
	}
	return html;
}
//==================================
function displayMatrixInside(uuid,lang)
//==================================
{
	redisplays[uuid] = "displayMatrixInside('"+uuid+"',"+lang+")";
	$("#edit-window").css("width","70%");
	$("#edit-window").css("margin-left","0");
	$("#edit-window").css("left","15%");
	$("#edit-window-header").html("");
	$("#edit-window-body").html("");
	$("#edit-window-body-node").html("");
	$("#edit-window-body-context").html("");
	$("#edit-window-body-metadata").html("");
	$("#edit-window-body-metadata-epm").html("");
	var html = "";
	//-----------------------------------------
//	html += "<a  class='btn btn-xs' onclick='' data-title='éditer' rel='tooltip'>";
//	html += "Quitter le mode édition";
//	html += "</a>";
	//-----------------------------------------
	html += "<div id='window-page' uuid='"+uuid+"'></div>";
	$("#edit-window-body").append($(html));
	var inline = false;
	UIFactory['Node'].displayStandard(UICom.structure['tree'][uuid],'window-page',100,lang,null,inline);
	//------------------ footer ---------------
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var footer = "<button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Close']+"</button>";
	$("#edit-window-footer").html($(footer));
	//-----------------------------------------
	$("#edit-window").modal('show');
	$('#edit-window-body').animate({ scrollTop: 0 }, 'slow');
}