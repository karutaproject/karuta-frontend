document.write("<link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'/>");

//------ EXEC BATCH AT USER CREATION ------------------
var g_execbatch = false;
var g_execbatchbuttonlabel1 = [];
	g_execbatchbuttonlabel1['fr'] = "Patience! Création de votre portfolio ...";
var g_json = {};

//=======================
function prepareBatch()
//=======================
{
	g_json['model_code'] = "modeles.batch-creation";
	g_json['lines'] = [];
	g_json.lines[0] =
	{
		"auditeurCourriel" : USER.email,
		"auditeurNomFamille" : USER.lastname,
		"auditeurPrenom" : USER.firstname,
	};
}//----------------------------------------------------
