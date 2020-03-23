//------ EXEC BATCH AT USER CREATION ------------------
var g_execbatch = false;
var g_execbatchbuttonlabel1 = [];
	g_execbatchbuttonlabel1['fr'] = "Patience! Création de votre portfolio ...";
var g_json = {};

//=======================
function prepareBatch()
//=======================
{
	// ---- global variables ---------
	g_json['model_code'] = "batch-creation";
	g_json['cohorteCode'] = "A2019";
	g_json['cohorteLibelle'] = "Automne 2019";
	// ---- local variables ---------
	g_json['lines'] = [];
	g_json.lines[0] =
	{
		"courriel" : USER.email,
		"nom" : USER.lastname,
		"prenom" : USER.firstname,
		"motdepasse" : ""
	};
}//----------------------------------------------------

var nbPagesIndexStep = 2;