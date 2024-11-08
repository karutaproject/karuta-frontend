// Don't modify these two next lines, it's updated automatically by the maven package commands
var karuta_version = "@project.version@";
var karuta_date = "@build.timestamp@";

const karuta_version_eportfolium = "eportfolium-3.56.1";
const karuta_date_eportfolium = "2024-11-05";

var karuta_backend_version = "?";
var karuta_backend_date = "?";
var karuta_fileserver_version = "?";
var karuta_fileserver_date = "?";

// 3.26.0 new functionality for svg report - 2024/02/22
// 3.27.0 new functionality sharing with qrcode - 2024/03/02
// 3.28.0 new functionality fontsizes added in svg report - 2024/03/02
// 3.29.0 new functionality URL2Portfolio autocompletion - 2024/03/09
// 3.30.0 Batch for-each-node enhancement  - 2024/03/15
// 3.31.0 configuration files loading  - 2024/03/16
// 3.32.0 Batch - new commands : clear-log, write-log, hide-log, reload-node, reload-unit - 2024/03/17
// 3.33.0 Change ownership search if more 200 users - 2024/03/20
// 3.34.0 Batch - Label filter on for-each-tree
// 3.35.0 Fix - CSS for media print
// 3.36.0 Report - Variable Enhancement
// 3.37.0 Feat - CSS for media print Enhancement 
// 3.38.0 Bug fixed - get_get_resource updated part of importmultiple
// 3.39.0 Bug fixed - all input texts are sanitized - script tag and javascript word are deleted
// 3.39.1 Bug fixed - get_resource - display_value did not work
// 3.40.0 Feat - get_resource and get_get_resource import multiple can use semtag+semtag2
// 3.41.0 Feat - New attribute Sharer for user
// 3.42.0 Feat - Batch Error Management
// 3.42.1 Fix  - Autoload when more than one portfolios are visible
// 3.43.0 Feat - Get_Resource - checkbox display
// 3.44.0 Feat - new function for designer : setNoceCodeWithDate(nodeid) - 2024-04-04
// 3.44.1 Fix  - error due to the JS function resourceCodecontains which had two definitions. test if value': is present or not - 2024-04-24
// 3.45.0 Feat - verification of not existing code when duplicatte or instantiate - 2024-04-24
// 3.46.0 Feat - userrole added on PUT for porfolios with multi-roles - 2024-04-24
// 3.47.0 Feat - new jquery function for report and batch : hasChildSemtagAndResourceTextContains, hasChildSemtagAndResourceTextNotEmpty - 2024-04-29
// 3.48.0 Feat - Report - Collapsable Section can be open or closed - 2024-04-28
// 3.49.0 Feat - Batch - new component : for-each-group-user - 2024-04-30
// 3.49.1 Fix  - Type Dashboard Editor - CSV rôle was missing - 2024-06-17
// 3.50.0 Feat - Multi-role - userrole in GET Node - 2024-06-17
// 3.50.1 Fix  - Batch - for-each-tree search code and label of direct child - 2024-06-19
// 3.50.2 Fix  - Get_Get_Resource - click : no pointer if not selectable - 2024-06-20
// 3.51.0 Feat - Multi-role - userrole management in direct  - 2024-06-26
// 3.51.1 Fix  - Mistyping  in user creation - 2024-06-30
// 3.52.0 Feat - Multi-role - userrole management - 2024-06-30
// 3.53.0 Feat - class with role added when select role to be able to hide some role - 2024-07-03
// 3.53.1 Fix  - if user was designer and another role in a portfolio, designer was the default role - 2024-07-09
// 3.53.2 Fix  - sometimes get-get-resource not updated - references has been changed - 2024-07-17
// 3.54.0 Feat - Batch - new function to update node comments 2024-08-03
// 3.54.1 Fix  - Public.js for multi-role management 2024-08-20
// 3.55.0 Feat - Adding Technical Support Email Subject  2024-08-26
// 3.55.1 Fix -  Get_Resource - portfolio cleancode deleted (@ in portfoliocode was deleted) 2024-09-03
// 3.56.0 Fix-Feat -  Fix type_node (username test) - Fix Get_resource (when image file is missing) - Feat - js when eltDisplayed  2024-11-01
// 3.56.1 Fix - importnode did not work with tree reference - 2024-11-05
