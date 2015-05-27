//=================================================
function create_karuta_demo_portfolios(identifier)
//=================================================
{
	var data = "{ "
		+"		\"template1\" : \"demo_profile\","
		+"		\"template2\" : \"demo_student_evaluation_portfolio\","
		+"		\"lines\" :["
		+"			{\"identifier\": \"mimi\", \"role\": \"designer\" }"
		+"		]"
		+"	}";
	var json = JSON.parse(data);
	json.lines[0].identifier = identifier;
	g_json = json;
	var model_code = 'demo_create_portfolios';
	getModelAndProcess(model_code);
}