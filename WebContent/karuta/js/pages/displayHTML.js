
	var displayHTML = {};
	var displayView = {};
	
	displayView["raw"] = {};
	displayView["raw"]["struct"] = ["default"];
	displayView["raw"]["node"] = ["default"];
	displayView["raw"]["resource"] = ["default"];

	displayView["standard"] = {};
	displayView["standard"]["struct"] = ["strcut"];
	displayView["standard"]["node"] = ["default","row","xwide","card","carddeck","card-carddeck","1/12","2/12","3/12","4/12","5/12","6/12","7/12","8/12","9/12","10/12","11/12"];
	displayView["standard"]["resource"] = ["default","simple","xwide","card","1/12","2/12","3/12","4/12","5/12","6/12","7/12","8/12","9/12","10/12","11/12"];
	displayView["standard"]["resource"]["Image"] = ["Img-Label"];

	displayView["model"] = {};
	displayView["model"]["node"] = ["default","card","row"];
	displayView["model"]["resource"] = ["default","1/12","2/12","3/12","4/12","5/12","6/12"];

	//========================== BEGIN DO NOT EDIT ===========================	
	
	displayHTML["raw-struct-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
									"	<div id='sub_node_#uuid#' name='lbl-div' class='row  #displayview#' >" +
									"		<div id='collapsible_#uuid#' class='col-md-1'></div>" +
									"		<div id='std_node_#uuid#' class='node-label col-md-7  '>" +
									"			<div><a id='label_node_#uuid#' class='label-libelle'></a><span id='help_#uuid#' class='ihelp'></span></div>" +
									"			<div id='comments_#uuid#' class='comments'></div><!-- comments -->" +
									"			<div id='metainfo_#uuid#' class='metainfo'></div><!-- metainfo -->" +
									"			<div id='cssinfo_#uuid#' class='cssinfo'></div><!-- cssinfo -->" +
									"		</div>" +
									"		<div class='col-md-4'><span id='buttons-#uuid#' class='buttons'/><span id='menus-#uuid#' class='menus'/></div>" +
									"	</div>" +
									"</div>";

	displayHTML["raw-node-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
								" <div id='sub_node_#uuid#' name='lbl-div' class='node row' >" +
								"	<div id='std_node_#uuid#' class='node-label col-7'>" +
								"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
								"		<div id='comments_#uuid#' class='comments'></div>" +
								"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
								"		<div id='cssinfo_#uuid#' class='cssinfo'></div><!-- cssinfo -->" +
								"	</div>" +
								"	<div class='col-4'><span id='buttons-#uuid#' class='buttons'/><span id='menus-#uuid#' class='menus'/></div>" +
								" </div>" +
								" <div id='content-#uuid#' name='cnt-div' class='content' ><\div>" +
								"</div>";

	displayHTML["raw-resource-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
									"	<div id='sub_node_#uuid#' class='resource-node row' >" +
									"		<div id='std_node_#uuid#' name='lbl-div' class='col-md-offset-1 col-md-2 node-label inside-full-height'>" +
									"			<div><span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
									"		</div>" +
									"		<div name='res-div' class='col-md-5'>" +
									"					<div id='resource_#uuid#' class='resource'></div>" +
									"					<div id='comments_#uuid#' class='comments'></div>" +
									"		</div>" +
									"		<div class='col-md-4'><span id='buttons-#uuid#' class='buttons'/></div>" +
									"	</div><!-- row -->" +
									"	<div class='row'><div id='metainfo_#uuid#' class='col-md-offset-1 col-md-10 metainfo'></div></div>" +
									"	<div id='cssinfo_#uuid#' class='cssinfo'></div><!-- cssinfo -->" +
									"	<div id='extra_#uuid#' class='extra'></div>" +
									"</div>";

	//========================== END DO NOT EDIT ===========================	

	displayHTML["standard-struct-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
												"	<div id='sub_node_#uuid#' name='lbl-div' class='node-header node #first#' >" +
												"		<div id='collapsible_#uuid#' class='collapsible'></div>" +
												"		<div id='std_node_#uuid#' class='node-label'>" +
												"			<span id='menus-#uuid#' class='menus'/><span id='buttons-#uuid#' class='buttons'/>" +
												"			<div><span class='label-node' id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
												"			<div id='comments_#uuid#' class='comments'></div>" +
												"			<div id='metainfo_#uuid#' class='metainfo'></div>" +
												"			<div id='cssinfo_#uuid#' class='cssinfo'></div><!-- cssinfo -->" +
												"		</div>" +
												"	</div>" +
												"</div>";

	displayHTML["standard-node-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
											"	<div id='sub_node_#uuid#' name='lbl-div' class='node-header node #first#' >" +
											"		<div id='collapsible_#uuid#' class='collapsible'></div>" +
											"		<div id='std_node_#uuid#' class='node-label'>" +
											"			<div class='edit-bar'><span id='menus-#uuid#' class='menus'/><span id='buttons-#uuid#' class='buttons'/></div>" +
											"			<div><span class='label-node' id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
											"			<div id='portfoliocode_#uuid#' class='portfoliocode'></div>" +
											"			<div id='comments_#uuid#' class='comments'></div>" +
											"			<div id='metainfo_#uuid#' class='metainfo'></div>" +
											"			<div id='cssinfo_#uuid#' class='cssinfo'></div><!-- cssinfo -->" +
											"		</div>" +
											"	</div>" +
											"	<div id='content-#uuid#' name='cnt-div' class='content standard-node-default-content' ><\div>" +
											"</div>";

	displayHTML["standard-node-row"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
										"	<div id='sub_node_#uuid#' name='lbl-div' class='node-header node #first#' >" +
										"		<div id='collapsible_#uuid#' class='collapsible'></div>" +
										"		<div id='std_node_#uuid#' class='node-label'>" +
										"			<div class='edit-bar'><span id='menus-#uuid#' class='menus'/><span id='buttons-#uuid#' class='buttons'/></div>" +
										"			<div><span class='label-node' id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
										"			<div id='portfoliocode_#uuid#' class='portfoliocode'></div>" +
										"			<div id='comments_#uuid#' class='comments'></div>" +
										"			<div id='metainfo_#uuid#' class='metainfo'></div>" +
										"			<div id='cssinfo_#uuid#' class='cssinfo'></div><!-- cssinfo -->" +
										"		</div>" +
										"	</div>" +
										"	<div id='content-#uuid#' name='cnt-div' class='content row standard-node-row-content' ><\div>" +
										"</div>";

	displayHTML["standard-resource-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
												"	<div id='sub_node_#uuid#' class='resource-node row' >" +
												"		<div class='col-1'></div>" +
												"		<div id='std_node_#uuid#' name='res-lbl-div' class='col-3 resource-label inside-full-height'>" +
												"			<div><span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
												"		</div>" +
//												"		<div name='res-div' class='col-8'>" +
												"			<table name='res-div' class='col-8' width='100%'><tr>" +
											"					<td  width='80%' class='td-resource'>" +
												"					<div id='resource_#uuid#' class='resource inside-full'></div>" +
												"					<div id='comments_#uuid#' class='comments'></div>" +
												"				</td>" +
												"				<td class='td-buttons buttons'><span id='menus-#uuid#' class='menus'/><span id='buttons-#uuid#' /></td>" +
												"			</tr></table>" +
//												"		</div>" +
												"	</div><!-- row -->" +
												"	<div class='row'><div id='metainfo_#uuid#' class='offset-md-1 col-md-10 metainfo'></div></div>" +
												"	<div class='row'><div id='cssinfo_#uuid#' class='offset-md-1 col-md-10 cssinfo'></div></div>" +
												"	<div id='content-#uuid#' name='cnt-div' class='content' ><\div>" +
												"	<div id='extra_#uuid#' class='extra'></div>" +
												"</div>";
	
	displayHTML["standard-resource-simple"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
												"	<div id='sub_node_#uuid#' class='resource-node' >" +
												"		<table width='100%'><tr>" +
												"			<td width='50%'><span id='buttons-#uuid#' class='buttons edit-bar'/><span id='label_node_#uuid#' class='label-libelle'/><span id='help_#uuid#' class='ihelp'/></td>" +
												"			<td width='50%' class='td-resource'>" +
												"				<div id='resource_#uuid#' class='resource'></div>" +
												"			</td>" +
												"		</tr></table>" +
												"	</div>" +
												"	<div id='comments_#uuid#' class='comments'></div>" +
												"	<div id='metainfo_#uuid#' class='metainfo'></div></div>" +
												"	<div id='cssinfo_#uuid#' class='cssinfo'></div></div>" +
												"	<div id='content-#uuid#' name='cnt-div' class='content' ><\div>" +
												"	<div id='extra_#uuid#' class='extra'></div>" +
												"</div>";

	//====================================================================
	//========================== XWIDE ===================================
	//====================================================================
	displayHTML["standard-node-xwide"]  =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
											" <div class='edit-bar'><span id='buttons-#uuid#' class='buttons'/><span id='menus-#uuid#' class='menus'/></div>" +
											" <div id='sub_node_#uuid#' name='lbl-div' class='node #displayview#' >" +
											"	<div id='collapsible_#uuid#' class='collapsible'></div>" +
											"	<div id='std_node_#uuid#' class='node-label'>" +
											"		<div class='label-help'><span id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
											"		<div id='comments_#uuid#' class='comments'></div>" +
											"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
											"	</div>" +
											" </div>" +
											" <div id='content-#uuid#' name='cnt-div' class='content standard-node-xwide-content' ><\div>" +
											"</div>";

	displayHTML["standard-resource-xwide"]  =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
									" <div id='sub_node_#uuid#' class='resource-node #displayview#' >" +
									"	<div id='std_node_#uuid#' name='res-lbl-div' class=''>" +
									 "		<div id='buttons-#uuid#' class='buttons edit-bar'></div>" +
									"		<div class='node-label inside-full-height'>" +
									 "			<div class='label-help'><span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
									 "		</div>" +
									 "	</div>" +
									 "	<div name='res-div'>" +
									 "		<div id='resource_#uuid#' class='resource'></div>" +
									 "		<div id='comments_#uuid#' class='comments'></div>" +
									 "	</div>" +
									 "</div>" +
									 "<div id='metainfo_#uuid#' class='metainfo'></div>" +
									 "<div id='cssinfo_#uuid#' class='cssinfo'></div></div>" +
									 "<div id='extra_#uuid#'  class='extra-xlarge'></div>" +
									 "</div>";
	//====================================================================
	//========================== CARD ====================================
	//====================================================================
	displayHTML["standard-node-carddeck"]  =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
												"	<div id='sub_node_#uuid#' name='lbl-div' class='node-header node #first#' >" +
												"		<div id='collapsible_#uuid#' class='collapsible'></div>" +
												"		<div id='std_node_#uuid#' class='node-label'>" +
												"			<span id='menus-#uuid#' class='menus'/><span id='buttons-#uuid#' class='buttons'/>" +
												"			<div><span id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
												"			<div id='comments_#uuid#' class='comments'></div>" +
												"			<div id='metainfo_#uuid#' class='metainfo'></div>" +
												"			<div id='cssinfo_#uuid#' class='cssinfo'></div>" +
												"		</div>" +
												 "	</div>" +
												"	<div id='content-#uuid#' name='cnt-div' class='content card-deck standard-node-carddeck-content' ></div>" +
												"</div>";
	//====================================================================
	displayHTML["standard-node-card"]  =	"<div id='node_#uuid#' class='card #displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
											"	<div id='sub_node_#uuid#' name='lbl-div' class='card-header node #first#' >" +
											"		<div id='collapsible_#uuid#' class='collapsible'></div>" +
											"		<div id='std_node_#uuid#' class='node-label'>" +
											"			<span id='menus-#uuid#' class='menus'/><span id='buttons-#uuid#' class='buttons'/>" +
											"			<div><span id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
											"			<div id='comments_#uuid#' class='comments'></div>" +
											"			<div id='metainfo_#uuid#' class='metainfo'></div>" +
											"			<div id='cssinfo_#uuid#' class='cssinfo'></div>" +
											"		</div>" +
											 "	</div>" +
											 "	<div id='content-#uuid#' name='cnt-div' class='card-body content standard-node-card-content'></div>" +
											 "	<div id='metainfo_#uuid#' class='metainfo'></div>" +
											 "</div>";
	//====================================================================
	displayHTML["standard-node-card-carddeck"]  =	"<div id='node_#uuid#' class='card #displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
													"	<div id='sub_node_#uuid#' name='lbl-div' class='card-header node #first#' >" +
													"		<div id='collapsible_#uuid#' class='collapsible'></div>" +
													"		<div id='std_node_#uuid#' class='node-label'>" +
													"			<span id='menus-#uuid#' class='menus'/><span id='buttons-#uuid#' class='buttons'/>" +
													"			<div><span id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
													"			<div id='comments_#uuid#' class='comments'></div>" +
													"			<div id='metainfo_#uuid#' class='metainfo'></div>" +
													"			<div id='cssinfo_#uuid#' class='cssinfo'></div>" +
													"		</div>" +
													"	</div>" +
													"	<div class='card-body' name='res-div'>" +
													"		<div id='content-#uuid#' name='cnt-div' class='content card-deck standard-node-card-carddeck-content'></div>" +
													"	</div>" +
													"	<div id='metainfo_#uuid#' class='metainfo'></div>" +
													"</div>";
	//====================================================================
	displayHTML["standard-resource-card"]  =	"<div id='node_#uuid#' class='card #displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
												"	<div id='std_node_#uuid#' name='res-lbl-div' class='card-header'>" +
												 "		<span id='buttons-#uuid#' class='buttons'></span>" +
												 "		<span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid#' class='ihelp'></span>" +
												 "	</div>" +
												 "	<div class='card-body' name='res-div'>" +
												 "		<div id='resource_#uuid#' class='resource'></div>" +
												 "		<div id='comments_#uuid#' class='comments'></div>" +
												 " 		<div id='extra_#uuid#'  class='extra-xlarge'></div>" +
												 "	</div>" +
												 " <div id='metainfo_#uuid#' class='metainfo'></div>" +
												 " <div id='cssinfo_#uuid#' class='cssinfo'></div>" +
												 "</div>";
///====================================================================
//====================================================================
//====================================================================
//====================================================================
	displayHTML["standard-resource-Image-Img-Label2"]  =	"<div id='node_#uuid#' class='card #displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
													"	<div id='resource_#uuid#' class='card-img'></div>" +
													"	<div id='std_node_#uuid#' name='res-lbl-div' class='card-img-overlay'>" +
													 "		<div id='buttons-#uuid#' class='buttons edit-bar'></div>" +
													 "		<div class='label-help'><span id='label_node_#uuid#' class='card-title'/><span id='help_#uuid#' class='ihelp'/></div>" +
													 "	</div>" +
													 " <div id='metainfo_#uuid#' class='metainfo'></div>" +
													 "</div>";
	displayHTML["standard-resource-Image-Img-Label"]  =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
												" <div id='sub_node_#uuid#' class='resource-node #displayview#' >" +
												"<div id='buttons-#uuid#' class='buttons edit-bar'></div>" +
												"	<div name='res-div'>" +
												"		<div id='resource_#uuid#' class='resource'></div>" +
												"		<div id='std_node_#uuid#' name='res-lbl-div'>" +
												"			<div class='node-label'>" +
												"				<div><span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
												"			</div>" +
												"		</div>" +
												"		<div id='comments_#uuid#' class='comments'></div>" +
												"	</div>" +
												"</div>" +
												"<div id='metainfo_#uuid#' class='metainfo'></div>" +
												"<div id='cssinfo_#uuid#' class='cssinfo'></div>" +
												"<div id='extra_#uuid#'  class='extra-xlarge'></div>" +
												"</div>";
//====================================================================
//======================= MODEL ======================================
//====================================================================
	displayHTML["model-node-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype#'>" +
								" <div id='sub_node_#uuid#' name='lbl-div' class='node-model' >" +
								"	<div id='collapsible_#uuid#' class='collapsible'></div>" +
								"	<div id='std_node_#uuid#' class='model-node-label'>" +
								"		<span id='buttons-#uuid#' class='buttons'/><span id='menus-#uuid#' class='menus'/>" +
								"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
								"		<div id='portfoliocode_#uuid#' class='portfoliocode'></div>" +
								"		<div id='comments_#uuid#' class='comments'></div>" +
								"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
								"		<div id='cssinfo_#uuid#' class='cssinfo'></div>" +
								"	</div>" +
								" </div>" +
								" <div id='content-#uuid#' name='cnt-div' class='content #row#' ><\div>" +
								"</div>";
	
	var model_resource = "<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #col#'>" +
											"	<div id='sub_node_#uuid#' class='row' >" +
											"		<div id='std_node_#uuid#'  name='label-div'class='#col-a# resource-node-label inside-full'>" +
											"			<div><span id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
											"		</div>" +
											"		<div class='#col-b#'>" +
											"			<table width='100%'><tr>" +
											"				<td  width='80%' class='td-resource'>" +
											"					<div id='resource_#uuid#' class='resource inside-full'></div>" +
											"					<div id='comments_#uuid#' class='comments'></div><!-- comments -->" +
											"				</td>" +
											"				<td class='td-buttons'><span id='menus-#uuid#' class='menus'/><span id='buttons-#uuid#' class='buttons' /></td>" +
											"			</tr></table>" +
											"		</div>" +
											"	</div>" +
											"	<div id='metainfo_#uuid#' class='metainfo'></div>" +
											"	<div id='cssinfo_#uuid#' class='cssinfo'></div>" +
											"</div>";

	displayHTML["model-resource-default"] = model_resource.replace("#col-a#","col-2").replace("#col-b#","col-10")
	
	displayHTML["model-node-card"] =	"<div id='node_#uuid#' class=' card #displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype#'>" +
										" <div id='sub_node_#uuid#' name='lbl-div' class='card-header node-model' >" +
										"	<div id='collapsible_#uuid#' class='collapsible'></div>" +
										"	<div id='std_node_#uuid#' class='node-label'>" +
										"		<span id='buttons-#uuid#' class='buttons'/><span id='menus-#uuid#' class='menus'/>" +
										"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
										"		<div id='comments_#uuid#' class='comments'></div>" +
										"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
										"		<div id='cssinfo_#uuid#' class='cssinfo'></div>" +
										"	</div>" +
										" </div>" +
										"	<div class='card-body' name='res-div'>" +
										" 		<div id='content-#uuid#' name='cnt-div' class='content'></div>" +
										"	</div>" +
										"</div>";

	displayHTML["model-node-row"] =	"<div id='node_#uuid#' class=' card #displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype#'>" +
										" <div id='sub_node_#uuid#' name='lbl-div' class='card-header node-model' >" +
										"	<div id='collapsible_#uuid#' class='collapsible'></div>" +
										"	<div id='std_node_#uuid#' class='node-label'>" +
										"		<span id='buttons-#uuid#' class='buttons'/><span id='menus-#uuid#' class='menus'/>" +
										"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
										"		<div id='comments_#uuid#' class='comments'></div>" +
										"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
										"		<div id='cssinfo_#uuid#' class='cssinfo'></div>" +
										"	</div>" +
										" </div>" +
										"	<div class='card-body' name='res-div'>" +
										" 		<div id='content-#uuid#' name='cnt-div' class='content row'></div>" +
										"	</div>" +
										"</div>";

	displayHTML["model-node-row"] = displayHTML["model-node-default"].replace("#row#","row");
	
	displayHTML["model-resource-1/12"] = model_resource.replace("#col-a#","col-3").replace("#col-b#","col-9").replace("#col#","col-1");
	displayHTML["model-resource-2/12"] = model_resource.replace("#col-a#","col-3").replace("#col-b#","col-9").replace("#col#","col-2");
	displayHTML["model-resource-3/12"] = model_resource.replace("#col-a#","col-3").replace("#col-b#","col-9").replace("#col#","col-3")
	displayHTML["model-resource-4/12"] = model_resource.replace("#col-a#","col-3").replace("#col-b#","col-9").replace("#col#","col-4")
	displayHTML["model-resource-5/12"] = model_resource.replace("#col-a#","col-3").replace("#col-b#","col-9").replace("#col#","col-5")
	displayHTML["model-resource-6/12"] = model_resource.replace("#col-a#","col-3").replace("#col-b#","col-9").replace("#col#","col-6")

//====================================================================
//====================================================================
//====================================================================

	var node1 = "<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv# col-md-";
	var node2 = " ' >" +
					"<div class='edit-bar'><span id='buttons-#uuid#' class='buttons'/><span id='menus-#uuid#' class='menus'/></div>" +
					"<div id='sub_node_#uuid#' name='lbl-div' class='node #displayview#' >" +
					"	<div id='collapsible_#uuid#' class='collapsible'></div>" +
					"	<div id='std_node_#uuid#' class='node-label'>" +
					"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
					"		<div id='comments_#uuid#' class='comments'></div>" +
					"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
					"		<div id='cssinfo_#uuid#' class='cssinfo'></div>" +
					"	</div>" +
					"</div>" +
					"<div id='content-#uuid#' name='cnt-div' class='content' ></div>" +
					"</div>";

	displayHTML["standard-node-1/12"]  =	node1 + "1" + node2;
	displayHTML["standard-node-2/12"]  =	node1 + "2" + node2;
	displayHTML["standard-node-3/12"]  =	node1 + "3" + node2;
	displayHTML["standard-node-4/12"]  =	node1 + "4" + node2;
	displayHTML["standard-node-5/12"]  =	node1 + "5" + node2;
	displayHTML["standard-node-6/12"]  =	node1 + "6" + node2;
	displayHTML["standard-node-7/12"]  =	node1 + "7" + node2;
	displayHTML["standard-node-8/12"]  =	node1 + "8" + node2;
	displayHTML["standard-node-9/12"]  =	node1 + "9" + node2;
	displayHTML["standard-node-10/12"]  =	node1 + "10" + node2;
	displayHTML["standard-node-11/12"]  =	node1 + "11" + node2;
	
	var resource1 = "<div id='node_#uuid#' class='resource- #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv# col-md-";
	var resource2 = " ' >" +
					"	<div class='edit-bar'><span id='buttons-#uuid#' name='res-div' class='buttons'/></div>" +
					"	<div id='sub_node_#uuid#' class='node #displayview#' >" +
					"		<div id='std_node_#uuid#' class='node-label'>" +
					"			<div name='res-lbl-div'><span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid#' class='ihelp'></span></div>" +
					"		</div>" +
					"		<div id='resource_#uuid#' name='res-div' class='resource'></div>" +
					"		<div id='comments_#uuid#' class='comments'></div>" +
					"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
					"		<div id='cssinfo_#uuid#' class='cssinfo'></div>" +
					"	</div>" +
					"</div>";

	displayHTML["standard-resource-1/12"]  =	resource1 + "1" + resource2;
	displayHTML["standard-resource-2/12"]  =	resource1 + "2" + resource2;
	displayHTML["standard-resource-3/12"]  =	resource1 + "3" + resource2;
	displayHTML["standard-resource-4/12"]  =	resource1 + "4" + resource2;
	displayHTML["standard-resource-5/12"]  =	resource1 + "5" + resource2;
	displayHTML["standard-resource-6/12"]  =	resource1 + "6" + resource2;
	displayHTML["standard-resource-7/12"]  =	resource1 + "7" + resource2;
	displayHTML["standard-resource-8/12"]  =	resource1 + "8" + resource2;
	displayHTML["standard-resource-9/12"]  =	resource1 + "9" + resource2;
	displayHTML["standard-resource-10/12"]  =	resource1 + "10" + resource2;
	displayHTML["standard-resource-11/12"]  =	resource1 + "11" + resource2;


