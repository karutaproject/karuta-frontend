
	var displayHTML = {};
	var displayView = {};
	
	displayView["basic"] = {};
	displayView["basic","struct"] = ["default"];
	displayView["basic","node"] = ["default"];
	displayView["basic","resource"] = ["default"];

	displayView["standard"] = {};
	displayView["standard","struct"] = ["strcut"];
	displayView["standard","node"] = ["default","row","xwide","card","card-deck","card-card-deck"];
	displayView["standard","resource"] = ["default","1/12","2/12","3/12","4/12","5/12","6/12","xwide","card"];
	displayView["standard","resource","Image"] = ["Img-Label"];

	displayView["model","node"] = ["default","card","row"];
	displayView["model","resource"] = ["default","1/12","2/12","3/12","4/12","5/12","6/12"];

	//========================== BEGIN DO NOT EDIT ===========================	
	
	displayHTML["basic-struct-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
									"	<div id='sub_node_#uuid#' name='lbl-div' class='row  #displayview#' >" +
									"		<div id='collapsible_#uuid#' class='col-md-1'></div>" +
									"		<div id='std_node_#uuid#' class='node-label col-md-7  '>" +
									"			<div><a id='label_node_#uuid#' class='label-libelle'></a><span id='help_#uuid' class='ihelp'></span></div>" +
									"			<div id='comments_#uuid#' class='comments'></div><!-- comments -->" +
									"			<div id='metainfo_#uuid#' class='metainfo'></div><!-- metainfo -->" +
									"		</div>" +
									"		<div class='col-md-4'><span id='buttons-#uuid#' class='buttons'></span><span id='menus-#uuid#' class='menus'></span></div>" +
									"	</div>" +
									"</div>";

	displayHTML["basic-node-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
								" <div id='sub_node_#uuid#' name='lbl-div' class='node row' >" +
								"	<div id='collapsible_#uuid#' class='collapsible col-md-1'></div>" +
								"	<div id='std_node_#uuid#' class='node-label col-md-7'>" +
								"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
								"		<div id='comments_#uuid#' class='comments'></div>" +
								"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
								"	</div>" +
								"	<div class='col-md-4'><span id='buttons-#uuid#' class='buttons'></span><span id='menus-#uuid#' class='menus'></span></div>" +
								" </div>" +
								" <div id='content-#uuid#' name='cnt-div' class='content row' ><\div>" +
								"</div>";

	displayHTML["basic-resource-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
									"	<div id='sub_node_#uuid#' class='resource-node row' >" +
									"		<div id='std_node_#uuid#' name='lbl-div' class='col-md-offset-1 col-md-2 node-label inside-full-height'>" +
									"			<div><span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid' class='ihelp'></span></div>" +
									"		</div>" +
									"		<div name='res-div' class='col-md-5'>" +
									"					<div id='resource_#uuid#' class='resource'></div>" +
									"					<div id='comments_#uuid#' class='comments'></div>" +
									"		</div>" +
									"		<div class='col-md-4'><span id='buttons-#uuid#' class='buttons'></span></div>" +
									"	</div><!-- row -->" +
									"	<div class='row'><div id='metainfo_#uuid#' class='col-md-offset-1 col-md-10 metainfo'></div></div>" +
									"	<div id='extra_#uuid#' class='extra'></div>" +
									"</div>";

	//========================== END DO NOT EDIT ===========================	

	displayHTML["standard-struct-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
										"<div id='sub_node_#uuid#' name='lbl-div' class='row  #displayview#' >" +
										"	<div id='collapsible_#uuid#' class='col-1'></div>" +
										"	<div id='std_node_#uuid#' class='node-label col-md-7  '>" +
										"		<div><a id='label_node_#uuid#' class='label-libelle'></a><span id='help_#uuid' class='ihelp'></span></div>" +
										"		<div id='comments_#uuid#' class='comments'></div><!-- comments -->" +
										"		<div id='metainfo_#uuid#' class='metainfo'></div><!-- metainfo -->" +
										"	</div><!-- col-md-7 -->" +
										"	<div class='col-md-4'><span id='buttons-#uuid#' class='buttons'></span><span id='menus-#uuid#' class='menus'><span></div><!-- col-md-4  -->" +
										"</div><!-- row -->" +
										"</div>";

	displayHTML["standard-node-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
									" <div id='sub_node_#uuid#' name='lbl-div' class='node row #first#' >" +
									"	<div id='collapsible_#uuid#' class='collapsible col-1'></div>" +
									"	<div id='std_node_#uuid#' class='node-label col-7'>" +
									"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
									"		<div id='comments_#uuid#' class='comments'></div>" +
									"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
									"	</div>" +
									"	<div class='col-4'><span id='buttons-#uuid#' class='buttons'></span><span id='menus-#uuid#' class='menus'></span></div>" +
									" </div>" +
									" <div id='content-#uuid#' name='cnt-div' class='content' ><\div>" +
									"</div>";

	displayHTML["standard-node-row"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
											" <div id='sub_node_#uuid#' name='lbl-div' class='node row #first#' >" +
											"	<div id='collapsible_#uuid#' class='collapsible col-1'></div>" +
											"	<div id='std_node_#uuid#' class='node-label col-7'>" +
											"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
											"		<div id='comments_#uuid#' class='comments'></div>" +
											"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
											"	</div>" +
											"	<div class='col-4'><span id='buttons-#uuid#' class='buttons'></span><span id='menus-#uuid#' class='menus'></span></div>" +
											" </div>" +
											" <div id='content-#uuid#' name='cnt-div' class='content row' ><\div>" +
											"</div>";

	displayHTML["standard-resource-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
												"	<div id='sub_node_#uuid#' class='resource-node row' >" +
												"		<div class='col-2'></div>" +
												"		<div id='std_node_#uuid#' name='lbl-div' class='col-2 node-label inside-full-height'>" +
												"			<div><span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid' class='ihelp'></span></div>" +
												"		</div>" +
												"		<div name='res-div' class='col-8'>" +
												"			<table width='100%'><tr>" +
											"					<td  width='80%' class='td-resource'>" +
												"					<div id='resource_#uuid#' class='resource inside-full'></div>" +
												"					<div id='comments_#uuid#' class='comments'></div>" +
												"				</td>" +
												"				<td class='td-buttons buttons'><span id='buttons-#uuid#'></span><span id='menus-#uuid#' class='menus'><span></td>" +
												"			</tr></table>" +
												"		</div>" +
												"	</div><!-- row -->" +
												"	<div class='row'><div id='metainfo_#uuid#' class='offset-md-1 col-md-10 metainfo'></div></div>" +
												"	<div id='content-#uuid#' name='cnt-div' class='content' ><\div>" +
												"	<div id='extra_#uuid#' class='extra'></div>" +
												"</div>";

	//====================================================================
	displayHTML["standard-node-xwide"]  =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
									" <div id='sub_node_#uuid#' name='lbl-div' class='node #displayview#' >" +
									"	<div id='collapsible_#uuid#' class='collapsible'></div>" +
									"	<div id='std_node_#uuid#' class='node-label'>" +
									"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
									"		<div id='comments_#uuid#' class='comments'></div>" +
									"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
									"	</div>" +
									"	<div><span id='buttons-#uuid#' class='buttons'></span><span id='menus-#uuid#' class='menus'></span></div>" +
									" </div>" +
									" <div id='content-#uuid#' name='cnt-div' class='content' ><\div>" +
									"</div>";

	displayHTML["standard-resource-xwide"]  =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
									" <div id='sub_node_#uuid#' class='resource-node #displayview#' >" +
									"	<div id='std_node_#uuid#' name='lbl-div' class='row'>" +
									"		<div class='col-md-offset-1 col-md-7 node-label inside-full-height'>" +
									 "			<div><span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid' class='ihelp'></span></div>" +
									 "		</div>" +
									 "		<div id='buttons-#uuid#' class='buttons col-md-4'></div>" +
									 "	</div>" +
									 "	<div name='res-div'>" +
									 "		<div id='resource_#uuid#' class='resource'></div>" +
									 "		<div id='comments_#uuid#' class='comments'></div>" +
									 "	</div>" +
									 "</div>" +
									 "<div id='metainfo_#uuid#' class='metainfo'></div>" +
									 "<div id='extra_#uuid#'  class='extra-xlarge'></div>" +
									 "</div>";
	//====================================================================
	//========================== CARD ====================================
	//====================================================================
	displayHTML["standard-node-card-deck"]  =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
												" <div id='sub_node_#uuid#' name='lbl-div' class='node row #first#' >" +
												"	<div id='collapsible_#uuid#' class='collapsible col-1'></div>" +
												"	<div id='std_node_#uuid#' class='node-label col-6'>" +
												"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
												"		<div id='comments_#uuid#' class='comments'></div>" +
												"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
												"	</div>" +
												"	<div class='col-4 ml-auto butmen'><span id='buttons-#uuid#' class='buttons'></span><span id='menus-#uuid#' class='menus'></span></div>" +
												" </div>" +
												" <div id='content-#uuid#' name='cnt-div' class='content card-deck' ></div>" +
												"</div>";
	//====================================================================
	displayHTML["standard-node-card"]  =	"<div id='node_#uuid#' class='card #displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
											"	<div id='sub_node_#uuid#' name='lbl-div' class='card-header node row #first#' >" +
											"		<div id='collapsible_#uuid#' class='collapsible col-1'></div>" +
											"		<div id='std_node_#uuid#' class='node-label col-6'>" +
											"			<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
											"			<div id='comments_#uuid#' class='comments'></div>" +
											"			<div id='metainfo_#uuid#' class='metainfo'></div>" +
											"		</div>" +
											"		<div class='col-4 ml-auto butmen'><span id='buttons-#uuid#' class='buttons'></span><span id='menus-#uuid#' class='menus'></span></div>" +
											 "	</div>" +
											 "	<div class='card-body' name='res-div'>" +
											" 		<div id='content-#uuid#' name='cnt-div' class='content'></div>" +
											 "	</div>" +
											 "	<div id='metainfo_#uuid#' class='metainfo'></div>" +
											 "</div>";
	//====================================================================
	displayHTML["standard-node-card-card-deck"]  =	"<div id='node_#uuid#' class='card #displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
													"	<div id='sub_node_#uuid#' name='lbl-div' class='card-header node row #first#' >" +
													"		<div id='collapsible_#uuid#' class='collapsible col-1'></div>" +
													"		<div id='std_node_#uuid#' class='node-label col-6'>" +
													"			<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
													"			<div id='comments_#uuid#' class='comments'></div>" +
													"			<div id='metainfo_#uuid#' class='metainfo'></div>" +
													"		</div>" +
													"		<div class='col-4 ml-auto butmen'><span id='buttons-#uuid#' class='buttons'></span><span id='menus-#uuid#' class='menus'></span></div>" +
													"	</div>" +
													"	<div class='card-body' name='res-div'>" +
													"		<div id='content-#uuid#' name='cnt-div' class='content card-deck'></div>" +
													"	</div>" +
													"	<div id='metainfo_#uuid#' class='metainfo'></div>" +
													"</div>";
	displayHTML["standard-resource-card"]  =	"<div id='node_#uuid#' class='card #displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
												"	<div id='std_node_#uuid#' name='lbl-div' class='card-header'>" +
												 "		<div id='buttons-#uuid#' class='buttons'></div>" +
												 "		<span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid' class='ihelp'></span>" +
												 "	</div>" +
												 "	<div class='card-body' name='res-div'>" +
												 "		<div id='resource_#uuid#' class='resource'></div>" +
												 "		<div id='comments_#uuid#' class='comments'></div>" +
												 " 		<div id='extra_#uuid#'  class='extra-xlarge'></div>" +
												 "	</div>" +
												 " <div id='metainfo_#uuid#' class='metainfo'></div>" +
												 "</div>";
//====================================================================
//====================================================================
//====================================================================
	displayHTML["standard-resource-Image-Img-Label"]  =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv#'>" +
												"<div id='buttons-#uuid#' class='buttons' style='text-align:right'></div>" +
												" <div id='sub_node_#uuid#' class='resource-node #displayview#' >" +
												"	<div name='res-div'>" +
												"		<div id='resource_#uuid#' class='resource'></div>" +
												"		<div id='std_node_#uuid#' name='lbl-div'>" +
												"			<div class='node-label'>" +
												"				<div><span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid' class='ihelp'></span></div>" +
												"			</div>" +
												"		</div>" +
												"		<div id='comments_#uuid#' class='comments'></div>" +
												"	</div>" +
												"</div>" +
												"<div id='metainfo_#uuid#' class='metainfo'></div>" +
												"<div id='extra_#uuid#'  class='extra-xlarge'></div>" +
												"</div>";
//====================================================================
//======================= MODEL ======================================
//====================================================================
	displayHTML["model-node-default"] =	"<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype#'>" +
								" <div id='sub_node_#uuid#' name='lbl-div' class='node-model' >" +
								"	<div id='collapsible_#uuid#' class='collapsible'></div>" +
								"	<div id='std_node_#uuid#' class='node-label'>" +
								"		<div id='menus-#uuid#' class='menus'/><div id='buttons-#uuid#' class='buttons'/>" +
								"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
								"		<div id='comments_#uuid#' class='comments'></div>" +
								"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
								"	</div>" +
								" </div>" +
								" <div id='content-#uuid#' name='cnt-div' class='content #row#' ><\div>" +
								"</div>";
	
	var model_resource = "<div id='node_#uuid#' class='#displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #col#'>" +
											"	<div id='sub_node_#uuid#' class='row' >" +
											"		<div id='std_node_#uuid#'  name='label-div'class='#col-a# node-label inside-full'>" +
											"			<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
											"		</div>" +
											"		<div class='#col-b#'>" +
											"			<table width='100%'><tr>" +
											"				<td  width='80%' class='td-resource'>" +
											"					<div id='resource_#uuid#' class='resource inside-full'></div>" +
											"					<div id='comments_#uuid#' class='comments'></div><!-- comments -->" +
											"				</td>" +
											"				<td class='td-buttons'><span id='menus-#uuid#' class='menus'/><span id='buttons-#uuid#' class='buttons' /></td>" +
											"			</tr></table>" +
											"		</div><!-- col-8 -->" +
											"	</div>" +
											"	<div id='metainfo_#uuid#' class='metainfo'></div>" +
											"</div>";

	displayHTML["model-resource-default"] = model_resource.replace("#col-a#","col-2").replace("#col-b#","col-8")
	
	displayHTML["model-node-card"] =	"<div id='node_#uuid#' class=' card #displayview# #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype#'>" +
										" <div id='sub_node_#uuid#' name='lbl-div' class='card-header node-model' >" +
										"	<div id='collapsible_#uuid#' class='collapsible'></div>" +
										"	<div id='std_node_#uuid#' class='node-label'>" +
										"		<div id='menus-#uuid#' class='menus'/><div id='buttons-#uuid#' class='buttons'/>" +
										"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
										"		<div id='comments_#uuid#' class='comments'></div>" +
										"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
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
										"		<div id='menus-#uuid#' class='menus'/><div id='buttons-#uuid#' class='buttons'/>" +
										"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
										"		<div id='comments_#uuid#' class='comments'></div>" +
										"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
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
					"<div id='sub_node_#uuid#' name='lbl-div' class='node #displayview#' >" +
					"	<div id='collapsible_#uuid#' class='collapsible'></div>" +
					"	<div id='std_node_#uuid#' class='node-label'>" +
					"		<div><span id='label_node_#uuid#'></span><span id='help_#uuid' class='ihelp'></span></div>" +
					"		<div id='comments_#uuid#' class='comments'></div>" +
					"		<div id='metainfo_#uuid#' class='metainfo'></div>" +
					"	</div>" +
					"	<div><span id='buttons-#uuid#' class='buttons'></span><span id='menus-#uuid#' class='menus'><span></div>" +
					"</div>" +
					"<div id='content-#uuid#' name='cnt-div' class='content' ></div>" +
					"</div>";

	displayHTML["standard-node-1/12"]  =	node1 + "1" + node2;
	displayHTML["standard-node-2/12"]  =	node1 + "2" + node2;
	displayHTML["standard-node-3/12"]  =	node1 + "3" + node2;
	displayHTML["standard-node-4/12"]  =	node1 + "4" + node2;
	displayHTML["standard-node-5/12"]  =	node1 + "5" + node2;
	displayHTML["standard-node-6/12"]  =	node1 + "6" + node2;
	
	var resource1 = "<div id='node_#uuid#' class='resource- #displaytype# #nodetype# #semtag# #cssclass#  #resourcetype# #priv# col-md-";
	var resource2 = " ' >" +
					"<div id='sub_node_#uuid#' class='node #displayview#' >" +
					"	<div id='std_node_#uuid#' class='node-label'>" +
					"		<div name='lbl-div'><span id='label_node_#uuid#' class='label-libelle'></span><span id='help_#uuid' class='ihelp'></span></div>" +
					"		<div id='resource_#uuid#' name='res-div' class='resource'></div>" +
					"	</div>" +
					"	<div id='buttons-#uuid#' name='res-div' class='buttons'></div>" +
					"</div>" +
					"</div>";

	displayHTML["standard-resource-1/12"]  =	resource1 + "1" + resource2;
	displayHTML["standard-resource-2/12"]  =	resource1 + "2" + resource2;
	displayHTML["standard-resource-3/12"]  =	resource1 + "3" + resource2;
	displayHTML["standard-resource-4/12"]  =	resource1 + "4" + resource2;
	displayHTML["standard-resource-5/12"]  =	resource1 + "5" + resource2;
	displayHTML["standard-resource-6/12"]  =	resource1 + "6" + resource2;


