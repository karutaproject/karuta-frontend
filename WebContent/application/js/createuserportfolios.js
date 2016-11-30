
//==============================
function show_exec_batch_user_portfolios()
//==============================
{
	hideAllPages();

	$("body").removeClass();
	$("body").addClass("exec_batch")
	$("#sub-bar").html("");
	setLanguageMenu("call_create_batch_user_portfolios()");
	$("#refresh").attr("onclick","call_create_batch_user_portfolios()");
	$("#refresh").show();
	$("#main-exec-batch").show();

//	initBatchVars();
}

//==============================
function fill_exec_batch_user_portfolios()
//==============================
{
//	initBatchVars();
	var html = "";
	html += "<h2 id='batch' class='line'>KARUTA - <span id='batch-title-page'></span></h2>";
	html += "<div id='batch-log' style='margin-left:20px;margin-top:20px'></div>";
	$("#main-exec-batch").html(html);
	getModelAndProcess(g_json.model_code);
	//------------------------------
	$("#batch-title-head").html("KARUTA - "+karutaStr[LANG]['create_user_portfolios']);
	$("#batch-title-page").html(karutaStr[LANG]['create_user_portfolios']);
	//------------------------------
	demo = false; //to avoid reload
}

//==============================
function display_exec_batch_user_portfolios()
//==============================
{
	/*
	if ($("#batch").length) {
		show_exec_batch_user_portfolios();
	} else {
		fill_exec_batch_user_portfolios();
		show_exec_batch_user_portfolios();
	}
	*/
	fill_exec_batch_user_portfolios();
	show_exec_batch_user_portfolios();
}

//==============================
function call_create_batch_user_portfolios()
//==============================
{
	initBatchVars();
	var js1 = "javascript:$('#edit-window').modal('hide')";
	var js2 = "javascript:$('#edit-window').modal('hide');display_exec_batch_user_portfolios()";
	var footer = "<button class='btn' onclick=\""+js2+";\">"+karutaStr[LANG]['create_user_portfolios']+"</button><button class='btn' onclick=\""+js1+";\">"+karutaStr[LANG]['Cancel']+"</button>";
	$("#edit-window-footer").html(footer);
	$("#edit-window-title").html(karutaStr[LANG]['create_user_portfolios']);
	$("#edit-window-type").html("");
	g_json = {﻿model_code:"IUT2batch.IUT2_batch_creer_dans_projet",portfolio_code:"IUT2portfolios.IUT2-portfolio",specialite_code:"GEA",diploma_end:"2018",lines:[{superviseur_lastname:"GEAG",etudiant_role:"etudiant",superviseur_firstname:"Tuteur",etudiant_firstname:"",superviseur_email:"eportfoliogea@gmail.com",etudiant_lastname:"",superviseur_pwd:"karuta",etudiant_id:"",superviseur_role:"superviseur",superviseur_id:"tuteurgeag",etudiant_email:"",etudiant_pwd:"karuta"}],personnalite_code:"IUT2portfolios.IUT2-TraitsPersonnalite",diploma_begin:"2016",cv_code:"IUT2portfolios.IUT2-cv",profile_code:"IUT2portfolios.IUT2-profile",projet_code:"IUT2portfolios.IUT2-projet"};
	//--------------------------
	var batch_attributes = new Array();
	batch_attributes['user']=['etudiant_id','etudiant_lastname','etudiant_firstname','etudiant_email','etudiant_pwd','etudiant_role'];
	batch_attributes['supervisor']=['superviseur_id','superviseur_lastname','superviseur_firstname','superviseur_email','superviseur_pwd','superviseur_role'];
	batch_attributes['portfolios']=['model_code','portfolio_code','profile_code','cv_code','personnalite_code','projet_code','specialite_code','diploma_begin','diploma_end'];
	var batch_attributes_label_karuta = new Array();
	batch_attributes_label_karuta['user']=['username','lastname','firstname','email','password','role'];
	batch_attributes_label_karuta['supervisor']=['username','lastname','firstname','email','password','role'];
	var batch_attributes_val0 = new Array();
	batch_attributes_val0['user']=['','','','','karuta','etudiant'];
	batch_attributes_val0['supervisor']=['tuteurgeag','GEAG','Tuteur','eportfoliogea@gmail.com','karuta','superviseur'];
	batch_attributes_val0['portfolios']=['IUT2batch.IUT2_batch_creer_dans_projet','IUT2portfolios.IUT2-portfolio','IUT2portfolios.IUT2-profile','IUT2portfolios.IUT2-cv','IUT2portfolios.IUT2-TraitsPersonnalite','IUT2portfolios.IUT2-projet','GEA','2016','2018'];
	//--------------------------
	var html = "";
	html += "\n			<div role='tabpanel'>";
	html += "\n				<ul class='nav nav-tabs' role='tablist'>";
	html += "\n					<li role='presentation' class='active'><a href='#edit-window-body-user' aria-controls='edit-window-body-user' role='tab' data-toggle='tab'>"+karutaStr[LANG]['user']+"</a></li>";
	html += "\n					<li role='presentation'><a href='#edit-window-body-supervisor' aria-controls='edit-window-body-supervisor' role='tab' data-toggle='tab'>"+karutaStr[LANG]['supervisor']+"</a></li>";
	html += "\n					<li role='presentation'><a href='#edit-window-body-portfolios' aria-controls='edit-window-body-portfolios' role='tab' data-toggle='tab'>"+karutaStr[LANG]['metadata-portfolios']+"</a></li>";
	html += "\n				</ul>";
	html += "\n				<div class='tab-content'>";
	html += "\n					<div role='tabpanel' class='tab-pane active' id='edit-window-body-user'></div>";
	html += "\n					<div role='tabpanel' class='tab-pane' id='edit-window-body-supervisor'></div>";
	html += "\n					<div role='tabpanel' class='tab-pane' id='edit-window-body-portfolios'></div>";
	html += "\n				</div>";
	html += "\n			</div>";
	$("#edit-window-body").html(html);
	var js="";
	html = "<form id='form-user' class='form-horizontal'>";
	for (var i=0; i<batch_attributes['user'].length; i++){
		js = "g_json.lines[0]."+batch_attributes['user'][i]+"="+"this.value";
		html += getAttributeCreator("form-user",karutaStr[LANG][batch_attributes_label_karuta['user'][i]],batch_attributes['user'][i],batch_attributes_val0['user'][i],js);
	}
	html += "</form>";
	$("#edit-window-body-user").html(html);
	//--------------------------
	html = "<form id='form-supervisor' class='form-horizontal'>";
	for (var i=0; i<batch_attributes['supervisor'].length; i++){
		js = "g_json.lines[0]."+batch_attributes['supervisor'][i]+"="+"this.value";
		html += getAttributeCreator("form-supervisor",karutaStr[LANG][batch_attributes_label_karuta['user'][i]],batch_attributes['supervisor'][i],batch_attributes_val0['supervisor'][i],js);
	}
	html += "</form>";
	$("#edit-window-body-supervisor").html(html);
	//--------------------------
	html = "<form id='form-portfolios' class='form-horizontal'>";
	for (var i=0; i<batch_attributes['portfolios'].length; i++){
		js = "g_json."+batch_attributes['portfolios'][i]+"="+"this.value";
		html += getAttributeCreator("form-portfolios",batch_attributes['portfolios'][i],batch_attributes['portfolios'][i],batch_attributes_val0['portfolios'][i],js);
	}
	html += "</form>";
	$("#edit-window-body-portfolios").html(html);
	//--------------------------
	$('#edit-window').modal('show');
}

//==================================================
function getAttributeCreator(code,label,attribute,value,js)
//==================================================
{
	var html = "";
	html += "<div class='form-group'>";
	html += "  <label class='col-sm-3 control-label'>"+label+"</label>";
	html += "  <div class='col-sm-9'><input class='form-control' id='"+code+"_"+attribute+"' type='text'";
	html += " value='"+value+"' onchange='javascript:"+js+"'></div>";
	html += "</div>";
	return html;
}

