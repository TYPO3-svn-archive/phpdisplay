/***************************************************************
 *
 *  javascript functions regarding the phpdisplay extension
 *  relies on the javascript library "prototype"
 *
 *
 *  Copyright notice
 *
 *  (c) 2006-2008	Fabien Udriot <typo3@omic.ch>
 *  All rights reserved
 *
 *  This script is part of the TYPO3 t3lib/ library provided by
 *  Kasper Skaarhoj <kasper@typo3.com> together with TYPO3
 *
 *  Released under GNU/GPL (see license file in tslib/)
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 *  This copyright notice MUST APPEAR in all copies of this script
 *
 * $Id$
 ***************************************************************/

/**
 *
 * @author	Fabien Udriot
 */

var phpdisplay;

if (Prototype) {
	var phpdisplay = Class.create({

		/**
		 * Stores the datasource for performance
		 */
		records: '',

		/**
		 * Registers event listener and executes on DOM ready
		 */
		initialize: function() {

			Event.observe(document, 'dom:loaded', function(){
				// Things may happen wrong
				try {
					// Clickable links wrapping marker ###FIELD.xxx###
					$$('#phpdisplay_templateBox a').each(function(element){
						phpdisplay.initializeImages(element);
						Event.observe(element, 'click', phpdisplay.selectField);
					});

					// The 2 tab buttons
					Event.observe($('phpdisplay_tab1'), 'click', phpdisplay.showTab1);
					Event.observe($('phpdisplay_tab2'), 'click', phpdisplay.showTab2);

					// Checkbox "show json" -> displays the textarea that contains the json
					Event.observe($('phpdisplay_showJson'), 'click', phpdisplay.toggleJsonBoxVisibility);

					// Checkbox "edit json"
					Event.observe($('phpdisplay_editJson'), 'click', phpdisplay.toggleJsonBoxReadonly);

					// The save configuration button
					Event.observe($('phpdisplay_saveConfigurationBt'), 'click', phpdisplay.saveConfiguration);

					// Drop down menu that contains the different type (text - image - link - email - user)
					Event.observe($('phpdisplay_type'), 'change', phpdisplay.showSnippetBox);

					// Textarea that content the HTML template.
					Event.observe($('phpdisplay_htmlContent'), 'keyup', function(){
						tx_phpdisplay_hasChanged = true;
					});

					// Attaches event onto the snippet icon
					$$('.phpdisplay_snippetBox a').each(function(record, index){
						Event.observe($(record),'click',function(){
							var parent = $(this).parentNode;
							var type = parent.id.replace('phpdisplay_snippet','');
							var position = '';
							var thisRef = this;
							$$('#' + parent.id + ' a').each(function(linkRef, index){
								if (thisRef == linkRef) {
									position = index + 1;
								}
							});
							if ($('snippet' + type + position) != null) {
								var code = $('snippet' + type + position).innerHTML
								code = code.replace('\n<![CDATA[\n','');
								code = code.replace(']]>\n','');
								$('phpdisplay_configuration').value = code;
							}
							else {
								alert('No snippet found!')
							}

						});
					});
				}
				catch(e) {
					return;
				}
			});

		},

		/**
		 * Whenever the user has clicked on tab "mapping"
		 */
		showTab1: function() {
			// Makes sure there is content to send
			if ($('phpdisplay_htmlContent').value != '') {

				// If content has changed, sends an ajax request
				if (tx_phpdisplay_hasChanged) {

					// GUI changes
					$('phpdisplay_htmlContent').setStyle("opacity: 0.5");
					$$('#phpdisplay_html div')[0].removeClassName('phpdisplay_hidden');

					// Sends the content in an Ajax request
					new Ajax.Request("ajax.php", {
						method: "post",
						parameters: {
							"ajaxID": "phpdisplay::saveTemplate",
							"uid" : tx_phpdisplay_uid,
							"template" : $('phpdisplay_htmlContent').value
						},
						onComplete: function(xhr) {
							if (xhr.responseText != 0) {
								$('phpdisplay_tab2').parentNode.removeClassName('tabact');
								$('phpdisplay_tab1').parentNode.removeClassName('tab');
								$('phpdisplay_tab1').parentNode.addClassName('tabact');
								$('phpdisplay_mapping').removeClassName('phpdisplay_hidden');
								$('phpdisplay_html').addClassName('phpdisplay_hidden');
								$('phpdisplay_htmlContent').setStyle("opacity: 1");
								$$('#phpdisplay_html div')[0].addClassName('phpdisplay_hidden');

								// Reinject the new HTML
								$('phpdisplay_templateBox').innerHTML = xhr.responseText;

								// clickable link on marker ###FIELD.xxx###
								$$('#phpdisplay_templateBox a').each(function(element){
									phpdisplay.initializeImages(element);
									Event.observe(element, 'click', phpdisplay.selectField);
								});
								tx_phpdisplay_hasChanged = false;
							}

						}.bind(this),
						onT3Error: function(xhr) {
						//	console.log(xhr);
						}.bind(this)
					});
				}
				else {
					// Switch to the other tab
					$('phpdisplay_tab2').parentNode.removeClassName('tabact');
					$('phpdisplay_tab1').parentNode.removeClassName('tab');
					$('phpdisplay_tab1').parentNode.addClassName('tabact');
					$('phpdisplay_mapping').removeClassName('phpdisplay_hidden');
					$('phpdisplay_html').addClassName('phpdisplay_hidden');
				}
			}
			else {
				alert('No HTML content defined! Please add some one.')
			}
		},

		/**
		 * Whenever the user has clicked on tab "HTML"
		 */
		showTab2: function() {
			$('phpdisplay_tab1').parentNode.removeClassName('tabact');
			this.parentNode.removeClassName('tab');
			this.parentNode.addClassName('tabact');
			$('phpdisplay_mapping').addClassName('phpdisplay_hidden');
			$('phpdisplay_html').removeClassName('phpdisplay_hidden');
		},

		/**
		 * Shows the right snippet box, according to the value
		 */
		showSnippetBox: function(type){
			if (typeof(type) == 'object') {
				type = this.value;
			}

			$$('.phpdisplay_snippetBox').each(function(record, index){
				record.addClassName('phpdisplay_hidden');
			});
			$('phpdisplay_snippet' + type).removeClassName('phpdisplay_hidden');
		},

		/**
		 * Fetches the form informations and save them into the datasource.
		 */
		saveConfiguration: function(){

			// Cosmetic changes
			$('loadingBox').removeClassName('phpdisplay_hidden');

			var records = new Array();

			// Try parsing the existing datasource
			try{
				if($('phpdisplay_json').value != ''){
					records = $('phpdisplay_json').value.evalJSON(true);
				}
			}
			catch(error){
				alert('JSON transformation has failed!\n\n' + error)
				return;
			}

			// Get the formular value
			var offset = '';
			var content = $('phpdisplay_fields').value.split('.');
			var type = $('phpdisplay_type').value;
			var configuration = $('phpdisplay_configuration').value;
			var marker = $('phpdisplay_marker').value;
			var newRecord = '{"marker": "' + marker + '", "table": "' + content[0] + '", "field": "' + content[1] + '", "type": "' + type + '", "configuration": "' + protectJsonString(configuration) + '"}'
			newRecord = newRecord.evalJSON(true);

			// Make sure the newRecord does not exist in the datasource. If yes, remember the offset of the record for further use.
			$(records).each(function(record, index){
				if(record.marker == newRecord.marker){
					offset = index;
				}
			});

			// True, when new record => new position in the datasource
			if (typeof(offset) == 'string') {
				offset = records.length;
			}
			records[offset] = newRecord;
			//console.log(newRecord);

			// Reinject the JSON in the textarea
			//formatJson is a method from formatJson
			$('phpdisplay_json').value = formatJson(records);

			// Sends the content in an Ajax request
			new Ajax.Request("ajax.php", {
				method: "post",
				parameters: {
					"ajaxID": "phpdisplay::saveConfiguration",
					"uid" : tx_phpdisplay_uid,
					"mappings" : $('phpdisplay_json').value
				},
				onComplete: function(xhr) {
					if(xhr.responseText == 1){
						// Change the accept icon and the type icon
						var image1 = $$('img[src="' + infomodule_path + 'pencil.png"]')[0];
						var image2 = image1.nextSibling;
						//image1.src = infomodule_path + 'accept.png';
						//image1.title = 'Status: OK';
						image2.src = infomodule_path + type + '.png';
						image2.title = 'Type: ' + type;

						//$('phpdisplay_typeBox').addClassName('phpdisplay_hidden');
						//$('phpdisplay_configuationBox').addClassName('phpdisplay_hidden');
						//$('phpdisplay_configuration').value = '';
						//$('phpdisplay_fields').value = '';
						//$('phpdisplay_fields').disabled = "disabled";
						$('loadingBox').addClassName('phpdisplay_hidden');
					}

				}.bind(this),
				onT3Error: function(xhr) {
					//console.log(xhr);
				}.bind(this)
			});
		},

		toggleJsonBoxVisibility: function(){
			//phpdisplay_hidden
			if($('phpdisplay_json').className == 'phpdisplay_hidden'){
				$('phpdisplay_json').className = '';
				$('phpdisplay_editJson').className = '';
				$('phpdisplay_labelEditJson').className = '';
			}
			else{
				$('phpdisplay_json').className = 'phpdisplay_hidden';
				$('phpdisplay_editJson').className = 'phpdisplay_hidden';
				$('phpdisplay_labelEditJson').className = 'phpdisplay_hidden';
			}
		},

		toggleJsonBoxReadonly: function(){
			if($('phpdisplay_json').getAttribute('readonly') == 'readonly'){
				$('phpdisplay_json').removeAttribute('readonly');
			}
			else{
				$('phpdisplay_json').setAttribute('readonly','readonly');
			}
		},

		/**
		 * Defines the images above the clickable markers. Can be exclamation.png or accept.png.
		 * And defines the image type at the right site (text.png - image.png - linkToDetail.png - linkToFile.png - linkToPage.png - email.png)
		 */
		initializeImages: function(element){
			// Extract the field name
			// 2 possible cases: either it is an OBJECT => no mapping with field, or it is FIELD => mapping
			if (element.innerHTML.search('OBJECT.') > -1) {
				var pattern = /#{3}OBJECT\.([0-9a-zA-Z\_\-\.]+)#{3}/g;
			}
			else {
				var pattern = /#{3}FIELD\.([0-9a-zA-Z\_\-\.]+)#{3}/g;
			}
			var field = element.innerHTML.replace(pattern,'$1');
			
			// Extract the table name's field
			var table = '';

			// Get a reference of the first image. (accept.png || exclamation.png)
			var image = $(element.nextSibling)

			// Add a little mark in order to be able to split the content in the right place
			image.src = '';
			var content = $$('#phpdisplay_templateBox')[0].innerHTML.split('src=""');
			content = content[0].split(/LOOP *\(/);
			if(typeof(content[content.length - 1] == 'string')){
				content = content[content.length - 1].split(/#{3}/);
				table = content[0];
			}

			// True, when no JSON information is available -> put an empty icon
			if($('phpdisplay_json').value == ''){
				image.src = infomodule_path + 'exclamation.png';
				image.title = 'Status: not matched'
				return;
			}

			// Fetch the records and store them for performance
			if(phpdisplay.records == ''){
				try{
					phpdisplay.records = $('phpdisplay_json').value.evalJSON(true);
				}
				catch(error){
					alert('JSON transformation has failed!\n You should check the datasource \n' + error)
					return;
				}
			}

			// Make sure the newRecord does not exist in the datasource. If yes, remember the offset of the record for further use.
			var type = '';
			$(phpdisplay.records).each(function(record, index){
				if(record.marker == 'FIELD.' + field || record.marker == 'OBJECT.' + field){
					type = record.type;
				}
			});

			// Puts the right icon wheter a marker is defined or not
			if(type != ''){
				image.src = infomodule_path + 'accept.png';
				image.title = 'Status: OK';

				// Puts an other icon according to the type of the link
				$(image.nextSibling).src = infomodule_path + type + '.png';
				$(image.nextSibling).title = 'Type: ' + type;
			}
			else{
				image.src = infomodule_path + 'exclamation.png';
				image.title = 'Status: not matched';
			}
		},

		/**
		 * Try to guess an association between a field and a marker. When a field is found, do a few things
		 *
		 * 1) Sets the correct value for dropdown menu phpdisplay_type
		 * 2) Changes the icon above the marker
		 * 3) Shows the right snippetbox
		 */
		selectField: function(){

			// 2 possible cases: either it is an OBJECT => no mapping with field, or it is FIELD => mapping
			if (this.innerHTML.search('OBJECT.') > -1) {
				$('phpdisplay_fieldBox').addClassName('phpdisplay_hidden');
				var markerType = 'OBJECT';
				var pattern = /#{3}OBJECT\.([0-9a-zA-Z\_\-\.]+)#{3}/g;
			}
			else {
				$('phpdisplay_fieldBox').removeClassName('phpdisplay_hidden');
				var markerType = 'FIELD';
				var pattern = /#{3}FIELD\.([0-9a-zA-Z\_\-\.]+)#{3}/g;
			}

			// Resets the local datasource
			phpdisplay.records = '';

			// Cosmetic: add an editing icon above the marker
			$$('#phpdisplay_templateBox a').each(function(element){
				phpdisplay.initializeImages(element);
			});
			$(this).next().src = infomodule_path + 'pencil.png';
			$(this).next().title = 'Status: editing';

			// Extract the field name
			var field = this.innerHTML.replace(pattern,'$1');

			// Extract the table name's field
			var content = $$('#phpdisplay_templateBox')[0].innerHTML.split('phpdisplay/resources/images/pencil.png');
			content = content[0].split(/LOOP *\(/);

			var table = '';
			if(typeof(content[content.length - 1] == 'string')){
				content = content[content.length - 1].split(/\) *--&gt;/);
				table = content[0];
			}

			// means the table was not successfully guessed
			if (table == '' || table.search(' ') != -1) {
				table = tx_phpdisplay_defaultTable;
			}

			var marker = markerType + '.' + field;
			$$('#phpdisplay_marker')[0].value = marker;

			// Show the other boxes that were previously hidden (configuration box - dropdown menu type etc...)
			$('phpdisplay_fields').disabled = "";
			$('phpdisplay_typeBox').removeClassName('phpdisplay_hidden');
			$('phpdisplay_configuationBox').removeClassName('phpdisplay_hidden');

			// Makes sure the JSON != null, otherwise it will generate an error
			if ($('phpdisplay_json').value.length == 0) {
				$('phpdisplay_json').value = '[]';
			}

			var currentRecord = '';
			records = $('phpdisplay_json').value.evalJSON(true);
			// Tries to find out which field has been clicked
			$(records).each(function(record, index){
				if(record.marker == marker){
					currentRecord = record;
				}
			});

			// Select the right entry in the select drop down
			if(typeof(currentRecord) == 'object'){
				$$('#phpdisplay_fields')[0].value = currentRecord.table + '.' + currentRecord.field;
			}
			else if(table != '' && field != ''){
				$$('#phpdisplay_fields')[0].value = table + '.' + field;
			}
			else{
				$$('#phpdisplay_fields')[0].value = '';
			}

			// currentRecord is a reference to the ###FIELD.xxx###
			if(typeof(currentRecord) == 'object'){
				$('phpdisplay_type').value = currentRecord.type;
				$('phpdisplay_configuration').value = currentRecord.configuration;

				// (Cosmetic) Displays the right snippet Box
				phpdisplay.showSnippetBox(currentRecord.type);
			}
			// means the field has not been found for some reasons
			else{
				$('phpdisplay_type').value = 'text';
				$('phpdisplay_configuration').value = '';
			}

			// Makes the control panel facing the marker. (position control panel at the same line)
			// Calculates some values
			var heightDocHeader = $('typo3-docheader').getHeight();
			var controlPanelOffset = $('phpdisplay_cellLeft').cumulativeOffset().top;
			var heightScroll = $('phpdisplay_templateBox').cumulativeScrollOffset().top - 0 + heightDocHeader;

			// Moves when necessary
			if (heightScroll > controlPanelOffset) {
				var margin = heightScroll - controlPanelOffset;
				$('phpdisplay_fieldBox').setStyle({
					'marginTop': margin + 'px'
					});
			}
			else {
				$('phpdisplay_fieldBox').setStyle({
					'marginTop': '0px'
				});
			}
		}

	});

	// Initialize the object
	phpdisplay = new phpdisplay();

}
else{
	alert('Problem loading phpdisplay library. Check if Prototype is loaded')
}


