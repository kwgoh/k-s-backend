'use strict';

/* Controller for Saving and Loading of Sketch */

angular.module('app', ['ngResource']);
function SketchController($scope,$resource){
    
	// ******* PLEASE CHANGE THIS TO A GAE URL ******* //

    $scope.remote_url = "XXXXXXXX.appspot.com";
	
	// ******* PLEASE CHANGE THIS TO A GAE URL ******* //
		
    $scope.showdetails = false;
    $scope.apikey = "Test";
	
    $scope.waiting = "Ready";
	
	//User
	$scope.name = "Anonymous User"; //Placeholder value
    
    //Sketch
    $scope.sketchId = "";  //Placeholder value for sketchId (identifies all sub-versions of the same sketch)
    $scope.version = "";  //Placeholder value for version (identifies version of sketch - starts at "1" unless existing sketch is loaded).
  	$scope.fileData = "";  //Placeholder value for fileData (saved data)
   	$scope.fileName = "";  //Placeholder value for fileName (name file is saved under)
   	$scope.changeDescription = ""; //Placeholder value for changeDescription (change description for file edits)
	
   	//Current Id
   	$scope.search = "";
    
    //resource calls are defined here

    $scope.Model = $resource('http://:remote_url/:apikey/:model_type/:id',
                            {},{'get': {method: 'JSONP', isArray: false, params:{callback: 'JSON_CALLBACK'}}
                               }
                        );
       	
	$scope.saveAs = function() { //Saving new file
	   	
		$scope.fileData = $scope.fileData.replace(/(\r\n|\n|\r)/gm," ");
		document.getElementById('visibleTextData').value = "";
		
		//These values will be appended in the database.
		$scope.item.data.sketchId = "";	
		$scope.item.data.version = parseInt("1", 10);
		
		
		$scope.item.data.original = $scope.sketchId + ":" + $scope.version;
		
		$scope.item.data.owner = $scope.name;
		$scope.item.data.fileName = $scope.fileName;
		$scope.item.data.fileData = $scope.fileData;
		$scope.item.data.changeDescription = $scope.changeDescription;
		$scope.item.data.permissions = ""; //Placeholder value;
		
	   	$scope.setMeta($scope.item.data.sketchId, $scope.item.data.version, $scope.item.data.owner, $scope.item.data.fileName, $scope.item.data.permissions);
		$scope.changeDescription = "" //Clears placeholder before next load.
		
		//$scope.updateSketchId("sketchId");
		$scope.add("sketch");
	}
	
	$scope.save = function() { //Save new version of existing file
		$scope.fileData = $scope.fileData.replace(/(\r\n|\n|\r)/gm," ");
		document.getElementById('visibleTextData').value = "";
		
		$scope.item.data.sketchId = $scope.sketchId;
		$scope.item.data.version = parseInt($scope.version, 10) + 1;
		$scope.item.data.original = $scope.sketchId + ":" + $scope.version; 
		$scope.item.data.owner = $scope.owner;
		$scope.item.data.fileName = $scope.fileName;
		$scope.item.data.fileData = $scope.fileData;
		$scope.item.data.changeDescription = $scope.changeDescription;
		$scope.item.data.permissions = $scope.permissions; //Placeholder value;
		
	   	$scope.setMeta($scope.item.data.sketchId, $scope.item.data.version, $scope.item.data.owner, $scope.item.data.fileName, $scope.item.data.permissions);
		$scope.changeDescription = "" //Clears placeholder before next load.
		
		$scope.add("sketch");		
	}
   
	$scope.setMeta = function(sketchId, version, owner, fileName, permissions) {
		$scope.sketchId = sketchId;
		$scope.version = version;
		$scope.owner = owner;
		$scope.fileName = fileName;
		$scope.permissions = permissions;
	}
	
	$scope.setData = function(fileData) {
		$scope.fileData = fileData;
	}
	
	$scope.setName = function(l) {
		$scope.name = l.displayName;
		$scope.etag = l.result;
	}


  $scope.item = {};
  $scope.item.currentId = "";
  $scope.item.data = {"sketchId":"", "version":"", "original":"", "owner":"", "fileName":"", "fileData":"", "changeDescription":"", "permissions":""};
  
  //Generic model resource calls. Pass model-type.
  
  $scope.add = function(m_type){
    $scope.SaveResource = $resource('http://:remote_url/:apikey/:model', 
                  {"remote_url":$scope.remote_url,"apikey":$scope.apikey,"model":m_type}, 
                  {'save': { method: 'POST',    params: {} }});
 
    $scope.waiting = "Loading";
    var item = new $scope.SaveResource($scope.item.data);
    $scope.item = item.$save(function(response) { 
            $scope.item = response;
            $scope.list(m_type);
            $scope.waiting = "Ready";
          }); 
  };
  
  //To add key/value pairs when creating new objects
  $scope.add_key_to_item = function(){
    $scope.item.data[$scope.newItemKey] = $scope.newItemValue;
    $scope.newItemKey = "";
    $scope.newItemValue = "";
  };    
  
  $scope.list = function(m_type){
    var data = {
  		  'remote_url':$scope.remote_url,
			  'model_type':m_type,
            'apikey':$scope.apikey
           }
    $scope.waiting = "Updating";       
    $scope.Model.get(data,
          function(response) { 
            $scope.items = response;
            $scope.waiting = "Ready";
          });  
  };

  $scope.list("sketch");         
}