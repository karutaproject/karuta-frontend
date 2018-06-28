
//==============================
function show_exec_report()
//==============================
{
	hideAllPages();

	$("body").removeClass();
	$("body").addClass("exec_report")
	$("#sub-bar").html("");
	setLanguageMenu("fill_exec_report()");
	$("#refresh").attr("onclick","fill_exec_report()");
	$("#refresh").show();
	$("#main-exec-report").show();
	report_not_in_a_portfolio = true;
}

//==============================
function fill_exec_report()
//==============================
{
	setLanguageMenu("fill_exec_report()");
	var html = "";
	html += "<h2 id='report' class='line'>KARUTA - <span id='report-title-page'></span></h2>";
	html += "<h4 class='line'><span class='badge'>1</span> <span id='report-title-1'></span></h4>";
	html += "<div id='report-csv_file_upload' style='margin-left:20px'></div>";
	html += "<div style='margin-left:20px'> <span id='report-title-3'></span>&nbsp;<input  id='report-model_code' type='text'></input>&nbsp;<span class='button' onclick='javascript:report_processCode()'>ok</span></div>";
	html += "<div id='report-model_description' style='margin-left:20px'></div>";
	html += "<div id='report-csv_file_upload2' style='margin-left:20px'></div>";
	html += "<h4 class='line'><span class='badge'>2</span> <span id='report-title-2'></span></h4>";
	html += "<div id='report-process_button' style='margin-left:20px'></div>";
	html += "<div id='report-log' style='margin-left:20px;margin-top:20px'></div>";
	html += "<div id='report-content' class='createreport'></div>";
	html += "<div id='report-pdf'></div>";
	html += "<div id='report-csv'></div>";
	$("#main-exec-report").html(html);
	//------------------------------
	var model_code = "";
	var html ="";
	var url = serverBCK+"/csv";
	html +=" <div id='report-divfileupload'>";
	html +=" <input id='report-fileupload' type='file' name='uploadfile' data-url='"+url+"'>";
	html += "</div>";
	html +=" <div id='report-progress'><div class='bar' style='width: 0%;'></div></div>";
	$("#report-csv_file_upload").append($(html));
	//------------------------------
	$("#report-fileupload").fileupload({
		progressall: function (e, data) {
			$("#report-progress").css('border','1px solid lightgrey');
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#report-progress .bar').css('width',progress + '%');
		},
		done: function (e, data,uuid) {
			$("#report-divfileupload").html("Loaded");
			json = data.result;
			model_code =json.model_code;
			report_getModelAndProcess(model_code,json);
		}
    });
	//------------------------------
	$("#report-title-head").html("KARUTA - "+karutaStr[LANG]['report']);
	$("#report-title-page").html(karutaStr[LANG]['report']);
	$("#report-title-1").html(karutaStr[LANG]['upload_csv_or_code']);
	$("#report-title-2").html(karutaStr[LANG]['process_csv']);
	$("#report-title-3").html(karutaStr[LANG]['model_code']);
	//------------------------------
}

//==============================
function display_exec_report()
//==============================
{
	if ($("#report").length) {
		show_exec_report();
	} else {
		fill_exec_report();
		show_exec_report();
	}
}