if( UIFactory === undefined )
{
  var UIFactory = {};
}
	var displayHTML = {};
	
	displayHTML["core"]  = "<div id='node_#uuid#' class='#nodetype# #semtag# #cssclass#  #resourcetype# #priv#'></div>";

	//========================== BEGIN DO NOT EDIT ===========================	
	
	displayHTML["resource-basic"]  = "<div id='sub_node_#uuid#' class='resource-basic row' >";
	displayHTML["resource-basic"] += "	<div id='std_node_#uuid#' class='col-md-offset-1 col-md-2 node-label inside-full-height'>";
	displayHTML["resource-basic"] += "		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>";
	displayHTML["resource-basic"] += "	</div>";
	displayHTML["resource-basic"] += "	<div class='col-md-8'>";
	displayHTML["resource-basic"] += "		<table><tr>";
	displayHTML["resource-basic"] += "			<td  width='80%' class='td-resource'>";
	displayHTML["resource-basic"] += "				<div id='resource_#uuid#' class='resource inside-full-height'></div>";
	displayHTML["resource-basic"] += "				<div id='comments_#uuid#' class='comments'></div>";
	displayHTML["resource-basic"] += "			</td>";
	displayHTML["resource-basic"] += "			<td id='buttons-#uuid#' class='buttons'></td>";
	displayHTML["resource-basic"] += "		</tr></table>";
	displayHTML["resource-basic"] += "	</div><!-- col-md-8 -->";
	displayHTML["resource-basic"] += "</div><!-- row -->";
	displayHTML["resource-basic"] += "<div class='row'><div id='metainfo_#uuid#' class='col-md-offset-1 col-md-10 metainfo'></div></div>";
	displayHTML["resource-basic"] += "<div id='extra_#uuid#' class='extra-basic'></div>";

	displayHTML["struct-basic"]  = "<div id='sub_node_#uuid#' class='row row-node row-struct-#nodetype#' >";
	displayHTML["struct-basic"] += "	<div id='collapsible_#uuid#' class='col-md-1'>&nbsp;</div>";
	displayHTML["struct-basic"] += "	<div id='std_node_#uuid#' class='struct-label col-md-7  '>";
	displayHTML["struct-basic"] += "		<div><a id='label_node_#uuid#'></a><span id='help_#uuid' class='ihelp'></span></div>";
	displayHTML["struct-basic"] += "		<div id='comments_#uuid#' class='comments'></div><!-- comments -->";
	displayHTML["struct-basic"] += "		<div id='metainfo_#uuid#' class='metainfo'></div><!-- metainfo -->";
	displayHTML["struct-basic"] += "	</div><!-- col-md-7 -->";
	displayHTML["struct-basic"] += "	<div id='buttons-#uuid#' class='col-md-4 buttons'></div><!-- col-md-4  -->";
	displayHTML["struct-basic"] += "</div><!-- row -->";
	displayHTML["struct-basic"] += "	<div id='content-#uuid#' class='content' ></div>";

	displayHTML["node-basic"]  = "<div id='sub_node_#uuid#' class='row row-node row-node-#nodetype#' >";
	displayHTML["node-basic"] += "	<div id='collapsible_#uuid#' class='col-md-1'>&nbsp;</div>";
	displayHTML["node-basic"] += "	<div id='std_node_#uuid#' class='node-label col-md-7  '>";
	displayHTML["node-basic"] += "		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>";
	displayHTML["node-basic"] += "		<div id='comments_#uuid#' class='comments'></div><!-- comments -->";
	displayHTML["node-basic"] += "		<div id='metainfo_#uuid#' class='metainfo'></div><!-- metainfo -->";
	displayHTML["node-basic"] += "	</div><!-- col-md-7 -->";
	displayHTML["node-basic"] += "	<div id='buttons-#uuid#' class='col-md-4 buttons'></div><!-- col-md-4  -->";
	displayHTML["node-basic"] += "</div><!-- row -->";
	displayHTML["node-basic"] += "<div id='content-#uuid#' class='content' ></div>";

	//========================== END DO NOT EDIT ===========================	

	displayHTML["struct-standard"]  = "<div id='sub_node_#uuid#' class='row row-node row-struct-#nodetype#' >";
	displayHTML["struct-standard"] += "	<div id='collapsible_#uuid#' class='col-md-1'>&nbsp;</div>";
	displayHTML["struct-standard"] += "	<div id='std_node_#uuid#' class='struct-label col-md-7  '>";
	displayHTML["struct-standard"] += "		<div><a id='label_node_#uuid#'></a><span id='help_#uuid' class='ihelp'></span></div>";
	displayHTML["struct-standard"] += "		<div id='comments_#uuid#' class='comments'></div><!-- comments -->";
	displayHTML["struct-standard"] += "		<div id='metainfo_#uuid#' class='metainfo'></div><!-- metainfo -->";
	displayHTML["struct-standard"] += "	</div><!-- col-md-7 -->";
	displayHTML["struct-standard"] += "	<div id='buttons-#uuid#' class='col-md-4 buttons'></div><!-- col-md-4  -->";
	displayHTML["struct-standard"] += "</div><!-- row -->";
	displayHTML["struct-standard"] += "	<div id='content-#uuid#' class='content' ></div>";

	displayHTML["node-standard"]  = "<div id='sub_node_#uuid#' class='node-standard row row-node row-node-#nodetype#' >";
	displayHTML["node-standard"] += "	<div id='collapsible_#uuid#' class='collapsible col-md-1'>&nbsp;</div>";
	displayHTML["node-standard"] += "	<div id='std_node_#uuid#' class='node-label col-md-7  '>";
	displayHTML["node-standard"] += "		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>";
	displayHTML["node-standard"] += "		<div id='comments_#uuid#' class='comments'></div><!-- comments -->";
	displayHTML["node-standard"] += "		<div id='metainfo_#uuid#' class='metainfo'></div><!-- metainfo -->";
	displayHTML["node-standard"] += "	</div><!-- col-md-7 -->";
	displayHTML["node-standard"] += "	<div id='buttons-#uuid#' class='col-md-4 buttons'></div><!-- col-md-4  -->";
	displayHTML["node-standard"] += "</div><!-- row -->";
	displayHTML["node-standard"] += "<div id='content-#uuid#' class='content' ></div>";


	displayHTML["resource-standard"]  = "<div id='sub_node_#uuid#' class='resource-standard row' >";
	displayHTML["resource-standard"] += "	<div id='std_node_#uuid#' class='col-md-offset-1 col-md-2 node-label inside-full-height'>";
	displayHTML["resource-standard"] += "		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>";
	displayHTML["resource-standard"] += "	</div>";
	displayHTML["resource-standard"] += "	<div class='col-md-8'>";
	displayHTML["resource-standard"] += "		<table width='100%'><tr>";
	displayHTML["resource-standard"] += "			<td  width='80%' class='td-resource'>";
	displayHTML["resource-standard"] += "				<div id='resource_#uuid#' class='resource inside-full-height'></div>";
	displayHTML["resource-standard"] += "				<div id='comments_#uuid#' class='comments'></div>";
	displayHTML["resource-standard"] += "			</td>";
	displayHTML["resource-standard"] += "			<td id='buttons-#uuid#' class='buttons'></td>";
	displayHTML["resource-standard"] += "		</tr></table>";
	displayHTML["resource-standard"] += "	</div><!-- col-md-8 -->";
	displayHTML["resource-standard"] += "</div><!-- row -->";
	displayHTML["resource-standard"] += "<div class='row'><div id='metainfo_#uuid#' class='col-md-offset-1 col-md-10 metainfo'></div></div>";
	displayHTML["resource-standard"] += "<div id='extra_#uuid#' class='extra-standard'></div>";

	//====================================================================
	
	displayHTML["resource-large"]  = "<div id='sub_node_#uuid#' class='resource-large row' >";
	displayHTML["resource-large"] += "	<div id='std_node_#uuid#' class='col-md-offset-1 col-md-10 node-label inside-full-height'>";
	displayHTML["resource-large"] += "		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>";
	displayHTML["resource-large"] += "	</div>";
	displayHTML["resource-large"] += "</div><!-- row -->";
	displayHTML["resource-large"] += "	<div class='col-md-offset-1 col-md-10'>";
	displayHTML["resource-large"] += "		<table width='100%'><tr>";
	displayHTML["resource-large"] += "			<td  width='80%' class='td-resource'>";
	displayHTML["resource-large"] += "				<div id='resource_#uuid#' class='resource inside-full-height'></div>";
	displayHTML["resource-large"] += "				<div id='comments_#uuid#' class='comments'></div><!-- comments -->";
	displayHTML["resource-large"] += "			</td>";
	displayHTML["resource-large"] += "			<td id='buttons-#uuid#' class='buttons '></td>";
	displayHTML["resource-large"] += "		</tr></table>";
	displayHTML["resource-large"] += "	</div><!-- col-md-8 -->";
	displayHTML["resource-large"] += "</div><!-- row -->";
	displayHTML["resource-large"] += "<div class='row'><div id='metainfo_#uuid#' class='col-md-offset-1 col-md-10 metainfo'></div><!-- metainfo --></div>";
	displayHTML["resource-large"] += "<div id='extra_#uuid#' class='extra-large'></div>";

	displayHTML["resource-xlarge"]  = "<div id='sub_node_#uuid#' class='resource-xlarge row' >";
	displayHTML["resource-xlarge"] += "	<div id='std_node_#uuid#' class='col-md-offset-1 col-md-7 node-label inside-full-height'>";
	displayHTML["resource-xlarge"] += "		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>";
	displayHTML["resource-xlarge"] += "	</div>";
	displayHTML["resource-xlarge"] += "	<div id='buttons-#uuid#' class='buttons col-md-4'></div>";
	displayHTML["resource-xlarge"] += "</div><!-- row -->";
	displayHTML["resource-xlarge"] += "	<div class='col-md-offset-1 col-md-10'>";
	displayHTML["resource-xlarge"] += "				<div id='resource_#uuid#' class='resource inside-full-height'></div>";
	displayHTML["resource-xlarge"] += "				<div id='comments_#uuid#' class='comments'></div><!-- comments -->";
	displayHTML["resource-xlarge"] += "	</div><!-- col-md-10 -->";
	displayHTML["resource-xlarge"] += "</div><!-- row -->";
	displayHTML["resource-xlarge"] += "<div class='row'><div id='metainfo_#uuid#' class='col-md-offset-1 col-md-10 metainfo'></div><!-- metainfo --></div>";
	displayHTML["resource-xlarge"] += "<div id='extra_#uuid#'  class='extra-xlarge'></div>";

	//====================================================================

	displayHTML["node-model"] = "<div id='collapsible_#uuid#' class='collapsible'>&nbsp;</div>";
	displayHTML["node-model"] += "<div id='sub_node_#uuid#' class='node-model row' >";
	displayHTML["node-model"] += "	<div id='std_node_#uuid#' class='node-label col-md-7  '>";
	displayHTML["node-model"] += "		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>";
	displayHTML["node-model"] += "		<div id='comments_#uuid#' class='comments'></div><!-- comments -->";
	displayHTML["node-model"] += "		<div id='metainfo_#uuid#' class='metainfo'></div><!-- metainfo -->";
	displayHTML["node-model"] += "	</div>";
	displayHTML["node-model"] += "	<div id='buttons-#uuid#' class='col-md-4 buttons' style='text-align:right'></div><!-- col-md-4  -->";
	displayHTML["node-model"] += "</div><!-- row -->";
	displayHTML["node-model"] += "<div id='content-#uuid#' class='row content' ></div>";

	displayHTML["resource-model"]  = "<div id='sub_node_#uuid#' class='resource-model row' >";
	displayHTML["resource-model"] += "	<div id='std_node_#uuid#' class='col-md-offset-1 col-md-2 node-label inside-full-height'>";
	displayHTML["resource-model"] += "		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>";
	displayHTML["resource-model"] += "	</div>";
	displayHTML["resource-model"] += "	<div class='col-md-8'>";
	displayHTML["resource-model"] += "		<table width='100%'><tr>";
	displayHTML["resource-model"] += "			<td  width='80%' class='resource'>";
	displayHTML["resource-model"] += "				<div id='resource_#uuid#' class='inside-full-height'></div>";
	displayHTML["resource-model"] += "				<div id='comments_#uuid#' class='comments'></div><!-- comments -->";
	displayHTML["resource-model"] += "			</td>";
	displayHTML["resource-model"] += "			<td id='buttons-#uuid#' class='buttons '></td>";
	displayHTML["resource-model"] += "		</tr></table>";
	displayHTML["resource-model"] += "	</div><!-- col-md-8 -->";
	displayHTML["resource-model"] += "</div><!-- row -->";
	displayHTML["resource-model"] += "<div class='row'><div id='metainfo_#uuid#' class='col-md-offset-1 col-md-10 metainfo'></div><!-- metainfo --></div>";

	
	displayHTML["resource-model3"]  = "<div id='sub_node_#uuid#' class='col-md-3' >";
	displayHTML["resource-model3"] += "	<div id='std_node_#uuid#' class='node-label'>";
	displayHTML["resource-model3"] += "		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>";
	displayHTML["resource-model3"] += "			<div id='resource_#uuid#'></div>";
	displayHTML["resource-model3"] += "	</div>";
	displayHTML["resource-model3"] += "</div>";

