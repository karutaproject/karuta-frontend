//=================================================
function create_karuta_demo_ecommerce(identifier)
//=================================================
{
	$("#wait-window").show();
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
	var model_code = 'demo_create_ecommerce';
	getModelAndProcess(model_code);
}

//=================================================
function create_karuta_demo_aacu(identifier)
//=================================================
{
	$("#wait-window").show();
	var data = "{ "
		+"		\"template1\" : \"AACU-portfolio\","
		+"		\"template2\" : \"AACU-parts\","
		+"		\"template3\" : \"AACU-report\","
		+"		\"template4\" : \"AACU-rubrics\","
		+"		\"lines\" :["
		+"			{\"identifier\": \"000\", \"role\": \"designer\" }"
		+"		]"
		+"	}";
	var json = JSON.parse(data);
	json.lines[0].identifier = identifier;
	g_json = json;
	var model_code = 'AACU_create_demo';
	getModelAndProcess(model_code);
}

//=================================================
function create_karuta_demo_video(identifier)
//=================================================
{
	$("#wait-window").show();
	var data = "{ "
		+"		\"template1\" : \"video-portfolio\","
		+"		\"template2\" : \"video-parts\","
		+"		\"template3\" : \"video-repo\","
		+"		\"template4\" : \"video-report\","
		+"		\"lines\" :["
		+"			{\"identifier\": \"mimi\", \"role\": \"designer\" }"
		+"		]"
		+"	}";
	var json = JSON.parse(data);
	json.lines[0].identifier = identifier;
	g_json = json;
	var model_code = 'video_create_demo';
	getModelAndProcess(model_code);
}


//=================================================
function share_karuta_documentation()
//=================================================
{
	$("#wait-window").show();
	var urlS = "../../../"+serverFIL+'/sharedoc';

	$.ajax({
		type : "POST",
		dataType : "text",
		contentType: "application/xml",
		url : urlS,
		data : '',
		success : function (data){
			window.location = "list.htm";
		},
		error : function(jqxhr,textStatus) {
			alert("Oups! "+jqxhr.responseText);
			window.location = "list.htm";
		}
	});
}
