<?php
if (!defined ('TYPO3_MODE')) {
	die ('Access denied.');
}

t3lib_extMgm::allowTableOnStandardPages('tx_phpdisplay_displays');

	// Include class for custom TCEforms field
require_once(t3lib_extMgm::extPath('phpdisplay', 'class.tx_phpdisplay_tceforms.php'));

	// TCA ctrl for new table
$TCA['tx_phpdisplay_displays'] = array(
	'ctrl' => array(
		'title'     => 'LLL:EXT:phpdisplay/locallang_db.xml:tx_phpdisplay_displays',		
		'label'     => 'title',
		'tstamp'    => 'tstamp',
		'crdate'    => 'crdate',
		'cruser_id' => 'cruser_id',
		'default_sortby' => 'ORDER BY title',
		'delete' => 'deleted',	
		'enablecolumns' => array(
			'disabled' => 'hidden',
		),
		'dynamicConfigFile' => t3lib_extMgm::extPath($_EXTKEY).'tca.php',
		'iconfile'          => t3lib_extMgm::extRelPath($_EXTKEY).'icon_tx_phpdisplay_displays.png',
	),
);



	// Add a wizard for adding a datadisplay
$addTemplateDisplayWizard = array(
						'type' => 'script',
						'title' => 'LLL:EXT:phpdisplay/locallang_db.xml:wizards.add_phpdisplay',
						'script' => 'wizard_add.php',
						'icon' => 'EXT:phpdisplay/wizard_icon.gif',
						'params' => array(
								'table' => 'tx_phpdisplay_displays',
								'pid' => '###CURRENT_PID###',
								'setValue' => 'set'
							)
						);
$TCA['tt_content']['columns']['tx_displaycontroller_consumer']['config']['wizards']['add_phpdisplay'] = $addTemplateDisplayWizard;





	// Register phpdisplay with the Display Controller as a Data Consumer
t3lib_div::loadTCA('tt_content');
$TCA['tt_content']['columns']['tx_displaycontroller_consumer']['config']['allowed'] .= ',tx_phpdisplay_displays';

	// Define the path to the static TS files
t3lib_extMgm::addStaticFile($_EXTKEY, 'static/', 'Template Display');
?>