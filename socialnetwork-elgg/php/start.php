<?php

/**

 * Elgg web services API plugin

 */



elgg_register_event_handler('init', 'system', 'ws_init');



function ws_init() {

	$lib_dir = elgg_get_plugins_path() . "web_services/lib";

	elgg_register_library('elgg:ws', "$lib_dir/web_services.php");

	elgg_register_library('elgg:ws:api_user', "$lib_dir/api_user.php");

	elgg_register_library('elgg:ws:client', "$lib_dir/client.php");

	elgg_register_library('elgg:ws:tokens', "$lib_dir/tokens.php");



	elgg_load_library('elgg:ws:api_user');

	elgg_load_library('elgg:ws:tokens');



	elgg_register_page_handler('services', 'ws_page_handler');



	// Register a service handler for the default web services

	// The name rest is a misnomer as they are not RESTful

	elgg_ws_register_service_handler('rest', 'ws_rest_handler');



	// expose the list of api methods

	elgg_ws_expose_function("system.api.list", "list_all_apis", null,

		elgg_echo("system.api.list"), "GET", false, false);



	elgg_register_plugin_hook_handler('unit_test', 'system', 'ws_unit_test');
	
	

	// The authentication token api

	elgg_ws_expose_function(
		"auth.gettoken",
		"auth_gettoken",
		array(
			'username' => array ('type' => 'string'),
			'password' => array ('type' => 'string'),
		),
		elgg_echo('auth.gettoken'),
		'POST',
		false,
		false
	);

	//=========================================================
	//=========================================================
	//====================== thewire ==========================
	//=========================================================
	//=========================================================
	
	//--------------- thewire.get_posts ------------------
    elgg_ws_expose_function("thewire.get_posts",
		"wire_get_posts",
		array("context" => array('type' => 'string')),
		'Get Wire Posts',
		'GET',
		false,
		 true
		); 

	//--------------- thewire.post ------------------
    elgg_ws_expose_function("thewire.post",
		"my_post_to_wire",
		array("text" => array('type' => 'string')),
		'Post to the wire. 140 characters or less',
		'POST',
		false,
		true
	);

	//=========================================================
	//=========================================================
	//====================== user =============================
	//=========================================================
	//=========================================================
    
	//--------------- user.register ------------------
    elgg_ws_expose_function('user.register',
		"user_register",
		array('name' => array ('type' => 'string'),
			'email' => array ('type' => 'string'),
			'username' => array ('type' => 'string'),
			'password' => array ('type' => 'string'),
		),
		"Register user",
		'GET',
		false,
		false
	);

               

	//--------------- user.getuser ------------------
    elgg_ws_expose_function("auth.getuser",
		"auth_getuser",
		array(
		),
		elgg_echo('auth.getuser'),
		'GET',
 		false,
		false
	);

	//=========================================================
	//=========================================================
	//====================== site =============================
	//=========================================================
	//=========================================================
	
    expose_function('site.river_feed',

               "site_river_feed",

               array('limit' => array('type' => 'int', 'required' => false)),

               "Get river feed",

               'GET',

               false,

               false);

 

   expose_function('thewire.post',

				"thewire_post",

				array(

						'text' => array ('type' => 'string'),

						'access' => array ('type' => 'string', 'required' => false),

						'wireMethod' => array ('type' => 'string', 'required' => false),

						'username' => array ('type' => 'string', 'required' => false),

					),

				"Post a wire post",

				'POST',

				false,

				false);           

 

	//=========================================================
	//=========================================================
	//====================== group ============================
	//=========================================================
	//=========================================================
   
	expose_function('group.get_groups',

		"group_get_groups",

		array(	'context' => array ('type' => 'string', 'required' => false, 'default' => elgg_is_logged_in() ? "user" : "all"),

				'username' => array ('type' => 'string', 'required' => false),

				'limit' => array ('type' => 'int', 'required' => false),

				'offset' => array ('type' => 'int', 'required' => false),

				),

		"Get groups use is a member of",

		'GET',

		false,

		false

	);



	expose_function("group.save",

		"group_save",

		array(

			'name' => array ('type' => 'string'),

			'briefdescription' => array ('type' => 'string', 'required' => false),

			'description' => array ('type' => 'string', 'required' => false),

			'interests' => array ('type' => 'string', 'required' => false),

			'group_guid' => array ('type' => 'int', 'required' => false),

		),

		'Create group',

		'POST',

		false,

		false

	);



	expose_function("group.delete",

		"group_delete",

		array(

			'group_guid' => array ('type' => 'int', 'required' => true),

		),

		'Delete group',

		'POST',

		false,

		false

	);



	expose_function('group.join',

		"group_join",

		array(

			'group_guid' => array ('type' => 'string'),

			'username' => array ('type' => 'string'),

		),

		"Join a group",

		'POST',

		false,

		false

	);



	expose_function("group.leave",

		"group_leave",

		array(

			'group_guid' => array ('type' => 'int', 'required' => true),

			'username' => array ('type' => 'string', 'required' => false),

		),

		'User leave group',

		'POST',

		false,

		false

	);

	

	elgg_ws_expose_function("group.thewire.get_posts",

               "wire_get_posts_by_container_guid",

                array(



           'limit' => array('type' => 'int', 'required' => false),

			'container_guid' => array('type' => 'int', 'required' => false),

             ),

                'Get wire posts by group',

                'GET',

                false,

                false

               );

               

	//--------------- group.thewire.post ------------------
	expose_function('group.thewire.post',
		"wire_save_post_group",
		array(
			'text' => array ('type' => 'string', 'required' => true),
			'group_guid' => array ('type' => 'int', 'required' => true)
		),
		"Post a wire post",
		'POST',
		false,
		false
	);

               

	//=========================================================
	//=========================================================
	//====================== wire =============================
	//=========================================================
	//=========================================================
    
               

    expose_function('wire.save_comment',

               "wire_save_comment",

               array(

                       'entity_guid' => array ('type' => 'int'),

                       'text' => array ('type' => 'string'),

                   ),

               "Post a wire comment",

               'POST',

               false,

               false);



    expose_function('wire.save_like',

               "wire_save_like",

               array(

                       'entity_guid' => array ('type' => 'int'),

                   ),

               "Post a wire like",

               'POST',

               false,

               false);

               

    expose_function('wire.delete_post',

				"wire_delete_post",

				array(

						'entity_guid' => array ('type' => 'int'),

						

					),

				"Delete a wire post",

				'POST',

				false,

				false);

      

      expose_function('wire.delete_comment',

				"wire_delete_comment",

				array(

						'entity_guid' => array ('type' => 'int'),

						

					),

				"Delete a wire post",

				'POST',

				false,

				false);

	//-----------------------------------------------------



}



/**

 * Handle a web service request

 * 

 * Handles requests of format: http://site/services/api/handler/response_format/request

 * The first element after 'services/api/' is the service handler name as

 * registered by {@link register_service_handler()}.

 *

 * The remaining string is then passed to the {@link service_handler()}

 * which explodes by /, extracts the first element as the response format

 * (viewtype), and then passes the remaining array to the service handler

 * function registered by {@link register_service_handler()}.

 *

 * If a service handler isn't found, a 404 header is sent.

 * 

 * @param array $segments URL segments

 * @return bool

 */

function ws_page_handler($segments) {

	elgg_load_library('elgg:ws');



	if (!isset($segments[0]) || $segments[0] != 'api') {

		return false;

	}

	array_shift($segments);



	$handler = array_shift($segments);

	$request = implode('/', $segments);



	service_handler($handler, $request);



	return true;

}



/**

 * A global array holding API methods.

 * The structure of this is

 * 	$API_METHODS = array (

 * 		$method => array (

 * 			"description" => "Some human readable description"

 * 			"function" = 'my_function_callback'

 * 			"parameters" = array (

 * 				"variable" = array ( // the order should be the same as the function callback

 * 					type => 'int' | 'bool' | 'float' | 'string'

 * 					required => true (default) | false

 *					default => value // optional

 * 				)

 * 			)

 * 			"call_method" = 'GET' | 'POST'

 * 			"require_api_auth" => true | false (default)

 * 			"require_user_auth" => true | false (default)

 * 		)

 *  )

 */

global $API_METHODS;

$API_METHODS = array();



/** Define a global array of errors */

global $ERRORS;

$ERRORS = array();



/**

 * Expose a function as a web service.

 *

 * Limitations: Currently cannot expose functions which expect objects.

 * It also cannot handle arrays of bools or arrays of arrays.

 * Also, input will be filtered to protect against XSS attacks through the web services.

 *

 * @param string $method            The api name to expose - for example "myapi.dosomething"

 * @param string $function          Your function callback.

 * @param array  $parameters        (optional) List of parameters in the same order as in

 *                                  your function. Default values may be set for parameters which

 *                                  allow REST api users flexibility in what parameters are passed.

 *                                  Generally, optional parameters should be after required

 *                                  parameters.

 *

 *                                  This array should be in the format

 *                                    "variable" = array (

 *                                  					type => 'int' | 'bool' | 'float' | 'string' | 'array'

 *                                  					required => true (default) | false

 *                                  					default => value (optional)

 *                                  	 )

 * @param string $description       (optional) human readable description of the function.

 * @param string $call_method       (optional) Define what http method must be used for

 *                                  this function. Default: GET

 * @param bool   $require_api_auth  (optional) (default is false) Does this method

 *                                  require API authorization? (example: API key)

 * @param bool   $require_user_auth (optional) (default is false) Does this method

 *                                  require user authorization?

 *

 * @return bool

 * @throws InvalidParameterException

 */

function elgg_ws_expose_function($method, $function, array $parameters = NULL, $description = "",

		$call_method = "GET", $require_api_auth = false, $require_user_auth = false) {



	global $API_METHODS;



	if (($method == "") || ($function == "")) {

		$msg = elgg_echo('InvalidParameterException:APIMethodOrFunctionNotSet');

		throw new InvalidParameterException($msg);

	}



	// does not check whether this method has already been exposed - good idea?

	$API_METHODS[$method] = array();



	$API_METHODS[$method]["description"] = $description;



	// does not check whether callable - done in execute_method()

	$API_METHODS[$method]["function"] = $function;



	if ($parameters != NULL) {

		if (!is_array($parameters)) {

			$msg = elgg_echo('InvalidParameterException:APIParametersArrayStructure', array($method));

			throw new InvalidParameterException($msg);

		}



		// catch common mistake of not setting up param array correctly

		$first = current($parameters);

		if (!is_array($first)) {

			$msg = elgg_echo('InvalidParameterException:APIParametersArrayStructure', array($method));

			throw new InvalidParameterException($msg);

		}

	}



	if ($parameters != NULL) {

		// ensure the required flag is set correctly in default case for each parameter

		foreach ($parameters as $key => $value) {

			// check if 'required' was specified - if not, make it true

			if (!array_key_exists('required', $value)) {

				$parameters[$key]['required'] = true;

			}

		}



		$API_METHODS[$method]["parameters"] = $parameters;

	}



	$call_method = strtoupper($call_method);

	switch ($call_method) {

		case 'POST' :

			$API_METHODS[$method]["call_method"] = 'POST';

			break;

		case 'GET' :

			$API_METHODS[$method]["call_method"] = 'GET';

			break;

		default :

			$msg = elgg_echo('InvalidParameterException:UnrecognisedHttpMethod',

			array($call_method, $method));



			throw new InvalidParameterException($msg);

	}



	$API_METHODS[$method]["require_api_auth"] = $require_api_auth;



	$API_METHODS[$method]["require_user_auth"] = $require_user_auth;



	return true;

}



/**

 * Unregister a web services method

 *

 * @param string $method The api name that was exposed

 * @return void

 */

function elgg_ws_unexpose_function($method) {

	global $API_METHODS;



	if (isset($API_METHODS[$method])) {

		unset($API_METHODS[$method]);

	}

}



/**

 * Simple api to return a list of all api's installed on the system.

 *

 * @return array

 * @access private

 */

function list_all_apis() {

	global $API_METHODS;



	// sort first

	ksort($API_METHODS);



	return $API_METHODS;

}



/**

 * Registers a web services handler

 *

 * @param string $handler  Web services type

 * @param string $function Your function name

 *

 * @return bool Depending on success

 */

function elgg_ws_register_service_handler($handler, $function) {

	global $CONFIG;



	if (!isset($CONFIG->servicehandler)) {

		$CONFIG->servicehandler = array();

	}

	if (is_callable($function, true)) {

		$CONFIG->servicehandler[$handler] = $function;

		return true;

	}



	return false;

}



/**

 * Remove a web service

 * To replace a web service handler, register the desired handler over the old on

 * with register_service_handler().

 *

 * @param string $handler web services type

 * @return void

 */

function elgg_ws_unregister_service_handler($handler) {

	global $CONFIG;



	if (isset($CONFIG->servicehandler, $CONFIG->servicehandler[$handler])) {

		unset($CONFIG->servicehandler[$handler]);

	}

}



/**

 * REST API handler

 *

 * @return void

 * @access private

 *

 * @throws SecurityException|APIException

 */

function ws_rest_handler() {



	elgg_load_library('elgg:ws');



	// Register the error handler

	error_reporting(E_ALL);

	set_error_handler('_php_api_error_handler');



	// Register a default exception handler

	set_exception_handler('_php_api_exception_handler');



	// plugins should return true to control what API and user authentication handlers are registered

	if (elgg_trigger_plugin_hook('rest', 'init', null, false) == false) {

		// for testing from a web browser, you can use the session PAM

		// do not use for production sites!!

		//register_pam_handler('pam_auth_session');



		// user token can also be used for user authentication

		register_pam_handler('pam_auth_usertoken');



		// simple API key check

		register_pam_handler('api_auth_key', "sufficient", "api");

		// hmac

		register_pam_handler('api_auth_hmac', "sufficient", "api");

	}



	// Get parameter variables

	$method = get_input('method');

	$result = null;



	// this will throw an exception if authentication fails

	authenticate_method($method);



	$result = execute_method($method);





	if (!($result instanceof GenericResult)) {

		throw new APIException(elgg_echo('APIException:ApiResultUnknown'));

	}



	// Output the result

	echo elgg_view_page($method, elgg_view("api/output", array("result" => $result)));

}





////// TESTS



/**

 * Unit tests for web services

 *

 * @param string $hook   unit_test

 * @param string $type   system

 * @param mixed  $value  Array of tests

 * @param mixed  $params Params

 *

 * @return array

 * @access private

 */

function ws_unit_test($hook, $type, $value, $params) {

	elgg_load_library('elgg:ws');

	elgg_load_library('elgg:ws:client');

	$value[] = dirname(__FILE__) . '/tests/ElggCoreWebServicesApiTest.php';

	return $value;

}

function my_echo($string) {

    return $string;

}









	//=========================================================
	//=========================================================
	//====================== user =============================
	//=========================================================
	//=========================================================

	//--------- user_register -----------------------
	function user_register($name, $email, $username, $password)
	{
		$user_loggued = get_loggedin_user();
		if(!is_object($user_loggued)) 
			throw new InvalidParameterException("Forbidden : not logged in (token ?) "); 
		if(!$user_loggued->isadmin())
		{
			throw new InvalidParameterException('Forbidden : not admin');
		}
		$user = get_user_by_username($username);
		if (!$user) {
			$return['success'] = true;
			$return['guid'] = register_user($username, $password, $name, $email);
		} else {
			$return['success'] = false;
			$return['message'] = elgg_echo('registration:userexists');
		}
		return $return;
	}

	//--------- auth_getuser -----------------------
	function auth_getuser()
	{
		$user_loggued = get_loggedin_user();
		if(!is_object($user_loggued))
			throw new InvalidParameterException("Forbidden : not logged in (token ?) ");
		return $user_loggued->toObject();
	}
	
	

///////////////////// RIVER



/**

* Retrive river feed

*

* @return array $river_feed contains all information for river

*/



function site_river_feed($limit){



   //global $jsonexport;



   $user = get_loggedin_user();
   
   if(!is_object($user)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) "); 



   //return elgg_list_entities(array( 'type' => 'object' , 'subtype' => 'my_blog' ) );



      $options = array ('order_by'             => 'rv.posted desc');



   $result = elgg_get_river($options);

   foreach($result as $item)

   {

     $subject_guid = $item->subject_guid;

     $object_guid = $item->object_guid;

     $target_guid = $item->target_guid;



     if($subject_guid>0) $subject = _elgg_retrieve_cached_entity($subject_guid);

     if($object_guid>0) $object = _elgg_retrieve_cached_entity($object_guid);

     if($target_guid>0) $target = _elgg_retrieve_cached_entity($target_guid);



     if($subject_guid>0)

     {

       $item->subject = $subject->toObject();

       $item->subject->avatar_url = $subject->getIconUrl('small');

     }

     if($object_guid>0)

     {

       $item->object = $object->toObject();

       $item->object->avatar_url = $object->getIconUrl('small');



       $num_likes = elgg_get_annotations(array(

                       'annotation_names' => 'likes',

                       'guids' => $object_guid,

                       'selects' => array('e.guid', 'COUNT(*) AS cnt'),

                       'group_by' => 'e.guid',

                       'callback' => false,

               ))[0];





    $item->num_likes = is_object($num_likes) ? intval($num_likes->cnt) : 0;





       $params = array(

           'types' => 'object',

           'subtypes' => 'comment',

           'container_guid' => $object_guid,

           'limit' => 10000,

           'full_view' => FALSE,

       );

          unset($comments);

          $comments = elgg_get_entities($params);

           foreach($comments as $comment)

           {

               $comment_new = $comment->toObject();



         $owner_guid = $comment_new->owner_guid;

         $owner = _elgg_retrieve_cached_entity($owner_guid);



         $comment_new->owner = $owner->toObject();

         $comment_new->owner->avatar_url = $owner->getIconUrl('small');



         $num_likes = elgg_get_annotations(array(

                       'annotation_names' => 'likes',

                       'guids' => $comment_new->guid,

                       'selects' => array('e.guid', 'COUNT(*) AS cnt'),

                       'group_by' => 'e.guid',

                       'callback' => false,

               ))[0];





    $comment_new->num_likes = is_object($num_likes) ? intval($num_likes->cnt) : 0;



         $item->object->comments[] = $comment_new;

          }      }

     if($target_guid>0) $item->target = $target->toObject();

   }



   return $result;



}



function thewire_post($text, $access = ACCESS_PUBLIC, $wireMethod = "api", $username) {

	
	
	

	

	if(!$username) {

		$user = get_loggedin_user();

	} else {

		$user = get_user_by_username($username);

		if (!$user) {

			throw new InvalidParameterException('registration:usernamenotvalid');

		}

	}

	if(!is_object($user)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) "); 

	$return['success'] = false;

	if (empty($text)) {

		$return['message'] = elgg_echo("thewire:blank");

		return $return;

	}

	$access_id = strip_tags($access);

	$guid = thewire_save_post($text, $user->guid, $access_id, $wireMethod);

	if (!$guid) {

		$return['message'] = elgg_echo("thewire:error");

		return $return;

	}

	$return['success'] = true;

	return $return;

} 





///////////////////// GROUP



function group_join($group_guid, $username) {



   $user_loggued = get_loggedin_user();
   if(!is_object($user_loggued)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) ");

	$group = get_entity($group_guid);



	if(!$user_loggued->isadmin() && $group->owner_guid!=$user_loggued->guid)

	{

	  throw new InvalidParameterException('Forbidden : not admin and not group owner gid '.$group_guid);

	}

   

   $user = get_user_by_username($username);



   if (!$user) {

       throw new InvalidParameterException('registration:usernamenotvalid');

   }





   $return['success'] = false;

   if (($user instanceof ElggUser) && ($group instanceof ElggGroup)) {

       // join or request

       $join = false;

       /*if ($group->isPublicMembership() || $group->canEdit($user->guid)) {

           // anyone can join public groups and admins can join any group

           $join = true;

       } else {

           if (check_entity_relationship($group->guid, 'invited', $user->guid)) {

               // user has invite to closed group

               $join = true;

           }

       }*/



       $join = true;



       if ($join) {

           if (groups_join_group($group, $user)) {

               $return['success'] = true;

               $return['message'] = elgg_echo("groups:joined");

           } else {

               $return['message'] = elgg_echo("groups:cantjoin");

           }

       } else {

           add_entity_relationship($user->guid, 'membership_request', $group->guid);

           // Notify group owner

           $url = "{$CONFIG->url}mod/groups/membershipreq.php?group_guid={$group->guid}";

           $subject = elgg_echo('groups:request:subject', array(

               $user->name,

               $group->name,

           ));

           $body = elgg_echo('groups:request:body', array(

               $group->getOwnerEntity()->name,

               $user->name,

               $group->name,

               $user->getURL(),

               $url,

           ));

           if (notify_user($group->owner_guid, $user->getGUID(), $subject, $body)) {

               $return['success'] = true;

               $return['message'] = elgg_echo("groups:joinrequestmade");

           } else {

               $return['message'] = elgg_echo("groups:joinrequestnotmade");

           }

       }

   } else {

       $return['message'] = elgg_echo("groups:cantjoin");

   }

   return $return;

}





/**

* Web service to retrieve list of groups

*

* @param string $username Username

* @param string $limit    Number of users to return

* @param string $offset   Indexing offset, if any

*

* @return array

*/

function group_get_groups($context, $username, $limit, $offset){



      $user_loggued = get_loggedin_user();

      if(!is_object($user_loggued)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) "); 

	if(!$username){

		$user = get_loggedin_user();

	} else if($user_loggued->isadmin() || $user_loggued->username==$username) {

		$user = get_user_by_username($username);

	}

	else

	{

	  throw new InvalidParameterException("Forbidden : username param set but not admin or not loggued with this login"); 

	}

	


   if($context == "all"){

       $groups = elgg_get_entities(array(

                                           'types' => 'group',

                                           'limit' => $limit,

                                           'full_view' => FALSE,

                                           ));

   }

   if($context == "mine" || $context ==  "user"){

       $groups = $user->getGroups();

   }

   if($context == "owned"){

       $groups = elgg_get_entities(array(

                                           'types' => 'group',

                                           'owner_guid' => $user->guid,

                                           'limit' => $limit,

                                           'full_view' => FALSE,

                                           ));

   }

   if($context == "featured"){

       $groups = elgg_get_entities_from_metadata(array(

'metadata_name' => 'featured_group',

'metadata_value' => 'yes',

                                                       'types' => 'group',

                                                       'limit' => 10,

                                                       ));

   }





   if($groups){

   foreach($groups as $single){

       $group['guid'] = $single->guid;

 		$group['owner_guid'] = $single->owner_guid;

        $group['name'] = $single->name;

       $group['members'] = count($single->getMembers($limit=0));

       $group['avatar_url'] = get_entity_icon_url($single,'small');

       $return[] = $group;

   }

   } else {

       $msg = elgg_echo('groups:none');

       throw new InvalidParameterException($msg);

   }

   return $return;

}





/**

* The group.save API.

* This API call lets a user to create group.

*

* @param string $name group name

* @param string $briefdescription short description

* @param string $description long description

* @param string $interests tags comma separated

* @param int $group_guid GUID of group if its edit request

*

* @return bool success/fail

* @access public

*/

function group_save($name, $briefdescription, $description, $interests, $group_guid)

{

  $user = elgg_get_logged_in_user_entity();

   if(!is_object($user)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) ");



  //you can change/pass below parameters from POST

/*  $_GET['action']='groups/edit';

  $_POST['membership'] = '2';

  $_POST['activity_enable'] = 'yes';

  $_POST['blog_enable'] = 'yes';

  $_POST['forum_enable'] = 'yes';

  $_POST['pages_enable'] = 'yes';

*/



 //  $group = new ElggGroup();

 // $group->save();



  /*   $entity = new ElggEntity();

     $entity->set("type","group");

     $entity->set("type","group");

    */

    $group_guid = intval($group_guid);



    $is_new_group = $group_guid == 0;







     $group = $group_guid ? get_entity($group_guid) : new ElggGroup();

     $group->name = $name;

     $group->membership = 0;

$group->setContentAccessMode(ElggGroup::CONTENT_ACCESS_MODE_MEMBERS_ONLY);

     $group->save();



     if ($is_new_group) {



   // @todo this should not be necessary...

   elgg_set_page_owner_guid($group->guid);



   $group->join($user);

   elgg_create_river_item(array(

       'view' => 'river/group/create',

       'action_type' => 'create',

       'subject_guid' => $user->guid,

       'object_guid' => $group->guid,

   ));

     }



     return array("guid" => $group->guid);

}



function group_leave($group_guid, $username)

{

  $user_loggued = get_loggedin_user();
  if(!is_object($user_loggued)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) ");

  $group = get_entity($group_guid);



  if(!$user_loggued->isadmin() && $group->owner_guid!=$user_loggued->guid && $user_loggued->username!=$username)

  {

    throw new InvalidParameterException('Forbidden : not admin, not group owner of gid '.$group_guid." and not loggued as username");

  }

  

 if($group->guid)

 {

   if(!$username){

       $user = get_loggedin_user();

   } else {

       $user = get_user_by_username($username);

   }



   if($group->leave($user)) return true;

   else

   {

     $msg = elgg_echo('user is not a member of group '.$group->guid);

     throw new InvalidParameterException($msg);

   }



 }

 $msg = elgg_echo('Unkown group '.$group->guid);

 throw new InvalidParameterException($msg);

}



function group_delete($group_guid)

{

 $user_loggued = get_loggedin_user();
 if(!is_object($user_loggued)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) ");

 $group = get_entity($group_guid);

 if(!$user_loggued->isadmin() && $group->owner_guid!=$user_loggued->guid)

  {

    throw new InvalidParameterException('Forbidden : not admin, not group owner of gid '.$group_guid." ");

  }

 

 if($group->guid)

 {

   if($group->delete())

     return true;

   else

     return false;



 }

 else

 {

 $msg = elgg_echo('Unkown group '.$group->guid);

 throw new InvalidParameterException($msg);

 }

}



/////////////////////////////////









///////// WIRE //////////



function wire_get_posts($context, $limit = 10, $offset = 0, $username) {



	if(!$username) {

		$user = get_loggedin_user();

	} else {

		$user = get_user_by_username($username);

		if (!$user) {

			throw new InvalidParameterException('registration:usernamenotvalid');

		}

	}

	
	if(!is_object($user)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) ");
		

	if($context == "all"){

		$params = array(

			'types' => 'object',

			'subtypes' => 'thewire',

			'limit' => $limit,

			'full_view' => FALSE,

		);

		}

		if($context == "mine" || $context == "user"){

		$params = array(

			'types' => 'object',

			'subtypes' => 'thewire',

			'owner_guid' => $user->guid,

			'limit' => $limit,

			'full_view' => FALSE,

		);

		}

		$latest_wire = elgg_get_entities($params);

		

		if($context == "friends"){

		$latest_wire = get_user_friends_objects($user->guid, 'thewire', $limit, $offset);

		}



	if($latest_wire){

		foreach($latest_wire as $single ) {

			$wire['guid'] = $single->guid;

			

			$owner = get_entity($single->owner_guid);

			$wire['owner']['guid'] = $owner->guid;

			$wire['owner']['name'] = $owner->name;

			$wire['owner']['avatar_url'] = get_entity_icon_url($owner,'small');

				

			$wire['time_created'] = (int)$single->time_created;

			$wire['description'] = $single->description;

			$return[] = $wire;

		} 

	} else {

		$msg = elgg_echo('thewire:noposts');

		throw new InvalidParameterException($msg);

	}

	

	return $return;

} 









function wire_get_posts_by_container_guid($limit,$container_guid)

{



 $user_loggued = get_loggedin_user();
 if(!is_object($user_loggued)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) ");

    

    if(intval($container_guid)>0)

    {     

      $group = get_entity($container_guid);



     if(!$user_loggued->isadmin() && !($group instanceof ElggGroup))

     {

       throw new InvalidParameterException('Forbidden : not admin or not in group '.$group_guid);

     }

   }



 if($container_guid)

   $params = array(

           'types' => 'object',

           'subtypes' => 'thewire',

           'limit' => $limit,

           'container_guids' => $container_guid,

           'full_view' => FALSE,

           'no_results' => elgg_echo('thewire:noposts'),

       );

 else

    $params = array(

           'types' => 'object',

           'subtypes' => 'thewire',

           'limit' => $limit,

           'full_view' => FALSE,

           'no_results' => elgg_echo('thewire:noposts'),

       );



       $result1 = elgg_get_entities($params);

       foreach($result1 as $item)

       {

         $result[] = $item->toObject();

       }



   foreach($result as $item)

   {

     unset($owner);

     $owner_guid = $item->owner_guid;





     if($owner_guid>0) $owner = _elgg_retrieve_cached_entity($owner_guid);

     if($owner_guid>0 && !is_object($owner)) $owner = elgg_get_entities(array ('guids' => $owner_guid))[0];





    if($owner_guid>0 && is_object($owner))

     {



      $item->owner = $owner->toObject();

      $item->owner->avatar_url = $owner->getIconUrl('small');

     }

     else if($owner_guid>0) $item->owner_vide = $owner_guid;







        $num_likes = elgg_get_annotations(array(

                       'annotation_names' => 'likes',

                       'guids' => $item->guid,

                       'selects' => array('e.guid', 'COUNT(*) AS cnt'),

                       'group_by' => 'e.guid',

                       'callback' => false,

               ))[0];



         $item->num_likes = intval($num_likes->cnt);







     $params = array(

           'types' => 'object',

           'subtypes' => 'comment',

           'container_guid' => $item->guid,

           'limit' => 10000,

           'full_view' => FALSE,

       );

          unset($comments);

          $comments = elgg_get_entities($params);

          foreach($comments as $comment)

          {

         $comment_new = $comment->toObject();



         $owner_guid = $comment_new->owner_guid;

         $owner = _elgg_retrieve_cached_entity($owner_guid);

         if(!is_object($owner)) $owner = elgg_get_entities(array ('guids' => $owner_guid))[0];



         $comment_new->owner = $owner->toObject();

         $comment_new->owner->avatar_url = $owner->getIconUrl('small');



          $num_likes = elgg_get_annotations(array(

                       'annotation_names' => 'likes',

                       'guids' => $comment_new->guid,

                       'selects' => array('e.guid', 'COUNT(*) AS cnt'),

                       'group_by' => 'e.guid',

                       'callback' => false,

               ))[0];

         $comment_new->num_likes = intval($num_likes->cnt);

         $item->object->comments[] = $comment_new;

          }







   }



   return $result;

}











function wire_save_post_group($text,$group_guid)

{



   //$user = get_loggedin_user();

   $user = elgg_get_logged_in_user_entity();
    if(!is_object($user)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) ");

   $owner_guid = $user->guid;





   $groups = $user->getGroups();

   $in_group = false;

   foreach($groups as $group)

   {

     if($group_guid==$group->guid) $in_group = true;

   }

   if(!$in_group && !$user->isadmin())

   {

     $msg = elgg_echo("User ".$user->guid." not admin and not in group ".$group->guid);

     throw new InvalidParameterException($msg);

   }



   $access_collection = get_user_access_collections($group_guid)[0];



   $access_id = $access_collection->id;



   if(!$access_id)

   {

     $msg = elgg_echo("Access id not found for group ".$group->guid);

     throw new InvalidParameterException($msg);

   }



   $parent_guid = 0;

   $method = "site";

   $reshare_guid = 0;

   $guid = thewire_tools_save_post($text, $owner_guid, $access_id, $parent_guid, $method, $reshare_guid);

   return true;

}





function wire_delete_post($entity_guid)

{

    $user = elgg_get_logged_in_user_entity();
    if(!is_object($user)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) ");

    

    $entity = get_entity($entity_guid);

    

    

    try

    {

      if($user->guid!=$entity->owner_guid && !$user->isadmin())

      {

	      $msg = elgg_echo("Forbidden to delete entity ".$entity_guid);

	      throw new InvalidParameterException($msg);

      }

    }

    catch(Exception $e)

    {

      $msg = elgg_echo("Forbidden to delete entity ".$entity_guid);

	throw new InvalidParameterException($msg);

    }

    if($entity->delete()) return true;

    else return false;

}







function wire_save_comment($entity_guid,$text)

{

   $user = elgg_get_logged_in_user_entity();
   if(!is_object($user)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) ");

	

    $entity = get_entity($entity_guid);

    try

    {

      if(!has_access_to_entity($entity, $user))

      {

	      $msg = elgg_echo("Forbidden to read entity ".$entity_guid);

	      throw new InvalidParameterException($msg);

      }

    }

    catch(Exception $e)

    {

      $msg = elgg_echo("Forbidden to read entity ".$entity_guid);

	      throw new InvalidParameterException($msg);

    }

    

    if (!$entity) {

	    $msg = elgg_echo("Entity not found ".$entity_guid);

	    throw new InvalidParameterException($msg);

    }



   $comment = new ElggComment();

   $comment->title = $user->username;

   $comment->description = $text;

   $comment->owner_guid = $user->getGUID();

   $comment->container_guid = $entity->getGUID();

   $comment->access_id = $entity->access_id;

   $guid = $comment->save();



   if($guid) return $guid;

   else return false;



}



function wire_delete_comment($entity_guid)

{

    $user = elgg_get_logged_in_user_entity();
    if(!is_object($user)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) ");

    

    $entity = get_entity($entity_guid);

    

    

    try

    {

      if($user->guid!=$entity->owner_guid && !$user->isadmin())

      {

	      $msg = elgg_echo("Forbidden to delete entity ".$entity_guid);

	      throw new InvalidParameterException($msg);

      }

    }

    catch(Exception $e)

    {

      $msg = elgg_echo("Forbidden to delete entity ".$entity_guid);

	throw new InvalidParameterException($msg);

    }

    if($entity->delete()) return true;

    else return false;

}



function wire_save_like($entity_guid)

{

	$user = elgg_get_logged_in_user_entity();
	if(!is_object($user)) 
	 throw new InvalidParameterException("Forbidden : not logged in (token ?) ");
	

	$entity = get_entity($entity_guid);

	try

	{

	  if(!has_access_to_entity($entity, $user))

	  {

		  $msg = elgg_echo("Forbidden to read entity ".$entity_guid);

		  throw new InvalidParameterException($msg);

	  }

	}

	catch(Exception $e)

	{

	  $msg = elgg_echo("Forbidden to read entity ".$entity_guid);

		  throw new InvalidParameterException($msg);

	}

	

	if (!$entity) {

		$msg = elgg_echo("Entity not found ".$entity_guid);

		throw new InvalidParameterException($msg);

	}



	$user = elgg_get_logged_in_user_entity();



	$annotation_id = create_annotation($entity->guid,

								'likes',

								"likes",

								"",

								$user->guid,

								$entity->access_id);



// tell user annotation didn't work if that is the case

if ($annotation_id) return $annotation_id;

	else return false;

	

	

}



/////////////////////









