<?php
if (!defined ('TYPO3_MODE')) {
	die ('Access denied.');
}

t3lib_extMgm::allowTableOnStandardPages('tx_phpdisplay_displays');

	// TCA ctrl for new table
$TCA['tx_phpdisplay_displays'] = array(
	'ctrl' => array(
		'title'     => 'LLL:EXT:phpdisplay/Resources/Private/Language/locallang_db.xml:tx_phpdisplay_displays',		
		'label'     => 'title',
		'tstamp'    => 'tstamp',
		'crdate'    => 'crdate',
		'cruser_id' => 'cruser_id',
		'default_sortby' => 'ORDER BY title',
		'delete' => 'deleted',	
		'enablecolumns' => array(
			'disabled' => 'hidden',
		),
		'dynamicConfigFile' => t3lib_extMgm::extPath($_EXTKEY).'Configuration/TCA/tx_phpdisplay_displays.php',
		'iconfile'          => t3lib_extMgm::extRelPath($_EXTKEY).'Resources/Public/images/tx_phpdisplay_displays.png',
	),
);


	// Add a wizard for adding a datadisplay
$addTemplateDisplayWizard = array(
						'type' => 'script',
						'title' => 'LLL:EXT:phpdisplay/Resources/Private/Language/locallang_db.xml:wizards.add_phpdisplay',
						'script' => 'wizard_add.php',
						'icon' => 'EXT:phpdisplay/Resources/Public/images/tx_phpdisplay_displays.png',
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
?>